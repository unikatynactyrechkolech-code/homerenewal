import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Public client — anon key, subject to RLS. Používá se pro čtení. */
export function getPublicClient() {
  return createClient(url, anonKey);
}

/**
 * Admin client — service_role key, obchází RLS.
 * Používá se pouze v server-side API routes za autentizací.
 * Vrací null pokud SUPABASE_SERVICE_ROLE_KEY není nastavený.
 */
export function getAdminClient() {
  if (!serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export function isDbConfigured(): boolean {
  return Boolean(url && anonKey);
}

export function isAdminDbConfigured(): boolean {
  return Boolean(url && serviceKey);
}
