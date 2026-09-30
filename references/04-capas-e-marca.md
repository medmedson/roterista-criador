# Capas (thumbnails) e identidade visual — tudo por código

Sem imagem de IA e sem foto sem licença. SVG com texto convertido em contornos (opentype.js) e texturas por filtros SVG procedurais (`feTurbulence`); PNG pelo Chrome headless.

## Arquivos (copiados para `~/canaldark/marca/` pelo `scripts/setup.sh`)
- `src/gerar.mjs` — identidade: avatar, banner, logo, marca d'água (`node src/gerar.mjs`).
- `src/miniatura-sus.mjs` — **modelo** de capa (helpers `texto()`, `cap()`, carimbo, marca-texto, grão). Copiar para `src/miniatura-<tema>.mjs` e trocar composição e paleta.
- `fontes/` — Big Shoulders Display (BSD-900.woff, títulos), IBM Plex Mono (rótulos). Licença OFL (uso comercial livre).
- `GUIA-DA-MARCA.md` — cores, uso, regras.
- `scripts/render-svg.sh` (nesta skill) — SVG → PNG.

## Marca "Contra Prova Brasil"
Paleta: tinta `#0E0F11`, grafite `#24272D`, papel `#E9E4D8`, carimbo `#C62B1F`, marca-texto `#F3C623`. Conceito: marca-texto amarelo sobre PROVA (o gesto de grifar o documento), vermelho de carimbo, mono de documento. Regras: não esticar/girar/trocar cores; PROVA sempre sobre a faixa.
Tamanhos: avatar 800×800; banner 2560×1440 (nome e selo dentro da área segura central 1546×423); logo 1600×572; marca d'água 673×150 transparente (canto inferior direito, ~70% de opacidade).

## Padrão de capa (aprovado)
- 1280×720. **Rostos: quantidade livre conforme o tema (0, 1 ou vários)**; sem licença de foto, usar objeto/lugar como protagonista, construído em SVG.
- Protagonista grande à direita em primeiro plano; elementos secundários menores à esquerda; fundo de colagem temática desfocada; tratamento dessaturado, contraste alto, granulação, vinheta.
- Rótulos pequenos em caixa alta com fio dourado sob cada elemento (`1988`, `2026`).
- Chamada no terço inferior: **2 palavras**, condensada ultrabold texturizada; 1ª branca, 2ª amarela (ou cor de destaque da paleta), pincelada/marca-texto embaixo. Pergunta curta funciona ("QUEM LIBEROU?", "SUAS? NUNCA OUVI.").
- Sem emoji, setas, nem excesso de selos. Selo pequeno do canal no canto.
- **Cada vídeo, paleta própria** (não repetir): bets = preto/vermelho; SUS = clara clínica verde-petróleo `#0B4F4A` + `#EEF2EC` + alerta `#E8412C`; Bolsa Família = verde/amarelo sobre escuro; SUAS = azul-marinho `#0F1F3D` + âmbar `#FFB020`. Mesma estrutura de leitura, cor diferente.

## Processo
1. Escrever a descrição da capa no roteiro (protagonista, secundários, fundo, rótulos, chamada, paleta).
2. `cp src/miniatura-sus.mjs src/miniatura-<tema>.mjs`; ajustar cores e desenho; `node src/miniatura-<tema>.mjs` gera `svg/miniatura-<tema>.svg`.
3. `zsh ~/.claude/skills/apuracao-oficial/scripts/render-svg.sh ~/canaldark/marca miniatura-<tema>,1280,720`.
4. **Ver o PNG** (Read na imagem) e checar: texto sobreposto, pílulas cortando letras, elemento fora da área segura, legibilidade em miniatura pequena (~168×94). Corrigir e regerar. Erros já cometidos: ECG por cima do texto, pílula cortando "SUS", acento cortado, carimbo fora da área segura.
5. Salvar cópia em `projetos/<tema>/render/thumbnail-*.png` e em `~/Downloads`.

## Identidade nova em outro canal
Editar `C` (paleta) e textos em `gerar.mjs`; trocar fontes por outras OFL (Google Fonts: baixar .ttf/.woff, ajustar os `loadSync`). `node src/gerar.mjs` e renderizar com `render-svg.sh`.
