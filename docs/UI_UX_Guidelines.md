# UI/UX Design System — CAR ADDA PWA

> **Global design authority for all frontend pages, components, and screens.**
> Every component, page, and layout in the CAR ADDA frontend must follow the rules defined in this document.
> No ad-hoc colors, sizes, or styles outside of this system are permitted.

---

## 1. Color Palette

All colors are defined as Tailwind CSS custom tokens in `tailwind.config.ts` and as CSS custom properties in `src/styles/global.css`. Use the token names, never hardcoded hex values in components.

### 1.1 Base Palette

| Token Name | Hex Value | Tailwind Class | Usage |
|---|---|---|---|
| `navy.DEFAULT` | `#0F172A` | `bg-navy` | Page backgrounds, primary surface |
| `navy.800` | `#1E293B` | `bg-navy-800` | Cards, sidebars, modal backgrounds |
| `navy.700` | `#334155` | `bg-navy-700` | Dividers, borders, hover surface |
| `navy.600` | `#475569` | `bg-navy-600` | Disabled backgrounds, muted rows |
| `red.DEFAULT` | `#EF4444` | `bg-red` | Primary CTA buttons, destructive actions, alerts |
| `red.600` | `#DC2626` | `bg-red-600` | Button hover state, pressed state |
| `red.100` | `#FEE2E2` | `bg-red-100` | Error message backgrounds |
| `gold.DEFAULT` | `#FACC15` | `text-gold` | Highlight text, profit values, accents |
| `gold.500` | `#EAB308` | `text-gold-500` | Gold hover state, star ratings |
| `white` | `#F8FAFC` | `text-white` | Primary text on dark backgrounds |
| `muted` | `#94A3B8` | `text-muted` | Secondary text, placeholders, captions |
| `success` | `#22C55E` | `text-success` | Positive values, in-stock, paid status |
| `warning` | `#F97316` | `text-warning` | Low stock alerts, pending status |
| `error` | `#EF4444` | `text-error` | Validation errors, failed status |

### 1.2 Semantic Color Roles

| Role | Color Token | Examples |
|---|---|---|
| **Page background** | `navy` | All page wrappers |
| **Card surface** | `navy-800` | Dashboard widgets, data cards |
| **Border / divider** | `navy-700` | Table rows, card borders, input borders |
| **Primary action** | `red` | "Create Bill", "Save", "Login" |
| **Destructive action** | `red` + ring | "Delete", "Remove" |
| **Financial positive** | `gold` | Net profit, revenue figures |
| **Financial negative** | `red` | Expenses, losses |
| **Status: success** | `success` | Paid badges, in-stock indicators |
| **Status: warning** | `warning` | Low stock, pending |
| **Status: error** | `error` | Validation errors, failed payments |
| **Text primary** | `white` | All headings and body copy |
| **Text secondary** | `muted` | Labels, captions, timestamps |

### 1.3 Tailwind Config (reference)

```ts
// tailwind.config.ts
colors: {
  navy: {
    DEFAULT: '#0F172A',
    800:     '#1E293B',
    700:     '#334155',
    600:     '#475569',
  },
  red: {
    DEFAULT: '#EF4444',
    600:     '#DC2626',
    100:     '#FEE2E2',
  },
  gold: {
    DEFAULT: '#FACC15',
    500:     '#EAB308',
  },
  white:   '#F8FAFC',
  muted:   '#94A3B8',
  success: '#22C55E',
  warning: '#F97316',
  error:   '#EF4444',
}
```

### 1.4 CSS Custom Properties (global.css)

```css
:root {
  --color-navy:    #0F172A;
  --color-surface: #1E293B;
  --color-border:  #334155;
  --color-red:     #EF4444;
  --color-gold:    #FACC15;
  --color-white:   #F8FAFC;
  --color-muted:   #94A3B8;
  --color-success: #22C55E;
  --color-warning: #F97316;
  --color-error:   #EF4444;
}
```

