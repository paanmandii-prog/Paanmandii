-- ============================================================
-- PAAN MANDI — Seed Data
-- Migration: 002_seed_data.sql
-- ============================================================
-- NOTE: All prices, quantities, and product details below are
-- DEMONSTRATION PLACEHOLDERS only. Replace with real business
-- data before launching.
-- ============================================================

-- ============================================================
-- BUSINESS SETTINGS
-- ============================================================

INSERT INTO business_settings (key, value, description) VALUES
  ('shop_name', '"PAAN MANDI"', 'Business name'),
  ('shop_tagline', '"Aapki Paan Ki Dukaan, Ab Online!"', 'Business tagline'),
  ('shop_address', '{"line1": "Shop No. XX, Market Name", "city": "Your City", "state": "Your State", "pincode": "000000"}', 'Shop physical address — REPLACE WITH REAL ADDRESS'),
  ('shop_mobile', '"9999999999"', 'Primary contact number — REPLACE'),
  ('shop_email', '"info@example.com"', 'Contact email — REPLACE'),
  ('shop_hours', '{"monday": "9:00 AM - 8:00 PM", "tuesday": "9:00 AM - 8:00 PM", "wednesday": "9:00 AM - 8:00 PM", "thursday": "9:00 AM - 8:00 PM", "friday": "9:00 AM - 8:00 PM", "saturday": "9:00 AM - 8:00 PM", "sunday": "Closed"}', 'Business hours'),
  ('cod_enabled', 'true', 'Cash on Delivery enabled'),
  ('pay_at_shop_enabled', 'true', 'Pay at Shop for pickup orders'),
  ('razorpay_enabled', 'false', 'Online payment via Razorpay — configure credentials first'),
  ('min_order_amount_paise', '50000', 'Minimum order amount in paise (₹500)'),
  ('free_delivery_threshold_paise', '200000', 'Free delivery above this amount (₹2000)'),
  ('pickup_enabled', 'true', 'Shop pickup enabled'),
  ('delivery_enabled', 'true', 'Home/shop delivery enabled'),
  ('tax_included_in_price', 'false', 'Whether listed prices include tax'),
  ('default_tax_rate', '0', 'Default GST rate (0% for basic paan leaves — verify with CA)'),
  ('currency', '"INR"', 'Currency'),
  ('gst_number', '""', 'GST Registration Number — REPLACE after obtaining registration'),
  ('fssai_number', '""', 'FSSAI License Number — REPLACE if applicable');

-- ============================================================
-- CATEGORIES
-- ============================================================

INSERT INTO categories (name, slug, description, sort_order, is_active, requires_legal_verification) VALUES
  ('Paan Leaves', 'paan-leaves', 'Fresh and quality paan leaves (betel leaves) for wholesale purchase', 1, TRUE, FALSE),
  ('Kattha & Chuna', 'kattha-chuna', 'Kattha (catechu) and Chuna (lime paste) for paan preparation', 2, TRUE, FALSE),
  ('Supari', 'supari', 'Betel nut / Supari in various forms', 3, TRUE, FALSE),
  ('Paan Packaging', 'paan-packaging', 'Packaging materials for paan shops — foil, bags, boxes', 4, TRUE, FALSE),
  ('Other Paan Shop Supplies', 'paan-shop-supplies', 'Paan shop essentials — gulkand, mukhwas, elaichi, etc.', 5, TRUE, FALSE),
  ('Paan Masala (Restricted)', 'paan-masala-restricted', 'Restricted category — only legally permitted products listed after verification', 6, FALSE, TRUE);

-- ============================================================
-- SAMPLE PRODUCTS (Demonstration data — REPLACE prices with actual)
-- ============================================================

-- Paan Leaves
INSERT INTO products (sku, name, slug, description, category_id, unit, base_price_paise, mrp_paise, min_order_qty, qty_increment, tax_rate_percent, is_active, is_popular, meta_title, meta_description)
SELECT
  'PM-PL-001',
  'Magahi Paan Leaves',
  'magahi-paan-leaves',
  'Premium quality Magahi paan leaves from Bihar. Known for their softness and mild flavor. Sold per bundle of approximately 100 leaves.',
  id,
  'bundle',
  25000,  -- ₹250 per bundle (PLACEHOLDER)
  30000,  -- MRP ₹300 (PLACEHOLDER)
  1,
  1,
  0.00,
  TRUE,
  TRUE,
  'Magahi Paan Leaves Wholesale | PAAN MANDI',
  'Buy Magahi paan leaves wholesale at best prices. Fresh quality betel leaves from Bihar.'
