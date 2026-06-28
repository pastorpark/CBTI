"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChungeoramFollowCard } from "@/components/ChungeoramFollowCard";
import { NutritionRadarChart } from "@/components/NutritionRadarChart";
import {
  defaultSurveyId,
  nutritionTieBreakerOrder,
  tieBreakerOrder
} from "@/data/test";
import { getVariantTestContent } from "@/data/variant-content";
import { getResultHeaderStyle } from "@/lib/result-colors";
import { getResultUrl } from "@/lib/result-url";
import { nutritionImagePaths } from "@/lib/nutrition-assets";
import { calculateScores, getClosePersonas, getSortedResultScores, resolvePrimaryResult } from "@/lib/scoring";
import { submitResult } from "@/lib/submissions";
import { getVisitorId } from "@/lib/visitor";
import { submitVisit } from "@/lib/visits";
import { getSiteVariantById, resolveSiteVariantId } from "@/variants";
import { getIntroView } from "@/variants/intro";
import { getIvfLoadingView } from "@/variants/ivf/loading";
import type { Answer, NutritionKey, PersonaKey, Question, ResultKey, SiteVariantId, SurveyId } from "@/types/test";

type Stage = "intro" | "surveyIntro" | "questions" | "loading" | "result";

type HomeClientProps = {
  initialVariantId: SiteVariantId;
};