---

## 2. Typography

### 2.1 Font Family

| Role | Font | Import |
|---|---|---|
| Primary (headings + body) | **Inter** | Google Fonts |
| Monospace (bill numbers, codes) | **JetBrains Mono** | Google Fonts |

**Google Fonts import (index.html):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

**Tailwind font config:**
```ts
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Menlo', 'monospace'],
}
```

**global.css body base:**
```css
body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--color-navy);
  color: var(--color-white);
  -webkit-font-smoothing: antialiased;
}
```

---

### 2.2 Type Scale

All sizes use `rem` units. Base: `16px = 1rem`.

| Name | Size | Weight | Line Height | Tailwind Class | Usage |
|---|---|---|---|---|---|
| **Display** | `2.25rem` (36px) | 800 | 1.2 | `text-4xl font-extrabold` | Hero H1 only |
| **Heading 1** | `1.875rem` (30px) | 700 | 1.25 | `text-3xl font-bold` | Page titles |
| **Heading 2** | `1.5rem` (24px) | 700 | 1.3 | `text-2xl font-bold` | Section headings |
| **Heading 3** | `1.25rem` (20px) | 600 | 1.4 | `text-xl font-semibold` | Card titles, sidebar labels |
| **Heading 4** | `1.125rem` (18px) | 600 | 1.4 | `text-lg font-semibold` | Table column headers, subheadings |
| **Body Large** | `1rem` (16px) | 400 | 1.625 | `text-base` | Primary body copy |
| **Body** | `0.875rem` (14px) | 400 | 1.5 | `text-sm` | Default content, form labels |
| **Small** | `0.75rem` (12px) | 400 | 1.5 | `text-xs` | Captions, timestamps, helper text |
| **Micro** | `0.625rem` (10px) | 500 | 1.4 | `text-[10px] font-medium` | Badge labels, status chips |
| **Mono** | `0.875rem` (14px) | 400 | 1.5 | `font-mono text-sm` | Bill numbers, car numbers, codes |

### 2.3 Text Color Hierarchy

```
Page Title (H1)     → text-white font-bold
Section Heading (H2)→ text-white font-bold
Card Title (H3)     → text-white font-semibold
Body Text           → text-white/90
Secondary text      → text-muted
Captions / helpers  → text-muted/70
Disabled text       → text-navy-600
Error messages      → text-error
Success messages    → text-success
Financial positive  → text-gold font-semibold
Financial negative  → text-red font-semibold
Code / bill numbers → font-mono text-gold
```

### 2.4 Spacing Between Text Elements

| Context | Rule |
|---|---|
| H1 → body text | `mt-4` (16px) |
| Section label → H2 | `mb-2` (8px) |
| H2 → body | `mt-3` (12px) |
| Paragraph → paragraph | `mt-4` (16px) |
| Label → input | `mb-1.5` (6px) |
| Input → helper/error | `mt-1` (4px) |

### 2.5 Section Labels

Every major section uses a small uppercase label above the main heading to establish context. This pattern is used on the landing page and in reports.

```tsx
<span className="text-xs font-semibold uppercase tracking-widest text-red">
  Features
</span>
<h2 className="text-2xl font-bold text-white mt-2">
  One App. Every Tool You Need.
</h2>
```

---

## 3. Button Styles

All buttons use the shared `Button` component at `src/components/ui/Button.tsx`. Direct `<button>` elements with raw Tailwind classes in pages/components are **not permitted** — always use `<Button>`.

### 3.1 Button Variants

#### Primary Button
Used for: main actions — "Create Bill", "Save", "Login", "Submit"

```
Background:  bg-red
Text:        text-white font-semibold
Border:      none
Padding:     px-5 py-2.5
Border radius: rounded-xl
```

```css
/* Tailwind classes */
bg-red text-white font-semibold px-5 py-2.5 rounded-xl
hover:bg-red-600
active:scale-95
focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-navy
transition-all duration-150
```

