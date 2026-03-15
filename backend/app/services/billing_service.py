from datetime import datetime
from app.database.supabase_client import get_supabase_client
from app.services.customer_service import find_or_create_customer
from app.services.vehicle_service import find_or_create_vehicle
from app.services.inventory_service import auto_deduct


def generate_bill_number() -> str:
    """Uses the Postgres sequence function for guaranteed uniqueness."""
    supabase = get_supabase_client()
    result = supabase.rpc("get_next_bill_number").execute()
    return result.data


def create_bill(dto: dict, user_id: str) -> dict:
    supabase = get_supabase_client()

    # 1. Find or create customer
    customer = find_or_create_customer(dto["customer_phone"], dto["customer_name"])
    customer_id = customer["id"]

    # 2. Find or create vehicle
    vehicle = find_or_create_vehicle(customer_id, dto["car_number"])
    vehicle_id = vehicle["id"]

    # 3. Calculate totals
    items = dto.get("items", [])
    subtotal = sum(float(i["unit_price"]) * int(i.get("quantity", 1)) for i in items)
    discount = float(dto.get("discount", 0))
    total = max(0.0, subtotal - discount)

    # 4. Generate bill number
    bill_number = generate_bill_number()

    # 5. Insert bill
    bill_payload = {
        "bill_number": bill_number,
        "customer_id": customer_id,
        "vehicle_id": vehicle_id,
        "user_id": user_id,
        "subtotal": subtotal,
        "discount": discount,
        "total_amount": total,
        "payment_method": dto.get("payment_method", "cash"),
        "payment_status": dto.get("payment_status", "paid"),
        "notes": dto.get("notes"),
    }
    bill_res = supabase.table("bills").insert(bill_payload).execute()
    bill = bill_res.data[0]
    bill_id = bill["id"]

    # 6. Insert bill items
    item_rows = [
        {
            "bill_id": bill_id,
            "service_id": i.get("service_id"),
            "description": i.get("description"),
            "quantity": int(i.get("quantity", 1)),
            "unit_price": float(i["unit_price"]),
        }
        for i in items
    ]
    supabase.table("bill_items").insert(item_rows).execute()

    # 7. Insert payment record
    supabase.table("payments").insert({
        "bill_id": bill_id,
        "amount": total,
        "payment_method": dto.get("payment_method", "cash"),
    }).execute()

    # 8. Auto-deduct inventory (non-blocking)
    try:
        auto_deduct(items, bill_id)
    except Exception:
        pass  # Never block bill creation due to inventory errors

    return {
        "id": bill_id,
        "bill_number": bill_number,
        "total_amount": total,
        "customer_id": customer_id,
        "vehicle_id": vehicle_id,
        "created_at": bill.get("created_at"),
    }


def get_bills(
    date_from: str | None = None,
    date_to: str | None = None,
    payment_method: str | None = None,
    payment_status: str | None = None,
) -> dict:
    supabase = get_supabase_client()

    query = (
        supabase.table("bills")
        .select(
            "id, bill_number, total_amount, payment_method, payment_status, created_at,"
            "customers(id, name, phone)"
        )
        .order("created_at", desc=True)
    )

    if date_from:
        query = query.gte("created_at", date_from)
    if date_to:
        # Add one day to make date_to inclusive
        query = query.lt("created_at", date_to + "T23:59:59")
    if payment_method:
        query = query.eq("payment_method", payment_method)
    if payment_status:
        query = query.eq("payment_status", payment_status)

    result = query.execute()
    bills = result.data or []

    total_amount = sum(float(b.get("total_amount", 0)) for b in bills)
    return {"bills": bills, "total": len(bills), "total_amount": total_amount}


def get_bill_by_id(bill_id: str) -> dict | None:
    supabase = get_supabase_client()

    bill_res = (
        supabase.table("bills")
        .select("*, customers(id, name, phone), vehicles(id, car_number, car_model)")
        .eq("id", bill_id)
        .execute()
    )
    if not bill_res.data:
        return None
    bill = bill_res.data[0]

    # Enrich items with service names
    items_res = (
        supabase.table("bill_items")
        .select("*, services(name)")
        .eq("bill_id", bill_id)
        .execute()
    )
    items = []
    for item in (items_res.data or []):
        svc = item.pop("services", None)
        items.append({
            **item,
            "service_name": svc["name"] if svc else item.get("description", "Service"),
        })

    bill["items"] = items
    return bill
