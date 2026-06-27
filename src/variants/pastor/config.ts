import type { SiteVariant } from "@/variants/types";

export const pastorVariant: SiteVariant = {
  id: "pastor",
  label: "Pastor 버전",
  description: "Pastorpark.net 신앙 검사 시리즈",
  hostnames: [],
  brand: "CBTI",
  brandFull: "Christian Belief Type Indicator",
  introTitle: "신앙유형검사",
  introLead: "원하는 설문을 선택해 보세요.",
  surveyIntros: {
    cbti: {
      eyebrow: "CBTI 안내",
      title: "나의 신앙 성향을 차분히 살펴봅니다",
      description: "15개의 질문을 통해 내가 중요하게 여기는 신앙의 기준과 예배, 공동체, 사회를 바라보는 관점을 정리해봅니다.",
      bullets: [
        "정답이 있는 시험이 아니라 나의 현재 성향을 살피는 도구입니다.",
        "각 질문에서 가장 자연스럽게 끌리는 답을 골라주세요.",
        "결과에서는 대표 신앙 유형과 함께 어울릴 수 있는 교파 추천을 확인할 수 있습니다."
      ],
      startLabel: "CBTI 시작하기"
    },
    nutri: {
      eyebrow: "영적 영양상태 안내",
      title: "지금 내 신앙에 필요한 영양소를 찾아봅니다",
      description: "최근의 신앙생활에서 부족하게 느끼는 배움, 관계, 실천, 쉼, 회복의 영역을 간단히 점검합니다.",
      bullets: [
        "각 문항은 지금 나에게 필요한 정도를 묻습니다.",
        "보기는 고정된 순서로 표시됩니다.",
        "결과에서는 가장 필요한 영적 영양소와 추천 방향을 확인할 수 있습니다."
      ],
      startLabel: "영양상태 진단 시작하기"
    }
  },
  metadata: {
    siteName: "나의 신앙 유형 찾기 - CBTI",
    titleTemplate: "%s | 나의 신앙 유형 찾기 CBTI",
    description: "15개의 질문을 통해 나의 신앙 성향을 살펴보고, 나와 잘 맞는 신앙 유형과 추천 교파를 확인해보세요.",
    keywords: [
      "CBTI",
      "크리스천 테스트",
      "기독교 테스트",
      "신앙 성향 테스트",
      "교파 추천",
      "신앙 유형",
      "나의 신앙 유형 찾기",
      "나는 어떤 신앙인일까",
      "나는 어떤 크리스천일까"
    ],
    creator: "PastorPark",
    publisher: "PastorPark",
    openGraph: {
      title: "나의 신앙 유형 찾기 - CBTI",
      description: "나의 신앙 성향을 알아보고, 잘 맞는 신앙 유형과 추천 교파를 확인해보세요.",
      image: "/og/default.png",
      imageAlt: "나의 신앙 유형 찾기 CBTI 신앙 성향 테스트 대표 이미지"
    },
    twitter: {
      title: "나의 신앙 유형 찾기 - CBTI",
      description: "15개의 질문으로 나의 신앙 성향과 잘 맞는 추천 교파를 확인해보세요.",
      image: "/og/default.png"
    },
    results: {
      cbti: {
        title: "{label}",
        description: "나의 신앙 유형은 {label}. {subtitle}",
        openGraphTitle: "{label} - 나의 신앙 유형 찾기 CBTI",
        openGraphDescription: "나의 신앙 유형은 {label}. {subtitle}",
        openGraphImage: "/og/result-{keyLower}.png",
        openGraphImageAlt: "{label} 결과 - 나의 신앙 유형 찾기 CBTI",
        twitterTitle: "{label} - 나의 신앙 유형 찾기 CBTI",
        twitterDescription: "나의 신앙 유형은 {label}. {subtitle}",
        twitterImage: "/og/result-{keyLower}.png"
      },
      nutri: {
        title: "{title}",
        description: "{label}: {status}",
        openGraphTitle: "{label} - 영적 영양상태 진단 테스트",
        openGraphDescription: "{status}",
        openGraphImage: "/og/nutri-{keyLower}.png",
        openGraphImageAlt: "{label} 결과 - 영적 영양상태 진단 테스트",
        twitterTitle: "{label} - 영적 영양상태 진단 테스트",
        twitterDescription: "{status}",
        twitterImage: "/og/nutri-{keyLower}.png"
      }
    }
  }
};
