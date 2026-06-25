import type { SiteVariantId } from "@/types/test";
import { IvfIntroView } from "@/variants/ivf/IntroView";
import { PastorIntroView } from "@/variants/pastor/IntroView";

export function getIntroView(variantId: SiteVariantId) {
  if (variantId === "ivf") return IvfIntroView;

  return PastorIntroView;
}
