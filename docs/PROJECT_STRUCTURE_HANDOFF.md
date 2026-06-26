# Project Structure Handoff

이 문서는 다른 AI 에이전트나 개발자가 현재 프로젝트를 이어받을 때 구조와 규칙을 빠르게 이해하도록 작성한 핸드오프 문서다.

## 프로젝트 개요

이 앱은 Next.js App Router 기반의 신앙 유형 테스트 서비스다. 하나의 코드베이스와 하나의 Supabase 백엔드를 공유하면서, 접속 도메인에 따라 `pastor` 버전과 `ivf` 버전을 구분한다.

현재 지원하는 설문은 두 가지다.

- `cbti`: CBTI 신앙 유형 검사
- `nutri`: 영적 영양상태 분석

과거에는 영적 영양상태 설문 id와 결과 URL에 `additional`, `carb`를 사용했다. 현재 공식 id는 `nutri`이며, 기존 데이터와 공유 링크 호환을 위해 `additional`과 `carb`는 legacy alias로만 남아 있다.

## 실행 명령

```bash
npm run dev
npm run build
./node_modules/.bin/tsc --noEmit --incremental false
```

주의: `next/font`가 Google Fonts를 fetch하므로 네트워크가 제한된 환경에서는 `npm run build`가 `fonts.googleapis.com` 접근 실패로 중단될 수 있다. 코드 타입 검증은 `tsc --noEmit --incremental false`로 확인할 수 있다.

## 로컬 접속

- Pastor 버전: `http://localhost:3000`
- IVF 버전: `http://ivf.localhost:3000`

`ivf.localhost`가 동작하지 않는 환경에서는 hosts 파일에 아래를 추가한다.

```txt
127.0.0.1 ivf.localhost
```

## 도메인과 Variant

Variant 판별은 `src/app/page.tsx`에서 서버의 `Host` 헤더를 읽어 시작한다.

- `src/app/page.tsx`: 서버 컴포넌트 wrapper. `resolveSiteVariantId()`로 variant를 판별하고 `HomeClient`에 전달한다.
- `src/variants/index.ts`: variant 목록, host 판별, Supabase 저장 id/path 변환 담당.
- `src/variants/types.ts`: variant config와 variant view 공통 타입.
- `src/variants/intro.ts`: 현재 variant에 맞는 첫 화면 컴포넌트 선택.

운영에서는 Vercel 환경변수로 도메인을 명시한다.

```env
NEXT_PUBLIC_PASTOR_HOSTS=cbti.pastorpark.net
NEXT_PUBLIC_IVF_HOSTS=ivf.example.com
```

쉼표로 여러 도메인을 넣을 수 있다.

```env
NEXT_PUBLIC_PASTOR_HOSTS=cbti.pastorpark.net,www.cbti.pastorpark.net
NEXT_PUBLIC_IVF_HOSTS=ivf.example.com,www.ivf.example.com
```

## 주요 디렉터리

```txt
src/app/
  HomeClient.tsx
  page.tsx
  layout.tsx
  globals.css
  result/
  admin/
  api/

src/components/
  ChungeoramFollowCard.tsx
  NutritionRadarChart.tsx
  StibeeSubscribeForm.tsx

src/data/
  test.ts

src/lib/
  nutrition-assets.ts
  scoring.ts
  result-colors.ts
  result-url.ts
  submissions.ts
  visits.ts
  supabase-rest.ts
  visitor.ts
  crypto.ts
  admin-auth.ts

src/types/
  test.ts

src/variants/
  index.ts
  intro.ts
  types.ts
  pastor/
  ivf/
```

## 화면 구조

### 메인 테스트 플로우

`src/app/HomeClient.tsx`가 테스트 진행의 공통 클라이언트 로직을 담당한다.

담당 범위:

- 현재 stage 관리: `intro`, `questions`, `loading`, `result`
- 설문 시작
- 질문 셔플
- 선택지 선택
- 점수 계산
- 결과 제출
- 방문 기록 제출
- 테스트 완료 직후 결과 화면 렌더링

첫 화면은 variant별 컴포넌트로 분리되어 있다.

- Pastor 첫 화면: `src/variants/pastor/IntroView.tsx`
- IVF 첫 화면: `src/variants/ivf/IntroView.tsx`
- 선택 함수: `src/variants/intro.ts`

문구/브랜드 config는 각 variant 폴더에 둔다.

- `src/variants/pastor/config.ts`
- `src/variants/ivf/config.ts`

### 결과 화면

결과 화면은 두 종류가 있다.

