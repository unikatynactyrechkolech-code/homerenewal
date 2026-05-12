import { getPublicClient, getAdminClient, isDbConfigured } from "./db";

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
  try {
    // Preferuj admin clienta (obchází RLS) — tohle je server-side
    // a slouží pouze pro čtení verejně dostupných dat. Fallback na public.
    const sb = getAdminClient() ?? getPublicClient();
    let q = sb
      .from("properties")
      .select(
        "id, title, location, price_czk, size_m2, rooms, type, status, description, cover_image, gallery, featured, sort_order, slug",
      );
    if (opts?.onlyVisible) {
      q = q.in("status", ["active", "reserved", "sold"]);
    }
    q = q.order("featured", { ascending: false }).order("sort_order", { ascending: true });
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).map((r) => ({
      ...r,
      gallery: Array.isArray(r.gallery) ? r.gallery : [],
    })) as Property[];
  } catch (e) {
    console.warn("[properties] read failed:", (e as Error).message);
    return [];
  }
}

export async function getProperty(id: string): Promise<Property | null> {
  if (!isDbConfigured()) return null;
  const sb = getAdminClient() ?? getPublicClient();
  const { data } = await sb
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) return null;
  return { ...data, gallery: Array.isArray(data.gallery) ? data.gallery : [] } as Property;
}

export type PropertyInput = Omit<Property, "id"> & { id?: string };

export async function upsertProperty(p: PropertyInput): Promise<Property> {
  const admin = getAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY není nastavený.");
  const payload = {
    ...(p.id ? { id: p.id } : {}),
    title: p.title,
    location: p.location,
    price_czk: p.price_czk,
    size_m2: p.size_m2,
    rooms: p.rooms,
    type: p.type,
    status: p.status,
    description: p.description,
    cover_image: p.cover_image,
    gallery: p.gallery ?? [],
    featured: p.featured,
    sort_order: p.sort_order,
    slug: p.slug,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await admin
    .from("properties")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return { ...data, gallery: Array.isArray(data.gallery) ? data.gallery : [] } as Property;
}

export async function deleteProperty(id: string): Promise<void> {
  const admin = getAdminClient();
  if (!admin) return;
  await admin.from("properties").delete().eq("id", id);
}
