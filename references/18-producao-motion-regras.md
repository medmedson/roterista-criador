# 18 — Regras de movimento (motion design) para os componentes Remotion

Destilado de duas fontes lidas em 03/10/2026 e convertido para 30 fps (1 frame = 33 ms) e para a API do Remotion:
- LottieFiles `motion-design-skill` (MIT): `reference/timing-easing-tables.md`, `patterns/multi-element.md`, `director/narrative-structure.md`.
- HeyGen HyperFrames (Apache-2.0): skills `motion-doctrine`, `cut-the-curve`, `hyperframes-animation/transitions`, `hyperframes-creative/references/motion-principles.md` e `data-in-motion.md`.

**Por que não instalamos o HyperFrames:** é outro renderizador (HTML + GSAP + Chrome próprio, Node 22). Ele não roda dentro do Remotion. Além disso:
- tem telemetria ligada por padrão;
- se atualiza sozinho;
- seus gatilhos ("make a video", "animate") puxariam o agente para fora do pipeline.

Aproveitamos só os números. A skill da LottieFiles é só texto e não traz risco, mas mistura conselhos de interface de app (hover, toque, movimento reduzido). Por isso as regras úteis estão aqui, já filtradas para documentário.

Constantes prontas: `assets/producao-template-video/src/componentes/Movimento.ts` (copiar para o projeto e importar nos kits).

## 1. Durações (frames a 30 fps)

| Uso | Frames |
|---|---|
| Elemento pequeno (rótulo, ícone, número) | 5–8 |
| Card, lower third, gráfico entrando | 6–10 |
| Cartela de capítulo, troca de cena | 12–18 |
| Revelação dramática | 18–36 |

- Uma entrada isolada não passa de **24 frames**. Construção longa se faz escalonando vários elementos, não com um elemento lento.
- A duração cresce com a distância percorrida:

  | Distância | Fator |
  |---|---|
  | 100 px | 1,0× |
  | 200 px | 1,3× |
  | 300 px | 1,5× |
  | 400 px | 1,6× |
  | tela inteira | 1,8–2,0× |

- A saída dura 65–75% da entrada.
- Variar o ritmo: a cena mais lenta é cerca de 3× mais lenta que a mais rápida. Não usar 12 frames em tudo.
- A primeira animação da cena começa 3–9 frames depois do início, nunca no frame 0. Quando a cena está presa à voz, isso já acontece naturalmente com `t(i)` e `em(i, trecho)`.

## 2. Curvas

- Entrada **desacelera**. Saída **acelera**. Deslocamento dentro da tela suaviza nas duas pontas. Loop usa seno.
- **Nunca curva linear em posição.** Linear só em rotação contínua, barra de progresso e contador.
- Curvas do canal:
  - Padrão (Material 3): `Easing.bezier(0.2, 0, 0, 1)`.
  - Entrada enfática: `Easing.bezier(0.05, 0.7, 0.1, 1)`.
  - Saída: `Easing.bezier(0.3, 0, 1, 1)`.
  - Fundo e ambiente: `Easing.bezier(0.4, 0, 0.2, 1)`.
- Equivalências com o GSAP:

  | GSAP | Remotion |
  |---|---|
  | `power3` | `Easing.poly(4)` |
  | `power4` | `Easing.poly(5)` |
  | `expo.out` | `Easing.out(Easing.exp)` |
  | `back.out(1.5)` | `Easing.out(Easing.back(1.5))` |

- **Proibido quique (bounce) e elástico.** É um tom de jornalismo sério:
  - ultrapassar o alvo no máximo 0–5%;
  - **0% em notícia negativa** (mortes, cortes, fila).
- `spring()`:
  - firme: stiffness 250–350 / damping 18–24;
  - suave: stiffness 100–150 / damping 20–25;
  - damping abaixo de 15 é proibido (fica "bouncy").

## 3. Escalonamento (stagger)

- Intervalo:
  - cards e linhas: 1,5–3 frames;
  - barras de gráfico: 1–2 frames.
