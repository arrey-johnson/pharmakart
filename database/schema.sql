-- PharmaKart Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE user_role AS ENUM ('ADMIN', 'PHARMACY', 'CLIENT', 'RIDER');
CREATE TYPE order_status AS ENUM (
  'PENDING_PHARMACY_CONFIRMATION',
  'REJECTED',
  'ACCEPTED',
  'PREPARED',
  'ASSIGNED_TO_RIDER',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED'
);
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE payment_method AS ENUM ('MTN_MOMO', 'ORANGE_MONEY', 'CASH_ON_DELIVERY');
CREATE TYPE prescription_status AS ENUM ('UPLOADED', 'VERIFIED', 'REJECTED');
CREATE TYPE delivery_status AS ENUM (
  'PENDING',
  'ON_THE_WAY_TO_PHARMACY',
  'PICKED_UP',
  'ON_THE_WAY_TO_CLIENT',
  'DELIVERED'
);
CREATE TYPE rider_status AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE subdivision AS ENUM ('DOUALA_I', 'DOUALA_II', 'DOUALA_III', 'DOUALA_IV', 'DOUALA_V');

-- =============================================
-- USERS TABLE (extends Supabase auth.users)
-- =============================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'CLIENT',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PHARMACIES
-- =============================================

CREATE TABLE pharmacies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  address TEXT NOT NULL,
  subdivision subdivision NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  opening_hours TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(2, 1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =============================================
-- RIDERS
-- =============================================

CREATE TABLE riders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status rider_status DEFAULT 'INACTIVE',
  vehicle_type TEXT,
  license_number TEXT,
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  total_deliveries INTEGER DEFAULT 0,
  rating DECIMAL(2, 1) DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =============================================
-- CLIENT PROFILES
-- =============================================

CREATE TABLE client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  default_address TEXT,
  city TEXT DEFAULT 'Douala',
  subdivision subdivision,
  language TEXT DEFAULT 'EN' CHECK (language IN ('EN', 'FR')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =============================================
-- MEDICINE CATEGORIES
-- =============================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MEDICINES (Global Catalog)
-- =============================================

CREATE TABLE medicines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  generic_name TEXT,
  category_id UUID REFERENCES categories(id),
  description TEXT,
  image_url TEXT,
  dosage TEXT,
  packaging TEXT,
  prescription_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PHARMACY MEDICINES (Inventory per Pharmacy)
-- =============================================

CREATE TABLE pharmacy_medicines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  price INTEGER NOT NULL, -- Price in XAF (no decimals for CFA)
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pharmacy_id, medicine_id)
);

-- =============================================
-- ORDERS
-- =============================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES users(id),
  pharmacy_id UUID NOT NULL REFERENCES pharmacies(id),
  delivery_address TEXT NOT NULL,
  subdivision subdivision NOT NULL,
  status order_status DEFAULT 'PENDING_PHARMACY_CONFIRMATION',
  payment_status payment_status DEFAULT 'PENDING',
  payment_method payment_method NOT NULL,
  subtotal INTEGER NOT NULL, -- XAF
  delivery_fee INTEGER NOT NULL, -- XAF
  commission_amount INTEGER NOT NULL, -- XAF (2% of subtotal)
  total_amount INTEGER NOT NULL, -- subtotal + delivery_fee
  notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDER ITEMS
-- =============================================

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  pharmacy_medicine_id UUID NOT NULL REFERENCES pharmacy_medicines(id),
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL, -- XAF
  subtotal INTEGER NOT NULL -- quantity * unit_price
);

-- =============================================
-- PRESCRIPTIONS
-- =============================================

CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES users(id),
  file_url TEXT NOT NULL,
  status prescription_status DEFAULT 'UPLOADED',
  pharmacist_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DELIVERIES
-- =============================================

CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rider_id UUID REFERENCES riders(id),
  status delivery_status DEFAULT 'PENDING',
  pickup_time TIMESTAMPTZ,
  delivered_time TIMESTAMPTZ,
  rider_fee INTEGER DEFAULT 500, -- XAF
  rider_rating INTEGER CHECK (rider_rating >= 1 AND rider_rating <= 5),
  client_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(order_id)
);

-- =============================================
-- PAYMENTS
-- =============================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- XAF
  method payment_method NOT NULL,
  transaction_reference TEXT,
  status payment_status DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PLATFORM SETTINGS
-- =============================================

CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commission_percentage DECIMAL(5, 2) DEFAULT 2.00,
  delivery_fee_0_5km INTEGER DEFAULT 800, -- XAF
  delivery_fee_5_10km INTEGER DEFAULT 1200, -- XAF
  rider_fee_per_delivery INTEGER DEFAULT 500, -- XAF
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO platform_settings (commission_percentage, delivery_fee_0_5km, delivery_fee_5_10km, rider_fee_per_delivery)
VALUES (2.00, 800, 1200, 500);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_pharmacies_subdivision ON pharmacies(subdivision);
CREATE INDEX idx_pharmacies_is_verified ON pharmacies(is_verified);
CREATE INDEX idx_medicines_category ON medicines(category_id);
CREATE INDEX idx_medicines_name ON medicines(name);
CREATE INDEX idx_pharmacy_medicines_pharmacy ON pharmacy_medicines(pharmacy_id);
CREATE INDEX idx_pharmacy_medicines_medicine ON pharmacy_medicines(medicine_id);
CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_pharmacy ON orders(pharmacy_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_deliveries_rider ON deliveries(rider_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Pharmacies policies
CREATE POLICY "Anyone can view verified pharmacies" ON pharmacies FOR SELECT USING (is_verified = true);
CREATE POLICY "Pharmacy owners can manage their pharmacy" ON pharmacies FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all pharmacies" ON pharmacies FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Riders policies
CREATE POLICY "Riders can view and update own profile" ON riders FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all riders" ON riders FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Client profiles policies
CREATE POLICY "Clients can manage own profile" ON client_profiles FOR ALL USING (user_id = auth.uid());

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Medicines policies (public read)
CREATE POLICY "Anyone can view medicines" ON medicines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage medicines" ON medicines FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Pharmacy medicines policies
CREATE POLICY "Anyone can view active pharmacy medicines" ON pharmacy_medicines FOR SELECT USING (is_active = true);
CREATE POLICY "Pharmacy owners can manage their inventory" ON pharmacy_medicines FOR ALL USING (
  EXISTS (SELECT 1 FROM pharmacies WHERE id = pharmacy_id AND user_id = auth.uid())
);

-- Orders policies
CREATE POLICY "Clients can view own orders" ON orders FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Clients can create orders" ON orders FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Pharmacies can view their orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM pharmacies WHERE id = pharmacy_id AND user_id = auth.uid())
);
CREATE POLICY "Pharmacies can update their orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM pharmacies WHERE id = pharmacy_id AND user_id = auth.uid())
);

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (client_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM pharmacies WHERE id = orders.pharmacy_id AND user_id = auth.uid())))
);
CREATE POLICY "Clients can create order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND client_id = auth.uid())
);

-- Prescriptions policies
CREATE POLICY "Clients can manage own prescriptions" ON prescriptions FOR ALL USING (client_id = auth.uid());
CREATE POLICY "Pharmacies can view prescriptions for their orders" ON prescriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders o 
    JOIN pharmacies p ON o.pharmacy_id = p.id 
    WHERE o.id = prescriptions.order_id AND p.user_id = auth.uid())
);

-- Deliveries policies
CREATE POLICY "Riders can view assigned deliveries" ON deliveries FOR SELECT USING (rider_id IN (SELECT id FROM riders WHERE user_id = auth.uid()));
CREATE POLICY "Riders can update assigned deliveries" ON deliveries FOR UPDATE USING (rider_id IN (SELECT id FROM riders WHERE user_id = auth.uid()));

-- Payments policies
CREATE POLICY "Users can view payments for their orders" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND client_id = auth.uid())
);

-- Platform settings policies (admin only)
CREATE POLICY "Admins can manage settings" ON platform_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Anyone can read settings" ON platform_settings FOR SELECT TO authenticated USING (true);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_pharmacies_updated_at BEFORE UPDATE ON pharmacies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_riders_updated_at BEFORE UPDATE ON riders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON client_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON medicines FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_pharmacy_medicines_updated_at BEFORE UPDATE ON pharmacy_medicines FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'CLIENT')
  );
  
  -- Create client profile for CLIENT role
  IF COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'CLIENT') = 'CLIENT' THEN
    INSERT INTO client_profiles (user_id) VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- SEED DATA: Categories
-- =============================================

INSERT INTO categories (name, slug, icon, description, display_order) VALUES
('Pain & Fever', 'pain-fever', 'thermometer', 'Pain relievers and fever reducers', 1),
('Cough & Cold', 'cough-cold', 'wind', 'Cough syrups and cold medicines', 2),
('Malaria', 'malaria', 'bug', 'Antimalarial medications', 3),
('Hypertension', 'hypertension', 'heart-pulse', 'Blood pressure medications', 4),
('Diabetes', 'diabetes', 'droplet', 'Diabetes management medicines', 5),
('Baby & Children', 'baby-children', 'baby', 'Pediatric medicines and care', 6),
('Vitamins & Supplements', 'vitamins-supplements', 'pill', 'Vitamins and dietary supplements', 7),
('Antibiotics', 'antibiotics', 'shield', 'Prescription antibiotics', 8),
('Skin Care', 'skin-care', 'sparkles', 'Dermatological products', 9),
('First Aid', 'first-aid', 'cross', 'First aid supplies and antiseptics', 10);
