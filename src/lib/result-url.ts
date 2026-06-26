import { defaultSurveyId } from "@/data/test";
import type { ResultKey, SurveyId } from "@/types/test";

function normalizeBaseUrl(value: string) {
  return value.replace(/\/$/, "");
}

export function getResultUrl(result: ResultKey, surveyId: SurveyId = defaultSurveyId) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : configuredUrl && configuredUrl.length > 0
        ? normalizeBaseUrl(configuredUrl)
        : "";

  return `${baseUrl}/result/${encodeURIComponent(surveyId)}/${encodeURIComponent(result)}`;
}
