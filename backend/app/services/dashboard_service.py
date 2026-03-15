from datetime import date, timedelta
from app.database.supabase_client import get_supabase_client


def get_today_summary() -> dict:
    supabase = get_supabase_client()
    today = date.today().isoformat()

    # Today's bills total
    bills_res = (
        supabase.table("bills")
        .select("total_amount, customer_id")
        .gte("created_at", today)
        .execute()
    )
    bills = bills_res.data or []
    today_sales = sum(float(b.get("total_amount", 0)) for b in bills)
    customers_today = len(set(b["customer_id"] for b in bills if b.get("customer_id")))

    # Today's expenses total
    exp_res = (
        supabase.table("expenses")
        .select("amount")
        .eq("expense_date", today)
        .execute()
    )
    today_expenses = sum(float(e.get("amount", 0)) for e in (exp_res.data or []))

    # Low stock count
    inv_res = supabase.table("inventory").select("id, quantity, low_stock_threshold").execute()
    low_stock_count = sum(
        1 for item in (inv_res.data or [])
        if float(item.get("quantity", 0)) <= float(item.get("low_stock_threshold", 5))
    )

    return {
        "today_sales": today_sales,
        "today_expenses": today_expenses,
        "customers_today": customers_today,
        "low_stock_count": low_stock_count,
        "date": today,
    }


def get_low_stock_items() -> list:
    supabase = get_supabase_client()
    res = supabase.table("inventory").select("*").execute()
    items = res.data or []
    return [
        {
            "id": i["id"],
            "item_name": i.get("item_name"),
            "quantity": float(i.get("quantity", 0)),
            "unit": i.get("unit"),
            "low_stock_threshold": float(i.get("low_stock_threshold", 5)),
            "category": i.get("category"),
        }
        for i in items
        if float(i.get("quantity", 0)) <= float(i.get("low_stock_threshold", 5))
    ]


def get_weekly_revenue() -> list:
    supabase = get_supabase_client()
    today = date.today()
    results = []

    for i in range(6, -1, -1):  # 7 days: 6 days ago → today
        day = today - timedelta(days=i)
        day_str = day.isoformat()
        # Using gte + lt for full-day range
        next_day = (day + timedelta(days=1)).isoformat()
        res = (
            supabase.table("bills")
            .select("total_amount")
            .gte("created_at", day_str)
            .lt("created_at", next_day)
            .execute()
        )
        revenue = sum(float(b.get("total_amount", 0)) for b in (res.data or []))
        results.append({"date": day_str, "revenue": revenue})

    return results
