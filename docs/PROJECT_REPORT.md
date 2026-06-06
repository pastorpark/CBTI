# CBTI 프로젝트 현황 및 구조 리포트

작성일: 2026-05-07

## 1. 프로젝트 개요

이 프로젝트는 `CBTI (Christian Belief Type Indicator)`라는 이름의 모바일 웹 기반 신앙 성향 테스트 서비스입니다. 사용자는 15개 질문에 답하고, 선택지별 가중치에 따라 7개 신앙 유형 중 대표 유형을 확인합니다. 결과 화면에서는 유형 설명, 키워드, 영적 강점, 성장 루틴, 추천 교파 Top 3, 점수 분포, 공유 링크를 제공합니다.

현재 코드는 단순한 정적 테스트 앱을 넘어 익명 제출 통계, 방문 기록, 관리자 통계 페이지까지 포함한 MVP 후반 단계에 가깝습니다.

## 2. 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| 프레임워크 | Next.js 15 App Router |
| UI | React 19, TypeScript, 전역 CSS |
| 데이터 | 정적 TypeScript 데이터 파일 |
| API | Next.js Route Handlers |
| 저장소 | Supabase REST API 연동 |
| 인증 | 환경변수 기반 관리자 비밀번호, 서명 쿠키 |
| 메타데이터 | Next.js Metadata API, Open Graph, Twitter Card, JSON-LD |

참고로 개발 계획서에는 Tailwind CSS, Framer Motion, lucide-react 등이 권장 기술로 적혀 있지만 현재 `package.json`에는 포함되어 있지 않고, 실제 스타일은 `src/app/globals.css`의 전역 CSS로 구현되어 있습니다.

## 3. 주요 구현 현황

### 사용자 테스트 플로우

- `/`에서 인트로, 질문, 분석 로딩, 결과 화면을 단일 클라이언트 컴포넌트로 처리합니다.
- 질문과 선택지는 매 테스트 시작 시 무작위로 섞입니다.
- 선택 즉시 다음 질문으로 이동하며, 이전 질문으로 돌아갈 수 있습니다.
- 마지막 답변 이후 약 950ms 동안 분석 화면을 보여준 뒤 결과 화면으로 전환합니다.
- 결과 도달 시 1회 제출 기록을 `/api/submissions`로 전송합니다.
- 최초 접속 시 방문 기록을 `/api/visits`로 전송합니다.

### 결과 및 공유

- 결과 URL은 `/result/{type}` 형식입니다.
- 기존 쿼리 방식 `/result?type=Orthodox`는 `/result/Orthodox`로 리다이렉트됩니다.
- `/result/[type]` 페이지는 정적 파라미터를 생성하고 유형별 메타데이터와 OG 이미지를 제공합니다.
- 잘못된 유형으로 접근하면 오류 화면과 테스트 시작 링크를 보여줍니다.

### 관리자 통계

- `/admin/stats`에서 관리자 비밀번호 로그인 후 통계를 확인합니다.
- 전체 접속, 고유 접속자, 전체 완료, 중복 제거 방문자, 중복 의심 비율을 표시합니다.
- 유형별 결과 분포, 일자별 완료 수, 문항별 선택지 분포를 제공합니다.
- 중복 제거 기준과 전체 기준을 토글할 수 있습니다.
- 중복 제거는 방문자 해시 기준으로 수행되며, 같은 브라우저의 반복 테스트를 완화하는 수준입니다.

## 4. 디렉터리 구조

```text
CBTI/
  package.json
  package-lock.json
  tsconfig.json
  next.config.ts
  .env.example
  DEVELOPMENT_PLAN.md
  CONTENT_REVIEW.md
  protoplan.md
  PROJECT_REPORT.md
  public/
    characters/
      charismatic.svg
      intellectual.svg
      liturgical.svg
      orthodox.svg
      progressive.svg
      relational.svg
      social.svg
    og/
      default.png
      result-*.png
    robots.txt
  src/
    app/
      page.tsx
      layout.tsx
      globals.css
      result/
        page.tsx
        [type]/
          page.tsx
      admin/
        stats/
          page.tsx
      api/
        submissions/
          route.ts
        visits/
          route.ts
        admin/
          login/
            route.ts
          stats/
            route.ts
    data/
      test.ts
    lib/
      admin-auth.ts
      crypto.ts
      result-url.ts
      scoring.ts
      submissions.ts
      supabase-rest.ts
      visitor.ts
      visits.ts
    types/
      test.ts
  supabase/
    schema.sql
```

현재 `src` 아래에는 20개 파일이 있고, `public` 아래에는 캐릭터 SVG와 OG 이미지 등 16개 파일이 있습니다. 프로젝트 전체 크기는 약 1.2MB이며, `node_modules`는 설치되어 있지 않습니다.

## 5. 핵심 파일 설명

