import { baseTestContent } from "@/data/test";
import { ivfTestContent } from "@/data/variants/ivf";
import { pastorTestContent } from "@/data/variants/pastor";
import type { SiteVariantId, TestContent } from "@/types/test";

export const testContentByVariant: Record<SiteVariantId, TestContent> = {
  pastor: pastorTestContent,
  ivf: ivfTestContent
};

export function getVariantTestContent(variantId: SiteVariantId): TestContent {
  return testContentByVariant[variantId] || baseTestContent;
}
