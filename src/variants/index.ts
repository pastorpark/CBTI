import type { SiteVariantId, SurveyId } from "@/types/test";
import { ivfVariant } from "@/variants/ivf/config";
import { pastorVariant } from "@/variants/pastor/config";
import type { SiteVariant } from "@/variants/types";

function splitHosts(value: string | undefined) {
  return (value || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

export const siteVariants: SiteVariant[] = [
  {
    ...pastorVariant,
    hostnames: splitHosts(process.env.NEXT_PUBLIC_PASTOR_HOSTS)
  },
  {
    ...ivfVariant,
    hostnames: splitHosts(process.env.NEXT_PUBLIC_IVF_HOSTS)
  }
];

export const defaultSiteVariantId: SiteVariantId = "pastor";

export function getSiteVariantById(id: SiteVariantId) {
  return siteVariants.find((variant) => variant.id === id) || siteVariants[0];
}

export function resolveSiteVariantId(host: string | null | undefined): SiteVariantId {
  const hostname = (host || "").split(":")[0].toLowerCase();
  const matched = siteVariants.find((variant) => variant.hostnames.includes(hostname));

  if (matched) return matched.id;
  if (hostname.includes("ivf")) return "ivf";

  return defaultSiteVariantId;
}

export function getStoredSurveyId(variantId: SiteVariantId, surveyId: SurveyId) {
  return `${variantId}:${surveyId}`;
}

export function parseStoredSurveyId(value: string | null | undefined): { variantId: SiteVariantId; surveyId: SurveyId } {
  if (value?.includes(":")) {
    const [variantId, rawSurveyId] = value.split(":") as [SiteVariantId, string];
    const surveyId = rawSurveyId === "additional" ? "carb" : rawSurveyId;

    if ((variantId === "pastor" || variantId === "ivf") && (surveyId === "cbti" || surveyId === "carb")) {
      return { variantId, surveyId };
    }
  }

  if (value === "cbti" || value === "carb" || value === "additional") {
    return { variantId: defaultSiteVariantId, surveyId: value === "additional" ? "carb" : value };
  }

  return { variantId: defaultSiteVariantId, surveyId: "cbti" };
}

export function getStoredVisitPath(variantId: SiteVariantId, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${variantId}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function parseStoredVisitPath(path: string | null | undefined): { variantId: SiteVariantId; path: string } {
  const value = path || "/";

  if (value === "/ivf" || value.startsWith("/ivf/")) {
    return { variantId: "ivf", path: value.replace(/^\/ivf/, "") || "/" };
  }

  if (value === "/pastor" || value.startsWith("/pastor/")) {
    return { variantId: "pastor", path: value.replace(/^\/pastor/, "") || "/" };
  }

  return { variantId: defaultSiteVariantId, path: value };
}
