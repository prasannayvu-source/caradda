# Phase 10 — External Integrations and PWA Optimization

## Phase Objective
Wire up all external integrations (WhatsApp Cloud API for bill sending, ReportLab PDF for invoice generation) and optimize the app as a fully installable Progressive Web App with offline capability, fast loading, and a production-grade deployment pipeline.

---

## Features Implemented
- WhatsApp Cloud API integration (bill sending via WhatsApp message)
- Full PDF invoice generation with CAR ADDA branding (ReportLab)
- Service worker with caching strategy (offline support)
- PWA manifest with icons + theme
- Installable "Add to Home Screen" prompt
- Performance optimization (lazy loading, code splitting)
- Production deployment: Vercel (frontend) + Railway (backend)
- Settings page (shop info, WhatsApp config, invoice logo)
- End-to-end integration tests

---

## Frontend Implementation

### Pages Created
| Page | Route | File |
|---|---|---|
| Settings | `/settings` | `src/pages/settings/SettingsPage.tsx` |

### UI Components
```
src/components/settings/
  ShopInfoForm.tsx          ← business name, address, phone, GST (optional)
  WhatsAppConfigForm.tsx    ← API token input, phone number ID, test send
  InvoiceLogoUpload.tsx     ← logo file upload for PDF header
  InstallPromptBanner.tsx   ← "Add to Home Screen" banner (PWA)

src/components/billing/ (updated)
  BillActions.tsx           ← WhatsApp button now fully wired
  PDFPreview.tsx            ← iframe preview of generated PDF
```

### PWA Implementation

**service-worker.js (full implementation)**
```js
const CACHE_NAME = 'caradda-v1';
const STATIC_ASSETS = [
  '/', '/index.html', '/manifest.json',
  '/icon-192.png', '/icon-512.png'
];

// Install: cache static shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Fetch: network-first for API, cache-first for assets
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) {
    // Network first
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request)
      )
    );
  } else {
    // Cache first
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request)
      )
    );
  }
});
```

**manifest.json (complete)**
```json
{
  "name": "CAR ADDA",
  "short_name": "CarAdda",
  "description": "Car Wash & Detailing Management System",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0F172A",
  "theme_color": "#EF4444",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "categories": ["business", "productivity"]
}
```

**Install Prompt Hook**
```ts
// src/hooks/usePWAInstall.ts
export const usePWAInstall = () => {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    })
  }, [])

  const installApp = () => prompt?.prompt()
  return { canInstall: !!prompt, installApp }
}
```

### Performance Optimizations
```ts
// vite.config.ts — code splitting
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        charts: ['recharts'],
        ui: ['lucide-react']
      }
    }
  }
}
```
- All page components loaded with `React.lazy()` + `<Suspense>`
- Images compressed to WebP
- Tailwind CSS purged in production build

### API Communication (Settings)
```ts
// src/services/settingsService.ts
export const getSettings = () => apiClient.get('/settings')
export const updateSettings = (data: SettingsDto) => apiClient.put('/settings', data)
export const uploadLogo = (file: File) => {
  const form = new FormData()
  form.append('logo', file)
  return apiClient.post('/settings/logo', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
```

---

## Backend Implementation

### APIs Created
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `POST /billing/:id/whatsapp` | POST | JWT | Send bill via WhatsApp Cloud API |
| `GET /billing/:id/pdf` | GET | JWT | Stream branded PDF invoice |
| `GET /settings` | GET | JWT | Fetch shop settings |
| `PUT /settings` | PUT | JWT | Update shop info |
| `POST /settings/logo` | POST | JWT | Upload shop logo |

### WhatsApp Cloud API Integration
```python
# app/services/whatsapp_service.py
import httpx

WHATSAPP_API_URL = "https://graph.facebook.com/v18.0/{phone_number_id}/messages"

async def send_bill_whatsapp(bill: BillDetail, settings: ShopSettings):
    message_body = f"""Hello {bill.customer_name},

Thank you for visiting *{settings.shop_name}*.

🚗 Car: {bill.car_number}
🔧 Service: {bill.service_summary}
💰 Amount: ₹{bill.total_amount:,.2f}
🧾 Bill No: {bill.bill_number}
📅 Date: {bill.created_at.strftime('%d %b %Y')}

Payment: {bill.payment_method.upper()}

Thank you for your business! 🙏"""

    payload = {
        "messaging_product": "whatsapp",
        "to": f"91{bill.customer_phone}",
        "type": "text",
        "text": { "body": message_body }
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            WHATSAPP_API_URL.format(phone_number_id=settings.wa_phone_number_id),
            headers={
                "Authorization": f"Bearer {settings.wa_access_token}",
                "Content-Type": "application/json"
            },
            json=payload
        )
        response.raise_for_status()
        return response.json()
```

