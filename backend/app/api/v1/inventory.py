from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from typing import Optional, Literal
from app.core.security import get_current_user
from app.models.user import UserResponse
from app.services import inventory_service as svc

router = APIRouter()

UNIT_ENUM = Literal["ml", "litre", "pcs", "kg", "gm"]
CATEGORY_ENUM = Literal["chemical", "cloth", "accessory", "equipment", "other"]


# ── Request models ────────────────────────────────────────────────────
class CreateInventoryItemRequest(BaseModel):
    item_name: str = Field(..., min_length=2, max_length=150)
    category: CATEGORY_ENUM = "other"
    quantity: float = Field(default=0.0, ge=0)
    unit: UNIT_ENUM = "pcs"
    low_stock_threshold: float = Field(default=1.0, gt=0)


class UpdateInventoryItemRequest(BaseModel):
    item_name: Optional[str] = Field(None, min_length=2, max_length=150)
    category: Optional[CATEGORY_ENUM] = None
    unit: Optional[UNIT_ENUM] = None
    low_stock_threshold: Optional[float] = Field(None, gt=0)


class AddStockRequest(BaseModel):
    quantity: float = Field(..., gt=0)


class ServiceMappingRequest(BaseModel):
    service_id: str
    inventory_id: str
    qty_per_service: float = Field(..., gt=0)


# ── Routes ─────────────────────────────────────────────────────────────
@router.get("/service-mappings")
async def list_service_mappings(
    current_user: UserResponse = Depends(get_current_user),
):
    return {"mappings": svc.get_service_mappings()}


@router.post("/service-mappings", status_code=status.HTTP_200_OK)
async def upsert_mapping(
    payload: ServiceMappingRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    result = svc.upsert_service_mapping(
        payload.service_id, payload.inventory_id, payload.qty_per_service
    )
    return result


@router.delete("/service-mappings/{mapping_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mapping(
    mapping_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    svc.delete_service_mapping(mapping_id)


@router.get("/")
async def inventory_list(
    category: Optional[str] = Query(None),
    search: str = Query(default="", max_length=100),
    current_user: UserResponse = Depends(get_current_user),
):
    items = svc.list_inventory(category=category or None, search=search.strip())
    low_count = sum(1 for i in items if i.get("stock_status") in ("low", "out"))
    return {"items": items, "total": len(items), "low_stock_count": low_count}


@router.get("/{item_id}")
async def inventory_detail(
    item_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    item = svc.get_item_by_id(item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_inventory_item(
    payload: CreateInventoryItemRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    try:
        result = svc.create_item(payload.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.put("/{item_id}")
async def update_inventory_item(
    item_id: str,
    payload: UpdateInventoryItemRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    patch = {k: v for k, v in payload.model_dump().items() if v is not None}
    result = svc.update_item(item_id, patch)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return result


@router.post("/{item_id}/add-stock")
async def add_stock_to_item(
    item_id: str,
    payload: AddStockRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    try:
        result = svc.add_stock(item_id, payload.quantity)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/{item_id}/usage")
async def usage_history(
    item_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    history = svc.get_usage_history(item_id)
    return {"usage": history, "total": len(history)}
