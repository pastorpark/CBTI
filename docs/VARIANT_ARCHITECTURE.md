# Pastor / IVF Variant Structure

이 프로젝트는 하나의 Next.js 앱과 하나의 Supabase 백엔드를 공유하면서, 도메인에 따라 `pastor`와 `ivf` 버전을 구분한다.

## Variant 판별

- 진입점: `src/app/page.tsx`
- 서버에서 `Host` 헤더를 읽고 `resolveSiteVariantId()`로 버전을 판별한다.
- 로컬 기본값은 `pastor`이고, hostname에 `ivf`가 포함되면 `ivf`로 판별한다.
- 운영에서는 환경변수로 도메인을 지정한다.

```env
NEXT_PUBLIC_PASTOR_HOSTS=cbti.pastorpark.net
NEXT_PUBLIC_IVF_HOSTS=ivf.example.com
```

## 주요 파일

- `src/app/page.tsx`: 서버 wrapper. variant를 판별하고 `HomeClient`에 전달한다.
- `src/app/HomeClient.tsx`: 테스트 진행, 채점, 제출, 결과 표시의 공통 클라이언트 로직.
- `src/variants/index.ts`: variant 목록, host 판별, Supabase 저장용 id/path 변환.
- `src/variants/types.ts`: variant config와 variant view의 공통 타입.
- `src/variants/intro.ts`: 현재 variant에 맞는 첫 화면 컴포넌트를 선택한다.
- `src/variants/pastor/config.ts`: Pastor 버전의 문구/브랜드 config.
- `src/variants/ivf/config.ts`: IVF 버전의 문구/브랜드 config.
- `src/variants/pastor/IntroView.tsx`: Pastor 첫 화면 레이아웃.
- `src/variants/ivf/IntroView.tsx`: IVF 첫 화면 레이아웃.

## 수정 기준

- 브랜드명, 첫 화면 타이틀, 안내 문구처럼 단순한 텍스트는 각 variant의 `config.ts`에서 수정한다.
- 첫 화면 레이아웃은 각 variant의 `IntroView.tsx`에서 수정한다.
- 색상, 배경, 카드 배열 등 CSS 차이는 `src/app/globals.css`의 `.variant-ivf` 같은 variant class에서 수정한다.
- 결과 페이지 구성처럼 구조가 크게 달라지는 화면은 `src/variants/{variant}/ResultView.tsx` 패턴으로 분리한다.
- 질문/결과 데이터가 버전별로 달라지면 `src/variants/{variant}/data.ts`로 분리한 뒤 공통 로직에 주입한다.

## Supabase 통계 구분

새 제출은 기존 `survey_id` 컬럼에 다음 형태로 저장한다.

```txt
pastor:cbti
pastor:carb
ivf:cbti
ivf:carb
```

기존에 저장된 `cbti`, `additional` 데이터는 관리자 통계에서 자동으로 `pastor` 버전으로 분류한다. 기존 `additional` 값은 새 `carb` 설문으로 정규화한다.

방문 기록은 `site_visits.path`에 `/pastor`, `/ivf` prefix를 붙여 저장하고, 관리자 화면에서 버전별 접속 통계를 구분한다.
