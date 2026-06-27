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
      imageAlt: "신앙유형검사 대표 이미지"
    },
    twitter: {
      title: "신앙유형검사 - 청어람ARMC",
      description: "청어람ARMC와 함께 나의 신앙 여정과 지금 필요한 영적 영양소를 확인해보세요."
    },
    results: {
      cbti: {
        title: "{label}",
        description: "나의 신앙 유형은 {label}. {subtitle}",
        openGraphTitle: "{label} - 청어람ARMC 신앙유형검사",
        openGraphDescription: "청어람ARMC와 함께 살펴본 나의 신앙 유형은 {label}. {subtitle}",
        twitterTitle: "{label} - 청어람ARMC 신앙유형검사",
        twitterDescription: "청어람ARMC와 함께 살펴본 나의 신앙 유형은 {label}. {subtitle}"
      },
      nutri: {
        title: "{title}",
        description: "{label}: {status}",
        openGraphTitle: "{label} - 청어람ARMC 영적 영양상태 검사",
        openGraphDescription: "지금 내게 필요한 영적 영양소는 {label}. {status}",
        twitterTitle: "{label} - 청어람ARMC 영적 영양상태 검사",
        twitterDescription: "지금 내게 필요한 영적 영양소는 {label}. {status}"
      }
    }
  }
};
