---
description: 노드 모듈 install 및 로컬 개발환경 실행
allowed-tools: [Bash, AskUserQuestion]
---

# 개발 서버 실행기

## 실행 순서

아래 단계를 순서대로 진행합니다:

### 1단계: 패키지 매니저 자동 감지

아래 락파일을 확인해 사용 중인 패키지 매니저를 판별합니다:

```bash
test -f yarn.lock && echo "yarn" || test -f pnpm-lock.yaml && echo "pnpm" || echo "npm"
```

- `yarn.lock` 존재 → `yarn`
- `pnpm-lock.yaml` 존재 → `pnpm`
- 둘 다 없으면 → `npm`

### 2단계: node_modules 확인

프로젝트 루트에 `node_modules`가 존재하는지 확인합니다:

```bash
test -d node_modules && echo "exists" || echo "missing"
```

### 3단계: 의존성 설치 (없는 경우)

`node_modules`가 **없는 경우**, 1단계에서 감지한 패키지 매니저로 설치합니다:
- yarn → `yarn install`
- pnpm → `pnpm install`
- npm → `npm install`

`node_modules`가 **이미 있는 경우**, 이 단계를 건너뜁니다.

### 4단계: 개발 스크립트 감지 및 실행

`package.json`을 읽어 로컬 개발 스크립트를 찾습니다. 일반적인 이름: `dev`, `start`, `serve`, `develop`.

1단계에서 감지한 패키지 매니저로 스크립트를 실행합니다:
- yarn → `yarn dev`
- pnpm → `pnpm dev`
- npm → `npm run dev`

개발용 스크립트가 여러 개 있는 경우, 실행 전에 사용자에게 어떤 것을 실행할지 물어봅니다.
