#!/bin/bash
# Junta a narração de todos os blocos num único MP3 para o usuário ouvir e apontar correções ANTES de montar cenas/render.
# Saída em ~/Downloads/<tema>-narracao/ : narracao-completa.mp3 (blocos em ordem, 1 s de pausa entre eles),
# um MP3 por bloco (bloco-NN.mp3) e indice.txt (minuto de início de cada bloco + primeira frase).
# Uso: bash narracao-completa.sh <pasta-do-canal> <tema>
set -e
CANAL="$1"; TEMA="$2"; P="$CANAL/projetos/$TEMA"; OUT="$HOME/Downloads/$TEMA-narracao"
mkdir -p "$OUT"; TMP=$(mktemp -d)
ffmpeg -v error -y -f lavfi -i anullsrc=r=24000:cl=mono -t 1 -c:a libmp3lame -b:a 48k "$TMP/pausa.mp3"
: > "$TMP/lista.txt"; : > "$OUT/indice.txt"; acc=0
for f in $(ls "$P/audio" | grep -E '^[0-9]{2}\.mp3$' | sort); do
  n=${f%.mp3}
  ffmpeg -v error -y -i "$P/audio/$f" -ar 24000 -ac 1 -c:a libmp3lame -b:a 48k "$TMP/$n.mp3"
  cp "$P/audio/$f" "$OUT/bloco-$n.mp3"
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TMP/$n.mp3")
  printf "%02d:%02d  bloco %s  —  %s\n" $((${acc%.*}/60)) $((${acc%.*}%60)) "$n" "$(head -c 90 "$P/locucao/$n.txt" | tr '\n' ' ')" >> "$OUT/indice.txt"
  echo "file '$TMP/$n.mp3'" >> "$TMP/lista.txt"; echo "file '$TMP/pausa.mp3'" >> "$TMP/lista.txt"
  acc=$(python3 -c "print($acc + $d + 1)")
done
ffmpeg -v error -y -f concat -safe 0 -i "$TMP/lista.txt" -c:a libmp3lame -b:a 64k "$OUT/narracao-completa.mp3"
printf "total  %02d:%02d\n" $((${acc%.*}/60)) $((${acc%.*}%60)) >> "$OUT/indice.txt"
echo "Pronto: $OUT"; cat "$OUT/indice.txt"
