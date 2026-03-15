from fastapi import APIRouter, Depends
from typing import List
from app.models.service import ServiceResponse
from app.core.security import get_current_user
from app.models.user import UserResponse
from app.database.supabase_client import get_supabase_client

router = APIRouter()


@router.get("/", response_model=List[ServiceResponse])
async def list_services(
    current_user: UserResponse = Depends(get_current_user)
):
    supabase = get_supabase_client()
    result = (
        supabase.table("services")
        .select("*")
        .eq("is_active", True)
        .order("category")
        .execute()
    )
    return result.data


@router.get("/all", response_model=List[ServiceResponse])
async def list_all_services(
    current_user: UserResponse = Depends(get_current_user)
):
    """Returns all services including inactive — for admin management."""
    supabase = get_supabase_client()
    result = (
        supabase.table("services")
        .select("*")
        .order("category")
        .execute()
    )
    return result.data