#### Secondary Button
Used for: supplementary actions — "Cancel", "Back", "Export"

```
Background:  bg-navy-700
Text:        text-white font-medium
Border:      border border-navy-600
Padding:     px-5 py-2.5
Border radius: rounded-xl
```

```css
bg-navy-700 border border-navy-600 text-white font-medium px-5 py-2.5 rounded-xl
hover:bg-navy-600 hover:border-navy-500
active:scale-95
transition-all duration-150
```

#### Outline Button
Used for: tertiary actions on light/dark sections — "Install App ↓", "Learn More"

```
Background:  transparent
Text:        text-white font-medium
Border:      border border-white/30
Padding:     px-5 py-2.5
Border radius: rounded-xl
```

```css
bg-transparent border border-white/30 text-white font-medium px-5 py-2.5 rounded-xl
hover:bg-white/10 hover:border-white/50
active:scale-95
transition-all duration-150
```

#### Ghost Button
Used for: navigation actions, icon-only buttons in tables

```
Background:  transparent
Text:        text-muted font-medium
Border:      none
Padding:     px-3 py-2
Border radius: rounded-lg
```

```css
bg-transparent text-muted font-medium px-3 py-2 rounded-lg
hover:bg-navy-700 hover:text-white
active:scale-95
transition-all duration-150
```

#### Destructive Button
Used for: delete and remove actions. Always requires a confirmation dialog before executing.

```
Background:  bg-red/10
Text:        text-red font-semibold
Border:      border border-red/30
Padding:     px-5 py-2.5
Border radius: rounded-xl
```

```css
bg-red/10 border border-red/30 text-red font-semibold px-5 py-2.5 rounded-xl
hover:bg-red hover:text-white hover:border-red
active:scale-95
transition-all duration-150
```

---

### 3.2 Button Sizes

| Size | Padding | Font Size | Tailwind |
|---|---|---|---|
| `xs` | `px-3 py-1.5` | `text-xs` | For table row actions |
| `sm` | `px-4 py-2` | `text-sm` | Sidebar buttons, compact forms |
| `md` (default) | `px-5 py-2.5` | `text-sm` | All standard actions |
| `lg` | `px-6 py-3` | `text-base` | Hero CTAs, major form submits |
| `xl` | `px-8 py-4` | `text-lg font-bold` | Landing page primary CTA only |

---

### 3.3 Disabled State

```css
opacity-50 cursor-not-allowed pointer-events-none
```

> Never use JS to prevent clicks on disabled buttons. Always use `disabled` attribute + CSS above.

---

### 3.4 Loading State

When an async action is pending, the button shows a spinner and disables input:

```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <span className="flex items-center gap-2">
      <Spinner size="sm" />
      Saving...
    </span>
  ) : 'Save'}
</Button>
```

`Spinner` component: 16px × 16px white SVG circle with `animate-spin`. Located at `src/components/ui/Spinner.tsx`.

---

### 3.5 Icon Buttons

Icon-only buttons (e.g., edit, delete in table rows) use a square `rounded-lg` container:

```css
p-2 rounded-lg bg-navy-700 text-muted
hover:bg-navy-600 hover:text-white
transition-all duration-150
```

Lucide icon size: `w-4 h-4` inside icon buttons.

---

## 4. Form Input Styles

All form inputs use the shared `Input`, `Select`, `Textarea`, and `Label` components from `src/components/ui/`.

### 4.1 Text Input

#### Default State
```css
w-full bg-navy-800 border border-navy-700 text-white rounded-xl
px-4 py-2.5 text-sm
placeholder:text-muted/60
outline-none
transition-all duration-150
```

#### Focus State
```css
border-red ring-1 ring-red/40
```

#### Filled State (has value)
```css
border-navy-600
```

#### Error State
```css
border-error ring-1 ring-error/40
```

#### Disabled State
```css
opacity-50 cursor-not-allowed bg-navy-700 border-navy-600
```

