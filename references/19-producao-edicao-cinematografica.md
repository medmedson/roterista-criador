# 19 — Edição cinematográfica e motion design (documentário longo e reels)

Complementa o `18-producao-motion-regras.md`, que traz durações, curvas, escalonamento e o `cortarCurva()`. Este arquivo não repete esses números: trata da **montagem**, ou seja, ritmo, cortes, costuras, camadas, luz, tipografia, revelação, abertura, fim e reels. Vale para o documentário de 25–40 min (1920×1080, 30 fps, Remotion 4) e para o reel vertical (1080×1920, 35–60 s). Todos os tempos estão em frames (1 s = 30 frames).

Fontes destiladas em 03/10/2026: HyperFrames (`motion-doctrine`, `seam-craft`, `cut-the-curve`, `faceless-explainer/cut-catalog` e `motion-language`, `hyperframes-creative/beat-direction`, `video-composition`) e LottieFiles `motion-design` (`director/emotion-mapping`, `choreography`). Ficou de fora tudo o que dependia de zoom, shader ou interface de app.

**Precedência:** onde o `13c`/`17` ainda citam zoom 1,00→1,06, zoom-through ou `Saida tipo="zoom"`, **vale este arquivo**. Use deslize de 20–40 px.

## 0. Restrições duras do canal (não negociáveis)

| Regra | O que fazer no lugar |
|---|---|
| Sem zoom ou `scale` de câmera, sem Ken Burns, sem zoom-through nem zoom inverso (`CameraViva` desligada; ficava com aparência de quadro a quadro) | `translate`, paralaxe, `opacity`, máscara, cortina com `clip-path`. `scale` só em barra de gráfico com `transformOrigin` na base (18 §6) |
| `Saida tipo="zoom"` | proibido. Use `cortarCurva()`, mergulho no preto ou fusão |
| Sem quique nem elástico | curvas do `EASE` em `Movimento.ts` |
| Nenhuma palavra em inglês na tela | rótulos e títulos em português; números no formato brasileiro (1.234,5 · R$ 13,04 bi) |
| Legenda dinâmica com no máximo 2 linhas | `Legenda` do template, sem mudar a lógica de divisão |
| Voz sempre acima da música | trilha só por `Trilha`, com ducking automático (`VOL_SOB_VOZ = 0.12`) |
| Nenhuma tela parada por mais de 6 s (180 frames) | toda fala traz uma mudança; quem cobra é o QA `PARADO` |
| "Capítulo", nunca "ato" | na cartela, na fala e na descrição |
| Nenhuma cena inventada | a emoção nasce do fato apurado (número, documento, data, lugar). Sem reconstituição, sem rosto inventado, sem imagem de IA |

## 1. Ritmo de edição por capítulo

"Plano" aqui é cada composição visual distinta: uma troca de cena, ou uma mudança grande dentro dela. O plano dura o tempo da ideia, e o ritmo é ditado pela emoção do trecho.

| Emoção do trecho | Duração do plano | Troca interna (elemento novo) | Costura típica |
|---|---|---|---|
| Didático / dados | 90–150 (3–5 s) | a cada fala, ou a cada 45–75 | cortar a curva |
| Suspense | 120–180 (4–6 s) | lenta, 60–90; o elemento surge aos poucos | cortar a curva mais lento (durEntra 15) |
| Choque / denúncia | 30–75 (1–2,5 s) em rajada de 3–5 planos | por palavra (`em(i, "…")`) | corte seco |
| Comoção | 150–180 (5–6 s) | 1 movimento lento por plano (pontos que acendem, linha que se desenha) | fusão lenta |
| Esperança / conquista | 90–120 | subida, luz que acende | cortar a curva para cima (direção reservada) |
| Revelação | 60–120 de tela limpa depois do impacto | nenhuma até o fim do respiro | corte seco ou fusão curta |

