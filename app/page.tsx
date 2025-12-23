import styles from '@/scss/module/home.module.scss';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <section className={styles.mainContainer}>
        <div className={styles.mainWrap}>
          <div className={styles.mainGridContainer}>
            <Link href="">
              <article>⌨️</article>
              <strong>자리 연습</strong>
            </Link>
            <Link href="">
              <article>📝</article>
              <strong>낱말 연습</strong>
            </Link>
            <Link href="">
              <article>✏️</article>
              <strong>단문 연습</strong>
            </Link>
            <Link href="">
              <article>📄</article>
              <strong>장문 연습</strong>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
