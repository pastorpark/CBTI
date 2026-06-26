"use client";

import { useState } from "react";
import { StibeeSubscribeForm } from "@/components/StibeeSubscribeForm";

export function ChungeoramFollowCard() {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  return (
    <>
      <article className="insight-card follow-card">
        <h2>
          <span>당신의 영적 영양소를 챙겨줄</span>
          <span>청어람을 팔로우 해보세요</span>
        </h2>
        <div className="follow-actions" aria-label="청어람 팔로우 링크">
          <button className="follow-action-button" type="button" onClick={() => setIsSubscribeOpen(true)}>
            <span className="follow-action-emoji" aria-hidden="true">💌</span>
            <span>뉴스레터 구독</span>
          </button>
          <a className="follow-action-button" href="https://www.instagram.com/ichungeoram" target="_blank" rel="noreferrer">
            <span className="follow-action-emoji" aria-hidden="true">📸</span>
            <span>인스타 채널</span>
          </a>
          <a className="follow-action-button" href="https://armc.cc" target="_blank" rel="noreferrer">
            <span className="follow-action-emoji" aria-hidden="true">🔗</span>
            <span>한눈에 보기</span>
          </a>
        </div>
      </article>

      {isSubscribeOpen && (
        <div className="subscribe-modal" role="dialog" aria-modal="true" aria-labelledby="subscribe-modal-title">
          <button className="subscribe-modal-backdrop" type="button" aria-label="구독 폼 닫기" onClick={() => setIsSubscribeOpen(false)} />
          <div className="subscribe-modal-panel">
            <div className="subscribe-modal-header">
              <h2 id="subscribe-modal-title">뉴스레터 구독</h2>
              <button className="subscribe-modal-close" type="button" onClick={() => setIsSubscribeOpen(false)}>
                닫기
              </button>
            </div>
            <StibeeSubscribeForm />
          </div>
        </div>
      )}
    </>
  );
}
