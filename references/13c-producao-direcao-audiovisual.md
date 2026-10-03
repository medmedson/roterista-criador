# Produção: direção audiovisual (obrigatória em todo bloco)

O usuário quer um **mini documentário vivo**: a tela muda o tempo todo, o som acompanha a emoção, e todo dado vira informação visual. Vídeo com lacunas sem animação, tela parada, trilha ausente ou texto quebrado é refeito. Leia este guia antes de escrever o primeiro bloco e confira o checklist no fim antes do QA.

## 1. Tela sempre viva (sem lacunas)

- **Toda fala tem um visual próprio.** Cada fala do `.srt` entra na tela como pelo menos um elemento novo ou uma mudança visível: número que conta, barra que cresce, ponto que acende, mapa que ganha rota, etiqueta que entra, câmera que se move. Nunca deixe duas falas seguidas com a mesma tela parada.
- **Nada fica parado mais de 6 s.** O `qa-quadros.mjs` aponta `PARADO` quando a tela passa de 6 s sem mudança visível.
  - Documento e citação podem segurar de 3 a 6 s, mas com movimento lento: deslize lateral de 20–40 px (sem zoom, regra de 01/10/2026), ou marca-texto que avança.
  - Depois de um número animado, segure 2 a 3 s e já entre o próximo elemento.
- **Informação visual sempre que puder.** Todo número falado aparece na tela:
  - como contador, barra, série, pizza ou pontos (1 ponto = N pessoas);
  - todo lugar vira mapa com destaque ou rota;
  - toda data vira folhinha ou linha do tempo;
  - toda instituição, lei ou estudo vira recorte, documento com marca-texto ou etiqueta com a fonte;
  - toda comparação vira duas colunas, balança ou tubos.
- **Interatividade visual:** os elementos reagem à fala.
  - Uma coisa acende quando é citada, o número conta enquanto é dito, o ponto do mapa pulsa no nome da cidade, o contador troca na virada da frase.
  - Use `r(i)` (início da fala i) para amarrar cada entrada à palavra certa.
  - Evite animação que roda sozinha sem relação com o que a voz diz.
- **Zoom de tela (CameraViva): DESLIGADO por padrão** (pedido do usuário, 01/10/2026). O zoom lento de 1,5% ficou com aparência de "quadro a quadro" no vídeo: o texto se realinha ao pixel a cada quadro. Os vídeos que já saíram com ele (Eleições, SAMU, Bolsa Família) ficam como estão; os novos (SUAS, SUS, Terras Raras em diante) saem sem. `componentes/CameraViva.tsx` tem `CAMERA_ATIVA = false`.
  - Não religue sem testar um trecho de 10 s em tela cheia e aprovar com o usuário.
  - Para a tela não ficar parada, use movimento **dentro** das cenas: contador que conta, itens entrando um a um, marca-texto que avança, ponto de mapa que pulsa, linha que se desenha. Isso é o que o QA `PARADO` cobra.
  - `Drift` (zoom/deslize de um elemento específico, como documento ou mapa) pode ser usado com parcimônia e só se o teste de fluidez passar.
- **Movimento de fundo:** em cena longa, use `Poeira`, grão da `Pelicula`, drift lento da câmera (`Camera`/`enquadra`) ou luz que varia (`Luzes`), para a tela nunca congelar.

## 2. Transições (entre cenas e entre blocos)

Escolha pelo sentido narrativo e case sempre com um efeito sonoro:

| Transição | Quando | Como (componente) | Som |
|---|---|---|---|
| corte seco | choque, revelação, mudança brusca | troca de `Sequence` | `impacto` ou silêncio |
| fusão / fade | passagem de tempo, luto, reflexão | `Saida tipo="fade"` (10–24 frames) | trilha continua |
| chicote | mudança rápida de assunto | `Saida tipo="chicote"` (8–12 frames) | `whoosh` |
| ~~zoom-through~~ | **proibido** (sem zoom de tela); usar "cortar a curva" (`cortarCurva()` em `Movimento.ts`) ou wipe de máscara | — | `whoosh` |
| sépia | ida ao passado | `Saida tipo="sepia"` ou filtro no `Fundo` | `papel-virar` |
| flash | drama, virada | `Clarao` (branco ou vermelho) + tremor do `Fundo` | `impacto` + `sting` |
| preto + cartela | fim de capítulo | preto (`data-pausa-ok`) + cartela "CAPÍTULO N" (nunca "ATO") | `sting` |

