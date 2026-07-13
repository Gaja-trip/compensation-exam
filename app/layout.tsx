import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://compensation-exam.hopesound.chatgpt.site"),
  title: "보상관리사 시험 | 기출문제·문제풀이",
  description: "보상관리사 시험 기출문제를 풀고, 오답과 시각 해설로 복습하는 학습 공간",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "보상관리사 기출학습",
    title: "보상관리사 기출문제",
    description: "읽고, 풀고, 장면으로 기억하는 보상관리사 기출 학습 공간",
    images: [{
      url: "/og.png",
      width: 2048,
      height: 1024,
      alt: "보상관리사 기출문제 - 읽고, 풀고, 장면으로 기억하기",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "보상관리사 기출문제",
    description: "읽고, 풀고, 장면으로 기억하는 보상관리사 기출 학습 공간",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
