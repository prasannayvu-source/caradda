# PROJECT_CONTEXT.md — CAR ADDA PWA

> **Single Source of Truth for Project Progress**
> Update this file at the end of every phase before closing the session.
> An AI agent resuming work must read this file first.

---

## Project Overview
**Product:** CAR ADDA — Car Wash & Detailing Management PWA
**Version:** 1.0
**Stack:** React + Tailwind CSS (frontend) | FastAPI (backend) | Supabase PostgreSQL (database)
**Hosting:** Vercel (frontend) | Railway (backend) | Supabase (DB)

---

## Current Status

| Item | Name | Status |
|---|---|---|
| Landing Page | Public Marketing Entry Point | ✅ Complete |
| UI/UX Design System | Global Design System Guidelines | 📋 Defined (doc created) |
| Phase 1 | Project Foundation and Environment Setup | ✅ Complete |
| Phase 2 | Authentication System | ✅ Complete |
| Phase 3 | Core Database Schema Design | ✅ Complete |
| Phase 4 | Dashboard System | ✅ Complete |
| Phase 5 | Customer Management | ✅ Complete |
| Phase 6 | Billing System | ✅ Complete |
| Phase 7 | Inventory Management | ✅ Complete |
| Phase 8 | Vendor and Purchase Management | ✅ Complete |
| Phase 9 | Expense Tracking and Business Reports | ✅ Complete |
| Phase 10 | External Integrations and PWA Optimization | ✅ Complete |

> Update statuses to: ✅ Complete | 🔄 In Progress | ⬜ Not Started | ❌ Blocked | 📋 Planned

---

## Phase Completion Log

> This section is updated after each phase is completed.
> Format for each entry is shown below.

---

---

### Phase 10 — External Integrations and PWA Optimization

**Completed On:** 2026-03-15

**Backend:**
- `whatsapp_service.py` — WhatsApp Cloud API via httpx; reads credentials from settings table; graceful fallback to web deep-link if not configured.
- `settings_service.py` — get/upsert key-value settings from Supabase `settings` table; masks `wa_access_token` in GET response.
- `app/api/v1/settings.py` — `GET /settings/`, `PUT /settings/` (JWT-protected).
- `app/api/v1/billing.py` — WhatsApp endpoint upgraded from stub to real async Cloud API call with fallback.
- `main.py` — settings router mounted.
- `Procfile` — Railway deployment command (`uvicorn main:app --host 0.0.0.0 --port $PORT`).

**Frontend:**
- `settingsService.ts` — typed GET/PUT for settings.
- `settingsStore.ts` — Zustand store with fetchSettings + saveSettings.
- `InstallPromptBanner.tsx` — bottom-sheet PWA install banner (Android native prompt + iOS instructions), dismissible.
- `SettingsPage.tsx` — 3 sections: Shop Info form, WhatsApp config (masked token + status badge), PWA install card.
- `App.tsx` — all 19 page routes converted to `React.lazy()` + `<Suspense>`, `/settings` route added, `InstallPromptBanner` mounted globally.
- `vite.config.ts` — `manualChunks` function splits: `vendor`/`charts`/`icons`/`state`/`http`.
- `vercel.json` — SPA rewrites + service-worker/manifest cache headers.

**PWA:**
- `service-worker.js` — full install/activate lifecycle, cache cleanup, network-first for API, cache-first for assets, background sync hook.
- `manifest.json` — full spec: description, orientation, lang, maskable icon, app shortcuts (New Bill + Reports).

**Database:**
- `settings` table created via migration with RLS policies.
- Seeded with default keys: `shop_name`, `address`, `phone`, `email`, `logo_url`, `wa_phone_number_id`, `wa_access_token`.

---

### Phase 9 — Expense Tracking and Business Reports

**Completed On:** 2026-03-15

**Backend:**
- `expense_service.py` — list (date+category filter), create, update, delete.
- `report_service.py` — summary KPIs, daily sales chart (gap-filled), expense breakdown by category, top 10 services, bills CSV export, expenses CSV export.
- `app/api/v1/expenses.py` — 10 JWT-protected endpoints (4 expense + 6 report), CSV via `StreamingResponse`.
- `main.py` — expenses+reports router mounted at `/api/v1`.

