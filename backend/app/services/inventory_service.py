from datetime import datetime, timezone
from app.database.supabase_client import get_supabase_client


# ─────────────────────────────────────────────
#  READ
# ─────────────────────────────────────────────
def list_inventory(category: str | None = None, search: str = "") -> list:
    supabase = get_supabase_client()
    query = (
        supabase.table("inventory")
        .select("*")
        .order("item_name")
    )
    if category:
        query = query.eq("category", category)
    if search:
        query = query.ilike("item_name", f"%{search}%")

    result = query.execute()
    items = result.data or []

    # Annotate status
    for item in items:
        qty = float(item.get("quantity", 0))
        threshold = float(item.get("low_stock_threshold", 0))
        if qty <= 0:
            item["stock_status"] = "out"
        elif qty <= threshold:
            item["stock_status"] = "low"
        else:
            item["stock_status"] = "ok"

    return items


def get_item_by_id(item_id: str) -> dict | None:
    supabase = get_supabase_client()
    result = (
        supabase.table("inventory")
        .select("*")
        .eq("id", item_id)
        .execute()
    )
    if not result.data:
        return None
    item = result.data[0]
    qty = float(item.get("quantity", 0))
    threshold = float(item.get("low_stock_threshold", 0))
    item["stock_status"] = "out" if qty <= 0 else ("low" if qty <= threshold else "ok")
    return item


# ─────────────────────────────────────────────
#  CREATE / UPDATE
# ─────────────────────────────────────────────
def create_item(data: dict) -> dict:
    supabase = get_supabase_client()
    result = supabase.table("inventory").insert(data).execute()
    return result.data[0]


def update_item(item_id: str, data: dict) -> dict | None:
    supabase = get_supabase_client()
    result = (
        supabase.table("inventory")
        .update(data)
        .eq("id", item_id)
        .execute()
    )
    if not result.data:
        return None
    return result.data[0]


# ─────────────────────────────────────────────
#  STOCK MANAGEMENT
# ─────────────────────────────────────────────
def add_stock(item_id: str, quantity: float) -> dict:
    supabase = get_supabase_client()

    # Fetch current quantity
    current = (
        supabase.table("inventory")
        .select("quantity")
        .eq("id", item_id)
        .execute()
    )
    if not current.data:
        raise ValueError("Item not found")

    current_qty = float(current.data[0]["quantity"])
    new_qty = current_qty + quantity

    result = (
        supabase.table("inventory")
        .update({"quantity": new_qty, "last_updated": datetime.now(timezone.utc).isoformat()})
        .eq("id", item_id)
        .execute()
    )
    return {"id": item_id, "new_quantity": new_qty}


# ─────────────────────────────────────────────
#  USAGE HISTORY
# ─────────────────────────────────────────────
def get_usage_history(item_id: str) -> list:
    supabase = get_supabase_client()

    usage_res = (
        supabase.table("inventory_usage")
        .select("id, quantity_used, created_at, bill_id")
        .eq("inventory_id", item_id)
        .order("created_at", desc=True)
        .execute()
    )
    usage = usage_res.data or []

    # Enrich with bill numbers
    for u in usage:
        if u.get("bill_id"):
            bill_res = (
                supabase.table("bills")
                .select("bill_number")
                .eq("id", u["bill_id"])
                .execute()
            )
            u["bill_number"] = bill_res.data[0]["bill_number"] if bill_res.data else "—"
        else:
            u["bill_number"] = "—"
        u["date"] = u.get("created_at", "")[:10]

    return usage


# ─────────────────────────────────────────────
#  LOW STOCK
# ─────────────────────────────────────────────
def get_low_stock_items() -> list:
    """Used by dashboard_service and billing auto-deduct."""
    supabase = get_supabase_client()
    result = (
        supabase.table("inventory")
        .select("*")
        .order("item_name")
        .execute()
    )
    items = result.data or []
    low = []
    for item in items:
        qty = float(item.get("quantity", 0))
        threshold = float(item.get("low_stock_threshold", 0))
        if qty <= threshold:
            item["stock_status"] = "out" if qty <= 0 else "low"
            low.append(item)
    return low


# ─────────────────────────────────────────────
#  SERVICE → INVENTORY MAPPINGS
# ─────────────────────────────────────────────
def get_service_mappings() -> list:
    supabase = get_supabase_client()
    result = (
        supabase.table("service_inventory_map")
        .select("*, services(name), inventory(item_name, unit)")
        .execute()
    )
    return result.data or []


def upsert_service_mapping(service_id: str, inventory_id: str, qty_per_service: float) -> dict:
    supabase = get_supabase_client()

    # Check if mapping already exists
    existing = (
        supabase.table("service_inventory_map")
        .select("id")
        .eq("service_id", service_id)
        .eq("inventory_id", inventory_id)
        .execute()
    )

    if existing.data:
        # Update
        result = (
            supabase.table("service_inventory_map")
            .update({"qty_per_service": qty_per_service})
            .eq("id", existing.data[0]["id"])
            .execute()
        )
    else:
        # Insert
        result = (
            supabase.table("service_inventory_map")
            .insert({
                "service_id": service_id,
                "inventory_id": inventory_id,
                "qty_per_service": qty_per_service,
            })
            .execute()
        )
    return result.data[0] if result.data else {}


def delete_service_mapping(mapping_id: str) -> bool:
    supabase = get_supabase_client()
    supabase.table("service_inventory_map").delete().eq("id", mapping_id).execute()
    return True


# ─────────────────────────────────────────────
#  AUTO-DEDUCT (called by billing_service)
# ─────────────────────────────────────────────
def auto_deduct(bill_items: list, bill_id: str):
    """
    For each bill item, look up service_inventory_map and deduct
    mapped quantity. Uses Postgres RPC for atomic GREATEST(qty-n, 0).
    """
    supabase = get_supabase_client()

    for item in bill_items:
        service_id = item.get("service_id")
        quantity = float(item.get("quantity", 1))
        if not service_id:
            continue

        mappings_res = (
            supabase.table("service_inventory_map")
            .select("inventory_id, qty_per_service")
            .eq("service_id", service_id)
            .execute()
        )
        for mapping in (mappings_res.data or []):
            inv_id = mapping["inventory_id"]
            deducted_qty = float(mapping["qty_per_service"]) * quantity

            try:
                # Atomic RPC deduct
                supabase.rpc(
                    "decrement_inventory",
                    {"item_id": inv_id, "qty": deducted_qty}
                ).execute()

                # Log usage
                supabase.table("inventory_usage").insert({
                    "bill_id": bill_id,
                    "inventory_id": inv_id,
                    "quantity_used": deducted_qty,
                }).execute()
            except Exception:
                pass  # Never block bill creation
