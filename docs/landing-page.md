# Landing Page — Design and Implementation Plan

> **Extension of the CAR ADDA Implementation Blueprint**
> This document is additive. It does not replace any previously defined phase.
> The landing page is a public-facing marketing entry point that lives inside the same React frontend project defined in Phase 1.

---

## Purpose

The landing page serves as the **public, unauthenticated entry point** to the CAR ADDA system. It is the first screen a visitor sees before logging in or installing the PWA.

It must:
- Introduce CAR ADDA and explain what the system does
- Communicate key product benefits for the shop owner
- Display all supported service categories
- Prompt the user to **log in** (returning admin) or **install the PWA** (first-time installation on mobile)
- Be fully responsive and mobile-first, matching the dark automotive theme defined in the PRD

The landing page is **not** part of the authenticated app shell. It uses its own `LandingLayout` wrapper with its own navigation, completely separate from `AppShell`.

---

## Route and Integration

| Route | Component | Auth Required |
|---|---|---|
| `/` (root, unauthenticated) | `LandingPage.tsx` | ❌ No |
| `/login` | `LoginPage.tsx` | ❌ No |
| `/dashboard` | `DashboardPage.tsx` | ✅ Yes (ProtectedRoute) |

### Routing Logic (App.tsx update)

```tsx
<Routes>
  {/* Public routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />

  {/* Protected app routes */}
  <Route element={<ProtectedRoute />}>
    <Route element={<AppShell />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      {/* ... all other app routes */}
    </Route>
  </Route>
</Routes>
```

> **Auth redirect logic:** If the user is already authenticated (valid JWT in `authStore`), visiting `/` redirects automatically to `/dashboard`. This check runs in `LandingPage.tsx` via a `useEffect`.

```tsx
// LandingPage.tsx — redirect if already logged in
const { isAuthenticated } = useAuthStore()
const navigate = useNavigate()

useEffect(() => {
  if (isAuthenticated) navigate('/dashboard', { replace: true })
}, [isAuthenticated])
```

---

## Folder Structure

```
frontend/src/
  components/
    landing/
      HeroSection.tsx
      ServicesSection.tsx
      FeaturesSection.tsx
      HowItWorksSection.tsx
      InstallAppSection.tsx
      TestimonialsSection.tsx
      CallToActionSection.tsx
      LandingFooter.tsx
      LandingNavbar.tsx        ← top nav bar for the landing page only
  pages/
    landing/
      LandingPage.tsx          ← assembles all sections in order
  layouts/
    LandingLayout.tsx          ← wrapper: LandingNavbar + children + LandingFooter
```

---

## Design System Alignment

All landing page components follow the same tokens defined in `tailwind.config.ts` (Phase 1):

| Token | Value | Usage in Landing Page |
|---|---|---|
| `navy.DEFAULT` | `#0F172A` | Page background, section backgrounds |
| `navy.800` | `#1E293B` | Card backgrounds, service tiles |
| `navy.700` | `#334155` | Hover states, dividers |
| `red.DEFAULT` | `#EF4444` | CTA buttons, badges, highlights |
| `gold.DEFAULT` | `#FACC15` | Section headings, icon accents |
| White | `#F8FAFC` | Primary body text |
| Muted | `#94A3B8` | Subtitle text |

**Typography:** Same as app — `Inter` or `Outfit` from Google Fonts (set globally in `index.css`).

**Animations:** Subtle entrance animations using CSS `@keyframes` or Tailwind `animate-` utilities. No external animation library required.

---

## Section-by-Section Specification

---

### 1. LandingNavbar

**File:** `src/components/landing/LandingNavbar.tsx`

**Purpose:** Top navigation visible on the landing page only. Collapses to a hamburger on mobile.

**Content:**
- Left: CAR ADDA logo (text or SVG icon + wordmark)
- Right (desktop): anchor links to page sections + `Login` button
- Right (mobile): hamburger → drawer with same links

**Navigation Links (smooth scroll anchors):**
- Services
- Features
- How It Works
- Install App
- Login (→ `/login`)

**Component Structure:**
```tsx
<nav className="fixed top-0 w-full z-50 bg-navy/90 backdrop-blur border-b border-navy-700">
  <Logo />
  <DesktopNav links={NAV_LINKS} />
  <LoginButton />          {/* → /login */}
  <MobileMenuToggle />     {/* hamburger */}
  <MobileDrawer />         {/* overlay drawer */}
</nav>
```

**Behaviour:**
- Sticky at top with `backdrop-blur` glass effect
- Background becomes fully opaque after 80px scroll (`useScrollPosition` hook)

---

### 2. HeroSection

**File:** `src/components/landing/HeroSection.tsx`

**Purpose:** First visible section. Must instantly communicate what CAR ADDA is and prompt the primary action.