**Frontend:**
- `expenseService.ts` — typed CRUD API calls.
- `reportService.ts` — 6 report API calls including blob exports.
- `expenseStore.ts` — Zustand store with list, create, update, delete.
- `reportStore.ts` — parallel fetch of all 4 report endpoints, default current-month range.
- `ExpenseCategoryBadge.tsx` — 10 categories with emoji + color-coded chips.
- `ExpenseTable.tsx` — date/name/category/amount table with delete, red total footer.
- `ReportKpiCard.tsx` — large number KPI card with gold/red variants + profit/loss trend.
- `SalesBarChart.tsx` — Recharts BarChart, gold bars, dark theme, smart x-axis labels.
- `ExpenseDoughnutChart.tsx` — Recharts PieChart donut, multi-color, custom tooltip.
- `TopServicesTable.tsx` — ranked list with gold progress bars, count + revenue.
- `ExportButton.tsx` — blob→file download with loading state and toast.
- `ExpensesPage.tsx` — date+category filters, stat banner, table with delete.
- `AddExpensePage.tsx` — all fields with validation.
- `ReportsPage.tsx` — preset buttons (Today/Month/30d/Year), custom range, 4 KPIs, profit/loss banner, charts, top services, customer stats, export buttons.
- `App.tsx` — `/expenses`, `/expenses/new`, `/reports` routes added.

**Backend APIs created:**
- `GET /api/v1/expenses/`
- `POST /api/v1/expenses/`
- `PUT /api/v1/expenses/:id`
- `DELETE /api/v1/expenses/:id`
- `GET /api/v1/reports/summary`
- `GET /api/v1/reports/sales-chart`
- `GET /api/v1/reports/expense-breakdown`
- `GET /api/v1/reports/top-services`
- `GET /api/v1/reports/export/bills`
- `GET /api/v1/reports/export/expenses`

---

### Phase 8 — Vendor and Purchase Management

**Completed On:** 2026-03-15

**Backend:**
- `vendor_service.py` — vendor CRUD with purchase enrichment (total_spent, count); purchase list/record with inventory auto-increment and optional expense cross-link.
- `app/api/v1/vendors.py` — 6 JWT-protected endpoints split across `/vendors/` and `/purchases/`.
- `main.py` — vendors router mounted at `/api/v1` prefix.

**Frontend:**
- `vendorService.ts` — typed API calls for vendors and purchases.
- `vendorStore.ts` — Zustand store with all CRUD, purchase recording, and list fetching.
- `VendorCard.tsx` — grid card with avatar, phone, purchase count, total spend.
- `PurchaseTable.tsx` — date/vendor/item/qty/price/total table with optional vendor column and grand total footer.
- `VendorsPage.tsx` — grid layout with skeleton, empty state.
- `VendorFormPage.tsx` — create/edit with name, phone, email, address.
- `VendorDetailPage.tsx` — profile card with stats, purchase history table.
- `PurchasesPage.tsx` — date + vendor filters, summary stats, purchase table with vendor column.
- `RecordPurchasePage.tsx` — vendor select (+ new), inventory dropdown with stock, qty+price inputs, live total preview, date, notes, auto-expense toggle.
- `App.tsx` — `/vendors`, `/vendors/new`, `/vendors/:id`, `/vendors/:id/edit`, `/purchases`, `/purchases/new`.

**Backend APIs created:**
- `GET /api/v1/vendors/`
- `POST /api/v1/vendors/`
- `GET /api/v1/vendors/:id`
- `PUT /api/v1/vendors/:id`
- `GET /api/v1/purchases/`
- `POST /api/v1/purchases/`

**Integration:**
- `POST /purchases/` internally calls `inventory_service.add_stock()` to restock immediately.
- Optional: auto-creates an `expenses` entry to prevent double-entry by shop owner.

---

### Phase 7 — Inventory Management

**Completed On:** 2026-03-15

**Database:**
- `decrement_inventory(item_id, qty)` PostgreSQL RPC function created via migration — uses `GREATEST(qty - n, 0)` for atomic safe deduction.

**Backend:**
- `inventory_service.py` — full CRUD, add-stock, get-low-stock, usage history, service mapping CRUD, and `auto_deduct` using Postgres RPC.
- `app/api/v1/inventory.py` — 9 JWT-protected endpoints.

