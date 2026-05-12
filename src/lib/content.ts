import { getPublicClient, getAdminClient, isDbConfigured } from "./db";

export type ContentBlock = {
  key: string;
  text: string;
  font_family: string | null;
  font_size: string | null;
  font_weight: string | null;
  color: string | null;
};

export async function loadAllContent(): Promise<Record<string, ContentBlock>> {
  if (!isDbConfigured()) return {};
  try {
    const sb = getAdminClient() ?? getPublicClient();
    const { data, error } = await sb
      .from("content_blocks")
      .select("key, text, font_family, font_size, font_weight, color");
    if (error) throw error;
    const map: Record<string, ContentBlock> = {};
    for (const r of data ?? []) map[r.key] = r as ContentBlock;
    return map;
  } catch (e) {
    console.warn("[content] read failed:", (e as Error).message);
    return {};
  }
}

export async function saveContent(block: ContentBlock): Promise<void> {
  const admin = getAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY není nastavený.");
  const { error } = await admin
    .from("content_blocks")
    .upsert({ ...block, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}

export async function deleteContent(key: string): Promise<void> {
  const admin = getAdminClient();
  if (!admin) return;
  await admin.from("content_blocks").delete().eq("key", key);
}