Não repita o mesmo tipo mais de 2 vezes seguidas. Toda troca de bloco tem transição.

## 3. Som: trilha de fundo + efeitos + ambiência

- **Trilha de fundo em quase todo o vídeo**, sob a voz (volume 0.16 a 0.26). Troque de trilha quando muda o clima, com fade de 20–60 frames. Silêncio só como pausa dramática (0,5 a 3 s).
- **Efeito sonoro em todo evento visual importante:**
  - papel entra: `papel-deslizar`; documento abre: `papel-virar`;
  - carimbo: `carimbo`; número ou etiqueta: `clique`; número subindo: `subida`;
  - moeda ou dinheiro: `moedas`; transição: `whoosh`; foto: `flash-camera`;
  - relógio ou espera: `relogio-tique` / `tique-parede`; revelação: `riser` → silêncio → `impacto`.
  - Referência: pelo menos 1 efeito a cada fala com elemento novo, em média 8 a 15 por minuto. Em bloco de comoção, menos: só piano e violoncelo.
- **Ambiência** quando o lugar pede: `sala-espera`, `chuva-distante`, `murmurio-multidao`, `feira-ambiencia`, `passos-corredor`, com volume 0.10 a 0.15.
- **Som-assinatura** do tema (batimento no SUS, ding de senha no SUAS): nos momentos humanos, 1 a 2 vezes por cena, nunca sob dado de orçamento.

### Voz sempre acima da música (garantido no código)

- O componente `Trilha` faz **ducking automático**. Enquanto a narração fala (falas do `cues.json` do bloco), a música desce para no máximo `VOL_SOB_VOZ = 0.12`, com rampa de 8 frames. Nas pausas, cartelas e telas finais, ela volta ao volume pedido.
- Se a voz do bloco começa depois de um pré-roll (painel antes da fala), passe `atrasoVoz={OFF}` em cada `Trilha` desse bloco.
- Não suba `VOL_SOB_VOZ` e não toque trilha com `<Audio>` direto: use sempre `Trilha`, senão a garantia se perde.
- Efeitos (`Efeito`) não baixam sozinhos. Mantenha 0.3 a 0.6 sob a voz e deixe os mais fortes (`impacto`, `sting`) para as pausas.

## 4. Adaptar à emoção de cada trecho

| Emoção | Trilha | Visual | Som |
|---|---|---|---|
| **Suspense** | drone grave, pulso (`senha`, `tensao`, `votacao`) | escuro, deriva lateral lenta, elemento que surge aos poucos | `tique`, `riser` curto |
| **Drama / choque** | percussão seca, cordas graves (`veto`, `drama`, `denuncia`) | carimbo, tremor, `Clarao` vermelho | silêncio 1 s → `impacto` |
| **Comoção** | só piano e violoncelo (`comocao`, `caridade`) | fundo mais escuro, silhuetas, pontos acendendo devagar, sem rosto | nenhum efeito por cima |
| **Esperança / conquista** | cordas subindo (`constituinte`, `esperanca`, `desfecho`) | luz que acende, linha que sobe, dourado | `subida`, `sting` suave |
| **Indignação fria** | sintetizador grave, tique (`balanco`) | barras que despencam, contraste vermelho × cinza | `clique` seco |
| **Didático** | pulso leve, marimba (`rede`, `investigacao`) | fluxos, prédio em andares, mapas com rede | `clique` por item |
| **Revelação** | pausa da trilha | tela limpa com um número ou frase | `riser` → 0,5–1 s de silêncio → `impacto` |

## 4b. Chamada "Inscreva-se + ative o sininho" (em TODO vídeo)

Componente `ChamadaInscricao`, uma super produção de 5 s:
- título "GOSTANDO? INSCREVA-SE E ATIVE O SININHO";
- cartão do canal com o botão INSCREVA-SE, que o cursor clica e vira INSCRITO ✓;
- o cursor clica no sino, que balança com ondas de notificação e confetes dourados.

