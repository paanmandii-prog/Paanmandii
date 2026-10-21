-- ============================================================
-- PAAN MANDI — Migration 004: 39 Source Rate List Catalogue
-- Adds bilingual fields, unit confirmation, and compliance controls
-- ============================================================

-- Add new columns to products table if they do not exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS source_id TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_hi TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS unit_confirmed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS compliance_status TEXT NOT NULL DEFAULT 'approved' CHECK (compliance_status IN ('approved', 'review_required', 'restricted', 'rejected'));
ALTER TABLE products ADD COLUMN IF NOT EXISTS compliance_notes TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_status TEXT NOT NULL DEFAULT 'representative' CHECK (image_status IN ('photographed', 'representative', 'placeholder', 'needs_owner_photo'));
ALTER TABLE products ADD COLUMN IF NOT EXISTS publication_status TEXT NOT NULL DEFAULT 'published' CHECK (publication_status IN ('published', 'draft', 'archived'));

-- Ensure Categories exist
INSERT INTO categories (name, slug, description, sort_order, is_active, requires_legal_verification)
VALUES
  ('मुख्य सामान (Main Supplies)', 'mukhya-saman', 'Essential wholesale betel leaves, kattha, branded pouches, and core mandi preparations.', 1, TRUE, FALSE),
  ('अन्य सामान (Other Supplies)', 'anya-saman', 'Aromatic spices, condiments, digestive mukhwas, lime tubes, and specialty paan ingredients.', 2, TRUE, FALSE)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Function to safely insert/update rate list products
DO $$
DECLARE
  mukhya_id UUID;
  anya_id UUID;
