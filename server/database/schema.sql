-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE (Sync with Supabase Auth or Standalone)
-- For this demo, we assume we might sync with auth.users or just use this for roles.
-- A trigger usually handles auth.users -> public.users, but for simplicity we'll just check if it exists.
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'manager', 'cashier')) DEFAULT 'cashier',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  supplier TEXT,
  low_stock_threshold INTEGER DEFAULT 5,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SALES TABLE
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SALE ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.sale_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL -- Snapshotted price
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- Allow read access to all for demo/dashboard
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read sales" ON public.sales FOR SELECT USING (true);
CREATE POLICY "Allow public read sale_items" ON public.sale_items FOR SELECT USING (true);

-- Write access policies usually require auth, but for simplicity in backend we use Service Role Key which bypasses RLS.
-- If using client-side calls, we'd need detailed policies.
-- Since this is a Node.js backend using Service Key, RLS impacts are minimal for the backend, but good for client-side safety.

-- Function to handle new user signup (Optional: if using Supabase Auth)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, 'cashier'); -- default check
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
-- drop trigger if exists on_auth_user_created on auth.users;
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();

-- DEMO DATA SEEDING (Optional)
INSERT INTO public.products (name, category, price, stock, supplier)
VALUES 
('Wireless Mouse', 'Electronics', 25.50, 150, 'Logitech'),
('Mechanical Keyboard', 'Electronics', 85.00, 40, 'Keychron'),
('Monitor 24"', 'Electronics', 120.00, 25, 'Dell'),
('USB-C Cable', 'Accessories', 12.00, 200, 'Anker'),
('Laptop Stand', 'Accessories', 35.00, 60, 'Roost');
