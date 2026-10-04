# Briefing de produção — "Siga o dinheiro" (dinheiro das campanhas)

Você escreve as cenas animadas (Remotion) de alguns blocos do documentário do canal Contra Prova Brasil. É **um vídeo único** com 14 blocos. A narração já está gravada. A base (tema, kit visual, chamadas, fim do vídeo, Root) está pronta.

Seu trabalho é **só** o arquivo `src/cenas/BlocoNN.tsx` de cada bloco seu, até a auditoria dar 0 problemas. Hoje esses arquivos são provisórios; substitua.

## Leia antes (obrigatório)

Na skill `~/.claude/skills/apuracao-oficial/references/`:
- `17-producao-como-fazer-igual.md`: o método. Tempos presos à voz, `em(i, trecho)`, tela que reage à fala, ciclo de QA.
- `18-producao-motion-regras.md`: movimento. Durações em frames, curvas, escalonamento de até 15 frames, pausa antes do clímax.
- `19-producao-edicao-cinematografica.md`: edição. Ritmo de cortes, som antes da imagem, 2 ou 3 tipos de transição, camadas, revelação.
- `13c-producao-direcao-audiovisual.md`: tela sempre viva, layout e checklist.

Um bloco pronto de outro vídeo para servir de modelo: `~/canaldark/projetos/samu/video/src/cenas/Bloco05.tsx` (padrão de `Sequence`, `r(i)`, `em()`, `Trilha` e `Efeito`).

## Onde está cada coisa

- **Projeto:** `/Users/medmadson/canaldark/projetos/financiamento/video`. Os blocos 01–14 correspondem a B1–B14 do roteiro.
- **Roteiro:** `/Users/medmadson/canaldark/projetos/financiamento/roteiro.md`. Cada bloco traz a decupagem das cenas com gatilho, visual, som e transição. O "Kit visual deste vídeo" e o "Mapa de trilha" ficam no começo do arquivo. A apuração (a verdade dos textos de tela) está em `../apuracao/`.
- **Falas com tempo:** `src/data/cues.json`, chave "NN". Use `t(i) = ms(C[i].de)`, `r(i) = t(i) - inicio` e `em(i, "trecho")`. O `em` é copiado do modelo SAMU: `em(i, trecho)` dá o frame em que o trecho é dito dentro da fala i, proporcional à posição do texto. A fala gravada pode diferir um pouco do roteiro; ache-a pelo conteúdo.
- **Kit deste vídeo:** `src/componentes/KitDossie.tsx`. Leia inteiro. Componentes:
  - `FotoCartao`: foto real em cartão sobre a mesma foto desfocada, com deriva lateral e crédito.
  - `RedeDinheiro`: o motivo do vídeo. Nós com foto, sigla ou ícone; setas com valor; moedas correndo; `ciclo` acende em âmbar; `apagar` esmaece o resto.
  - `PainelFicha`, `Planilha`, `ReguaMediana`, `BarrasAno`, `MarcosDossie`, `Busca`, `Tarja` e `CartelaCapitulo`.

  Exemplos de uso estão em `src/cenas/Vitrine.tsx`. As constantes de movimento ficam em `src/componentes/Movimento.ts` (`EASE`, `DUR`, `entrar`, `sair`, `escalonar`, `cortarCurva`).

  Componentes genéricos: `Contador`, `Etiqueta`, `Documento.tsx` (`Folha` + `Marca`), `Quadro` (fundo), `Pelicula`, `Legenda`, `Trilha`/`Efeito`, `Clarao`.

  Os demais arquivos da pasta são de temas antigos. Se usar algum, confira as cores. Quando precisar de uma variação de um componente, faça dentro do seu `BlocoNN.tsx`.

  Os elementos `[NOVO]` do roteiro que não estão no kit também são feitos dentro do seu bloco. Exemplos: urna estilizada, cofre, fluxo de registro, mapa de cota. Use desenho SVG simples no tema; **nunca use pessoas desenhadas com rosto**.
- **Fotos reais:** `src/data/fotos.ts`. Use `fotoSrc("tse1")` para obter o `src` e `FOTOS.tse1.credito` para o crédito, no formato `<FotoCartao src={fotoSrc("tse1")} credito={FOTOS.tse1.credito} … />`. Hoje `BAIXADAS = false` e o cartão mostra uma moldura neutra; quando as fotos chegarem, a moldura vira foto sem você mexer em nada.
  - Escolha a foto pela `desc` e pelo tipo pedido no roteiro. As fotos ficam em cena por no máximo 6–8 s seguidos, sempre com deriva.
  - IDs disponíveis: tse1–6, urna1–5, congresso1–6, stf1–5, h19921–6 (1992), mensalao1–6, campanha1–6 (4 = 1955; 5 e 6 = par Jânio/Lott de 1960, sempre juntos), dinheiro1–5, receita1–4, apuracao1–3.
  - Fotos do mensalão: só plenário e sessão. Nada de foto de réu.
  - Registre em `../apuracao/fotos-usadas-BNN.txt` os IDs que você usou (um por linha).
