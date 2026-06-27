import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ChungeoramFollowCard } from "@/components/ChungeoramFollowCard";
import { NutritionRadarChart } from "@/components/NutritionRadarChart";
import { nutritionKeys, nutritionLabels, nutritionResults } from "@/data/test";
import { resolveNutritionResultKey } from "@/lib/result-aliases";
import { getResultHeaderStyle } from "@/lib/result-colors";
import { nutritionImagePaths } from "@/lib/nutrition-assets";
import { createEmptyResultScores } from "@/lib/scoring";
import { resolveSiteVariantId } from "@/variants";

type NutritionResultPageProps = {
  params: Promise<{ type: string }>;
};

export function generateStaticParams() {
  return nutritionKeys.map((key) => ({ type: key }));
}

export async function generateMetadata({ params }: NutritionResultPageProps): Promise<Metadata> {
  const { type } = await params;
  const resolvedType = resolveNutritionResultKey(type);

  if (!resolvedType) {
    return {
      title: "결과를 찾을 수 없어요",
      description: "공유 링크가 올바르지 않거나 만료된 결과입니다."
    };
  }

  const result = nutritionResults[resolvedType];

  return {
    title: result.title,
    description: `${nutritionLabels[resolvedType]}: ${result.status}`,
    alternates: {
      canonical: `/result/nutri/${resolvedType}`
    },
    openGraph: {
      title: `${nutritionLabels[resolvedType]} - 영적 영양상태 진단 테스트`,
      description: result.status,
      url: `/result/nutri/${resolvedType}`,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `${nutritionLabels[resolvedType]} - 영적 영양상태 진단 테스트`,
      description: result.status
    }
  };
}

export default async function NutritionResultPage({ params }: NutritionResultPageProps) {
  const { type } = await params;
  const variantId = resolveSiteVariantId((await headers()).get("host"));
  const resolvedType = resolveNutritionResultKey(type);

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

  const result = nutritionResults[resolvedType];
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
            <NutritionRadarChart keys={nutritionKeys} labels={nutritionLabels} scores={scores} maxScore={6} />
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
          <div className="result-section">
            <div className="insight-grid">
              <ChungeoramFollowCard />
            </div>
          </div>
          <div className="actions">
            <Link className="button" href="/">나도 진단해보기</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
