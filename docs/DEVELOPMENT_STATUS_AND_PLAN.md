# CBTI 개발 현황 비교 및 향후 개발 계획

작성일: 2026-06-06

## 1. 검토 기준

다음 문서와 현재 소스 코드를 비교했습니다.

- `docs/protoplan.md`: 초기 기획안
- `docs/DEVELOPMENT_PLAN.md`: 개발 계획
- `docs/CONTENT_REVIEW.md`: 콘텐츠 검토 문서
- `docs/PROJECT_REPORT.md`: 기존 프로젝트 현황 리포트
- `docs/IMPROVEMENT_ROADMAP.md`: 개선 로드맵

비교 대상 소스는 `src/app`, `src/data`, `src/lib`, `src/types`, `public`, `supabase/schema.sql`, `.env.example`, `package.json`입니다.

## 2. 개발 완료된 부분

### 2.1 사용자 테스트 MVP

- 인트로 화면이 구현되어 있습니다.
- 15개 문항 기반 테스트 진행 화면이 구현되어 있습니다.
- 문항 진행률, 현재 문항 수, 이전 버튼이 구현되어 있습니다.
- 선택지는 매 테스트 시작 시 무작위로 섞입니다.
- 선택 즉시 다음 문항으로 이동합니다.
- 마지막 답변 후 약 950ms 분석 로딩 화면을 보여줍니다.
- 결과 화면에서 대표 유형, 부제, 키워드, 설명, 영적 강점, 성장 루틴, 추천 교파, 점수 분포를 보여줍니다.
- 다시 테스트 하기 흐름이 구현되어 있습니다.

관련 파일:

- `src/app/page.tsx`
- `src/data/test.ts`
- `src/lib/scoring.ts`

### 2.2 점수 계산 및 결과 산출

- 7개 신앙 유형이 `PersonaKey`로 정의되어 있습니다.
- 선택지별 `scores: { persona, weight }[]` 구조가 적용되어 있습니다.
- Q15의 복수 가중치 선택지(`Progressive`, `Social`)가 구현되어 있습니다.
- 동점 시 고정 우선순위(`tieBreakerOrder`)로 대표 유형을 결정합니다.
- 대표 유형과 1점 이내의 보조 성향을 최대 2개까지 표시합니다.

관련 파일:

- `src/data/test.ts`
- `src/lib/scoring.ts`
- `src/types/test.ts`

### 2.3 결과 공유 및 SEO

- 결과 URL은 `/result/{type}` 형식으로 구현되어 있습니다.
- 기존 `/result?type=...` 경로는 `/result/{type}`으로 리다이렉트됩니다.
- 유형별 정적 결과 페이지가 구현되어 있습니다.
- 유형별 Open Graph, Twitter Card 메타데이터가 적용되어 있습니다.
- 사이트 공통 메타데이터, canonical, 검색 엔진 인증 메타, JSON-LD가 적용되어 있습니다.
- `sitemap.ts`와 `robots.txt`가 존재합니다.
- 캐릭터 SVG와 OG 이미지 에셋이 준비되어 있습니다.

관련 파일:

- `src/app/result/[type]/page.tsx`
- `src/app/result/page.tsx`
- `src/app/layout.tsx`
- `src/app/sitemap.ts`
- `public/robots.txt`
- `public/characters/*`
- `public/og/*`

### 2.4 익명 저장 및 관리자 통계

- 테스트 완료 시 `/api/submissions`로 제출 기록을 전송합니다.
- 최초 접속 시 `/api/visits`로 방문 기록을 전송합니다.
- Supabase REST API 연동 코드가 구현되어 있습니다.
- Supabase 설정이 없을 때 사용자 흐름을 막지 않고 저장을 건너뜁니다.
- 방문자 ID와 user-agent는 HMAC SHA-256으로 해시 처리합니다.
- `/admin/stats` 관리자 통계 페이지가 구현되어 있습니다.
- 환경변수 기반 관리자 비밀번호 로그인과 HttpOnly 세션 쿠키가 구현되어 있습니다.
- 유형별 분포, 일자별 완료 수, 문항별 선택지 분포, 방문 수, 중복 제거 토글이 구현되어 있습니다.
- `test_submissions`, `site_visits` 테이블 스키마가 정의되어 있습니다.

관련 파일:

- `src/app/api/submissions/route.ts`
- `src/app/api/visits/route.ts`
- `src/app/api/admin/login/route.ts`
- `src/app/api/admin/stats/route.ts`
- `src/app/admin/stats/page.tsx`
- `src/lib/admin-auth.ts`
- `src/lib/crypto.ts`
- `src/lib/supabase-rest.ts`
- `src/lib/submissions.ts`
- `src/lib/visitor.ts`
- `src/lib/visits.ts`
- `supabase/schema.sql`

