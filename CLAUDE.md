# 필사 프로젝트

남녀노소 누구나 사용할 수 있는 타이핑 서비스

---

## 실행 방법

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# 빌드
yarn build

# 프로덕션 서버 실행
yarn start
```

개발 서버: http://localhost:3000

---

## 기술 스택

| 분류          | 기술               |
| ------------- | ------------------ |
| 프레임워크    | Next.js 16.1.0     |
| 언어          | TypeScript 5       |
| UI 라이브러리 | React 19           |
| 스타일        | SCSS (CSS Modules) |
| 아이콘        | lucide-react       |
| 패키지 매니저 | yarn               |
| 린터          | ESLint + Prettier  |

---

## 프로젝트 구조

```
write-practice/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈 페이지
│   └── typing/
│       └── page.tsx            # 타이핑 페이지
├── components/                 # 공통 컴포넌트
│   └── Header.tsx              # 헤더 컴포넌트
├── interface/                  # TypeScript 인터페이스
│   └── typingTypeInterface.ts  # 타이핑 관련 타입 정의
├── scss/                       # 스타일
│   ├── global.scss             # 전역 스타일
│   ├── _font.scss              # 폰트 설정
│   ├── _layout.scss            # 레이아웃 설정
│   └── module/                 # CSS Modules
│       ├── header.module.scss
│       ├── home.module.scss
│       └── typing.module.scss
├── public/                     # 정적 파일
├── next.config.ts              # Next.js 설정
└── tsconfig.json               # TypeScript 설정
```