---

### 4.2 Label

```tsx
<label className="block text-sm font-medium text-muted mb-1.5">
  Customer Phone
  {required && <span className="text-red ml-1">*</span>}
</label>
```

Labels are always placed **above** the input field. Never inline or placeholder-as-label.

---

### 4.3 Helper Text

Displayed below the input in all states to guide the user:

```tsx
<p className="text-xs text-muted mt-1">
  Enter 10-digit mobile number
</p>
```

---

### 4.4 Validation Error Message

Replaces helper text when the field has an error:

```tsx
<p className="text-xs text-error mt-1 flex items-center gap-1">
  <AlertCircle className="w-3 h-3" />
  Phone number must be 10 digits
</p>
```

---

### 4.5 Select / Dropdown

```css
/* Same base as text input */
w-full bg-navy-800 border border-navy-700 text-white rounded-xl
px-4 py-2.5 text-sm
appearance-none bg-no-repeat
/* custom dropdown arrow via background-image SVG */
focus:border-red focus:ring-1 focus:ring-red/40
```

---

### 4.6 Textarea

Same base as text input. Minimum height `min-h-[80px]`. Resize: vertical only (`resize-y`).

---

### 4.7 Toggle / Switch

Used for: payment method (Cash / UPI), boolean settings.

```
Active segment:    bg-red text-white rounded-lg
Inactive segment:  bg-navy-700 text-muted rounded-lg
Container:         bg-navy-800 rounded-xl p-1 inline-flex
```

```tsx
// PaymentMethodToggle example
<div className="bg-navy-800 rounded-xl p-1 inline-flex">
  <button className={mode === 'cash' ? 'bg-red text-white' : 'bg-transparent text-muted'}
          onClick={() => setMode('cash')}>
    Cash
  </button>
  <button className={mode === 'upi' ? 'bg-red text-white' : 'bg-transparent text-muted'}
          onClick={() => setMode('upi')}>
    UPI
  </button>
</div>
```

---

### 4.8 Form Layout Rules

| Rule | Detail |
|---|---|
| Single-column layout on mobile | All inputs stack vertically |
| Two-column grid on desktop | `grid grid-cols-2 gap-4` for paired fields (name + phone) |
| Field group spacing | `space-y-4` between individual form rows |
| Section spacing within form | `mt-8` before a new logical group |
| Form card wrapper | `bg-navy-800 rounded-2xl p-6 border border-navy-700` |
| Submit button placement | Always at the bottom, right-aligned (`flex justify-end`) |
| Required field indicator | Red asterisk `*` next to label |

---

## 5. Card Layouts

### 5.1 Base Card

Used as the foundation for all card types. Located at `src/components/ui/Card.tsx`.

```css
bg-navy-800 rounded-2xl border border-navy-700
p-6
transition-all duration-200
```

```tsx
<div className="bg-navy-800 rounded-2xl border border-navy-700 p-6">
  {children}
</div>
```

---

### 5.2 KPI / Dashboard Widget Card

Used in: Dashboard page, Reports page.

```
Layout:     flex flex-col gap-3
Icon area:  w-10 h-10 rounded-xl bg-{color}/10 flex items-center justify-center
Icon:       text-{color} w-5 h-5 (Lucide)
Label:      text-xs font-medium text-muted uppercase tracking-wide
Value:      text-2xl font-bold text-white
Trend:      text-xs text-success/text-error (with ▲/▼)
Border:     border-navy-700 hover:border-{color}/40
```

```tsx
<div className="bg-navy-800 rounded-2xl border border-navy-700 p-5
                hover:border-gold/40 transition-all duration-200">
  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
    <DollarSign className="w-5 h-5 text-gold" />
  </div>
  <p className="text-xs font-medium text-muted uppercase tracking-wide mt-3">
    Today's Sales
  </p>
  <p className="text-2xl font-bold text-white mt-1">₹4,500</p>
  <p className="text-xs text-success mt-1">▲ 12% vs yesterday</p>
</div>
```

