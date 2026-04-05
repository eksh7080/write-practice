#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json;print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")
if echo "$COMMAND" | grep -qE 'git commit'; then
  cat <<RESP
{
  "hookSpecificOutput": {
    "additionalContext": "커밋이 감지되었습니다. 다음을 확인하세요:\n1. memory/project-snapshot.md에서 변경된 컴포넌트/로직 업데이트\n2. memory/project-history.md에 이번 변경사항 추가\n3. yarn lint — 경고 0개 유지"
  }
}
RESP
else
  echo '{}'
fi
