/**
 * 설명: 루트 레이아웃
 * **/
import '@/scss/global.scss';
import { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  weight: ['400', '600', '800'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
});

const BASE_URL = 'https://your-domain.vercel.app'; // 배포 후 실제 도메인으로 교체

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: '책 필사 타자연습',
    template: '%s | 책 필사 타자연습',
  },
  description: '소설, 시, 수필, 명언을 필사하며 타자 연습을 하는 서비스',
  keywords: ['타자연습', '필사', '소설', '시', '수필', '명언', '타이핑', '책'],
  authors: [{ name: 'dnlee' }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: BASE_URL,
    siteName: '책 필사 타자연습',
    title: '책 필사 타자연습',
    description: '소설, 시, 수필, 명언을 필사하며 타자 연습을 하는 서비스',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: '책 필사 타자연습' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '책 필사 타자연습',
    description: '소설, 시, 수필, 명언을 필사하며 타자 연습을 하는 서비스',
    images: [`${BASE_URL}/og-image.png`],
  },
  // 배포 후 Google Search Console, 네이버 Search Advisor에서 발급받은 코드로 교체
  // verification: {
  //   google: 'Google 발급 코드',
  //   other: { 'naver-site-verification': '네이버 발급 코드' },
  // },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '책 필사 타자연습',
  description: '소설, 시, 수필, 명언을 필사하며 타자 연습을 하는 서비스',
  url: BASE_URL,
  applicationCategory: 'EducationalApplication',
  inLanguage: 'ko-KR',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body style={{ fontFamily: 'var(--font-noto-sans), sans-serif' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/*<Header />*/}
        {children}
      </body>
    </html>
  );
}
