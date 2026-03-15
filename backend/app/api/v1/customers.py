from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from app.core.security import get_current_user
from app.models.user import UserResponse
from app.services.customer_service import (
    list_customers,
    get_customer_by_id,
    get_customer_history,
    find_or_create_customer,
    update_customer,
)

router = APIRouter()


class FindOrCreateRequest(BaseModel):
    phone: str = Field(..., pattern=r"^\d{10}$")
    name: str = Field(..., min_length=2, max_length=100)


class UpdateCustomerRequest(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=100)


@router.get("/")
async def customers_list(
    search: str = Query(default="", max_length=50),
    current_user: UserResponse = Depends(get_current_user),
):
    return list_customers(search.strip())


@router.get("/{customer_id}")
async def customer_detail(
    customer_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    customer = get_customer_by_id(customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer


@router.get("/{customer_id}/history")
async def customer_history(
    customer_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    bills = get_customer_history(customer_id)
    return {"bills": bills, "total": len(bills)}


@router.post("/find-or-create", status_code=status.HTTP_200_OK)
async def find_or_create(
    payload: FindOrCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    try:
        customer = find_or_create_customer(payload.phone, payload.name)
        return customer
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))


@router.put("/{customer_id}")
async def update_customer_route(
    customer_id: str,
    payload: UpdateCustomerRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    updated = update_customer(customer_id, payload.name)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return updated