BEGIN
  SELECT id INTO mukhya_id FROM categories WHERE slug = 'mukhya-saman';
  SELECT id INTO anya_id FROM categories WHERE slug = 'anya-saman';

  -- 01 सौंफ (Saunf / Fennel Seeds) - 30
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, is_popular, is_featured, compliance_status, image_status, publication_status)
  VALUES ('01', 'PM-MS-001', 'Saunf / Fennel Seeds', 'सौंफ', 'Saunf / Fennel Seeds', 'item-01-pm-ms-001', 'Sweet, highly aromatic green fennel seeds (saunf) cleaned and sorted for wholesale paan preparation and digestive mukhwas.', mukhya_id, 'Needs confirmation', FALSE, 3000, 3800, 1, 1, TRUE, TRUE, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET
    source_id = EXCLUDED.source_id,
    name = EXCLUDED.name,
    name_hi = EXCLUDED.name_hi,
    name_en = EXCLUDED.name_en,
    base_price_paise = EXCLUDED.base_price_paise,
    unit = EXCLUDED.unit;

  -- 02 गरी (Gari) - 25
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, is_popular, compliance_status, image_status, publication_status)
  VALUES ('02', 'PM-MS-002', 'Gari', 'गरी', 'Gari', 'item-02-pm-ms-002', 'Dried coconut copra (gari) of premium oil richness.', mukhya_id, 'Needs confirmation', FALSE, 2500, 3200, 1, 1, TRUE, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 03 जगत (Jagat) - 110
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, is_popular, is_featured, compliance_status, image_status, publication_status)
  VALUES ('03', 'PM-MS-003', 'Jagat', 'जगत', 'Jagat', 'item-03-pm-ms-003', 'Authentic Jagat brand paan wholesale condiment blend.', mukhya_id, 'Needs confirmation', FALSE, 11000, 13800, 1, 1, TRUE, TRUE, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 04 भोला (Bhola) - 60
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('04', 'PM-MS-004', 'Bhola', 'भोला', 'Bhola', 'item-04-pm-ms-004', 'Standard Bhola wholesale pack.', mukhya_id, 'Needs confirmation', FALSE, 6000, 7500, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 05 64 नंबर (64 Number) - 50
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('05', 'PM-MS-005', '64 Number', '64 नंबर', '64 Number', 'item-05-pm-ms-005', 'Traditional 64 Number batch wholesale supply.', mukhya_id, 'Needs confirmation', FALSE, 5000, 6300, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 06 छोटा रसना (Chhota Rasna) - 45
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('06', 'PM-MS-006', 'Chhota Rasna', 'छोटा रसना', 'Chhota Rasna', 'item-06-pm-ms-006', 'Chhota Rasna wholesale flavoring formulation.', mukhya_id, 'Needs confirmation', FALSE, 4500, 5600, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 07 बड़ा रसना (Bada Rasna) - 65
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('07', 'PM-MS-007', 'Bada Rasna', 'बड़ा रसना', 'Bada Rasna', 'item-07-pm-ms-007', 'Bada Rasna large format flavoring formulation.', mukhya_id, 'Needs confirmation', FALSE, 6500, 8100, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 08 पीली, काली वाली (Peeli, Kaali Wali) - 60
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('08', 'PM-MS-008', 'Peeli, Kaali Wali', 'पीली, काली वाली', 'Peeli, Kaali Wali', 'item-08-pm-ms-008', 'Dual-variety Peeli, Kaali Wali paan preparation condiment.', mukhya_id, 'Needs confirmation', FALSE, 6000, 7500, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 09 डमरू 64 (Damru 64) - 90
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('09', 'PM-MS-009', 'Damru 64', 'डमरू 64', 'Damru 64', 'item-09-pm-ms-009', 'Damru 64 grade wholesale mandi preparation.', mukhya_id, 'Needs confirmation', FALSE, 9000, 11200, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 10 चौड़ी (Chaudi) - 35
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('10', 'PM-MS-010', 'Chaudi', 'चौड़ी', 'Chaudi', 'item-10-pm-ms-010', 'Chaudi broad-cut traditional paan condiment.', mukhya_id, 'Needs confirmation', FALSE, 3500, 4400, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 11 डमरू 300 (Damru 300) - 160
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, is_featured, compliance_status, image_status, publication_status)
  VALUES ('11', 'PM-MS-011', 'Damru 300', 'डमरू 300', 'Damru 300', 'item-11-pm-ms-011', 'High-grade Damru 300 specialty paan condiment.', mukhya_id, 'Needs confirmation', FALSE, 16000, 20000, 1, 1, TRUE, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 12 तीन हजार नंबर (Teen Hazar Number) - 90
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('12', 'PM-MS-012', 'Teen Hazar Number', 'तीन हजार नंबर', 'Teen Hazar Number', 'item-12-pm-ms-012', 'Teen Hazar Number batch wholesale supply.', mukhya_id, 'Needs confirmation', FALSE, 9000, 11200, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 13 महादेव (Mahadev) - 80
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('13', 'PM-MS-013', 'Mahadev', 'महादेव', 'Mahadev', 'item-13-pm-ms-013', 'Mahadev wholesale paan supply pack.', mukhya_id, 'Needs confirmation', FALSE, 8000, 10000, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 14 सूखा कत्था (Sukha Kattha) - 85
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, is_featured, is_popular, compliance_status, image_status, publication_status)
  VALUES ('14', 'PM-MS-014', 'Sukha Kattha', 'सूखा कत्था', 'Sukha Kattha', 'item-14-pm-ms-014', 'Pure dried acacia wood catechu pieces for traditional paan.', mukhya_id, 'Needs confirmation', FALSE, 8500, 10600, 1, 1, TRUE, TRUE, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 15 सरोज (Saroj) - 60
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('15', 'PM-MS-015', 'Saroj', 'सरोज', 'Saroj', 'item-15-pm-ms-015', 'Saroj wholesale mandi supply (Entry 15). Preserved as distinct record.', mukhya_id, 'Needs confirmation', FALSE, 6000, 7500, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 16 पाउच कत्था (Pouch Kattha — entry 16) - 85
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('16', 'PM-MS-016', 'Pouch Kattha — entry 16', 'पाउच कत्था', 'Pouch Kattha — entry 16', 'item-16-pm-ms-016', 'Pouch Kattha sealed sachet format (Entry 16, Rate ₹85).', mukhya_id, 'Needs confirmation', FALSE, 8500, 10600, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 17 पाउच कत्था (Pouch Kattha — entry 17) - 25
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('17', 'PM-MS-017', 'Pouch Kattha — entry 17', 'पाउच कत्था', 'Pouch Kattha — entry 17', 'item-17-pm-ms-017', 'Pouch Kattha compact packet (Entry 17, Rate ₹25).', mukhya_id, 'Needs confirmation', FALSE, 2500, 3200, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 18 सरोज (Saroj — entry 18) - 60
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('18', 'PM-MS-018', 'Saroj — entry 18', 'सरोज', 'Saroj — entry 18', 'item-18-pm-ms-018', 'Saroj wholesale supply (Entry 18, Rate ₹60).', mukhya_id, 'Needs confirmation', FALSE, 6000, 7500, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 19 पाउच जगत (Pouch Jagat) - 30
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('19', 'PM-MS-019', 'Pouch Jagat', 'पाउच जगत', 'Pouch Jagat', 'item-19-pm-ms-019', 'Pouch Jagat sealed portion pack.', mukhya_id, 'Needs confirmation', FALSE, 3000, 3800, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 20 पाउच कत्था (Pouch Kattha — entry 20) - 25
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('20', 'PM-MS-020', 'Pouch Kattha — entry 20', 'पाउच कत्था', 'Pouch Kattha — entry 20', 'item-20-pm-ms-020', 'Pouch Kattha portion format (Entry 20, Rate ₹25).', mukhya_id, 'Needs confirmation', FALSE, 2500, 3200, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 21 आशीर्वाद (Ashirwad) - 40
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('21', 'PM-MS-021', 'Ashirwad', 'आशीर्वाद', 'Ashirwad', 'item-21-pm-ms-021', 'Ashirwad brand wholesale paan shop ingredient.', mukhya_id, 'Needs confirmation', FALSE, 4000, 5000, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 22 पाउच भोला (Pouch Bhola) - 20
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, is_popular, compliance_status, image_status, publication_status)
  VALUES ('22', 'PM-MS-022', 'Pouch Bhola', 'पाउच भोला', 'Pouch Bhola', 'item-22-pm-ms-022', 'Pouch Bhola portion pack for paan kiosks.', mukhya_id, 'Needs confirmation', FALSE, 2000, 2500, 1, 1, TRUE, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 23 पाउच 64 (Pouch 64) - 20
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('23', 'PM-MS-023', 'Pouch 64', 'पाउच 64', 'Pouch 64', 'item-23-pm-ms-023', 'Pouch 64 number portion packet.', mukhya_id, 'Needs confirmation', FALSE, 2000, 2500, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 24 गुलकंद (Gulkand) - 50
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, is_featured, is_popular, compliance_status, image_status, publication_status)
  VALUES ('24', 'PM-MS-024', 'Gulkand', 'गुलकंद', 'Gulkand', 'item-24-pm-ms-024', 'Sun-cured Damask rose petal preserve (gulkand) with pure sugar.', mukhya_id, 'Needs confirmation', FALSE, 5000, 6500, 1, 1, TRUE, TRUE, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 25 रवि (Ravi) - 65
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('25', 'PM-MS-025', 'Ravi', 'रवि', 'Ravi', 'item-25-pm-ms-025', 'Ravi brand wholesale paan ingredient.', mukhya_id, 'Needs confirmation', FALSE, 6500, 8100, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 26 कालवी (लाल वाली) (Kalvi (Laal Wali)) - 70
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('26', 'PM-MS-026', 'Kalvi (Laal Wali)', 'कालवी (लाल वाली)', 'Kalvi (Laal Wali)', 'item-26-pm-ms-026', 'Kalvi (Laal Wali) crimson-dyed specialty paan blend.', mukhya_id, 'Needs confirmation', FALSE, 7000, 8800, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 27 लच्छा (Lachha) - 15
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, is_popular, compliance_status, image_status, publication_status)
  VALUES ('27', 'PM-AS-027', 'Lachha', 'लच्छा', 'Lachha', 'item-27-pm-as-027', 'Sweet shredded candied coconut lachha strands.', anya_id, 'Needs confirmation', FALSE, 1500, 2000, 1, 1, TRUE, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 28 मुलैठी (Mulethi / Licorice) - 30
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('28', 'PM-AS-028', 'Mulethi / Licorice', 'मुलैठी', 'Mulethi / Licorice', 'item-28-pm-as-028', 'Natural sweet licorice root (mulethi) cuts for digestive paan.', anya_id, 'Needs confirmation', FALSE, 3000, 3800, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 29 चेरी (Cherry) - 15
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, is_popular, compliance_status, image_status, publication_status)
  VALUES ('29', 'PM-AS-029', 'Cherry', 'चेरी', 'Cherry', 'item-29-pm-as-029', 'Glazed sweet red cherries for topping meetha paan.', anya_id, 'Needs confirmation', FALSE, 1500, 2000, 1, 1, TRUE, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 30 मिक्सचर (Mixture) - 15
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('30', 'PM-AS-030', 'Mixture', 'मिक्सचर', 'Mixture', 'item-30-pm-as-030', 'Aromatic digestive paan mixture combining roasted seeds.', anya_id, 'Needs confirmation', FALSE, 1500, 2000, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 31 निर्मली (Nirmali) - 75
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, image_status, publication_status)
  VALUES ('31', 'PM-AS-031', 'Nirmali', 'निर्मली', 'Nirmali', 'item-31-pm-as-031', 'Traditional Ayurvedic Nirmali seeds used in paan craft.', anya_id, 'Needs confirmation', FALSE, 7500, 9400, 1, 1, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 32 इलायची (Elaichi / Cardamom) - 160
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, is_featured, is_popular, compliance_status, image_status, publication_status)
  VALUES ('32', 'PM-AS-032', 'Elaichi / Cardamom', 'इलायची', 'Elaichi / Cardamom', 'item-32-pm-as-032', 'Whole green cardamom (chhoti elaichi) pods packed with aroma.', anya_id, 'Needs confirmation', FALSE, 16000, 20000, 1, 1, TRUE, TRUE, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 33 लौंग (Laung / Cloves) - 60
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, is_popular, compliance_status, image_status, publication_status)
  VALUES ('33', 'PM-AS-033', 'Laung / Cloves', 'लौंग', 'Laung / Cloves', 'item-33-pm-as-033', 'Select whole cloves (laung) with intact crowns for paan gilori.', anya_id, 'Needs confirmation', FALSE, 6000, 7500, 1, 1, TRUE, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 34 पिपरमिंट (Peppermint) - 25
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, is_popular, compliance_status, image_status, publication_status)
  VALUES ('34', 'PM-AS-034', 'Peppermint', 'पिपरमिंट', 'Peppermint', 'item-34-pm-as-034', 'High-purity menthol crystals providing instant cooling freshness.', anya_id, 'Needs confirmation', FALSE, 2500, 3200, 1, 1, TRUE, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 35 ब्रास (Brass — confirm product identity) - 25
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, compliance_notes, image_status, publication_status)
  VALUES ('35', 'PM-AS-035', 'Brass — confirm product identity', 'ब्रास', 'Brass — confirm product identity', 'item-35-pm-as-035', 'Brass entry in rate list. English identity flagged for owner confirmation.', anya_id, 'Needs confirmation', FALSE, 2500, 3200, 1, 1, TRUE, 'approved', 'Ambiguous term in source rate list. Flagged for owner confirmation.', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 36 भोला भांग (Bhola Bhang — compliance review required) - 45 (LOCKED/UNPUBLISHED)
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, compliance_notes, image_status, publication_status)
  VALUES ('36', 'PM-AS-036', 'Bhola Bhang — compliance review required', 'भोला भांग', 'Bhola Bhang — compliance review required', 'item-36-pm-as-036', 'Legally regulated item. Unpublished and restricted pending compliance verification.', anya_id, 'Needs confirmation', FALSE, 4500, 5600, 1, 1, FALSE, 'review_required', 'COMPLIANCE LOCK: Regulated item. Strictly unpublished.', 'placeholder', 'draft')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise, is_active = FALSE;

  -- 37 चूना (Chuna / Lime) - 20
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, is_popular, compliance_status, image_status, publication_status)
  VALUES ('37', 'PM-AS-037', 'Chuna / Lime', 'चूना', 'Chuna / Lime', 'item-37-pm-as-037', 'Purified mineral slaked edible lime paste for paan application.', anya_id, 'Needs confirmation', FALSE, 2000, 2500, 1, 1, TRUE, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 38 चूना ट्यूब (Chuna Tube) - 50
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, is_featured, is_popular, compliance_status, image_status, publication_status)
  VALUES ('38', 'PM-AS-038', 'Chuna Tube', 'चूना ट्यूब', 'Chuna Tube', 'item-38-pm-as-038', 'Hygienic easy-squeeze nozzle tube of edible chuna.', anya_id, 'Needs confirmation', FALSE, 5000, 6300, 1, 1, TRUE, TRUE, TRUE, 'approved', 'representative', 'published')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise;

  -- 39 किमाम (Kimam — compliance review required) - 65 (LOCKED/UNPUBLISHED)
  INSERT INTO products (source_id, sku, name, name_hi, name_en, slug, description, category_id, unit, unit_confirmed, base_price_paise, mrp_paise, min_order_qty, qty_increment, is_active, compliance_status, compliance_notes, image_status, publication_status)
  VALUES ('39', 'PM-AS-039', 'Kimam — compliance review required', 'किमाम', 'Kimam — compliance review required', 'item-39-pm-as-039', 'Traditional concentrated aromatic paan compound. Unpublished pending compliance.', anya_id, 'Needs confirmation', FALSE, 6500, 8100, 1, 1, FALSE, 'review_required', 'COMPLIANCE LOCK: Requires regulatory verification. Blocked from store.', 'placeholder', 'draft')
  ON CONFLICT (sku) DO UPDATE SET base_price_paise = EXCLUDED.base_price_paise, is_active = FALSE;

END $$;
