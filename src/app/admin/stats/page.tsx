"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { defaultSurveyId } from "@/data/test";
import type { SiteVariantId, SurveyId } from "@/types/test";
import { defaultSiteVariantId } from "@/variants";

type StatsResponse = {
  configured: boolean;
  total: number;
  uniqueVisitors: number;
  duplicateRate: number;
  variants: {
    id: SiteVariantId;
    label: string;
    description: string;
  }[];
  surveys: {
    id: SurveyId;
    title: string;
    description: string;
    questionCount: number;
    questionTime: number;
    resultLabels: Record<string, string>;
  }[];
  visits: {
    total: number;
    uniqueVisitors: number;
    byDay: { date: string; count: number }[];
  };
  visitsByVariant: Record<SiteVariantId, {
    total: number;
    uniqueVisitors: number;
    byDay: { date: string; count: number }[];
  }>;
  all: Record<SiteVariantId, Record<SurveyId, StatsBucket>>;
  deduped: Record<SiteVariantId, Record<SurveyId, StatsBucket>>;
};

type StatsBucket = {
  total: number;
  byPersona: Record<string, number>;
  byDay: { date: string; count: number }[];
  byQuestion: {
    id: string;
    title: string;
    options: { optionId: string; label: string; count: number }[];
  }[];
};

