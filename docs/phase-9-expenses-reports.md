# Phase 9 — Expense Tracking and Business Reports

## Phase Objective
Build the Expense Tracking module and the full Business Reports page. This phase closes the financial loop — income (bills), expenditure (expenses + purchases), and profit are all aggregated and visualised so the owner has a complete picture of the business.

---

## Features Implemented
- Log expense (name, category, amount, date, notes)
- Expense list with category filters and date range
- Reports page: Daily Sales, Monthly Sales, Total Expenses, Net Profit
- Sales chart (bar chart — 30 days)
- Expense breakdown chart (doughnut by category)
- Export: CSV download for bills and expenses
- Top services by revenue
- Customer visit frequency report

---

## Frontend Implementation

### Pages Created
| Page | Route | File |
|---|---|---|
| Expenses | `/expenses` | `src/pages/expenses/ExpensesPage.tsx` |
| Add Expense | `/expenses/new` | `src/pages/expenses/AddExpensePage.tsx` |
| Reports | `/reports` | `src/pages/reports/ReportsPage.tsx` |

### UI Components
```
src/components/expenses/
  ExpenseForm.tsx            ← name, category, amount, date, notes
  ExpenseTable.tsx           ← date, name, category, amount
  ExpenseCategoryBadge.tsx   ← color-coded chip per category

src/components/reports/
  ReportKpiCard.tsx          ← large number + label + period
  SalesBarChart.tsx          ← 30-day daily revenue bars (Recharts BarChart)
  ExpenseDoughnutChart.tsx   ← expense breakdown by category (Recharts PieChart)
  TopServicesTable.tsx       ← service name, count, revenue rank
  DateRangePicker.tsx        ← from/to date selector
  ExportButton.tsx           ← triggers CSV download
  ProfitSummaryCard.tsx      ← Revenue − Expenses = Net Profit (highlighted gold)
```

### Reports Page Layout
```
ReportsPage
  ├── DateRangePicker (default: current month)
  ├── KPI Row
  │     ├── ReportKpiCard: Total Revenue
  │     ├── ReportKpiCard: Total Expenses
  │     ├── ReportKpiCard: Net Profit      ← gold highlight
  │     └── ReportKpiCard: Total Customers
  ├── Charts Row
  │     ├── SalesBarChart (left / full width)
  │     └── ExpenseDoughnutChart (right)
  ├── TopServicesTable
  └── Export Row
        ├── ExportButton "Download Bills CSV"
        └── ExportButton "Download Expenses CSV"
```

### State Management
```ts
// src/state/expenseStore.ts
interface ExpenseState {
  expenses: Expense[]
  isLoading: boolean
  dateFilter: { from: string; to: string }
  fetchExpenses: (filters?: ExpenseFilters) => Promise<void>
  createExpense: (data: CreateExpenseDto) => Promise<void>
}

// src/state/reportStore.ts
interface ReportState {
  summary: ReportSummary | null
  salesChart: DailyRevenue[]
  expenseChart: ExpenseCategoryBreakdown[]
  topServices: ServiceRevenue[]
  dateRange: { from: string; to: string }
  isLoading: boolean
  fetchReport: (from: string, to: string) => Promise<void>
}
```

### API Communication
```ts
// src/services/expenseService.ts
export const getExpenses = (filters?: ExpenseFilters) =>
  apiClient.get('/expenses', { params: filters })

export const createExpense = (data: CreateExpenseDto) =>
  apiClient.post('/expenses', data)

// src/services/reportService.ts
export const getReportSummary = (from: string, to: string) =>
  apiClient.get('/reports/summary', { params: { from, to } })

export const getSalesChart = (from: string, to: string) =>
  apiClient.get('/reports/sales-chart', { params: { from, to } })

export const getExpenseBreakdown = (from: string, to: string) =>
  apiClient.get('/reports/expense-breakdown', { params: { from, to } })

export const getTopServices = (from: string, to: string) =>
  apiClient.get('/reports/top-services', { params: { from, to } })

export const exportBillsCsv = (from: string, to: string) =>
  apiClient.get('/reports/export/bills', { params: { from, to }, responseType: 'blob' })

export const exportExpensesCsv = (from: string, to: string) =>
  apiClient.get('/reports/export/expenses', { params: { from, to }, responseType: 'blob' })
```

---

## Backend Implementation

### APIs Created

#### Expenses
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `GET /expenses` | GET | JWT | List with date + category filter |
| `POST /expenses` | POST | JWT | Log new expense |
| `PUT /expenses/:id` | PUT | JWT | Update expense |
| `DELETE /expenses/:id` | DELETE | JWT | Delete expense |