- **Tema:** `src/tema.ts`.

  | Cor | Uso |
  |---|---|
  | `c.grafite`/`c.papel` | fundo |
  | `c.painel` | painel |
  | `c.branco` | cartão escuro |
  | `c.claro`/`c.tinta` | texto |
  | `c.dinheiro`/`c.azul` | verde: fluxos e valores |
  | `c.ambar`/`c.laranja` | alerta e marca-texto |
  | `c.vermelho`/`c.alerta` | só a revelação, no máximo 1 por bloco |
  | `c.fio` | grades |
  | `c.cinza` | texto secundário |

  Também há `sombra`. Fontes: `fontes.titulo` (Big Shoulders), `fontes.texto` (Inter), `fontes.mono` (IBM Plex Mono). **Proibido:** cortiça, fio vermelho, polaroide, recorte de jornal e fundo claro.
- **Sons:** ficam em `public/sfx/`. As trilhas novas do roteiro são `dossie`, `arquivo-antigo`, `inquerito`, `porta-aberta`, `caixa-dois`, `plenario`, `tesouro`, `regra-fina`, `fachada`, `fluxo-dados`, `rede`, `cidadao` e `desfecho-dossie`. Os efeitos novos incluem `registro-caixa` (assinatura). Um agente está gerando esses arquivos agora; confira com `ls public/sfx` e use os nomes do roteiro. Também valem os efeitos antigos: `clique`, `whoosh`, `riser`, `sting`, `impacto`, `papel-virar`, `papel-deslizar`, `moedas`, `maquina-escrever`, `gaveta-arquivo`, `carimbo`, `tecla-urna`, `urna-bip`, `cofre` etc.
  - Trilha só via `<Trilha>`, seguindo o "Mapa de trilha". Efeitos com volume 0.3–0.6, de 8 a 15 por minuto.
  - O **B10 do roteiro** tem as restrições de som que estiverem descritas nele. Obedeça o que cada bloco diz.

## Regras que não podem falhar

1. **Neutralidade total:**
   - nenhuma sigla de partido em tom de acusação e nenhuma foto de candidato em campanha;
   - políticos aparecem só em contexto institucional (sessão, votação);
   - nada de nomes de pessoas investigadas;
   - a rede de ligações usa rótulos genéricos ("CAMPANHA A", "GRÁFICA X", "DIRETÓRIO").
2. **Ligação não é irregularidade:**
   - todo achado do levantamento independente leva `Tarja` ("LEVANTAMENTO INDEPENDENTE · INDÍCIO, NÃO ACUSAÇÃO" ou o texto do roteiro);
   - dado autodeclarado leva "DADO DECLARADO PELO CANDIDATO";
   - cálculo do canal leva "CÁLCULO DO CANAL".
3. **Sem zoom de tela.** Nada de `scale` animado em cena inteira nem em foto. Use deriva lateral, paralaxe por translate, máscara (clip-path) e opacidade. Nada de quique nem elástico.
4. **Legenda:** cena só de texto (cartela, citação, documento, número sozinho, ficha) é SEM legenda (`ocultar`). Nada fica sob a legenda: reserve 200 px embaixo nas cenas com legenda.
5. **Tela sempre viva:**
   - cada fala tem um elemento novo amarrado a `r(i)`/`em(i, …)`;
   - nada fica parado por mais de 6 s;
   - todo número, data, lei e lugar falado aparece na tela.
6. **Layout preciso:** `whiteSpace: "nowrap"` em etiquetas e títulos; texto a pelo menos 60 px das bordas.
7. **Capítulos, nunca "ATO":** use `CartelaCapitulo` onde o roteiro marca `# CAPÍTULO …`. Os capítulos abrem os blocos **01, 04, 07, 10 e 13**.
   - A cartela tem 25 frames de fundo antes, um `sting` suave e nenhuma legenda.
   - A voz entra depois, com pré-roll `OFF ≈ 110`: áudio em `<Sequence from={OFF}>`, `<Legenda atraso={OFF}>` e `atrasoVoz={OFF}` em cada `Trilha`.
   - `DURACAO_NN` inclui o OFF.
   - O bloco 01 abre com o gancho do roteiro; a cartela do Capítulo I entra onde o roteiro indicar.
