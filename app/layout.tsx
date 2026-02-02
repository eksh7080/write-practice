/**
 * 설명: 루트 레이아웃
 * **/
import '@/scss/global.scss';
import { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: '책 필사 타자연습',
  description: '책 내용을 필사하며 타자 연습을 하는 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
