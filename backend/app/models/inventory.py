from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime


# ─── Inventory ──────────────────────────────────────────────────
class InventoryBase(BaseModel):
    item_name: str
    category: Optional[str] = None
    quantity: float = Field(default=0, ge=0)
    unit: Optional[str] = None
    low_stock_threshold: float = Field(default=5.0, ge=0)


class InventoryCreate(InventoryBase):
    pass


class InventoryResponse(InventoryBase):
    id: str
    last_updated: Optional[datetime] = None


# ─── Vendor ─────────────────────────────────────────────────────
class VendorBase(BaseModel):
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None


class VendorCreate(VendorBase):
    pass


class VendorResponse(VendorBase):
    id: str
    created_at: Optional[datetime] = None


# ─── Purchase ───────────────────────────────────────────────────
class PurchaseBase(BaseModel):
    vendor_id: Optional[str] = None
    inventory_id: str
    quantity: float = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)
    purchase_date: str  # date string YYYY-MM-DD
    notes: Optional[str] = None


class PurchaseCreate(PurchaseBase):
    pass


class PurchaseResponse(PurchaseBase):
    id: str
    total_price: float
    created_at: Optional[datetime] = None


# ─── Expense ─────────────────────────────────────────────────────
class ExpenseBase(BaseModel):
    name: str
    category: Optional[Literal[
        'electricity', 'water', 'chemical', 'equipment', 'salary', 'rent', 'other'
    ]] = 'other'
    amount: float = Field(..., gt=0)
    expense_date: str  # YYYY-MM-DD
    notes: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseResponse(ExpenseBase):
    id: str
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
