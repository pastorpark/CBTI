import { NextResponse } from "next/server";
import { questions } from "@/data/test";
import { sha256Hmac } from "@/lib/crypto";
import { hasSupabaseConfig, insertSubmission } from "@/lib/supabase-rest";
import { isPersonaKey } from "@/lib/scoring";
import type { Answer, PersonaScores } from "@/types/test";

const validQuestionIds = new Set(questions.map((question) => question.id));
const validOptionIds = new Set(questions.flatMap((question) => question.options.map((option) => option.id)));

function isValidAnswers(value: unknown): value is Answer[] {
  return (
    Array.isArray(value) &&
    value.length === questions.length &&
    value.every(
      (answer) =>
        typeof answer === "object" &&
        answer !== null &&
        validQuestionIds.has((answer as Answer).questionId) &&
        validOptionIds.has((answer as Answer).optionId)
    )
  );
}

function isValidScores(value: unknown): value is PersonaScores {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      visitorId?: unknown;
      primaryPersona?: unknown;
      scores?: unknown;
      answers?: unknown;
    };

    if (
      typeof body.visitorId !== "string" ||
      typeof body.primaryPersona !== "string" ||
      !isPersonaKey(body.primaryPersona) ||
      !isValidScores(body.scores) ||
      !isValidAnswers(body.answers)
    ) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    if (!hasSupabaseConfig()) {
      return NextResponse.json({ ok: true, skipped: "supabase-not-configured" });
    }

    const salt = process.env.VISITOR_HASH_SALT || "dev-visitor-salt";
    const visitorHash = await sha256Hmac(body.visitorId, salt);
    const userAgent = request.headers.get("user-agent") || "";
    const userAgentHash = userAgent ? await sha256Hmac(userAgent, salt) : null;

    await insertSubmission({
      visitor_hash: visitorHash,
      primary_persona: body.primaryPersona,
      scores: body.scores,
      answers: body.answers,
      user_agent_hash: userAgentHash
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to save submission" }, { status: 500 });
  }
}
