#!/bin/bash
# Cria um projeto de vídeo novo a partir do modelo da skill.
# Uso: bash novo-projeto.sh <pasta-do-canal> <nome-do-projeto>
# Resultado: <canal>/projetos/<nome>/{roteiro.md, locucao/, audio/, render/, qa/, video/}
set -e
CANAL="$1"; NOME="$2"
[ -z "$CANAL" ] || [ -z "$NOME" ] && { echo "uso: novo-projeto.sh <pasta-do-canal> <nome>"; exit 1; }
SKILL="$(cd "$(dirname "$0")/../.." && pwd)"
P="$CANAL/projetos/$NOME"
mkdir -p "$P/locucao" "$P/audio" "$P/render/blocos" "$P/qa"
[ -d "$P/video" ] && { echo "já existe $P/video — não sobrescrevo"; exit 1; }
cp -R "$SKILL/assets/producao-template-video" "$P/video"
mkdir -p "$CANAL/ferramentas"
cp -n "$SKILL"/assets/producao-ferramentas/*.py "$CANAL/ferramentas/" 2>/dev/null || true
cd "$P/video"
echo "Instalando dependências (versões travadas pelo package-lock)…"
npm ci --no-audit --no-fund
echo "Gerando trilhas e efeitos originais (síntese, sem direitos de terceiros)…"
PY="$CANAL/.venv/bin/python"; [ -x "$PY" ] || PY=python3
for g in "$CANAL"/ferramentas/gerar-sfx*.py "$CANAL"/ferramentas/gerar-trilhas*.py; do "$PY" "$g" public/sfx; done
# sons-base do 1º vídeo (clique, carimbo, impacto, pulso, subida, tensao): arquivos prontos, sem gerador
cp "$SKILL"/assets/producao-sfx-base/*.mp3 public/sfx/
[ -f "$P/locucao/siglas.json" ] || echo '{"IBGE": "IBGE"}' > "$P/locucao/siglas.json"
[ -f "$P/locucao/substituicoes.json" ] || echo '{}' > "$P/locucao/substituicoes.json"
cp "$SKILL/scripts/producao/render-final.sh" "$P/render-final.sh"; chmod +x "$P/render-final.sh"
echo "Projeto criado em $P. Próximo passo: roteiro.md → extrair-locucao.py → gerar-audio.sh."
