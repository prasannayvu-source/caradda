from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Literal
from io import BytesIO

from app.core.security import get_current_user
from app.models.user import UserResponse
from app.services.billing_service import create_bill, get_bills, get_bill_by_id
from app.services.pdf_service import generate_invoice_pdf

router = APIRouter()


# ── Request Models ───────────────────────────────────────────────────
class BillItemDto(BaseModel):
    service_id: Optional[str] = None
    description: Optional[str] = None
    quantity: int = Field(default=1, ge=1)
    unit_price: float = Field(..., gt=0)

    @field_validator("unit_price")
    @classmethod
    def round_price(cls, v: float) -> float:
        return round(v, 2)


class CreateBillRequest(BaseModel):
    customer_phone: str = Field(..., pattern=r"^\d{10}$")
    customer_name: str = Field(..., min_length=2, max_length=100)
    car_number: str = Field(..., min_length=4, max_length=15)
    items: List[BillItemDto] = Field(..., min_length=1)
    discount: float = Field(default=0.0, ge=0)
    payment_method: Literal["cash", "upi"] = "cash"
    payment_status: Literal["paid", "pending"] = "paid"
    notes: Optional[str] = None

    @field_validator("items")
    @classmethod
    def validate_items(cls, v):
        if len(v) < 1:
            raise ValueError("At least one item is required")
        return v


# ── API Routes ───────────────────────────────────────────────────────
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_new_bill(
    payload: CreateBillRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    try:
        dto = payload.model_dump()
        dto["items"] = [item.model_dump() for item in payload.items]
        result = create_bill(dto, current_user.id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/")
async def list_bills(
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    payment_method: Optional[str] = Query(None),
    payment_status: Optional[str] = Query(None),
    current_user: UserResponse = Depends(get_current_user),
):
    return get_bills(date_from, date_to, payment_method, payment_status)


@router.get("/{bill_id}")
async def bill_detail(
    bill_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    bill = get_bill_by_id(bill_id)
    if not bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found")
    return bill


@router.get("/{bill_id}/pdf")
async def download_bill_pdf(
    bill_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    try:
        pdf_bytes = generate_invoice_pdf(bill_id)
        bill = get_bill_by_id(bill_id)
        filename = f"CarAdda-{bill['bill_number']}.pdf" if bill else "invoice.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Failed to generate PDF")


@router.post("/{bill_id}/whatsapp")
async def send_whatsapp_bill(
    bill_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Send bill via WhatsApp Cloud API (if configured) or return a deep-link URL fallback.
    """
    from app.services.whatsapp_service import send_bill_whatsapp
    import urllib.parse

    bill = get_bill_by_id(bill_id)
    if not bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found")

    customer    = bill.get("customers") or {}
    phone       = customer.get("phone", "")
    bill_number = bill.get("bill_number", "")
    total       = bill.get("total_amount", 0)

    # Try real WhatsApp Cloud API first
    try:
        result = await send_bill_whatsapp(bill)
        return {
            "sent": True,
            "method": "cloud_api",
            "bill_number": bill_number,
            "wa_message_id": result.get("messages", [{}])[0].get("id"),
        }
    except ValueError:
        # WhatsApp not configured — fall back to web URL
        pass
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"WhatsApp API error: {str(e)}"
        )

    # Fallback: return WhatsApp web deep-link
    message = (
        f"Thank you for visiting CAR ADDA!\n"
        f"Bill No: {bill_number}\n"
        f"Amount: ₹{total:,.0f}\n"
        f"We look forward to serving you again. 🚗"
    )
    wa_url = f"https://wa.me/91{phone}?text={urllib.parse.quote(message)}"
    return {
        "sent": False,
        "method": "web_url",
        "whatsapp_url": wa_url,
        "phone": phone,
        "message": message,
    }
