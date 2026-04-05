# TypeScript/React 네이밍 규칙

## 파일명

| 항목 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `TypingArea.tsx`, `ResultModal.tsx` |
| 페이지 | Next.js 규칙 (소문자) | `app/page.tsx`, `app/typing/page.tsx` |
| 훅 | camelCase + use 접두사 | `useTyping.ts`, `usePagination.ts` |
| 유틸리티 | camelCase | `formatWpm.ts`, `calcAccuracy.ts` |
| 타입 정의 | camelCase | `typingTypeInterface.ts` |
| 상수 | camelCase | `constants.ts` |
| 스타일 | 컴포넌트명 + .module.scss | `TypingArea.module.scss` |
| 테스트 | 대상 + .test | `TypingArea.test.tsx` |

## 변수/함수

| 항목 | 규칙 | 예시 |
|------|------|------|
| 변수 | camelCase | `currentPage`, `isTyping` |
| 함수 | camelCase | `calcWpm`, `splitSentences` |
| 상수 | UPPER_SNAKE_CASE | `CHARS_PER_PAGE`, `MAX_RETRY` |
| boolean 변수 | is/has/can/should 접두사 | `isCompleted`, `hasError` |
| 이벤트 핸들러 | handle 접두사 | `handleKeyDown`, `handleSubmit` |
| 이벤트 Props | on 접두사 | `onKeyDown`, `onComplete` |

## 타입/인터페이스

| 항목 | 규칙 | 예시 |
|------|------|------|
| interface | PascalCase | `TypingTypeInterface`, `PageResult` |
| Props | 컴포넌트명 + Props | `TypingAreaProps`, `ModalProps` |
| 응답 타입 | 도메인 + Response | `NovelResponse` |
| Enum | PascalCase | `Genre`, `TypingStatus` |
| Enum 값 | UPPER_SNAKE_CASE | `NOVEL`, `POEM` |
| Generic | 단일 대문자 | `T`, `K` |

## 디렉토리

- Next.js App Router: `app/` 하위는 소문자 (라우팅 규칙)
- 컴포넌트: PascalCase 파일명 (예: `TypingArea.tsx`)
- 스타일: `scss/module/` 하위에 .module.scss
