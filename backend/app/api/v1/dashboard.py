from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user
from app.models.user import UserResponse
from app.services.dashboard_service import (
    get_today_summary,
    get_low_stock_items,
    get_weekly_revenue,
)

router = APIRouter()


@router.get("/summary")
async def dashboard_summary(current_user: UserResponse = Depends(get_current_user)):
    try:
        return get_today_summary()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/low-stock")
async def dashboard_low_stock(current_user: UserResponse = Depends(get_current_user)):
    try:
        items = get_low_stock_items()
        return {"items": items}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/weekly-revenue")
async def dashboard_weekly_revenue(current_user: UserResponse = Depends(get_current_user)):
    try:
        data = get_weekly_revenue()
        return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
