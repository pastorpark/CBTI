import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ChungeoramFollowCard } from "@/components/ChungeoramFollowCard";
import { personaEnglishLabels, personaKeys, personaLabels, personaResults } from "@/data/test";
import { fillMetadataTemplate } from "@/lib/metadata-template";
import { resolvePersonaResultKey } from "@/lib/result-aliases";
import { getResultHeaderStyle } from "@/lib/result-colors";
import { nutritionImagePaths } from "@/lib/nutrition-assets";
import { createEmptyScores, getSortedScores } from "@/lib/scoring";
import { getSiteVariantById, resolveSiteVariantId } from "@/variants";

type ResultPageProps = {
  params: Promise<{ type: string }>;
};

export function generateStaticParams() {
  return personaKeys.map((key) => ({ type: key }));
}

export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const { type } = await params;
  const variantId = resolveSiteVariantId((await headers()).get("host"));
  const variantMetadata = getSiteVariantById(variantId).metadata;
  const template = variantMetadata.results.cbti;
  const resolvedType = resolvePersonaResultKey(type);

  if (!resolvedType) {
    return {
      title: "결과를 찾을 수 없어요",
      description: "공유 링크가 올바르지 않거나 만료된 결과입니다."
    };
  }

  const label = personaLabels[resolvedType];
  const result = personaResults[resolvedType];
  const templateValues = {
    key: resolvedType,
    keyLower: resolvedType.toLowerCase(),
    label,
    englishLabel: personaEnglishLabels[resolvedType],
    title: result.title,
    subtitle: result.subtitle
  };
  const imageUrl = fillMetadataTemplate(template.openGraphImage, templateValues);

  return {
    title: fillMetadataTemplate(template.title, templateValues),
    description: fillMetadataTemplate(template.description, templateValues),
    alternates: {
      canonical: `/result/cbti/${resolvedType}`
    },
    openGraph: {
      title: fillMetadataTemplate(template.openGraphTitle, templateValues),
      description: fillMetadataTemplate(template.openGraphDescription, templateValues),
      url: `/result/cbti/${resolvedType}`,
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

export default async function ResultPage({ params }: ResultPageProps) {
  const { type } = await params;
  const variantId = resolveSiteVariantId((await headers()).get("host"));
  const resolvedType = resolvePersonaResultKey(type);

  if (!resolvedType) {
    return (
      <main className={`app-shell variant-${variantId}`}>
        <section className="panel section">
          <span className="brand">CBTI</span>
          <h1>결과를 찾을 수 없어요 😢</h1>
          <p className="lead">공유 링크가 올바르지 않거나 만료된 결과입니다.</p>
          <div className="actions">
            <Link className="button" href="/">내 성향 테스트 하러 가기</Link>
          </div>
        </section>
      </main>
    );
  }

  if (type !== resolvedType) {
    redirect(`/result/cbti/${resolvedType}`);
  }

  const result = personaResults[resolvedType];
  const scores = createEmptyScores();
  scores[resolvedType] = 5;

  return (
    <main className={`app-shell variant-${variantId}`}>
      <div className="panel">
        <section className="result-header cbti-result-header" style={getResultHeaderStyle(resolvedType)}>
          <div className="result-hero-copy">
            <span className="result-type-label">
              나의 신앙 유형 - {personaEnglishLabels[resolvedType]}

            </span>
            <h1 className="hero-title result-title"><img className="result-character-icon" src={result.characterImage} alt={`${personaLabels[resolvedType]} 캐릭터`} />{result.title}</h1>
            <p className="lead">{result.subtitle}</p>
          </div>
          <figure className="nutrition-result-art" aria-hidden="true">
            <img src={nutritionImagePaths.CARB} alt="" />
          </figure>
          <div className="keyword-row">
            {result.keywords.map((keyword) => (
              <span className="keyword" key={keyword}>#{keyword}</span>
            ))}
          </div>
        </section>
        <section className="section result-body">
          {variantId === "ivf" ? (
            <>
              <div className="result-section result-description-section">
                <span className="result-status-tag">빛나는 나의 영적 감정</span>
                <p className="lead">{result.description}</p>
                <hr className="result-status-divider" />
                <span className="result-status-tag">대표 신앙 성향</span>
                <div className="score-list cbti-ivf-score-list">
                  {getSortedScores(scores).map(({ key, score }) => (
                    <div className="score-row cbti-ivf-score-row" key={key}>
                      <span>{personaLabels[key]}({score})</span>
                      <div className="score-bar">
                        <span style={{ width: `${Math.max(4, score * 20)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <hr className="result-status-divider" />
                <span className="result-status-tag">빛나는 나의 영적 강점</span>
                <p className="lead">{result.spiritualStrength}</p>
                <hr className="result-status-divider" />
                <span className="result-status-tag">영적 성장을 위한 청어람의 추천</span>
                <p className="lead">{result.growthRoutine}</p>
              </div>
              <div className="result-section cbti-denomination-section">
                <h2>이런 교파가 잘 맞을지도</h2>
                <p className="disclaimer-note cbti-denomination-note">
                  위의 설명과 교파 추천은 생성형 AI로 작성되었습니다. 실제 교파의 입장이나 현실과 다를 수 있습니다
                </p>
                <div className="denomination-list cbti-denomination-list">
                  {result.denominations.map((item, index) => (
                    <div className="list-item" key={item.name}>
                      <strong>{index + 1}. {item.name}</strong>
                      <span className="small">{item.description}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="result-section">
                <div className="insight-grid">
                  <ChungeoramFollowCard />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="result-section">
                <p className="lead">{result.description}</p>
              </div>
              <div className="result-section">
                <div className="insight-grid">
                  <article className="insight-card">
                    <h2>✨ 빛나는 나의 영적 강점</h2>
                    <p>{result.spiritualStrength}</p>
                  </article>
                  <article className="insight-card">
                    <h2>🌱 영적 성장을 위한 추천 루틴</h2>
                    <p>{result.growthRoutine}</p>
                  </article>
                </div>
              </div>
              <div className="result-section">
                <h2>이런 교파가 잘 맞을지도</h2>
                <div className="denomination-list">
                  {result.denominations.map((item, index) => (
                    <div className="list-item" key={item.name}>
                      <strong>{index + 1}. {item.name}</strong>
                      <span className="small">{item.description}</span>
                    </div>
                  ))}
                </div>
                <p className="disclaimer-note">
                  위의 설명과 교파 추천은 생성형 AI로 작성되었습니다. 실제 교파의 입장이나 현실과 다를 수 있습니다
                </p>
              </div>
              <div className="result-section">
                <h2>대표 신앙 성향</h2>
                <div className="score-list">
                  {getSortedScores(scores).slice(0, 1).map(({ key, score }) => (
                    <div className="score-row" key={key}>
                      <span>{personaLabels[key]}</span>
                      <div className="score-bar">
                        <span style={{ width: `${score * 20}%` }} />
                      </div>
                      <b>{score}</b>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          <div className="actions">
            <Link className="button" href="/">나도 테스트 해보기</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
