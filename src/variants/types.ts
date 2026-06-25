import type { SiteVariantId } from "@/types/test";

export type SiteVariant = {
  id: SiteVariantId;
  label: string;
  description: string;
  hostnames: string[];
};
