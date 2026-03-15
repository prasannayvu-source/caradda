from app.database.supabase_client import get_supabase_client

# Default setting keys managed by this service
SETTING_KEYS = [
    "shop_name", "address", "phone", "email",
    "logo_url", "wa_phone_number_id", "wa_access_token"
]

DEFAULTS = {
    "shop_name": "CAR ADDA",
    "address": "",
    "phone": "",
    "email": "",
    "logo_url": "",
    "wa_phone_number_id": "",
    "wa_access_token": "",
}


def get_settings() -> dict:
    """Return all settings as a flat dict, with defaults for missing keys."""
    supabase = get_supabase_client()
    res = supabase.table("settings").select("key, value").execute()
    data = {r["key"]: r["value"] for r in (res.data or [])}

    # Merge with defaults; never expose wa_access_token value in detail
    settings = {**DEFAULTS, **data}
    # Mask token in response — only indicate if it's set
    if settings.get("wa_access_token"):
        settings["wa_access_token"] = "***configured***"

    return settings


def update_settings(updates: dict) -> dict:
    """Upsert each key into the settings table."""
    supabase = get_supabase_client()

    for key, value in updates.items():
        if key not in SETTING_KEYS:
            continue
        # Skip masked placeholder — don't overwrite real token with mask
        if key == "wa_access_token" and value == "***configured***":
            continue
        supabase.table("settings").upsert(
            {"key": key, "value": value},
            on_conflict="key"
        ).execute()

    return get_settings()


def update_logo_url(url: str) -> dict:
    """Update logo_url setting."""
    supabase = get_supabase_client()
    supabase.table("settings").upsert(
        {"key": "logo_url", "value": url},
        on_conflict="key"
    ).execute()
    return get_settings()