- **Varie o andamento.** Em cada capítulo, o plano mais longo dura cerca de 3× o mais curto. Três planos seguidos com a mesma duração (±10%) é sinal de montagem mecânica.
- **Curva do capítulo:** abertura em ritmo médio, desenvolvimento acelerando, pico (revelação ou choque), respiro e fecho. Não comece o capítulo no ritmo máximo.
- **Respiro:** depois de um pico, 30–60 frames sem informação nova, mas com algo em movimento (linha terminando de se desenhar, vinheta escurecendo devagar). Respiro não é tela congelada.
- **Revelações em sequência, no fundo do plano** (doutrina HyperFrames): não despeje tudo nos primeiros 25% da cena. Cada peça entra quando a voz a menciona, ao longo dos ~50% finais.
- **Prefira tela parada a movimento ruim:** nada de pulsar ou flutuar sem motivo (18 §4). Se a cena terminou de entrar e ainda sobram segundos, falta conteúdo, não falta balanço.

## 2. Cortar na narração

- **O corte cai na fronteira da frase.** A troca de cena acontece no silêncio entre duas falas, 2–4 frames antes da voz da fala nova:
  ```ts
  const corte = (i: number) => Math.max(ms(C[i-1].ate) + 1, t(i) - 3); // no silêncio, nunca no meio de uma palavra
  ```
  Nunca corte no meio de uma palavra. Se precisar cortar dentro da fala, use a vírgula ou o "e", com `em(i, "trecho") - 2`.
- **O elemento entra na palavra:** a entrada começa 2–3 frames antes da palavra-gatilho, para chegar legível quando ela soa. Para números, o contador começa na palavra e para no fim da frase.
- **Corte na ação:** a troca só acontece com algo em movimento dos dois lados, nunca com os dois em repouso. É o que o `cortarCurva()` faz: o lado que sai já acelerou e o que entra chega já em movimento.
- **Corte J (o som chega antes da imagem):** o efeito ou a ambiência da cena nova começa **4–8 frames antes** do corte. Na troca de trilha, a nova entra **15–30 frames antes** da cartela.
- **Corte L (o som fica depois da imagem):** a trilha ou a ambiência da cena anterior continua **15–45 frames** depois do corte e sai em fade. Use no fim de capítulo e depois da comoção.
- A voz nunca começa durante uma costura. Depois de cartela ou mergulho no preto, ela entra no mínimo 6 frames depois que a imagem nova assentou.

## 3. Vocabulário de costuras: no máximo 3 tipos por vídeo

Escolha **3 tipos no máximo** para o vídeo inteiro e anote a escolha no topo do `Root.tsx`. O 18 §5 tem a regra geral; aqui está o quando e o como de cada tipo.

| Tipo | Quando | Frames | Som casado |
|---|---|---|---|
| **A. Cortar a curva** (padrão, 60–70% das trocas) | cena → cena dentro do bloco, ideia que continua | sai 9, entra 12 (`cortarCurva(f, corte, 230, 9, 12)`); direção fixa para a esquerda | `whoosh` curto começando 4–6 antes |
| **B1. Mergulho no preto** (temas escuros) | troca de capítulo; encerramento | sai 9–12 até o preto, preto segurado 6–15 (`data-pausa-ok`), cartela | `sting` no título da cartela; trilha nova em corte J |
| **B2. Virada de página** (tema claro / papel) | troca de capítulo, no lugar do B1 | cortina `clip-path` de 15–18 com sombra na borda | `papel-virar` 3 frames antes |
| **C1. Fusão lenta** | passagem de tempo, luto, comoção | 18–30, os dois planos em opacidade sobre fundo opaco | trilha continua (corte L), sem efeito |
| **C2. Corte seco** | choque, virada brusca, revelação | 0 | silêncio de 6–10 antes + `impacto` no frame do corte |

- **Combinação padrão:** A + B1 (ou B2) + uma entre C1 e C2, conforme o tom: C1 no vídeo de assistência e saúde, C2 no de denúncia e escândalo. O corte seco de rajada (seção 1) entra na conta do C2.
- **Direção:** a "corrente" do vídeo é para a esquerda. Para cima é reservado à conclusão ou à conquista. Nunca alterne esquerda e direita em costuras seguidas.
- **Fundo opaco** em toda cena. Sem ele, a soma de opacidades menor que 1 deixa o branco aparecer e a costura pisca (`seam-craft`).
- **Cortinas por máscara**, sem zoom:
  ```ts
  const p = entrar(f, corte - 8, 16, EASE.padrao);           // virada de página / cortina
  const estiloNova = { clipPath: `inset(0 ${100 - p * 100}% 0 0)` };            // revela da esquerda p/ direita
  const preto = interpolate(f, [corte - 10, corte, corte + 8, corte + 18], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  ```
