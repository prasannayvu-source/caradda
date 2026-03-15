# Phase 2 — Authentication System

## Phase Objective
Implement a complete, secure admin authentication system using JWT tokens and Supabase Auth. After this phase, the owner can log in via phone + password, receive a JWT, and all protected API endpoints enforce token validation.

---

## Features Implemented
- Admin login page (phone + password)
- JWT token generation and validation
- Secure password hashing (bcrypt)
- Protected route middleware on the backend
- Frontend route guards (private routes redirect to login)
- Persistent session via localStorage
- Logout functionality

---

## Frontend Implementation

### Pages Created
| Page | Route | File |
|---|---|---|
| Login | `/login` | `src/pages/auth/LoginPage.tsx` |

### UI Components
```
src/components/auth/
  LoginForm.tsx          ← phone + password fields, submit handler
  ProtectedRoute.tsx     ← HOC: redirects unauthenticated to /login
```

### LoginForm Fields
| Field | Type | Validation |
|---|---|---|
| Phone Number | `tel` input | 10-digit Indian mobile, required |
| Password | `password` input | min 8 chars, required |

### State Management (authStore.ts)
```ts
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (phone: string, password: string) => Promise<void>
  logout: () => void
}
```

- On login: stores JWT in `localStorage` and user object in Zustand
- On page reload: reads token from `localStorage`, validates with `/auth/me`
- On logout: clears store + localStorage + redirects to `/login`

### API Communication
```ts
// src/services/authService.ts
export const loginUser = (phone: string, password: string) =>
  apiClient.post('/auth/login', { phone, password })

export const getMe = () =>
  apiClient.get('/auth/me')   // token sent via Authorization header
```

### Route Configuration (App.tsx)
```tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<ProtectedRoute />}>
    <Route element={<AppShell />}>
      <Route path="/" element={<Dashboard />} />
      {/* all future protected routes go here */}
    </Route>
  </Route>
</Routes>
```

### Layout Structure
- Unauthenticated → `AuthLayout` (centered card, dark background, logo)
- Authenticated → `AppShell` (sidebar + main content)

---

## Backend Implementation

### APIs Created
| Endpoint | Method | Description |
|---|---|---|
| `POST /auth/login` | POST | Validate phone+password, return JWT |
| `GET /auth/me` | GET | Return current user from JWT |

### Request / Response

**POST `/auth/login`**
```json
// Request
{ "phone": "9876543210", "password": "securepass" }

// Response 200
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": { "id": "uuid", "phone": "9876543210", "name": "Admin" }
}

// Response 401
{ "detail": "Invalid phone number or password" }
```

**GET `/auth/me`**
```json
// Header: Authorization: Bearer <token>
// Response 200
{ "id": "uuid", "phone": "9876543210", "name": "Admin", "role": "admin" }
```

### Service Layer (app/services/auth_service.py)
```python
def authenticate_user(phone: str, password: str) -> User | None:
    user = get_user_by_phone(phone)            # DB lookup
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def create_access_token(data: dict) -> str:
    payload = data | {"exp": datetime.utcnow() + timedelta(hours=24)}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")
```

### Validation Logic
- Phone: must be exactly 10 digits, numeric
- Password: minimum 8 characters
- All fields required; 422 returned if missing

### Security Rules
- Passwords hashed with `bcrypt` (cost factor 12)
- JWT signed with HS256 using `JWT_SECRET` from env
- Token expiry: 24 hours
- `get_current_user` dependency injected into all protected routes
- HTTPS enforced in production (Railway handles TLS)

### Middleware (app/core/security.py)
```python
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db=Depends(get_db)
) -> User:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("sub")
        ...
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
```

---

## Database Implementation

### Table: `users`
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, default gen_random_uuid() |
| name | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(15) | UNIQUE, NOT NULL |
| hashed_password | TEXT | NOT NULL |
| role | VARCHAR(20) | DEFAULT 'admin' |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | DEFAULT now() |

**Indexes:** `idx_users_phone` on `phone`

**Seed:** One default admin record inserted via migration script on first deploy.

### RLS Policies (Supabase)
- Service role key used from backend (bypasses RLS for server-to-server)
- Anon key never used for auth-sensitive tables

---

## Integration Logic
- `apiClient.ts` interceptor attaches `Authorization: Bearer <token>` to every request
- On 401 response, interceptor calls `logout()` and redirects to `/login`

---

## Phase Relationship
- **Builds on Phase 1:** Uses `apiClient.ts`, `AuthLayout`, Zustand stores, folder structure
- **Connects to Phase 3:** `users` table FK referenced by future tables (bills, expenses)
- **Connects to Phase 4:** Dashboard route is gated behind `ProtectedRoute`
- **Connects to all phases:** Every backend endpoint uses `get_current_user` dependency
