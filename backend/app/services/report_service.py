import io
import csv
from datetime import date, timedelta
from collections import defaultdict
from app.database.supabase_client import get_supabase_client


# ─── Helpers ─────────────────────────────────────────────────────────
def _to_end_of_day(d: str) -> str:
    """Convert YYYY-MM-DD to end-of-day with time for lte comparisons."""
    return f"{d}T23:59:59"


# ─── SUMMARY ─────────────────────────────────────────────────────────
def get_summary(from_date: str, to_date: str) -> dict:
    supabase = get_supabase_client()

    # Bills in range (using created_at date comparison)
    bills_res = (
        supabase.table("bills")
        .select("id, total_amount, customer_id")
        .gte("created_at", from_date)
        .lte("created_at", _to_end_of_day(to_date))
        .execute()
    )
    bills = bills_res.data or []
    total_revenue = sum(float(b.get("total_amount", 0)) for b in bills)
    unique_customers = len(set(b["customer_id"] for b in bills if b.get("customer_id")))

    # Expenses in range
    exp_res = (
        supabase.table("expenses")
        .select("amount")
        .gte("expense_date", from_date)
        .lte("expense_date", to_date)
        .execute()
    )
    expenses = exp_res.data or []
    total_expenses = sum(float(e.get("amount", 0)) for e in expenses)

    net_profit = total_revenue - total_expenses

    return {
        "period": {"from": from_date, "to": to_date},
        "total_revenue": round(total_revenue, 2),
        "total_expenses": round(total_expenses, 2),
        "net_profit": round(net_profit, 2),
        "total_customers": unique_customers,
        "total_bills": len(bills),
    }


# ─── SALES CHART ─────────────────────────────────────────────────────
def get_sales_chart(from_date: str, to_date: str) -> dict:
    supabase = get_supabase_client()

    bills_res = (
        supabase.table("bills")
        .select("total_amount, created_at")
        .gte("created_at", from_date)
        .lte("created_at", _to_end_of_day(to_date))
        .execute()
    )
    bills = bills_res.data or []

    # Aggregate by date
    daily: dict[str, float] = defaultdict(float)
    for b in bills:
        # Parse ISO date string to YYYY-MM-DD
        date_key = b["created_at"][:10]
        daily[date_key] += float(b.get("total_amount", 0))

    # Fill every date in range (even zero-revenue days)
    result = []
    current = date.fromisoformat(from_date)
    end = date.fromisoformat(to_date)
    while current <= end:
        key = current.isoformat()
        result.append({"date": key, "revenue": round(daily.get(key, 0), 2)})
        current += timedelta(days=1)

    return {"data": result}


# ─── EXPENSE BREAKDOWN ────────────────────────────────────────────────
def get_expense_breakdown(from_date: str, to_date: str) -> dict:
    supabase = get_supabase_client()

    exp_res = (
        supabase.table("expenses")
        .select("category, amount")
        .gte("expense_date", from_date)
        .lte("expense_date", to_date)
        .execute()
    )
    expenses = exp_res.data or []

    # Aggregate by category
    category_totals: dict[str, float] = defaultdict(float)
    for e in expenses:
        category_totals[e.get("category", "other")] += float(e.get("amount", 0))

    breakdown = [
        {"category": cat, "total": round(total, 2)}
        for cat, total in sorted(category_totals.items(), key=lambda x: -x[1])
    ]
    return {"breakdown": breakdown}


# ─── TOP SERVICES ─────────────────────────────────────────────────────
def get_top_services(from_date: str, to_date: str) -> dict:
    supabase = get_supabase_client()

    # Get bill IDs in range
    bills_res = (
        supabase.table("bills")
        .select("id")
        .gte("created_at", from_date)
        .lte("created_at", _to_end_of_day(to_date))
        .execute()
    )
    bill_ids = [b["id"] for b in (bills_res.data or [])]
    if not bill_ids:
        return {"services": []}

    # Get bill items with service names
    items_res = (
        supabase.table("bill_items")
        .select("service_name, quantity, line_total")
        .in_("bill_id", bill_ids)
        .execute()
    )
    items = items_res.data or []

    # Aggregate
    service_stats: dict[str, dict] = defaultdict(lambda: {"count": 0, "revenue": 0.0})
    for item in items:
        name = item.get("service_name", "Unknown")
        service_stats[name]["count"] += int(item.get("quantity", 1))
        service_stats[name]["revenue"] += float(item.get("line_total", 0))

    services = [
        {"name": name, "count": stats["count"], "revenue": round(stats["revenue"], 2)}
        for name, stats in service_stats.items()
    ]
    services.sort(key=lambda x: -x["revenue"])

    return {"services": services[:10]}  # Top 10


# ─── CSV EXPORTS ──────────────────────────────────────────────────────
def export_bills_csv(from_date: str, to_date: str) -> str:
    supabase = get_supabase_client()

    bills_res = (
        supabase.table("bills")
        .select(
            "bill_number, total_amount, payment_method, payment_status, created_at,"
            "customers(name, phone),"
            "vehicles(car_number)"
        )
        .gte("created_at", from_date)
        .lte("created_at", _to_end_of_day(to_date))
        .order("created_at", desc=True)
        .execute()
    )
    bills = bills_res.data or []

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=[
        "bill_number", "date", "customer_name", "phone",
        "car_number", "total_amount", "payment_method", "payment_status"
    ])
    writer.writeheader()
    for b in bills:
        customer = b.get("customers") or {}
        vehicle = b.get("vehicles") or {}
        writer.writerow({
            "bill_number": b.get("bill_number", ""),
            "date": b.get("created_at", "")[:10],
            "customer_name": customer.get("name", ""),
            "phone": customer.get("phone", ""),
            "car_number": vehicle.get("car_number", ""),
            "total_amount": b.get("total_amount", 0),
            "payment_method": b.get("payment_method", ""),
            "payment_status": b.get("payment_status", ""),
        })

    return output.getvalue()


def export_expenses_csv(from_date: str, to_date: str) -> str:
    supabase = get_supabase_client()

    exp_res = (
        supabase.table("expenses")
        .select("*")
        .gte("expense_date", from_date)
        .lte("expense_date", to_date)
        .order("expense_date", desc=True)
        .execute()
    )
    expenses = exp_res.data or []

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=[
        "expense_date", "name", "category", "amount", "description", "notes"
    ])
    writer.writeheader()
    for e in expenses:
        writer.writerow({
            "expense_date": e.get("expense_date", ""),
            "name": e.get("name", e.get("description", "")),
            "category": e.get("category", ""),
            "amount": e.get("amount", 0),
            "description": e.get("description", ""),
            "notes": e.get("notes", ""),
        })

    return output.getvalue()
