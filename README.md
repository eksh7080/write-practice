# ✍️ 필사 타자연습 (write-practice)

> 소설, 시, 수필, 명언을 보고 따라 치며 타자 연습하는 웹 앱

![Next.js](https://img.shields.io/badge/Next.js-16.1.0-000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![SCSS](https://img.shields.io/badge/SCSS-Modules-CC6699?logo=sass)

<!-- 스크린샷 추가 예정 -->

## 주요 기능

- **분할 화면** — 왼쪽 원문을 보며 오른쪽에서 타이핑
- **장르별 지원** — 소설(`.` 기준 분리), 시(`\n` 기준), 수필, 명언
- **페이지네이션** — 350자 단위로 콘텐츠 분할
- **실시간 오타 표시** — 틀린 글자 빨간색 하이라이트
- **완료 통계** — 정확도, WPM(분당 타자 수) 결과 모달
- **설정 패널** — 글씨 크기 조절, 장르/작품 선택
- **이어서 하기** — localStorage 기반 진행 상태 저장·복원

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | Next.js 16.1.0 (App Router) |
| UI | React 19, TypeScript 5 |
| 스타일 | SCSS CSS Modules, Noto Sans KR |
| 아이콘 | lucide-react |
| 패키지 매니저 | yarn |
| 린터 | ESLint, Prettier |

## 시작하기

### 전제 조건

- Node.js 18+
- yarn

### 설치 및 실행

```bash
git clone https://github.com/eksh7080/write-practice.git
cd write-practice
yarn install
yarn dev
```

[http://localhost:3000](http://localhost:3000)에서 확인 가능.

### 스크립트

| 명령어 | 설명 |
|--------|------|
| `yarn dev` | 개발 서버 실행 |
| `yarn build` | 프로덕션 빌드 |
| `yarn start` | 프로덕션 서버 실행 |
| `yarn lint` | ESLint 실행 |

## 프로젝트 구조

```
write-practice/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (폰트, 메타데이터)
│   └── page.tsx                # 메인 페이지 (타이핑 로직 통합)
├── interface/
│   └── typingTypeInterface.ts  # 도서 데이터 타입 정의
├── public/novel/
│   └── novel.json              # 도서 데이터 (소설/시/수필/명언)
└── scss/
    ├── global.scss             # 전역 스타일
    └── module/                 # 컴포넌트별 CSS Modules
```

## 데이터 구조

도서 데이터는 `public/novel/novel.json`에 저장되며, 아래 타입을 따름:

```typescript
interface TypingTypeInterface {
  id: number;
  title: string;
  author: string;
  content: string;       // 필사할 텍스트
  compiler?: string;     // 엮은이
  color: string;         // 표지 색상 (hex)
  genre: 'novel' | 'poem' | 'essay' | 'quote';
  difficulty?: 'easy' | 'medium' | 'hard';
  tag?: string[];
}
```

| 필드 | 설명 |
|------|------|
| `content` | 실제 필사할 텍스트 전문 |
| `genre` | 장르에 따라 문장 분리 방식이 다름 — 소설/수필은 `.` 기준, 시는 `\n` 기준, 명언은 단일 블록 |
| `color` | UI에서 작품별 표지 색상으로 사용 |
| `difficulty` | 난이도 (선택) |

## 라이선스

MIT License
