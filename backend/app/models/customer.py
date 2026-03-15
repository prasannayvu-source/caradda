from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ─── Customer ───────────────────────────────────────────────────
class CustomerBase(BaseModel):
    name: str
    phone: str


class CustomerCreate(CustomerBase):
    pass


class CustomerResponse(CustomerBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# ─── Vehicle ────────────────────────────────────────────────────
class VehicleBase(BaseModel):
    car_number: str
    car_model: Optional[str] = None


class VehicleCreate(VehicleBase):
    customer_id: str


class VehicleResponse(VehicleBase):
    id: str
    customer_id: str
    created_at: Optional[datetime] = None
