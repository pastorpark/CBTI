import { NextResponse } from "next/server";
import { defaultSurveyId } from "@/data/test";
import { getVariantTestContent } from "@/data/variant-content";
import { sha256Hmac } from "@/lib/crypto";
import { hasSupabaseConfig, insertSubmission } from "@/lib/supabase-rest";
import type { Answer, ResultScores, SiteVariantId, SurveyId, TestContent } from "@/types/test";
import { defaultSiteVariantId, getStoredSurveyId } from "@/variants";

function isValidSurveyId(value: unknown): value is SurveyId {
  return value === "cbti" || value === "nutri";
}

function normalizeSurveyId(value: unknown): SurveyId {
  if (value === "additional" || value === "carb") return "nutri";
  return isValidSurveyId(value) ? value : defaultSurveyId;
}

function isValidVariantId(value: unknown): value is SiteVariantId {
  return value === "pastor" || value === "ivf";
}

function isValidAnswers(value: unknown, surveyId: SurveyId, content: TestContent): value is Answer[] {
  const questions = content.surveyMap[surveyId].questions;
  const validQuestionIds = new Set(questions.map((question) => question.id));
  const validOptionIds = new Set(questions.flatMap((question) => question.options.map((option) => option.id)));

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

function isValidScores(value: unknown): value is ResultScores {
  return typeof value === "object" && value !== null;
}

function isValidResultKey(value: unknown, surveyId: SurveyId, content: TestContent) {
  return typeof value === "string" && (content.surveyMap[surveyId].resultKeys as string[]).includes(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      surveyId?: unknown;
      variantId?: unknown;
      visitorId?: unknown;
      primaryPersona?: unknown;
      scores?: unknown;
      answers?: unknown;
    };
    const surveyId = normalizeSurveyId(body.surveyId);
    const variantId = isValidVariantId(body.variantId) ? body.variantId : defaultSiteVariantId;
    const content = getVariantTestContent(variantId);

    if (
      typeof body.visitorId !== "string" ||
      typeof body.primaryPersona !== "string" ||
      !isValidResultKey(body.primaryPersona, surveyId, content) ||
      !isValidScores(body.scores) ||
      !isValidAnswers(body.answers, surveyId, content)
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
      survey_id: getStoredSurveyId(variantId, surveyId),
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
