-- =====================================================================
-- HOME RENEWAL — INIT SQL
-- Spustit ručně v Postgres (Supabase / Neon / Vercel Postgres / vlastní).
-- Po spuštění a nastavení .env (DATABASE_URL, ADMIN_PASSWORD, AUTH_SECRET)
-- aplikace automaticky funguje včetně admin sekce a editace textů.
-- =====================================================================

-- Pokud běžíš mimo Supabase a gen_random_uuid() chybí, odkomentuj:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------
-- 1. CONTENT BLOCKS — overrides pro libovolný text na webu
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_blocks (
  key           TEXT PRIMARY KEY,            -- stabilní identifikátor (pathname::tag:index)
  text          TEXT NOT NULL,
  font_family   TEXT,                        -- např. 'Inter', 'Playfair Display', 'serif'
  font_size     TEXT,                        -- např. '32px'
  font_weight   TEXT,                        -- '300' až '900'
  color         TEXT,                        -- hex / rgb
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS content_blocks_updated_idx ON content_blocks (updated_at DESC);

-- ---------------------------------------------------------------------
-- 2. PROPERTIES — nemovitosti (homepage + /chci-koupit)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS properties (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  location      TEXT,
  price_czk     BIGINT,
  size_m2       INTEGER,
  rooms         TEXT,                        -- např. '3+kk'
  type          TEXT,                        -- 'apartment' | 'house' | 'commercial'
  status        TEXT NOT NULL DEFAULT 'active',  -- 'active' | 'reserved' | 'sold' | 'hidden'
  description   TEXT,
  cover_image   TEXT,                        -- URL hlavní fotky
  gallery       JSONB DEFAULT '[]'::jsonb,   -- pole URL dalších fotek
  featured      BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  slug          TEXT UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS properties_status_idx ON properties (status);
CREATE INDEX IF NOT EXISTS properties_featured_idx ON properties (featured);
CREATE INDEX IF NOT EXISTS properties_sort_idx ON properties (sort_order);

-- ---------------------------------------------------------------------
-- 3. ADMIN SESSIONS — volitelné, defaultně používáme HMAC cookie bez DB
-- ---------------------------------------------------------------------
-- (necháno prázdné, není potřeba)

-- ---------------------------------------------------------------------
-- 4. SEED — 3 ukázkové nemovitosti, ať homepage něco zobrazí hned po
-- spuštění. Smaž, pokud nechceš.
-- ---------------------------------------------------------------------
INSERT INTO properties (title, location, price_czk, size_m2, rooms, type, description, cover_image, featured, sort_order)
VALUES
  ('Byt 3+kk po rekonstrukci, Praha 7',
   'Praha 7 — Holešovice', 9890000, 78, '3+kk', 'apartment',
   'Kompletně zrekonstruovaný byt v cihlovém domě, jižní orientace, balkon. Po naší rekonstrukci připravený k nastěhování.',
   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
   TRUE, 1)
ON CONFLICT DO NOTHING;

INSERT INTO properties (title, location, price_czk, size_m2, rooms, type, description, cover_image, featured, sort_order)
VALUES
  ('Rodinný dům 5+1 se zahradou',
   'Praha-západ — Jesenice', 18500000, 165, '5+1', 'house',
   'Prostorný dům na klidné parcele 620 m². Po výměně oken, nová střecha, zachovaný původní charakter.',
   'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
   TRUE, 2)
ON CONFLICT DO NOTHING;

INSERT INTO properties (title, location, price_czk, size_m2, rooms, type, description, cover_image, featured, sort_order)
VALUES
  ('Loft 2+kk s terasou, Karlín',
   'Praha 8 — Karlín', 11200000, 64, '2+kk', 'apartment',
   'Industriální loft v původní karlínské fabrice. Pohledový beton, vysoké stropy, terasa 12 m².',
   'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
   FALSE, 3)
ON CONFLICT DO NOTHING;
