import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "hr_admin";
const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dní

function getSecret(): string {
  return process.env.AUTH_SECRET || "dev-insecure-change-me";
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

/** Vytvoří podepsaný token "<expires>.<sig>" */
export function createToken(): string {
  const expires = Date.now() + TTL_SECONDS * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

/** Ověří token. Vrací true pokud je platný a neexpirovaný. */
export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = sign(payload);
  // timing-safe compare
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;

  const expires = Number(payload);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  return true;
}

export const ADMIN_COOKIE = COOKIE_NAME;
export const ADMIN_COOKIE_MAX_AGE = TTL_SECONDS;

/** Ověř session ze server-side requestu. */
export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return verifyToken(c.get(COOKIE_NAME)?.value);
}
