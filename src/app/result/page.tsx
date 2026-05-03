import Link from "next/link";
import type { Metadata } from "next";
import { personaEnglishLabels, personaLabels, personaResults } from "@/data/test";
import { getSortedScores, isPersonaKey } from "@/lib/scoring";
import { createEmptyScores } from "@/lib/scoring";
type ResultPageProps = {
  searchParams: Promise<{ type?: string }>;
};

export async function generateMetadata({ searchParams }: ResultPageProps): Promise<Metadata> {
  const params = await searchParams;
  const type = params.type ?? null;

  if (!isPersonaKey(type)) {
    return {
      title: "결과를 찾을 수 없어요",
      description: "공유 링크가 올바르지 않거나 만료된 결과입니다."
    };
  }

  const label = personaLabels[type];
  const result = personaResults[type];
  const imageUrl = `/og/result-${type.toLowerCase()}.png`;

  return {
    title: `${label} - 나의 신앙 유형 찾기 CBTI`,
    description: `나의 신앙 유형은 ${label}. ${result.subtitle}`,
    openGraph: {
      title: `${label} - 나의 신앙 유형 찾기 CBTI`,
      description: `나의 신앙 유형은 ${label}. ${result.subtitle}`,
      url: `/result?type=${encodeURIComponent(type)}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${label} 결과 - 나의 신앙 유형 찾기 CBTI`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} - 나의 신앙 유형 찾기 CBTI`,
      description: `나의 신앙 유형은 ${label}. ${result.subtitle}`,
      images: [imageUrl]
    }
  };
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const type = params.type ?? null;

  if (!isPersonaKey(type)) {
    return (
      <main className="app-shell">
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

  const result = personaResults[type];
  const scores = createEmptyScores();
  scores[type] = 5;

  return (
    <main className="app-shell">
      <div className="panel">
        <section className="result-header">
          <div className="result-hero-copy">
            <span className="result-type-label">
              나의 신앙 유형 - {personaEnglishLabels[type]}
              <img className="result-character-icon" src={result.characterImage} alt={`${personaLabels[type]} 캐릭터`} />
            </span>
            <h1 className="hero-title result-title">{result.title}</h1>
            <p className="lead">{result.subtitle}</p>
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
          <div className="actions">
            <Link className="button" href="/">나도 테스트 해보기</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
