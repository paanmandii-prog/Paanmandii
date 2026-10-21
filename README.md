# PAAN MANDI — "Aapki Paan Ki Dukaan, Ab Online!"

A production-ready wholesale e-commerce platform for bulk paan leaves (Magahi, Calcutta, Banarasi, Meetha), legally permitted ingredients (Kattha, Chuna, Supari), and commercial shop packaging supplies in India.

Built with Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL with Row Level Security), and Razorpay payments.

---

## 🌟 Key Features

### 1. Wholesale Storefront
- **Volume Tier Pricing:** Dynamic wholesale discounts that automatically calculate based on order quantity.
- **Minimum Order Quantities (MOQ):** Stepped wholesale increments and MOQ enforcement per product unit (Dholi, kg, box).
- **Interactive Catalog:** Search, category filters, in-stock status, and sorting by wholesale rates.
- **Live Cart & Freight Calculator:** LocalStorage guest cart synchronized to authenticated Supabase cart upon sign-in. Dynamic PIN-code freight calculation with free delivery threshold.
- **Multimodal Checkout:** Supports Cash on Delivery (COD), Self Mandi Pickup, and Razorpay (UPI / Cards / Net Banking).
- **GST Compliance:** Formal B2B tax invoices with HSN codes, tax rates (0%, 5%, 12%, 18%), and buyer GSTIN recording.

### 2. Wholesale Buyer Portal
- **Account Overview:** Registered shop details, proprietor identity, and GST verification status.
- **Order History:** Itemized invoices, tracking statuses (`pending_confirmation` → `confirmed` → `preparing` → `out_for_delivery` → `completed`), and direct WhatsApp Mandi desk support.

### 3. Admin Control Center (`/admin`)
- **Dashboard Overview:** Real-time metrics for total sales volume, order counts, pending dispatches, and low-stock buffer alerts.
- **Order Fulfillment Manager:** Fast search and one-click status transitions with automatic audit logging in `order_status_history`.
- **Products & Pricing Catalog:** Overview of active items, units, MOQs, and volume tiers.
- **Stock & Inventory Control:** Live warehouse stock adjustments (+50 / +200 stock received, -10 / -50 damaged or expired), recording movements in `inventory_movements`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- A [Supabase](https://supabase.com) project
- (Optional) [Razorpay](https://razorpay.com) account for online payments

### 1. Database Setup
In your Supabase project's **SQL Editor**, run the migration scripts in order:

1. `supabase/migrations/001_initial_schema.sql` — Creates tables (`products`, `categories`, `orders`, `order_items`, `inventory`, `payments`, `profiles`), RLS policies, enums, and functions.
2. `supabase/migrations/002_seed_data.sql` — Populates authentic Indian wholesale paan supplies, initial stock levels, and price tiers.
3. `supabase/migrations/003_admin_setup.sql` — Provisions admin roles and permission checks.

### 2. Environment Configuration
Copy `.env.example` to `.env.local` and add your project keys:

```bash
cp .env.example .env.local
```

Configure your credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay (Optional - if blank, COD and Pickup remain active)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PAAN MANDI
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture

```
paan-mandi/
├── src/
│   ├── app/
│   │   ├── (store)/                 # Public Storefront & Customer Portal
│   │   │   ├── page.tsx             # Homepage
│   │   │   ├── products/            # Wholesale Catalog & Product Details
│   │   │   ├── categories/          # Categories directory & detail pages
│   │   │   ├── cart/                # Wholesale shopping cart
│   │   │   ├── checkout/            # Checkout flow with freight calculator
│   │   │   ├── order-success/       # Confirmation & WhatsApp support
│   │   │   ├── account/             # Buyer profile & Order history
│   │   │   └── (policies)/          # Terms, Shipping, Returns, Privacy, About, Contact, FAQ
│   │   ├── (auth)/                  # Authentication
│   │   │   ├── login/               # Shop owner login
│   │   │   └── register/            # Wholesale buyer registration
│   │   ├── admin/                   # Admin Control Center
│   │   │   ├── page.tsx             # Analytics & dashboard overview
│   │   │   ├── orders/              # Order fulfillment manager
│   │   │   ├── products/            # Product listings
│   │   │   └── inventory/           # Stock adjustments
│   │   └── api/                     # Backend API Routes
│   │       ├── cart/                # Server-authoritative cart recalculation
│   │       ├── checkout/            # Order placement & Razorpay signature verification
│   │       ├── products/            # Product catalog search & filters
│   │       └── admin/               # Order status & stock adjustments
│   ├── components/                  # Reusable UI components
│   ├── contexts/                    # CartContext with guest localStorage sync
│   ├── lib/                         # Pricing engines, Supabase SSR clients, Zod schemas
│   └── types/                       # TypeScript interfaces
└── supabase/
    └── migrations/                  # Complete SQL schema & seeds
```

---

## 🛡️ Statutory Compliance Note
PAAN MANDI strictly deals in legally permitted agricultural produce (betel leaves), culinary food preparation ingredients, edible extracts, and commercial food packaging materials. The platform strictly enforces Indian trade laws and statutory regulations.
