# CAR ADDA — Technical Implementation Blueprint

> **Progressive Web App for Car Wash & Detailing Business Management**

---

## Project Overview

CAR ADDA is a mobile-first Progressive Web App built for a car wash and detailing business. It allows the shop owner to manage billing, customers, inventory, expenses, and financial reports from a single application that works on both mobile and desktop.

**Core capabilities:**
- Generate and print wash/service bills
- Auto-send bills via WhatsApp
- Track customers and their service history
- Manage inventory and auto-deduct stock on service
- Record expenses and purchases from vendors
- View daily, monthly, and custom-range financial reports

---

## System Architecture

```
User (Mobile/Desktop Browser)
        │
        ▼
  React PWA (Vercel)
  ┌─────────────────────────────────────┐
  │  React + Vite + TypeScript          │
  │  Tailwind CSS (dark navy theme)     │
  │  Zustand (state)                    │
  │  Recharts (data viz)                │
  │  Axios (API client)                 │
  │  Service Worker (offline cache)     │
  └──────────────┬──────────────────────┘
                 │ HTTPS REST
                 ▼
  FastAPI Backend (Railway)
  ┌─────────────────────────────────────┐
  │  FastAPI + Uvicorn                  │
  │  JWT Authentication (HS256)         │
  │  ReportLab (PDF generation)         │
  │  httpx (WhatsApp Cloud API)         │
  │  Pydantic (validation)              │
  └──────────────┬──────────────────────┘
                 │ Supabase Python Client
                 ▼
  Supabase PostgreSQL
  ┌─────────────────────────────────────┐
  │  PostgreSQL                         │
  │  Row Level Security (RLS)           │
  │  12-table relational schema         │
  └─────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite + TypeScript | UI framework |
| Styling | Tailwind CSS | Design system |
| State | Zustand | Client state management |
| Charts | Recharts | Reports visualisation |
| Icons | Lucide React | Icon library |
| Backend | FastAPI (Python) | REST API layer |
| Auth | JWT (HS256) | Token-based authentication |
| PDF | ReportLab | Invoice generation |
| WhatsApp | WhatsApp Cloud API | Bill delivery |
| Database | Supabase PostgreSQL | Primary datastore |
| Frontend Host | Vercel | CDN + static hosting |
| Backend Host | Railway | Containerised Python backend |

---

## UI Theme

| Token | Value | Use |
|---|---|---|
| Primary | `#0F172A` | Dark navy background |
| Secondary | `#EF4444` | Automotive red — actions, CTA |
| Accent | `#FACC15` | Gold — highlights, profit |
| Surface | `#1E293B` | Cards, sidebars |
| Text | `#F8FAFC` | Primary text on dark |

---

## Development Phases Summary

### Phase 1 — Project Foundation and Environment Setup
**Establishes:** Entire project scaffold, folder structure, tooling, dev servers, PWA stub, design tokens.

**Key outputs:** `frontend/` Vite project, `backend/` FastAPI project, Tailwind config with brand colors, `manifest.json` stub, `service-worker.js` stub, `.env.example` files.

---

### Phase 2 — Authentication System
**Establishes:** Complete admin login with JWT, protected routes, and persistent session.

**Key outputs:** Login page, `authStore.ts`, `ProtectedRoute.tsx`, `POST /auth/login`, `GET /auth/me`, `users` table, bcrypt password hashing.

**Depends on:** Phase 1 (AppShell, AuthLayout, apiClient)

---

### Phase 3 — Core Database Schema Design
**Establishes:** All 12 database tables with full relational schema, indexes, and RLS.

**Key outputs:** `customers`, `vehicles`, `services`, `bills`, `bill_items`, `inventory`, `vendors`, `purchases`, `expenses`, `payments`, `inventory_usage`, `service_inventory_map` tables. Supabase migrations applied.

**Depends on:** Phase 1 (Supabase client), Phase 2 (users FK)

---

### Phase 4 — Dashboard System
**Establishes:** Main operational dashboard with live KPI widgets, charts, and quick-bill button.

**Key outputs:** `DashboardPage`, `KpiCard`, `SalesChart`, `LowStockAlert`, `Sidebar`, `TopBar`, `GET /dashboard/summary`, `GET /dashboard/low-stock`, `GET /dashboard/weekly-revenue`.

