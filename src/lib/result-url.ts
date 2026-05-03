import type { PersonaKey } from "@/types/test";

function normalizeBaseUrl(value: string) {
  return value.replace(/\/$/, "");
}

export function getResultUrl(persona: PersonaKey) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const baseUrl =
    configuredUrl && configuredUrl.length > 0
      ? normalizeBaseUrl(configuredUrl)
      : typeof window !== "undefined"
        ? window.location.origin
        : "";

  return `${baseUrl}/result/${encodeURIComponent(persona)}`;
}