테스트 완료 직후 앱 안에서 보이는 결과:

- `src/app/HomeClient.tsx`

공유 링크나 직접 URL로 들어가는 결과 페이지:

- CBTI: `src/app/result/cbti/[type]/page.tsx`
- 영적 영양상태: `src/app/result/nutri/[type]/page.tsx`

현재는 테스트 완료 직후 결과 화면과 공유 결과 페이지가 별도 JSX를 가진다. 결과 레이아웃을 바꿀 때는 두 군데가 모두 필요한지 확인해야 한다. 향후 구조가 더 커지면 `src/variants/{variant}/ResultView.tsx` 형태로 분리하는 것이 권장된다.

영적 영양상태(`nutri`) 결과 화면의 현재 구조:

- 결과 헤더에는 결과 타입, 결과 제목, 키워드 태그를 둔다.
- IVF 버전의 결과 헤더에는 `public/ivf/{carb,protein,vitamin,mineral,probiotics}.png` 이미지를 결과 key에 맞춰 배경 레이어처럼 표시한다. 이미지 경로 매핑은 `src/lib/nutrition-assets.ts`의 `nutritionImagePaths`가 담당한다.
- 본문 첫 섹션은 `result-description-section`이며 다음 순서로 배치한다.
  - `내게 필요한 영양소` 태그 버튼
  - `NutritionRadarChart`
  - `당신의 상태` 태그 버튼과 `status`
  - 구분선
  - `청어람의 조언` 태그 버튼과 `description`
  - 구분선
  - `맞춤 처방` 태그 버튼과 `recommendation`
- `맞춤 처방`은 더 이상 별도 `insight-card` 박스로 렌더링하지 않는다.
- 하단 CTA는 `ChungeoramFollowCard`를 사용한다. 제목은 `당신의 영적 영양소를 챙겨줄 / 청어람을 팔로우 해보세요`이고, `뉴스레터 구독`, `인스타 채널`, `한눈에 보기` 버튼을 가로 배치한다.
- `뉴스레터 구독` 버튼은 `StibeeSubscribeForm`을 모달로 연다. `인스타 채널`은 `https://www.instagram.com/ichungeoram`, `한눈에 보기`는 `https://armc.cc`로 새 탭 연결한다.
- 이 구조는 `src/app/HomeClient.tsx`와 `src/app/result/nutri/[type]/page.tsx` 양쪽에 모두 적용되어 있다.

CBTI 결과 화면의 IVF 전용 확장:

- IVF 버전의 CBTI 결과 헤더에도 nutri 결과 헤더와 비슷한 이미지 레이어/큰 타이틀/작은 키워드 태그 레이아웃을 적용한다.
- CBTI 전용 이미지가 아직 없으므로 임시로 `nutritionImagePaths.CARB`(`/ivf/carb.png`)를 모든 CBTI 결과 헤더 이미지로 사용한다.
- IVF 버전의 CBTI 결과 본문에도 `ChungeoramFollowCard`를 추가한다.
- Pastor 버전 CBTI 결과에는 이 팔로우 카드가 렌더링되지 않도록 `variantId === "ivf"` 또는 `activeVariantId === "ivf"` 조건으로 제한한다.

결과 헤더 색상은 `src/lib/result-colors.ts`에서 결과 key별로 관리한다.

- CBTI 결과 색상: `personaResultColors`
- 영적 영양상태 결과 색상: `nutritionResultColors`
- 결과 헤더에 주입하는 helper: `getResultHeaderStyle()`

결과 헤더는 각 결과 페이지와 `HomeClient`의 테스트 직후 결과 화면에서 아래처럼 CSS custom property를 받는다.

```tsx
<section className="result-header" style={getResultHeaderStyle(type)}>
```

결과 헤더 아래 본문 섹션은 `section result-body` 클래스를 사용한다. `result-body`는 `result-header`와 같은 폭을 유지하고, 두 섹션 사이에 한 줄 정도의 간격을 만든다.

영적 영양상태 차트:

- `src/components/NutritionRadarChart.tsx`가 담당한다.
- 차트 아래 별도 점수 범례는 제거되어 있다.
- 각 축 라벨은 영양소 이름과 점수를 2줄 SVG `tspan`으로 함께 표시한다.

뉴스레터 구독폼:

