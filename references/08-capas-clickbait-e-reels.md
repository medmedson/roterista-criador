# Capas clickbait (YouTube 1280×720) e capas de reels (1080×1920)

Gerador 100% por código (sem imagem de IA): Node + opentype.js transforma o texto em contornos SVG; filtros SVG dão grão, marca-texto e carimbo; Chrome headless renderiza o PNG (`scripts/render-svg.sh`). Fontes e templates ficam em `marca/` (fontes/, src/). Se `marca/` não existir na máquina, recrie a partir de `assets/marca`.

## Capa clickbait do vídeo (YouTube)
- Um arquivo `marca/src/miniatura-<tema>.mjs` por vídeo. Estrutura: fundo do tema, motivo visual do tema, chamada gigante (2 linhas), faixa de marca-texto com a frase de gancho, barra inferior em mono, selo "CONTRA PROVA" e "DOCUMENTOS OFICIAIS".
- Gancho = pergunta ou provocação que o vídeo **responde** (nunca afirmar o que a fonte não afirma; nada de acusação; neutro politicamente). Exemplos aprovados: "URNA SEGURA?", "SAMU 192 · a história que não te contaram", "Você não conhece nem 10% do SUS", "Você conhece o SUS, mas ainda não sabe tudo sobre o SUAS", "TERRAS RARAS · O Brasil tem. E você não sabe nada sobre essa riqueza".
- Sem rosto, sem seta, sem emoji. Elemento protagonista à direita (urna, sirene, rosca 10%, painel de senha, peças da tabela periódica).
- QA obrigatório: ver o PNG; texto não pode cortar nem sobrepor; reduzir a 168 px de altura e conferir leitura.

## Capas de reels (Instagram/redes) — uma por capítulo
- `marca/src/reels-dados.mjs`: por tema, 10 linhas `[gancho, kicker, sub]` **na ordem do `reels-config.json`** (a posição = capítulo/EP N). `sub` vem do JSON.
- `marca/src/reels-capas.mjs`: uma função por tema (identidade visual própria para distinguir no feed). Saída `svg/reel-<tema>-NN.svg`; PNG pelo render-svg.sh (`reel-<tema>-NN,1080,1920`); cópia final em `marca/reels-capas/<tema>/capa-NN.png`.
- Zonas do Instagram (informadas pela produção): conteúdo importante entre **y 420 e y 1500**, margens laterais 90 px, nada importante acima de y 170 nem abaixo de y 1560 (o feed corta o centro 3:4 e o card 1:1).
- Cada capa precisa de: nome do tema + "CAPÍTULO N DE 10" explícito + gancho clickbait + faixa "Vídeo completo no canal".
- Identidades: eleições = papel claro + azul-cédula; SAMU = azul-noite + giroflex + ECG; terras raras = grafite + peça da tabela periódica (número do capítulo no "número atômico"); SUAS = âmbar + senha de guichê (0001…); Bolsa Família = cortiça + ficha amarela + cartão de papel + alfinete; SUS (outra sessão); 6x1 = índigo + semana de 7 quadrados (a criar).
- O render com filtros SVG em 1080×1920 demora ~1–2 min por imagem: rode vários `render-svg.sh` em paralelo (um processo por tema) e confira o disco antes (`df -h`).
- Foto real só com licença confirmada e OK do usuário no chat para baixar; sem isso, ilustração própria por código.