#### Reports
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `GET /reports/summary` | GET | JWT | KPI aggregates for date range |
| `GET /reports/sales-chart` | GET | JWT | Daily revenue array |
| `GET /reports/expense-breakdown` | GET | JWT | Expense totals by category |
| `GET /reports/top-services` | GET | JWT | Top services by revenue |
| `GET /reports/export/bills` | GET | JWT | CSV of bills in range |
| `GET /reports/export/expenses` | GET | JWT | CSV of expenses in range |

### Request / Response

**GET `/reports/summary?from=2024-01-01&to=2024-01-31`**
```json
{
  "period": { "from": "2024-01-01", "to": "2024-01-31" },
  "total_revenue": 56000.00,
  "total_expenses": 18000.00,
  "net_profit": 38000.00,
  "total_customers": 85,
  "total_bills": 112
}
```

**GET `/reports/sales-chart?from=2024-01-01&to=2024-01-31`**
```json
{
  "data": [
    { "date": "2024-01-01", "revenue": 1800.00 },
    { "date": "2024-01-02", "revenue": 0 },
    ...
  ]
}
```

**GET `/reports/expense-breakdown?from=2024-01-01&to=2024-01-31`**
```json
{
  "breakdown": [
    { "category": "electricity", "total": 3500.00 },
    { "category": "chemical", "total": 8000.00 },
    { "category": "equipment", "total": 4500.00 },
    { "category": "water", "total": 2000.00 }
  ]
}
```

**GET `/reports/top-services?from=2024-01-01&to=2024-01-31`**
```json
{
  "services": [
    { "name": "Premium Wash", "count": 48, "revenue": 38400.00 },
    { "name": "Normal Wash", "count": 35, "revenue": 17500.00 }
  ]
}
```

### Service Layer (app/services/report_service.py)
```python
def get_summary(from_date: date, to_date: date) -> ReportSummary:
    bills = supabase.table("bills")\
        .select("total_amount, customer_id")\
        .gte("created_at", from_date.isoformat())\
        .lte("created_at", to_date.isoformat())\
        .execute()

    expenses = supabase.table("expenses")\
        .select("amount")\
        .gte("expense_date", from_date.isoformat())\
        .lte("expense_date", to_date.isoformat())\
        .execute()

    total_revenue = sum(b["total_amount"] for b in bills.data)
    total_expenses = sum(e["amount"] for e in expenses.data)

    return ReportSummary(
        total_revenue=total_revenue,
        total_expenses=total_expenses,
        net_profit=total_revenue - total_expenses,
        total_customers=len(set(b["customer_id"] for b in bills.data)),
        total_bills=len(bills.data)
    )

def export_bills_csv(from_date: date, to_date: date) -> str:
    bills = get_bills_in_range(from_date, to_date)
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=[
        "bill_number", "customer_name", "car_number",
        "services", "total_amount", "payment_method", "date"
    ])
    writer.writeheader()
    writer.writerows(bills)
    return output.getvalue()
```

### Validation Logic
- `from` and `to` dates: valid ISO date strings, `from` ≤ `to`
- Max date range: 365 days (prevents timeout on large exports)
- Expense `amount`: positive float
- Expense `category`: enum list
- Expense `name`: 2–150 chars

### Error Handling
- `400` if `from > to`
- `422` for invalid dates or validation
- `204` returned for date ranges with no data (not 404)

---

## Database Implementation
Uses tables from Phase 3:
- `expenses` — CRUD
- `bills` + `bill_items` + `services` — revenue aggregation
- `purchases` — purchase cost included in expense totals (optional join)

No new tables required.

---

## Integration Logic

### Net Profit Calculation
```
Net Profit = Total Revenue (bills.total_amount SUM) 
           − Total Expenses (expenses.amount SUM)
           − (optionally) Purchase Costs (purchases.total_price SUM)
```

### CSV Export
- `StreamingResponse` in FastAPI returns CSV directly as file download
- Filename format: `caradda-bills-2024-01.csv`

### Purchases ↔ Expenses Bridge
- When a purchase is recorded with `auto_create_expense=true` (Phase 8), it inserts an expense with category `chemical_purchase`
- This means `total_expenses` in reports automatically includes purchase costs

---

## Phase Relationship
- **Builds on all previous phases:** Aggregates data from bills, expenses, customers, inventory
- **Completes the financial loop:** Revenue + Expenses + Profit are now visible together
- **Connects to Phase 10:** Export and report features can be enhanced with scheduled WhatsApp reports
- **Future-ready:** GST billing addition only requires new `gst_amount` column in `bills` and updated report calculations
