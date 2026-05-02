# My Spiritual Home 개발 계획

## 1. 개발 목표

`protoplan.md`의 기획을 바탕으로, 모바일 웹에 최적화된 신앙 유형 테스트 서비스를 구현한다. 사용자는 15개 문항에 답하고, 선택지별 가중치에 따라 7개 신앙 유형 중 주 유형을 확인하며, 해당 유형의 설명과 추천 교파 Top 3를 공유할 수 있다.

## 2. 권장 기술스택

### 프론트엔드

- **Next.js 15 + React + TypeScript**
  - 결과 공유 시 URL 기반 결과 페이지를 만들기 쉽다.
  - 향후 SEO, OG 이미지, 서버 기능 확장에 유리하다.
- **Tailwind CSS**
  - 모바일 우선 UI를 빠르게 구성할 수 있다.
  - 테스트형 서비스의 카드, 버튼, 진행률 바, 결과 화면 스타일링에 적합하다.
- **Framer Motion**
  - 문항 전환, 로딩, 결과 등장 애니메이션을 자연스럽게 구현한다.
- **lucide-react**
  - 공유, 다시 하기, 진행 상태 등 UI 아이콘을 일관되게 제공한다.

### 상태 및 데이터

- **React state / Context**
  - MVP에서는 문항 진행 상태와 답변 배열만 있으면 충분하다.
  - 외부 상태관리 라이브러리는 초기에는 불필요하다.
- **정적 TypeScript 데이터 파일**
  - 질문, 선택지, 유형, 결과 콘텐츠를 `src/data/test.ts`에 구조화한다.
  - 추후 CMS나 DB로 이전할 수 있도록 데이터 스키마를 명확히 둔다.

### 백엔드

- **MVP: 백엔드 없음**
  - 점수 계산은 클라이언트에서 수행한다.
  - 개인정보를 수집하지 않으므로 서버 저장소가 필요 없다.
- **통계 포함 MVP: Next.js Route Handlers + Supabase**
  - 테스트 완료 이벤트만 익명으로 저장한다.
  - 관리자 통계 페이지는 서버 API를 통해 집계된 데이터만 조회한다.
  - 직접 PostgreSQL을 운영하지 않고 Supabase 무료 플랜으로 시작할 수 있다.
- **확장 시: Supabase Auth / 관리자 CMS**
  - 운영자가 여러 명이 되거나 콘텐츠 수정 기능이 필요할 때 추가한다.

### 배포

- **Vercel**
  - Next.js와 궁합이 좋고 미리보기 배포가 쉽다.
- **도메인 연결**
  - 추후 `myspiritualhome.kr` 같은 독립 도메인을 연결한다.

## 3. 핵심 구현 범위

### MVP 필수 기능

1. 인트로 화면
   - 서비스명, 짧은 소개, 테스트 시작 버튼
   - 모바일 첫 화면에서 바로 시작 가능해야 한다.

2. 질문 진행 화면
   - 15개 문항 순차 노출
   - 진행률 바
   - `현재 문항 / 전체 문항` 표시
   - 선택지 5개 버튼
   - 선택 즉시 다음 문항으로 이동
   - 이전 문항으로 돌아가기 기능

3. 점수 계산
   - 선택지의 `scores` 값을 누적한다.
   - 기본은 유형별 +1이다.
   - Q15의 3번 선택지는 `Progressive`, `Social`에 각각 +1을 준다.
   - 추후 가중치 조정을 위해 배열 기반 점수 구조를 사용한다.

4. 로딩 화면
   - 마지막 답변 이후 1~2초 정도 분석 화면 노출
   - 짧은 문구와 애니메이션 적용

5. 결과 화면
   - 1순위 신앙 유형 표시
   - 키워드, 상세 설명
   - 추천 교파 Top 3
   - 유형별 점수 분포 간단 표시
   - URL 복사 공유
   - 다시 하기

6. 공유
   - `navigator.share` 지원 기기에서는 네이티브 공유
   - 미지원 환경에서는 URL 복사
   - 결과 URL은 `?type=Orthodox`처럼 유형 키를 쿼리로 전달한다.

### 통계 기능 추가 범위

통계는 처음부터 붙여도 되지만, 핵심 테스트 경험보다 복잡도가 올라가므로 **간단한 익명 이벤트 저장 방식**으로 제한한다.

1. 테스트 완료 기록 저장
   - 사용자가 결과 화면에 도달했을 때 1회 저장한다.
   - 저장 항목은 결과 유형, 전체 점수, 선택한 옵션 ID 목록, 익명 방문자 ID, 생성 시각 정도로 제한한다.
   - 이름, 이메일, 전화번호, 정확한 위치 같은 개인정보는 저장하지 않는다.

