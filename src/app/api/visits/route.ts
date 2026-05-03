import { NextResponse } from "next/server";
import { sha256Hmac } from "@/lib/crypto";
import { hasSupabaseConfig, insertVisit } from "@/lib/supabase-rest";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      visitorId?: unknown;
      path?: unknown;
    };

    if (typeof body.visitorId !== "string" || typeof body.path !== "string") {
      return NextResponse.json({ error: "Invalid visit" }, { status: 400 });
    }

    if (!hasSupabaseConfig()) {
      return NextResponse.json({ ok: true, skipped: "supabase-not-configured" });
    }

    const salt = process.env.VISITOR_HASH_SALT || "dev-visitor-salt";
    const visitorHash = await sha256Hmac(body.visitorId, salt);
    const userAgent = request.headers.get("user-agent") || "";
    const userAgentHash = userAgent ? await sha256Hmac(userAgent, salt) : null;

    await insertVisit({
      visitor_hash: visitorHash,
      path: body.path,
      user_agent_hash: userAgentHash
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: true, skipped: "visit-not-saved" });
  }
}