- `src/components/StibeeSubscribeForm.tsx`가 Stibee 폼을 담당한다.
- Stibee에서 제공한 `form action`, `name`, `id`, 주요 class/id는 유지한다.
- 외부 Stibee CSS는 불러오지 않고, `src/app/globals.css`의 `.stibee-subscribe ...` 스타일로 앱 디자인에 맞춘다.
- Stibee 검증/모달 스크립트는 `next/script`로 `https://resource.stibee.com/subscribe/stb_subscribe_form.js`를 `afterInteractive` 로드한다.
- 폼은 새 탭(`target="_blank"`)으로 제출된다.

청어람 팔로우 CTA:

- `src/components/ChungeoramFollowCard.tsx`가 담당한다.
- 클라이언트 컴포넌트이며 `useState`로 구독 모달 열림 상태를 관리한다.
- 버튼은 이모지와 라벨을 세로 배치한 타일 형태다.
- 구독 모달 안에서 `StibeeSubscribeForm`을 렌더링한다.

## 라우팅 규칙

공식 결과 URL:

```txt
/result/cbti/[type]
/result/nutri/[type]
```

예시:

```txt
/result/cbti/Orthodox
/result/nutri/CARB
```

Legacy redirect:

- `src/app/result/[type]/page.tsx`
  - `/result/Orthodox`를 `/result/cbti/Orthodox`로 redirect한다.
- `src/app/result/additional/[type]/page.tsx`
  - `/result/additional/CARB`를 `/result/nutri/CARB`로 redirect한다.
- `src/app/result/carb/[type]/page.tsx`
  - `/result/carb/CARB`를 `/result/nutri/CARB`로 redirect한다.
- `src/app/result/page.tsx`
  - `?type=` 기반 예전 링크를 `/result/cbti/[type]`로 redirect한다.

Legacy 파일은 결과 레이아웃 수정 대상이 아니다. 기존 공유 링크를 살리는 redirect 전용 파일이다.

## 설문 데이터

설문 데이터와 결과 데이터의 중심 파일은 `src/data/test.ts`다.

주요 export:

- `personaKeys`: CBTI 결과 key 목록
- `nutritionKeys`: 영적 영양 결과 key 목록
- `questions`: CBTI 질문 목록
- `nutriQuestions`: 영적 영양상태 질문 목록
- `personaResults`: CBTI 결과 내용
- `nutritionResults`: 영적 영양상태 결과 내용
- `surveys`: 앱에 노출되는 설문 목록
- `surveyMap`: 설문 id별 lookup
- `getSurveyById()`: legacy 설문 id를 공식 id로 정규화해 lookup

설문 id:

```ts
export type SurveyId = "cbti" | "nutri";
```

`additional`은 더 이상 공식 설문 id가 아니다. 다만 과거 저장값/오래 열린 브라우저 탭/기존 링크를 위해 아래 위치에서 `additional/carb -> nutri` 정규화를 한다.

- `src/data/test.ts`의 `getSurveyById()`
- `src/app/api/submissions/route.ts`
- `src/variants/index.ts`의 `parseStoredSurveyId()`

`nutri` 설문 현재 UI 규칙:

- 질문 위에는 작은 보조 문구 `지금 나를 위해 필요한 것은?`을 표시한다.
- 선택지는 `💊 필요해`, `🤔 그냥 그래`, `🌿 별로 필요없어`이며 각각 `2`, `1`, `0`점이다.
- `nutri` 선택지는 셔플하지 않고 고정 순서를 유지한다.
- IVF 디자인에서는 `nutri` 선택지 3개가 가로 정렬된 정사각형 버튼으로 표시된다.

## 결과 데이터 수정 위치

CBTI 결과 내용:

- 데이터: `src/data/test.ts`의 `personaResults`
- 기준 문서: `docs/cbti_results.md`
- 직접 결과 페이지: `src/app/result/cbti/[type]/page.tsx`
- 테스트 직후 결과 화면: `src/app/HomeClient.tsx`

영적 영양상태 결과 내용:

- 데이터: `src/data/test.ts`의 `nutritionResults`
- 기준 문서: `docs/nutrition_results.md`
- 직접 결과 페이지: `src/app/result/nutri/[type]/page.tsx`
- 테스트 직후 결과 화면: `src/app/HomeClient.tsx`

## 스타일 규칙

전역 스타일은 `src/app/globals.css`에 있다.

Pastor 버전은 기본 스타일을 사용한다. IVF 버전은 `variant-ivf` 클래스로 override한다.

```tsx
<main className={`app-shell variant-${activeVariantId}`}>
```

IVF 전용 스타일은 `.variant-ivf ...` selector 아래에 둔다.

폰트:

