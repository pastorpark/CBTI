import type { Answer, PersonaKey, PersonaScores } from "@/types/test";

export type SubmissionPayload = {
  visitorId: string;
  primaryPersona: PersonaKey;
  scores: PersonaScores;
  answers: Answer[];
};

export async function submitResult(payload: SubmissionPayload) {
  const response = await fetch("/api/submissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to submit test result");
  }

  return response.json() as Promise<{ ok: true }>;
}
