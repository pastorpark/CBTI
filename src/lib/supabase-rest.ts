const tableName = "test_submissions";

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
  const response = await fetch(`${url}/rest/v1/${tableName}`, {
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

export async function fetchSubmissions() {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(
    `${url}/rest/v1/${tableName}?select=id,visitor_hash,primary_persona,scores,answers,created_at&order=created_at.desc&limit=5000`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`
      },
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<
    {
      id: string;
      visitor_hash: string;
      primary_persona: string;
      scores: Record<string, number>;
      answers: { questionId: string; optionId: string }[];
      created_at: string;
    }[]
  >;
}