**Visual:** Full-viewport-height dark section with a subtle animated gradient background (deep navy → dark red tint) and a car silhouette or circuit-line vector as a decorative element.

**Content:**
```
[Badge chip]  "Car Wash & Detailing Management"

[H1]          CAR ADDA
[Subheading]  Run Your Car Wash Business
               From One Smart App.

[Body text]   Generate bills, track customers, manage inventory,
               and view profits — all from your phone.

[CTA Buttons]
  [Primary]   → /login        "Login to Dashboard"
  [Secondary] → #install      "Install App ↓"

[Scroll indicator]  Animated chevron pointing down
```

**Component Structure:**
```tsx
<section id="hero" className="min-h-screen flex items-center bg-navy relative overflow-hidden">
  <BackgroundGradient />        {/* decorative overlay */}
  <div className="container mx-auto px-6 z-10">
    <ChipBadge label="Car Wash & Detailing Management" />
    <h1>CAR ADDA</h1>
    <p className="subheading">Run Your Car Wash Business From One Smart App.</p>
    <p className="body-text">...</p>
    <div className="flex gap-4 mt-8">
      <Button variant="primary" onClick={() => navigate('/login')}>
        Login to Dashboard
      </Button>
      <Button variant="outline" onClick={() => scrollTo('#install')}>
        Install App ↓
      </Button>
    </div>
  </div>
  <ScrollIndicator />
</section>
```

**Responsive behaviour:**
- Desktop: text left, decorative illustration right
- Mobile: centered stack, illustration hidden or scaled down

---

### 3. ServicesSection

**File:** `src/components/landing/ServicesSection.tsx`

**Purpose:** Showcase all 8 service categories supported by CAR ADDA.

**Content:**
```
[Section label]   "Our Services"
[H2]              Everything Your Shop Offers, Managed Digitally.

[Service Grid — 4 columns desktop, 2 columns tablet, 1 column mobile]
```

**Service Tiles (8 items):**

| Icon | Service Name | Short Description |
|---|---|---|
| 🫧 | Normal Wash | Quick exterior wash — ₹500 flat rate |
| ✨ | Premium Wash | Full exterior + interior cleaning — ₹800 |
| 🎨 | Painting Services | Banner, fender, door & full car painting |
| 🔩 | Car Accessories | Premium fixtures and accessories fitting |
| 🔨 | Denting & Tinkering | Expert body dent repair and panel work |
| 🏺 | Ceramic Coating | Long-lasting protective ceramic finish |
| 🛡️ | PPF Protection | Paint Protection Film installation |
| 🛋️ | Interior Detailing | Deep clean, conditioning & fragrance |

**ServiceTile Component:**
```tsx
<div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 hover:border-red
                transition-all duration-300 cursor-default group">
  <span className="text-3xl mb-4 block">{icon}</span>
  <h3 className="text-white font-semibold text-lg">{name}</h3>
  <p className="text-muted text-sm mt-2">{description}</p>
</div>
```

**Hover effect:** Border transitions from `navy-700` to `red.DEFAULT`. Card lifts with `hover:-translate-y-1` subtle lift.

---

### 4. FeaturesSection

**File:** `src/components/landing/FeaturesSection.tsx`

**Purpose:** Explain the 6 core system capabilities in a benefit-focused way.

**Content:**
```
[Section label]   "Features"
[H2]              One App. Every Tool You Need.

[Feature Grid — 3 columns desktop, 2 tablet, 1 mobile]
```

**Feature Items (6):**

| Lucide Icon | Feature | Benefit Statement |
|---|---|---|
| `Receipt` | Digital Billing | Generate, print and share professional bills in seconds |
| `Users` | Customer Management | Auto-capture every customer and track their full service history |
| `Package` | Inventory Tracking | Monitor stock levels and get alerted before you run out |
| `IndianRupee` | Expense Management | Log every business cost and know exactly where money goes |
| `BarChart2` | Reports & Analytics | Daily and monthly sales charts with net profit breakdown |
| `MessageCircle` | WhatsApp Invoicing | Send bills directly to customers via WhatsApp with one tap |

**FeatureCard Component:**
```tsx
<div className="flex flex-col gap-4 p-6 bg-navy-800 rounded-2xl border border-navy-700">
  <div className="w-12 h-12 rounded-xl bg-red/10 flex items-center justify-center">
    <Icon className="text-red w-6 h-6" />
  </div>
  <h3 className="text-white font-semibold">{feature}</h3>
  <p className="text-muted text-sm leading-relaxed">{benefit}</p>
</div>
```

---

### 5. HowItWorksSection

**File:** `src/components/landing/HowItWorksSection.tsx`

**Purpose:** Walk the shop owner through the 4-step workflow in a visual, numbered format.

**Content:**
```
[Section label]   "How It Works"
[H2]              Simple Enough for Anyone. Powerful Enough for Business.

[Step List — horizontal timeline on desktop, vertical on mobile]
```

