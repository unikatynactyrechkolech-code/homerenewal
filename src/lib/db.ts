import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

/**
 * Lazy Postgres pool. Vrací null, pokud DATABASE_URL není nastavený —
 * aplikace v takovém případě běží v "demo" režimu bez DB (žádné editace,
 * žádné inzeráty z DB), ale nepadá.
 */
export function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;

  if (!globalThis.__pgPool) {
    globalThis.__pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Supabase / většina hostovaných Postgres vyžaduje SSL.
      ssl: process.env.DATABASE_URL.includes("localhost")
        ? undefined
        : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30_000,
    });
  }

  return globalThis.__pgPool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const pool = getPool();
  if (!pool) return [];
  const res = await pool.query(text, params as never);
  return res.rows as T[];
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