- `src/app/layout.tsx`에서 `next/font/google`의 `Poor_Story`를 로드하고 CSS 변수 `--font-poor-story`로 등록한다.
- Poor Story 폰트는 전역 적용이 아니라 `.variant-ivf` 안에서만 사용한다.
- Pastor 버전은 기존 시스템 폰트 스택을 유지한다.

현재 IVF 디자인 요약:

- IVF 전체 앱 배경은 `--ivf-green-dark`.
- 첫 화면과 질문 카드/결과 본문 카드는 `--surface` 카드 배경과 그림자를 사용한다.
- IVF 첫 화면 설문 선택 카드는 `--ivf-green-dark` 배경이며 hover 색상 변화가 없다.
- IVF 첫 화면에서는 `nutri` 카드가 위, `cbti` 카드가 아래에 오도록 `src/variants/ivf/IntroView.tsx`에서 순서를 재정렬한다.
- IVF 버튼 기본 배경은 `--ivf-green-dark`, hover는 `--ivf-green`이다.
- IVF의 `이전으로` 버튼(`.button.ghost`)은 예외적으로 `--surface` 배경과 `--ivf-hairline` 테두리를 유지한다.
- IVF `insight-card`는 진한 초록 배경을 쓰므로 카드 제목/본문/구독폼 라벨은 흰색 계열로 override한다.
- IVF 뉴스레터 폼 입력창은 흰 배경과 진한 텍스트를 유지해 가독성을 확보한다.
- IVF 첫 화면은 `public/ivf/eoramc.png` 이미지를 제목과 설문 버튼 사이에 표시한다. 기존 `clay-hero.png` 장식은 사용하지 않는다.
- IVF 첫 화면 모바일에서는 설문 카드 2개를 가로 배치하고, 카드 높이와 이미지 크기를 모바일용으로 별도 조정한다.
- 전체 텍스트 줄바꿈은 전역에서 `word-break: keep-all`, `line-break: strict`, `overflow-wrap: break-word`를 사용해 단어 단위 줄바꿈을 우선한다.

결과 화면 스타일 관련 주요 selector:

- `.result-header`: 결과 상단 영역. `--result-color` CSS 변수를 받아 결과별 배경색을 표시한다.
- `.nutrition-result-header`: 영적 영양상태 결과 헤더 보조 클래스. IVF에서 이미지 레이어와 큰 타이틀 스타일을 적용한다.
- `.cbti-result-header`: CBTI 결과 헤더 보조 클래스. IVF에서 nutri 결과 헤더와 유사한 이미지 레이어/타이포 스타일을 적용한다.
- `.nutrition-result-art`: IVF 결과 헤더의 오른쪽 배경 이미지 레이어. Pastor 기본 화면에서는 `display: none`이다.
- `.result-body`: 결과 본문 section. 헤더와 같은 폭, 헤더와의 간격을 담당한다.
- `.result-description-section`: nutri 결과 본문 첫 설명 섹션. 태그 버튼, 차트, 상태/조언/처방 문구를 담는다.
- `.result-status-tag`: 결과 설명 섹션에서 쓰는 작은 태그 버튼 스타일.
- `.result-status-divider`: 상태/조언/처방 사이의 가로 구분선.
- `.variant-ivf .section.result-body`: IVF 버전에서 결과 본문 폭을 IVF 결과 헤더 폭과 맞춘다.
- `.stibee-subscribe ...`: 뉴스레터 구독폼 스타일.
- `.follow-card`, `.follow-actions`, `.follow-action-button`, `.subscribe-modal ...`: 청어람 팔로우 CTA와 구독 모달 스타일.
- `.nutrition-radar ...`: 영적 영양상태 레이더 차트 스타일.

권장 기준:

- 색상, 배경, 카드 배열, 간격: CSS variant override
- 단순 문구, 브랜드명: 각 variant의 `config.ts`
- 첫 화면 레이아웃: 각 variant의 `IntroView.tsx`
- 결과 페이지 구조가 크게 달라지는 경우: variant별 `ResultView.tsx` 추가
- 질문/결과 데이터가 variant별로 달라지는 경우: variant별 `data.ts` 추가 후 공통 로직에 주입

## 점수 계산

점수 계산은 `src/lib/scoring.ts`가 담당한다.

중요 함수:

- `calculateScores()`
- `resolvePrimaryResult()`
- `getSortedResultScores()`
- `getClosePersonas()`

CBTI는 선택지별 persona score를 더한다. `nutri` 설문은 각 질문의 응답이 해당 영양소에 `2`, `1`, `0`점을 준다.

현재 `nutri` 설문은 질문 순서를 랜덤화하지만 선택지 순서는 고정한다. 이 로직은 `src/app/HomeClient.tsx`의 `start()`에서 제어한다.

