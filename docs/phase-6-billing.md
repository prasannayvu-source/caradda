# Phase 6 — Billing System

## Phase Objective
Build the core billing engine — the most critical feature of CAR ADDA. This phase creates the full Create Bill flow, bill list view, individual bill detail with PDF generation, WhatsApp send, and print capability. Inventory auto-deduction logic is triggered here.

---

## Features Implemented
- Create Bill page (multi-service, customer lookup, car number)
- Bill list page with filters (date, payment method)
- Bill detail page
- PDF invoice generation (Python ReportLab)
- Print bill (browser print)
- Send bill via WhatsApp
- Auto-inventory deduction on bill save
- Bill number auto-generation (CA-YYYY-NNNN)
- Payment method selection (Cash / UPI)

---

## Frontend Implementation

### Pages Created
| Page | Route | File |
|---|---|---|
| Create Bill | `/billing/new` | `src/pages/billing/CreateBillPage.tsx` |
| Bill List | `/billing` | `src/pages/billing/BillListPage.tsx` |
| Bill Detail | `/billing/:id` | `src/pages/billing/BillDetailPage.tsx` |

### UI Components
```
src/components/billing/
  BillForm.tsx             ← master form wrapper
  CustomerSection.tsx      ← phone lookup + name input + car number
  ServiceSelector.tsx      ← dropdown of services + custom price override
  BillItemRow.tsx          ← service name, qty, unit price, line total
  BillSummary.tsx          ← subtotal, discount, total
  PaymentMethodToggle.tsx  ← Cash / UPI toggle
  BillCard.tsx             ← list item: bill number, customer, total, date
  BillActions.tsx          ← Print, PDF Download, WhatsApp Send buttons
```

### Create Bill Form Flow
```
1. Enter Customer Phone
   → Auto-lookup: if found, prefill name + vehicles
   → If not found: prompt for name

2. Select / Enter Car Number
   → Dropdown of customer's vehicles OR free-text new car number

3. Add Services
   → Select from service dropdown (seeded list from Phase 3)
   → Quantity input (default 1)
   → Price shown (editable for custom pricing)
   → Add multiple services

4. Bill Summary
   → Subtotal calculated live
   → Optional discount field
   → Total shown

5. Payment Method
   → Cash or UPI toggle

6. Submit → POST /billing
   → On success: redirect to /billing/:id (Bill Detail)
```

### Bill Detail Page Layout
```
BillDetailPage
  ├── Bill Number + Date
  ├── Customer Info (name, phone, car number)
  ├── Bill Items Table
  │     Columns: Service | Qty | Unit Price | Total
  ├── Bill Summary (subtotal, discount, total)
  ├── Payment Method Badge
  └── BillActions
        ├── Print Button
        ├── Download PDF Button
        └── Send WhatsApp Button
```

### State Management
```ts
// src/state/billingStore.ts
interface BillingState {
  bills: BillSummary[]
  currentBill: BillDetail | null
  draftBill: DraftBill
  filters: BillFilters
  isLoading: boolean
  createBill: (data: CreateBillDto) => Promise<string>    // returns bill id
  fetchBills: (filters?: BillFilters) => Promise<void>
  fetchBillById: (id: string) => Promise<void>
  updateDraft: (partial: Partial<DraftBill>) => void
  resetDraft: () => void
}
```

### API Communication
```ts
// src/services/billingService.ts
export const createBill = (data: CreateBillDto) =>
  apiClient.post('/billing', data)

export const getBills = (filters?: BillFilters) =>
  apiClient.get('/billing', { params: filters })

export const getBillById = (id: string) =>
  apiClient.get(`/billing/${id}`)

export const downloadBillPDF = (id: string) =>
  apiClient.get(`/billing/${id}/pdf`, { responseType: 'blob' })

export const sendWhatsApp = (id: string) =>
  apiClient.post(`/billing/${id}/whatsapp`)
```

---

## Backend Implementation

### APIs Created
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `POST /billing` | POST | JWT | Create new bill |
| `GET /billing` | GET | JWT | List bills with filters |
| `GET /billing/:id` | GET | JWT | Bill detail |
| `GET /billing/:id/pdf` | GET | JWT | Stream PDF invoice |
| `POST /billing/:id/whatsapp` | POST | JWT | Send WhatsApp message |

### Request / Response