export default function AdminStatsPage() {
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"deduped" | "all">("deduped");
  const [activeVariantId, setActiveVariantId] = useState<SiteVariantId>(defaultSiteVariantId);
  const [activeSurveyId, setActiveSurveyId] = useState<SurveyId>(defaultSurveyId);

  const activeStats = useMemo(() => stats?.[mode][activeVariantId][activeSurveyId], [activeSurveyId, activeVariantId, mode, stats]);
  const activeVisitStats = useMemo(() => stats?.visitsByVariant[activeVariantId], [activeVariantId, stats]);
  const activeSurvey = useMemo(() => stats?.surveys.find((survey) => survey.id === activeSurveyId), [activeSurveyId, stats]);
  const personaScaleMax = useMemo(() => {
    const maxCount = Math.max(0, ...Object.values(activeStats?.byPersona ?? {}));
    return maxCount > 0 ? Math.ceil(maxCount / 100) * 100 : 100;
  }, [activeStats]);
  const recentDayStats = useMemo(() => activeStats?.byDay.slice(-14) ?? [], [activeStats]);
  const dayScaleMax = useMemo(() => getScaleMax(recentDayStats.map((item) => item.count)), [recentDayStats]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/stats", { cache: "no-store" });

    if (response.status === 401) {
      setLoading(false);
      return;
    }

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { detail?: string; error?: string } | null;
      setError(data?.detail ? `통계를 불러오지 못했습니다: ${data.detail}` : "통계를 불러오지 못했습니다.");
      setLoading(false);
      return;
    }

    setStats(await response.json());
    setLoading(false);
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setError("비밀번호가 올바르지 않거나 관리자 비밀번호가 설정되지 않았습니다.");
      return;
    }

    setPassword("");
    await loadStats();
  }

  if (loading) {
    return (
      <main className="app-shell">
        <section className="panel section loading-box">
          <div>
            <div className="spinner" />
            <h1>통계를 불러오는 중입니다</h1>
          </div>
        </section>
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="app-shell">
        <section className="panel section">
          <span className="brand">Admin</span>
          <h1>관리자 통계</h1>
          <p className="lead">통계 페이지를 보려면 관리자 비밀번호를 입력하세요.</p>
          <form className="actions" onSubmit={login}>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="관리자 비밀번호"
              autoComplete="current-password"
            />
            <button className="button">로그인</button>
          </form>
          {error && <p className="small">{error}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="admin-layout">
        <section className="admin-card">
          <span className="brand">Admin</span>
          <h1>테스트 통계</h1>
          <p className="small">
            같은 브라우저의 반복 테스트는 방문자 해시 기준으로 완화합니다. 다른 기기나 시크릿 모드는 구분하기 어렵습니다.
          </p>
          {!stats.configured && (
            <p className="small">
              Supabase 환경변수가 아직 설정되지 않아 실제 제출 데이터는 저장되지 않고 있습니다.
            </p>
          )}
          <div className="actions" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <button className={`button ${mode === "deduped" ? "" : "secondary"}`} onClick={() => setMode("deduped")}>
              중복 제거
            </button>
            <button className={`button ${mode === "all" ? "" : "secondary"}`} onClick={() => setMode("all")}>
              전체 기준
            </button>
          </div>
        </section>

        <section className="survey-admin-grid" style={{ marginTop: 14 }} aria-label="버전 선택">
          {stats.variants.map((variant) => (
            <button
              key={variant.id}
              className={`survey-card admin-survey-card ${activeVariantId === variant.id ? "active" : ""}`}
              onClick={() => setActiveVariantId(variant.id)}
            >
              <span className="survey-card-kicker">버전</span>
              <strong>{variant.label}</strong>
              <span>{variant.description}</span>
            </button>
          ))}
        </section>

        <section className="survey-admin-grid" style={{ marginTop: 14 }} aria-label="설문 선택">
          {stats.surveys.map((survey) => (
            <button
              key={survey.id}
              className={`survey-card admin-survey-card ${activeSurveyId === survey.id ? "active" : ""}`}
              onClick={() => setActiveSurveyId(survey.id)}
            >
              <span className="survey-card-kicker">{survey.questionCount}개 문항/{survey.questionTime}분</span>
              <strong>{survey.title}</strong>
              <span>{survey.description}</span>
            </button>
          ))}
        </section>

        <section className="stats-grid" style={{ marginTop: 14 }}>
          <Metric label="전체 접속" value={stats.visits.total} />
          <Metric label="고유 접속자" value={stats.visits.uniqueVisitors} />
          <Metric label="전체 완료" value={stats.total} />
          <Metric label="중복 제거 방문자" value={stats.uniqueVisitors} />
          <Metric label="중복 의심 비율" value={`${stats.duplicateRate}%`} />
          <Metric label="선택 버전 접속" value={activeVisitStats?.total ?? 0} />
          <Metric label="선택 설문 완료" value={activeStats?.total ?? 0} />
        </section>

        <section className="admin-card" style={{ marginTop: 14 }}>
          <h2>유형별 결과 분포</h2>
          <div className="score-list">
            {activeStats &&
              Object.entries(activeStats.byPersona).map(([key, count]) => {
                const percent = (count / personaScaleMax) * 100;

                return (
                  <div className="score-row" key={key}>
                    <span>{activeSurvey?.resultLabels[key] ?? key}</span>
                    <div className="score-bar">
                      <span style={{ width: `${count > 0 ? Math.max(4, percent) : 0}%` }} />
                    </div>
                    <b>{count}</b>
                  </div>
                );
              })}
          </div>
        </section>

        <section className="admin-card" style={{ marginTop: 14 }}>
          <h2>일자별 완료 수</h2>
          <div className="denomination-list">
            {recentDayStats.length ? (
              recentDayStats.map((item) => (
                <div className="score-row" key={item.date}>
                  <span>{item.date}</span>
                  <div className="score-bar">
                    <span style={{ width: `${getBarWidth(item.count, dayScaleMax)}%` }} />
                  </div>
                  <b>{item.count}</b>
                </div>
              ))
            ) : (
              <p className="small">아직 데이터가 없습니다.</p>
            )}
          </div>
        </section>

        <section className="admin-card" style={{ marginTop: 14 }}>
          <h2>문항별 선택지 분포</h2>
          <div className="denomination-list">
            {activeStats?.byQuestion.map((question, index) => (
              <div className="list-item" key={question.id}>
                <strong>Q{index + 1}. {question.title}</strong>
                <div className="score-list">
                  {question.options.map((option) => {
                    const questionScaleMax = getScaleMax(question.options.map((item) => item.count));
                    return (
                      <div className="score-row" key={option.optionId}>
                        <span>{option.label}</span>
                        <div className="score-bar">
                          <span style={{ width: `${getBarWidth(option.count, questionScaleMax)}%` }} />
                        </div>
                        <b>{option.count}</b>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="admin-card">
      <span className="small">{label}</span>
      <h2>{value}</h2>
    </div>
  );
}

function getScaleMax(values: number[]) {
  const maxCount = Math.max(0, ...values);
  return maxCount > 0 ? Math.ceil(maxCount / 100) * 100 : 100;
}

function getBarWidth(value: number, scaleMax: number) {
  if (value <= 0) {
    return 0;
  }

  return Math.max(4, (value / scaleMax) * 100);
}
