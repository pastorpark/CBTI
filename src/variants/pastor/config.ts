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
      imageAlt: "나의 신앙 유형 찾기 CBTI 신앙 성향 테스트 대표 이미지"
    },
    twitter: {
      title: "나의 신앙 유형 찾기 - CBTI",
      description: "15개의 질문으로 나의 신앙 성향과 잘 맞는 추천 교파를 확인해보세요."
    },
    results: {
      cbti: {
        title: "{label}",
        description: "나의 신앙 유형은 {label}. {subtitle}",
        openGraphTitle: "{label} - 나의 신앙 유형 찾기 CBTI",
        openGraphDescription: "나의 신앙 유형은 {label}. {subtitle}",
        twitterTitle: "{label} - 나의 신앙 유형 찾기 CBTI",
        twitterDescription: "나의 신앙 유형은 {label}. {subtitle}"
      },
      nutri: {
        title: "{title}",
        description: "{label}: {status}",
        openGraphTitle: "{label} - 영적 영양상태 진단 테스트",
        openGraphDescription: "{status}",
        twitterTitle: "{label} - 영적 영양상태 진단 테스트",
        twitterDescription: "{status}"
      }
    }
  }
};