- Ficam fora do vocabulário: chicote de tela inteira (`Saida tipo="chicote"`, que só serve como variante do A, nunca como um 4º tipo), falha de sinal, vazamento de luz, explosão em grade e qualquer transição de escala.

## 4. Corte por correspondência (forma e cor)

Liga duas cenas por um elemento que **ocupa o mesmo lugar** dos dois lados do corte. É o "portador" da `motion-doctrine`: o olho segue o objeto, não a cena.
- A forma e a cor são as mesmas, a posição varia no máximo ±20 px e o tamanho no máximo ±10% (o tamanho é resolvido no layout, não animado com `scale`).
- Exemplos: o ponto vermelho do mapa vira o ponto da série histórica; a barra amarela vira a linha do tempo; o carimbo vira o selo do documento seguinte; o círculo do relógio vira o anel do medidor.
- O corte acontece **durante** o movimento do portador. A cena B já começa com ele na posição e continua o mesmo trajeto.
- Só use quando a relação é real (mesmo dado, mesmo lugar, mesma instituição). Rima visual sem relação factual confunde e insinua o que não foi apurado.
- Uso: 1–3 por capítulo. Não conta como tipo de costura.

## 5. Profundidade e camadas (paralaxe só com `translate`)

| Plano | Conteúdo | Fator de deslocamento | Tratamento |
|---|---|---|---|
| Fundo | textura do tema, mapa apagado, cortiça, papel | 0,2–0,3× | desfoque fixo de 4–8 px, sem animar o desfoque |
| Meio | o assunto (documento, gráfico, mapa ativo) | 0,5–0,6× | nítido, com sombra do tema |
| Frente | etiquetas, fonte em mono, marca-texto, setas | 1,0× | sem desfoque; nunca sob a legenda |

- No `cortarCurva`, multiplique o `desloc` pelo fator de cada plano (fundo 0,3 × 230 ≈ 70 px). A troca ganha profundidade sem nenhum zoom.
- Dentro da cena, o deslize lento do meio é de 20–40 px na cena inteira, com `EASE.fundo`. Ele substitui o antigo zoom de documento.
- Um contêiner por plano e um transform por elemento (18 §7). Menos de 20 elementos animados por quadro.
- "Três camadas" é uma orientação, não uma obrigação. Uma cena limpa com um número só não precisa de frente.

## 6. Luz e cor por capítulo

- **A paleta vem só do `tema.ts`** (`cores`). Defina no `tema.ts` do projeto um objeto `GRADE` por emoção. Não invente hex dentro da cena.
- **Vinheta:** `radial-gradient` escurecendo as bordas, com opacidade 0,35–0,55 nos temas escuros e 0,10–0,18 no claro. Nunca gradiente linear de tela inteira no escuro: forma faixas no H.264.
- **Grão:** usar `<Pelicula />` de `componentes/Quadro.tsx` (já existe no template); se precisar de outro, SVG `feTurbulence` com `seed` trocado a cada 2 frames (determinístico, sem `Math.random`), opacidade 0,04–0,08. Fica sobre o fundo e o meio, nunca sobre a legenda.
- **Temperatura por emoção** (camada de cor com `mixBlendMode: "soft-light"`, opacidade 0,06–0,12):

  | Emoção | Tom | Ajuste |
  |---|---|---|
  | Suspense, burocracia | frio (azul-acinzentado) | vinheta +0,1 |
  | Passado, memória | quente (âmbar) ou sépia leve | `sepia(0.25)` só no fundo |
  | Comoção | dessaturado | `saturate(0.7)` no fundo e no meio; o texto fica intacto |
  | Choque, denúncia | neutro com acento `vermelho` | `Clarao` com força 0,25–0,45 só no impacto |
  | Esperança | quente com `amarelo` | luz que acende (opacidade), nunca brilho pulsando |

- A mudança de luz entre capítulos acontece em 30–60 frames, escondida dentro do mergulho no preto. Dentro do capítulo, a luz não muda sem motivo.

## 7. Cinematografia tipográfica

