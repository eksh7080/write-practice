---
name: push
description: 변경 사항을 확인하고 커밋 + 푸시합니다
user-invokable: true
argument-hint: "[commit-message] (생략 시 자동 생성)"
---

현재 브랜치의 변경 사항을 확인하고, 사용자 승인 후 커밋 + 푸시합니다.
커밋 메시지 인자: $ARGUMENTS (생략 시 변경 내용 기반 자동 생성)

## 수행 단계

### 1. 현재 상태 수집

```bash
git branch --show-current
git status --short
git diff --stat
git diff --cached --stat
```

### 2. 변경 범위 표시

사용자에게 다음 정보를 **표 형태**로 요약:

- 현재 브랜치명
- 변경된 파일 목록 (추가/수정/삭제 구분)
- staged vs unstaged 구분
- 변경 라인 수 요약

변경 사항이 없으면 "커밋할 변경 사항이 없습니다" 출력 후 종료.

### 3. 커밋 메시지 결정

**인자가 있는 경우** ($ARGUMENTS가 비어있지 않으면):
- 전달받은 메시지를 커밋 메시지로 사용
- Conventional Commits 형식인지 검증 (아니면 자동 보정 제안)

**인자가 없는 경우**:
- 변경 내용을 분석하여 Conventional Commits 형식 메시지 자동 생성
- 형식: `type(scope): 한국어 설명`
- type 판단 기준:
  - 새 파일 추가 → `feat`
  - 기존 파일 수정 → `fix` 또는 `refactor`
  - 테스트 파일 → `test`
  - 설정/빌드 파일 → `chore`
  - 문서 파일 → `docs`

### 4. 사용자 확인

AskUserQuestion으로 다음을 확인:

**질문**: "다음 내용으로 커밋하시겠습니까?"
- 옵션 1: 제안된 메시지로 커밋 (추천)
- 옵션 2: 메시지 수정 (Other 입력)
- 옵션 3: 취소

### 5. 커밋 + 푸시 실행

사용자가 수락하면:

```bash
# 모든 변경 사항 스테이징 (.env 등 민감 파일 제외 확인 후)
git add -A

# 커밋
git commit -m "커밋메시지"

# 푸시 (리모트 트래킹 없으면 -u 추가)
git push origin $(git branch --show-current)
```

**주의사항**:
- `git add` 전 `.env.local`, `*.key`, `secrets/` 포함 여부 경고
- pre-commit hook 실패 시 에러 메시지 후 수동 해결 안내
- 리모트에 브랜치 없으면 `git push -u origin {branch}` 사용

### 6. 결과 출력

```
✅ 푸시 완료
  브랜치: feature/wpm-display
  커밋: abc1234 feat(typing): WPM 실시간 표시 추가
  변경: 3 files changed, 45 insertions(+), 12 deletions(-)
```