```ts
setSessionQuestions(shuffleQuestions(survey.questions, { shuffleOptions: surveyId !== "nutri" }));
```

## Supabase 저장 구조

Supabase 연동은 REST API를 직접 호출한다.

- 제출 저장: `src/app/api/submissions/route.ts`
- 방문 저장: `src/app/api/visits/route.ts`
- REST helper: `src/lib/supabase-rest.ts`

필요한 환경변수:

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
VISITOR_HASH_SALT=
```

제출 데이터는 `test_submissions` 테이블에 저장한다. 새 제출은 `survey_id`에 variant prefix를 붙인다.

```txt
pastor:cbti
pastor:nutri
ivf:cbti
ivf:nutri
```

기존 저장값 호환:

- `cbti`는 `pastor:cbti`로 취급
- `additional`과 `carb`는 `pastor:nutri`로 취급
- `pastor:additional`, `ivf:additional`, `pastor:carb`, `ivf:carb`도 각각 `pastor:nutri`, `ivf:nutri`로 취급

방문 기록은 `site_visits.path`에 variant prefix를 붙여 저장한다.

```txt
/pastor
/pastor/result/cbti/Orthodox
/ivf
/ivf/result/nutri/CARB
```

## 관리자 통계

관리자 통계 화면:

- `src/app/admin/stats/page.tsx`

통계 API:

- `src/app/api/admin/stats/route.ts`

관리자 인증:

- `src/app/api/admin/login/route.ts`
- `src/lib/admin-auth.ts`

관리자 화면은 `pastor`와 `ivf` 버전을 먼저 선택하고, 그 안에서 `cbti`와 `nutri` 설문 통계를 선택한다.

주의: 기존 데이터의 `additional`과 `carb`는 관리자 통계에서 `nutri`로 정규화된다.

## 공유 URL

공유 URL 생성은 `src/lib/result-url.ts`에서 한다.

현재 규칙:

```txt
/result/cbti/[type]
/result/nutri/[type]
```

클라이언트에서 실행될 때는 `window.location.origin`을 우선 base URL로 사용한다. 이 규칙은 IVF 도메인에서 테스트를 끝냈을 때 공유 input에 pastor 도메인이 표시되는 문제를 막기 위한 것이다.

서버 환경에서는 `NEXT_PUBLIC_SITE_URL`이 있으면 그 값을 fallback base URL로 사용한다.

## sitemap

`src/app/sitemap.ts`에서 결과 URL을 생성한다.

현재 sitemap 결과 URL:

- `/result/cbti/[type]`
- `/result/nutri/[type]`

새 공식 라우트를 추가하거나 바꾸면 sitemap도 함께 수정해야 한다.

## 문서 기준 파일

콘텐츠 기준 문서:

- CBTI 결과: `docs/cbti_results.md`
- 영적 영양 결과: `docs/nutrition_results.md`
- 설문 콘텐츠 요약: `docs/SURVEY_CONTENTS.md`
- variant 구조 요약: `docs/VARIANT_ARCHITECTURE.md`

프로젝트 변경 시 이 문서들과 실제 코드가 어긋나지 않게 함께 갱신한다.

## 유지보수 체크리스트

라우트 변경 시:

- `src/lib/result-url.ts`
- `src/app/sitemap.ts`
- legacy redirect 파일
- 결과 페이지 metadata canonical/openGraph URL
- 문서 파일

설문 id 변경 시:

- `src/types/test.ts`
- `src/data/test.ts`
- `src/app/HomeClient.tsx`
- `src/app/api/submissions/route.ts`
- `src/variants/index.ts`
- 관리자 통계 API
- 기존 데이터 정규화

결과 내용 변경 시:

- `docs/cbti_results.md` 또는 `docs/nutrition_results.md`
- `src/data/test.ts`
- 필요하면 결과 페이지 layout/metadata

variant 디자인 변경 시:

- 단순 스타일: `src/app/globals.css`
- 첫 화면 구조: `src/variants/{variant}/IntroView.tsx`
- 문구: `src/variants/{variant}/config.ts`
- 결과 구조: 향후 `src/variants/{variant}/ResultView.tsx` 추가 권장

## 불필요 파일 주의

macOS에서 생기는 `.DS_Store`는 프로젝트에 포함하지 않는다. 발견하면 삭제한다.

`tsconfig.tsbuildinfo`는 타입 검사 과정에서 갱신될 수 있는 캐시성 파일이다. 의미 있는 코드 변경으로 취급하지 않는다.