FROM categories WHERE slug = 'paan-leaves';

INSERT INTO products (sku, name, slug, description, category_id, unit, base_price_paise, mrp_paise, min_order_qty, qty_increment, tax_rate_percent, is_active, is_popular, meta_title, meta_description)
SELECT
  'PM-PL-002',
  'Calcutta Paan Leaves',
  'calcutta-paan-leaves',
  'Classic Calcutta variety paan leaves. Preferred by most paan shops for their balanced taste and texture. Per bundle of 80 leaves.',
  id,
  'bundle',
  22000,  -- ₹220 per bundle (PLACEHOLDER)
  27000,
  1,
  1,
  0.00,
  TRUE,
  TRUE,
  'Calcutta Paan Leaves Wholesale | PAAN MANDI',
  'Buy Calcutta paan leaves at wholesale prices. Best quality for your paan shop.'
FROM categories WHERE slug = 'paan-leaves';

INSERT INTO products (sku, name, slug, description, category_id, unit, base_price_paise, mrp_paise, min_order_qty, qty_increment, tax_rate_percent, is_active, is_featured, meta_title, meta_description)
SELECT
  'PM-PL-003',
  'Banarasi Paan Leaves',
  'banarasi-paan-leaves',
  'Authentic Banarasi paan leaves — large, soft, and aromatic. Ideal for Meetha Paan and Banarasi Paan specialties. Per bundle of 60 leaves.',
  id,
  'bundle',
  35000,  -- ₹350 per bundle (PLACEHOLDER)
  42000,
  1,
  1,
  0.00,
  TRUE,
  TRUE,
  'Banarasi Paan Leaves Wholesale | PAAN MANDI',
  'Authentic Banarasi paan leaves for wholesale purchase. Premium quality, fast delivery.'
FROM categories WHERE slug = 'paan-leaves';

-- Kattha & Chuna
INSERT INTO products (sku, name, slug, description, category_id, unit, base_price_paise, mrp_paise, min_order_qty, qty_increment, tax_rate_percent, is_active, is_popular, meta_title, meta_description)
SELECT
  'PM-KC-001',
  'Kattha Powder Premium',
  'kattha-powder-premium',
  'Food-grade kattha (catechu) powder for paan preparation. Consistent color and quality. 1 kg packet.',
  id,
  'kg',
  18000,  -- ₹180 per kg (PLACEHOLDER)
  22000,
  1,
  1,
  0.00,
  TRUE,
  TRUE,
  'Kattha Powder Wholesale | PAAN MANDI',
  'Buy premium quality kattha powder for paan shops at wholesale prices.'
FROM categories WHERE slug = 'kattha-chuna';

INSERT INTO products (sku, name, slug, description, category_id, unit, base_price_paise, mrp_paise, min_order_qty, qty_increment, tax_rate_percent, is_active, meta_title, meta_description)
SELECT
  'PM-KC-002',
  'Chuna (Lime Paste)',
  'chuna-lime-paste',
  'Pure food-grade chuna (slaked lime paste) for paan. Ready-to-use consistency. 500g container.',
  id,
  'packet',
  8000,  -- ₹80 per 500g (PLACEHOLDER)
  10000,
  1,
  1,
  0.00,
  TRUE,
  'Chuna Lime Paste Wholesale | PAAN MANDI',
  'Food-grade chuna lime paste for paan shops at wholesale rates.'
FROM categories WHERE slug = 'kattha-chuna';

-- Supari
INSERT INTO products (sku, name, slug, description, category_id, unit, base_price_paise, mrp_paise, min_order_qty, qty_increment, tax_rate_percent, is_active, is_popular, meta_title, meta_description)
SELECT
  'PM-SP-001',
  'Kali Supari (Whole)',
  'kali-supari-whole',
  'Whole dried betel nut (Kali Supari). Naturally processed. 1 kg packet.',
  id,
  'kg',
  32000,  -- ₹320 per kg (PLACEHOLDER)
  38000,
  1,
  1,
  0.00,
  TRUE,
  TRUE,
  'Kali Supari Wholesale | PAAN MANDI',
  'Buy kali supari (whole betel nut) at wholesale rates. Quality assured.'
FROM categories WHERE slug = 'supari';

