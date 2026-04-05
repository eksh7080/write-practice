import Link from 'next/link';
// 아이콘 사용
import styles from 'scss/module/header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      {/* 왼쪽: 로고 */}
      <div className={styles.logo}>
        <Link href="/">TYPING BOOK</Link>
      </div>
    </header>
  );
};

export default Header;
