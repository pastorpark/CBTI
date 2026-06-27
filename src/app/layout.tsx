import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Poor_Story } from "next/font/google";
import { headers } from "next/headers";
import { getRequestOrigin } from "@/lib/request-origin";
import { getSiteVariantById, resolveSiteVariantId } from "@/variants";
import "./globals.css";

const poorStory = Poor_Story({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poor-story"
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const variantId = resolveSiteVariantId(headersList.get("host"));
  const variant = getSiteVariantById(variantId);
  const variantMetadata = variant.metadata;
  const origin = getRequestOrigin(headersList);

  return {
    metadataBase: new URL(origin),
    title: {
      default: variantMetadata.siteName,
      template: variantMetadata.titleTemplate
    },
    description: variantMetadata.description,
    applicationName: variantMetadata.siteName,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "32x32" }
      ],
      shortcut: "/favicon.ico",
      apple: [
        { url: "/apple-icon.png", type: "image/png", sizes: "180x180" }
      ]
    },
    keywords: variantMetadata.keywords,
    creator: variantMetadata.creator,
    publisher: variantMetadata.publisher,
    robots: {
      index: true,
      follow: true
    },
    alternates: {
      canonical: "/"
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
      other: {
        "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || ""
      }
    },
    openGraph: {
      title: variantMetadata.openGraph.title,
      description: variantMetadata.openGraph.description,
      url: "/",
      siteName: variantMetadata.siteName,
      type: "website",
      locale: "ko_KR",
      images: [
        {
          url: "/og/default.png",
          width: 1200,
          height: 630,
          alt: variantMetadata.openGraph.imageAlt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: variantMetadata.twitter.title,
      description: variantMetadata.twitter.description,
      images: ["/og/default.png"]
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const variantId = resolveSiteVariantId(headersList.get("host"));
  const variantMetadata = getSiteVariantById(variantId).metadata;
  const origin = getRequestOrigin(headersList);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: variantMetadata.siteName,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    inLanguage: "ko-KR",
    description: variantMetadata.description,
    url: origin
  };

  return (
    <html lang="ko">
      <body className={poorStory.variable}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