2. 관리자 통계 페이지
   - `/admin/stats` 경로에 만든다.
   - 유형별 결과 분포
   - 일자별 완료 수
   - 문항별 선택지 분포
   - 중복 포함/중복 제거 토글
   - CSV 다운로드는 2차 기능으로 둔다.

3. 관리자 접근 제한
   - 가장 간단한 방식은 환경변수 기반 관리자 비밀번호를 사용한다.
   - `/admin` 진입 시 비밀번호를 입력하고, 성공하면 HttpOnly 쿠키를 발급한다.
   - 더 안전한 운영이 필요해지면 Supabase Auth 또는 Vercel Deployment Protection으로 교체한다.

4. 반복 응답 필터링
   - 완벽한 개인 식별은 하지 않고, 같은 브라우저/기기에서 반복 완료한 기록을 완화한다.
   - 최초 방문 시 `localStorage`에 랜덤 `visitorId`를 생성한다.
   - 서버에는 원본 `visitorId` 대신 해시값만 저장한다.
   - 통계 화면에서는 `전체 완료 수`와 `방문자 기준 중복 제거 완료 수`를 함께 보여준다.
   - 같은 사람이 다른 브라우저, 다른 기기, 시크릿 모드로 반복하면 완전히 막을 수 없다는 한계를 관리자 화면에 명시한다.

## 4. 추천 디렉터리 구조

```text
src/
  app/
    admin/
      stats/
        page.tsx
    api/
      admin/
        login/
          route.ts
        stats/
          route.ts
      submissions/
        route.ts
    page.tsx
    result/
      page.tsx
    layout.tsx
    globals.css
  components/
    IntroScreen.tsx
    QuestionScreen.tsx
    LoadingScreen.tsx
    ResultScreen.tsx
    ProgressBar.tsx
    OptionButton.tsx
    ShareButtons.tsx
  data/
    test.ts
  lib/
    admin-auth.ts
    scoring.ts
    submissions.ts
    result-url.ts
    supabase.ts
  types/
    test.ts
```

## 5. 데이터 모델 설계

```ts
export type PersonaKey =
  | "Orthodox"
  | "Intellectual"
  | "Progressive"
  | "Social"
  | "Liturgical"
  | "Charismatic"
  | "Relational";

export type WeightedScore = {
  persona: PersonaKey;
  weight: number;
};

export type QuestionOption = {
  id: string;
  label: string;
  scores: WeightedScore[];
};

export type Question = {
  id: string;
  title: string;
  options: QuestionOption[];
};

export type PersonaResult = {
  key: PersonaKey;
  title: string;
  subtitle: string;
  keywords: string[];
  description: string;
  denominations: {
    name: string;
    description: string;
  }[];
};

export type TestSubmission = {
  id: string;
  visitorHash: string;
  primaryPersona: PersonaKey;
  scores: Record<PersonaKey, number>;
  answers: {
    questionId: string;
    optionId: string;
  }[];
  userAgentHash?: string;
  createdAt: string;
};
```

이 구조를 쓰면 모든 선택지가 단일 유형뿐 아니라 복수 유형과 가중치를 가질 수 있다. Q15의 3번 선택지는 다음처럼 표현한다.

```ts
{
  id: "q15-o3",
  label: "교회가 시대의 아픔이나 사회적 약자를 외면하고 차별할 때",
  scores: [
    { persona: "Progressive", weight: 1 },
    { persona: "Social", weight: 1 }
  ]
}
```

## 6. 점수 계산 로직

### 기본 알고리즘

1. 7개 유형 점수를 0으로 초기화한다.
2. 사용자가 선택한 옵션들의 `scores` 배열을 순회한다.
3. 각 `persona`에 `weight`를 누적한다.
4. 가장 높은 점수의 유형을 결과로 선택한다.
5. 동점이면 사전에 정의한 우선순위 또는 보조 기준을 적용한다.

### 동점 처리 제안

MVP에서는 무작위보다 **고정 우선순위 + 보조 유형 노출**이 낫다. 사용자가 같은 답변을 했는데 결과가 매번 달라지면 신뢰도가 떨어질 수 있기 때문이다.

추천 방식:

- 메인 유형: 동점 유형 중 `tieBreakerOrder` 기준 첫 번째
- 보조 문구: "당신은 Social 성향도 강하게 나타났어요."처럼 동점 또는 1점 차 유형을 함께 표시

```ts
const tieBreakerOrder: PersonaKey[] = [
  "Orthodox",
  "Intellectual",
  "Progressive",
  "Social",
  "Liturgical",
  "Charismatic",
  "Relational"
];
```

