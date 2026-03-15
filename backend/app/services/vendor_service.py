from app.database.supabase_client import get_supabase_client
from app.services.inventory_service import add_stock


# ─── VENDOR CRUD ────────────────────────────────────────────────────
def list_vendors() -> list:
    supabase = get_supabase_client()
    result = (
        supabase.table("vendors")
        .select("*")
        .order("name")
        .execute()
    )
    vendors = result.data or []

    # Enrich each vendor with total_spent and purchase count
    for v in vendors:
        purchases_res = (
            supabase.table("purchases")
            .select("total_price")
            .eq("vendor_id", v["id"])
            .execute()
        )
        purchases = purchases_res.data or []
        v["total_spent"] = sum(float(p.get("total_price", 0)) for p in purchases)
        v["purchase_count"] = len(purchases)

    return vendors


def get_vendor_by_id(vendor_id: str) -> dict | None:
    supabase = get_supabase_client()

    v_res = (
        supabase.table("vendors")
        .select("*")
        .eq("id", vendor_id)
        .execute()
    )
    if not v_res.data:
        return None
    vendor = v_res.data[0]

    # Purchases with inventory item names
    p_res = (
        supabase.table("purchases")
        .select("id, quantity, unit_price, total_price, purchase_date, notes, inventory(item_name, unit)")
        .eq("vendor_id", vendor_id)
        .order("purchase_date", desc=True)
        .execute()
    )
    purchases = []
    total_spent = 0.0
    for p in (p_res.data or []):
        inv = p.pop("inventory", None)
        p["item_name"] = inv["item_name"] if inv else "—"
        p["unit"] = inv["unit"] if inv else ""
        total_spent += float(p.get("total_price", 0))
        purchases.append(p)

    vendor["purchases"] = purchases
    vendor["total_spent"] = total_spent

    return vendor


def create_vendor(data: dict) -> dict:
    supabase = get_supabase_client()
    result = supabase.table("vendors").insert(data).execute()
    return result.data[0]


def update_vendor(vendor_id: str, data: dict) -> dict | None:
    supabase = get_supabase_client()
    result = (
        supabase.table("vendors")
        .update(data)
        .eq("id", vendor_id)
        .execute()
    )
    if not result.data:
        return None
    return result.data[0]


# ─── PURCHASE CRUD ──────────────────────────────────────────────────
def list_purchases(
    vendor_id: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
) -> dict:
    supabase = get_supabase_client()

    query = (
        supabase.table("purchases")
        .select(
            "id, quantity, unit_price, total_price, purchase_date, notes, created_at,"
            "vendors(id, name),"
            "inventory(id, item_name, unit)"
        )
        .order("purchase_date", desc=True)
    )

    if vendor_id:
        query = query.eq("vendor_id", vendor_id)
    if date_from:
        query = query.gte("purchase_date", date_from)
    if date_to:
        query = query.lte("purchase_date", date_to)

    result = query.execute()
    purchases = result.data or []
    total_amount = sum(float(p.get("total_price", 0)) for p in purchases)

    return {"purchases": purchases, "total": len(purchases), "total_amount": total_amount}


def record_purchase(dto: dict) -> dict:
    supabase = get_supabase_client()

    quantity = float(dto["quantity"])
    unit_price = float(dto["unit_price"])
    total = round(quantity * unit_price, 2)

    # 1. Insert purchase record
    payload = {
        "vendor_id": dto["vendor_id"],
        "inventory_id": dto["inventory_id"],
        "quantity": quantity,
        "unit_price": unit_price,
        "total_price": total,
        "purchase_date": dto["purchase_date"],
        "notes": dto.get("notes"),
    }
    purchase_res = supabase.table("purchases").insert(payload).execute()
    purchase = purchase_res.data[0]

    # 2. Increase inventory quantity
    result = add_stock(dto["inventory_id"], quantity)
    new_qty = result.get("new_quantity", 0)

    # 3. Optionally create expense record
    if dto.get("auto_create_expense", True):
        # Fetch item name for description
        inv_res = (
            supabase.table("inventory")
            .select("item_name")
            .eq("id", dto["inventory_id"])
            .execute()
        )
        item_name = inv_res.data[0]["item_name"] if inv_res.data else "Supply"

        # Fetch vendor name
        v_res = (
            supabase.table("vendors")
            .select("name")
            .eq("id", dto["vendor_id"])
            .execute()
        )
        vendor_name = v_res.data[0]["name"] if v_res.data else "Vendor"

        try:
            supabase.table("expenses").insert({
                "amount": total,
                "category": "purchase",
                "description": f"Purchase: {item_name} from {vendor_name}",
                "expense_date": dto["purchase_date"],
                "notes": dto.get("notes"),
            }).execute()
        except Exception:
            pass  # Never block purchase recording

    return {
        **purchase,
        "total_price": total,
        "inventory_new_quantity": new_qty,
    }