-- Paan Packaging
INSERT INTO products (sku, name, slug, description, category_id, unit, base_price_paise, mrp_paise, min_order_qty, qty_increment, tax_rate_percent, is_active, is_featured, meta_title, meta_description)
SELECT
  'PM-PK-001',
  'Silver Paan Foil Roll',
  'silver-paan-foil-roll',
  'Food-safe silver aluminum foil for paan wrapping. 100 meters per roll.',
  id,
  'roll',
  15000,  -- ₹150 per roll (PLACEHOLDER)
  18000,
  2,
  2,
  18.00,  -- 18% GST on packaging
  TRUE,
  TRUE,
  'Silver Paan Foil Roll Wholesale | PAAN MANDI',
  'Food-safe silver foil for paan wrapping. Buy in bulk at wholesale prices.'
FROM categories WHERE slug = 'paan-packaging';

-- Other Supplies
INSERT INTO products (sku, name, slug, description, category_id, unit, base_price_paise, mrp_paise, min_order_qty, qty_increment, tax_rate_percent, is_active, is_popular, meta_title, meta_description)
SELECT
  'PM-SU-001',
  'Rose Gulkand Premium',
  'rose-gulkand-premium',
  'Premium rose petal gulkand for meetha paan and sweet preparations. 1 kg jar.',
  id,
  'kg',
  22000,  -- ₹220 per kg (PLACEHOLDER)
  28000,
  1,
  1,
  0.00,
  TRUE,
  TRUE,
  'Gulkand Wholesale | PAAN MANDI',
  'Premium rose gulkand for paan shops. Wholesale pricing available.'
FROM categories WHERE slug = 'paan-shop-supplies';

-- ============================================================
-- WHOLESALE PRICE TIERS (Demonstration values — configure per actual pricing)
-- ============================================================

-- Magahi Paan Leaves tiers
INSERT INTO product_price_tiers (product_id, min_qty, max_qty, price_paise)
SELECT id, 1, 9, 25000 FROM products WHERE sku = 'PM-PL-001';
INSERT INTO product_price_tiers (product_id, min_qty, max_qty, price_paise)
SELECT id, 10, 24, 23500 FROM products WHERE sku = 'PM-PL-001';
INSERT INTO product_price_tiers (product_id, min_qty, max_qty, price_paise)
SELECT id, 25, NULL, 22000 FROM products WHERE sku = 'PM-PL-001';

-- Calcutta Paan Leaves tiers
INSERT INTO product_price_tiers (product_id, min_qty, max_qty, price_paise)
SELECT id, 1, 9, 22000 FROM products WHERE sku = 'PM-PL-002';
INSERT INTO product_price_tiers (product_id, min_qty, max_qty, price_paise)
SELECT id, 10, 24, 20000 FROM products WHERE sku = 'PM-PL-002';
INSERT INTO product_price_tiers (product_id, min_qty, max_qty, price_paise)
SELECT id, 25, NULL, 18500 FROM products WHERE sku = 'PM-PL-002';

-- Banarasi Paan Leaves tiers
INSERT INTO product_price_tiers (product_id, min_qty, max_qty, price_paise)
SELECT id, 1, 9, 35000 FROM products WHERE sku = 'PM-PL-003';
INSERT INTO product_price_tiers (product_id, min_qty, max_qty, price_paise)
SELECT id, 10, 24, 32000 FROM products WHERE sku = 'PM-PL-003';
INSERT INTO product_price_tiers (product_id, min_qty, max_qty, price_paise)
SELECT id, 25, NULL, 29000 FROM products WHERE sku = 'PM-PL-003';

-- ============================================================
-- SAMPLE DELIVERY ZONES (PLACEHOLDER — replace with actual zones)
-- ============================================================

INSERT INTO delivery_zones (name, pincodes, delivery_fee_paise, free_delivery_threshold_paise, estimated_days_min, estimated_days_max, is_active) VALUES
  ('Local Zone', ARRAY['110001', '110002', '110003'], 5000, 200000, 1, 2, TRUE),
  ('Extended Zone', ARRAY['110004', '110005', '110006', '110007'], 10000, 300000, 2, 3, TRUE);

-- ============================================================
-- SAMPLE PICKUP SLOTS (Mon-Sat 9AM-6PM — configure actual hours)
-- ============================================================

-- Monday through Saturday, two slots per day
INSERT INTO pickup_slots (day_of_week, slot_start, slot_end, capacity, is_available)
SELECT day, '09:00', '12:00', 5, TRUE
FROM generate_series(1, 6) AS day;

INSERT INTO pickup_slots (day_of_week, slot_start, slot_end, capacity, is_available)
SELECT day, '14:00', '18:00', 5, TRUE
FROM generate_series(1, 6) AS day;
