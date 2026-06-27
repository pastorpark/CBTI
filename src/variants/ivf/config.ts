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
      eyebrow: "신앙유형 워밍업",
      title: "내 안의 신앙 색깔을 가볍게 펼쳐볼게요",
      description: "예배, 성경, 공동체, 사회 이슈를 대하는 나의 감각을 따라가며 지금의 신앙 취향과 강점을 발견해봅니다.",
      bullets: [
        "너무 오래 고민하지 말고 가장 먼저 마음이 가는 답을 골라주세요.",
        "결과는 나를 규정하는 딱지가 아니라 대화를 시작하는 작은 힌트입니다.",
        "친구들과 결과를 나누면 서로의 신앙 언어를 더 재미있게 발견할 수 있어요."
      ],
      startLabel: "내 신앙 색깔 보기"
    },
    nutri: {
      eyebrow: "영적 영양 체크",
      title: "오늘 내 영혼에게 필요한 한 끼를 찾아볼까요?",
      description: "질문, 관계, 연대, 쉼, 회복 중 지금 나에게 가장 필요한 영적 영양소가 무엇인지 빠르게 점검합니다.",
      bullets: [
        "보기는 필요해, 그냥 그래, 별로 필요없어 순서로 고정됩니다.",
        "최근의 내 상태를 기준으로 솔직하게 눌러주세요.",
        "결과에서는 청어람이 추천하는 영적 영양소와 다음 행동을 확인할 수 있어요."
      ],
      startLabel: "영양소 찾으러 가기"
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
