import type { SiteVariant } from "@/variants/types";

export const ivfVariant: SiteVariant = {
  id: "ivf",
  label: "IVF 버전",
  description: "IVF용 디자인/콘텐츠 변형",
  hostnames: [],
  brand: "iChungeoram",
  brandFull: "청어람ARMC",
  introTitle: "2026 전국 수련회 축하합니다~",
  introLead: "청어람ARMC와 함께 나의 신앙 여정을 살펴보세요.",
  surveyIntros: {
  cbti: {
    eyebrow: "CBTI 신앙유형검사",
    title: "나는 어떤 신앙을 가진, 어떤 유형의 그리스도인일까요?",
    description: "7가지 신앙 유형 중에서 내 신앙 색깔과 가장 유사한 유형을 찾아줍니다.",
    bullets: [
      "질문 당 하나의 답만 고를 수 있습니다. 너무 오래 고민하지 말고 가장 먼저 마음이 가는 답을 골라주세요.",
      "결과는 나를 규정하는 딱지가 아니라 대화를 시작하는 작은 힌트입니다.",
      "친구들과 결과를 나누면 서로의 신앙 유형을 더 재미있게 발견할 수 있어요."
    ],
    startLabel: "내 신앙 유형 찾아보기"
  },
  nutri: {
    eyebrow: "영적 영양상태 분석",
    title: "오늘 내 영혼이 원하고 있는 영양소는 무엇일까요?",
    description: "당신이 이번 전국수에서 채워가야 할 영적 영양소를 빠르게 찾아드릴게요.",
    bullets: [
      "15개의 간단한 질문에 대해 지금 내가 어떻게 느끼는지를 고르시면 됩니다.",
      "최근 내 상태를 기준으로 '필요해', '그저그래', '필요없어' 셋 중 하나를 솔직하게 눌러주세요.",
      "다섯가지 영양소 중 당신에게 가장 필요한 것을 찾아드리고, 청어람의 추천 처방까지 알려드려요.",
      "친구들과 결과를 나누면 서로의 영적 필요를 더 풍성하게 채워줄 수 있겠죠?"
    ],
    startLabel: "검사시작"
  }
},
  metadata: {
    siteName: "신앙유형검사 - 청어람ARMC",
    titleTemplate: "%s | 신앙유형검사 - 청어람ARMC",
    description: "청어람ARMC와 함께 나의 신앙 여정과 지금 필요한 영적 영양소를 살펴보세요.",
    keywords: [
      "IVF",
      "청어람",
      "청어람ARMC",
      "신앙유형검사",
      "영적 영양상태",
      "CBTI",
      "기독교 테스트",
      "신앙 성향 테스트"
    ],
    creator: "iChungeoram",
    publisher: "iChungeoram",
    openGraph: {
      title: "신앙유형검사 - 청어람ARMC",
      description: "청어람ARMC와 함께 나의 신앙 여정과 지금 필요한 영적 영양소를 확인해보세요.",
      image: "/og/ivf/default.png",
      imageAlt: "신앙유형검사 대표 이미지"
    },
    twitter: {
      title: "신앙유형검사 - 청어람ARMC",
      description: "청어람ARMC와 함께 나의 신앙 여정과 지금 필요한 영적 영양소를 확인해보세요.",
      image: "/og/ivf/default.png"
    },
    results: {
      cbti: {
        title: "{label}",
        description: "나의 신앙 유형은 {label}. {subtitle}",
        openGraphTitle: "{label} - 청어람ARMC 신앙유형검사",
        openGraphDescription: "청어람ARMC와 함께 살펴본 나의 신앙 유형은 {label}. {subtitle}",
        openGraphImage: "/og/ivf/cbti-{keyLower}.png",
        openGraphImageAlt: "{label} 결과 - 청어람ARMC 신앙유형검사",
        twitterTitle: "{label} - 청어람ARMC 신앙유형검사",
        twitterDescription: "청어람ARMC와 함께 살펴본 나의 신앙 유형은 {label}. {subtitle}",
        twitterImage: "/og/ivf/cbti-{keyLower}.png"
      },
      nutri: {
        title: "{title}",
        description: "{label}: {status}",
        openGraphTitle: "{label} - 청어람ARMC 영적 영양상태 검사",
        openGraphDescription: "지금 내게 필요한 영적 영양소는 {label}. {status}",
        openGraphImage: "/og/ivf/nutri-{keyLower}.png",
        openGraphImageAlt: "{label} 결과 - 청어람ARMC 영적 영양상태 검사",
        twitterTitle: "{label} - 청어람ARMC 영적 영양상태 검사",
        twitterDescription: "지금 내게 필요한 영적 영양소는 {label}. {status}",
        twitterImage: "/og/ivf/nutri-{keyLower}.png"
      }
    }
  }
};
