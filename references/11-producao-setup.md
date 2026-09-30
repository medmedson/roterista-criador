# Produção: setup da máquina e ferramentas

Testado em macOS 26 (Apple Silicon, arm64). Versões que funcionaram juntas (29/09/2026):

| Ferramenta | Versão | Para quê |
|---|---|---|
| Node.js / npm | 23.5 / 10.9 | Remotion (render das cenas) |
| Remotion + @remotion/* | 4.0.529 (travado no package-lock) | cenas em React, render, still |
| React | 19.2.3 | idem |
| TypeScript | 5.9.3 | checagem `npx tsc --noEmit` |
| d3-geo | 3.1 | projeção dos mapas (gerar-dados.mjs) |
| ffmpeg / ffprobe | 8.1 | junção, loudnorm, cortes de áudio, extração de quadros |
| Python | 3.14 | normalizador, síntese de som, folha de contato |
| edge-tts | 7.2.8 | narração (voz Remy) |
| numpy | 2.5 | síntese de trilhas e efeitos |
| Pillow | 12.3 | folha de contato do QA |

O Remotion baixa sozinho o próprio Chrome headless em `node_modules/.remotion`. Você não precisa instalar o Chrome para renderizar.

## Levar a skill para outra máquina

Na máquina atual, gere o pacote:

```bash
cd ~/.claude/skills && zip -r ~/Desktop/apuracao-oficial.zip apuracao-oficial
```

Na máquina nova:
1. descompacte em `~/.claude/skills/`;
2. faça a instalação abaixo;
3. copie a pasta do canal (`~/canaldark/projetos/…`) se quiser os projetos antigos.

Os `node_modules` não vão no pacote: o `novo-projeto.sh` roda `npm ci` em cada projeto.

## Instalar (máquina nova)

```bash
brew install node ffmpeg python
python3 -m venv ~/canaldark/.venv
~/canaldark/.venv/bin/pip install edge-tts==7.2.8 numpy pillow
bash <skill>/scripts/setup.sh ~/canaldark          # parte do roteirista (marca, ferramentas)
bash <skill>/scripts/producao/verificar-ambiente.sh ~/canaldark
```

Cada projeto novo recebe `npm ci` pelo `novo-projeto.sh`, que usa o `package-lock.json` do modelo. Isso garante as mesmas versões em qualquer máquina. Não troque por `npm install`, que pode puxar versões novas.

## Regras de operação aprendidas

- **Manter a máquina acordada** em render e trabalho longo: rode `caffeinate -dimsu <comando>`, que acorda só enquanto o comando dura. Nunca use `pkill caffeinate`, porque mata o de outras sessões.
- **Disco:** cada auditoria cria pastas temporárias do Remotion.
  - Hoje o `qa-quadros.mjs` já apaga o próprio bundle.
  - Rode QA e stills com `TMPDIR=<pasta de rascunho>`.
  - Confira `df -h /` antes de render, porque um vídeo de 25 min precisa de uns 4 GB livres.
  - Se o disco lotar, peça ao usuário para apagar as pastas `remotion-*` da pasta temporária do sistema. Essa limpeza precisa de aprovação dele.
- **Processador:** o tempo de render depende da CPU livre.
  - Chrome, ChatGPT/Codex e outros apps pesados abertos podem dobrar o tempo (15 → 40 min por bloco).
  - Antes de um render longo, confira se não ficou nenhum `remotion render` antigo rodando: `ps -eo pid,lstart,command | grep "remotion render"`. Encerre só os processos que você mesmo iniciou.
- **App fechado no meio do render:** o render cai com "Timed out … connect to the browser". O `render-final.sh` retoma do bloco que parou.
- **Ver as cenas no celular:** rode o Remotion Studio (`npx remotion studio --no-open --port=3100`) com uma entrada no `.claude/launch.json` e acesse pelo IP local da máquina (`http://<ip>:3100`).
- **Remover arquivos:** use caminhos literais. Comandos `rm -rf $VAR/*` são bloqueados pela checagem de segurança.