Uso: `<Sequence from={X} durationInFrames={150}><ChamadaInscricao duracao={150} /></Sequence>`, com os sons casados:
- `whoosh` na entrada (X);
- `clique` em X+40;
- `ding-senha` ou `sting` em X+72;
- `whoosh` na saída.

**Momentos estratégicos (3 por vídeo):**
1. **Depois do gancho**, no fim do bloco 1 (por volta de 1:00 a 1:40), antes da primeira cartela de capítulo: o espectador já sabe o que vai ganhar.
2. **No meio**, antes do capítulo de maior interesse (as feridas, os mitos, a revelação principal), como "não perca o que vem".
3. **No fim**, junto da tela final.

Nunca no meio de uma revelação, de um dado ou de um bloco de comoção.

**Jeito pronto (sem mexer nos tempos dos blocos):**
- `cenas/Chamada.tsx` traz a cena de 8 s com voz própria (`public/audio/cta.mp3`, gerada com a frase abaixo), trilha baixa e efeitos.
- No `Root.tsx`, embrulhe o bloco: `auditado(comChamada(Bloco02, DURACAO_02, "antes"))` e some `DURACAO_CHAMADA` na duração da `Composition`.
- Padrão usado: "antes" do bloco 02 (depois do gancho), "antes" do bloco que abre o capítulo mais forte e "depois" do último bloco.

A narração acompanha com uma frase curta. Ela deve vir escrita no roteiro, e se não vier, peça à sessão de roteiro. Exemplo: "Se este documentário está te ajudando a entender o Brasil, inscreva-se no canal e ative o sininho para receber os próximos." Passe essa frase pelo `checar-locucao.py` como qualquer outra. Na legenda, a tela da chamada entra como só texto (ocultar).

## 4c. Fim do vídeo (padrão do canal, em TODO vídeo)

Conteúdo: `07-tela-final-e-creditos.md` (o roteiro traz "Tela de FONTES" e "Tela final (padrão)"). Montagem: componente pronto `componentes/FimDoVideo.tsx` (no template).

**Ordem e tempos:**

| Trecho | Duração | Som | Legenda |
|---|---|---|---|
| última fala do fecho (bloco final) | — | trilha de fecho | sim |
| tela de FONTES (`TelaFontes`, 8–12 itens) | 12 s (`DUR_FONTES = 360`) | trilha de fecho baixa (0.16) | não |
| tela final sozinha (linhas: fontes na descrição · serviço · veja também; créditos rolando; "Narração sintética · trilha e efeitos originais") | 4 s | trilha 0.12 | não |
| chamada 3 (`ChamadaInscricao` por cima da tela final, com a voz `cta3.mp3`) | voz + 2 s (mín. 250 frames) | whoosh, clique | não |
| som-assinatura do tema, 2 s de silêncio, fade (branco no claro, preto nos escuros) | 3 s | assinatura uma vez | não |

**Código (Root.tsx):**
```tsx
import { comFim, ConfigFim, duracaoFim } from "./componentes/FimDoVideo";
const FIM: ConfigFim = {
  paleta: { fundo: c.papel, cartao: c.branco, texto: c.tinta, secundario: c.cinza, destaque: c.azul, marca: c.azul, sombra },
  fontes: [["Constituições", "Constituição Federal de 1988 e anteriores (Planalto)"], /* … 8 a 12 do roteiro */],
  linhas: ["Fontes oficiais e estudos na descrição.", "<linha de serviço do tema>", "Veja também: “<vídeo 1>” e “<vídeo 2>”."],
  creditos: [], // uma linha por foto usada: "descrição · autor · licença"; vazio = sem fotos
  trilha: "sfx/<trilha-de-fecho>.mp3",
  assinatura: "sfx/<som-assinatura>.mp3", // bip-confirma, ding-senha, toque-central, diapasao…
  cta: { audio: "audio/cta3.mp3", segundos: 11.3 }, // duração real da voz (ffprobe)
  fadePara: "branco", // "preto" nos temas escuros
};
// o último bloco recebe o fim inteiro; a chamada 3 NÃO usa comChamada
BlocoNN: auditado(comFim(BlocoNN, DURACAO_NN, FIM)),
<Composition id="BlocoNN" durationInFrames={DURACAO_NN + duracaoFim(FIM)} … />
```
- As chamadas 1 e 2 continuam com `comChamada(Bloco, dur, "depois", "audio/ctaN.mp3", duracaoChamada(seg))` (depois do B1 e antes do capítulo mais forte).
- O último bloco termina na frase conclusiva; não repita o som-assinatura no fim do bloco se ele já toca no fim do vídeo (uma vez só é o ideal).
- Conferir com stills: `npx remotion still BlocoNN x.jpg --frame=<fim-520>` (tela final) e `--frame=<fim-300>` (chamada por cima).

