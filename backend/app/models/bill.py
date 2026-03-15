from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime


# ─── Bill Item ──────────────────────────────────────────────────
class BillItemCreate(BaseModel):
    service_id: Optional[str] = None
    description: Optional[str] = None
    quantity: int = Field(default=1, ge=1)
    unit_price: float = Field(..., gt=0)


class BillItemResponse(BillItemCreate):
    id: str
    bill_id: str
    line_total: float


# ─── Bill ───────────────────────────────────────────────────────
class BillCreate(BaseModel):
    customer_id: str
    vehicle_id: Optional[str] = None
    items: List[BillItemCreate]
    discount: float = Field(default=0.0, ge=0)
    payment_method: Literal['cash', 'upi'] = 'cash'
    payment_status: Literal['paid', 'pending'] = 'paid'
    notes: Optional[str] = None


class BillResponse(BaseModel):
    id: str
    bill_number: str
    customer_id: str
    vehicle_id: Optional[str] = None
    user_id: Optional[str] = None
    subtotal: float
    discount: float
    total_amount: float
    payment_method: str
    payment_status: str
    notes: Optional[str] = None
    items: Optional[List[BillItemResponse]] = None
    created_at: Optional[datetime] = None
