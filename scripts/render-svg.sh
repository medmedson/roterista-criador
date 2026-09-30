#!/bin/zsh
# SVG -> PNG com Chrome headless. Uso: render-svg.sh <pasta-marca> nome,largura,altura[,corFundo] ...
# Ex.: render-svg.sh ~/canaldark/marca miniatura-x,1280,720
# Regras aprendidas: user-data-dir NOVO a cada chamada, roda em segundo plano com timeout,
# senão o Chrome trava. --virtual-time-budget dá tempo aos filtros SVG (feTurbulence).
cd "$1" || exit 1; shift
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p png
for arg in "$@"; do
  nome=${${(s:,:)arg}[1]}; w=${${(s:,:)arg}[2]}; h=${${(s:,:)arg}[3]}; bg=${${(s:,:)arg}[4]}
  UD=$(mktemp -d)
  "$CH" --headless=new --no-first-run --user-data-dir="$UD" --disable-gpu --hide-scrollbars \
    --virtual-time-budget=8000 ${bg:+--default-background-color=$bg} \
    --screenshot="$PWD/png/$nome.png" --window-size=$w,$h "file://$PWD/svg/$nome.svg" >/dev/null 2>&1 &
  pid=$!
  ( sleep 60 && kill $pid 2>/dev/null ) &
  wait $pid
  rm -rf "$UD"
  ls -la "png/$nome.png"
done
