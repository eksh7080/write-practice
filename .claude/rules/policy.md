# 개발 정책

## 보안 정책

### 금지 행위
- `.env`, `.env.*`, `secrets/` 파일 내용 출력 금지
- API 키, 토큰 등 민감 정보를 코드에 하드코딩 금지
- `git push --force`, `git reset --hard`, `git clean -fd` 실행 금지
- `rm -rf /`, `rm -rf ~`, `rm -rf .git` 등 파괴적 명령 실행 금지
- main 브랜치에 직접 push 금지

### 환경변수 관리
- 환경변수는 `.env.local` 파일로 관리
- `.env.local`은 `.gitignore`에 포함
- 공개 가능한 예시만 `.env.example`로 커밋

## 코드 품질 정책

### 필수 검증
- 커밋 전 빌드(`yarn build`) 성공 확인
- 린트 경고 0개 유지 (`yarn lint`)
- TypeScript 타입 에러 없음 확인

## 문서화 정책
- 복잡한 비즈니스 로직에는 의도를 설명하는 주석 작성
- 매직 넘버/상수는 이름 있는 상수로 추출하고 용도 명시
- `CLAUDE.md`의 아키텍처 설명을 최신 상태로 유지
