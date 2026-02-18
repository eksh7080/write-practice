import Link from 'next/link';
import { UserCircle } from 'lucide-react'; // 아이콘 사용
import styles from 'scss/module/header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      {/* 왼쪽: 로고 */}
      <div className={styles.logo}>
        <Link href="/">TYPING BOOK</Link>
      </div>
      {/* 가운데: 메뉴 */}
      <nav className={styles.nav}>
        <Link href="/typing">필사하기</Link>
        <Link href="/practice">타자연습</Link>
      </nav>
      {/* 오른쪽: 프로필 아이콘 */}
      <div className={styles.profile}>
        <UserCircle size={32} />
      </div>
    </header>
  );
};

export default Header;
