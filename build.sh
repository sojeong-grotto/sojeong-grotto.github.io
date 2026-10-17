#!/usr/bin/env bash
# index.html → A4 PDF 생성 (Google Chrome headless)
# 사용법: ./build.sh            PDF 생성
#         ./build.sh check      페이지 넘침 점검
set -euo pipefail
cd "$(dirname "$0")"
CHROME="${CHROME:-google-chrome}"
URL="file://$PWD/index.html"

if [[ "${1:-}" == "check" ]]; then
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --window-size=1200,1600 \
    --virtual-time-budget=8000 --dump-dom "$URL?check" 2>/dev/null \
    | sed -n '/<pre id="check">/,/<\/pre>/p' | sed 's/<[^>]*>//g'
  exit 0
fi

OUT="김소정_로봇SW_포트폴리오.pdf"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
  --print-to-pdf="$PWD/$OUT" "$URL" 2>/dev/null
echo "생성: $PWD/$OUT"
