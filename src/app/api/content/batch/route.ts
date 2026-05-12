import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { saveContent } from "@/lib/content";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const items = Array.isArray(body?.items) ? body.items : null;
  if (!items) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  let saved = 0;
  for (const it of items) {
    if (!it || typeof it.key !== "string" || typeof it.text !== "string") continue;
    await saveContent({
      key: it.key,
      text: it.text,
      font_family: it.font_family ?? null,
      font_size: it.font_size ?? null,
      font_weight: it.font_weight ?? null,
      color: it.color ?? null,
    });
    saved++;
  }

  return NextResponse.json({ ok: true, saved });
}
