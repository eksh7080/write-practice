# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

책 필사 타자연습 서비스 — 소설/시 텍스트를 보고 타이핑하며 필사하는 웹 앱.

## 명령어

```bash
yarn dev      # 개발 서버 (localhost:3000)
yarn build    # 프로덕션 빌드
yarn lint      # ESLint 실행
npx prettier --write .  # Prettier 자동 수정
```

테스트 프레임워크는 설정되어 있지 않음.

## 기술 스택

- Next.js 16.1.0 (App Router) + React 19 + TypeScript 5
- 스타일: SCSS CSS Modules (`scss/module/*.module.scss`)
- 폰트: Noto Sans KR (Google Fonts, `next/font`)
- 아이콘: lucide-react
- 패키지 매니저: yarn
- 린터: ESLint + Prettier + unused-imports 플러그인

## 아키텍처

**단일 페이지 앱 구조**: 현재 라우트는 홈(`app/page.tsx`) 하나뿐. `app/typing/` 경로가 구조에 있으나 실제 타이핑 로직은 홈 페이지에 통합되어 있음.

**핵심 데이터 흐름**:
- 도서 데이터: `public/novel/novel.json` → `TypingTypeInterface[]` 타입으로 import
- 장르(`novel` | `poem`)에 따라 문장 분리 방식이 다름: 소설은 `.` 기준, 시는 `\n` 기준
- 페이지네이션: `CHARS_PER_PAGE`(350자) 단위로 콘텐츠를 분할
- 타이핑 완료 시 정확도/WPM 계산 후 모달 표시

**디스커버리 실험**: localStorage 기반 A/B 테스트 메트릭 수집 (fake door, 설문, 통계 클릭, 진행 상태 저장/복원)

**스타일 컨벤션**: 모든 컴포넌트 스타일은 `scss/module/` 하위 CSS Modules 사용. 전역 스타일은 `scss/global.scss`, `_font.scss`, `_layout.scss`.

## 타입 정의

`interface/typingTypeInterface.ts`에 도서 데이터 타입 정의. `genre` 필드는 `'novel' | 'poem'` 리터럴 타입.

## 프로젝트 구조

```
write-practice/
├── app/
│   ├── layout.tsx         루트 레이아웃 (폰트, 메타데이터)
│   └── page.tsx           홈 페이지 (타이핑 로직 통합)
├── interface/
│   └── typingTypeInterface.ts   도서 데이터 타입 정의
├── public/
│   └── novel/
│       └── novel.json     도서 데이터 (소설/시 목록)
├── scss/
│   ├── global.scss        전역 스타일
│   ├── _font.scss         폰트 설정
│   ├── _layout.scss       레이아웃 기본값
│   └── module/            컴포넌트별 CSS Modules
└── .claude/
    ├── rules/             코드 스타일, 네이밍, Git, 정책, 테스트 규칙
    ├── agents/            explorer, implementer 에이전트
    ├── skills/push/       커밋+푸시 자동화 스킬
    └── scripts/           세션 압축/커밋 훅 스크립트
```

## Claude Code 컨벤션

`.claude/rules/` 디렉토리 참조:
- `code-style.md` — TypeScript/React 코드 스타일 (Next.js App Router, SCSS)
- `naming.md` — 네이밍 규칙
- `git-workflow.md` — 브랜치/커밋 규칙 (Conventional Commits)
- `policy.md` — 보안/품질 정책
- `testing.md` — 테스트 규칙 (Vitest 도입 예정)

스킬:
- `/push` — 변경 사항 확인 후 커밋 + 푸시 (메시지 자동 생성)
