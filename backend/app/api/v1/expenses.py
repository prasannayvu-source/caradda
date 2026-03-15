from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import date

from app.core.security import get_current_user
from app.models.user import UserResponse
from app.services import expense_service as esvc
from app.services import report_service as rsvc

router = APIRouter()

EXPENSE_CATEGORIES = Literal[
    "electricity", "water", "rent", "salary", "chemical",
    "equipment", "purchase", "transport", "maintenance", "other"
]


# ── Expense Models ────────────────────────────────────────────────────
class CreateExpenseRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    category: EXPENSE_CATEGORIES = "other"
    amount: float = Field(..., gt=0)
    expense_date: date
    description: Optional[str] = None
    notes: Optional[str] = None


class UpdateExpenseRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    category: Optional[EXPENSE_CATEGORIES] = None
    amount: Optional[float] = Field(None, gt=0)
    expense_date: Optional[date] = None
    description: Optional[str] = None
    notes: Optional[str] = None


# ── Expense Endpoints ─────────────────────────────────────────────────
@router.get("/expenses/")
async def list_expenses(
    category: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    current_user: UserResponse = Depends(get_current_user),
):
    return esvc.list_expenses(category, date_from, date_to)


@router.post("/expenses/", status_code=status.HTTP_201_CREATED)
async def create_expense(
    payload: CreateExpenseRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    data = payload.model_dump()
    data["expense_date"] = data["expense_date"].isoformat()
    return esvc.create_expense(data)


@router.put("/expenses/{expense_id}")
async def update_expense(
    expense_id: str,
    payload: UpdateExpenseRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    patch = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "expense_date" in patch and isinstance(patch["expense_date"], date):
        patch["expense_date"] = patch["expense_date"].isoformat()
    result = esvc.update_expense(expense_id, patch)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    return result


@router.delete("/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    esvc.delete_expense(expense_id)


# ── Report Endpoints ──────────────────────────────────────────────────
def _validate_date_range(from_date: str, to_date: str):
    try:
        d1 = date.fromisoformat(from_date)
        d2 = date.fromisoformat(to_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    if d1 > d2:
        raise HTTPException(status_code=400, detail="'from' must be before 'to'")
    if (d2 - d1).days > 365:
        raise HTTPException(status_code=400, detail="Date range cannot exceed 365 days")


@router.get("/reports/summary")
async def report_summary(
    from_date: str = Query(..., alias="from"),
    to_date: str = Query(..., alias="to"),
    current_user: UserResponse = Depends(get_current_user),
):
    _validate_date_range(from_date, to_date)
    return rsvc.get_summary(from_date, to_date)


@router.get("/reports/sales-chart")
async def sales_chart(
    from_date: str = Query(..., alias="from"),
    to_date: str = Query(..., alias="to"),
    current_user: UserResponse = Depends(get_current_user),
):
    _validate_date_range(from_date, to_date)
    return rsvc.get_sales_chart(from_date, to_date)


@router.get("/reports/expense-breakdown")
async def expense_breakdown(
    from_date: str = Query(..., alias="from"),
    to_date: str = Query(..., alias="to"),
    current_user: UserResponse = Depends(get_current_user),
):
    _validate_date_range(from_date, to_date)
    return rsvc.get_expense_breakdown(from_date, to_date)


@router.get("/reports/top-services")
async def top_services(
    from_date: str = Query(..., alias="from"),
    to_date: str = Query(..., alias="to"),
    current_user: UserResponse = Depends(get_current_user),
):
    _validate_date_range(from_date, to_date)
    return rsvc.get_top_services(from_date, to_date)


@router.get("/reports/export/bills")
async def export_bills(
    from_date: str = Query(..., alias="from"),
    to_date: str = Query(..., alias="to"),
    current_user: UserResponse = Depends(get_current_user),
):
    _validate_date_range(from_date, to_date)
    csv_content = rsvc.export_bills_csv(from_date, to_date)
    filename = f"caradda-bills-{from_date}-to-{to_date}.csv"
    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/reports/export/expenses")
async def export_expenses(
    from_date: str = Query(..., alias="from"),
    to_date: str = Query(..., alias="to"),
    current_user: UserResponse = Depends(get_current_user),
):
    _validate_date_range(from_date, to_date)
    csv_content = rsvc.export_expenses_csv(from_date, to_date)
    filename = f"caradda-expenses-{from_date}-to-{to_date}.csv"
    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