**Grid layout (Dashboard):**
```css
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
```

---

### 5.3 Data / Information Card

Used for: Customer detail cards, vendor cards, bill summaries.

```
Header:     flex justify-between items-start
Title:      text-base font-semibold text-white
Subtitle:   text-sm text-muted
Body:       mt-4 space-y-2
Row:        flex justify-between text-sm — label text-muted | value text-white
Divider:    border-t border-navy-700 mt-4 pt-4
Footer:     flex gap-2 (action buttons)
```

---

### 5.4 Service Tile Card

Used in: ServicesSection on the landing page.

```
Base:       bg-navy-800 rounded-2xl p-6 border border-navy-700
Hover:      hover:border-red hover:-translate-y-1
Transition: transition-all duration-300
Icon:       text-3xl mb-4 block
Title:      text-white font-semibold text-base
Body:       text-muted text-sm mt-2
```

---

### 5.5 Alert / Notice Card

Used for: low-stock alerts, important notices.

```
Warning:    bg-warning/10 border border-warning/30 rounded-xl p-4
Error:      bg-error/10 border border-error/30 rounded-xl p-4
Success:    bg-success/10 border border-success/30 rounded-xl p-4
Info:       bg-navy-700 border border-navy-600 rounded-xl p-4

Content:    flex items-start gap-3
Icon:       w-5 h-5 text-{color} mt-0.5
Text:       text-sm text-white/90
```

---

### 5.6 Stat / Metric Card (Reports)

Used for large financial figures in the Reports page.

```
Container:  bg-navy-800 rounded-2xl p-6 border border-navy-700
Label:      text-sm text-muted font-medium
Value:      text-3xl font-bold (color varies by type)
  Revenue:  text-gold
  Expense:  text-red
  Profit:   text-success
  Neutral:  text-white
Period:     text-xs text-muted mt-1
```

---

## 6. Table Layouts

All data tables use the shared `DataTable` component structure. Located at `src/components/ui/DataTable.tsx`.

### 6.1 Base Table Style

```css
/* Table wrapper */
w-full overflow-x-auto rounded-2xl border border-navy-700

/* Table element */
w-full border-collapse text-sm

/* Head row */
bg-navy-700 text-muted text-xs font-semibold uppercase tracking-wide

/* Header cells */
th: px-4 py-3 text-left whitespace-nowrap

/* Body rows */
tr: border-t border-navy-700 hover:bg-navy-700/50 transition-colors duration-100

/* Body cells */
td: px-4 py-3 text-white/90
```

### 6.2 Column Type Rules

| Column Type | Alignment | Style |
|---|---|---|
| Text (name, description) | Left | `text-white/90` |
| Number (quantity, amount) | Right | `text-white font-medium tabular-nums` |
| Currency (₹ amounts) | Right | `text-white font-semibold tabular-nums` |
| Date / timestamp | Left | `text-muted font-mono text-xs` |
| Code (bill number, car number) | Left | `font-mono text-gold text-xs` |
| Status badge | Center | See Badge section below |
| Actions | Right | Icon buttons, `flex gap-2 justify-end` |

### 6.3 Status Badges (inline in tables)

```tsx
// src/components/ui/Badge.tsx
const variants = {
  success: 'bg-success/10 text-success border border-success/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  error:   'bg-error/10 text-error border border-error/20',
  default: 'bg-navy-700 text-muted border border-navy-600',
}

// Base classes
'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium'
```

| Label | Variant | Examples |
|---|---|---|
| Paid | `success` | Bill payment status |
| Pending | `warning` | Unpaid bills |
| In Stock | `success` | Inventory status |
| Low Stock | `warning` | Near threshold |
| Out of Stock | `error` | Zero quantity |
| Cash | `default` | Payment method |
| UPI | `default` | Payment method |

