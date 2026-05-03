export type VisitPayload = {
  visitorId: string;
  path: string;
};

export async function submitVisit(payload: VisitPayload) {
  const response = await fetch("/api/visits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to submit visit");
  }

  return response.json() as Promise<{ ok: true }>;
}
