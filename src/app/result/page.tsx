import Link from "next/link";
import { personaResults } from "@/data/test";
import { getSortedScores, isPersonaKey } from "@/lib/scoring";
import { createEmptyScores } from "@/lib/scoring";
import type { PersonaKey } from "@/types/test";

const personaLabel: Record<PersonaKey, string> = {
  Orthodox: "신앙 수호형",
  Intellectual: "지성 탐구형",
  Progressive: "시대 공감형",
  Social: "사회 참여형",
  Liturgical: "예전 전통형",
  Charismatic: "열정 체험형",
  Relational: "관계 중심형"
};

type ResultPageProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const type = params.type ?? null;

  if (!isPersonaKey(type)) {
    return (
      <main className="app-shell">
        <section className="panel section">
          <span className="brand">My Spiritual Home</span>
          <h1>결과를 찾을 수 없어요</h1>
          <p className="lead">공유 링크가 올바르지 않거나 만료된 결과입니다.</p>
          <div className="actions">
            <Link className="button" href="/">테스트 하러 가기</Link>
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
          <span className="brand">공유된 결과</span>
          <h1 className="hero-title">{result.title}</h1>
          <p className="lead">{result.subtitle}</p>
          <div className="keyword-row">
            {result.keywords.map((keyword) => (
              <span className="keyword" key={keyword}>#{keyword}</span>
            ))}
          </div>
        </section>
        <section className="section">
          <p className="lead">{result.description}</p>
          <h2>잘 맞는 교파 Top 3</h2>
          <div className="denomination-list">
            {result.denominations.map((item, index) => (
              <div className="list-item" key={item.name}>
                <strong>{index + 1}. {item.name}</strong>
                <span className="small">{item.description}</span>
              </div>
            ))}
          </div>
          <h2>대표 성향</h2>
          <div className="score-list">
            {getSortedScores(scores).slice(0, 1).map(({ key, score }) => (
              <div className="score-row" key={key}>
                <span>{personaLabel[key]}</span>
                <div className="score-bar">
                  <span style={{ width: `${score * 20}%` }} />
                </div>
                <b>{score}</b>
              </div>
            ))}
          </div>
          <div className="actions">
            <Link className="button" href="/">나도 테스트하기</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
