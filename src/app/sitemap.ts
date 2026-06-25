import type { MetadataRoute } from "next";
import { nutritionKeys, personaKeys } from "@/data/test";

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
    url: `${siteUrl}/result/cbti/${key}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const nutritionResultSitemaps = nutritionKeys.map((key) => ({
    url: `${siteUrl}/result/nutri/${key}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...mainSitemap, ...resultSitemaps, ...nutritionResultSitemaps];
}