**Frontend:**
- `inventoryService.ts` — all 9 API calls.
- `inventoryStore.ts` — Zustand store with full types and actions.
- `StockLevelBadge.tsx` — green/amber/red badge with quantity and unit.
- `InventoryTable.tsx` — sortable table with category badge, stock badge, quick action buttons.
- `AddStockModal.tsx` — modal with qty input, new total preview, confirmation.
- `UsageHistoryTable.tsx` — bill-level consumption records with total summary.
- `InventoryPage.tsx` — category filter tabs, search, low-stock alert panel, skeleton loader, table.
- `InventoryFormPage.tsx` — dual-mode (create/edit), all fields, opening stock on create only.
- `InventoryDetailPage.tsx` — item card, stock badge, usage history, add-stock modal inline.
- `App.tsx` — `/inventory`, `/inventory/new`, `/inventory/:id`, `/inventory/:id/edit` routes added.

**Backend APIs created:**
- `GET /api/v1/inventory/`
- `GET /api/v1/inventory/:id`
- `POST /api/v1/inventory/`
- `PUT /api/v1/inventory/:id`
- `POST /api/v1/inventory/:id/add-stock`
- `GET /api/v1/inventory/:id/usage`
- `GET /api/v1/inventory/service-mappings`
- `POST /api/v1/inventory/service-mappings`
- `DELETE /api/v1/inventory/service-mappings/:id`

---

### Phase 6 — Billing System

**Completed On:** 2026-03-15

**Backend:**
- `vehicle_service.py` — find-or-create vehicle per customer.
- `inventory_service.py` — auto-deduct stock on bill creation via `service_inventory_map`.
- `billing_service.py` — full bill creation orchestrator: customer, vehicle, totals, Postgres sequence bill number, bill + items + payment insert.
- `pdf_service.py` — ReportLab A4 invoice generator in dark navy theme matching CAR ADDA design.
- `app/api/v1/billing.py` — 5 JWT-protected endpoints: create, list (with filters), detail, PDF download, WhatsApp deep-link.

**Frontend:**
- `billingService.ts` — 5 typed API functions.
- `billingStore.ts` — Zustand store: draft bill, list, detail, filters, create/fetch actions with toast feedback.
- `PaymentMethodToggle.tsx` — Cash / UPI segment control.
- `BillItemRow.tsx` — editable qty + price per service, gold line total, remove button.
- `ServiceSelector.tsx` — dropdown from API, price override, custom service mode.
- `BillSummary.tsx` — subtotal, editable discount, gold total — reused in create + detail.
- `BillCard.tsx` — list item with bill number, customer, badges, amount, date.
- `BillActions.tsx` — PDF download (blob), print (browser), WhatsApp (deep-link URL), loading states.
- `CreateBillPage.tsx` — full multi-step form: phone lookup (600ms debounce), name, car number, service selector, item rows, summary, payment toggle, status, notes, submit.
- `BillListPage.tsx` — date/payment/status filters, revenue summary, skeleton loading, empty state.
- `BillDetailPage.tsx` — bill header, customer block, services table, summary, action buttons, print styles.
- `App.tsx` — added `/billing`, `/billing/new`, `/billing/:id`.

**Backend APIs created:**
- `POST /api/v1/billing/`
- `GET /api/v1/billing/`
- `GET /api/v1/billing/:id`
- `GET /api/v1/billing/:id/pdf`
- `POST /api/v1/billing/:id/whatsapp`

**Remaining:**
- WhatsApp fully wired in Phase 10 (currently returns a deep-link URL).
- Inventory page (Phase 7) will surface auto-deduction results.

---

### Phase 5 — Customer Management

**Completed On:** 2026-03-15

**Backend:**
- `app/services/customer_service.py` — list with ilike search, per-customer vehicle/bill enrichment, get-by-id, history (with service name lookup), find-or-create upsert, and update.
- `app/api/v1/customers.py` — 5 JWT-protected endpoints: `GET /`, `GET /:id`, `GET /:id/history`, `POST /find-or-create`, `PUT /:id`.

