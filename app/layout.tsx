import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "보상관리사 시험 | 기출문제·문제풀이",
  description: "보상관리사 시험 기출문제를 풀고, 오답과 시각 해설로 복습하는 학습 공간",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
