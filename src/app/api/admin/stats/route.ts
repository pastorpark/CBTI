import { NextResponse } from "next/server";
import { personaKeys, questions } from "@/data/test";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { fetchSubmissions, hasSupabaseConfig } from "@/lib/supabase-rest";

type SubmissionRow = Awaited<ReturnType<typeof fetchSubmissions>>[number];

function startOfDay(value: Date) {
  return value.toISOString().slice(0, 10);
}

function getDedupedRows(rows: SubmissionRow[]) {
  const byVisitor = new Map<string, SubmissionRow>();

  for (const row of rows) {
    if (!byVisitor.has(row.visitor_hash)) {
      byVisitor.set(row.visitor_hash, row);
    }
  }

  return [...byVisitor.values()];
}

function aggregate(rows: SubmissionRow[]) {
  const byPersona = Object.fromEntries(personaKeys.map((key) => [key, 0]));
  const byDay: Record<string, number> = {};
  const byQuestion = Object.fromEntries(
    questions.map((question) => [
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

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!hasSupabaseConfig()) {
      return NextResponse.json({
        configured: false,
        total: 0,
        uniqueVisitors: 0,
        duplicateRate: 0,
        all: aggregate([]),
        deduped: aggregate([])
      });
    }

    const rows = await fetchSubmissions();
    const dedupedRows = getDedupedRows(rows);
    const duplicateRate = rows.length > 0 ? Math.round(((rows.length - dedupedRows.length) / rows.length) * 100) : 0;

    return NextResponse.json({
      configured: true,
      total: rows.length,
      uniqueVisitors: dedupedRows.length,
      duplicateRate,
      all: aggregate(rows),
      deduped: aggregate(dedupedRows)
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
