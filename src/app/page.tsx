"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { personaEnglishLabels, personaLabels, personaResults, questions } from "@/data/test";
import { getResultUrl } from "@/lib/result-url";
import { calculateScores, getClosePersonas, getSortedScores, resolvePrimaryPersona } from "@/lib/scoring";
import { submitResult } from "@/lib/submissions";
import { getVisitorId } from "@/lib/visitor";
import type { Answer, Question } from "@/types/test";

type Stage = "intro" | "questions" | "loading" | "result";

export default function Home() {
  const [stage, setStage] = useState<Stage>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>(() => shuffleQuestions(questions));
  const submittedRef = useRef(false);

  const scores = useMemo(() => calculateScores(answers), [answers]);
  const primary = useMemo(() => resolvePrimaryPersona(scores), [scores]);
  const result = personaResults[primary];
  const closePersonas = getClosePersonas(scores, primary);
  const sortedScores = getSortedScores(scores);

  useEffect(() => {
    if (stage !== "loading") return;

    const timer = window.setTimeout(() => {
      setStage("result");
    }, 950);

    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== "result" || submittedRef.current || answers.length !== questions.length) return;

    submittedRef.current = true;
    submitResult({
      visitorId: getVisitorId(),
      primaryPersona: primary,
      scores,
      answers
    }).catch((error) => {
      console.warn(error);
    });
  }, [answers, primary, scores, stage]);

  function start() {
    setAnswers([]);
    setCurrentIndex(0);
    setSessionQuestions(shuffleQuestions(questions));
    submittedRef.current = false;
    setStage("questions");
  }

  function selectOption(optionId: string) {
    const question = sessionQuestions[currentIndex];
    const nextAnswers = [...answers.filter((answer) => answer.questionId !== question.id), { questionId: question.id, optionId }];
    setAnswers(nextAnswers);

    if (currentIndex === sessionQuestions.length - 1) {
      setStage("loading");
      return;
    }

    setCurrentIndex((value) => value + 1);
  }

  function goBack() {
    if (currentIndex === 0) {
      setStage("intro");
      return;
    }

    setCurrentIndex((value) => value - 1);
  }

  async function copyResultUrl() {
    const url = getResultUrl(primary);

    await navigator.clipboard.writeText(url);
    alert("결과 링크를 복사했어요.");
  }

  const question = sessionQuestions[currentIndex];
  const progress = stage === "questions" ? ((currentIndex + 1) / sessionQuestions.length) * 100 : 100;
  const resultUrl = getResultUrl(primary);

  return (
    <main className="app-shell">
      <div className="panel">
        {stage === "intro" && (
          <section className="section intro-section">
            <div className="intro-brand">
              <span className="brand">CBTI</span>
              <span className="brand-full">Christian Belief Type Indicator</span>
            </div>
            <div className="intro-copy">
              <h1 className="hero-title">나는 어떤 크리스천일까?</h1>
              <p className="lead">
                15개의 질문을 통해 나의 신앙 성향을 살펴보고, 잘 맞는 신앙 유형과 추천 교파를 확인해보세요.
              </p>
            </div>
            <div className="actions">
              <button className="button" onClick={start}>
                테스트 시작하기
              </button>
            </div>
          </section>
        )}

        {stage === "questions" && (
          <>
            <div className="progress-wrap">
              <div className="progress-meta">
                <span>{currentIndex + 1} / {sessionQuestions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <section className="section">
              <h2 className="question-title">{question.title}</h2>
              <div className="option-list">
                {question.options.map((option) => (
                  <button key={option.id} className="option" onClick={() => selectOption(option.id)}>
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="actions">
                <button className="button ghost" onClick={goBack}>
                  이전으로
                </button>
              </div>
            </section>
          </>
        )}

        {stage === "loading" && (
          <section className="section loading-box">
            <div>
              <div className="spinner" />
              <h2>당신은 이런 신앙을 갖고 있었군요!</h2>
              <p className="small">당신과 비슷한 신앙을 가진 사람들을 만날 수 있을거에요</p>
            </div>
          </section>
        )}

        {stage === "result" && (
          <>
            <section className="result-header">
              <div className="result-hero-copy">
                <span className="result-type-label">
                  나의 신앙 유형 - {personaEnglishLabels[primary]}
                  <img className="result-character-icon" src={result.characterImage} alt={`${personaLabels[primary]} 캐릭터`} />
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
                {closePersonas.length > 0 && (
                  <p className="small">
                    함께 돋보인 성향: {closePersonas.map((key) => personaLabels[key]).join(", ")}
                  </p>
                )}
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
                <h2>나의 신앙 스탯</h2>
                <div className="score-list">
                  {sortedScores.map(({ key, score }) => (
                    <div className="score-row" key={key}>
                      <span>{personaLabels[key]}</span>
                      <div className="score-bar">
                        <span style={{ width: `${Math.max(4, (score / 5) * 100)}%` }} />
                      </div>
                      <b>{score}</b>
                    </div>
                  ))}
                </div>
              </div>
              <section className="share-panel">
                <div className="share-box">
                  <h2>결과 공유하기</h2>
                  <p>결과를 친구들과 공유하고 다른 사람들의 유형도 확인해보세요</p>
                  <div className="share-row">
                    <input id="result-url" className="share-input" readOnly value={resultUrl} />
                    <button className="button compact" onClick={copyResultUrl}>복사하기</button>
                  </div>
                </div>
              </section>
              <div className="actions">
                <button className="button secondary" onClick={start}>다시 테스트 하기</button>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function shuffleQuestions(sourceQuestions: Question[]) {
  return shuffleArray(sourceQuestions).map((question) => ({
    ...question,
    options: shuffleArray(question.options)
  }));
}

function shuffleArray<T>(items: T[]) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}
