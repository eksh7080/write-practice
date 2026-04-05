현재 feature/bugfix/hotfix 브랜치의 변경사항을 분석하여 `develop` 브랜치로 Pull Request를 생성합니다.
커밋 메시지 인자:  (생략 시 커밋 목록 기반 자동 생성)

## 수행 단계

### 사전 검증

현재 브랜치를 확인하고, `main` 또는 `develop` 브랜치에서는 실행을 중단한다:

```bash
git branch --show-current
```

- 현재 브랜치가 `main` 또는 `develop`이면: "⚠️ main/develop 브랜치에서는 PR을 생성할 수 없습니다. feature/bugfix/hotfix 브랜치에서 실행해주세요." 출력 후 종료
- 미커밋 변경사항이 있으면: "⚠️ 미커밋 변경사항이 있습니다. `/push`로 먼저 커밋하거나, 커밋 없이 PR을 생성합니다." 안내

### 1단계: 현재 상태 수집

```bash
git branch --show-current
git status --short
git log develop..HEAD --oneline
git diff develop...HEAD --stat
```

### 2단계: 변경 내역 표시

사용자에게 다음 정보를 **표 형태**로 요약:

- 현재 브랜치명
- develop 대비 커밋 수 및 목록
- 변경된 파일 목록 (추가/수정/삭제 구분)
- 미커밋 변경사항 여부

변경사항이 전혀 없으면 "develop 브랜치와 차이가 없습니다." 출력 후 종료.

### 3단계: PR 정보 자동 생성

커밋 목록을 분석하여 PR 제목과 본문을 자동 생성한다.

**제목 결정 규칙**:
- 인자가 있는 경우: 인자를 PR 제목으로 사용
- 커밋이 1개인 경우: 해당 커밋 메시지를 그대로 사용
- 커밋이 여러 개인 경우: 커밋들의 주요 type을 파악하여 브랜치명 기반으로 생성
  - 예) `feat/home-develop` → `feat: home 개발`
  - 예) `bugfix/poem-line-break` → `fix: poem 줄바꿈 오류 수정`

**본문 자동 구성**:
```markdown
## Summary
- (커밋 목록 기반 bullet 목록)

## Changes
- (변경 파일 목록, 파일 수 포함)

## Test plan
- [ ] 로컬 `yarn build` 성공 확인
- [ ] 주요 기능 동작 확인

🤖 Generated with [Claude Code](https://claude.ai/claude-code)
```

### 4단계: 사용자 확인

AskUserQuestion으로 PR 내용 및 머지 방식 확인:

**질문 1**: "다음 내용으로 PR을 생성하시겠습니까?"
- 옵션 1: 생성 후 리뷰 대기 (추천)
- 옵션 2: 생성 후 바로 머지 (스쿼시)
- 옵션 3: 취소

### 5단계: PR 생성 실행

사용자가 수락하면:

```bash
# 원격에 브랜치 없거나 뒤처진 경우 push
git push origin $(git branch --show-current)

# gh CLI로 PR 생성 (target: develop)
gh pr create \
  --base develop \
  --title "PR 제목" \
  --body "PR 본문"
```

**주의사항**:
- `gh` CLI 미설치 시: "gh CLI가 필요합니다. `brew install gh` 후 `gh auth login`으로 인증해주세요." 안내
- `gh` 미인증 시: "`gh auth login`으로 GitHub 인증이 필요합니다." 안내
- push 실패 시: 에러 메시지 출력 후 중단

### 6단계: 머지 (선택한 경우)

"생성 후 바로 머지"를 선택한 경우:

```bash
# PR 번호 파싱 후 스쿼시 머지
gh pr merge [PR번호] --squash --delete-branch
```

- `--squash`: 커밋을 하나로 합쳐 머지 (develop 브랜치 히스토리 깔끔하게 유지)
- `--delete-branch`: 머지 후 원격 브랜치 자동 삭제

### 7단계: 결과 출력

PR 생성만 한 경우:
```
✅ PR 생성 완료
  브랜치: feat/xxx → develop
  제목: feat: xxx
  PR URL: https://github.com/...
```

머지까지 한 경우:
```
✅ PR 머지 완료
  브랜치: feat/xxx → develop (브랜치 삭제됨)
  제목: feat: xxx
  PR URL: https://github.com/...
```