**Frontend:**
- `src/services/customerService.ts` — 5 API call functions.
- `src/state/customerStore.ts` — Zustand store with full types (Customer, CustomerDetail, BillHistory, Vehicle) and fetch actions.
- `src/hooks/useDebounce.ts` — generic debounce hook.
- `src/components/customers/CustomerSearchBar.tsx` — search input with clear button.
- `src/components/customers/CustomerCard.tsx` — avatar, name/phone, vehicle tags, visits, last visit.
- `src/components/customers/VehicleTag.tsx` — gold monospace car number badge.
- `src/components/customers/CustomerStatBadge.tsx` — visits + total spent chips.
- `src/components/customers/CustomerHistoryTable.tsx` — billing history with service chips, status badges.
- `src/pages/customers/CustomersPage.tsx` — list page, 300ms debounce search, skeleton loading, empty state.
- `src/pages/customers/CustomerDetailPage.tsx` — detail page: profile card, vehicles, history table, stat badges.
- `src/App.tsx` — `/customers` and `/customers/:id` routes added.

**Backend APIs created:**
- `GET /api/v1/customers/`
- `GET /api/v1/customers/:id`
- `GET /api/v1/customers/:id/history`
- `POST /api/v1/customers/find-or-create`
- `PUT /api/v1/customers/:id`

**Remaining:**
- Phase 6 Billing will call `find-or-create` and populate real customer/bill data.

---

### Phase 4 — Dashboard System

**Completed On:** 2026-03-15

**Summary of what was implemented:**

**Backend:**
- `app/services/dashboard_service.py` — aggregates today’s sales, expenses, customer count, low-stock count from Supabase.
- `app/services/dashboard_service.py` — `get_low_stock_items()` returns all items at or below threshold.
- `app/services/dashboard_service.py` — `get_weekly_revenue()` computes per-day revenue for last 7 days.
- `app/api/v1/dashboard.py` — 3 JWT-protected endpoints: `/summary`, `/low-stock`, `/weekly-revenue`.

**Frontend:**
- `src/services/dashboardService.ts` — API calls for all 3 endpoints.
- `src/state/dashboardStore.ts` — Zustand store with parallel fetch, 60s polling init in DashboardPage.
- `src/components/dashboard/KpiCard.tsx` — reusable metric widget with color variants + loading skeleton.
- `src/components/dashboard/SalesChart.tsx` — 7-day Recharts bar chart, today highlighted red, past days gold.
- `src/components/dashboard/LowStockAlert.tsx` — alert panel with per-item status colors, empty state.
- `src/components/dashboard/QuickBillButton.tsx` — FAB for quick bill creation (navigates to `/billing/new`).
- `src/components/dashboard/Sidebar.tsx` — full 8-item nav sidebar with low-stock badge, user footer, logout.
- `src/layouts/AppShell.tsx` — updated to use Sidebar component, mobile drawer, topbar refresh button.
- `src/pages/dashboard/DashboardPage.tsx` — full dashboard assembled: KPIs, net profit banner, chart + alerts.

**Backend APIs created:**
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/dashboard/low-stock`
- `GET /api/v1/dashboard/weekly-revenue`

**Remaining work / known issues:**
- Dashboard will show real data once backend `.env` has the service role key filled.
- `/billing/new`, `/customers`, `/inventory` etc. routes activate in Phases 5–7.

---

### Phase 3 — Core Database Schema Design

**Completed On:** 2026-03-15

**Summary of what was implemented:**
- Created 14 tables in Supabase: `customers`, `vehicles`, `services`, `bills`, `bill_items`, `inventory`, `inventory_usage`, `service_inventory_map`, `vendors`, `purchases`, `expenses`, `payments`, `settings`, and `users` (from Phase 2).
- RLS enabled on all tables; backend uses `service_role` key to bypass.
- Indexes applied for all high-frequency lookup columns.
- `GENERATED ALWAYS AS` used for `bill_items.line_total` and `purchases.total_price`.
- Seeded 11 services master records (Normal Wash, Premium Wash, Painting, etc.).
- Seeded default shop settings in `settings` table.
- Created `bill_number_seq` PostgreSQL sequence for `CA-YYYY-NNNN` bill numbering.
- Created `get_next_bill_number()` PostgreSQL function (tested: returns `CA-2026-0001`).
- Created `set_updated_at()` trigger function applied to `customers`, `users`, `settings`.
- Created backend Pydantic models for all entities: `customer.py`, `service.py`, `bill.py`, `inventory.py`.
- Created `GET /api/v1/services/` and `GET /api/v1/services/all` endpoints.

**Backend APIs created:**
- `GET /api/v1/services/` — active services list
- `GET /api/v1/services/all` — all services (admin)

**Database tables added:**
- `customers`, `vehicles`, `services`, `bills`, `bill_items`
- `inventory`, `inventory_usage`, `service_inventory_map`
- `vendors`, `purchases`, `expenses`, `payments`
- `settings` (shop config)

**Remaining work / known issues:**
- Phase 4 (Dashboard) is next — will query `bills` and `expenses` for summary stats.

---

### Phase 2 — Authentication System

**Completed On:** 2026-03-15

**Summary of what was implemented:**
- Created `users` table in Supabase with phone/password/role/UUID structure and RLS enabled.
- Seeded default admin user: phone `9876543210`, password `CarAdda@2024`.
- Backend: `app/services/auth_service.py` with bcrypt password verification and JWT generation.
- Backend: `app/core/security.py` with `get_current_user` FastAPI dependency using `python-jose`.
- Backend: `POST /api/v1/auth/login` and `GET /api/v1/auth/me` endpoints live.
- Frontend: `LoginForm.tsx` with 10-digit phone + password validation, show/hide password toggle.
- Frontend: `LoginPage.tsx` assembled using `AuthLayout.tsx` (centered card, dark background).
- Frontend: `ProtectedRoute.tsx` guards all `/dashboard` routes, calling `/auth/me` on mount.
- Frontend: `authStore.ts` upgraded with real `login()`, `logout()`, and `checkAuth()` actions.
- Frontend: `apiClient.ts` enhanced with 401 interceptor auto-clearing token and redirecting to `/login`.
- Frontend: `App.tsx` updated with correct public/protected routing structure.
- Frontend: `AppShell.tsx` fully wired with real user info, NavLink active states, and mobile drawer.

**Frontend components created:**
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/layouts/AuthLayout.tsx`
- `src/pages/auth/LoginPage.tsx`
- `src/pages/dashboard/DashboardPage.tsx` (stub)
- `src/services/authService.ts`

