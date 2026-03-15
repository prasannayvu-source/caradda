from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ─── Service ────────────────────────────────────────────────────
class ServiceBase(BaseModel):
    name: str
    category: Optional[str] = None
    base_price: float = 0.0
    is_active: bool = True


class ServiceCreate(ServiceBase):
    pass


class ServiceResponse(ServiceBase):
    id: str
    created_at: Optional[datetime] = None
