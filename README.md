# 🛒 FreshCart — Online Grocery Store & Home Delivery Management

FreshCart is a modern, high-performance, full-stack online grocery platform built for fast scheduled home deliveries. Customers can browse farm-fresh produce, customize delivery slots, manage addresses, simulate mock payments, track orders in real time, and reschedule deliveries. Administrators have a dedicated dashboard to monitor real-time revenue, manage products, fulfill orders, and configure slot capacities.

---

## 🌟 Demo Credentials

| Role | Email | Password | Quick Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@freshcart.com` | `Admin@123` | Full control over inventory, orders, analytics, and slots |
| **Customer** | `user@freshcart.com` | `User@123` | Pre-seeded with active orders, addresses, and wishlist |

> 💡 *Tip: The Login page includes 1-click quick sign-in buttons for both demo accounts.*

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS v3 with modern custom emerald palette
- **State Management**: React Context API (`AuthContext`, `CartContext`, `WishlistContext`)
- **Icons & Visuals**: Lucide React, Canvas Confetti
- **Analytics Charts**: Recharts
- **HTTP Client**: Axios with JWT interceptors
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js REST API
- **Database**: SQLite with `better-sqlite3` (Zero external setup required, WAL mode, foreign key enforcement)
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing
- **Validation**: Zod schema validation
- **Security**: Helmet, CORS, parameterized SQL queries

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Install & Seed
From the project root:

```bash
# 1. Seed database with 40+ products, 7 categories, users, slots & orders
npm run seed

# 2. Start both backend server (port 5000) and frontend client (port 5173)
npm run dev
```

The app will be live at:
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`

### 3. Running Backend Tests
```bash
npm run test
```
*Executes 17 comprehensive Jest & Supertest integration tests covering Auth, Products, Cart calculations, Atomic Order placement transactions, and Admin analytics.*

---

## 📦 Project Structure

```
freshcart/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProductCard, Timeline, Modals, Drawer
│   │   ├── context/            # AuthContext, CartContext, WishlistContext
│   │   ├── pages/              # Home, Products, ProductDetail, Cart, Checkout, Orders, Profile, Admin
│   │   ├── services/           # Axios API Client with JWT Bearer interceptor
│   │   ├── App.jsx             # Route definitions & Layouts
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js          # Proxy /api to Express server on :5000
│
├── server/                     # Express REST API
│   ├── src/
│   │   ├── config/             # Config & Environment variables
│   │   ├── controllers/        # Auth, Products, Categories, Cart, Orders, Admin, Slots
│   │   ├── db/
│   │   │   ├── freshcart.db    # SQLite Database File
│   │   │   ├── schema.sql      # Database Schema Definition
│   │   │   └── seed.js         # Comprehensive Realistic Seeding Script
│   │   ├── middleware/         # JWT Auth, Role Guard, Zod Validator, Central Error Handler
│   │   ├── routes/             # Express API Route Handlers
│   │   ├── app.js              # Express App Setup
│   │   └── server.js           # Server Entry Point
│   ├── tests/
│   │   └── api.test.js         # Jest + Supertest Suite (17 Tests)
│   ├── .env.example
│   └── package.json
│
├── package.json                # Monorepo root script runner (concurrently)
└── README.md
```

---

## ✨ Features Breakdown

### 🛒 Customer Experience
1. **Authentication & Profile**: Register, login, persistent session, saved delivery addresses with default selection, password update.
2. **Product Browsing & Discovery**:
   - Hero banner with delivery guarantees and discount callouts.
   - Category chips (Fruits & Vegetables, Dairy & Eggs, Bakery, Snacks, Beverages, Staples, Household).
   - Live search bar, category filters, price range slider, in-stock only toggle, deal % badges, sorting.
3. **Product Detail**:
   - High-resolution imagery, organic badges, price vs discount savings, unit/weight descriptions, stock status pills, stepper quantity selector, related items recommendations.
4. **Persistent Cart**:
   - Works seamlessly for logged-in users (DB) and guests (localStorage), with automatic cart merging upon login.
   - Real-time calculations: Subtotal, 5% Tax, Free Delivery Progress Bar (Free above $35, otherwise $4.99 standard fee), Total Savings.
   - Slide-over quick cart drawer + full cart page.
5. **Scheduled Checkout**:
   - Select or add delivery address.
   - Pick 2-hour scheduled delivery slots (08-10 AM, 10-12 PM, 4-6 PM, 6-8 PM) with dynamic capacity and past-time lockouts.
   - Choose Cash on Delivery (COD) or Simulated Online Payment (Card / UPI / NetBanking with success/decline toggle for demo testing).
   - Atomic DB transaction decrements stock, books the delivery slot, records status history, and clears cart.