### 6.4 Empty State (no rows)

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <InboxIcon className="w-12 h-12 text-navy-600 mb-4" />
  <p className="text-muted text-sm font-medium">No {entityName} found</p>
  <p className="text-muted/60 text-xs mt-1">
    Try adjusting your filters or add a new {entityName}.
  </p>
</div>
```

### 6.5 Pagination

```
Container:  flex items-center justify-between mt-4 px-1
Count:      text-xs text-muted  "Showing 1–20 of 84"
Controls:   flex gap-2
Buttons:    Ghost button variant (sm size), disabled on first/last page
```

### 6.6 Sortable Columns

Column headers that support sorting use a small `▲ ▼` icon from Lucide (`ChevronsUpDown`). Active sort direction uses `gold` color:

```tsx
<th onClick={toggleSort} className="cursor-pointer select-none">
  <span className="flex items-center gap-1">
    Date
    <ChevronsUpDown className={`w-3 h-3 ${sorted ? 'text-gold' : 'text-muted'}`} />
  </span>
</th>
```

---

## 7. Spacing Rules

A consistent 4px base grid is used throughout. All spacing uses multiples of 4px.

### 7.1 Base Grid

| Tailwind Value | Pixels | Usage |
|---|---|---|
| `1` | 4px | Icon inner padding, micro gaps |
| `2` | 8px | Tight internal spacing (badge padding) |
| `3` | 12px | Form label → input gap |
| `4` | 16px | Standard element spacing |
| `5` | 20px | Card padding (compact) |
| `6` | 24px | Card padding (standard) |
| `8` | 32px | Section sub-group separation |
| `10` | 40px | Page section padding (mobile) |
| `12` | 48px | Page section padding (tablet) |
| `16` | 64px | Major section separation |
| `20` | 80px | Landing section vertical padding |
| `24` | 96px | Hero section top padding |

### 7.2 Layout Spacing Rules

| Context | Rule |
|---|---|
| Page horizontal padding | `px-4` (mobile) → `px-6` (tablet) → `px-8` (desktop) |
| Page top padding (after topbar) | `pt-6` |
| Section heading → content | `mt-6` |
| Card grid gap | `gap-4` (mobile) → `gap-5` (desktop) |
| Form field spacing | `space-y-4` |
| Sidebar width | `w-64` (256px) fixed on desktop |
| Topbar height | `h-16` (64px) fixed |
| Content area (with sidebar) | `ml-64 pt-16` on desktop |
| Full-page section padding | `py-20 px-4` (mobile) → `py-24 px-8` (desktop) |

### 7.3 Component Internal Spacing

| Component | Padding |
|---|---|
| KPI Card | `p-5` |
| Data Card | `p-6` |
| Form Card | `p-6` |
| Table cell | `px-4 py-3` |
| Table header cell | `px-4 py-3` |
| Button (md) | `px-5 py-2.5` |
| Input field | `px-4 py-2.5` |
| Badge | `px-2.5 py-0.5` |
| Modal | `p-6` |
| Sidebar nav item | `px-4 py-2.5` |

---

## 8. Responsive Breakpoints

CAR ADDA is **mobile-first**. All base styles are for mobile. Styles are progressively enhanced for larger viewports.

### 8.1 Breakpoint Definitions

| Name | Min Width | Tailwind Prefix | Target Device |
|---|---|---|---|
| **Mobile** | `< 640px` | (base, no prefix) | Phones in portrait |
| **Small** | `≥ 640px` | `sm:` | Large phones, landscape |
| **Medium** | `≥ 768px` | `md:` | Tablets |
| **Large** | `≥ 1024px` | `lg:` | Laptops, desktops |
| **XL** | `≥ 1280px` | `xl:` | Wide screens |

### 8.2 Layout Behaviour by Breakpoint

| Element | Mobile | sm (640) | md (768) | lg (1024) |
|---|---|---|---|---|
| Sidebar | Hidden (drawer) | Hidden | Hidden | Fixed left, w-64 |
| Topbar | Full width | Full width | Full width | Full width (ml-64) |
| KPI grid | 1 col | 2 col | 2 col | 4 col |
| Feature grid | 1 col | 1 col | 2 col | 3 col |
| Service grid | 1 col | 2 col | 2 col | 4 col |
| Form layout | 1 col | 1 col | 2 col | 2 col |
| Data table | Horizontal scroll | Horizontal scroll | Full width | Full width |
| Bill form items | Stacked | Stacked | Stacked | 3-col grid |
| Report charts | Stacked | Stacked | Side by side | Side by side |
| Testimonials | Single scroll | Single scroll | 2 col | 3 col |
| Hero text | Centered | Centered | Left | Left |
| Modal width | Full screen | `max-w-lg` | `max-w-lg` | `max-w-lg` |

### 8.3 Mobile-Specific Rules

- Tap targets must be a minimum of `44px × 44px`
- Use `text-base` (16px) minimum for inputs to prevent iOS zoom on focus
- Bottom navigation or floating action buttons preferred over header actions on mobile
- Horizontal scroll on tables — never truncate financial data
- Full-screen modals on mobile (`fixed inset-0`)

---

## 9. Micro-Interactions

### 9.1 Transition Standards

All interactive elements use consistent transition timing. No random durations.

| Speed | Duration | Easing | Used For |
|---|---|---|---|
| **Fast** | `150ms` | `ease-in-out` | Button press, active states |
| **Standard** | `200ms` | `ease-in-out` | Hover effects, color changes |
| **Smooth** | `300ms` | `ease-in-out` | Card lifts, dropdown opens |
| **Slow** | `500ms` | `ease-out` | Sidebar open/close, modal enter |
| **Page** | `600ms` | `ease-out` | Entrance animations on page load |

Tailwind shorthand: `transition-all duration-200` (standard), `transition-colors duration-150` (color only).

---

### 9.2 Hover Effects

| Element | Hover Effect |
|---|---|
| Primary button | `bg-red-600` (darker red) |
| Secondary button | `bg-navy-600` |
| Ghost button | `bg-navy-700 text-white` |
| Nav link (sidebar) | `bg-navy-700 text-white` |
| Service tile (landing) | `border-red -translate-y-1` |
| Feature card | `border-red` |
| Table row | `bg-navy-700/50` |
| Icon button | `bg-navy-600 text-white` |
| Card (interactive) | `border-{accent}/40 shadow-lg` |
| Testimonial card | `-translate-y-1` |

---

### 9.3 Active / Press States

All clickable elements use `active:scale-95` to provide tactile press feedback. Duration: `150ms`.

```css
active:scale-95 transition-transform duration-150
```

---

### 9.4 Focus States

All interactive elements must have a visible focus ring for keyboard navigation and accessibility:

```css
focus-visible:outline-none
focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2
focus-visible:ring-offset-navy
```

This applies to: buttons, inputs, selects, links, checkboxes.

---

### 9.5 Page Entrance Animations

Used on first render of major page sections. CSS-only, no JS animation library.

```css
/* global.css */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

.animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
.animate-fadeIn   { animation: fadeIn 0.3s ease-out forwards; }
.animate-scaleIn  { animation: scaleIn 0.2s ease-out forwards; }
```

| Element | Animation | Delay |
|---|---|---|
| Page `<h1>` | `fadeInUp` | `0ms` |
| Page subtitle | `fadeInUp` | `100ms` |
| KPI cards | `fadeInUp` staggered | `0ms, 100ms, 200ms, 300ms` |
| Hero buttons | `fadeInUp` | `200ms` |
| Landing sections (on scroll) | `fadeInUp` via `useInView` | `0ms` |

Delay applied via inline style: `style={{ animationDelay: '100ms' }}`

---

### 9.6 Loading States

#### Full Page Loading
```tsx
// Shown while a page fetches its initial data
<div className="flex items-center justify-center min-h-[60vh]">
  <Spinner size="lg" />
</div>
```

#### Skeleton Loaders
For KPI cards and table rows — use pulsing placeholder blocks instead of spinners:

```tsx
<div className="bg-navy-800 rounded-2xl p-5 border border-navy-700 animate-pulse">
  <div className="w-10 h-10 rounded-xl bg-navy-700 mb-3" />
  <div className="h-3 w-24 bg-navy-700 rounded mb-2" />
  <div className="h-7 w-32 bg-navy-700 rounded" />
