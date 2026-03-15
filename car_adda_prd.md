# CAR ADDA -- Product Requirements Document (PRD)

Version: 1.0 Product Type: Progressive Web App (PWA) Platform: Web +
Mobile Installable App

------------------------------------------------------------------------

# 1. Product Overview

CAR ADDA is a digital management system designed for car wash and
detailing businesses. The system allows the shop owner to manage
billing, customers, inventory, expenses, and reports from a single
mobile-friendly application.

The application will be developed as a Progressive Web App (PWA) so that
it works both as a website and a mobile app.

Primary goals:

• Generate wash and service bills\
• Track customers and service history\
• Manage inventory and stock usage\
• Track expenses and purchases\
• Send bills through WhatsApp\
• Generate printable invoices\
• View daily and monthly reports

------------------------------------------------------------------------

# 2. Target Users

Primary User • Shop Owner / Admin

Future Expansion • Multiple employees • Multiple branches

------------------------------------------------------------------------

# 3. Business Information

Business Name: CAR ADDA\
Industry: Car Wash & Car Detailing\
Primary Services:

• Normal Wash\
• Premium Wash\
• Painting Services\
• Car Accessories\
• Denting & Tinkering\
• Ceramic Coating\
• PPF Protection\
• Interior Detailing

------------------------------------------------------------------------

# 4. Core Features

## 4.1 Dashboard

Purpose: Show business overview.

Widgets:

• Today's Sales • Today's Expenses • Number of Customers Today • Low
Stock Alerts • Quick Billing Button

Dashboard UI Suggestion: Dark background with modern automotive styling.

Color Theme:

Primary Color: #0F172A (Dark Navy)\
Secondary Color: #EF4444 (Automotive Red)\
Accent Color: #FACC15 (Highlight Gold)

------------------------------------------------------------------------

# 5. Authentication System

Admin Login Required

Fields:

Phone Number\
Password

Security:

• Password hashing (bcrypt) • JWT authentication • Secure session
management

------------------------------------------------------------------------

# 6. Billing System

The billing module allows the shop owner to generate invoices for
services.

Bill Types:

Normal Wash -- ₹500\
Premium Wash -- ₹800

Painting Services:

• Banner • Fender • Door • Full Car

Bill Data Fields:

Customer Name\
Phone Number\
Car Number\
Service Type\
Amount\
Payment Method\
Date

Payment Methods:

• Cash • UPI

Actions:

• Generate Bill • Print Bill • Send Bill via WhatsApp

------------------------------------------------------------------------

# 7. Customer Management

Customer information will be stored automatically during billing.

Customer Fields:

Customer ID\
Customer Name\
Phone Number\
Car Number\
Visit History

Customer History Page:

Displays:

Date\
Service\
Amount\
Payment Type

------------------------------------------------------------------------

# 8. Inventory Management

Tracks stock used for car washing and detailing.

Example Inventory Items:

Foam Shampoo\
Wax Polish\
Interior Cleaner\
Perfume\
Paper Mats\
Microfiber Cloth

Inventory Fields:

Item Name\
Quantity\
Unit\
Last Updated

Features:

• Add Stock • Update Stock • Automatic deduction when service used • Low
stock alerts

------------------------------------------------------------------------

# 9. Vendor Management

Tracks stock purchases from suppliers.

Vendor Fields:

Vendor Name\
Item Purchased\
Quantity\
Price\
Date

------------------------------------------------------------------------

# 10. Expense Tracking

Tracks operational expenses.

Examples:

Electricity\
Water Bill\
Chemical Purchase\
Equipment Repair

Expense Fields:

Expense Name\
Amount\
Date\
Notes

------------------------------------------------------------------------

# 11. Reports & Analytics

Reports Page includes:

Daily Sales\
Monthly Sales\
Total Expenses\
Net Profit

Charts:

Sales Chart\
Expense Chart

Chart Library Suggestion: Recharts

------------------------------------------------------------------------

# 12. WhatsApp Bill Integration

Bills should be shareable through WhatsApp.

Options:

WhatsApp Cloud API\
Twilio WhatsApp API

Message Template:

Hello {Customer Name}

Thank you for visiting CAR ADDA.

Service: {Service} Amount: ₹{Amount}

------------------------------------------------------------------------

# 13. Invoice Generation

PDF invoices will be generated.

Technology:

Python ReportLab

Invoice Includes:

Logo\
Customer Details\
Service Details\
Amount\
Date\
Payment Method

------------------------------------------------------------------------

# 14. PWA Features

Installable Mobile App

Capabilities:

• Add to Home Screen • Offline capability for UI • Fast loading • Mobile
optimized UI

PWA Components:

manifest.json\
service-worker.js

------------------------------------------------------------------------

# 15. Technology Stack

Frontend React + Tailwind CSS

Backend FastAPI

Database Supabase PostgreSQL

Hosting

Frontend: Vercel\
Backend: Railway\
Database: Supabase

------------------------------------------------------------------------

# 16. System Architecture

User ↓ Frontend (React PWA) ↓ API Layer (FastAPI) ↓ Database (Supabase
PostgreSQL)

------------------------------------------------------------------------

# 17. Suggested UI Pages

Login Page

Dashboard

Create Bill Page

Customer History Page

Inventory Page

Vendor Purchase Page

Expenses Page

Reports Page

Settings Page

------------------------------------------------------------------------

# 18. Suggested Image Prompts (For UI Design)

The AI system generating the UI may create visuals using the following
prompts.

Prompt 1:

"Modern automotive service dashboard UI, dark theme, neon red accents,
luxury car garage interface, minimal clean layout"

Prompt 2:

"Professional car service billing interface, futuristic automotive
theme, mobile friendly UI"

Prompt 3:

"Car wash management dashboard with charts and inventory alerts, modern
SaaS design"

------------------------------------------------------------------------

# 19. Future Enhancements

• Multi Employee Login • Multiple Shop Branches • GST Billing • Online
Booking System • Loyalty Program • SMS Notifications

------------------------------------------------------------------------

# 20. Success Metrics

The system should enable:

• Faster billing • Better inventory control • Accurate profit tracking •
Customer retention

------------------------------------------------------------------------

# End of Document
