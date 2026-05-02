import { NextResponse } from "next/server";
import { createAdminSessionCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: unknown };
  const configuredPassword = process.env.ADMIN_STATS_PASSWORD;

  if (!configuredPassword) {
    return NextResponse.json({ error: "Admin password is not configured" }, { status: 500 });
  }

  if (typeof body.password !== "string" || body.password !== configuredPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await createAdminSessionCookie();
  return NextResponse.json({ ok: true });
}
