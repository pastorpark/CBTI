import { NextResponse } from "next/server";
import { defaultSurveyId } from "@/data/test";
import { getVariantTestContent } from "@/data/variant-content";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { fetchSubmissions, fetchVisits, hasSupabaseConfig } from "@/lib/supabase-rest";
import type { SiteVariantId, Survey, SurveyId } from "@/types/test";
import { parseStoredSurveyId, parseStoredVisitPath, siteVariants } from "@/variants";

type SubmissionRow = Awaited<ReturnType<typeof fetchSubmissions>>[number];
type VisitRow = Awaited<ReturnType<typeof fetchVisits>>[number];

function startOfDay(value: Date) {
  return value.toISOString().slice(0, 10);
}

function normalizeStoredSurvey(value: string | null | undefined) {
  const parsed = parseStoredSurveyId(value);
  return parsed.surveyId === "cbti" || parsed.surveyId === "nutri" ? parsed : { variantId: parsed.variantId, surveyId: defaultSurveyId };
}

function getDedupedRows(rows: SubmissionRow[]) {
  const byVisitor = new Map<string, SubmissionRow>();

  for (const row of rows) {
    const { variantId, surveyId } = normalizeStoredSurvey(row.survey_id);
    const key = `${variantId}:${surveyId}:${row.visitor_hash}`;
    if (!byVisitor.has(key)) {
      byVisitor.set(key, row);
    }
  }

  return [...byVisitor.values()];
}

function getUniqueVisitCount(rows: VisitRow[]) {
  return new Set(rows.map((row) => row.visitor_hash)).size;
}

function aggregateVisits(rows: VisitRow[]) {
  const byDay: Record<string, number> = {};

  for (const row of rows) {
    const day = startOfDay(new Date(row.created_at));
    byDay[day] = (byDay[day] || 0) + 1;
  }

  return {
    total: rows.length,
    uniqueVisitors: getUniqueVisitCount(rows),
    byDay: Object.entries(byDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  };
}

function aggregateVisitsByVariant(rows: VisitRow[]) {
  return Object.fromEntries(
    siteVariants.map((variant) => {
      const variantRows = rows.filter((row) => parseStoredVisitPath(row.path).variantId === variant.id);
      return [variant.id, aggregateVisits(variantRows)];
    })
  ) as Record<SiteVariantId, ReturnType<typeof aggregateVisits>>;
}

function aggregate(rows: SubmissionRow[], survey: Survey) {
  const byPersona = Object.fromEntries(survey.resultKeys.map((key) => [key, 0]));
  const byDay: Record<string, number> = {};
  const byQuestion = Object.fromEntries(
    survey.questions.map((question) => [
      question.id,
      {
        title: question.title,
        options: Object.fromEntries(question.options.map((option) => [option.id, { label: option.label, count: 0 }]))
      }
    ])
  ) as Record<string, { title: string; options: Record<string, { label: string; count: number }> }>;

  for (const row of rows) {
    if (row.primary_persona in byPersona) {
      byPersona[row.primary_persona] += 1;
    }

    const day = startOfDay(new Date(row.created_at));
    byDay[day] = (byDay[day] || 0) + 1;

    for (const answer of row.answers || []) {
      const option = byQuestion[answer.questionId]?.options[answer.optionId];
      if (option) option.count += 1;
    }
  }

  return {
    total: rows.length,
    byPersona,
    byDay: Object.entries(byDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    byQuestion: Object.entries(byQuestion).map(([id, value]) => ({
      id,
      title: value.title,
      options: Object.entries(value.options).map(([optionId, option]) => ({
        optionId,
        label: option.label,
        count: option.count
      }))
    }))
  };
}

function aggregateBySurvey(rows: SubmissionRow[], variantId: SiteVariantId) {
  const content = getVariantTestContent(variantId);
  return Object.fromEntries(
    content.surveys.map((survey) => {
      const surveyRows = rows.filter((row) => {
        const parsed = normalizeStoredSurvey(row.survey_id);
        return parsed.variantId === variantId && parsed.surveyId === survey.id;
      });
      return [survey.id, aggregate(surveyRows, survey)];
    })
  ) as Record<SurveyId, ReturnType<typeof aggregate>>;
}

function aggregateByVariant(rows: SubmissionRow[]) {
  return Object.fromEntries(siteVariants.map((variant) => [variant.id, aggregateBySurvey(rows, variant.id)])) as Record<
    SiteVariantId,
    Record<SurveyId, ReturnType<typeof aggregate>>
  >;
}

function getSurveySummaries() {
  return getVariantTestContent("pastor").surveys.map((survey) => ({
    id: survey.id,
    title: survey.title,
    description: survey.description,
    questionCount: survey.questions.length,
    questionTime: survey.id === "nutri" ? 1 : 5,
    resultLabels: survey.resultLabels
  }));
}

function getSurveySummariesByVariant() {
  return Object.fromEntries(
    siteVariants.map((variant) => [
      variant.id,
      getVariantTestContent(variant.id).surveys.map((survey) => ({
        id: survey.id,
        title: survey.title,
        description: survey.description,
        questionCount: survey.questions.length,
        questionTime: survey.id === "nutri" ? 1 : 5,
        resultLabels: survey.resultLabels
      }))
    ])
  ) as Record<SiteVariantId, ReturnType<typeof getSurveySummaries>>;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!hasSupabaseConfig()) {
      return NextResponse.json({
        configured: false,
        variants: siteVariants,
        surveys: getSurveySummaries(),
        surveysByVariant: getSurveySummariesByVariant(),
        total: 0,
        uniqueVisitors: 0,
        duplicateRate: 0,
        visits: aggregateVisits([]),
        visitsByVariant: aggregateVisitsByVariant([]),
        all: aggregateByVariant([]),
        deduped: aggregateByVariant([])
      });
    }

    const rows = await fetchSubmissions();
    const visitRows = await fetchVisits().catch((error) => {
      console.warn("Unable to load visit stats", error);
      return [];
    });
    const dedupedRows = getDedupedRows(rows);
    const duplicateRate = rows.length > 0 ? Math.round(((rows.length - dedupedRows.length) / rows.length) * 100) : 0;

    return NextResponse.json({
      configured: true,
      variants: siteVariants,
      surveys: getSurveySummaries(),
      surveysByVariant: getSurveySummariesByVariant(),
      total: rows.length,
      uniqueVisitors: dedupedRows.length,
      duplicateRate,
      visits: aggregateVisits(visitRows),
      visitsByVariant: aggregateVisitsByVariant(visitRows),
      all: aggregateByVariant(rows),
      deduped: aggregateByVariant(dedupedRows)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Supabase error";
    console.error(message);

    return NextResponse.json(
      {
        error: "Unable to load Supabase stats",
        detail: message
      },
      { status: 500 }
    );
  }
}
