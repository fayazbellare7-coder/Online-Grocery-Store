# 🛒 FreshCart — Online Grocery Store & Home Delivery Management

FreshCart is a modern, high-performance web application built for fast scheduled home grocery deliveries. Powered by **React (Vite) + Tailwind CSS** and linked directly with **Supabase** via `@supabase/supabase-js`.

Customers can browse farm-fresh produce across 7 categories, customize delivery slots, manage delivery addresses, simulate payments, track orders with live status timelines, and reschedule deliveries. Administrators have a dedicated control panel to monitor revenue analytics, manage inventory, restock items, fulfill orders, and adjust delivery window capacities.

---

## ⚡ Supabase Configuration

The application is linked to Supabase using the following configuration in `client/.env`:

```env
VITE_SUPABASE_URL=https://odqelucxdljjtyleiqus.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_kqRiySp96QsOdLN4s_3AbA_rlR0oMzw
```

### Supabase Schema
The complete PostgreSQL schema script with Row Level Security (RLS) policies and table definitions is available in [`supabase_schema.sql`](file:///Users/mohammadfayaz/.gemini/antigravity-ide/scratch/freshcart/supabase_schema.sql).

---

## 🌟 Demo Credentials

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@freshcart.com` | `Admin@123` | Full control over inventory, orders, analytics, and delivery slots |
| **Customer** | `user@freshcart.com` | `User@123` | Pre-seeded with active orders, addresses, and wishlist items |

> 💡 *Tip: The Login page includes 1-click quick sign-in buttons for demo accounts.*

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18 (Vite) + React Router v6 + Tailwind CSS v3
- **Database & Backend Services**: Supabase (`@supabase/supabase-js`)
- **State Management**: React Context API (`AuthContext`, `CartContext`, `WishlistContext`)
- **Analytics & Visuals**: Recharts, Lucide React, Canvas Confetti
- **Notifications**: React Hot Toast
- **Data Layer**: Direct Supabase query integration (`client/src/services/dataService.js`) with resilient local fallback ensuring smooth demo performance.

---

## 🚀 Quick Start

### 1. Installation
```bash
# Install client dependencies
npm run install:all
```

### 2. Start Development Server
```bash
# Starts the Vite development server on http://localhost:5173
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 📱 Features

- **Storefront & Catalog**:
  - 40+ realistic grocery products across 7 categories (Fruits & Vegetables, Dairy & Eggs, Bakery & Bread, Snacks & Munchies, Beverages, Staples & Grains, Household & Cleaning).
  - Search, category filters, price range sliders, deals filter, in-stock filter, and sort options.
- **Cart & Checkout**:
  - Quantity adjustments, dynamic free-delivery progress bar (free shipping above ₹299), delivery fee and GST calculations.
  - Multi-address management (Home, Office, Other) with default address selector.
  - 14-day 2-hour delivery slot selection with capacity limits.
  - Payment options (Cash on Delivery, Simulated Instant Online Payment).
- **Order Management & Live Tracking**:
  - Detailed order view with status progression (Placed ➔ Confirmed ➔ Packed ➔ Out for Delivery ➔ Delivered).
  - Order cancellation and 1-click reordering.
  - Delivery slot rescheduling.
- **Admin Dashboard**:
  - 7-day revenue charts, order volume stats, low stock warnings.
  - Inventory management (add, edit, restock +20 units, toggle status, delete).
  - Category manager and slot capacity adjustments.
  - 1-click **"Sync to Supabase"** action button to populate database tables.
