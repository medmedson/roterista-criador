#!/bin/bash
# Confere se a máquina tem tudo para produzir os vídeos. Uso: bash verificar-ambiente.sh <pasta-do-canal>
CANAL="${1:-$PWD}"
ok=1
chk() { if command -v "$1" >/dev/null 2>&1; then echo "OK   $1: $($2 2>&1 | head -1)"; else echo "FALTA $1  →  $3"; ok=0; fi; }
chk node "node -v" "brew install node   (testado com Node 23.5, npm 10.9)"
chk npm "npm -v" "vem com o node"
chk ffmpeg "ffmpeg -version" "brew install ffmpeg   (testado com 8.1)"
chk ffprobe "ffprobe -version" "vem com o ffmpeg"
chk python3 "python3 --version" "brew install python   (testado com 3.14)"
if [ -x "$CANAL/.venv/bin/edge-tts" ]; then echo "OK   edge-tts (venv): $($CANAL/.venv/bin/pip show edge-tts 2>/dev/null | grep Version)"; else echo "FALTA venv com edge-tts, numpy, pillow  →  python3 -m venv $CANAL/.venv && $CANAL/.venv/bin/pip install edge-tts==7.2.8 numpy pillow"; ok=0; fi
if [ -x "$CANAL/.venv/bin/python" ]; then "$CANAL/.venv/bin/python" -c "import numpy, PIL" 2>/dev/null && echo "OK   numpy + pillow" || { echo "FALTA numpy/pillow no venv  →  $CANAL/.venv/bin/pip install numpy pillow"; ok=0; }; fi
echo "Disco livre: $(df -h / | tail -1 | awk '{print $4}')   (render de ~25 min precisa de ~4 GB livres)"
[ $ok = 1 ] && echo "Ambiente pronto." || { echo "Instale o que falta e rode de novo."; exit 1; }