</div>
```

Tailwind `animate-pulse` provides the breathing shimmer effect.

#### Inline Button Spinner
See Section 3.4 (Loading State) above.

---

### 9.7 Toast Notifications

Powered by `react-hot-toast`. Positioned `top-right` on desktop, `top-center` on mobile.

| Type | Icon | Background | Usage |
|---|---|---|---|
| Success | `✓` | `bg-navy-800 border border-success/40` | Bill created, saved, sent |
| Error | `✕` | `bg-navy-800 border border-error/40` | API failures, validation |
| Warning | `⚠` | `bg-navy-800 border border-warning/40` | Partial success, low stock |
| Info | `ℹ` | `bg-navy-800 border border-navy-600` | Informational |

Custom toast config:
```ts
toast.success('Bill created successfully', {
  style: {
    background: '#1E293B',
    color: '#F8FAFC',
    border: '1px solid rgba(34,197,94,0.4)',
    borderRadius: '12px',
    fontFamily: 'Inter',
    fontSize: '14px',
  },
  iconTheme: { primary: '#22C55E', secondary: '#1E293B' },
  duration: 3000,
})
```

---

### 9.8 Modal / Dialog

```
Overlay:    fixed inset-0 bg-navy/80 backdrop-blur-sm z-50
Container:  bg-navy-800 rounded-2xl border border-navy-700
            max-w-lg w-full mx-auto mt-[10vh] p-6
            (mobile: fixed inset-x-4 bottom-4 rounded-2xl)
Enter:      scaleIn + fadeIn together
Exit:       opacity-0 scale-95 duration-150
Header:     flex justify-between items-center mb-6
            title: text-lg font-semibold text-white
            close: ghost icon button (X)
Footer:     flex justify-end gap-3 mt-6 pt-4 border-t border-navy-700
```

---

### 9.9 Sidebar Navigation States

| State | Style |
|---|---|
| Default | `text-muted bg-transparent` |
| Hover | `text-white bg-navy-700` |
| Active (current route) | `text-white bg-red/10 border-l-2 border-red` |
| Collapsed (mobile) | Off-canvas, slides in from left (`translate-x-0` from `-translate-x-full`) |

Active nav item uses a left red border accent to give a strong visual anchor without being aggressive.

---

### 9.10 Data Refresh Feedback

When dashboard data is auto-polled and refreshed in the background:
- A subtle `text-muted text-xs` "Updated just now" timestamp appears below the KPI grid
- No full re-render spinner — only new values animate in via `fadeIn`

---

## Appendix: Component Checklist

When building any new component, verify it follows these rules:

- [ ] Uses only defined color tokens (no raw hex values)
- [ ] Uses `Inter` font via Tailwind `font-sans`
- [ ] Uses `Button` component — no raw `<button>` with custom styles
- [ ] Uses `Input` component — no raw `<input>` with custom styles
- [ ] Has a `focus-visible` ring
- [ ] Has `active:scale-95` if clickable
- [ ] Has explicit `transition-all duration-200` or equivalent
- [ ] Uses `text-muted` for secondary/label text
- [ ] Empty state defined if component renders a list
- [ ] Responsive at mobile (base) → desktop (`lg:`) at minimum
- [ ] Loading/skeleton state handled
- [ ] Uses `react-hot-toast` for success/error feedback (not `alert()`)