**Depends on:** Phases 1, 2, 3

---

### Phase 5 — Customer Management
**Establishes:** Customer CRUD, vehicle tracking, full service history per customer.

**Key outputs:** `CustomersPage`, `CustomerDetailPage`, `CustomerHistoryTable`, `POST /customers/find-or-create`, `GET /customers/:id/history`.

**Depends on:** Phases 3, 4

---

### Phase 6 — Billing System
**Establishes:** The core revenue engine — bill creation, list, detail, PDF stub, WhatsApp stub, inventory deduction trigger.

**Key outputs:** `CreateBillPage`, `BillListPage`, `BillDetailPage`, `POST /billing`, `GET /billing/:id/pdf`, `POST /billing/:id/whatsapp`, bill number generator, `auto_deduct()` stub call.

**Depends on:** Phases 3, 5

---

### Phase 7 — Inventory Management
**Establishes:** Full stock management with add, update, low-stock alerts, usage history, and `auto_deduct()` implementation.

**Key outputs:** `InventoryPage`, `AddStockModal`, `ServiceMappingEditor`, `POST /inventory/:id/add-stock`, `auto_deduct()` service, Postgres `decrement_inventory` RPC.

**Depends on:** Phases 3, 6

---

### Phase 8 — Vendor and Purchase Management
**Establishes:** Vendor directory and purchase recording with automatic inventory restock.

**Key outputs:** `VendorsPage`, `VendorDetailPage`, `RecordPurchasePage`, `POST /purchases`, `POST /vendors`, auto-increment inventory on purchase.

**Depends on:** Phases 3, 7

---

### Phase 9 — Expense Tracking and Business Reports
**Establishes:** Full financial picture — expense logging, report aggregations, charts, CSV exports, net profit calculation.

**Key outputs:** `ExpensesPage`, `ReportsPage`, `SalesBarChart`, `ExpenseDoughnutChart`, `GET /reports/summary`, `GET /reports/export/bills`, `export_bills_csv()`, `export_expenses_csv()`.

**Depends on:** Phases 3, 6, 7, 8

---

### Phase 10 — External Integrations and PWA Optimization
**Establishes:** Production-ready WhatsApp bill sending, branded PDF invoices, full service worker, installable PWA, Settings page, and Vercel + Railway deployment.

**Key outputs:** `whatsapp_service.py` (WhatsApp Cloud API), `pdf_service.py` (ReportLab branded invoice), `service-worker.js` (network-first/cache-first strategy), `SettingsPage`, `settings` table, deployment configs.

**Depends on:** All phases 1–9

---

## Phase Dependency Map

```
Phase 1 (Foundation)
     │
Phase 2 (Auth)
     │
Phase 3 (Database Schema) ──────────────────────────┐
     │                                               │
Phase 4 (Dashboard)                                  │
     │                                               │
Phase 5 (Customers)                                  │
     │                                               │
Phase 6 (Billing) ──────────────────────┐            │
     │                                  │            │
Phase 7 (Inventory) ◄───────────────────┘            │
     │                                               │
Phase 8 (Vendors) ──────────────────────────────────►│
     │                                               │
Phase 9 (Expenses + Reports) ◄───────────────────────┘
     │
Phase 10 (Integrations + PWA)
```

---

## Database Schema — Quick Reference

| Table | Purpose | Key FKs |
|---|---|---|
| `users` | Admin accounts | — |
| `customers` | Customer directory | — |
| `vehicles` | Car numbers per customer | → customers |
| `services` | Master service catalogue | — |
| `bills` | Invoice records | → customers, vehicles, users |
| `bill_items` | Line items per bill | → bills, services |
| `inventory` | Stock items | — |
| `vendors` | Supplier directory | — |
| `purchases` | Stock purchases | → vendors, inventory |
| `expenses` | Operational costs | → users |
| `payments` | Payment records | → bills |
| `inventory_usage` | Auto-deduction log | → bills, inventory |
| `service_inventory_map` | Auto-deduction config | → services, inventory |
| `settings` | App configuration | — |

---

## Full Folder Structure

