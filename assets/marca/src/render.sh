#!/bin/zsh
# Renderiza os SVGs em PNG com o Chrome em modo headless.
cd "$(dirname "$0")/.."
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
UD="${TMPDIR:-/tmp}/contraprova-chrome"
mkdir -p png "$UD"
r() {
  local nome=$1 w=$2 h=$3 bg=${4:-}
  "$CH" --headless=new --no-first-run --user-data-dir="$UD" --disable-gpu --hide-scrollbars \
    ${bg:+--default-background-color=$bg} \
    --screenshot="$PWD/png/$nome.png" --window-size=$w,$h "file://$PWD/svg/$nome.svg" >/dev/null 2>&1 &
  local pid=$!
  ( sleep 60 && kill $pid 2>/dev/null ) &
  wait $pid
}
for arg in "$@"; do r ${(s:,:)arg}; done
ls -la png
