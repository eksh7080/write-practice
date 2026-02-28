/**
 * 설명: 루트 레이아웃
 * **/
import '@/scss/global.scss';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  weight: ['400', '600', '800'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '책 필사 타자연습',
  description: '책 내용을 필사하며 타자 연습을 하는 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body style={{ fontFamily: 'var(--font-noto-sans), sans-serif' }}>
        {/*<Header />*/}
        {children}
      </body>
    </html>
  );
}
