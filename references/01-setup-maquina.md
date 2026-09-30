# Setup da máquina (macOS)

## Instalar
| Ferramenta | Para quê | Como |
|---|---|---|
| Claude Code (desktop ou CLI) | sessões de roteiro e produção | oficial |
| Node ≥ 20 + npm | gerador de capas, Remotion | `brew install node` |
| Python ≥ 3.10 | edge-tts, trilhas, normalizador | `brew install python` |
| ffmpeg/ffprobe | mixagem, concatenação, loudnorm | `brew install ffmpeg` |
| Google Chrome | PNG das capas (headless) e navegação | site oficial |
| curl, jq, git | APIs oficiais, JSON | `brew install jq` |

`bash ~/.claude/skills/apuracao-oficial/scripts/setup.sh [PASTA]` confere tudo, copia `marca/` e `ferramentas/` para `~/canaldark`, roda `npm install` e cria `.venv` com `edge-tts` e `numpy`.

## Estrutura de pastas
```
~/canaldark/
  marca/        gerador de identidade e capas (src/, fontes/, svg/, png/, GUIA-DA-MARCA.md)
  ferramentas/  normalizar.py, gerar-trilhas-*.py, gerar-sfx-*.py
  .venv/        edge-tts, numpy
  projetos/<tema>/
    roteiro.md
    apuracao/NN-*.md
    locucao/ audio/ video/ qa/ render/   (criados pela sessão de produção)
```

## Ferramentas de sessão usadas
- **WebSearch** (com `allowed_domains`), **WebFetch**, **Bash + curl** para APIs.
- **Agent** (subagentes gerais) para pesquisa paralela e auditoria.
- **Navegador do app** (`mcp__Claude_Browser__*`) para páginas com JavaScript e Google.
- **send_message** entre sessões (`mcp__ccd_session_mgmt__send_message`), com o id da sessão de produção.
- **Skills auxiliares** que ajudam: `remotion-best-practices` (produção), `research`.

## Regras de operação aprendidas
- Tela ligada em trabalho longo: `caffeinate -dimsu -t 86400 &`. **Nunca `pkill caffeinate`** (mata o de outra sessão e derruba renders).
- Disco: Remotion enche `/var/folders/.../T/` com pastas `remotion-*`. Rodar QA/render com `TMPDIR` próprio e checar `df -h /` (o render final pede ~3 GB livres).
- Chrome headless trava se reutilizar o perfil: sempre `--user-data-dir=$(mktemp -d)`, rodar em segundo plano com timeout e `--virtual-time-budget=8000`. Use `scripts/render-svg.sh`.
- `sleep` encadeado é bloqueado; para esperar, use laço `until ...; do :; done` ou o modo em segundo plano.
- Edição de texto com acentos: usar Python (`str.replace`) e não `perl -i`/`sed` cegos.
- Não abrir nem apagar pastas temp de outra sessão.

## Conferir se está tudo igual
```
node -v; python3 -V; ffmpeg -version | head -1
~/canaldark/.venv/bin/edge-tts --list-voices | grep RemyMultilingual
cd ~/canaldark/marca && node src/gerar.mjs && ls svg
```