**Backend APIs created:**
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

**Database tables added:**
- `public.users` (id, name, phone, hashed_password, role, created_at, updated_at)

**Integrations implemented:**
- Supabase `users` table queried from backend via service role key.

**Remaining work / known issues:**
- `backend/.env` needs `SUPABASE_SERVICE_ROLE_KEY` filled from Supabase Dashboard > Settings > API > service_role.
- Backend server must be started with: `cd backend && venv\Scripts\uvicorn.exe main:app --reload`

---

### Landing Page Module

**Completed On:** 2026-03-15

**Summary of what was implemented:**
- Created all landing page sections matching UI/UX design and exact token definitions.
- Set up CSS-only animations (`fadeInUp`) managed via `useInView` hook for elegant entrance transitions.
- Assembled responsive grids (Services, Features, Testimonials).
- Established distinct unauthenticated public `LandingLayout` and routing logic in `App.tsx` handling auth redirects.

**Frontend components created:**
- `src/hooks/useInView.ts`
- `src/hooks/usePWAInstall.ts`
- `src/layouts/LandingLayout.tsx`
- `src/components/landing/LandingNavbar.tsx`
- `src/components/landing/HeroSection.tsx`
- `src/components/landing/ServicesSection.tsx`
- `src/components/landing/FeaturesSection.tsx`
- `src/components/landing/HowItWorksSection.tsx`
- `src/components/landing/InstallAppSection.tsx`
- `src/components/landing/TestimonialsSection.tsx`
- `src/components/landing/CallToActionSection.tsx`
- `src/components/landing/LandingFooter.tsx`
- `src/pages/landing/LandingPage.tsx`

**Remaining work / known issues:**
- Proceed to Phase 2 (Authentication System). The landing page relies on the `/login` route that will be built next.

---

### Phase 1 — Project Foundation and Environment Setup

**Completed On:** 2026-03-15

**Summary of what was implemented:**
- Set up monorepo folder structure
- Configured Vite + React + TS frontend with Tailwind CSS v3
- Applied global UI/UX Design tokens and CSS animations
- Setup Zustand stores (`authStore`, `uiStore`) and Axios `apiClient`
- Scaffolded common UI components (`Button`, `Card`, `Spinner`, `Badge`) and layouts (`AppShell`)
- Configured PWA `manifest.json` and `service-worker.js`
- Set up FastAPI backend with Python venv and required dependencies
- Configured `health.py` endpoint and `supabase_client.py`

**Frontend components created:**
- `src/pages/NotFound.tsx`
- `src/layouts/AppShell.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Spinner.tsx`
- `src/components/ui/Badge.tsx`