8. **Chamadas e fim:** NÃO coloque `ChamadaInscricao`, tela de fontes nem tela final no bloco.
   - O Root cola a chamada 1 depois do 01 e a chamada 2 depois do 09.
   - O Root cola o fim inteiro (FONTES → tela final → chamada 3 → assinatura → fade) depois do 14.
   - O bloco 14 termina na última fala. Se o roteiro pedir `registro-caixa` dentro do B14, toque **dentro** da cena, como o roteiro diz.
9. **Revelação:** riser curto → 9 a 23 frames sem trilha → `impacto` discreto e clarão âmbar. Só onde o roteiro marca.
10. **Duração:** exporte `DURACAO_NN` e mantenha os nomes `BlocoNN`/`DURACAO_NN`. O fim do bloco é a última fala + 30 frames (mais o OFF, se houver).

## Auditoria (obrigatória, um bloco por vez)

```bash
cd /Users/medmadson/canaldark/projetos/financiamento/video
export TMPDIR=/private/tmp/claude-501/-Users-medmadson-canaldark/b18c249e-cf40-4c89-97cc-a35fe259093a/scratchpad/<seu-nome>
mkdir -p $TMPDIR
npx tsc --noEmit -p .
node qa-quadros.mjs NN
```

- O resultado precisa ser **0 problemas** (CORTADO, SOB_LEGENDA, SOBREPOSTO, VAZIO, TRANSBORDA, TEXTO_CORTADO, PARADO).
- Depois, **olhe a folha de contato** `../qa/blocoNN/folha.jpg` com Read e corrija o que a auditoria não vê: texto apertado, contraste ruim, elemento feio ou vazio.
- Para ver um quadro específico: `npx remotion still BlocoNN $TMPDIR/x.jpg --frame=N --scale=0.5` e depois Read.
- A máquina tem 8 GB e há outros agentes: **um bloco por vez**, sem render paralelo. Apague seus jpg temporários quando terminar (só os seus, com caminho literal).

## Não faça

- Não edite `Root.tsx`, `tema.ts`, `componentes/`, `data/` nem blocos de outros agentes. Se achar um bug no kit, contorne no seu bloco e avise no relatório.
- Não renderize o vídeo final, não baixe imagens e não mexa em outros projetos.
- Não use `rm -rf`. Não use "ato" na tela nem palavras em inglês na tela.

## Relatório final (curto)

Para cada bloco, informe:
- se ficou pronto e o resultado da auditoria (0 problemas);
- os IDs de fotos usados;
- o que foi trocado em relação ao roteiro e por quê;
- qualquer bug de componente que você contornou.

## Atualização: fotos de candidatos (autorizadas pelo usuário)

- Novo componente `MosaicoCandidatos` no `KitDossie`: uma grade de 120 fotos oficiais de candidatos, que estão sendo baixadas para `public/fotos/candidatos/`. Até chegarem, passe `disponivel={false}`; a produção troca para `true` depois.
- **Use SÓ para mostrar escala**: "um milhão e seiscentas mil candidaturas", "cada candidato presta contas", "qualquer candidato pode ser consultado".
- **Nunca** use o mosaico ou a foto de um candidato ao lado de um indício (ciclo, empresa do próprio candidato, gasto fora do padrão, laranja, sanção), **nunca** com nome e nunca isole um rosto. Nos achados, a rede de ligações continua com nós genéricos.
- Crédito: "Fotos de candidatos: Justiça Eleitoral (TSE, Portal de Dados Abertos)". Ele entra na tela final, então não precisa aparecer no bloco.

## Regra do usuário (04/10/2026): nenhum caráter difamatório, inclusive contra Lula
- Não citar, mostrar nem sugerir Lula, outros presidentes, candidatos nomeados ou partidos ligados a irregularidades. Nada de foto de Lula ou de qualquer político em contexto de suspeita.
- O exemplo do vídeo de referência (ciclo de R$ 177 milhões entre partido e campanha presidencial) **não entra**, nem de forma genérica com sigla ou cargo identificável ("campanha presidencial", "diretório nacional" de um partido etc.). Use só "CAMPANHA A/B", "DIRETÓRIO", "GRÁFICA X".
- Mensalão: só plenário e sessão, os números do julgamento e as falas do roteiro. Sem siglas, sem nomes de réus e sem relação com governo ou presidente.
- No uso de fotos de 1992 e do Mensalão, prefira plano aberto do plenário ou da multidão. Não destaque rosto de político.
