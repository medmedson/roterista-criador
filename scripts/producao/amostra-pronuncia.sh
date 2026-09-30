#!/bin/bash
# Gera amostras de pronúncia para o usuário escolher (uma variante por linha, em frase de contexto).
# Uso: bash amostra-pronuncia.sh <pasta-do-canal> <saida.mp3> "frase 1" "frase 2" ...
CANAL="$1"; OUT="$2"; shift 2
TMP=$(mktemp -d); i=0; lista=""
for f in "$@"; do i=$((i+1)); "$CANAL/.venv/bin/edge-tts" -v fr-FR-RemyMultilingualNeural --rate=-5% --text "$f" --write-media "$TMP/$i.mp3"; lista="$lista|$TMP/$i.mp3"; done
ffmpeg -v error -y -i "concat:${lista#|}" -c copy "$OUT" && echo "amostras em $OUT (ordem = ordem das frases)"
