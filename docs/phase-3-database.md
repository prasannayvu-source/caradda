# Phase 3 — Core Database Schema Design

## Phase Objective
Design and apply the complete relational database schema in Supabase PostgreSQL. All tables, relationships, indexes, and Row Level Security policies are created here so that every future phase only needs to write service logic — not alter the schema.

---

## Features Implemented
- Full 12-table relational schema
- Foreign key relationships between all entities
- Supabase RLS policies
- Database seed data (services list, default admin)
- Supabase client wrapper with typed query helpers

---

## Database Implementation

### Entity Relationship Overview
```
users ──< bills >── bill_items ──> services
       │                    └──> inventory (deduction)
       customers ──< vehicles
       customers ──< bills
       vendors ──< purchases ──> inventory
       expenses
       payments
```

---

### Table: `customers`
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, default gen_random_uuid() |
| name | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(15) | UNIQUE, NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | DEFAULT now() |

**Indexes:** `idx_customers_phone`

---

### Table: `vehicles`
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| customer_id | UUID | FK → customers.id ON DELETE CASCADE |
| car_number | VARCHAR(20) | NOT NULL |
| car_model | VARCHAR(100) | |
| created_at | TIMESTAMPTZ | DEFAULT now() |

**Indexes:** `idx_vehicles_customer_id`, `idx_vehicles_car_number`

---

### Table: `services`

> Master list of all billable services.

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| name | VARCHAR(150) | NOT NULL |
| category | VARCHAR(50) | e.g. 'wash', 'painting', 'detailing' |
| base_price | NUMERIC(10,2) | NOT NULL |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMPTZ | DEFAULT now() |

**Seed rows:**
| name | category | base_price |
|---|---|---|
| Normal Wash | wash | 500.00 |
| Premium Wash | wash | 800.00 |
| Banner Painting | painting | — |
| Fender Painting | painting | — |
| Door Painting | painting | — |
| Full Car Painting | painting | — |
| Ceramic Coating | detailing | — |
| PPF Protection | detailing | — |
| Interior Detailing | detailing | — |
| Car Accessories | accessories | — |
| Denting & Tinkering | repair | — |

---

### Table: `bills`
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| bill_number | VARCHAR(20) | UNIQUE, NOT NULL (e.g. CA-2024-0001) |
| customer_id | UUID | FK → customers.id |
| vehicle_id | UUID | FK → vehicles.id |
| user_id | UUID | FK → users.id (created by) |
| subtotal | NUMERIC(10,2) | NOT NULL |
| discount | NUMERIC(10,2) | DEFAULT 0 |
| total_amount | NUMERIC(10,2) | NOT NULL |
| payment_method | VARCHAR(20) | 'cash' \| 'upi' |
| payment_status | VARCHAR(20) | 'paid' \| 'pending' |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | DEFAULT now() |

**Indexes:** `idx_bills_customer_id`, `idx_bills_created_at`

---

### Table: `bill_items`
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| bill_id | UUID | FK → bills.id ON DELETE CASCADE |
| service_id | UUID | FK → services.id |
| description | VARCHAR(200) | |
| quantity | INTEGER | DEFAULT 1 |
| unit_price | NUMERIC(10,2) | NOT NULL |
| line_total | NUMERIC(10,2) | GENERATED AS quantity * unit_price |

**Indexes:** `idx_bill_items_bill_id`

---

### Table: `inventory`
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| item_name | VARCHAR(150) | NOT NULL |
| category | VARCHAR(80) | e.g. 'chemical', 'cloth', 'accessory' |
| quantity | NUMERIC(10,2) | NOT NULL DEFAULT 0 |
| unit | VARCHAR(20) | 'ml', 'litre', 'pcs', 'kg' |
| low_stock_threshold | NUMERIC(10,2) | DEFAULT 5 |
| last_updated | TIMESTAMPTZ | DEFAULT now() |

**Indexes:** `idx_inventory_item_name`

---

### Table: `vendors`
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| name | VARCHAR(150) | NOT NULL |
| phone | VARCHAR(15) | |
| address | TEXT | |
| created_at | TIMESTAMPTZ | DEFAULT now() |

---

### Table: `purchases`
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| vendor_id | UUID | FK → vendors.id |
| inventory_id | UUID | FK → inventory.id |
| quantity | NUMERIC(10,2) | NOT NULL |
| unit_price | NUMERIC(10,2) | NOT NULL |
| total_price | NUMERIC(10,2) | GENERATED AS quantity * unit_price |
| purchase_date | DATE | NOT NULL |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | DEFAULT now() |

**Indexes:** `idx_purchases_vendor_id`, `idx_purchases_purchase_date`

---

### Table: `expenses`
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| name | VARCHAR(150) | NOT NULL |
| category | VARCHAR(80) | 'electricity', 'water', 'chemical', 'equipment', 'other' |
| amount | NUMERIC(10,2) | NOT NULL |
| expense_date | DATE | NOT NULL |
| notes | TEXT | |
| user_id | UUID | FK → users.id |
| created_at | TIMESTAMPTZ | DEFAULT now() |

**Indexes:** `idx_expenses_expense_date`

---

### Table: `payments`
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| bill_id | UUID | FK → bills.id |
| amount | NUMERIC(10,2) | NOT NULL |
| payment_method | VARCHAR(20) | 'cash' \| 'upi' |
| reference | VARCHAR(100) | UPI transaction ID or receipt |
| paid_at | TIMESTAMPTZ | DEFAULT now() |

---

### Table: `inventory_usage`

> Tracks which inventory items were consumed per bill item.

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| bill_id | UUID | FK → bills.id |
| inventory_id | UUID | FK → inventory.id |
| quantity_used | NUMERIC(10,2) | NOT NULL |
| used_at | TIMESTAMPTZ | DEFAULT now() |

---

### Table: `service_inventory_map`

> Maps which inventory items are auto-deducted for a given service.

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| service_id | UUID | FK → services.id |
| inventory_id | UUID | FK → inventory.id |
| qty_per_service | NUMERIC(10,2) | NOT NULL |

---

## RLS Policies
- All tables: `ENABLE ROW LEVEL SECURITY`
- Policy: `authenticated` role (from JWT) can SELECT / INSERT / UPDATE / DELETE own-org rows
- Backend uses `service_role` key → bypasses RLS for server operations
- Frontend never has direct DB access (always goes through FastAPI)

---

## Integration Logic
- `supabase_client.py` provides a single `get_supabase()` function returning the admin client
- All database access in Phase 4+ uses typed Pydantic models matching these table schemas
- `service_inventory_map` is the key table that drives auto-deduction in Phase 7

---

## Phase Relationship
- **Builds on Phase 2:** `users` table FK used in bills, expenses
- **Enables Phase 4:** Dashboard queries aggregate `bills.total_amount`, `expenses.amount`
- **Enables Phase 5:** `customers` and `vehicles` tables
- **Enables Phase 6:** `bills`, `bill_items`, `payments` tables
- **Enables Phase 7:** `inventory`, `inventory_usage`, `service_inventory_map` tables
- **Enables Phase 8:** `vendors`, `purchases` tables
- **Enables Phase 9:** All tables used for report aggregation
