# Briefing de produção — "Siga o dinheiro" CURTO (estilo influencer, cerca de 8 min)

Você escreve as cenas animadas (Remotion) de alguns blocos. O usuário pediu um vídeo **animado, humano e interativo, igual ao de referência** (youtube.com/watch?v=-7F2BdGqaUU) e **com menos cara de layout de React**: nada de painel de sistema, nada de tabela escura com bordinhas. Tudo deve parecer um criador de conteúdo mexendo em adesivos, setas e anotações numa mesa, com a câmera indo e vindo.

O ESTILO FOI APROVADO na amostra `src/cenas/TesteCamera.tsx`. Leia esse arquivo primeiro: é o padrão de qualidade e de movimento.

## Onde está cada coisa
- **Projeto:** `/Users/medmadson/canaldark/projetos/siga-o-dinheiro-curto/video`. Os blocos 01–08 correspondem a B1–B8 do roteiro.
- **Roteiro:** `../roteiro.md`. Traz a decupagem por cena, com visual, câmera, som e legenda. Apuração: `../apuracao/` (o que foi CONFERIDO no TSE e o que é só do autor).
- **Falas com tempo:** `src/data/cues.json`, chave "NN". O texto gravado pode diferir um pouco do roteiro; ache cada fala pelo conteúdo. Para amarrar ao instante dito, copie o padrão `t(i)` / `r(i)` / `em(i, "trecho")` de `~/canaldark/projetos/financiamento/video/src/cenas/Bloco05.tsx`.
- **KIT:** `src/componentes/KitVivo.tsx`. Leia inteiro. Componentes:

  | Componente | O que faz |
  |---|---|
  | `Mundo` | câmera por enquadramento: `planos=[[frame, [x,y,w,h]], …]`; mundo 3840×2160; a câmera viaja e enquadra a caixa com margem |
  | `Adesivo` | foto com borda branca e pulo |
  | `PalavraGigante` | com `circularEm` / `marcarEm` / `ate` |
  | `Anotacao` | letra de mão |
  | `Circulado`, `MarcaTexto`, `SetaMao`, `Risco` | traços de caneta |
  | `Cartao` | valor grande em cartão branco |
  | `Etiqueta` | "LEGAL", "NÃO É CRIME", "SÓ SOBRENOME" |
  | `Selo` | `conferido` / `levantamento` |
  | `Reacao` | ? ! ok x |
  | `Cursor` | caminho + cliques |
  | `ChuvaNotas` / `PilhaNotas` / `Nota3D` | dinheiro em 3D |
  | `GrafoBolinhas` | bolinhas com foto/ícone, setas desenhadas com moeda correndo, `destaque` em vermelho |
  | `Janela` + `Linhas` | janela de navegador BRANCA genérica, para mostrar CSV ou busca |
  | `Numero` | contador que pula |

  Todas as coordenadas são do MUNDO (2×: uma tela cheia em zoom 1 = 3840×2160). A câmera dá o zoom.
- **Tema:** `src/tema.ts`. Fundo `c.mesa` com pontinhos. Cores: `c.papel` (branco), `c.vermelho` (caneta), `c.azul` (caneta/cursor), `c.marca` (amarelo), `c.verde` (dinheiro), `c.claro` (texto na mesa), `c.cinza`. Fontes: `fontes.titulo` (Anton), `fontes.mao` (Caveat), `fontes.texto` (Nunito), `fontes.mono`.
- **Fotos de pessoas:** ficam em `public/fotos/pessoas/`: lula, flavio-bolsonaro, jair-bolsonaro, medioli, pimentel, marcal, tarcisio, paulo-teixeira e kim-kataguiri.
  - São oficiais do TSE, mas pequenas (161×225). Use-as em adesivos de até ~700 px de largura no mundo, ou em bolinhas.
  - Se existirem `lula-grande.jpg` e `flavio-grande.jpg`, use essas no B3.
  - Fotos de lugares: `public/fotos/*.jpg` (tse1, urna1, stf1, congresso1… com crédito em `../../financiamento/video/src/data/fotos.ts`).
