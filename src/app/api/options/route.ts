import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { listOptions, upsertOption, deleteOption } from "@/lib/options";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") ?? undefined;
  const data = await listOptions(kind);
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.kind || !body?.value || !body?.label) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  try {
    const data = await upsertOption(body);
    return NextResponse.json({ data });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error).message ?? "DB error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    await deleteOption(id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error).message ?? "DB error" },
      { status: 500 },
    );
  }
}