### 2.5 콘텐츠 구현

- `CONTENT_REVIEW.md`의 15개 질문과 선택지 대부분이 `src/data/test.ts`에 반영되어 있습니다.
- 7개 유형 라벨, 결과 제목, 부제, 키워드, 설명, 영적 강점, 성장 루틴, 추천 교파가 데이터 파일에 구조화되어 있습니다.
- 결과 화면에는 교파 추천 관련 AI 생성 안내 문구가 표시됩니다.

관련 파일:

- `docs/CONTENT_REVIEW.md`
- `src/data/test.ts`

## 3. 부분 완료 또는 문서와 차이가 있는 부분

### 3.1 공유 기능

문서에는 `navigator.share` 기반 네이티브 공유와 클립보드 fallback이 계획되어 있습니다. 현재 구현은 클립보드 복사와 `alert()` 알림 중심입니다.

현재 상태:

- 결과 URL 표시
- 복사 버튼
- `navigator.clipboard.writeText`
- `alert("결과 링크를 복사했어요.")`

남은 작업:

- 모바일 네이티브 공유 우선 적용
- 실패 또는 미지원 환경에서 클립보드 fallback
- `alert()` 대신 화면 내 토스트 메시지 도입

### 3.2 제출 검증

문서의 개선 로드맵은 서버에서 더 엄격한 검증을 제안합니다. 현재 `/api/submissions`는 질문 ID와 선택지 ID의 존재 여부, 답변 수, 대표 유형 형식은 검증하지만 다음은 아직 부족합니다.

남은 작업:

- `questionId`와 `optionId`의 부모-자식 관계 검증
- 같은 질문에 대한 중복 답변 차단
- 서버에서 `answers` 기반 점수 재계산
- 클라이언트가 보낸 `scores`, `primaryPersona`와 서버 계산 결과 비교
- 유효하지 않은 제출을 통계 저장에서 제외

### 3.3 환경변수와 배포 문서

현재 `.env.example`에는 핵심 Supabase/관리자 변수와 검색 엔진 인증 변수가 있습니다. 다만 `layout.tsx`가 사용하는 `NEXT_PUBLIC_GA_ID`는 `.env.example`에 없습니다.

남은 작업:

- `.env.example`에 `NEXT_PUBLIC_GA_ID` 추가
- Supabase 설정 순서 문서화
- 배포 체크리스트 문서화
- 운영/로컬 환경 차이 정리

### 3.4 UI 구조

개발 계획에는 `components/` 분리가 제안되어 있습니다. 현재 메인 테스트 UI는 대부분 `src/app/page.tsx` 한 파일에 구현되어 있습니다.

남은 작업:

- `IntroScreen`
- `QuestionScreen`
- `LoadingScreen`
- `ResultScreen`
- `ProgressBar`
- `OptionButton`
- `SharePanel`
- `ScoreChart`

### 3.5 테스트 및 품질 검증

현재 `package.json`에는 `build`, `dev`, `start`, `lint` 스크립트가 있습니다. 별도 테스트 러너나 단위 테스트는 아직 없습니다.

남은 작업:

- 점수 계산 단위 테스트
- 제출 API validation 테스트
- 결과 URL 생성 테스트
- 관리자 통계 집계 테스트
- Next.js 15 기준 `lint` 스크립트 점검

## 4. 아직 개발되지 않은 주요 기능

- CSV 다운로드
- 기간 필터
- 관리자 로그아웃
- 로그인 실패 rate limit
- 공유 유입 추적
- 방문 수 대비 완료율
- 중간 이탈률 추적
- 콘텐츠 버전 관리
- 버전별 통계 필터
- 복합형 결과 콘텐츠
- 문서와 `src/data/test.ts` 동기화 검증 스크립트
- 결과 이미지 저장 또는 공유 이미지 생성
- 접근성 점검 및 개선

## 5. 향후 개발 계획

### 1단계: 운영 안정성 강화

목표: 통계 데이터 신뢰도와 배포 안정성을 먼저 확보합니다.

작업:

- `/api/submissions`에서 질문-선택지 관계 검증 추가
- 중복 질문 답변 차단
- 서버 측 점수 재계산 추가
- 서버 계산 결과와 클라이언트 제출 결과 불일치 시 400 응답
- `.env.example`에 `NEXT_PUBLIC_GA_ID` 추가
- Supabase/배포 설정 문서 추가
- `npm run build` 기준 빌드 검증
- Next.js 15에서 `npm run lint` 동작 여부 확인 후 스크립트 정리

완료 기준:

- 조작된 `answers`, `scores`, `primaryPersona` 제출이 저장되지 않습니다.
- 새 운영자가 `.env.example`과 배포 문서만 보고 환경을 구성할 수 있습니다.
- 빌드가 통과합니다.

