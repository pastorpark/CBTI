const submissionsTableName = "test_submissions";
const visitsTableName = "site_visits";

export function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseConfig() {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing");
  }

  return { url, key };
}

function normalizeSupabaseUrl(value: string | undefined) {
  if (!value) return value;

  return value
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1$/i, "")
    .replace(/\/rest\/v1\/$/i, "");
}

export async function insertSubmission(record: Record<string, unknown>) {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${submissionsTableName}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(record)
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

async function fetchPaginated<T>(url: string, key: string, maxRows = 50000) {
  const batchSize = 1000;
  let allRows: T[] = [];
  let from = 0;

  while (allRows.length < maxRows) {
    const to = from + batchSize - 1;
    const response = await fetch(`${url}&limit=${batchSize}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Range: `${from}-${to}`
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const rows = (await response.json()) as T[];
    if (rows.length === 0) break;

    allRows = [...allRows, ...rows];
    if (rows.length < batchSize) break;

    from += batchSize;
  }

  return allRows;
}

export async function fetchSubmissions() {
  const { url, key } = getSupabaseConfig();
  const endpoint = `${url}/rest/v1/${submissionsTableName}?select=id,visitor_hash,primary_persona,scores,answers,created_at&order=created_at.desc`;

  return fetchPaginated<{
    id: string;
    visitor_hash: string;
    primary_persona: string;
    scores: Record<string, number>;
    answers: { questionId: string; optionId: string }[];
    created_at: string;
  }>(endpoint, key, 10000); // 제한을 10,000건으로 확장
}

export async function insertVisit(record: Record<string, unknown>) {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${visitsTableName}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(record)
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

export async function fetchVisits() {
  const { url, key } = getSupabaseConfig();
  const endpoint = `${url}/rest/v1/${visitsTableName}?select=id,visitor_hash,path,created_at&order=created_at.desc`;

  return fetchPaginated<{
    id: string;
    visitor_hash: string;
    path: string;
    created_at: string;
  }>(endpoint, key, 30000); // 접속 기록은 더 많을 수 있으므로 30,000건으로 확장
}
