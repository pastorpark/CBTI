"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { personaLabels } from "@/data/test";
import type { PersonaKey } from "@/types/test";

type StatsResponse = {
  configured: boolean;
  total: number;
  uniqueVisitors: number;
  duplicateRate: number;
  visits: {
    total: number;
    uniqueVisitors: number;
    byDay: { date: string; count: number }[];
  };
  all: StatsBucket;
  deduped: StatsBucket;
};

type StatsBucket = {
  total: number;
  byPersona: Record<PersonaKey, number>;
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

  const activeStats = useMemo(() => stats?.[mode], [mode, stats]);

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

        <section className="stats-grid" style={{ marginTop: 14 }}>
          <Metric label="전체 접속" value={stats.visits.total} />
          <Metric label="고유 접속자" value={stats.visits.uniqueVisitors} />
          <Metric label="전체 완료" value={stats.total} />
          <Metric label="중복 제거 방문자" value={stats.uniqueVisitors} />
          <Metric label="중복 의심 비율" value={`${stats.duplicateRate}%`} />
          <Metric label="현재 기준 완료" value={activeStats?.total ?? 0} />
        </section>

        <section className="admin-card" style={{ marginTop: 14 }}>
          <h2>유형별 결과 분포</h2>
          <div className="score-list">
            {activeStats &&
              Object.entries(activeStats.byPersona).map(([key, count]) => {
                const personaKey = key as PersonaKey;
                const percent = activeStats.total > 0 ? Math.round((count / activeStats.total) * 100) : 0;

                return (
                  <div className="score-row" key={key}>
                    <span>{personaLabels[personaKey]}</span>
                    <div className="score-bar">
                      <span style={{ width: `${Math.max(4, percent)}%` }} />
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
            {activeStats?.byDay.length ? (
              activeStats.byDay.slice(-14).map((item) => (
                <div className="score-row" key={item.date}>
                  <span>{item.date}</span>
                  <div className="score-bar">
                    <span style={{ width: `${Math.max(4, (item.count / Math.max(1, activeStats.total)) * 100)}%` }} />
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
                    const percent = activeStats.total > 0 ? Math.round((option.count / activeStats.total) * 100) : 0;
                    return (
                      <div className="score-row" key={option.optionId}>
                        <span>{option.label}</span>
                        <div className="score-bar">
                          <span style={{ width: `${Math.max(4, percent)}%` }} />
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
