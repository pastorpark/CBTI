import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Spiritual Home",
  description: "내 신앙 성향과 잘 맞는 신앙 유형을 알아보는 테스트"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
