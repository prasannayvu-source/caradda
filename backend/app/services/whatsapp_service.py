import httpx
from app.database.supabase_client import get_supabase_client

WHATSAPP_API_URL = "https://graph.facebook.com/v18.0/{phone_number_id}/messages"


def get_whatsapp_settings() -> dict:
    """Fetch WhatsApp credentials from settings table."""
    supabase = get_supabase_client()
    res = (
        supabase.table("settings")
        .select("key, value")
        .in_("key", ["wa_access_token", "wa_phone_number_id", "shop_name"])
        .execute()
    )
    data = {r["key"]: r["value"] for r in (res.data or [])}
    return data


async def send_bill_whatsapp(bill: dict) -> dict:
    """
    Send a WhatsApp message with bill details to the customer.
    `bill` must contain keys from the billing_service.get_bill_by_id() response.
    """
    cfg = get_whatsapp_settings()

    access_token = cfg.get("wa_access_token")
    phone_number_id = cfg.get("wa_phone_number_id")
    shop_name = cfg.get("shop_name", "CAR ADDA")

    if not access_token or not phone_number_id:
        raise ValueError(
            "WhatsApp is not configured. Please add wa_access_token and "
            "wa_phone_number_id in Settings."
        )

    # Extract customer / vehicle / bill data
    customer = bill.get("customers") or {}
    vehicle  = bill.get("vehicles") or {}
    items    = bill.get("items") or []

    customer_name  = customer.get("name", "Customer")
    customer_phone = customer.get("phone", "")
    car_number     = vehicle.get("car_number", "—")
    bill_number    = bill.get("bill_number", "—")
    total_amount   = float(bill.get("total_amount", 0))
    payment_method = (bill.get("payment_method") or "").upper()
    bill_date      = (bill.get("created_at") or "")[:10]

    # Build a short service summary (first 2 service names)
    service_names = [i.get("service_name", "") for i in items if i.get("service_name")]
    service_summary = ", ".join(service_names[:2])
    if len(service_names) > 2:
        service_summary += f" +{len(service_names) - 2} more"

    message_body = (
        f"Hello {customer_name},\n\n"
        f"Thank you for visiting *{shop_name}*! 🚗✨\n\n"
        f"🔧 Service: {service_summary}\n"
        f"🚘 Car: {car_number.upper()}\n"
        f"💰 Amount: ₹{total_amount:,.0f}\n"
        f"🧾 Bill No: *{bill_number}*\n"
        f"📅 Date: {bill_date}\n"
        f"💳 Payment: {payment_method}\n\n"
        f"We look forward to seeing you again! 🙏\n"
        f"— Team {shop_name}"
    )

    payload = {
        "messaging_product": "whatsapp",
        "to": f"91{customer_phone}",
        "type": "text",
        "text": {"body": message_body},
    }

    url = WHATSAPP_API_URL.format(phone_number_id=phone_number_id)
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
