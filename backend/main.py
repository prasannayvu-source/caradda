from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.services import router as services_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.customers import router as customers_router
from app.api.v1.billing import router as billing_router
from app.api.v1.inventory import router as inventory_router
from app.api.v1.vendors import router as vendors_router
from app.api.v1.expenses import router as expenses_router
from app.api.v1.settings import router as settings_router
from app.core.config import settings

app = FastAPI(title="CAR ADDA API", version="1.0.0")

import re

ALLOWED_ORIGINS = [
    settings.FRONTEND_URL,                     # e.g. https://caradda-frontend.vercel.app
    "https://caradda-frontend.vercel.app",     # primary Vercel domain
    "http://localhost:5173",                   # local dev
    "http://localhost:5174",
]

# Also accept any Vercel preview deployment URL for this project
ALLOWED_ORIGIN_REGEX = r"https://caradda-frontend.*\.vercel\.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router,   prefix="/api/v1/health",    tags=["Health"])
app.include_router(auth_router,     prefix="/api/v1/auth",      tags=["Authentication"])
app.include_router(services_router, prefix="/api/v1/services",  tags=["Services"])
app.include_router(dashboard_router,prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(customers_router,prefix="/api/v1/customers", tags=["Customers"])
app.include_router(billing_router,  prefix="/api/v1/billing",   tags=["Billing"])
app.include_router(inventory_router,prefix="/api/v1/inventory", tags=["Inventory"])
app.include_router(vendors_router,  prefix="/api/v1",           tags=["Vendors & Purchases"])
app.include_router(expenses_router, prefix="/api/v1",           tags=["Expenses & Reports"])
app.include_router(settings_router, prefix="/api/v1",           tags=["Settings"])