**Backend APIs created:**
- `GET /api/v1/health`

**Database tables added or modified:**
- None (Supabase connection verified via test table only)

**Integrations implemented:**
- Initialized Supabase client structure (no actual queries yet)

**Remaining work / known issues:**
- Proceed to Landing Page development as prioritized before Phase 2.

---

### [TEMPLATE — Copy and fill for each completed phase]

**Phase N — [Phase Name]**
**Completed On:** YYYY-MM-DD

**Summary of what was implemented:**
- (brief bullet summary)

**Frontend components created:**
- `src/pages/...`
- `src/components/...`

**Backend APIs created:**
- `POST /endpoint`
- `GET /endpoint`

**Database tables added or modified:**
- Table name: new columns or changes

**Integrations implemented:**
- (e.g. WhatsApp, PDF, inventory deduction)

**Remaining work / known issues:**
- (anything left for future phases)

---

## Active Environment Details

### Supabase
- Project URL: *(fill in after Supabase project creation)*
- Anon Key: *(stored in .env only — never commit)*
- Service Role Key: *(stored in .env only — never commit)*

### Frontend
- Framework: React + Vite + TypeScript
- UI: Tailwind CSS
- State: Zustand
- HTTP client: Axios (apiClient.ts)
- Charts: Recharts
- Icons: Lucide React
- Local dev URL: http://localhost:5173
- Production URL: *(fill in after Vercel deployment)*

### Backend
- Framework: FastAPI
- Language: Python 3.11+
- Auth: JWT (HS256)
- PDF: ReportLab
- HTTP client: httpx (for WhatsApp API)
- Local dev URL: http://localhost:8000
- Production URL: *(fill in after Railway deployment)*

---

## Key Design Decisions
| Decision | Rationale |
|---|---|
| Monorepo structure | Keeps frontend and backend in one repo for simpler handoff |
| Supabase service role from backend | Frontend never has direct DB access; all auth and data goes through FastAPI |
| `find-or-create` for customers | Avoids duplicate entry — customer is auto-created on first bill |
| `GREATEST(qty - deduct, 0)` in inventory | Prevents negative stock from data inconsistency |
| JWT in localStorage | Simpler for PWA offline; mitigated by HTTPS-only + short expiry |
| Bill number format CA-YYYY-NNNN | Human-readable, year-scoped, padded sequence |
| Settings stored as key-value table | Easy to add new settings without schema migration |
| Landing page uses `LandingLayout` (not `AppShell`) | Keeps public marketing UI completely separate from the protected admin app |
| Auth redirect in LandingPage | If JWT is valid on landing visit, user is sent straight to `/dashboard` — no double login |
| `Button` + `Input` shared components enforced | No raw `<button>` or `<input>` tags in pages — ensures design system is always enforced |
| CSS-only animations (`@keyframes`) | Avoids Framer Motion dependency; keeps bundle small for PWA |
| `Inter` as sole typeface | Clean, highly legible, available on all platforms via Google Fonts |
| 4px base grid (`spacing` tokens) | All padding/margin values are Tailwind multiples of 4px for perfect visual rhythm |

---

## File Structure Snapshot

