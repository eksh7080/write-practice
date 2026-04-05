# TypeScript/React 코드 스타일 규칙

## TypeScript 일반
- strict 모드 필수 (`tsconfig.json`)
- `any` 사용 금지 (불가피한 경우 주석으로 사유 명시)
- 타입 정의: `interface` 우선 (type은 유니온/인터섹션에만)
- 들여쓰기: 2 spaces
- 세미콜론: 사용
- 따옴표: single quote
- trailing comma: 사용

## Next.js App Router 규칙

### 컴포넌트
- 함수형 컴포넌트 + hooks 패턴만 사용
- 클래스 컴포넌트 사용 금지
- 서버 컴포넌트 기본, 상호작용/훅 필요 시 `'use client'` 명시
- 컴포넌트 파일 당 하나의 export default
- Props 타입은 interface로 정의 (`ComponentNameProps`)

```tsx
interface TypingCardProps {
  text: string;
  onComplete?: (wpm: number, accuracy: number) => void;
}

const TypingCard = ({ text, onComplete }: TypingCardProps) => {
  return <div>{text}</div>;
};

export default TypingCard;
```

### Hooks
- 커스텀 훅은 `use` 접두사 (예: `useTyping`, `usePagination`)
- 복잡한 상태 로직은 커스텀 훅으로 추출

### 이벤트 핸들러
- `handle` 접두사: `handleKeyDown`, `handleSubmit`
- Props로 전달 시 `on` 접두사: `onKeyDown`, `onComplete`

## 스타일링
- **SCSS CSS Modules** 사용 (`scss/module/*.module.scss`)
- 인라인 스타일 지양
- `!important` 사용 금지
- 전역 스타일은 `scss/global.scss`, `scss/_layout.scss`, `scss/_font.scss`에만 작성
- 클래스명은 camelCase (예: `styles.typingArea`)

```tsx
import styles from '@/scss/module/typing.module.scss';

const Component = () => <div className={styles.wrapper}>...</div>;
```

## 기타
- `console.log` 커밋 금지 (디버깅 후 제거)
- 매직 넘버/문자열 → 상수 파일로 추출 (예: `CHARS_PER_PAGE = 350`)
- 사용하지 않는 import, 변수 제거 (ESLint + unused-imports 플러그인으로 검증)