| 파일 | 역할 |
| --- | --- |
| `src/app/page.tsx` | 메인 테스트 앱. 단계 상태, 질문 진행, 점수 계산, 결과 표시, 제출/방문 전송 처리 |
| `src/data/test.ts` | 7개 유형, 15개 질문, 선택지별 점수, 결과 콘텐츠, 추천 교파 데이터 |
| `src/types/test.ts` | Persona, Question, Answer, Score, Result 타입 정의 |
| `src/lib/scoring.ts` | 점수 초기화, 선택지 탐색, 점수 계산, 대표 유형 결정, 근접 유형 계산 |
| `src/lib/result-url.ts` | 환경변수 또는 현재 origin 기반 결과 공유 URL 생성 |
| `src/lib/visitor.ts` | localStorage 기반 익명 방문자 ID 생성 |
| `src/lib/submissions.ts` | 클라이언트에서 제출 API 호출 |
| `src/lib/visits.ts` | 클라이언트에서 방문 API 호출 |
| `src/lib/supabase-rest.ts` | Supabase REST API로 제출/방문 저장 및 조회 |
| `src/lib/admin-auth.ts` | 관리자 세션 쿠키 생성 및 검증 |
| `src/app/api/submissions/route.ts` | 테스트 완료 데이터 검증, visitorId/userAgent 해시화, Supabase 저장 |
| `src/app/api/visits/route.ts` | 방문 데이터 검증, 해시화, Supabase 저장 |
| `src/app/api/admin/login/route.ts` | 관리자 비밀번호 검증 및 HttpOnly 쿠키 발급 |
| `src/app/api/admin/stats/route.ts` | Supabase 데이터 조회 및 통계 집계 |
| `src/app/admin/stats/page.tsx` | 관리자 통계 UI |
| `supabase/schema.sql` | `test_submissions`, `site_visits` 테이블과 인덱스 정의 |

## 6. 데이터 모델과 점수 체계

유형은 총 7개입니다.

- `Orthodox`: 정통 수호형
- `Intellectual`: 합리적 지성형
- `Progressive`: 진보적 포용형
- `Social`: 사회 참여형
- `Liturgical`: 예전 전통형
- `Charismatic`: 영적 체험형
- `Relational`: 관계 중심형

각 선택지는 `scores: { persona, weight }[]` 구조를 가지므로 하나의 선택지가 여러 유형에 가중치를 줄 수 있습니다. 실제로 Q15의 세 번째 선택지는 `Progressive`와 `Social`에 각각 1점씩 부여합니다.

대표 유형 결정 방식은 다음과 같습니다.

1. 모든 유형 점수를 0으로 초기화합니다.
2. 사용자의 답변에 해당하는 선택지를 찾아 가중치를 누적합니다.
3. 가장 높은 점수의 유형을 대표 유형으로 선택합니다.
4. 동점일 경우 `Orthodox`, `Intellectual`, `Progressive`, `Social`, `Liturgical`, `Charismatic`, `Relational` 순서로 우선순위를 적용합니다.
5. 대표 유형과 1점 이내 차이인 다른 유형은 최대 2개까지 보조 성향으로 표시합니다.

## 7. API 및 저장 흐름

### 제출 저장

`/api/submissions`는 다음 데이터를 받습니다.

- `visitorId`
- `primaryPersona`
- `scores`
- `answers`

서버에서는 질문 수, 질문 ID, 선택지 ID, 대표 유형을 검증합니다. Supabase 설정이 없으면 저장을 건너뛰고 성공 응답을 반환합니다. 설정이 있으면 `VISITOR_HASH_SALT`로 방문자 ID와 user-agent를 HMAC SHA-256 해시 처리한 뒤 `test_submissions` 테이블에 저장합니다.

### 방문 저장

`/api/visits`는 `visitorId`와 `path`를 받아 같은 방식으로 해시 처리한 뒤 `site_visits` 테이블에 저장합니다. 방문 저장 실패는 사용자 경험을 막지 않도록 성공 형태의 응답으로 완화됩니다.

### 관리자 통계

`/api/admin/stats`는 관리자 세션 쿠키가 없으면 401을 반환합니다. 인증된 경우 Supabase에서 최근 제출 최대 5,000건, 방문 최대 10,000건을 가져와 다음 통계를 계산합니다.

- 전체 완료 수
- 방문자 해시 기준 중복 제거 완료 수
- 중복 의심 비율
- 유형별 결과 분포
- 일자별 완료 수
- 문항별 선택지 선택 수
- 전체 접속과 고유 접속자

## 8. 환경변수

