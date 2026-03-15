# Phase 1 — Project Foundation and Environment Setup

## Phase Objective
Establish the complete project scaffold, development environment, tooling configuration, and CI-ready folder structure for both the React PWA frontend and the FastAPI backend. After this phase the repository is runnable, has hot-reload in dev, passes a "hello world" health-check, and every future phase can be dropped in without restructuring.

---

## Features Implemented
- Monorepo folder structure (frontend + backend + docs)
- React + Vite project with Tailwind CSS, TypeScript
- FastAPI backend with uvicorn dev server
- Supabase project initialised (tables added in Phase 3)
- PWA manifest.json + service-worker stub registered
- Environment variable system (.env files, never committed)
- Linting, formatting (ESLint, Prettier, Black, isort)
- Git repository with .gitignore

---

## Frontend Implementation

### Project Bootstrap
```bash
# inside /frontend
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom axios zustand react-hot-toast lucide-react recharts
```

### Pages Created
| Page | Path | Purpose |
|---|---|---|
| AppShell | `src/layouts/AppShell.tsx` | Persistent sidebar + topbar wrapper |
| NotFound | `src/pages/NotFound.tsx` | 404 fallback |

### Reusable Components
- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Spinner.tsx`
- `src/components/ui/Badge.tsx`

### Tailwind Design Tokens (tailwind.config.ts)
```ts
colors: {
  navy:  { DEFAULT: '#0F172A', 800: '#1E293B', 700: '#334155' },
  red:   { DEFAULT: '#EF4444', 600: '#DC2626' },
  gold:  { DEFAULT: '#FACC15', 500: '#EAB308' },
}
```

### PWA Setup
`public/manifest.json`:
```json
{
  "name": "CAR ADDA",
  "short_name": "CarAdda",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#EF4444",
  "icons": [{ "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" }]
}
```

`public/service-worker.js`: stub that caches app shell (expanded in Phase 10).

### State Management
Zustand store skeleton:
```
src/state/
  authStore.ts        ← user session
  uiStore.ts          ← sidebar open/close, toast
```

### API Communication
```
src/services/
  apiClient.ts        ← axios instance with base URL + JWT interceptor
```

### Folder Structure
```
frontend/
  src/
    components/
      ui/             ← atomic design primitives
    pages/            ← one file per route
    layouts/          ← AppShell, AuthLayout
    hooks/            ← custom React hooks
    services/         ← apiClient + per-feature service files
    state/            ← zustand stores
    utils/            ← formatDate, formatCurrency helpers
    styles/           ← global.css, index.css
  public/
    manifest.json
    service-worker.js
    icon-192.png
    icon-512.png
  index.html
  vite.config.ts
  tailwind.config.ts
  tsconfig.json
  .env.example
```

---

## Backend Implementation

### Project Bootstrap
```bash
# inside /backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install fastapi uvicorn[standard] python-dotenv pydantic supabase bcrypt python-jose reportlab httpx
pip freeze > requirements.txt
```

### APIs Created
| Endpoint | Method | Purpose |
|---|---|---|
| `GET /health` | GET | Server health check |

### Request / Response Structure
```json
GET /health → 200
{ "status": "ok", "version": "1.0.0" }
```

### Folder Structure
```
backend/
  app/
    api/
      v1/
        __init__.py
        health.py
    services/           ← business logic (empty stubs)
    models/             ← SQLAlchemy / Pydantic models (empty)
    schemas/            ← Pydantic request/response shapes
    database/
      supabase_client.py ← initialise Supabase Python client
    core/
      config.py         ← Settings from .env
      security.py       ← JWT helpers (stub)
    utils/
      logger.py
  main.py               ← FastAPI app factory, CORS, router mount
  requirements.txt
  .env.example
```

### main.py skeleton
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.health import router as health_router
from app.core.config import settings

app = FastAPI(title="CAR ADDA API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/health", tags=["Health"])
```

### Environment Variables (.env.example)
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
FRONTEND_URL=http://localhost:5173
```

---

## Database Implementation
- Supabase project created (no tables yet — see Phase 3)
- `supabase_client.py` initialised with URL + service-role key
- `users` table stub planned (created in Phase 2)

---

## Integration Logic
None in this phase. Hooks for WhatsApp, PDF, and analytics are folder stubs only.

---

## Phase Relationship
- **Previous phase:** None (this is the root)
- **Connects to Phase 2:** Auth pages use `AuthLayout`, `apiClient`, and the `/auth` router
- **Connects to Phase 3:** `supabase_client.py` is used by all future service files
- **Connects to all phases:** The folder structure and design tokens established here are inherited by every future phase
