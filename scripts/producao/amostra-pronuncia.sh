#!/bin/bash
# Gera amostras de pronúncia para o usuário escolher, SEMPRE em pasta de Downloads (o anexo no chat nem sempre abre).
# Uso: bash amostra-pronuncia.sh <pasta-do-canal> <assunto> "rotulo-1|frase 1" "rotulo-2|frase 2" ...
#  - a frase deve vir com contexto (frase anterior/seguinte), nunca a palavra sozinha;
#  - rotulo curto e claro: "A-atual", "B-sigla-direta", "C-nome-completo"...
# Saída: ~/Downloads/<assunto>-opcoes/opcao-N-<rotulo>.mp3 + todas-em-sequencia.mp3
CANAL="$1"; ASSUNTO="$2"; shift 2
OUT="$HOME/Downloads/$ASSUNTO-opcoes"; mkdir -p "$OUT"; i=0; lista=""
for par in "$@"; do
  i=$((i+1)); rot="${par%%|*}"; frase="${par#*|}"
  "$CANAL/.venv/bin/edge-tts" -v fr-FR-RemyMultilingualNeural --rate=-5% --text "$frase" --write-media "$OUT/opcao-$i-$rot.mp3" 2>/dev/null
  lista="$lista|$OUT/opcao-$i-$rot.mp3"
done
ffmpeg -v error -y -i "concat:${lista#|}" -c copy "$OUT/todas-em-sequencia.mp3"
echo "Amostras em $OUT:"; ls "$OUT"
