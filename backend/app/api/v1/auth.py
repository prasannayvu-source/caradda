from fastapi import APIRouter, HTTPException, Depends, status
from app.models.user import LoginRequest, LoginResponse, UserResponse
from app.services.auth_service import login_user
from app.core.security import get_current_user

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
async def auth_login(payload: LoginRequest):
    result = login_user(payload.phone, payload.password)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone number or password",
        )
    return result


@router.get("/me", response_model=UserResponse)
async def auth_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user