```
CarAdda/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             ← Button, Card, Spinner, Badge
│   │   │   ├── auth/           ← LoginForm, ProtectedRoute
│   │   │   ├── layout/         ← Sidebar, TopBar
│   │   │   ├── dashboard/      ← KpiCard, SalesChart, LowStockAlert
│   │   │   ├── customers/      ← CustomerCard, CustomerHistoryTable
│   │   │   ├── billing/        ← BillForm, ServiceSelector, BillActions
│   │   │   ├── inventory/      ← InventoryTable, AddStockModal
│   │   │   ├── vendors/        ← VendorCard, PurchaseForm
│   │   │   ├── expenses/       ← ExpenseForm, ExpenseTable
│   │   │   ├── reports/        ← SalesBarChart, ExpenseDoughnutChart
│   │   │   └── settings/       ← ShopInfoForm, WhatsAppConfigForm
│   │   ├── pages/
│   │   │   ├── auth/           ← LoginPage
│   │   │   ├── dashboard/      ← DashboardPage
│   │   │   ├── customers/      ← CustomersPage, CustomerDetailPage
│   │   │   ├── billing/        ← CreateBillPage, BillListPage, BillDetailPage
│   │   │   ├── inventory/      ← InventoryPage, InventoryFormPage
│   │   │   ├── vendors/        ← VendorsPage, PurchasesPage, RecordPurchasePage
│   │   │   ├── expenses/       ← ExpensesPage, AddExpensePage
│   │   │   ├── reports/        ← ReportsPage
│   │   │   └── settings/       ← SettingsPage
│   │   ├── layouts/            ← AppShell, AuthLayout
│   │   ├── hooks/              ← useDebounce, usePWAInstall, useCustomerSearch
│   │   ├── services/           ← apiClient + per-feature service files
│   │   ├── state/              ← per-feature Zustand stores
│   │   ├── utils/              ← formatDate, formatCurrency
│   │   └── styles/             ← global.css, index.css
│   ├── public/
│   │   ├── manifest.json
│   │   ├── service-worker.js
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── .env.example
│
├── backend/
│   ├── app/
│   │   ├── api/v1/             ← health, auth, billing, customers, inventory,
│   │   │                         vendors, purchases, expenses, reports, settings
│   │   ├── services/           ← auth, billing, customer, inventory, vendor,
│   │   │                         report, pdf, whatsapp, settings services
│   │   ├── models/             ← Pydantic response models
│   │   ├── schemas/            ← Pydantic request DTOs
│   │   ├── database/           ← supabase_client.py
│   │   ├── core/               ← config.py, security.py
│   │   └── utils/              ← logger.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── docs/
│   ├── phase-1-foundation.md
│   ├── phase-2-authentication.md
│   ├── phase-3-database.md
│   ├── phase-4-dashboard.md
│   ├── phase-5-customers.md
│   ├── phase-6-billing.md
│   ├── phase-7-inventory.md
│   ├── phase-8-vendors.md
│   ├── phase-9-expenses-reports.md
│   └── phase-10-integrations-pwa.md
│
├── car_adda_prd.md
├── PROJECT_CONTEXT.md     ← Update after every phase
└── README.md
```

---

## Deployment Overview

| Service | Platform | Command |
|---|---|---|
| Frontend | Vercel | `npm run build` → auto-deploys on git push |
| Backend | Railway | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Database | Supabase | Managed PostgreSQL, no deployment needed |

**Production Environment Variables:**

Frontend (Vercel):
```
VITE_API_BASE_URL=https://caradda-api.railway.app
```

Backend (Railway):
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
FRONTEND_URL=https://caradda.vercel.app
```

---

## Future Enhancements (Designed-In Hooks)

| Feature | Schema Change | Backend Change | Frontend Change |
|---|---|---|---|
| Multi-employee login | Add `role` to users | Role-based route guards | Role-conditional nav links |
| Multiple branches | Add `branch_id` FK to bills, expenses | Branch-scoped queries | Branch selector in TopBar |
| GST Billing | Add `gst_rate`, `gst_amount` to bills | Updated billing service | GST fields in bill form + PDF |
| Online Booking | New `bookings` table | New `/bookings` API | New Bookings page |
| Loyalty Program | Add `loyalty_points` to customers | Trigger on bill creation | Points display on customer card |
| SMS Notifications | None | Add `sms_service.py` | Toggle in Settings |

---

*For detailed implementation instructions, refer to the individual phase documents in the `docs/` folder.*
*For project progress tracking, refer to `PROJECT_CONTEXT.md`.*
