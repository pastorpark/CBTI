import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://cbit.pastorpark.net";
const siteName = "나의 신앙 유형 찾기 - CBTI";
const description = "15개의 질문을 통해 나의 신앙 성향을 살펴보고, 나와 잘 맞는 신앙 유형과 추천 교파를 확인해보세요.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s | 나의 신앙 유형 찾기 CBTI"
  },
  description,
  applicationName: siteName,
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
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: siteName,
    description: "나의 신앙 성향을 알아보고, 잘 맞는 신앙 유형과 추천 교파를 확인해보세요.",
    url: "/",
    siteName,
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: "나의 신앙 유형 찾기 CBTI 신앙 성향 테스트 대표 이미지"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "15개의 질문으로 나의 신앙 성향과 잘 맞는 추천 교파를 확인해보세요.",
    images: ["/og/default.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteName,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    inLanguage: "ko-KR",
    description,
    url: siteUrl
  };

  return (
    <html lang="ko">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