- **Título em cascata:** palavra por palavra, com os números do 18 §3. A palavra-âncora (o dado, o nome) entra por último e com o maior deslocamento.
- **Troca de frase em cachoeira** (título A → título B, sem fade cruzado): cada palavra sai com `translate` de 0 a −230 px em 10 frames (`Easing.in(Easing.poly(5))`), já invisível aos 5 frames, com 0,7 frame de intervalo. A frase nova entra de +230 a 0 em 9 frames (`Easing.out(Easing.poly(5))`), partindo de opacidade 0,35, com intervalos que encolhem (1,5 frame × 0,84 por palavra). A última palavra a sair some no frame do corte.
- **Revelação por máscara:** a linha sobe de dentro de uma faixa (`clipPath: inset(100% 0 0 0)` → `inset(0)`) em 8–10 frames. É boa para nome de lei e de instituição.
- **Marca-texto que avança** sob o trecho citado, com `scaleX` e origem à esquerda, em 12–20 frames, sincronizado com `em(i, trecho)`.
- Tamanhos: os do 17 §2. Texto em caixa fixa com `nowrap`. Citação de documento só com o trecho apurado, entre "(...)".
- Quando a tela é só texto (cartela, frase-chave), oculte a legenda (`ocultar`) para não repetir o que está escrito.

## 8. Estrutura de revelação

Só para fato real e de peso (o maior número, o documento decisivo). No máximo 1 grande revelação por capítulo.

| Tempo | Imagem | Som |
|---|---|---|
| −60 a −15 | o cenário se prepara: barra crescendo, documento chegando, vinheta fechando | `riser` de 45–75 frames, terminando no início do silêncio |
| −15 a 0 (silêncio de **9–23**) | tudo assenta e fica imóvel (18 §4) | trilha a 0 em rampa de 4–6 frames; voz em pausa (pré-roll na cena, não na voz) |
| 0 | corte seco ou entrada enfática do dado (`EASE.enfase`, 5–8 frames), com `Clarao` opcional | `impacto` no mesmo frame (no máximo 1 antes) |
| +6 a +90 | tela limpa com o dado e a fonte em mono | trilha volta em 20–30 frames, em outro clima |

- Clímax numérico: a barra para, vem a pausa, e só então o número aparece. O contador nunca passa por valores intermediários enganosos (16, armadilhas).
- Em notícia negativa (mortes, cortes, fila), sem ultrapassar o alvo (0%) e sem efeito vistoso: o peso vem do silêncio.

## 9. Cartela de capítulo

Pré-roll de 100–130 frames (`OFF`), antes da voz, com `data-cobre data-pausa-ok` e legenda oculta:
1. preto ou papel por 6–15 frames;
2. "CAPÍTULO N" (rótulo, mono ou Oswald) entra em 8 frames;
3. o título entra em cascata, com o `sting` na palavra-âncora;
4. uma linha se desenha por baixo (`scaleX`, 12 frames);
5. segura 45 frames ou mais;
6. sai em 9–12 frames e a voz entra 6 frames ou mais depois.

A trilha nova entra em corte J 15–30 frames antes do título. Nunca escreva "ATO".

## 10. Abertura: gancho nos primeiros 15 s (450 frames)

- O frame 0 já tem imagem do tema: sem preto, sem logo, sem vinheta de canal. A primeira animação começa entre os frames 3 e 9.
- O fato mais forte e verificável (número, documento, data) está na tela **antes do frame 90**.
- São 3–5 planos nos primeiros 450 frames (60–120 cada), em ritmo de choque ou suspense, e o título do vídeo entra em cascata entre os frames 300 e 450.
- Em seguida, o bloco 1 apresenta o tema e as fontes (regra do canal). A chamada 1 fica no fim do B1, antes da primeira cartela.

## 11. Encerramento

- A última fala é a frase conclusiva, seguida de 30–45 frames de respiro e depois o `FimDoVideo` (13c §4c: FONTES → tela final → chamada 3 → assinatura → fade).
- A última costura é a mais lenta do vídeo: fusão ou mergulho no preto de 18–30 frames, com a trilha de fecho em corte L.
- Nenhuma revelação nova nos últimos 60 s de fala. Um capítulo de fecho em ritmo de comoção ou esperança não corta seco.

## 12. Sincronia som-imagem (adiantamento em frames)

