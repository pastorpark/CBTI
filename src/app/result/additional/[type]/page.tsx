import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { nutritionKeys, nutritionLabels, nutritionResults } from "@/data/test";
import { createEmptyResultScores, getSortedResultScores } from "@/lib/scoring";
import type { NutritionKey } from "@/types/test";
import { resolveSiteVariantId } from "@/variants";

type NutritionResultPageProps = {
  params: Promise<{ type: string }>;
};

function isNutritionKey(value: string | null): value is NutritionKey {
  return nutritionKeys.includes(value as NutritionKey);
}

export function generateStaticParams() {
  return nutritionKeys.map((key) => ({ type: key }));
}

export async function generateMetadata({ params }: NutritionResultPageProps): Promise<Metadata> {
  const { type } = await params;

  if (!isNutritionKey(type)) {
    return {
      title: "결과를 찾을 수 없어요",
      description: "공유 링크가 올바르지 않거나 만료된 결과입니다."
    };
  }

  const result = nutritionResults[type];

  return {
    title: result.title,
    description: `나의 영적 영양상태는 ${nutritionLabels[type]} 보충 필요. ${result.status}`,
    alternates: {
      canonical: `/result/additional/${type}`
    },
    openGraph: {
      title: `${nutritionLabels[type]} - 영적 영양상태 진단 테스트`,
      description: result.status,
      url: `/result/additional/${type}`,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `${nutritionLabels[type]} - 영적 영양상태 진단 테스트`,
      description: result.status
    }
  };
}

export default async function NutritionResultPage({ params }: NutritionResultPageProps) {
  const { type } = await params;
  const variantId = resolveSiteVariantId((await headers()).get("host"));

  if (!isNutritionKey(type)) {
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

  const result = nutritionResults[type];
  const scores = createEmptyResultScores(nutritionKeys);
  scores[type] = 6;

  return (
    <main className={`app-shell variant-${variantId}`}>
      <div className="panel">
        <section className="result-header nutrition-result-header">
          <div className="result-hero-copy">
            <span className="result-type-label">나의 영적 영양상태 - {result.key}</span>
            <h1 className="hero-title result-title">{result.title}</h1>
            <p className="lead">{result.status}</p>
          </div>
          <div className="keyword-row">
            {result.keywords.map((keyword) => (
              <span className="keyword" key={keyword}>#{keyword}</span>
            ))}
          </div>
        </section>
        <section className="section">
          <div className="result-section">
            <p className="lead">{result.description}</p>
          </div>
          <div className="result-section">
            <div className="insight-grid">
              <article className="insight-card">
                <h2>맞춤 처방</h2>
                <p>{result.recommendation}</p>
              </article>
              <article className="insight-card">
                <h2>뉴스레터 초대</h2>
                <p>{result.cta}</p>
              </article>
            </div>
          </div>
          <div className="result-section">
            <h2>대표 영양소</h2>
            <div className="score-list">
              {getSortedResultScores(scores, nutritionKeys).slice(0, 1).map(({ key, score }) => (
                <div className="score-row" key={key}>
                  <span>{nutritionLabels[key as NutritionKey]}</span>
                  <div className="score-bar">
                    <span style={{ width: `${(score / 6) * 100}%` }} />
                  </div>
                  <b>{score}</b>
                </div>
              ))}
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