6. **Order Management & Live Tracking**:
   - Order history with status pills and item previews.
   - Visual Order Timeline: `Placed` ➔ `Confirmed` ➔ `Packed` ➔ `Out for Delivery` ➔ `Delivered` (with timestamps & warehouse notes).
   - Cancel order (before Packed) with automatic inventory restoration and slot release.
   - Reschedule delivery slot (before Out for Delivery).
   - 1-Click Reorder (adds all past order items to cart).
7. **Wishlist**: Quick heart toggle to save favorite items.

### 🛡️ Admin Portal (`/admin`)
1. **Analytics Dashboard**:
   - Real-time revenue, total orders, today's metrics, customer counts, low-stock alerts.
   - 7-Day interactive revenue & orders growth area chart (Recharts).
   - Orders by status breakdown bar chart.
   - Quick-restock table for low-stock inventory (< 10 units).
2. **Product Management**:
   - Full catalog table with search and category filters.
   - Add new products, edit pricing, discount %, unit, and image URLs.
   - Inline stock editor (+/- units) and instant active/hidden visibility toggle.
3. **Category Management**:
   - View, create, and edit category details with auto-slug generation.
4. **Order Fulfilment**:
   - Search orders by customer or ID, filter by status.
   - Update order status with custom warehouse notes (instantly drives the customer's live tracking timeline).
5. **Delivery Slots Management**:
   - Monitor booking load and capacity utilization per slot window.
   - Adjust vehicle capacity per slot.

---

## 📡 REST API Reference (`/api`)

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new customer account | Public |
| `POST` | `/auth/login` | Login and obtain JWT token | Public |
| `GET` | `/auth/me` | Fetch authenticated user profile | User |
| `PUT` | `/auth/profile` | Update name and phone | User |
| `PUT` | `/auth/change-password` | Update account password | User |
| `GET` | `/categories` | List all grocery categories with product counts | Public |
| `GET` | `/products` | Query products (search, category, price, inStock, sort, pagination) | Public |
| `GET` | `/products/:id` | Get product details & related items | Public |
| `POST` | `/products` | Create product | Admin |
| `PUT` | `/products/:id` | Update product | Admin |
| `PATCH` | `/products/:id/stock` | Quick stock update | Admin |
| `PATCH` | `/products/:id/toggle-active` | Toggle active visibility | Admin |
| `GET` | `/cart` | Get user cart with itemized bill and fee calculations | User |
| `POST` | `/cart` | Add product to cart | User |
| `POST` | `/cart/merge` | Sync & merge guest cart items on login | User |
| `PATCH` | `/cart/:itemId` | Update cart item quantity | User |
| `DELETE` | `/cart/:itemId` | Remove item from cart | User |
| `DELETE` | `/cart` | Clear entire cart | User |
| `GET` | `/addresses` | List user delivery addresses | User |
| `POST` | `/addresses` | Add new delivery address | User |
| `PATCH` | `/addresses/:id/default` | Set default address | User |
| `GET` | `/slots` | Get 7-day delivery slots with real-time capacity | Public |
| `POST` | `/orders` | Place order (Atomic DB transaction) | User |
| `GET` | `/orders` | List user orders | User |
| `GET` | `/orders/:id` | Get order details & live status timeline | User / Admin |
| `PATCH` | `/orders/:id/cancel` | Cancel order & restore stock | User / Admin |
| `PATCH` | `/orders/:id/reschedule` | Reschedule delivery slot | User / Admin |
| `POST` | `/orders/:id/reorder` | Reorder items into cart | User |
| `GET` | `/admin/stats` | Business metrics, charts & low stock alerts | Admin |
| `GET` | `/admin/orders` | List all orders with filters & search | Admin |
| `PATCH` | `/admin/orders/:id/status` | Update order status with warehouse notes | Admin |
| `PATCH` | `/slots/:id/capacity` | Adjust slot capacity | Admin |

---

## 🧪 Edge Cases Handled

1. **Stock Validation & Overbooking**:
   - Decrements stock atomically inside SQLite transactions.
   - Prevents placing orders if items become out of stock.
   - Restores stock immediately upon order cancellation.
2. **Delivery Slot Safeguards**:
   - Automatically prevents booking past slots or slots exceeding vehicle capacity.
   - Automatically releases booked slot counts on cancellation or rescheduling.
3. **Guest & Logged-in Cart Synchronization**:
   - Unauthenticated visitors can browse and build a cart in localStorage.
   - Upon logging in, guest items are automatically merged with database items.
4. **Role-Based Protection**:
   - Customer routes are protected against unauthenticated users.
   - Admin routes and API endpoints are guarded with role checks.