| Evento | Som | Começa em relação à imagem |
|---|---|---|
| costura cortar a curva | `whoosh` | 4–6 antes do corte (o pico cai no corte) |
| corte seco / impacto | `impacto` | 0 (no máximo 1 antes) |
| papel entra / desliza | `papel-deslizar` | 2–3 antes do início do movimento |
| etiqueta, número, item | `clique` | 0, no frame em que assenta |
| contador subindo | `subida` | do início ao fim da contagem |
| lugar novo | ambiência | corte J de 6–10; sai em corte L de 15–30 |
| troca de clima | trilha nova | 15–30 antes, com crossfade de 20–60 |
| revelação | `riser` → silêncio → `impacto` | seção 8 |

- Efeitos fortes (`impacto`, `sting`) só nas pausas da voz. Sob a voz, os efeitos ficam entre 0,3 e 0,6. Média de 8–15 efeitos por minuto, menos na comoção (13c §3).

## 13. Reels (1080×1920, 35–60 s)

| Item | Documentário | Reel |
|---|---|---|
| Duração do plano | 90–180 | 45–90 (1,5–3 s) |
| Cortar a curva | ±230 px, 9/12 | **±130 px**, sai 6–8, entra 9–10 |
| Paralaxe do fundo | até ~70 px | até 30–50 px |
| Silêncio da revelação | 9–23 | 9–12 |
| Cartela de capítulo | sim | não; no máximo um rótulo de 2–3 palavras |
| Tipos de costura | até 3 | 2 (A + C2) |

- O frame 0 é o gancho: o dado ou a frase mais forte já está na tela, com título e contexto no topo, a partir de y 170.
- **Zona segura:** nada importante abaixo de y≈1560, nem à direita de x≈940 entre y 1000 e 1700. A largura útil é de 900 px (17 §7).
- Legenda dinâmica grande, com no máximo 2 linhas, sempre dentro da zona segura.
- O fechamento é obrigatório: fade de 14 frames e cartão final de 5 s (17 §7). Nunca termine em corte seco.

## 14. Checklist por bloco (antes do QA)

- [ ] Nenhum `scale` de câmera, Ken Burns, zoom-through ou `Saida tipo="zoom"`.
- [ ] As durações de plano seguem a emoção (seção 1); o mais longo dura cerca de 3× o mais curto; sem 3 planos iguais seguidos.
- [ ] Cortes no silêncio entre falas (`corte(i)`) e entradas 2–3 frames antes da palavra.
- [ ] No vídeo inteiro, no máximo 3 tipos de costura, anotados no `Root.tsx`; direção fixa para a esquerda.
- [ ] Fundo opaco em toda cena (sem piscar branco na costura).
- [ ] Cortes por correspondência só com relação factual real.
- [ ] Paralaxe só com `translate` e fatores 0,3 / 0,6 / 1,0.
- [ ] A luz do capítulo vem do `GRADE` do `tema.ts`, com vinheta radial e grão determinístico.
- [ ] A revelação tem riser → 9–23 frames de silêncio → impacto no frame, sobre um fato apurado.
- [ ] A cartela diz "CAPÍTULO N" e a voz entra 6 frames ou mais depois dela.
- [ ] Os sons seguem a tabela da seção 12 e a voz fica acima da música (só `Trilha`).
- [ ] Nenhuma palavra em inglês na tela; legenda com até 2 linhas e oculta nas telas só de texto.
- [ ] Nada parado por mais de 180 frames (QA sem `PARADO`).

## 15. Modelo "como pedir à cena" (decupagem)

Preencha um por cena antes de codar. Cada linha precisa de uma fala-gatilho real do `cues.json`.

```
CENA <bloco>.<n> · falas <i>–<j> · emoção: <didático|suspense|choque|comoção|esperança|revelação>
Fato na tela: <número/documento/lugar/data + fonte em mono>  (nada inventado)
Plano: <duração prevista em frames> · troca interna a cada <frames> ou por palavra
Camadas: fundo <…> (0,3×) · meio <…> (0,6×) · frente <…> (1,0×)
Entradas: <elemento> em em(<i>, "<palavra>") − 2 · verbo: <desliza|desenha|conta|acende|carimba>
Luz: GRADE.<emoção> · vinheta <0,xx> · sem zoom
Costura de saída: <A cortar a curva | B mergulho/virada | C1 fusão | C2 corte seco> · portador: <elemento ou —>
Som: <efeitos e offsets da seção 12> · trilha <nome> <corte J/L> · revelação? <sim: riser/silêncio N/impacto>
Legenda: <normal | ocultar [de, ate)> · palavras em inglês: nenhuma
```