## 7. 통계 저장 및 관리자 페이지 설계

### Supabase 테이블

테이블은 처음에는 하나만 둔다.

```sql
create table test_submissions (
  id uuid primary key default gen_random_uuid(),
  visitor_hash text not null,
  primary_persona text not null,
  scores jsonb not null,
  answers jsonb not null,
  user_agent_hash text,
  created_at timestamptz not null default now()
);

create index test_submissions_created_at_idx on test_submissions (created_at);
create index test_submissions_primary_persona_idx on test_submissions (primary_persona);
create index test_submissions_visitor_hash_idx on test_submissions (visitor_hash);
```

### 제출 API

`POST /api/submissions`

- 결과 화면 진입 시 호출한다.
- 요청 본문에는 `visitorId`, `primaryPersona`, `scores`, `answers`를 담는다.
- 서버에서 `visitorId`를 `VISITOR_HASH_SALT`와 함께 해시한 뒤 저장한다.
- 같은 `visitorHash`가 짧은 시간 안에 같은 답변을 여러 번 보내면 중복 저장을 막거나 `is_duplicate` 컬럼을 추가할 수 있다.

MVP에서는 데이터를 잃지 않는 쪽이 낫기 때문에 **저장은 모두 하되, 관리자 통계에서 중복 제거 집계를 제공**하는 방식을 추천한다.

### 관리자 인증

`POST /api/admin/login`

- 환경변수 `ADMIN_STATS_PASSWORD`와 입력값을 비교한다.
- 성공 시 `admin_stats_session` HttpOnly 쿠키를 발급한다.
- 쿠키에는 서명된 짧은 토큰을 넣고 만료 시간은 12~24시간으로 둔다.

`GET /api/admin/stats`

- 관리자 쿠키가 있을 때만 집계 결과를 반환한다.
- 원본 제출 목록 전체를 내려주기보다 집계된 값만 내려준다.

### 관리자 화면 지표

`/admin/stats`에서 우선 제공할 지표:

- 총 테스트 완료 수
- 중복 제거 방문자 수
- 유형별 결과 비율
- 최근 7일/30일 완료 추이
- 문항별 선택지 선택률
- 평균 점수 분포
- 중복 의심 비율

중복 제거 기준:

- 기본: `visitorHash`별 가장 최근 또는 최초 제출 1건만 집계
- 선택 옵션: 전체 제출 기준으로 보기
- 보조 기준: 같은 `visitorHash + answers` 조합이 반복되면 같은 결과 재확인으로 분류

### 개인정보와 한계

- IP 주소는 저장하지 않는 것을 기본값으로 한다.
- User-Agent도 원문 저장 대신 해시만 저장하거나 아예 저장하지 않는다.
- `visitorId`는 브라우저 저장소 기반이므로 쿠키/스토리지 삭제, 다른 기기, 시크릿 모드까지 필터링할 수는 없다.
- 이 방식은 "동일 사용자를 완벽히 식별"하기보다 "같은 브라우저의 반복 테스트 영향을 줄이는" 목적에 적합하다.

## 8. 화면별 구현 방법

### Intro

- 모바일 기준 390px 폭에서 가장 먼저 검증한다.
- 첫 화면에는 제목, 짧은 설명, 시작 버튼만 둔다.
- 배경은 차분하지만 종교 서비스 특유의 무거움은 줄인다.

### QnA

- 선택지는 버튼형 리스트로 구성한다.
- 각 버튼은 최소 높이 56px 이상으로 터치하기 쉽게 만든다.
- 선택 시 현재 답변을 저장하고 다음 질문으로 이동한다.
- 마지막 질문에서는 로딩 화면으로 전환한다.
- 뒤로가기 버튼을 제공해 이전 답변 수정이 가능하게 한다.

### Loading

- 실제 서버 분석은 없지만 체감상 결과가 계산되는 느낌을 준다.
- 1200ms 정도 후 결과 화면으로 이동한다.

### Result

- `result?type=Relational` 같은 URL로 직접 접근 가능하게 만든다.
- 직접 접근 시 쿼리의 유형 키를 검증한다.
- 잘못된 유형이면 홈으로 안내한다.
- 추천 교파는 순위형 리스트로 보여준다.
- 공유 버튼과 다시 하기 버튼은 화면 하단에 고정하지 않고 콘텐츠 아래에 둔다.

## 9. 스타일 방향

- 모바일 우선, 데스크톱에서는 중앙 정렬된 최대 폭 480~560px 레이아웃
- 과도한 교회 이미지보다 신뢰감 있는 테스트 UI 중심
- 컬러는 한 가지 색상만 반복하지 않고, 차분한 아이보리/딥그린/골드/잉크 계열을 균형 있게 사용
- 선택 버튼은 충분한 대비와 눌림 상태를 제공
- 결과 유형별로 작은 포인트 컬러 또는 아이콘을 다르게 부여

