import { query, isDbConfigured } from "./db";

export type ContentBlock = {
  key: string;
  text: string;
  font_family: string | null;
  font_size: string | null;
  font_weight: string | null;
  color: string | null;
};

/** Načte všechny content overrides (typicky při buildu / SSR). */
export async function loadAllContent(): Promise<Record<string, ContentBlock>> {
  if (!isDbConfigured()) return {};
  try {
    const rows = await query<ContentBlock>(
      `SELECT key, text, font_family, font_size, font_weight, color FROM content_blocks`,
    );
    const map: Record<string, ContentBlock> = {};
    for (const r of rows) map[r.key] = r;
    return map;
  } catch (e) {
    console.warn("[content] DB read failed:", (e as Error).message);
    return {};
  }
}

/** Upsert jednoho overrides. */
export async function saveContent(block: ContentBlock): Promise<void> {
  if (!isDbConfigured()) throw new Error("DATABASE_URL není nastavený.");
  await query(
    `INSERT INTO content_blocks (key, text, font_family, font_size, font_weight, color, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (key) DO UPDATE
       SET text = EXCLUDED.text,
           font_family = EXCLUDED.font_family,
           font_size = EXCLUDED.font_size,
           font_weight = EXCLUDED.font_weight,
           color = EXCLUDED.color,
           updated_at = NOW()`,
    [
      block.key,
      block.text,
      block.font_family,
      block.font_size,
      block.font_weight,
      block.color,
    ],
  );
}

export async function deleteContent(key: string): Promise<void> {
  if (!isDbConfigured()) return;
  await query(`DELETE FROM content_blocks WHERE key = $1`, [key]);
}
