import { query, isDbConfigured } from "./db";

export type Property = {
  id: string;
  title: string;
  location: string | null;
  price_czk: number | null;
  size_m2: number | null;
  rooms: string | null;
  type: string | null;
  status: string;
  description: string | null;
  cover_image: string | null;
  gallery: string[];
  featured: boolean;
  sort_order: number;
  slug: string | null;
};

export async function listProperties(opts?: {
  onlyVisible?: boolean;
}): Promise<Property[]> {
  if (!isDbConfigured()) return [];
  const where = opts?.onlyVisible
    ? `WHERE status IN ('active','reserved','sold')`
    : ``;
  try {
    const rows = await query<Property>(
      `SELECT id, title, location, price_czk, size_m2, rooms, type, status,
              description, cover_image, COALESCE(gallery,'[]'::jsonb) AS gallery,
              featured, sort_order, slug
       FROM properties
       ${where}
       ORDER BY featured DESC, sort_order ASC, created_at DESC`,
    );
    return rows;
  } catch (e) {
    console.warn("[properties] DB read failed:", (e as Error).message);
    return [];
  }
}

export async function getProperty(id: string): Promise<Property | null> {
  if (!isDbConfigured()) return null;
  const rows = await query<Property>(
    `SELECT id, title, location, price_czk, size_m2, rooms, type, status,
            description, cover_image, COALESCE(gallery,'[]'::jsonb) AS gallery,
            featured, sort_order, slug
     FROM properties WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export type PropertyInput = Omit<Property, "id"> & { id?: string };

export async function upsertProperty(p: PropertyInput): Promise<Property> {
  if (p.id) {
    const rows = await query<Property>(
      `UPDATE properties SET
         title = $2, location = $3, price_czk = $4, size_m2 = $5, rooms = $6,
         type = $7, status = $8, description = $9, cover_image = $10,
         gallery = $11::jsonb, featured = $12, sort_order = $13, slug = $14,
         updated_at = NOW()
       WHERE id = $1
       RETURNING id, title, location, price_czk, size_m2, rooms, type, status,
                 description, cover_image, COALESCE(gallery,'[]'::jsonb) AS gallery,
                 featured, sort_order, slug`,
      [
        p.id,
        p.title,
        p.location,
        p.price_czk,
        p.size_m2,
        p.rooms,
        p.type,
        p.status,
        p.description,
        p.cover_image,
        JSON.stringify(p.gallery ?? []),
        p.featured,
        p.sort_order,
        p.slug,
      ],
    );
    return rows[0];
  }

  const rows = await query<Property>(
    `INSERT INTO properties
       (title, location, price_czk, size_m2, rooms, type, status, description,
        cover_image, gallery, featured, sort_order, slug)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12,$13)
     RETURNING id, title, location, price_czk, size_m2, rooms, type, status,
               description, cover_image, COALESCE(gallery,'[]'::jsonb) AS gallery,
               featured, sort_order, slug`,
    [
      p.title,
      p.location,
      p.price_czk,
      p.size_m2,
      p.rooms,
      p.type,
      p.status,
      p.description,
      p.cover_image,
      JSON.stringify(p.gallery ?? []),
      p.featured,
      p.sort_order,
      p.slug,
    ],
  );
  return rows[0];
}

export async function deleteProperty(id: string): Promise<void> {
  await query(`DELETE FROM properties WHERE id = $1`, [id]);
}
