/**
 * 설명: 루트 페이지
 * **/
import styles from '@/scss/module/home.module.scss';

export default function Home() {
  return (
    <main>
      <section className={styles.mainContainer}>
        <div className={styles.mainWrap}>
          <div className={styles.mainGridContainer}></div>
        </div>
      </section>
    </main>
  );
}
