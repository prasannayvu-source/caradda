from app.database.supabase_client import get_supabase_client


def find_or_create_vehicle(customer_id: str, car_number: str) -> dict:
    """Find existing or create new vehicle for this customer."""
    supabase = get_supabase_client()

    car_number = car_number.strip().upper()

    # Look for existing
    result = (
        supabase.table("vehicles")
        .select("*")
        .eq("customer_id", customer_id)
        .eq("car_number", car_number)
        .execute()
    )
    if result.data:
        return result.data[0]

    # Create new
    new = (
        supabase.table("vehicles")
        .insert({"customer_id": customer_id, "car_number": car_number})
        .execute()
    )
    return new.data[0]
