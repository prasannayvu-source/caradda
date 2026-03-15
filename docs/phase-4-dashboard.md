# Phase 4 — Dashboard System

## Phase Objective
Build the main Dashboard page that gives the shop owner an immediate business health overview. Aggregated live data from bills, expenses, and inventory tables is fetched and displayed in a premium dark automotive UI with KPI cards, a quick-bill button, and low-stock alerts.

---

## Features Implemented
- Dashboard KPI widgets: Today's Sales, Today's Expenses, Customers Today, Low Stock Alerts
- Quick Billing shortcut button
- Sidebar navigation (links to all future pages)
- Top bar with shop name and logout
- Responsive mobile-first layout
- Real-time data refresh (polling every 60 seconds)

---

## Frontend Implementation

### Pages Created
| Page | Route | File |
|---|---|---|
| Dashboard | `/` | `src/pages/dashboard/DashboardPage.tsx` |

### UI Components
```
src/components/dashboard/
  KpiCard.tsx            ← icon + title + value + trend
  LowStockAlert.tsx      ← list of inventory items below threshold
  QuickBillButton.tsx    ← floating action button → /billing/new
  SalesChart.tsx         ← 7-day bar chart (Recharts)

src/components/layout/
  Sidebar.tsx            ← nav links, CAR ADDA logo, mobile drawer
  TopBar.tsx             ← shop name, user avatar, logout
```

### KPI Card Structure
```tsx
<KpiCard
  icon={<DollarSign />}
  title="Today's Sales"
  value={formatCurrency(todaySales)}
  trend="+12%"              // compared to yesterday
  color="gold"
/>
```

### KPI Widgets
| Widget | Data Source | Color |
|---|---|---|
| Today's Sales | SUM bills.total_amount WHERE date = today | Gold |
| Today's Expenses | SUM expenses.amount WHERE date = today | Red |
| Customers Today | COUNT DISTINCT bills.customer_id WHERE date = today | Navy |
| Low Stock Alerts | COUNT inventory WHERE quantity ≤ low_stock_threshold | Amber |

### State Management
```ts
// src/state/dashboardStore.ts
interface DashboardState {
  todaySales: number
  todayExpenses: number
  customersToday: number
  lowStockCount: number
  lowStockItems: InventoryItem[]
  weeklyChart: DailyRevenue[]
  isLoading: boolean
  fetchDashboard: () => Promise<void>
}
```

### API Communication
```ts
// src/services/dashboardService.ts
export const getDashboardSummary = () =>
  apiClient.get('/dashboard/summary')

export const getLowStockItems = () =>
  apiClient.get('/dashboard/low-stock')

export const getWeeklyRevenue = () =>
  apiClient.get('/dashboard/weekly-revenue')
```

### Layout Structure
```
AppShell
├── Sidebar (left, collapsible on mobile)
│   ├── Logo "CAR ADDA"
│   ├── NavLink: Dashboard
│   ├── NavLink: Billing
│   ├── NavLink: Customers
│   ├── NavLink: Inventory
│   ├── NavLink: Vendors
│   ├── NavLink: Expenses
│   ├── NavLink: Reports
│   └── NavLink: Settings
├── TopBar (header)
│   ├── Hamburger (mobile)
│   ├── Page Title
│   └── Logout Button
└── Main Content
    ├── KPI Grid (4 cards)
    ├── Quick Bill FAB
    ├── 7-Day Sales Chart
    └── Low Stock Alert Panel
```

### UI Component Hierarchy
```
DashboardPage
  ├── KpiCard × 4
  ├── QuickBillButton
  ├── SalesChart
  │     └── BarChart (Recharts)
  └── LowStockAlert
        └── LowStockItem × n
```

---

## Backend Implementation

### APIs Created
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `GET /dashboard/summary` | GET | JWT | Today's KPI aggregates |
| `GET /dashboard/low-stock` | GET | JWT | Items below threshold |
| `GET /dashboard/weekly-revenue` | GET | JWT | Last 7 days revenue per day |

### Request / Response

**GET `/dashboard/summary`**
```json
{
  "today_sales": 4500.00,
  "today_expenses": 1200.00,
  "customers_today": 6,
  "low_stock_count": 2,
  "date": "2024-01-15"
}
```

**GET `/dashboard/low-stock`**
```json
{
  "items": [
    { "id": "uuid", "item_name": "Foam Shampoo", "quantity": 1.5, "unit": "litre", "threshold": 5 }
  ]
}
```

**GET `/dashboard/weekly-revenue`**
```json
{
  "data": [
    { "date": "2024-01-09", "revenue": 3200.00 },
    { "date": "2024-01-10", "revenue": 4100.00 }
  ]
}
```

### Service Layer (app/services/dashboard_service.py)
```python
def get_today_summary():
    today = date.today().isoformat()
    sales = supabase.table("bills")\
        .select("total_amount")\
        .gte("created_at", today)\
        .execute()
    expenses = supabase.table("expenses")\
        .select("amount")\
        .eq("expense_date", today)\
        .execute()
    ...
    return DashboardSummary(
        today_sales=sum(r["total_amount"] for r in sales.data),
        today_expenses=sum(r["amount"] for r in expenses.data),
        ...
    )
```

### Validation Logic
- All endpoints require valid JWT (injected via `get_current_user`)
- Date calculations done in server-side Python (not client)

### Error Handling
- 401 if token missing/expired
- 500 with safe error message if DB unreachable

---

## Database Implementation
No new tables created. Queries aggregate from:
- `bills` — sales totals, customer counts
- `expenses` — expense totals
- `inventory` — low stock detection

---

## Integration Logic
- Dashboard polls every 60 seconds using `setInterval` in `useEffect`
- Low-stock alert badge in sidebar shows red count badge when `lowStockCount > 0`
- Quick Bill button navigates to `/billing/new` (route created in Phase 6)

---

## Phase Relationship
- **Builds on Phase 2:** `AppShell`, `ProtectedRoute`, JWT auth
- **Builds on Phase 3:** All schema tables exist; queries are safe
- **Enables Phase 5:** Sidebar `Customers` link placeholder activates in Phase 5
- **Enables Phase 6:** Quick Bill FAB target route activates in Phase 6
- **Enables Phase 7:** Low-stock list links to inventory detail (Phase 7)
