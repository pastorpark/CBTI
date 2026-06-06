import type { MetadataRoute } from "next";
import { personaKeys } from "@/data/test";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cbti.pastorpark.net";
  
  const mainSitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
  ];

  const resultSitemaps = personaKeys.map((key) => ({
    url: `${siteUrl}/result/${key}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...mainSitemap, ...resultSitemaps];
}
