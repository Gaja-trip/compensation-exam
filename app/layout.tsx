import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "케이스룸 | 보상관리사 기출학습",
  description: "법정드라마처럼 읽고, 사건처럼 기억하는 보상관리사 학습 공간",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
