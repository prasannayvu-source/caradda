# Phase 7 — Inventory Management

## Phase Objective
Build the complete Inventory Management module. Shop owners can add stock, update quantities, see low-stock alerts, and view usage history. The auto-deduction logic triggered by billing (Phase 6) is completed here by providing the `inventory_service` implementation.

---

## Features Implemented
- Inventory list with category filters
- Add new inventory item
- Update stock quantity (manual top-up)
- Low-stock alert panel (global + per-item badge)
- Inventory usage history per item
- Service → Inventory mapping configuration
- Auto-deduction service implementation (finalising Phase 6 stub)

---

## Frontend Implementation

### Pages Created
| Page | Route | File |
|---|---|---|
| Inventory List | `/inventory` | `src/pages/inventory/InventoryPage.tsx` |
| Add / Edit Item | `/inventory/new`, `/inventory/:id/edit` | `src/pages/inventory/InventoryFormPage.tsx` |
| Item Detail | `/inventory/:id` | `src/pages/inventory/InventoryDetailPage.tsx` |

### UI Components
```
src/components/inventory/
  InventoryTable.tsx          ← sortable table: item, category, qty, unit, status
  InventoryRow.tsx            ← row with low-stock badge + quick-update button
  StockLevelBadge.tsx         ← green / amber / red based on qty vs threshold
  AddStockModal.tsx           ← modal to add quantity to existing item
  InventoryForm.tsx           ← add / edit item fields
  UsageHistoryTable.tsx       ← shows bill-level consumption per item
  ServiceMappingEditor.tsx    ← manage which services deduct which items
```

### Inventory List Page Layout
```
InventoryPage
  ├── PageHeader "Inventory"
  ├── Category Filter Tabs (All | Chemical | Cloth | Accessory)
  ├── Add Item Button → /inventory/new
  ├── Search/Filter Bar
  ├── InventoryTable
  │     Columns: Item Name | Category | Qty | Unit | Status | Actions
  │     Actions: + Add Stock | Edit | View History
  └── Low Stock Panel (if any items below threshold)
```

### Add Stock Modal
```tsx
<AddStockModal
  item={selectedItem}
  onConfirm={(qty) => updateStock(item.id, qty)}  // POST /inventory/:id/add-stock
/>
// Adds qty to current quantity (not replace)
```

### State Management
```ts
// src/state/inventoryStore.ts
interface InventoryState {
  items: InventoryItem[]
  selectedItem: InventoryDetail | null
  categoryFilter: string
  isLoading: boolean
  fetchInventory: (category?: string) => Promise<void>
  fetchItemById: (id: string) => Promise<void>
  addItem: (data: CreateInventoryDto) => Promise<void>
  updateItem: (id: string, data: UpdateInventoryDto) => Promise<void>
  addStock: (id: string, qty: number) => Promise<void>
}
```

### API Communication
```ts
// src/services/inventoryService.ts
export const getInventory = (category?: string) =>
  apiClient.get('/inventory', { params: { category } })

export const getInventoryById = (id: string) =>
  apiClient.get(`/inventory/${id}`)

export const createInventoryItem = (data: CreateInventoryDto) =>
  apiClient.post('/inventory', data)

export const updateInventoryItem = (id: string, data: UpdateInventoryDto) =>
  apiClient.put(`/inventory/${id}`, data)

export const addStock = (id: string, quantity: number) =>
  apiClient.post(`/inventory/${id}/add-stock`, { quantity })

export const getUsageHistory = (id: string) =>
  apiClient.get(`/inventory/${id}/usage`)

export const getServiceMappings = () =>
  apiClient.get('/inventory/service-mappings')

export const upsertServiceMapping = (data: ServiceMappingDto) =>
  apiClient.post('/inventory/service-mappings', data)
```

---

## Backend Implementation

### APIs Created
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `GET /inventory` | GET | JWT | List all items, optional category filter |
| `GET /inventory/:id` | GET | JWT | Single item detail |
| `POST /inventory` | POST | JWT | Add new item |
| `PUT /inventory/:id` | PUT | JWT | Update item metadata |
| `POST /inventory/:id/add-stock` | POST | JWT | Increase quantity |
| `GET /inventory/:id/usage` | GET | JWT | Usage history for item |
| `GET /inventory/service-mappings` | GET | JWT | All service → inventory mappings |
| `POST /inventory/service-mappings` | POST | JWT | Create/update mapping |

