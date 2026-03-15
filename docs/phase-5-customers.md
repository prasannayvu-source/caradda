# Phase 5 — Customer Management

## Phase Objective
Build the full Customer Management module. Customers are captured automatically during billing (Phase 6) and viewed/managed here. The owner can search customers, view full service history per customer, and access vehicle records.

---

## Features Implemented
- Customer list page with search
- Customer detail / history page
- Vehicle records per customer
- Auto-create customer during billing (service stub)
- Customer stats (total visits, total spent)

---

## Frontend Implementation

### Pages Created
| Page | Route | File |
|---|---|---|
| Customer List | `/customers` | `src/pages/customers/CustomersPage.tsx` |
| Customer Detail | `/customers/:id` | `src/pages/customers/CustomerDetailPage.tsx` |

### UI Components
```
src/components/customers/
  CustomerCard.tsx          ← avatar, name, phone, car count, last visit
  CustomerSearchBar.tsx     ← debounced search input
  CustomerHistoryTable.tsx  ← date, service, amount, payment type rows
  VehicleTag.tsx            ← car number badge
  CustomerStatBadge.tsx     ← total visits, total spent chips
```

### Customer List Page Layout
```
CustomersPage
  ├── PageHeader "Customers"
  ├── CustomerSearchBar (debounced 300ms)
  ├── Summary: Total Customers count
  └── CustomerCard × n (grid/list)
        ├── Name + Phone
        ├── Car Numbers (VehicleTags)
        ├── Last Visit date
        └── → link to CustomerDetailPage
```

### Customer Detail Page Layout
```
CustomerDetailPage
  ├── Back Button
  ├── CustomerStatBadge (visits, total spent)
  ├── Vehicles Section
  │     └── VehicleTag × n
  └── CustomerHistoryTable
        Columns: Date | Service | Amount | Payment Method | Bill PDF
```

### State Management
```ts
// src/state/customerStore.ts
interface CustomerState {
  customers: Customer[]
  selectedCustomer: CustomerDetail | null
  searchQuery: string
  isLoading: boolean
  fetchCustomers: (query?: string) => Promise<void>
  fetchCustomerById: (id: string) => Promise<void>
}
```

### API Communication
```ts
// src/services/customerService.ts
export const getCustomers = (query?: string) =>
  apiClient.get('/customers', { params: { search: query } })

export const getCustomerById = (id: string) =>
  apiClient.get(`/customers/${id}`)

export const getCustomerHistory = (id: string) =>
  apiClient.get(`/customers/${id}/history`)

// Called internally from billing module:
export const findOrCreateCustomer = (phone: string, name: string) =>
  apiClient.post('/customers/find-or-create', { phone, name })
```

### Hooks
```ts
// src/hooks/useCustomerSearch.ts
export const useCustomerSearch = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  // triggers fetchCustomers when debouncedQuery changes
}
```

---

## Backend Implementation

### APIs Created
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `GET /customers` | GET | JWT | List all, search by name/phone |
| `GET /customers/:id` | GET | JWT | Single customer profile |
| `GET /customers/:id/history` | GET | JWT | All bills for customer |
| `POST /customers/find-or-create` | POST | JWT | Upsert customer by phone |
| `PUT /customers/:id` | PUT | JWT | Update customer name / notes |

### Request / Response

**GET `/customers?search=raj`**
```json
{
  "customers": [
    {
      "id": "uuid",
      "name": "Rajesh Kumar",
      "phone": "9876543210",
      "vehicles": ["MH12AB1234"],
      "last_visit": "2024-01-14",
      "total_visits": 8
    }
  ],
  "total": 1
}
```

**GET `/customers/:id`**
```json
{
  "id": "uuid",
  "name": "Rajesh Kumar",
  "phone": "9876543210",
  "total_visits": 8,
  "total_spent": 6400.00,
  "vehicles": [
    { "id": "uuid", "car_number": "MH12AB1234", "car_model": "Swift" }
  ],
  "created_at": "2023-06-10T10:00:00Z"
}
```

**POST `/customers/find-or-create`**
```json
// Request
{ "phone": "9876543210", "name": "Rajesh Kumar" }

// Response 200 (existing) or 201 (created)
{ "id": "uuid", "name": "Rajesh Kumar", "phone": "9876543210", "is_new": false }
```

### Service Layer (app/services/customer_service.py)
```python
def find_or_create_customer(phone: str, name: str) -> Customer:
    result = supabase.table("customers").select("*").eq("phone", phone).single().execute()
    if result.data:
        return Customer(**result.data)
    new = supabase.table("customers").insert({"phone": phone, "name": name}).execute()
    return Customer(**new.data[0])

def get_customer_history(customer_id: str) -> list[BillSummary]:
    bills = supabase.table("bills")\
        .select("id, bill_number, total_amount, payment_method, created_at, bill_items(services(name))")\
        .eq("customer_id", customer_id)\
        .order("created_at", desc=True)\
        .execute()
    return bills.data
```

### Validation Logic
- Phone: 10-digit numeric (regex: `^\d{10}$`)
- Name: 2–100 chars, letters + spaces only
- Search query: max 50 chars, sanitised

### Error Handling
- `404` if customer ID not found
- `422` for validation failures
- Duplicate phone returns existing customer (not error)

---

## Database Implementation
No new tables. Uses:
- `customers` — core fields
- `vehicles` — car numbers per customer
- `bills` — history joined via customer_id
- `bill_items` + `services` — service names in history

---

## Integration Logic
- **Billing integration (Phase 6):** `POST /customers/find-or-create` called before bill creation; returned `customer_id` embedded in bill
- **Vehicle linking:** If car number in bill doesn't exist in `vehicles` for the customer, a new vehicle record is auto-inserted

---

## Phase Relationship
- **Builds on Phase 3:** `customers`, `vehicles` tables fully defined
- **Builds on Phase 4:** Sidebar `Customers` nav link now active; customer count widget on dashboard reads from this table
- **Connects to Phase 6:** Billing calls `find-or-create`; bills appear in customer history after Phase 6
- **Connects to Phase 9:** Customer visit frequency used in reports
