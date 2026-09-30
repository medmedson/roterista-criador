#!/bin/bash
# Calcula os tempos REAIS de início de cada bloco no vídeo final (para os capítulos da descrição do YouTube).
# Uso: bash capitulos.sh <pasta-do-projeto>
cd "$1/video" || exit 1
npx remotion compositions 2>/dev/null | awk '/^Bloco[0-9][0-9] /{print $1, $4}' | sort | awk '{s=int(acc/30+0.5); printf "%02d:%02d  %s\n", s/60, s%60, $1; acc+=$2} END {t=int(acc/30); printf "total  %02d:%02d\n", t/60, t%60}'
