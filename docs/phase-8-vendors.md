# Phase 8 — Vendor and Purchase Management

## Phase Objective
Build the Vendor Management and Purchase recording module. When the shop owner buys supplies from a vendor, the purchase is recorded, the corresponding inventory quantity is automatically increased, and the expense is optionally linked to the expense tracker.

---

## Features Implemented
- Vendor list page (add, edit, view)
- Record new purchase (vendor, item, qty, price, date)
- Purchase history list with filters
- Auto-increase inventory on purchase record
- Vendor-wise purchase summary

---

## Frontend Implementation

### Pages Created
| Page | Route | File |
|---|---|---|
| Vendor List | `/vendors` | `src/pages/vendors/VendorsPage.tsx` |
| Add / Edit Vendor | `/vendors/new`, `/vendors/:id/edit` | `src/pages/vendors/VendorFormPage.tsx` |
| Vendor Detail | `/vendors/:id` | `src/pages/vendors/VendorDetailPage.tsx` |
| Purchase List | `/purchases` | `src/pages/vendors/PurchasesPage.tsx` |
| Record Purchase | `/purchases/new` | `src/pages/vendors/RecordPurchasePage.tsx` |

### UI Components
```
src/components/vendors/
  VendorCard.tsx             ← vendor name, phone, total purchased
  VendorForm.tsx             ← name, phone, address fields
  PurchaseForm.tsx           ← vendor select, inventory item select, qty, price, date
  PurchaseTable.tsx          ← date, vendor, item, qty, unit price, total
  VendorPurchaseSummary.tsx  ← vendor-level total spend + item breakdown
```

### Record Purchase Form Flow
```
1. Select Vendor (dropdown from vendor list, + quick-add new vendor)
2. Select Inventory Item (dropdown from inventory list)
3. Enter Quantity + Unit Price
4. Total auto-calculated (qty × price)
5. Enter Purchase Date
6. Optional: Notes
7. Submit → POST /purchases
   → Inventory auto-incremented
   → Optional: expense record created
```

### State Management
```ts
// src/state/vendorStore.ts
interface VendorState {
  vendors: Vendor[]
  selectedVendor: VendorDetail | null
  purchases: Purchase[]
  isLoading: boolean
  fetchVendors: () => Promise<void>
  fetchVendorById: (id: string) => Promise<void>
  createVendor: (data: CreateVendorDto) => Promise<void>
  updateVendor: (id: string, data: UpdateVendorDto) => Promise<void>
  recordPurchase: (data: CreatePurchaseDto) => Promise<void>
  fetchPurchases: (filters?: PurchaseFilters) => Promise<void>
}
```

### API Communication
```ts
// src/services/vendorService.ts
export const getVendors = () => apiClient.get('/vendors')
export const getVendorById = (id: string) => apiClient.get(`/vendors/${id}`)
export const createVendor = (data: CreateVendorDto) => apiClient.post('/vendors', data)
export const updateVendor = (id: string, data: UpdateVendorDto) => apiClient.put(`/vendors/${id}`, data)

export const getPurchases = (filters?: PurchaseFilters) =>
  apiClient.get('/purchases', { params: filters })
export const recordPurchase = (data: CreatePurchaseDto) =>
  apiClient.post('/purchases', data)
```

---

## Backend Implementation

### APIs Created
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `GET /vendors` | GET | JWT | List all vendors |
| `GET /vendors/:id` | GET | JWT | Vendor detail + purchase summary |
| `POST /vendors` | POST | JWT | Create vendor |
| `PUT /vendors/:id` | PUT | JWT | Update vendor |
| `GET /purchases` | GET | JWT | List purchases with date/vendor filter |
| `POST /purchases` | POST | JWT | Record purchase + update inventory |

### Request / Response

**POST `/vendors`**
```json
// Request
{ "name": "Auto Chemicals Ltd", "phone": "9988776655", "address": "Pune, MH" }
// Response 201
{ "id": "uuid", "name": "Auto Chemicals Ltd", ... }
```

**POST `/purchases`**
```json
// Request
{
  "vendor_id": "uuid",
  "inventory_id": "uuid",
  "quantity": 10.0,
  "unit_price": 150.00,
  "purchase_date": "2024-01-15",
  "notes": "Monthly restock"
}
// Response 201
{
  "id": "uuid",
  "total_price": 1500.00,
  "inventory_new_quantity": 25.0
}
```

**GET `/vendors/:id`**
```json
{
  "id": "uuid",
  "name": "Auto Chemicals Ltd",
  "phone": "9988776655",
  "total_spent": 18500.00,
  "purchases": [
    { "item": "Foam Shampoo", "qty": 10, "total": 1500.00, "date": "2024-01-15" }
  ]
}
```

### Service Layer (app/services/vendor_service.py)
```python
def record_purchase(dto: CreatePurchaseDto, user: User) -> Purchase:
    # 1. Calculate total
    total = dto.quantity * dto.unit_price

    # 2. Insert purchase record
    purchase = supabase.table("purchases").insert({
        "vendor_id": dto.vendor_id,
        "inventory_id": dto.inventory_id,
        "quantity": dto.quantity,
        "unit_price": dto.unit_price,
        "total_price": total,
        "purchase_date": dto.purchase_date.isoformat(),
        "notes": dto.notes
    }).execute()

    # 3. Increase inventory quantity
    inventory_service.add_stock(dto.inventory_id, dto.quantity)

    return Purchase(**purchase.data[0])
```

### Validation Logic
- `vendor_id`: must exist in vendors table
- `inventory_id`: must exist in inventory table
- `quantity`: must be > 0
- `unit_price`: must be > 0
- `purchase_date`: must be ≤ today (no future dates)
- `name` (vendor): 2–150 chars

### Error Handling
- `404` if vendor or inventory item not found
- `422` for validation failures
- `409` on duplicate vendor name

---

## Database Implementation
Uses tables from Phase 3:
- `vendors` — vendor CRUD
- `purchases` — purchase records
- `inventory` — quantity incremented via `inventory_service.add_stock()`

No new tables required.

---

## Integration Logic

### Inventory Auto-Increase
When `POST /purchases` is called:
1. `vendor_service.record_purchase()` inserts purchase row
2. Calls `inventory_service.add_stock(inventory_id, quantity)` — same function used in Phase 7
3. `inventory.quantity` is updated immediately

### Expense Cross-link (Optional)
- Purchase recording can optionally create an `expenses` entry with category = 'chemical_purchase'
- This prevents double entry — owner doesn't need to log both a purchase AND an expense for the same transaction
- Configuration: `auto_create_expense: boolean` in request body (default: true)

---

## Phase Relationship
- **Builds on Phase 3:** `vendors`, `purchases` tables pre-created
- **Builds on Phase 7:** Calls `inventory_service.add_stock()` to restock items after purchase
- **Connects to Phase 9:** Purchase totals and vendor spend appear in expense and cost reports
- **Future-ready:** Multi-vendor comparison and purchase order features can be added without schema changes