### 2단계: 공유 경험 개선

목표: 모바일 사용자가 결과를 자연스럽게 공유할 수 있게 합니다.

작업:

- `navigator.share` 우선 공유 구현
- 미지원/실패 시 클립보드 fallback 유지
- `alert()`를 토스트 UI로 교체
- 공유 버튼 문구와 결과 공유 메시지 정리
- 공유 링크 유입 경로 기록 방식 설계

완료 기준:

- 모바일 브라우저에서 네이티브 공유 시트가 열립니다.
- 데스크톱이나 미지원 브라우저에서는 복사 완료 토스트가 표시됩니다.
- 공유 실패가 사용자 흐름을 깨지 않습니다.

### 3단계: UI 구조와 접근성 개선

목표: 기능 확장 전에 UI 책임을 나누고 기본 접근성을 높입니다.

작업:

- `src/app/page.tsx`를 화면 단위 컴포넌트로 분리
- 결과 화면의 `ScoreChart`, `SharePanel`, `InsightCard` 분리
- 버튼 focus 스타일 점검
- 키보드만으로 테스트 시작, 선택, 이전, 공유 가능 여부 확인
- 긴 텍스트가 모바일에서 잘리지 않는지 확인
- 캐릭터 이미지와 OG 이미지 alt 문구 점검

완료 기준:

- 메인 페이지의 상태 관리와 화면 렌더링 책임이 분리됩니다.
- 핵심 플로우를 키보드로 완료할 수 있습니다.
- 주요 모바일 폭에서 텍스트 겹침이 없습니다.

### 4단계: 관리자 통계 고도화

목표: 운영자가 캠페인 성과와 콘텐츠 품질을 판단할 수 있게 합니다.

작업:

- 최근 7일, 최근 30일, 전체 기간 필터
- 사용자 지정 날짜 범위
- CSV 다운로드
- 방문 대비 완료율
- 유형별 비율
- 일자별 방문 수와 완료 수 비교
- 관리자 로그아웃
- 세션 만료 안내

완료 기준:

- 관리자가 기간별 완료 수와 유형 분포를 확인할 수 있습니다.
- 통계 데이터를 CSV로 내려받을 수 있습니다.
- 관리자 세션 종료 흐름이 명확합니다.

### 5단계: 콘텐츠 운영 체계화

목표: 질문과 결과 문구가 바뀌어도 통계 해석이 가능하게 합니다.

작업:

- `contentVersion` 상수 추가
- 제출 저장 시 `contentVersion` 포함
- 관리자 통계에서 버전별 필터 제공
- `docs/CONTENT_REVIEW.md`와 `src/data/test.ts`의 불일치 검증 스크립트 추가
- 교파 추천 문구 검수 체크리스트 추가
- 자주 나오는 상위 2개 유형 조합 기반 복합형 결과 콘텐츠 설계

완료 기준:

- 콘텐츠 변경 전후 통계를 분리해서 볼 수 있습니다.
- 문서와 실제 데이터 불일치를 자동으로 발견할 수 있습니다.
- 결과 콘텐츠 확장 작업이 관리 가능한 단위로 나뉩니다.

## 6. 추천 우선순위

가장 먼저 진행할 작업은 다음 순서가 좋습니다.

1. 제출 검증 강화 및 서버 측 점수 재계산
2. `.env.example`와 배포 문서 정리
3. `navigator.share` 기반 공유 개선
4. `alert()` 제거 및 토스트 도입
5. 점수 계산/제출 검증 단위 테스트 추가

이 순서는 사용자에게 보이는 완성도보다 먼저 데이터 신뢰도와 운영 안정성을 잡는 흐름입니다. 현재 앱은 이미 MVP 사용 흐름이 갖춰져 있으므로, 다음 개발은 새 기능을 많이 붙이기보다 신뢰성과 공유성을 높이는 쪽이 효과적입니다.

## 7. 검증 결과

문서 작성 후 `npm run build`를 실행했고, Next.js 프로덕션 빌드가 성공했습니다.

확인된 생성 경로:

- `/`
- `/admin/stats`
- `/result`
- `/result/[type]`
- `/sitemap.xml`
- `/api/admin/login`
- `/api/admin/stats`
- `/api/submissions`
- `/api/visits`

추가로 `npm run lint`를 실행했으나, 현재 스크립트가 `next lint`를 사용하고 있어 Next.js의 ESLint 설정 마이그레이션 프롬프트에서 종료되었습니다. 이는 확인된 코드 린트 오류라기보다 린트 스크립트 구성 이슈이므로, 1단계 계획의 `Next.js 15 기준 lint 스크립트 점검` 항목에서 처리합니다.