export function HomeClient({ initialVariantId }: HomeClientProps) {
  const [stage, setStage] = useState<Stage>("intro");
  const [activeVariantId, setActiveVariantId] = useState<SiteVariantId>(initialVariantId);
  const [activeSurveyId, setActiveSurveyId] = useState<SurveyId>(defaultSurveyId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>(() =>
    shuffleQuestions(getVariantTestContent(initialVariantId).surveyMap[defaultSurveyId].questions)
  );
  const [loadingImageIndex, setLoadingImageIndex] = useState(0);
  const submittedRef = useRef(false);

  const activeContent = getVariantTestContent(activeVariantId);
  const activeSurvey = activeContent.surveyMap[activeSurveyId];
  const scores = useMemo(() => calculateScores(answers, sessionQuestions, activeSurvey.resultKeys), [activeSurvey.resultKeys, answers, sessionQuestions]);
  const tieBreakers = activeSurveyId === "nutri" ? nutritionTieBreakerOrder : tieBreakerOrder;
  const primary = useMemo(() => resolvePrimaryResult(scores, activeSurvey.resultKeys, tieBreakers), [activeSurvey.resultKeys, scores, tieBreakers]);
  const personaPrimary = primary as PersonaKey;
  const nutritionPrimary = primary as NutritionKey;
  const personaResult = activeSurveyId === "cbti" ? activeContent.personaResults[personaPrimary] : null;
  const nutritionResult = activeSurveyId === "nutri" ? activeContent.nutritionResults[nutritionPrimary] : null;
  const closePersonas = activeSurveyId === "cbti" ? getClosePersonas(scores as Record<PersonaKey, number>, personaPrimary) : [];
  const sortedScores = getSortedResultScores(scores, activeSurvey.resultKeys);
  const ivfLoadingView = getIvfLoadingView(activeSurveyId);

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
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== "loading" || activeVariantId !== "ivf") return;

    setLoadingImageIndex(0);
    const interval = window.setInterval(() => {
      setLoadingImageIndex((value) => value + 1);
    }, 200);

    return () => window.clearInterval(interval);
  }, [activeSurveyId, activeVariantId, stage]);

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
    const survey = activeContent.surveyMap[surveyId];
    setActiveSurveyId(surveyId);
    setAnswers([]);
    setCurrentIndex(0);
    setSessionQuestions(shuffleQuestions(survey.questions, { shuffleOptions: surveyId !== "nutri" }));
    submittedRef.current = false;
    setStage("surveyIntro");
  }

  function beginQuestions() {
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
      setStage("surveyIntro");
      return;
    }

    setCurrentIndex((value) => value - 1);
  }

  function returnToIntro() {
    setAnswers([]);
    setCurrentIndex(0);
    submittedRef.current = false;
    setStage("intro");
  }

  async function copyResultUrl() {
    const url = getResultUrl(primary, activeSurveyId);

    await navigator.clipboard.writeText(url);
    alert("결과 링크를 복사했어요.");
  }

  const question = sessionQuestions[currentIndex];
  const progress = stage === "questions" ? ((currentIndex + 1) / sessionQuestions.length) * 100 : 100;
  const resultUrl = getResultUrl(primary, activeSurveyId);
  const scoreScaleMax = activeSurveyId === "nutri" ? 6 : 5;
  const IntroView = getIntroView(activeVariantId);
  const activeVariant = getSiteVariantById(activeVariantId);
  const surveyIntro = activeVariant.surveyIntros[activeSurveyId];

  return (
    <main className={`app-shell variant-${activeVariantId}`}>
      <div className="panel">
        {stage === "intro" && (
          <IntroView surveys={activeContent.surveys} onStart={start} />
        )}

        {stage === "surveyIntro" && (
          <section className="section survey-intro-section">
            <span className="survey-intro-eyebrow">{surveyIntro.eyebrow}</span>
            <h1 className="hero-title survey-intro-title">{surveyIntro.title}</h1>
            <p className="lead">{surveyIntro.description}</p>
            <ul className="survey-intro-list">
              {surveyIntro.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <div className="actions">
              <button className="button ghost" onClick={returnToIntro}>
                다른 설문 고르기
              </button>
              <button className="button" onClick={beginQuestions}>
                {surveyIntro.startLabel}
              </button>
            </div>
          </section>
        )}

        {stage === "questions" && (
          <section className="section question-section">
            {activeSurveyId === "nutri" && (
              <p className="question-eyebrow">지금 나를 위해 필요한 것은?</p>
            )}
            <h2 className="question-title">{question.title}</h2>
            <div className="question-bottom">
              <div className={`option-list ${activeSurveyId === "nutri" ? "nutrition-option-list" : ""}`}>
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
          <section className={`section loading-box ${activeVariantId === "ivf" ? "ivf-loading-box" : ""}`}>
            <div>
              {activeVariantId === "ivf" ? (
                <figure className="ivf-loading-visual" aria-hidden="true">
                  <img src={ivfLoadingView.imagePaths[loadingImageIndex % ivfLoadingView.imagePaths.length]} alt="" />
                </figure>
              ) : (
                <div className="spinner" />
              )}
              <h2>{activeVariantId === "ivf" ? ivfLoadingView.title : "당신은 이런 신앙을 갖고 있었군요!"}</h2>
              <p className="small">
                {activeVariantId === "ivf" ? ivfLoadingView.description : "당신과 비슷한 신앙을 가진 사람들을 만날 수 있을거에요"}
              </p>
            </div>
          </section>
        )}

        {stage === "result" && personaResult && (
          <>
            <section className="result-header cbti-result-header" style={getResultHeaderStyle(personaPrimary)}>
              <div className="result-hero-copy">
                <span className="result-type-label">
                  나의 신앙 유형 - {activeContent.personaEnglishLabels[personaPrimary]}
                  <img className="result-character-icon" src={personaResult.characterImage} alt={`${activeContent.personaLabels[personaPrimary]} 캐릭터`} />
                </span>
                <h1 className="hero-title result-title">{personaResult.title}</h1>
                <p className="lead">{personaResult.subtitle}</p>
              </div>
              <figure className="nutrition-result-art" aria-hidden="true">
                <img src={nutritionImagePaths.CARB} alt="" />
              </figure>
              <div className="keyword-row">
                {personaResult.keywords.map((keyword) => (
                  <span className="keyword" key={keyword}>#{keyword}</span>
                ))}
              </div>
            </section>
            <section className="section result-body">
              {activeVariantId === "ivf" ? (
                <>
                  <div className="result-section result-description-section">
                    <span className="result-status-tag">빛나는 나의 영적 감정</span>
                    <p className="lead">{personaResult.description}</p>
                    {closePersonas.length > 0 && (
                      <p className="small">
                        함께 돋보인 성향: {closePersonas.map((key) => activeContent.personaLabels[key]).join(", ")}
                      </p>
                    )}
                    <hr className="result-status-divider" />
                    <span className="result-status-tag">대표 신앙 성향</span>
                    <div className="score-list cbti-ivf-score-list">
                      {sortedScores.map(({ key, score }) => (
                        <div className="score-row cbti-ivf-score-row" key={key}>
                          <span>{activeSurvey.resultLabels[key]}({score})</span>
                          <div className="score-bar">
                            <span style={{ width: `${Math.max(4, (score / scoreScaleMax) * 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <hr className="result-status-divider" />
                    <span className="result-status-tag">빛나는 나의 영적 강점</span>
                    <p className="lead">{personaResult.spiritualStrength}</p>
                    <hr className="result-status-divider" />
                    <span className="result-status-tag">영적 성장을 위한 청어람의 추천</span>
                    <p className="lead">{personaResult.growthRoutine}</p>
                  </div>
                  <div className="result-section cbti-denomination-section">
                    <h2>이런 교파가 잘 맞을지도</h2>
                    <p className="disclaimer-note cbti-denomination-note">
                      위의 설명과 교파 추천은 생성형 AI로 작성되었습니다. 실제 교파의 입장이나 현실과 다를 수 있습니다
                    </p>
                    <div className="denomination-list cbti-denomination-list">
                      {personaResult.denominations.map((item, index) => (
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
                    <p className="lead">{personaResult.description}</p>
                    {closePersonas.length > 0 && (
                      <p className="small">
                        함께 돋보인 성향: {closePersonas.map((key) => activeContent.personaLabels[key]).join(", ")}
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
                </>
              )}
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
                <button className="button secondary" onClick={returnToIntro}>다시 테스트 하기</button>
              </div>
            </section>
          </>
        )}

        {stage === "result" && nutritionResult && (
          <>
            <section className="result-header nutrition-result-header" style={getResultHeaderStyle(nutritionPrimary)}>
              <div className="result-hero-copy">
                <span className="result-type-label">나의 영적 영양상태 - {nutritionResult.key}</span>
                <h1 className="hero-title result-title">{nutritionResult.title}</h1>
              </div>
              <figure className="nutrition-result-art" aria-hidden="true">
                <img src={nutritionImagePaths[nutritionPrimary]} alt="" />
              </figure>
              <div className="keyword-row">
                {nutritionResult.keywords.map((keyword) => (
                  <span className="keyword" key={keyword}>#{keyword}</span>
                ))}
              </div>
            </section>
            <section className="section result-body">
              <div className="result-section result-description-section">
                <span className="result-status-tag">내게 필요한 영양소</span>
                <NutritionRadarChart keys={nutritionTieBreakerOrder} labels={activeSurvey.resultLabels as Record<NutritionKey, string>} scores={scores} maxScore={scoreScaleMax} />
                {sortedScores[1] && sortedScores[1].score === sortedScores[0].score && (
                  <p className="small">
                    {activeSurvey.resultLabels[sortedScores[1].key]} 영양소도 함께 부족하네요!
                  </p>
                )}
                <hr className="result-status-divider" />
                <span className="result-status-tag">당신의 상태</span>
                <p className="lead">{nutritionResult.status}</p>
                <hr className="result-status-divider" />
                <span className="result-status-tag">청어람의 조언</span>
                <p className="lead">{nutritionResult.description}</p>
                <hr className="result-status-divider" />
                <span className="result-status-tag">맞춤 처방</span>
                <p className="lead">{nutritionResult.recommendation}</p>
              </div>
              {activeVariantId === "ivf" && (
                <div className="result-section">
                  <div className="insight-grid">
                    <ChungeoramFollowCard />
                  </div>
                </div>
              )}
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
                <button className="button secondary" onClick={returnToIntro}>다시 테스트 하기</button>
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
