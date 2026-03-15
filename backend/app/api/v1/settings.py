from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from app.core.security import get_current_user
from app.models.user import UserResponse
from app.services import settings_service as svc

router = APIRouter()


class UpdateSettingsRequest(BaseModel):
    shop_name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    logo_url: Optional[str] = None
    wa_phone_number_id: Optional[str] = None
    wa_access_token: Optional[str] = None


@router.get("/settings/")
async def get_settings(current_user: UserResponse = Depends(get_current_user)):
    return svc.get_settings()


@router.put("/settings/")
async def update_settings(
    payload: UpdateSettingsRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    return svc.update_settings(updates)
