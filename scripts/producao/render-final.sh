#!/bin/bash
# Render final: cada bloco separado (retomável: bloco já pronto é pulado), junta e normaliza o áudio (-14 LUFS).
# Não gera prévia (o usuário pediu: só o arquivo final). Uso: ./render-final.sh   (na pasta do projeto)
set -e
cd "$(dirname "$0")/video"
NOME="$(basename "$(cd .. && pwd)")"
BLOCOS=$(ls src/cenas | grep -E '^Bloco[0-9]{2}\.tsx$' | sed -E 's/Bloco([0-9]{2})\.tsx/\1/' | sort)
mkdir -p ../render/blocos
for n in $BLOCOS; do
  out=../render/blocos/bloco$n.mp4
  if [ -f "$out" ]; then echo "bloco $n já existe"; continue; fi
  echo "$(date +%H:%M) renderizando bloco $n"
  npx remotion render Bloco$n "$out.tmp.mp4" --concurrency=4 --timeout=120000 --crf=23 --jpeg-quality=75 --log=error
  mv "$out.tmp.mp4" "$out"
done
cd ../render
ls blocos/bloco*.mp4 | sed "s/^/file '/; s/$/'/" > lista.txt
# uma passada só (sem arquivo intermediário: economiza o espaço de um vídeo inteiro no disco)
ffmpeg -v error -y -f concat -safe 0 -i lista.txt -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 "$NOME-documentario-final.mp4"
echo "$(date +%H:%M) PRONTO"
ls -la "$NOME-documentario-final.mp4"
