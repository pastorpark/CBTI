import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ChungeoramFollowCard } from "@/components/ChungeoramFollowCard";
import { NutritionRadarChart } from "@/components/NutritionRadarChart";
import { nutritionKeys } from "@/data/test";
import { getVariantTestContent } from "@/data/variant-content";
import { fillMetadataTemplate } from "@/lib/metadata-template";
import { resolveNutritionResultKey } from "@/lib/result-aliases";
import { getResultHeaderStyle } from "@/lib/result-colors";
import { nutritionImagePaths } from "@/lib/nutrition-assets";
import { createEmptyResultScores } from "@/lib/scoring";
import { getSiteVariantById, resolveSiteVariantId } from "@/variants";

type NutritionResultPageProps = {
  params: Promise<{ type: string }>;
};

export function generateStaticParams() {
  return nutritionKeys.map((key) => ({ type: key }));
}

export async function generateMetadata({ params }: NutritionResultPageProps): Promise<Metadata> {
  const { type } = await params;
  const variantId = resolveSiteVariantId((await headers()).get("host"));
  const content = getVariantTestContent(variantId);
  const variantMetadata = getSiteVariantById(variantId).metadata;
  const template = variantMetadata.results.nutri;
  const resolvedType = resolveNutritionResultKey(type, content);

  if (!resolvedType) {
    return {
      title: "결과를 찾을 수 없어요",
      description: "공유 링크가 올바르지 않거나 만료된 결과입니다."
    };
  }

  const result = content.nutritionResults[resolvedType];
  const label = content.nutritionLabels[resolvedType];
  const templateValues = {
    key: result.key,
    keyLower: result.key.toLowerCase(),
    title: result.title,
    label,
    status: result.status,
    description: result.description,
    recommendation: result.recommendation
  };
  const imageUrl = fillMetadataTemplate(template.openGraphImage, templateValues);

  return {
    title: fillMetadataTemplate(template.title, templateValues),
    description: fillMetadataTemplate(template.description, templateValues),
    alternates: {
      canonical: `/result/nutri/${resolvedType}`
    },
    openGraph: {
      title: fillMetadataTemplate(template.openGraphTitle, templateValues),
      description: fillMetadataTemplate(template.openGraphDescription, templateValues),
      url: `/result/nutri/${resolvedType}`,
      siteName: variantMetadata.siteName,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fillMetadataTemplate(template.openGraphImageAlt, templateValues)
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: fillMetadataTemplate(template.twitterTitle, templateValues),
      description: fillMetadataTemplate(template.twitterDescription, templateValues),
      images: [fillMetadataTemplate(template.twitterImage, templateValues)]
    }
  };
}

export default async function NutritionResultPage({ params }: NutritionResultPageProps) {
  const { type } = await params;
  const variantId = resolveSiteVariantId((await headers()).get("host"));
  const content = getVariantTestContent(variantId);
  const resolvedType = resolveNutritionResultKey(type, content);

  if (!resolvedType) {
    return (
      <main className={`app-shell variant-${variantId}`}>
        <section className="panel section">
          <span className="brand">Nutrition</span>
          <h1>결과를 찾을 수 없어요</h1>
          <p className="lead">공유 링크가 올바르지 않거나 만료된 결과입니다.</p>
          <div className="actions">
            <Link className="button" href="/">영적 영양상태 진단하러 가기</Link>
          </div>
        </section>
      </main>
    );
  }

  if (type !== resolvedType) {
    redirect(`/result/nutri/${resolvedType}`);
  }

  const result = content.nutritionResults[resolvedType];
  const scores = createEmptyResultScores(nutritionKeys);
  scores[resolvedType] = 6;

  return (
    <main className={`app-shell variant-${variantId}`}>
      <div className="panel">
        <section className="result-header nutrition-result-header" style={getResultHeaderStyle(resolvedType)}>
          <div className="result-hero-copy">
            <span className="result-type-label">나에게 필요한 영양소는 - {result.key}</span>
            <h1 className="hero-title result-title">{result.title}</h1>
          </div>
          <figure className="nutrition-result-art" aria-hidden="true">
            <img src={nutritionImagePaths[resolvedType]} alt="" />
          </figure>
          <div className="keyword-row">
            {result.keywords.map((keyword) => (
              <span className="keyword" key={keyword}>#{keyword}</span>
            ))}
          </div>
        </section>
        <section className="section result-body">
          <div className="result-section result-description-section">
            <span className="result-status-tag">내게 필요한 영양소</span>
            <NutritionRadarChart keys={nutritionKeys} labels={content.nutritionLabels} scores={scores} maxScore={6} />
            <hr className="result-status-divider" />
            <span className="result-status-tag">당신의 상태</span>
            <p className="lead">{result.status}</p>
            <hr className="result-status-divider" />
            <span className="result-status-tag">청어람의 조언</span>
            <p className="lead">{result.description}</p>
            <hr className="result-status-divider" />
            <span className="result-status-tag">맞춤 처방</span>
            <p className="lead">{result.recommendation}</p>
          </div>
          {variantId === "ivf" && (
            <div className="result-section">
              <div className="insight-grid">
                <ChungeoramFollowCard />
              </div>
            </div>
          )}
          <div className="actions">
            <Link className="button" href="/">나도 진단해보기</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
