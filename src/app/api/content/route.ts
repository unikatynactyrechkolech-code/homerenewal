import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { loadAllContent, saveContent, deleteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await loadAllContent();
  return NextResponse.json({ data }, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Vercel-CDN-Cache-Control": "no-store",
      "CDN-Cache-Control": "no-store",
      "Pragma": "no-cache",
    },
  });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.key !== "string" || typeof body.text !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await saveContent({
    key: body.key,
    text: body.text,
    font_family: body.font_family ?? null,
    font_size: body.font_size ?? null,
    font_weight: body.font_weight ?? null,
    color: body.color ?? null,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });
  await deleteContent(key);
  return NextResponse.json({ ok: true });
}
