import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import crypto from "node:crypto";

/**
 * Vrátí podpis pro přímý upload z prohlížeče do Cloudinary.
 * Vyžaduje admin session.
 */
export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_FOLDER || "home-renewal/properties";

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error:
          "Cloudinary není nakonfigurované. Nastav CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY a CLOUDINARY_API_SECRET.",
      },
      { status: 500 },
    );
  }

  const timestamp = Math.round(Date.now() / 1000);

  // Parametry, které musí podpis obsahovat (v abecedním pořadí, bez api_key/file/signature).
  const params: Record<string, string | number> = {
    folder,
    timestamp,
  };

  const sortedKeys = Object.keys(params).sort();
  const toSign = sortedKeys.map((k) => `${k}=${params[k]}`).join("&");
  const signature = crypto
    .createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature,
  });
}