**POST `/billing`**
```json
// Request
{
  "customer_phone": "9876543210",
  "customer_name": "Rajesh Kumar",
  "car_number": "MH12AB1234",
  "items": [
    { "service_id": "uuid", "quantity": 1, "unit_price": 800.00 },
    { "service_id": "uuid", "quantity": 1, "unit_price": 500.00 }
  ],
  "discount": 0,
  "payment_method": "cash"
}

// Response 201
{
  "id": "uuid",
  "bill_number": "CA-2024-0042",
  "total_amount": 1300.00,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**GET `/billing?date_from=2024-01-01&date_to=2024-01-31&payment_method=cash`**
```json
{
  "bills": [...],
  "total": 42,
  "total_amount": 56000.00
}
```

### Service Layer (app/services/billing_service.py)
```python
def create_bill(dto: CreateBillDto, current_user: User) -> Bill:
    # 1. Find or create customer
    customer = customer_service.find_or_create_customer(dto.customer_phone, dto.customer_name)

    # 2. Find or create vehicle
    vehicle = vehicle_service.find_or_create_vehicle(customer.id, dto.car_number)

    # 3. Calculate totals
    subtotal = sum(item.quantity * item.unit_price for item in dto.items)
    total = subtotal - dto.discount

    # 4. Generate bill number
    bill_number = generate_bill_number()  # CA-YYYY-NNNN

    # 5. Insert bill
    bill = supabase.table("bills").insert({...}).execute()

    # 6. Insert bill_items
    supabase.table("bill_items").insert([...]).execute()

    # 7. Deduct inventory
    inventory_service.auto_deduct(dto.items, bill.data[0]["id"])

    return Bill(**bill.data[0])

def generate_bill_number() -> str:
    year = datetime.now().year
    count = get_bill_count_this_year() + 1
    return f"CA-{year}-{count:04d}"
```

### Invoice PDF (app/services/pdf_service.py)
```python
def generate_invoice_pdf(bill_id: str) -> bytes:
    bill = get_bill_detail(bill_id)
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)

    # Header: CAR ADDA logo, shop address
    # Customer details block
    # Service items table (description, qty, price, total)
    # Total section with payment method
    # Footer: "Thank you for choosing CAR ADDA"

    c.save()
    return buffer.getvalue()
```

### Validation Logic
- `customer_phone`: 10-digit numeric, required
- `customer_name`: 2–100 chars, required
- `car_number`: alphanumeric, 6–15 chars
- `items`: minimum 1 item required
- `unit_price`: positive float
- `payment_method`: enum `cash` | `upi`
- `discount`: non-negative, ≤ subtotal

### Error Handling
- `422` for validation failures with field-level errors
- `404` if bill not found for detail/PDF/WhatsApp
- `500` with safe message if PDF generation fails (no stack trace exposed)

---

## Database Implementation
Uses tables from Phase 3:
- `bills` — master bill record inserted
- `bill_items` — line items inserted
- `customers` / `vehicles` — auto-created if new
- `payments` — payment record inserted
- `inventory` — quantity decremented (via `inventory_service.auto_deduct`)
- `inventory_usage` — usage record inserted per deduction

---

## Integration Logic

### Auto-Inventory Deduction
```python
def auto_deduct(bill_items: list, bill_id: str):
    for item in bill_items:
        mappings = supabase.table("service_inventory_map")\
            .select("inventory_id, qty_per_service")\
            .eq("service_id", item.service_id)\
            .execute()
        for mapping in mappings.data:
            deducted_qty = mapping["qty_per_service"] * item.quantity
            # UPDATE inventory SET quantity = quantity - deducted_qty
            # INSERT into inventory_usage
```

### WhatsApp Integration (Stub — fully implemented in Phase 10)
```python
def send_whatsapp_bill(bill_id: str):
    bill = get_bill_detail(bill_id)
    message = f"""
Hello {bill.customer_name},

Thank you for visiting CAR ADDA.
Service: {bill.service_summary}
Amount: ₹{bill.total_amount}

Bill No: {bill.bill_number}
"""
    # Phase 10: calls WhatsApp Cloud API
    whatsapp_service.send_text(bill.customer_phone, message)
```

---

## Phase Relationship
- **Builds on Phase 3:** All billing tables (`bills`, `bill_items`, `payments`) pre-created
- **Builds on Phase 5:** `find-or-create` customer called internally
- **Builds on Phase 7 (partial):** Auto-deduction calls `inventory_service.auto_deduct` (inventory CRUD built in Phase 7)
- **Enables Phase 9:** Bills data is primary source for revenue reports
- **Connects to Phase 10:** WhatsApp send and PDF download are stub-completed here, fully wired in Phase 10