**Steps (4):**

| Step | Icon | Title | Description |
|---|---|---|---|
| 01 | `FileText` | Create a Bill | Select services, enter customer details and car number. Bill is generated instantly. |
| 02 | `Users` | Track Customers | Every customer is saved automatically. View full history with one tap. |
| 03 | `Package` | Manage Inventory | Stock is deducted automatically when a service is completed. Get alerts when running low. |
| 04 | `TrendingUp` | View Reports | See daily and monthly sales, expense breakdown, and net profit at a glance. |

**StepCard Component:**
```tsx
<div className="relative flex flex-col items-center text-center">
  {/* Step number badge */}
  <div className="w-14 h-14 rounded-full bg-red flex items-center justify-center
                  text-white font-bold text-xl mb-4 shadow-lg shadow-red/30">
    {stepNumber}
  </div>
  {/* Connector line between steps (desktop only) */}
  <ConnectorLine />
  <Icon className="text-gold w-8 h-8 mb-3" />
  <h3 className="text-white font-semibold text-lg">{title}</h3>
  <p className="text-muted text-sm mt-2 max-w-xs">{description}</p>
</div>
```

---

### 6. InstallAppSection

**File:** `src/components/landing/InstallAppSection.tsx`

**Purpose:** Educate users about PWA installation and allow them to trigger the install prompt.

**Content:**
```
[Section id="install"]
[H2]   Install CAR ADDA on Your Phone
[Body] No app store needed. Add CAR ADDA directly to your home screen
        for instant access — works like a native app.

[Install Benefit Cards — 3 items]
  📱  Add to Home Screen
       Works on Android and iOS Safari.

  ⚡  App-Like Experience
       Full screen, no browser bar, fast launch.

  🔔  Always Ready
       Access your business data offline.

[Install Button — conditional on PWA installability]
  [If prompt available]   → triggers BeforeInstallPromptEvent.prompt()
                            "Install App Now"

  [If iOS Safari]         → Shows manual instruction tooltip:
                            "Tap Share → Add to Home Screen"

  [If already installed]  → "Already Installed ✓" (disabled)
```

**Hook Usage:**
```tsx
// Reuses usePWAInstall hook from Phase 10
const { canInstall, installApp, isInstalled, isIOS } = usePWAInstall()
```

**Visual:** Dark card with a phone mockup illustration on the right (desktop) showing the CAR ADDA icon on a home screen. Illustration generated or used as an SVG.

---

### 7. TestimonialsSection

**File:** `src/components/landing/TestimonialsSection.tsx`

**Purpose:** Social proof from shop owners (can use placeholder copy for MVP; replaced with real quotes post-launch).

**Content:**
```
[Section label]   "What Shop Owners Say"
[H2]              Built for Real Car Wash Businesses

[Testimonial Cards — horizontal scroll on mobile, 3 columns desktop]
```

**Testimonial Data (3 placeholder items):**
```ts
const testimonials = [
  {
    quote: "Earlier I used to write bills in a register. Now I generate, print and WhatsApp the bill in under 30 seconds.",
    author: "Ravi S.",
    role: "Owner, Ravi Car Wash, Pune",
    rating: 5
  },
  {
    quote: "The inventory alerts saved us twice last month. We never ran out of shampoo mid-day again.",
    author: "Kiran P.",
    role: "Owner, Clean Auto Studio, Mumbai",
    rating: 5
  },
  {
    quote: "I can see the monthly profit from my phone anytime. No more guessing if the business is doing well.",
    author: "Suresh M.",
    role: "Owner, Star Detailing, Nagpur",
    rating: 5
  }
]
```

**TestimonialCard Component:**
```tsx
<div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 flex flex-col gap-4">
  <div className="flex gap-1">
    {[...Array(rating)].map(() => <Star className="text-gold w-4 h-4 fill-gold" />)}
  </div>
  <p className="text-white/80 text-sm leading-relaxed italic">"{quote}"</p>
  <div>
    <p className="text-white font-semibold text-sm">{author}</p>
    <p className="text-muted text-xs">{role}</p>
  </div>
</div>
```

---

### 8. CallToActionSection

**File:** `src/components/landing/CallToActionSection.tsx`

**Purpose:** Final push before the footer. Strong visual prompt to take action.

**Content:**
```
[Full-width dark-red gradient background]

[H2]   Ready to Digitise Your Car Wash Business?
[Body] Join shop owners already saving hours every week.

[Buttons — centered, stacked on mobile]
  [Primary]    "Login to Dashboard"   → /login
  [Secondary]  "Install App"          → triggers PWA install
  [Ghost]      "Learn More ↑"         → smooth scroll to #hero
```

**Visual:** The section uses a subtle radial gradient of `red/20` on a `navy` background to create a glowing focal point. A thin gold horizontal rule above the section visually separates it.

