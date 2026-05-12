import { getPublicClient, getAdminClient } from "./db";

export type PropertyOption = {
  id: string;
  kind: "type" | "status" | "feature";
  value: string;
  label: string;
  color: string | null;
  sort_order: number;
};

export async function listOptions(kind?: string): Promise<PropertyOption[]> {
  // Preferuj admin clienta (obchází RLS) — tohle je server-side
  // a slouží pouze pro čtení verejně dostupných dat. Fallback na public.
  const sb = getAdminClient() ?? getPublicClient();
  let q = sb.from("property_options").select("*").order("sort_order");
  if (kind) q = q.eq("kind", kind);
  const { data, error } = await q;
  if (error) {
    console.error("listOptions:", error);
    return [];
  }
  return (data ?? []) as PropertyOption[];
}

export async function upsertOption(o: Partial<PropertyOption> & { kind: string; value: string; label: string }) {
  const sb = getAdminClient();
  if (!sb) throw new Error("SUPABASE_SERVICE_ROLE_KEY není nastavený.");
  const { data, error } = await sb
    .from("property_options")
    .upsert(
      {
        id: o.id,
        kind: o.kind,
        value: o.value,
        label: o.label,
        color: o.color ?? null,
        sort_order: o.sort_order ?? 0,
      },
      { onConflict: "kind,value" },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteOption(id: string) {
  const sb = getAdminClient();
  if (!sb) throw new Error("SUPABASE_SERVICE_ROLE_KEY není nastavený.");
  const { error } = await sb.from("property_options").delete().eq("id", id);
  if (error) throw error;
}
