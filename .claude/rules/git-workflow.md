# Git 워크플로우 규칙

## 브랜치 전략

### 브랜치 구조
```
main        ← 배포 가능한 안정 브랜치
  └── develop   ← 개발 통합 브랜치 (기본 작업 브랜치)
        ├── feature/기능설명
        ├── bugfix/버그설명
        └── hotfix/긴급수정
```

### 브랜치 네이밍
- feature: `feature/기능설명` (예: `feature/wpm-display`)
- bugfix: `bugfix/버그설명` (예: `bugfix/poem-line-break`)
- hotfix: `hotfix/설명` (예: `hotfix/json-parse-error`)

### 브랜치 규칙
- main에 직접 커밋/푸시 금지
- develop에서 feature 분기, main에서 hotfix 분기
- feature 완료 후 develop으로 머지

## 커밋 메시지 규칙

### Conventional Commits 형식
```
type(scope): subject
```

### type
| type | 설명 |
|------|------|
| feat | 새로운 기능 추가 |
| fix | 버그 수정 |
| docs | 문서 변경 |
| style | 코드 포맷팅 (기능 변경 없음) |
| refactor | 리팩토링 |
| test | 테스트 추가/수정 |
| chore | 빌드, 설정 변경 |
| perf | 성능 개선 |

### 예시
```
feat(typing): WPM 실시간 표시 추가
fix(poem): 시 장르 줄바꿈 처리 오류 수정
refactor(page): 페이지네이션 로직 커스텀 훅으로 추출
chore: ESLint 규칙 추가
```

### subject 규칙
- 한국어/영어 모두 허용
- 72자 이내
- 마침표(.) 없이 끝냄
