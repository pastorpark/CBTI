import { NextResponse } from "next/server";
import { defaultSurveyId, surveyMap, surveys } from "@/data/test";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { fetchSubmissions, fetchVisits, hasSupabaseConfig } from "@/lib/supabase-rest";
import type { Survey, SurveyId } from "@/types/test";

type SubmissionRow = Awaited<ReturnType<typeof fetchSubmissions>>[number];
type VisitRow = Awaited<ReturnType<typeof fetchVisits>>[number];

function startOfDay(value: Date) {
  return value.toISOString().slice(0, 10);
}

function normalizeSurveyId(value: string | null | undefined): SurveyId {
  return value && value in surveyMap ? (value as SurveyId) : defaultSurveyId;
}

function getDedupedRows(rows: SubmissionRow[]) {
  const byVisitor = new Map<string, SubmissionRow>();

  for (const row of rows) {
    const key = `${normalizeSurveyId(row.survey_id)}:${row.visitor_hash}`;
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

function aggregateBySurvey(rows: SubmissionRow[]) {
  return Object.fromEntries(
    surveys.map((survey) => {
      const surveyRows = rows.filter((row) => normalizeSurveyId(row.survey_id) === survey.id);
      return [survey.id, aggregate(surveyRows, survey)];
    })
  );
}

function getSurveySummaries() {
  return surveys.map((survey) => ({
    id: survey.id,
    title: survey.title,
    description: survey.description,
    questionCount: survey.questions.length,
    resultLabels: survey.resultLabels
  }));
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!hasSupabaseConfig()) {
      return NextResponse.json({
        configured: false,
        surveys: getSurveySummaries(),
        total: 0,
        uniqueVisitors: 0,
        duplicateRate: 0,
        visits: aggregateVisits([]),
        all: aggregateBySurvey([]),
        deduped: aggregateBySurvey([])
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
      surveys: getSurveySummaries(),
      total: rows.length,
      uniqueVisitors: dedupedRows.length,
      duplicateRate,
      visits: aggregateVisits(visitRows),
      all: aggregateBySurvey(rows),
      deduped: aggregateBySurvey(dedupedRows)
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
