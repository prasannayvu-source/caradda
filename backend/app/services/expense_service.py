from app.database.supabase_client import get_supabase_client

VALID_CATEGORIES = [
    "electricity", "water", "rent", "salary", "chemical",
    "equipment", "purchase", "transport", "maintenance", "other"
]


def list_expenses(
    category: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
) -> dict:
    supabase = get_supabase_client()

    query = (
        supabase.table("expenses")
        .select("*")
        .order("expense_date", desc=True)
    )
    if category:
        query = query.eq("category", category)
    if date_from:
        query = query.gte("expense_date", date_from)
    if date_to:
        query = query.lte("expense_date", date_to)

    result = query.execute()
    expenses = result.data or []
    total_amount = sum(float(e.get("amount", 0)) for e in expenses)

    return {"expenses": expenses, "total": len(expenses), "total_amount": total_amount}


def create_expense(data: dict) -> dict:
    supabase = get_supabase_client()
    result = supabase.table("expenses").insert(data).execute()
    return result.data[0]


def update_expense(expense_id: str, data: dict) -> dict | None:
    supabase = get_supabase_client()
    result = (
        supabase.table("expenses")
        .update(data)
        .eq("id", expense_id)
        .execute()
    )
    return result.data[0] if result.data else None


def delete_expense(expense_id: str) -> bool:
    supabase = get_supabase_client()
    supabase.table("expenses").delete().eq("id", expense_id).execute()
    return True
