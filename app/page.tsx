import styles from '@/scss/module/home.module.scss';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <section className={styles.homeContainer}>
        <div className={styles.content}>
          <div className={styles.gridContainer}>
            <Link href="/practice/position" className={styles.practiceCard}>
              <div className={styles.cardIcon}>⌨️</div>
              <h3>자리 연습</h3>
              <p>기본 키 위치 익히기</p>
            </Link>

            <Link href="/practice/word" className={styles.practiceCard}>
              <div className={styles.cardIcon}>📝</div>
              <h3>낱말 연습</h3>
              <p>단어로 속도 향상</p>
            </Link>

            <Link href="/practice/short" className={styles.practiceCard}>
              <div className={styles.cardIcon}>✏️</div>
              <h3>단문 연습</h3>
              <p>짧은 문장 연습</p>
            </Link>

            <Link href="/practice/long" className={styles.practiceCard}>
              <div className={styles.cardIcon}>📄</div>
              <h3>장문 연습</h3>
              <p>긴 글 집중 연습</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
