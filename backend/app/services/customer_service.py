import re
from app.database.supabase_client import get_supabase_client


def _validate_phone(phone: str):
    if not re.fullmatch(r"\d{10}", phone):
        raise ValueError("Phone must be exactly 10 digits")


def list_customers(search: str = "") -> dict:
    supabase = get_supabase_client()
    query = (
        supabase.table("customers")
        .select("id, name, phone, created_at, updated_at")
        .order("created_at", desc=True)
    )
    if search:
        # ilike for case-insensitive partial match on name or phone
        query = query.or_(f"name.ilike.%{search}%,phone.ilike.%{search}%")

    result = query.execute()
    customers = result.data or []

    # Enrich each customer with vehicles + last visit + visit count
    enriched = []
    for c in customers:
        cid = c["id"]

        # Vehicles
        v_res = (
            supabase.table("vehicles")
            .select("id, car_number, car_model")
            .eq("customer_id", cid)
            .execute()
        )
        vehicles = v_res.data or []

        # Bills for last visit + total visits
        b_res = (
            supabase.table("bills")
            .select("id, created_at")
            .eq("customer_id", cid)
            .order("created_at", desc=True)
            .execute()
        )
        bills = b_res.data or []
        last_visit = bills[0]["created_at"][:10] if bills else None

        enriched.append({
            **c,
            "vehicles": [v["car_number"] for v in vehicles],
            "vehicle_details": vehicles,
            "total_visits": len(bills),
            "last_visit": last_visit,
        })

    return {"customers": enriched, "total": len(enriched)}


def get_customer_by_id(customer_id: str) -> dict | None:
    supabase = get_supabase_client()

    c_res = (
        supabase.table("customers")
        .select("*")
        .eq("id", customer_id)
        .execute()
    )
    if not c_res.data:
        return None
    customer = c_res.data[0]

    # Vehicles
    v_res = (
        supabase.table("vehicles")
        .select("*")
        .eq("customer_id", customer_id)
        .execute()
    )
    vehicles = v_res.data or []

    # Bills aggregate — total visits + total spent
    b_res = (
        supabase.table("bills")
        .select("id, total_amount")
        .eq("customer_id", customer_id)
        .execute()
    )
    bills = b_res.data or []
    total_visits = len(bills)
    total_spent = sum(float(b.get("total_amount", 0)) for b in bills)

    return {
        **customer,
        "vehicles": vehicles,
        "total_visits": total_visits,
        "total_spent": total_spent,
    }


def get_customer_history(customer_id: str) -> list:
    supabase = get_supabase_client()

    # Bills with items and service names
    b_res = (
        supabase.table("bills")
        .select(
            "id, bill_number, total_amount, payment_method, payment_status, created_at,"
            "bill_items(description, unit_price, quantity, line_total, service_id)"
        )
        .eq("customer_id", customer_id)
        .order("created_at", desc=True)
        .execute()
    )
    bills = b_res.data or []

    # Enrich each bill item with service name
    for bill in bills:
        items = bill.get("bill_items") or []
        enriched_items = []
        for item in items:
            service_name = item.get("description") or "Service"
            if item.get("service_id"):
                svc = (
                    supabase.table("services")
                    .select("name")
                    .eq("id", item["service_id"])
                    .execute()
                )
                if svc.data:
                    service_name = svc.data[0]["name"]
            enriched_items.append({**item, "service_name": service_name})
        bill["bill_items"] = enriched_items

    return bills


def find_or_create_customer(phone: str, name: str) -> dict:
    _validate_phone(phone)
    supabase = get_supabase_client()

    # Try to find existing
    result = (
        supabase.table("customers")
        .select("*")
        .eq("phone", phone)
        .execute()
    )
    if result.data:
        return {**result.data[0], "is_new": False}

    # Create new
    new = supabase.table("customers").insert({"phone": phone, "name": name}).execute()
    return {**new.data[0], "is_new": True}


def update_customer(customer_id: str, name: str | None = None) -> dict | None:
    supabase = get_supabase_client()
    patch = {}
    if name:
        patch["name"] = name
    if not patch:
        return get_customer_by_id(customer_id)

    result = (
        supabase.table("customers")
        .update(patch)
        .eq("id", customer_id)
        .execute()
    )
    if not result.data:
        return None
    return get_customer_by_id(customer_id)
