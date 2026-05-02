"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { personaResults, questions } from "@/data/test";
import { getResultUrl } from "@/lib/result-url";
import { calculateScores, getClosePersonas, getSortedScores, resolvePrimaryPersona } from "@/lib/scoring";
import { submitResult } from "@/lib/submissions";
import { getVisitorId } from "@/lib/visitor";
import type { Answer, PersonaKey, Question } from "@/types/test";

type Stage = "intro" | "questions" | "loading" | "result";

const personaLabel: Record<PersonaKey, string> = {
  Orthodox: "신앙 수호형",
  Intellectual: "지성 탐구형",
  Progressive: "시대 공감형",
  Social: "사회 참여형",
  Liturgical: "예전 전통형",
  Charismatic: "열정 체험형",
  Relational: "관계 중심형"
};

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

  async function share() {
    const url = getResultUrl(primary);
    const text = `나의 신앙 유형은 ${personaLabel[primary]}입니다.`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "My Spiritual Home", text, url });
      } catch {
        await navigator.clipboard.writeText(url);
        alert("결과 링크를 복사했어요.");
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    alert("결과 링크를 복사했어요.");
  }

  const question = sessionQuestions[currentIndex];
  const progress = stage === "questions" ? ((currentIndex + 1) / sessionQuestions.length) * 100 : 100;

  return (
    <main className="app-shell">
      <div className="panel">
        {stage === "intro" && (
          <section className="section">
            <span className="brand">My Spiritual Home</span>
            <h1 className="hero-title">내 신앙은 어떤 집을 닮았을까?</h1>
            <p className="lead">
              15개의 질문을 통해 나의 신앙 성향을 살펴보고, 잘 맞는 신앙 유형과 추천 교파를 확인해보세요.
            </p>
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
              <h2>당신의 신앙 성향을 분석 중입니다</h2>
              <p className="small">답변의 흐름을 차분히 읽어보고 있어요.</p>
            </div>
          </section>
        )}

        {stage === "result" && (
          <>
            <section className="result-header">
              <span className="brand">결과</span>
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
              {closePersonas.length > 0 && (
                <p className="small">
                  함께 강하게 나타난 성향: {closePersonas.map((key) => personaLabel[key]).join(", ")}
                </p>
              )}
              <h2>잘 맞는 교파 Top 3</h2>
              <div className="denomination-list">
                {result.denominations.map((item, index) => (
                  <div className="list-item" key={item.name}>
                    <strong>{index + 1}. {item.name}</strong>
                    <span className="small">{item.description}</span>
                  </div>
                ))}
              </div>
              <h2>점수 분포</h2>
              <div className="score-list">
                {sortedScores.map(({ key, score }) => (
                  <div className="score-row" key={key}>
                    <span>{personaLabel[key]}</span>
                    <div className="score-bar">
                      <span style={{ width: `${Math.max(4, (score / 5) * 100)}%` }} />
                    </div>
                    <b>{score}</b>
                  </div>
                ))}
              </div>
              <div className="actions">
                <button className="button" onClick={share}>결과 공유하기</button>
                <button className="button secondary" onClick={start}>다시 하기</button>
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