```
CarAdda/
  frontend/
    src/
      components/
        ui/             ← Button, Card, Spinner, Badge
        auth/           ← LoginForm, ProtectedRoute
        layout/         ← Sidebar, TopBar
        landing/        ← LandingNavbar, HeroSection, ServicesSection,
                           FeaturesSection, HowItWorksSection, InstallAppSection,
                           TestimonialsSection, CallToActionSection, LandingFooter
        dashboard/      ← KpiCard, LowStockAlert, QuickBillButton, SalesChart
        customers/      ← CustomerCard, CustomerHistoryTable, VehicleTag
        billing/        ← BillForm, ServiceSelector, BillActions, BillCard
        inventory/      ← InventoryTable, StockLevelBadge, AddStockModal
        vendors/        ← VendorCard, PurchaseForm, PurchaseTable
        expenses/       ← ExpenseForm, ExpenseTable
        reports/        ← SalesBarChart, ExpenseDoughnutChart, TopServicesTable
        settings/       ← ShopInfoForm, WhatsAppConfigForm, InvoiceLogoUpload
      pages/
        landing/        ← LandingPage (public, unauthenticated)
        auth/           ← LoginPage
        dashboard/      ← DashboardPage
        customers/      ← CustomersPage, CustomerDetailPage
        billing/        ← BillListPage, CreateBillPage, BillDetailPage
        inventory/      ← InventoryPage, InventoryFormPage, InventoryDetailPage
        vendors/        ← VendorsPage, VendorFormPage, PurchasesPage, RecordPurchasePage
        expenses/       ← ExpensesPage, AddExpensePage
        reports/        ← ReportsPage
        settings/       ← SettingsPage
      layouts/          ← AppShell, AuthLayout, LandingLayout
      hooks/            ← useDebounce, usePWAInstall, useCustomerSearch, useInView
      services/         ← apiClient, authService, billingService, customerService,
                          inventoryService, vendorService, expenseService,
                          reportService, settingsService
      state/            ← authStore, uiStore, dashboardStore, customerStore,
                          billingStore, inventoryStore, vendorStore,
                          expenseStore, reportStore
      utils/            ← formatDate, formatCurrency
      styles/           ← global.css, index.css
    public/
      manifest.json
      service-worker.js
      icon-192.png
      icon-512.png

  backend/
    app/
      api/v1/           ← health, auth, billing, customers, inventory,
                          vendors, purchases, expenses, reports, settings
      services/         ← auth_service, billing_service, customer_service,
                          inventory_service, vendor_service, report_service,
                          pdf_service, whatsapp_service, settings_service
      models/           ← Pydantic response models
      schemas/          ← Pydantic request DTOs
      database/         ← supabase_client.py
      core/             ← config.py, security.py
      utils/            ← logger.py
    main.py
    requirements.txt

  docs/
    phase-1-foundation.md
    phase-2-authentication.md
    phase-3-database.md
    phase-4-dashboard.md
    phase-5-customers.md
    phase-6-billing.md
    phase-7-inventory.md
    phase-8-vendors.md
    phase-9-expenses-reports.md
    phase-10-integrations-pwa.md
    landing-page.md             ← Landing page design & implementation plan
    UI_UX_Guidelines.md         ← Global design system (READ BEFORE WRITING ANY UI CODE)

  car_adda_prd.md
  PROJECT_CONTEXT.md
  README.md
```

---

## Landing Page Module

**Status:** ✅ Complete — integrated and running
**Design Doc:** [`docs/landing-page.md`](docs/landing-page.md)

### Purpose
The landing page is the **public, unauthenticated entry point** to the CAR ADDA system. It is a standalone marketing page that:
- Introduces the system to new users
- Lists all 8 supported services
- Explains 6 core features
- Guides users through the 4-step workflow
- Prompts login (returning admin) or PWA installation (first-time mobile user)

### Route
| Route | Component | Auth |
|---|---|---|
| `/` | `LandingPage.tsx` | ❌ Public |

> If a valid JWT exists in the auth store, `LandingPage` immediately redirects to `/dashboard`.

### Components Created
| Component | File | Section |
|---|---|---|
| `LandingNavbar` | `components/landing/LandingNavbar.tsx` | Sticky top nav with Login button |
| `HeroSection` | `components/landing/HeroSection.tsx` | Full-viewport product headline + CTAs |
| `ServicesSection` | `components/landing/ServicesSection.tsx` | 8 service tiles in a responsive grid |
| `FeaturesSection` | `components/landing/FeaturesSection.tsx` | 6 feature benefit cards |
| `HowItWorksSection` | `components/landing/HowItWorksSection.tsx` | 4-step numbered workflow |
| `InstallAppSection` | `components/landing/InstallAppSection.tsx` | PWA install prompt + instructions |
| `TestimonialsSection` | `components/landing/TestimonialsSection.tsx` | 3 shop owner quotes |
| `CallToActionSection` | `components/landing/CallToActionSection.tsx` | Final push with Login + Install buttons |
| `LandingFooter` | `components/landing/LandingFooter.tsx` | Contact info, links, copyright |
| `LandingPage` | `pages/landing/LandingPage.tsx` | Assembles all sections |
| `LandingLayout` | `layouts/LandingLayout.tsx` | Public wrapper (no Sidebar/AppShell) |

### New Hook
| Hook | File | Purpose |
|---|---|---|
| `useInView` | `hooks/useInView.ts` | IntersectionObserver for scroll-triggered animations |

