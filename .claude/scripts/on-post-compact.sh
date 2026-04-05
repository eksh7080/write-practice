#!/bin/bash
INPUT=$(cat)
CWD=$(echo "$INPUT" | python3 -c "import sys,json;print(json.load(sys.stdin).get('cwd',''))" 2>/dev/null || echo "")
if [ -z "$CWD" ]; then
  CWD=$(pwd)
fi
PROJECT_HASH=$(echo "$CWD" | sed 's|/|-|g')
MEMORY_DIR="$HOME/.claude/projects/$PROJECT_HASH/memory"
CONTEXT=""
if [ -f "$MEMORY_DIR/MEMORY.md" ]; then
  SUMMARY=$(head -100 "$MEMORY_DIR/MEMORY.md" | python3 -c "import sys;print(sys.stdin.read().replace('\\\\','\\\\\\\\').replace('\"','\\\\\"').replace('\n','\\\\n'))" 2>/dev/null)
  CONTEXT="컨텍스트가 압축되었습니다.\\n\\n[세션 요약]\\n${SUMMARY}"
fi
if [ -f "$MEMORY_DIR/project-snapshot.md" ]; then
  SNAP=$(head -50 "$MEMORY_DIR/project-snapshot.md" | python3 -c "import sys;print(sys.stdin.read().replace('\\\\','\\\\\\\\').replace('\"','\\\\\"').replace('\n','\\\\n'))" 2>/dev/null)
  CONTEXT="${CONTEXT}\\n\\n[프로젝트 최신 상태]\\n${SNAP}"
fi
if [ -n "$CONTEXT" ]; then
  CONTEXT="${CONTEXT}\\n\\n위 내용을 참고하여 작업을 이어가세요. 상세 내용은 memory/ 디렉토리의 각 파일을 참조하세요."
  echo "{\"hookSpecificOutput\":{\"additionalContext\":\"${CONTEXT}\"}}"
else
  echo "{\"hookSpecificOutput\":{\"additionalContext\":\"컨텍스트가 압축되었습니다. memory 파일이 없으므로 사용자에게 이전 작업 내용을 확인하세요.\"}}"
fi
