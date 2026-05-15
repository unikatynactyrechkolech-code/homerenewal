import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { listProperties, upsertProperty } from "@/lib/properties";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const admin = await isAdmin();
  const all = url.searchParams.get("all") === "1" && admin;
  const data = await listProperties({ onlyVisible: !all });
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
  if (!body || typeof body.title !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const saved = await upsertProperty({
    id: body.id,
    title: body.title,
    location: body.location ?? null,
    price_czk: body.price_czk ?? null,
    size_m2: body.size_m2 ?? null,
    rooms: body.rooms ?? null,
    type: body.type ?? null,
    status: body.status ?? "active",
    description: body.description ?? null,
    cover_image: body.cover_image ?? null,
    gallery: Array.isArray(body.gallery) ? body.gallery : [],
    featured: !!body.featured,
    sort_order: Number(body.sort_order ?? 0),
    slug: body.slug ?? null,
  });
  return NextResponse.json({ data: saved });
}