### PDF Invoice Generation (ReportLab)
```python
# app/services/pdf_service.py
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

def generate_invoice_pdf(bill: BillDetail, settings: ShopSettings) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()
    elements = []

    # 1. Header: Logo + Shop Name
    if settings.logo_path:
        elements.append(Image(settings.logo_path, width=80, height=80))
    elements.append(Paragraph(settings.shop_name, styles['Title']))
    elements.append(Paragraph(settings.address, styles['Normal']))
    elements.append(Spacer(1, 20))

    # 2. Bill Info
    elements.append(Paragraph(f"Bill No: {bill.bill_number}", styles['Normal']))
    elements.append(Paragraph(f"Date: {bill.created_at.strftime('%d %b %Y')}", styles['Normal']))
    elements.append(Spacer(1, 10))

    # 3. Customer Info
    elements.append(Paragraph(f"Customer: {bill.customer_name}", styles['Normal']))
    elements.append(Paragraph(f"Phone: {bill.customer_phone}", styles['Normal']))
    elements.append(Paragraph(f"Car: {bill.car_number}", styles['Normal']))
    elements.append(Spacer(1, 20))

    # 4. Items Table
    data = [["Service", "Qty", "Unit Price", "Total"]]
    for item in bill.items:
        data.append([item.service_name, item.quantity, f"₹{item.unit_price}", f"₹{item.line_total}"])
    data.append(["", "", "Total", f"₹{bill.total_amount}"])

    table = Table(data, colWidths=[250, 50, 100, 100])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 20))

    # 5. Payment Method
    elements.append(Paragraph(f"Payment Method: {bill.payment_method.upper()}", styles['Normal']))
    elements.append(Spacer(1, 30))

    # 6. Footer
    elements.append(Paragraph("Thank you for choosing CAR ADDA! 🚗", styles['Normal']))

    doc.build(elements)
    return buffer.getvalue()
```

### Settings Storage
```python
# app/services/settings_service.py
# Stored in a `settings` table (key-value) in Supabase
# Keys: shop_name, address, phone, wa_access_token, wa_phone_number_id, logo_url

def get_settings() -> ShopSettings:
    rows = supabase.table("settings").select("key, value").execute()
    return ShopSettings(**{r["key"]: r["value"] for r in rows.data})
```

> **Security note:** `wa_access_token` is stored encrypted at rest using `pgcrypto` Supabase extension. Never exposed in API responses.

---

## Database Implementation

### Table: `settings` (new in this phase)
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| key | VARCHAR(100) | UNIQUE, NOT NULL |
| value | TEXT | |
| is_encrypted | BOOLEAN | DEFAULT false |
| updated_at | TIMESTAMPTZ | DEFAULT now() |

**Seed rows:** `shop_name`, `address`, `phone`, `logo_url`, `wa_phone_number_id`, `wa_access_token` (encrypted)

---

## Deployment Configuration

### Frontend (Vercel)
```
vercel.json:
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
env vars set in Vercel dashboard: `VITE_API_BASE_URL`

### Backend (Railway)
```
Procfile:
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
env vars set in Railway dashboard: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `FRONTEND_URL`

---

## Integration Logic

### End-to-End Bill Send Flow
```
1. Owner taps "Send WhatsApp" on BillDetailPage
2. Frontend: POST /billing/:id/whatsapp
3. Backend: billing_router → whatsapp_service.send_bill_whatsapp()
4. whatsapp_service: fetches bill detail + shop settings
5. Builds message body with customer name, service, amount, bill number
6. Calls WhatsApp Cloud API (graph.facebook.com)
7. Returns 200 success → Frontend shows toast "Sent via WhatsApp ✓"
```

### End-to-End PDF Download Flow
```
1. Owner taps "Download PDF" on BillDetailPage
2. Frontend: GET /billing/:id/pdf (responseType: blob)
3. Backend: pdf_service.generate_invoice_pdf()
4. StreamingResponse with Content-Type: application/pdf
5. Browser triggers file download: CA-2024-0042.pdf
```

---

## Phase Relationship
- **Completes Phase 6:** WhatsApp send and PDF download stubs are now fully implemented
- **Completes Phase 1:** service-worker.js stub from Phase 1 is now fully implemented
- **Builds on all phases:** Settings page allows shop configuration that affects all modules
- **System complete:** After this phase, all 10 phases form a working end-to-end CAR ADDA PWA

---

## Future Enhancement Hooks (Left Ready for Expansion)
| Feature | Where to Add |
|---|---|
| Multi-employee login | `users` table: add `employee` role; gate routes by role |
| Multiple branches | Add `branch_id` FK to `users`, `bills`, `expenses` tables |
| GST billing | Add `gst_rate`, `gst_amount` to `bills`; update PDF service |
| Online booking | New `bookings` table; new `/bookings` API + page |
| Loyalty program | New `loyalty_points` column in `customers`; reward triggers |
| SMS notifications | Add `sms_service.py` alongside `whatsapp_service.py` |
