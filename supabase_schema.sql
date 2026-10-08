-- =========================================================================
-- FRESHCART SUPABASE POSTGRESQL SCHEMA & SEED SCRIPT
-- =========================================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    image TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    discount_percent NUMERIC(5, 2) DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    unit TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Delivery Slots Table
CREATE TABLE IF NOT EXISTS public.delivery_slots (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 10 CHECK (capacity >= 0),
    booked INTEGER NOT NULL DEFAULT 0 CHECK (booked >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date, start_time, end_time)
);

-- 4. Create Addresses Table
CREATE TABLE IF NOT EXISTS public.addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Home',
    line1 TEXT NOT NULL,
    line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT,
    customer_email TEXT,
    address_snapshot JSONB NOT NULL,
    slot_id BIGINT REFERENCES public.delivery_slots(id) ON DELETE SET NULL,
    slot_snapshot JSONB NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'online')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    delivery_fee NUMERIC(10, 2) NOT NULL CHECK (delivery_fee >= 0),
    tax NUMERIC(10, 2) NOT NULL CHECK (tax >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    status TEXT NOT NULL DEFAULT 'Placed' CHECK (status IN ('Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES public.products(id) ON DELETE SET NULL,
    name_snapshot TEXT NOT NULL,
    price_snapshot NUMERIC(10, 2) NOT NULL,
    unit_snapshot TEXT,
    image_snapshot TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Order Status History Table
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    notes TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create Cart Items Table
CREATE TABLE IF NOT EXISTS public.cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 9. Create Wishlist Items Table
CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 10. Enable Row Level Security (RLS) & Add Public Access for Demo
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Allow Public/Anon Read/Write policies for frictionless demo access
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public categories read" ON public.categories;
    CREATE POLICY "Public categories read" ON public.categories FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public products read" ON public.products;
    CREATE POLICY "Public products read" ON public.products FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public slots read" ON public.delivery_slots;
    CREATE POLICY "Public slots read" ON public.delivery_slots FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public addresses access" ON public.addresses;
    CREATE POLICY "Public addresses access" ON public.addresses FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public orders access" ON public.orders;
    CREATE POLICY "Public orders access" ON public.orders FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public order_items access" ON public.order_items;
    CREATE POLICY "Public order_items access" ON public.order_items FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public order_status_history access" ON public.order_status_history;
    CREATE POLICY "Public order_status_history access" ON public.order_status_history FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public cart_items access" ON public.cart_items;
    CREATE POLICY "Public cart_items access" ON public.cart_items FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public wishlist_items access" ON public.wishlist_items;
    CREATE POLICY "Public wishlist_items access" ON public.wishlist_items FOR ALL USING (true) WITH CHECK (true);
END $$;
