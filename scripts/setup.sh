#!/bin/bash
# Prepara uma máquina nova (macOS) para o fluxo do canal. Uso: bash setup.sh [PASTA_DO_CANAL]
# Idempotente: pode rodar de novo. Não instala nada sem avisar.
set -u
RAIZ="${1:-$HOME/canaldark}"
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
ok(){ echo "  ok   $1"; }; falta(){ echo "  FALTA $1"; }
echo "== Ferramentas do sistema"
for c in node npm python3 ffmpeg ffprobe curl jq git; do command -v $c >/dev/null && ok "$c ($($c --version 2>&1 | head -1))" || falta "$c"; done
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CH" ] && ok "Google Chrome (usado headless para PNG das capas)" || falta "Google Chrome em /Applications"
echo "  (faltando algo? macOS: brew install node python ffmpeg jq ; Chrome pelo site oficial)"
echo "== Pasta do canal: $RAIZ"
mkdir -p "$RAIZ"/{projetos,ferramentas,marca}
cp -Rn "$SKILL/assets/marca/." "$RAIZ/marca/" && ok "marca/ (gerador de logo e capas, fontes)"
cp -n "$SKILL/assets/producao-ferramentas/"* "$RAIZ/ferramentas/" && ok "ferramentas/ (normalizar, trilhas, sfx)"
echo "== Dependências Node da marca (opentype.js)"
(cd "$RAIZ/marca" && npm install --silent) && ok "npm install em marca/"
echo "== Python: venv com edge-tts e numpy (narração e trilhas)"
if [ ! -d "$RAIZ/.venv" ]; then python3 -m venv "$RAIZ/.venv"; fi
"$RAIZ/.venv/bin/pip" install --quiet edge-tts numpy pillow && ok ".venv com edge-tts, numpy e pillow"
echo "== Manter a tela ligada em tarefas longas (render, pesquisa): caffeinate -dimsu -t 86400 &"
echo "   Nunca use 'pkill caffeinate': pode matar o de outra sessão."
echo "== Pronto. Próximo passo: ler $SKILL/SKILL.md e references/00-visao-geral.md"