### Modified Files
| File | Change |
|---|---|
| `src/App.tsx` | Add `<Route path="/" element={<LandingPage />} />` before protected routes |
| `src/styles/global.css` | Add `@keyframes fadeInUp` and `.animate-fadeInUp` |

### No Backend Dependency
The landing page is fully static React — no new backend APIs or database tables required.
The only live connections are:
- `/login` route (Phase 2)
- PWA install prompt (uses `usePWAInstall` hook from Phase 10, stub usable earlier)

### Recommended Implementation Order
```
Phase 1 (Foundation)
  └── Landing Page
        └── Phase 2 (Auth — provides /login target)
              └── Phase 3 onwards
```

---

## UI/UX Design System

**Status:** 📋 Defined — document complete, must be followed during all frontend implementation
**Design Doc:** [`docs/UI_UX_Guidelines.md`](docs/UI_UX_Guidelines.md)

> ⚠️ **AI AGENT RULE:** Before writing any frontend component, page, or layout, the implementing agent MUST read `docs/UI_UX_Guidelines.md` in full.

### What It Defines

| Section | Rule Summary |
|---|---|
| **Color Palette** | 14 named tokens. Navy / Red / Gold system. No raw hex values in code. |
| **Typography** | `Inter` font. 9-level type scale from Display (36px) to Micro (10px). |
| **Button Styles** | 5 variants: Primary, Secondary, Outline, Ghost, Destructive. 5 sizes. |
| **Form Inputs** | 5 states: Default, Focus, Filled, Error, Disabled. Always use shared components. |
| **Card Layouts** | 5 card types: Base, KPI Widget, Data, Service Tile, Alert, Stat. |
| **Table Layouts** | Column type rules, status badges, empty states, pagination, sortable headers. |
| **Spacing** | 4px base grid. All spacing uses Tailwind default increments only. |
| **Responsive Breakpoints** | 5 breakpoints. Mobile-first. Behaviour defined for every major element. |
| **Micro-Interactions** | 4 transition speeds. Hover states for all elements. `active:scale-95` universal. |

### Critical Enforcement Rules

- **Never use raw `<button>` or `<input>` elements** in page or feature components — always use shared `Button` and `Input` from `src/components/ui/`
- **Never hardcode hex color values** — always use Tailwind tokens (`text-red`, `bg-navy-800`, etc.)
- **All loading states** use either a `<Spinner>` component or skeleton `animate-pulse` blocks — never blank screens
- **All interactive elements** must have `focus-visible:ring-2 focus-visible:ring-red` for keyboard accessibility
- **All success/error feedback** uses `react-hot-toast` — never `window.alert()`
- **Toast style config** follows the custom dark theme defined in the guidelines
- **Animations** are CSS-only (`@keyframes` in `global.css`) — no Framer Motion or GSAP

### Files Created / Modified by Design System

| File | Change |
|---|---|
| `tailwind.config.ts` | Custom `colors`, `fontFamily`, spacing tokens |
| `src/styles/global.css` | CSS custom properties, `@keyframes`, `.animate-*` utility classes, body font |
| `src/styles/index.css` | Tailwind directives, font import |
| `src/components/ui/Button.tsx` | All 5 variants, 5 sizes, loading + disabled states |
| `src/components/ui/Input.tsx` | All 5 states, label, helper, error |
| `src/components/ui/Card.tsx` | Base card wrapper |
| `src/components/ui/Badge.tsx` | Status badge with 5 variants |
| `src/components/ui/Spinner.tsx` | Animated SVG circle spinner |
| `src/components/ui/DataTable.tsx` | Shared table with empty state + pagination |

---

## Instructions for Resuming AI Development Agent

1. **Read this file first.** Identify the last completed phase and the next phase to implement.
2. **Read `docs/UI_UX_Guidelines.md`** before writing any frontend component or page.
3. **Read the relevant phase doc** in `docs/phase-N-*.md` before writing any code.
4. **Read existing files** in the target folder before creating new ones — never overwrite without checking.
5. **Follow the folder structure** defined in this file exactly.
6. **Do not modify the database schema** in phases after Phase 3 unless the phase doc explicitly requires it.
7. **After completing a phase**, update the Status table above and add a Phase Completion Log entry.
8. **Never commit `.env` files** — use `.env.example` only.
9. **API versioning**: All backend routes are prefixed `/api/v1/` in production but written as `/endpoint` in docs for brevity.
