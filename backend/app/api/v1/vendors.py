from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

from app.core.security import get_current_user
from app.models.user import UserResponse
from app.services import vendor_service as svc

router = APIRouter()

# ── Vendor models ────────────────────────────────────────────────────
class CreateVendorRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    phone: Optional[str] = Field(None, pattern=r"^\d{10}$")
    address: Optional[str] = None
    email: Optional[str] = None


class UpdateVendorRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    phone: Optional[str] = Field(None, pattern=r"^\d{10}$")
    address: Optional[str] = None
    email: Optional[str] = None


# ── Purchase model ───────────────────────────────────────────────────
class CreatePurchaseRequest(BaseModel):
    vendor_id: str
    inventory_id: str
    quantity: float = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)
    purchase_date: date
    notes: Optional[str] = None
    auto_create_expense: bool = True


# ── Vendor endpoints ─────────────────────────────────────────────────
@router.get("/vendors/")
async def list_vendors(current_user: UserResponse = Depends(get_current_user)):
    vendors = svc.list_vendors()
    return {"vendors": vendors, "total": len(vendors)}


@router.get("/vendors/{vendor_id}")
async def vendor_detail(
    vendor_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    vendor = svc.get_vendor_by_id(vendor_id)
    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found")
    return vendor


@router.post("/vendors/", status_code=status.HTTP_201_CREATED)
async def create_vendor(
    payload: CreateVendorRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    try:
        return svc.create_vendor(payload.model_dump(exclude_none=True))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.put("/vendors/{vendor_id}")
async def update_vendor(
    vendor_id: str,
    payload: UpdateVendorRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    patch = {k: v for k, v in payload.model_dump().items() if v is not None}
    result = svc.update_vendor(vendor_id, patch)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found")
    return result


# ── Purchase endpoints ───────────────────────────────────────────────
@router.get("/purchases/")
async def list_purchases(
    vendor_id: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    current_user: UserResponse = Depends(get_current_user),
):
    return svc.list_purchases(vendor_id, date_from, date_to)


@router.post("/purchases/", status_code=status.HTTP_201_CREATED)
async def record_purchase(
    payload: CreatePurchaseRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    try:
        dto = payload.model_dump()
        dto["purchase_date"] = dto["purchase_date"].isoformat()
        return svc.record_purchase(dto)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