---

### 9. LandingFooter

**File:** `src/components/landing/LandingFooter.tsx`

**Purpose:** Standard footer with business info, links, and copyright.

**Content:**
```
[Left]
  CAR ADDA logo
  "Professional Car Wash & Detailing Management System"

[Center]
  Quick Links
  ├── Dashboard Login → /login
  ├── Services → #services
  ├── Features → #features
  └── Install App → #install

[Right]
  Contact
  ├── 📍 [Shop Address — configurable]
  ├── 📞 [Phone — configurable]
  └── 📧 [Email — configurable]

[Bottom bar]
  © 2024 CAR ADDA. All rights reserved.   |   Powered by CAR ADDA
```

> Contact info in the footer is pulled from the `settings` table (Phase 10) after login. On the public landing page, a default placeholder is shown, OR the values are embedded at build time via environment variables.

---

## LandingPage Assembly

**File:** `src/pages/landing/LandingPage.tsx`

```tsx
import LandingLayout from '@/layouts/LandingLayout'
import HeroSection from '@/components/landing/HeroSection'
import ServicesSection from '@/components/landing/ServicesSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import InstallAppSection from '@/components/landing/InstallAppSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import CallToActionSection from '@/components/landing/CallToActionSection'

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated])

  return (
    <LandingLayout>
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <InstallAppSection />
      <TestimonialsSection />
      <CallToActionSection />
    </LandingLayout>
  )
}
```

---

## LandingLayout

**File:** `src/layouts/LandingLayout.tsx`

```tsx
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-navy min-h-screen text-white font-sans">
      <LandingNavbar />
      <main>{children}</main>
      <LandingFooter />
    </div>
  )
}
```

---

## Responsive Breakpoints

| Viewport | Columns | Behaviour |
|---|---|---|
| Mobile `< 640px` | 1 | Full-width stacks, hamburger nav, horizontal scroll for testimonials |
| Tablet `640–1024px` | 2 | Service tiles 2-col, features 2-col |
| Desktop `> 1024px` | 3–4 | Full grid layouts, side-by-side hero, horizontal step timeline |

---

## Animation Details

All animations are CSS-only or Tailwind utility-based — no external animation library needed.

| Element | Animation |
|---|---|
| Hero H1 | `fadeInUp` 0.6s ease on mount |
| Hero CTA buttons | `fadeInUp` 0.8s delayed |
| Service tiles | `fadeInUp` staggered 0.1s per tile on scroll into view |
| Feature cards | `fadeInUp` on scroll |
| Step numbers | Pulse ring on hover |
| Navbar | Smooth background opacity on scroll |

**CSS keyframes (added to `global.css`):**
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUp {
  animation: fadeInUp 0.6s ease forwards;
}
```

**Intersection Observer hook for scroll animations:**
```ts
// src/hooks/useInView.ts
export const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true)
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}
```

---

## Navigation Flow Summary

```
Public user visits /
  └── LandingNavbar shows Login button
  └── Hero CTA: "Login to Dashboard" → /login
  └── Hero CTA: "Install App" → #install section (smooth scroll)
  └── InstallAppSection: "Install App Now" → PWA install prompt

Returning admin visits /login
  └── Submits phone + password
  └── JWT stored → navigate('/dashboard', { replace: true })

Already authenticated user visits /
  └── LandingPage useEffect → navigate('/dashboard', { replace: true })
```

---

## Files to Create (Summary)

```
frontend/src/
  components/landing/
    LandingNavbar.tsx
    HeroSection.tsx
    ServicesSection.tsx
    FeaturesSection.tsx
    HowItWorksSection.tsx
    InstallAppSection.tsx
    TestimonialsSection.tsx
    CallToActionSection.tsx
    LandingFooter.tsx
  pages/landing/
    LandingPage.tsx
  layouts/
    LandingLayout.tsx     ← new layout (alongside existing AuthLayout, AppShell)
  hooks/
    useInView.ts          ← scroll intersection hook for animations
```

**Modified files:**
- `src/App.tsx` — add `<Route path="/" element={<LandingPage />} />` before protected routes
- `src/styles/global.css` — add `@keyframes fadeInUp` and `.animate-fadeInUp`
- `tailwind.config.ts` — no changes required (tokens already cover all needs)

---

## Phase Placement

The landing page does **not** belong to any numbered phase — it is a standalone addition that can be implemented:
- **After Phase 1** (scaffold exists) and **before or alongside Phase 2** (login route needed)
- Recommended implementation order: **Phase 1 → Landing Page → Phase 2 → Phase 3 onwards**

The landing page has no backend dependency. It is a fully static React component set. The only live connection is the `/login` route (Phase 2) and the PWA install hook (Phase 10, but the `usePWAInstall` stub can be added earlier).
