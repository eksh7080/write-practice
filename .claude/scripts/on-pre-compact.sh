#!/bin/bash
# PreCompact hook: systemMessage만 지원 (hookSpecificOutput 사용 불가)
INPUT=$(cat)
cat <<RESP
{
  "systemMessage": "컨텍스트 압축이 시작됩니다. 반드시 다음을 수행하세요:\n\n1. memory/MEMORY.md - 핵심 작업 상태 갱신 (200줄 이내)\n2. memory/project-snapshot.md - 변경된 컴포넌트/타입 정보 업데이트\n3. memory/project-history.md - 이번 세션 변경사항 추가\n4. 미완료 작업이 있다면 TodoWrite에 남기고 memory에도 기록"
}
RESP