## 10. 개발 단계

### 1단계: 프로젝트 세팅

- Next.js + TypeScript + Tailwind 프로젝트 생성
- ESLint/Prettier 설정
- 기본 라우팅과 글로벌 스타일 구성

### 2단계: 데이터 이관

- `protoplan.md`의 15개 문항을 `src/data/test.ts`로 구조화
- 7개 결과 콘텐츠를 같은 파일 또는 `src/data/results.ts`로 분리
- 타입 검사를 통해 누락된 유형/문항이 없도록 확인

### 3단계: 점수 계산 모듈

- `calculateScores(answers)`
- `resolvePrimaryPersona(scores)`
- `getClosePersonas(scores)`
- 단위 테스트 작성

### 4단계: 테스트 플로우 UI

- Intro, QnA, Loading, Result 컴포넌트 구현
- 답변 상태와 진행 상태 연결
- 애니메이션 적용

### 5단계: 공유와 결과 URL

- 결과 유형을 URL 쿼리로 반영
- URL 복사 및 네이티브 공유 구현
- OG 메타데이터는 기본 공통 이미지로 우선 적용

### 6단계: 통계 저장

- Supabase 프로젝트 생성
- `test_submissions` 테이블 생성
- `POST /api/submissions` 구현
- 결과 화면에서 테스트 완료 이벤트 저장
- 방문자 ID 생성 및 해시 저장 적용

### 7단계: 관리자 통계 페이지

- `/admin/stats` 화면 구현
- 환경변수 기반 관리자 로그인 구현
- 유형별/일자별/문항별 집계 API 구현
- 중복 포함/중복 제거 토글 구현

### 8단계: QA

- 모바일/데스크톱 반응형 확인
- 모든 문항 선택 가능 여부 확인
- Q15 복수 가중치 확인
- 동점 케이스 확인
- 잘못된 결과 URL 접근 확인
- 테스트 완료 기록 저장 확인
- 관리자 비밀번호 없이 통계 접근 불가 확인
- 중복 제거 집계 확인

### 9단계: 배포

- Vercel 배포
- Supabase 환경변수 설정
- `ADMIN_STATS_PASSWORD`, `VISITOR_HASH_SALT` 설정
- 배포 URL에서 실제 모바일 브라우저 테스트
- 공유 미리보기 점검

## 11. 테스트 전략

### 단위 테스트

- 모든 선택지 점수 누적
- Q15 복수 점수 반영
- 동점 처리
- 잘못된 답변 ID 처리
- 제출 API 입력값 검증
- 관리자 인증 쿠키 검증
- 중복 제거 집계

### 수동 QA

- 15개 질문 완료 후 결과가 나온다.
- 뒤로가기로 답변 수정 시 결과가 바뀐다.
- 새로고침 후 비정상 상태가 깨지지 않는다.
- 결과 URL 공유 후 직접 진입이 가능하다.
- 모바일에서 버튼 텍스트가 넘치지 않는다.
- 결과 화면 진입 시 제출 기록이 1회 저장된다.
- 같은 브라우저에서 여러 번 테스트했을 때 중복 제거 통계가 작동한다.
- `/admin/stats`는 관리자 인증 후에만 볼 수 있다.

## 12. 향후 확장 아이디어

- 유형별 OG 이미지 자동 생성
- 결과 상세에 "잘 맞는 예배 스타일", "주의할 균형점" 추가
- 관리자 페이지에서 문항/결과 콘텐츠 수정
- 익명 통계 수집
- 관리자 통계 CSV 다운로드
- 유입 경로별 결과 분석
- 지역 기반 교회 추천
- 카카오톡 공유 템플릿 연동

## 13. 우선 구현 결론

첫 구현은 **Next.js 웹앱 + 클라이언트 점수 계산 + Supabase 익명 제출 저장 + 관리자 통계 페이지** 방식이 가장 적합하다. 통계를 전혀 보지 않아도 된다면 백엔드 없는 정적 웹앱으로 시작할 수 있지만, 실제 사용자의 결과 분포를 분석하고 싶다면 Supabase 테이블 하나를 붙이는 편이 구현 대비 효용이 크다.

반복 테스트 필터링은 개인정보 수집 없이 완벽하게 해결하기 어렵다. 따라서 `visitorId` 기반 해시로 같은 브라우저의 반복 응답을 줄이고, 관리자 화면에서 `전체 기준`과 `중복 제거 기준`을 함께 보여주는 방식이 가장 단순하고 현실적이다.
