import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    isAdmin: await isAdmin(),
    dbConfigured: isDbConfigured(),
  });
}
