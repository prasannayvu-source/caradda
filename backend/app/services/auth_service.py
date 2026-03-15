import bcrypt
from app.database.supabase_client import get_supabase_client
from app.models.user import UserInDB, UserResponse
from app.core.security import create_access_token


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )


def get_user_by_phone(phone: str) -> UserInDB | None:
    supabase = get_supabase_client()
    result = (
        supabase.table("users")
        .select("id, name, phone, hashed_password, role, created_at, updated_at")
        .eq("phone", phone)
        .execute()
    )
    if not result.data:
        return None
    return UserInDB(**result.data[0])


def authenticate_user(phone: str, password: str) -> UserResponse | None:
    user = get_user_by_phone(phone)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return UserResponse(id=user.id, name=user.name, phone=user.phone, role=user.role)


def login_user(phone: str, password: str) -> dict | None:
    user = authenticate_user(phone, password)
    if not user:
        return None

    access_token = create_access_token(data={"sub": user.id, "phone": user.phone})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.model_dump(),
    }
