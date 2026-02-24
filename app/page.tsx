/**
 * 설명: 루트 페이지
 * **/
import styles from '@/scss/module/home.module.scss';
import { BookOpen, Keyboard } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <section className={styles.container}>
        {/* 왼쪽 버튼: 필사하기 */}
        <Link href="/typing" className={styles.card}>
          <BookOpen size={64} strokeWidth={1.5} />
          <span>필사하기</span>
        </Link>
        {/* 오른쪽 버튼: 타자연습 */}
        <Link href="/practice" className={styles.card}>
          <Keyboard size={64} strokeWidth={1.5} />
          <span>타자연습</span>
        </Link>
      </section>
    </main>
  );
}