- **Sons:** ficam em `public/sfx/`. Trilhas: `caderno`, `caderno-tenso` e `caderno-resolve`. Efeitos: `pop`, `whoosh`, `whoosh-longo`, `clique`, `risco-caneta`, `plim`, `fita`, `moedas`, `papel`, `ding` (assinatura, no máximo 6 no vídeo), `ziper`. Use `<Trilha>`/`<Efeito>` de `src/componentes/Trilha.tsx`. Efeitos com volume 0.3–0.5, casados com cada pulo, traço ou clique: o vídeo deve SOAR vivo.

## Regras que não podem falhar
1. **Ritmo:** algo novo a cada 2 a 4 s (elemento, movimento de câmera, traço ou reação). Nunca parado por mais de 3 s. A câmera muda de plano a cada 4–8 s. Toda cena fica dentro de um `Mundo`.
2. **Nada cortado em repouso:** a caixa de cada plano tem de conter TUDO o que importa naquele momento (é a câmera que garante a margem). A auditoria ignora cortes enquanto a câmera se move.
3. **Equilíbrio político (regra do usuário):** o vídeo não pode ser ataque a Lula.
   - O ciclo PT/Lula e o ciclo PL/Bolsonaro têm o MESMO tempo de tela, o mesmo molde visual (o mesmo `GrafoBolinhas`, as mesmas cores) e a mesma etiqueta "LEGAL / NÃO É ESQUEMA".
   - Fotos de pessoas: todas do mesmo tamanho na mesma cena, sem filtro, sem rabisco no rosto, sem X sobre pessoa.
4. **Nomes e ressalvas:** todo nome vem colado à ressalva do próprio dado, com `Etiqueta` ("DOAÇÃO DECLARADA · LEGAL", "NÃO É CRIME POR SI", "SÓ SOBRENOME, NÃO PROVA PARENTESCO"). Número conferido pelo canal leva `Selo tipo="conferido"`; número só do autor leva `Selo tipo="levantamento"` (veja `../apuracao/01-conferencias-tse.md`).
5. **Sem inglês na tela** (nada de "mogged"). Sem "ATO". Números no formato brasileiro.
6. **Legenda:** `<Legenda cues={C} />` dinâmica (já pronta). Oculte (`ocultar`) quando houver `PalavraGigante` ou um número grande no centro. Nada importante nos 200 px de baixo da TELA enquanto houver legenda.
7. **Chamadas e fim:** NÃO coloque chamada nem tela final no bloco. O Root cola a chamada 1 depois do B4 e o fim depois do B8.
8. **Duração:** `DURACAO_NN` = última fala + 20 frames. Exporte `BlocoNN` e `DURACAO_NN`.

## Auditoria (obrigatória, um bloco por vez)
```bash
cd /Users/medmadson/canaldark/projetos/siga-o-dinheiro-curto/video
export TMPDIR=/private/tmp/claude-501/-Users-medmadson-canaldark/b18c249e-cf40-4c89-97cc-a35fe259093a/scratchpad/<seu-nome>; mkdir -p $TMPDIR
npx tsc --noEmit -p .
node qa-quadros.mjs NN
```
- O resultado precisa ser 0 problemas. Depois OLHE a folha `../qa/blocoNN/folha.jpg` e stills (`npx remotion still BlocoNN $TMPDIR/x.jpg --frame=N --scale=0.5`). O alvo é parecer o vídeo de referência, não um aplicativo.
- O DISCO ESTÁ APERTADÍSSIMO (~1 GB): apague os seus jpg e temporários depois de cada bloco, com caminho literal, e nunca rode `rm -rf` em pastas que não são suas. Um render por vez.

## Não faça
- Não edite Root, tema, KitVivo nem blocos de outro agente. Se precisar de uma variação, faça dentro do bloco.
- Não renderize o vídeo final e não baixe arquivos.

## Relatório (curto)
Por bloco: se está pronto, o resultado da auditoria, as fotos usadas e o que mudou em relação ao roteiro.
