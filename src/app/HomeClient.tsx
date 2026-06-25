"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  defaultSurveyId,
  nutritionResults,
  nutritionTieBreakerOrder,
  personaEnglishLabels,
  personaLabels,
  personaResults,
  surveys,
  surveyMap,
  tieBreakerOrder
} from "@/data/test";
import { getResultUrl } from "@/lib/result-url";
import { calculateScores, getClosePersonas, getSortedResultScores, resolvePrimaryResult } from "@/lib/scoring";
import { submitResult } from "@/lib/submissions";
import { getVisitorId } from "@/lib/visitor";
import { submitVisit } from "@/lib/visits";
import { resolveSiteVariantId } from "@/variants";
import { getIntroView } from "@/variants/intro";
import type { Answer, NutritionKey, PersonaKey, Question, ResultKey, SiteVariantId, SurveyId } from "@/types/test";

type Stage = "intro" | "questions" | "loading" | "result";

type HomeClientProps = {
  initialVariantId: SiteVariantId;
};

export function HomeClient({ initialVariantId }: HomeClientProps) {
  const [stage, setStage] = useState<Stage>("intro");
  const [activeVariantId, setActiveVariantId] = useState<SiteVariantId>(initialVariantId);
  const [activeSurveyId, setActiveSurveyId] = useState<SurveyId>(defaultSurveyId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>(() => shuffleQuestions(surveyMap[defaultSurveyId].questions));
  const submittedRef = useRef(false);

  const activeSurvey = surveyMap[activeSurveyId];
  const scores = useMemo(() => calculateScores(answers, sessionQuestions, activeSurvey.resultKeys), [activeSurvey.resultKeys, answers, sessionQuestions]);
  const tieBreakers = activeSurveyId === "carb" ? nutritionTieBreakerOrder : tieBreakerOrder;
  const primary = useMemo(() => resolvePrimaryResult(scores, activeSurvey.resultKeys, tieBreakers), [activeSurvey.resultKeys, scores, tieBreakers]);
  const personaPrimary = primary as PersonaKey;
  const nutritionPrimary = primary as NutritionKey;
  const personaResult = activeSurveyId === "cbti" ? personaResults[personaPrimary] : null;
  const nutritionResult = activeSurveyId === "carb" ? nutritionResults[nutritionPrimary] : null;
  const closePersonas = activeSurveyId === "cbti" ? getClosePersonas(scores as Record<PersonaKey, number>, personaPrimary) : [];
  const sortedScores = getSortedResultScores(scores, activeSurvey.resultKeys);

  useEffect(() => {
    const variantId = resolveSiteVariantId(window.location.host);
    setActiveVariantId(variantId);
    document.body.dataset.variant = variantId;

    submitVisit({
      variantId,
      visitorId: getVisitorId(),
      path: window.location.pathname
    }).catch((error) => {
      console.warn(error);
    });
  }, []);

  useEffect(() => {
    if (stage !== "loading") return;

    const timer = window.setTimeout(() => {
      setStage("result");
    }, 950);

    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== "result" || submittedRef.current || answers.length !== sessionQuestions.length) return;

    submittedRef.current = true;
    submitResult({
      variantId: activeVariantId,
      surveyId: activeSurveyId,
      visitorId: getVisitorId(),
      primaryPersona: primary,
      scores,
      answers
    }).catch((error) => {
      console.warn(error);
    });
  }, [activeSurveyId, answers, primary, scores, sessionQuestions.length, stage]);

  function start(surveyId: SurveyId = activeSurveyId) {
    const survey = surveyMap[surveyId];
    setActiveSurveyId(surveyId);
    setAnswers([]);
    setCurrentIndex(0);
    setSessionQuestions(shuffleQuestions(survey.questions, { shuffleOptions: surveyId !== "carb" }));
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
    const url = getResultUrl(primary, activeSurveyId);

    await navigator.clipboard.writeText(url);
    alert("결과 링크를 복사했어요.");
  }

  const question = sessionQuestions[currentIndex];
  const progress = stage === "questions" ? ((currentIndex + 1) / sessionQuestions.length) * 100 : 100;
  const resultUrl = getResultUrl(primary, activeSurveyId);
  const scoreScaleMax = activeSurveyId === "carb" ? 6 : 5;
  const IntroView = getIntroView(activeVariantId);

  return (
    <main className={`app-shell variant-${activeVariantId}`}>
      <div className="panel">
        {stage === "intro" && (
          <IntroView surveys={surveys} onStart={start} />
        )}

        {stage === "questions" && (
          <section className="section question-section">
            {activeSurveyId === "carb" && (
              <p className="question-eyebrow">지금 나를 위해 필요한 것은?</p>
            )}
            <h2 className="question-title">{question.title}</h2>
            <div className="question-bottom">
              <div className={`option-list ${activeSurveyId === "carb" ? "nutrition-option-list" : ""}`}>
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
              <div className="progress-wrap">
                <div className="progress-meta">
                  <span>{currentIndex + 1} / {sessionQuestions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </section>
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

        {stage === "result" && personaResult && (
          <>
            <section className="result-header">
              <div className="result-hero-copy">
                <span className="result-type-label">
                  나의 신앙 유형 - {personaEnglishLabels[personaPrimary]}
                  <img className="result-character-icon" src={personaResult.characterImage} alt={`${personaLabels[personaPrimary]} 캐릭터`} />
                </span>
                <h1 className="hero-title result-title">{personaResult.title}</h1>
                <p className="lead">{personaResult.subtitle}</p>
              </div>
              <div className="keyword-row">
                {personaResult.keywords.map((keyword) => (
                  <span className="keyword" key={keyword}>#{keyword}</span>
                ))}
              </div>
            </section>
            <section className="section">
              <div className="result-section">
                <p className="lead">{personaResult.description}</p>
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
                    <p>{personaResult.spiritualStrength}</p>
                  </article>
                  <article className="insight-card">
                    <h2>🌱 영적 성장을 위한 추천 루틴</h2>
                    <p>{personaResult.growthRoutine}</p>
                  </article>
                </div>
              </div>
              <div className="result-section">
                <h2>이런 교파가 잘 맞을지도</h2>
                <div className="denomination-list">
                  {personaResult.denominations.map((item, index) => (
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
                      <span>{activeSurvey.resultLabels[key]}</span>
                      <div className="score-bar">
                        <span style={{ width: `${Math.max(4, (score / scoreScaleMax) * 100)}%` }} />
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
                <button className="button secondary" onClick={() => start(activeSurvey.id)}>다시 테스트 하기</button>
              </div>
            </section>
          </>
        )}

        {stage === "result" && nutritionResult && (
          <>
            <section className="result-header nutrition-result-header">
              <div className="result-hero-copy">
                <span className="result-type-label">나의 영적 영양상태 - {nutritionResult.key}</span>
                <h1 className="hero-title result-title">{nutritionResult.title}</h1>
                <p className="lead">{nutritionResult.status}</p>
              </div>
              <div className="keyword-row">
                {nutritionResult.keywords.map((keyword) => (
                  <span className="keyword" key={keyword}>#{keyword}</span>
                ))}
              </div>
            </section>
            <section className="section">
              <div className="result-section">
                <p className="lead">{nutritionResult.description}</p>
                {sortedScores[1] && sortedScores[1].score === sortedScores[0].score && (
                  <p className="small">
                    {activeSurvey.resultLabels[sortedScores[1].key]} 영양소도 함께 부족하네요!
                  </p>
                )}
              </div>
              <div className="result-section">
                <div className="insight-grid">
                  <article className="insight-card">
                    <h2>맞춤 처방</h2>
                    <p>{nutritionResult.recommendation}</p>
                  </article>
                  <article className="insight-card">
                    <h2>뉴스레터 초대</h2>
                    <p>{nutritionResult.cta}</p>
                  </article>
                </div>
              </div>
              <div className="result-section">
                <h2>나의 영적 영양 스탯</h2>
                <div className="score-list">
                  {sortedScores.map(({ key, score }) => (
                    <div className="score-row" key={key}>
                      <span>{activeSurvey.resultLabels[key]}</span>
                      <div className="score-bar">
                        <span style={{ width: `${Math.max(4, (score / scoreScaleMax) * 100)}%` }} />
                      </div>
                      <b>{score}</b>
                    </div>
                  ))}
                </div>
              </div>
              <section className="share-panel">
                <div className="share-box">
                  <h2>결과 공유하기</h2>
                  <p>지금 나에게 필요한 영적 영양소를 친구들과 공유해보세요</p>
                  <div className="share-row">
                    <input id="result-url" className="share-input" readOnly value={resultUrl} />
                    <button className="button compact" onClick={copyResultUrl}>복사하기</button>
                  </div>
                </div>
              </section>
              <div className="actions">
                <button className="button secondary" onClick={() => start(activeSurvey.id)}>다시 테스트 하기</button>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function shuffleQuestions(sourceQuestions: Question[], { shuffleOptions = true } = {}) {
  return shuffleArray(sourceQuestions).map((question) => ({
    ...question,
    options: shuffleOptions ? shuffleArray(question.options) : question.options
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