## 5. Layout preciso (sem quebra de linha e sem vazamento)

- **Texto dentro de caixa com altura fixa (etiqueta, visor, placa, botão) nunca quebra linha.**
  - Use `whiteSpace: "nowrap"`, com a caixa crescendo junto: `minWidth` + `padding`, não `width` fixo.
  - Se não couber, **encurte o texto ou diminua a fonte**. Nunca deixe quebrar.
  - Erro real: "R$ 13,04 BI · SET/2026" quebrou em 2 linhas e saiu da caixa do cartão, aos 0:34 do Bolsa Família.
- Título e chamada de uma linha: `whiteSpace: "nowrap"` e largura conferida. Encurte em vez de quebrar.
- Texto de parágrafo (citação, documento) pode quebrar, mas só dentro de uma caixa que cresce com ele, sem altura fixa.
- **A auditoria confere as duas direções:** TRANSBORDA horizontal e vertical (texto que sai da caixa com fundo pintado), TEXTO_CORTADO, CORTADO e SOB_LEGENDA. Mesmo com 0 problemas, olhe a folha de contato procurando quebra estranha e texto apertado.

## 5b. Legenda dinâmica (obrigatória, regra do usuário de 02/10/2026)

**A legenda nunca mostra a fala inteira de uma vez.** Vídeos antigos exibiam falas de 4 a 6 linhas paradas durante toda a fala, com o texto à frente da voz. Isso é erro.
- O componente `Legenda` do template já faz isso: divide cada fala em **trechos de no máximo 2 linhas** (~84 caracteres, de preferência cortando em pontuação) e mostra cada trecho **no momento em que é dito**, em proporção ao tamanho do trecho dentro da duração da fala. Fala curta aparece inteira.
- Use sempre o `Legenda` do template (`dividirLegenda`, `MAX_CARACTERES = 84`); ao restilizar para outro tema, mude só cores e fundo, nunca a lógica de divisão.
- Com no máximo 2 linhas, a legenda sobe pouco (≈ y 920): os elementos podem ocupar a tela até ~ y 900, mas continue reservando uns 200 px embaixo em cenas com legenda.
- A auditoria (`SOB_LEGENDA`) continua valendo.
- Vale para os próximos vídeos. Os já entregues (Eleições, SAMU, Terras Raras, SUS, SUAS, Bolsa Família) ficam como estão, salvo pedido.

## 6. Checklist do bloco (antes do QA)

- [ ] Cada fala tem elemento visual novo ou mudança amarrada a `r(i)`.
- [ ] Nenhum trecho parado > 6 s (QA sem `PARADO`).
- [ ] Todo número, lugar, data, lei ou estudo falado aparece na tela.
- [ ] Transição em cada troca de cena e de bloco, com som casado.
- [ ] Trilha cobrindo o bloco, trocando conforme a emoção; silêncio só antes de revelação.
- [ ] Efeito sonoro em cada evento visual importante (em média 8 a 15 por minuto; menos na comoção).
- [ ] Nenhum texto quebrado em caixa de altura fixa; títulos numa linha.
- [ ] Legenda oculta nas telas só de texto; nada sob a legenda; legenda dinâmica (trechos de até 2 linhas, no tempo da fala).
- [ ] Trilha só por `Trilha` (ducking automático; `atrasoVoz` se houver pré-roll).
- [ ] Chamada de inscrição nos 3 momentos do vídeo (fim do bloco 1, meio, fim).
- [ ] Fim do vídeo no padrão (FONTES → tela final com créditos e aviso → chamada 3 → assinatura → fade) via `FimDoVideo.tsx`.
- [ ] `qa-quadros.mjs` com 0 problemas + folha de contato olhada.
