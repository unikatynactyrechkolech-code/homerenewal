-- =====================================================================
-- HOME RENEWAL — V2 SCHEMA UPDATE
-- Spustit jednou v Supabase SQL editoru po init.sql.
-- Přidá customizable kategorie + galerii + řazení.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PROPERTY_OPTIONS — customizable typy / statusy / cokoliv
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS property_options (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind        TEXT NOT NULL,           -- 'type' | 'status' | 'feature'
  value       TEXT NOT NULL,           -- machine value, např. 'apartment'
  label       TEXT NOT NULL,           -- human label, např. 'Byt'
  color       TEXT,                    -- volitelná barva (pro statusy)
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (kind, value)
);

CREATE INDEX IF NOT EXISTS property_options_kind_idx ON property_options (kind, sort_order);

-- Seed základních typů (idempotentní)
INSERT INTO property_options (kind, value, label, sort_order) VALUES
  ('type', 'apartment', 'Byt', 1),
  ('type', 'house', 'Dům', 2),
  ('type', 'commercial', 'Komerční prostor', 3),
  ('type', 'land', 'Pozemek', 4)
ON CONFLICT (kind, value) DO NOTHING;

INSERT INTO property_options (kind, value, label, color, sort_order) VALUES
  ('status', 'active', 'K prodeji', '#c8a97e', 1),
  ('status', 'reserved', 'Rezervováno', '#f59e0b', 2),
  ('status', 'sold', 'Prodáno', '#6b7280', 3),
  ('status', 'hidden', 'Skryto', '#1a1a1a', 4)
ON CONFLICT (kind, value) DO NOTHING;

-- Seed dispozic
INSERT INTO property_options (kind, value, label, sort_order) VALUES
  ('rooms', '1_kk', '1+kk', 1),
  ('rooms', '1_1', '1+1', 2),
  ('rooms', '2_kk', '2+kk', 3),
  ('rooms', '2_1', '2+1', 4),
  ('rooms', '3_kk', '3+kk', 5),
  ('rooms', '3_1', '3+1', 6),
  ('rooms', '4_kk', '4+kk', 7),
  ('rooms', '4_1', '4+1', 8),
  ('rooms', '5_kk', '5+kk', 9),
  ('rooms', '5_1', '5+1', 10)
ON CONFLICT (kind, value) DO NOTHING;