### Request / Response

**POST `/inventory`**
```json
// Request
{
  "item_name": "Foam Shampoo",
  "category": "chemical",
  "quantity": 10.0,
  "unit": "litre",
  "low_stock_threshold": 2.0
}
// Response 201
{ "id": "uuid", "item_name": "Foam Shampoo", ... }
```

**POST `/inventory/:id/add-stock`**
```json
// Request
{ "quantity": 5.0 }
// Response 200
{ "id": "uuid", "new_quantity": 15.0 }
```

**GET `/inventory/:id/usage`**
```json
{
  "usage": [
    { "bill_number": "CA-2024-0040", "qty_used": 0.5, "date": "2024-01-14" }
  ]
}
```

### Service Layer (app/services/inventory_service.py)
```python
def add_stock(item_id: str, quantity: float) -> InventoryItem:
    current = supabase.table("inventory").select("quantity").eq("id", item_id).single().execute()
    new_qty = current.data["quantity"] + quantity
    result = supabase.table("inventory")\
        .update({"quantity": new_qty, "last_updated": datetime.utcnow().isoformat()})\
        .eq("id", item_id).execute()
    return InventoryItem(**result.data[0])

def auto_deduct(bill_items: list[BillItemDto], bill_id: str):
    """Called by billing_service.create_bill — deducts mapped inventory for each service."""
    for item in bill_items:
        mappings = supabase.table("service_inventory_map")\
            .select("inventory_id, qty_per_service")\
            .eq("service_id", item.service_id).execute()
        for m in mappings.data:
            deduct_qty = m["qty_per_service"] * item.quantity
            # Decrement inventory
            supabase.rpc("decrement_inventory", {"item_id": m["inventory_id"], "qty": deduct_qty}).execute()
            # Log usage
            supabase.table("inventory_usage").insert({
                "bill_id": bill_id,
                "inventory_id": m["inventory_id"],
                "quantity_used": deduct_qty
            }).execute()

def get_low_stock_items() -> list[InventoryItem]:
    return supabase.table("inventory")\
        .select("*")\
        .filter("quantity", "lte", supabase.raw("low_stock_threshold"))\
        .execute().data
```

### Supabase RPC Function (Postgres)
```sql
CREATE OR REPLACE FUNCTION decrement_inventory(item_id UUID, qty NUMERIC)
RETURNS void AS $$
BEGIN
  UPDATE inventory
  SET quantity = GREATEST(quantity - qty, 0),
      last_updated = NOW()
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql;
```
> `GREATEST(..., 0)` prevents negative stock.

### Validation Logic
- `item_name`: 2–150 chars, unique (case-insensitive)
- `quantity`: non-negative float
- `unit`: enum `ml` | `litre` | `pcs` | `kg` | `gm`
- `low_stock_threshold`: positive float
- `add-stock quantity`: must be > 0

### Error Handling
- `404` if item not found
- `409` on duplicate item name
- `422` for type/validation failures

---

## Database Implementation
Uses tables from Phase 3:
- `inventory` — CRUD + quantity management
- `inventory_usage` — usage log per bill
- `service_inventory_map` — auto-deduction configuration

---

## Integration Logic
- `auto_deduct()` called by `billing_service.create_bill()` at bill save time
- Dashboard low-stock widget (`GET /dashboard/low-stock`) now calls `inventory_service.get_low_stock_items()`
- Sidebar low-stock badge updates in real-time using dashboard polling

---

## Phase Relationship
- **Builds on Phase 3:** `inventory`, `inventory_usage`, `service_inventory_map` tables pre-created
- **Completes Phase 6:** `auto_deduct` stub from billing is now fully implemented
- **Connects to Phase 8:** Purchases from vendors increase inventory quantity via `add_stock()`
- **Connects to Phase 9:** Inventory consumption data feeds into cost-of-goods analytics
