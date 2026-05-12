import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getAdminClient } from "@/lib/db";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY není nastavený." },
      { status: 500 },
    );
  }

  // Použij batch update — sort_order podle pozice v poli.
  const updates = ids.map((id, idx) =>
    admin
      .from("properties")
      .update({ sort_order: idx + 1, updated_at: new Date().toISOString() })
      .eq("id", id),
  );
  const results = await Promise.all(updates);
  const firstError = results.find((r) => r.error)?.error;
  if (firstError) {
    return NextResponse.json({ error: firstError.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
