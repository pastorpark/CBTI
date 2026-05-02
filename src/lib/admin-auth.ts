import { cookies } from "next/headers";
import { createSessionToken, signValue, verifySignedValue } from "@/lib/crypto";

export const adminCookieName = "admin_stats_session";

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_STATS_PASSWORD || "dev-admin-secret";
}

export async function createAdminSessionCookie() {
  const token = signValue(createSessionToken(), getAdminSecret());
  const cookieStore = await cookies();

  cookieStore.set(adminCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;
  if (!token) return false;

  return verifySignedValue(token, getAdminSecret());
}