- **O escalonamento total fica abaixo de 15 frames**, qualquer que seja o número de itens. Com 8 itens ou mais, encurtar o intervalo. Use `escalonar(i, n)` do `Movimento.ts`.
- O elemento principal entra primeiro: a ordem segue a importância, não a ordem do código.
- Todos os elementos do grupo vêm do mesmo lado e usam a mesma família de curva.
- Elementos "filhos" (rótulo, valor, sombra) chegam 2–4 frames depois do pai.
- As entradas se sobrepõem; não esperam a anterior terminar.
- Cascata de palavras em título:
  - deslocamento em y: palavra-âncora 60–80 px, palavra normal 40–50 px;
  - duração: 5–6 frames (âncora), 4–5 frames (normal);
  - opacidade passa de 0 para 1 de uma vez.

## 4. Pausas e estrutura

- Cena em três tempos: **construção** 0–30%, **respiro** 30–70%, **resolução** 70–100%.
- **Pausa antes do clímax: 9–23 frames** entre a ação e o resultado (por exemplo, a barra para e só então o número aparece).
- Depois que algo assenta, deixar 3–6 frames parado antes do próximo movimento.
- Regra do 1/3, distância: nada percorre mais de 1/3 da tela sem uma mudança no meio do caminho.
- Regra do 1/3, quantidade: com 3 ou mais elementos, no máximo 1/3 deles se mexe ao mesmo tempo.
- **Sem "idle wobble"** (pulsar sem motivo). Os dois textos discordam neste ponto e seguimos a `motion-doctrine` do HyperFrames: o tempo se preenche com revelações sincronizadas à narração, não com balanço ambiente. A exceção é o pulso discreto de ícones de chamada (logo e YouTube no reel), que é intencional.

## 5. Transições entre cenas

- Usar 2–3 tipos de transição no vídeo inteiro e repetir.
  - A transição principal cobre 60–70% das trocas.
  - A troca de capítulo usa outro tipo.
  - O encerramento é o mais lento: dissolve ou mergulho no preto, 18–30 frames.
- Tom de explicativo: 9–15 frames, `Easing.poly(3)` ou `Easing.poly(4)`.
- **"Cortar a curva"** (transição padrão do HyperFrames, boa para cenas dentro do bloco):
  - Deslocamento lateral parcial: ±230 px em 1920, ±130 px no reel de 1080.
  - A saída usa `Easing.in(Easing.poly(5))` em 6–12 frames. A entrada usa `Easing.out(Easing.poly(5))`, com duração igual ou maior.
  - O corte acontece com os dois lados ainda em movimento: a saída some aos 25–30% do percurso e a entrada já começa com opacidade 0,35.
  - O fundo tem que ser opaco (senão pisca).
  - A direção é sempre a mesma (esquerda); não alternar ida e volta sem motivo.
  - Implementação pronta: `cortarCurva()` em `Movimento.ts`.
- Desfoque de movimento é opcional: 8–10 px em texto, 18–20 px em quadro inteiro. Desfocar o contêiner, nunca os filhos.

## 6. Dados e gráficos

- Sem pizza, sem gráfico de dois eixos, sem grade nem legenda. No máximo 2–3 métricas por quadro.
- Todo número tem um elemento visual junto (barra, anel, forma).
- Números seguidos do mesmo conceito ficam no mesmo lugar; só o valor muda.
- Barras crescem com `scale` (com `transformOrigin` na base), não animando `width`/`height`. Isso é mais fluido e evita o efeito quadro a quadro.

## 7. Desempenho e fluidez

- Animar só `transform`/`translate`/`scale`/`rotate` e `opacity`.
- Menos de 20 elementos animados por quadro.
- Não somar dois transforms animados no mesmo elemento: usar um contêiner pai e um filho.

## 8. Conflitos com regras do canal (NÃO adotar)

- Zoom de câmera, Ken Burns (1,04), zoom-through e zoom inverso: proibidos (`CameraViva` desligada; o zoom parecia quadro a quadro).
- "Três camadas sempre" (LottieFiles) é uma orientação, não uma obrigação.
- Texto em inglês na tela: proibido, mesmo que um exemplo das fontes use.

## 9. Checklist antes do QA

- [ ] Nenhum `interpolate` de posição sem `easing`.
- [ ] Nenhum spring com damping abaixo de 15.
- [ ] Nenhum stagger com total acima de 15 frames.
- [ ] Clímax numérico tem pausa de 9–23 frames antes.
- [ ] No máximo 3 tipos de transição no vídeo.
- [ ] Barras com `scale`, não com `width`.