`.env.example`에 정의된 변수는 다음과 같습니다.

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_STATS_PASSWORD=
VISITOR_HASH_SALT=
ADMIN_SESSION_SECRET=
```

추가로 `layout.tsx`에서는 `NEXT_PUBLIC_GA_ID`가 있을 때 Google Analytics를 로드합니다. 이 변수는 현재 `.env.example`에 포함되어 있지 않으므로 운영 설정 문서에 추가하는 것이 좋습니다.

## 9. Supabase 스키마

`supabase/schema.sql`은 두 개의 테이블을 정의합니다.

### `test_submissions`

- 테스트 완료 이벤트 저장
- `visitor_hash`, `primary_persona`, `scores`, `answers`, `user_agent_hash`, `created_at` 포함
- 생성 시각, 대표 유형, 방문자 해시에 인덱스 적용

### `site_visits`

- 사이트 방문 이벤트 저장
- `visitor_hash`, `path`, `user_agent_hash`, `created_at` 포함
- 생성 시각, 방문자 해시에 인덱스 적용

## 10. 문서 현황

- `DEVELOPMENT_PLAN.md`: 초기 개발 목표, 추천 기술스택, MVP 범위, 통계 기능 설계, 디렉터리 구조 제안이 정리되어 있습니다.
- `CONTENT_REVIEW.md`: 화면 문구, 질문/보기, 유형 라벨, 결과 콘텐츠를 검토용으로 모아둔 문서입니다.
- `protoplan.md`: 초기 기획 문서로 보입니다.
- `PROJECT_REPORT.md`: 현재 코드 기준 현황 리포트입니다.

## 11. 현재 상태 요약

완료된 것으로 보이는 항목:

- 15문항 테스트 진행
- 7개 유형 점수 계산
- 결과 화면 및 공유 URL
- 유형별 결과 페이지와 OG 메타데이터
- 캐릭터 SVG 및 OG 이미지 에셋
- Supabase 기반 익명 제출 저장
- 방문 기록 저장
- 관리자 로그인과 통계 페이지
- Supabase 테이블 스키마
- 콘텐츠 검토 문서

부분적으로 남은 것으로 보이는 항목:

- `navigator.share` 기반 네이티브 공유는 개발 계획에 있으나 현재 구현은 URL 복사 중심입니다.
- CSV 다운로드는 개발 계획에서 2차 기능으로 분류되어 있고 현재 구현되어 있지 않습니다.
- `components/` 디렉터리 분리는 계획에 있으나 현재는 주요 UI가 `page.tsx`와 관리자 페이지에 직접 구현되어 있습니다.
- `.env.example`에 `NEXT_PUBLIC_GA_ID`가 빠져 있습니다.
- `package.json`의 `lint` 스크립트가 `next lint`인데, Next.js 15 환경에서는 동작 여부 확인이 필요합니다.

## 12. 리스크 및 개선 제안

1. 의존성 미설치 상태
   - 현재 로컬 프로젝트에 `node_modules`가 없습니다. 빌드와 타입 검사는 의존성 설치 후 확인해야 합니다.

2. 제출 검증의 엄격도
   - `/api/submissions`는 답변 수와 ID 존재 여부를 검증하지만, 각 질문에 속한 선택지인지까지는 엄격히 검증하지 않습니다. 예를 들어 `q1`에 `q2-o1`이 매칭되는 형태를 추가로 막을 수 있습니다.

3. 관리자 인증 정책
   - 환경변수 기반 비밀번호와 서명 쿠키는 MVP에는 충분하지만, 운영자가 늘거나 민감한 통계가 많아지면 Supabase Auth, Vercel Deployment Protection, 접근 로그 등을 검토하는 것이 좋습니다.

4. 통계 조회 한계
   - 제출은 최대 5,000건, 방문은 최대 10,000건만 조회합니다. 서비스 사용량이 늘면 기간 필터, 페이지네이션, DB 집계 함수 또는 materialized view가 필요할 수 있습니다.

5. UI 컴포넌트 구조
   - 현재 메인 페이지가 많은 책임을 가지고 있습니다. 기능 확장 전 `IntroScreen`, `QuestionScreen`, `ResultScreen`, `ProgressBar`, `SharePanel` 등으로 나누면 유지보수가 쉬워집니다.

6. 운영 환경변수 정리
   - `NEXT_PUBLIC_GA_ID`를 `.env.example`에 추가하고, `NEXT_PUBLIC_SITE_URL`과 `layout.tsx`의 하드코딩된 `siteUrl` 사이의 관계를 명확히 하면 배포 환경 변경에 강해집니다.

7. 공유 경험
   - 모바일 사용자 비중이 높다면 `navigator.share`를 우선 사용하고 실패 시 클립보드 복사로 fallback하는 흐름이 더 자연스럽습니다.

## 13. 검증 메모

이번 리포트 작성 과정에서는 파일 구조와 소스 코드를 정적으로 분석했습니다. `node_modules`가 설치되어 있지 않아 `npm run build`, 타입 검사, 실제 런타임 테스트는 수행하지 않았습니다.
