develop 브랜치와 원격 동기화를 확인하고, 릴리즈 노트를 정리한 뒤 develop → main PR을 생성합니다.
사용자 승인 시 머지까지 자동 처리합니다.

## 수행 단계

### 사전 검증

```bash
git branch --show-current
git status --short
```

- `develop` 브랜치가 아니면: "⚠️ develop 브랜치에서 실행해주세요." 출력 후 종료
- 미커밋 변경사항이 있으면: "⚠️ 먼저 `/push`로 커밋하세요." 출력 후 종료

### 1단계: develop 브랜치 동기화 확인

```bash
git fetch origin
git rev-parse develop
git rev-parse origin/develop
git merge-base develop origin/develop
```

| 상태 | 조건 | 행동 |
|------|------|------|
| 동일 | LOCAL == REMOTE | 바로 진행 |
| 로컬 뒤처짐 | LOCAL == BASE | "`git pull origin develop` 후 다시 시도하세요" 후 종료 |
| 로컬 앞섬 | REMOTE == BASE | push되지 않은 커밋 있음 → `/push` 실행 안내 |
| 분기됨 | 그 외 | "분기되었습니다. 수동으로 해결해주세요" 후 종료 |

### 2단계: develop → main 차이 분석

```bash
git log origin/main..develop --oneline
git diff origin/main..develop --stat
git rev-list --count origin/main..develop
```

차이가 없으면 "릴리즈할 변경이 없습니다." 출력 후 종료.

### 3단계: 릴리즈 노트 작성

`docs/RELEASE-NOTES.md`가 없으면 새로 생성한다.

**파일 구조 (없는 경우 초기화)**:
```markdown
# RELEASE NOTES

## [Unreleased]

### Added
### Fixed
### Changed
### Removed
```

main 대비 develop의 커밋 목록을 분석하여 type별로 분류:
- `feat` → Added
- `fix` → Fixed
- `refactor`, `perf`, `style` → Changed
- 그 외 (`chore`, `docs`, `test`) → 본문에는 포함하되 별도 섹션 없이 참고용

분류한 내용을 [Unreleased] 섹션에 bullet 목록으로 채운다.
이미 [Unreleased]에 항목이 있으면 중복 제거 후 병합한다.

### 4단계: [Unreleased] → 날짜 버전 전환

```
## [Unreleased]  →  ## [YYYY-MM-DD]
```

같은 날 이전 릴리즈가 이미 있으면 순번 부여: `[YYYY-MM-DD.2]`, `[YYYY-MM-DD.3]`
[Unreleased]는 빈 섹션으로 다시 생성한다.

### 5단계: 사용자 확인 (AskUserQuestion)

최종 릴리즈 노트 내용을 표시하고 확인:

**질문**: "릴리즈 노트를 확인해주세요. 어떻게 진행할까요?"
- 옵션 1: 이대로 PR 생성 (추천)
- 옵션 2: PR 생성 후 바로 머지
- 옵션 3: 취소

### 6단계: 릴리즈 노트 커밋 + 푸시

```bash
git add docs/RELEASE-NOTES.md
git commit -m "docs: 릴리즈 노트 정리 (YYYY-MM-DD)"
git push origin develop
```

### 7단계: PR 생성

```bash
gh pr create \
  --base main \
  --title "release: YYYY-MM-DD" \
  --body "$(릴리즈 노트 해당 날짜 섹션 내용)"
```

### 8단계: 머지 (선택한 경우)

"PR 생성 후 바로 머지"를 선택한 경우:

```bash
# PR 번호 파싱 후 머지 (develop 브랜치는 삭제하지 않음)
gh pr merge [PR번호] --merge
```

⚠️ `--delete-branch` 없음 — develop 브랜치는 삭제하지 않는다.
⚠️ main → develop 방향이므로 `--squash` 대신 `--merge` 사용 (히스토리 보존)

### 9단계: 결과 출력

PR만 생성한 경우:
```
✅ 릴리즈 PR 생성 완료
  브랜치: develop → main
  PR URL: https://github.com/...
  릴리즈 노트: [YYYY-MM-DD] 생성됨

  다음 단계: PR 리뷰 후 머지
```

머지까지 완료한 경우:
```
✅ 릴리즈 완료
  브랜치: develop → main
  PR URL: https://github.com/...
  릴리즈 노트: [YYYY-MM-DD] 생성됨
  머지: 완료 ✅

  다음 단계: Vercel 자동 배포 확인
```
