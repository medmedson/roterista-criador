# Produção: cenas no Remotion

Catálogo completo de componentes e props: `13b-producao-catalogo-componentes.md`. Exemplos reais de blocos: `producao-exemplos/`.

## Arquitetura

- **`src/tema.ts`**: `cores` (cortiça, papel, vermelho, amarelo…), `fontes` (rotulo = Oswald, jornal = Playfair, maquina = Special Elite, documento = Old Standard, legenda = Inter), `FPS = 30` e `ms(v)`, que converte milissegundos em frames.
- **Um arquivo por bloco** em `src/cenas/BlocoNN.tsx`:
  - exporta `BlocoNN` e `DURACAO_NN`;
  - no `Root.tsx`, cada bloco entra como `auditado(BlocoNN)` numa `<Composition>` de 1920×1080 a 30 fps.
- **Documentario.tsx** junta todos os blocos com `<Series>`. **Thumbnail.tsx** é um `<Still>` de 1280×720.
- **Fundo padrão**: `<Quadro/>` (cortiça), depois o conteúdo, depois `<Pelicula/>` (granulação e vinheta).

## Padrão de tempo

```tsx
const C = cues["07"];
const t = (i: number) => ms(C[i].de);          // frame em que começa a fala i
const FIM = ms(C[C.length - 1].ate);
export const DURACAO_07 = FIM + 30;             // ou CARTELA.de + CARTELA.dur quando há cartela de ato

const P3: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;       // frame RELATIVO dentro da parte
  ...
};
<Sequence from={t(4)} durationInFrames={t(9) - t(4)}><P3 inicio={t(4)} /></Sequence>
```

**Erro mais comum:** dentro de uma `<Sequence from={X}>` aninhada, o frame recomeça do zero.
- Um `entra={r(9)}` dentro de `<Sequence from={r(8)}>` precisa virar `entra={r(9) - r(8)}`.
- Sintoma: o elemento nunca aparece, ou aparece atrasado. Placas, textos e cadeados "sumidos" na folha de contato quase sempre são isso.
- `useCurrentFrame()` numa parte devolve o frame dessa parte, não o do bloco.

Outros padrões:
- **Pré-roll antes da voz** (painel que acende antes de falar): use `OFF = 110`, `t(i) = OFF + ms(...)`, o áudio em `<Sequence from={OFF}>` e `<Legenda atraso={OFF}>`.
- **Cartela de ato:** 25 frames de preto (`data-cobre data-pausa-ok`), depois a cartela ("ATO II" e o título) com `sting`, sem legenda.
- **Conteúdo não pode ficar sob a legenda:** a faixa reservada é de 200 px embaixo. Use `Centro` com `paddingBottom: 200` e mantenha tudo acima de y ≈ 880. Legenda longa (5 linhas) sobe mais; nesse caso, encolha o conteúdo.

## Legenda

`<Legenda cues={C} ocultar={[[de, ate], ...]} />`. Os intervalos são em frames absolutos do bloco.

Oculte a legenda em toda tela que é só texto, porque ela duplicaria o que já está escrito:
- documento com marca-texto;
- citação e recorte de texto;
- número ou contador sozinho;
- pergunta na tela;
- cartela de ato;
- tela final.

Deixe a legenda nas telas com imagem, mapa, gráfico ou objeto.

## Regras visuais do usuário (obrigatórias)

- Legenda nunca cobre o ponto focal e nada fica atrás da legenda.
- Nada cortado pela borda, a não ser de propósito (`data-corte-ok`).
- Nenhum texto vaza da própria caixa. Encurte o texto em vez de quebrar palavra.
- Carimbo só quando faz sentido narrativo, nunca sobre texto. Ponha ao lado ou abaixo do documento.
- Muita animação: mapas com rotas, contadores, séries que crescem, pontos que acendem. Evite tela parada, mas segure 2 a 3 s de pausa depois de um número animado.
- Fotos de pessoas só com licença conferida. A Bolsonaro BY-ND vai inteira, sem corte nem filtro.
- Sem crianças e sem beneficiário identificável. Use silhuetas, pontos e números.

## Marcas para a auditoria (use sempre)

| Atributo | Quando |
|---|---|
| `data-foco="nome"` | todo elemento que o espectador deve ver inteiro (texto, gráfico, foto, placa) |
| `data-corte-ok` | corte de borda proposital (mapa ampliado, rolagem de créditos) |
| `data-sobrepor-ok` | camada decorativa que pode passar por cima (pontos, fios, chuva, grade de fundo) |
| `data-cobre` | tela cheia que cobre o quadro (documento em primeiro plano, cartela, preto) |
| `data-pausa-ok` | quadro vazio proposital (preto antes de cartela) |
| `data-camera-movendo` | posto pelos componentes de câmera e transição durante o movimento |

## Kits já existentes (reaproveite antes de criar)

- **Base (todos):**
  - suporte e composição: Quadro, Pelicula, Recorte (x = centro), Fio, FioRompido, Carimbo (sem blend, fundo escuro);
  - documentos e datas: Documento (Folha + Marca), Folhinha (dia, mes 0-11, ano, para), Calendario;
  - números e gráficos: Contador, Barras, Placar, Medidor, Etiqueta;
  - mapas e câmera: MapaBrasil (pontos, destaques por sigla, corteOk), MapaMundo (destaques), Camera/enquadra;
  - fotos e tempo: Polaroide (proporcao, inteira, enquadre, colorida), LinhaTempo, Relogio;
  - efeitos: Clarao, Poeira, Luzes, Fluxo, Subida, Celular, Saida (transições);
  - áudio e texto: Trilha e Efeito, Legenda.
- **SUS:** LinhaBatimento, CaixaTermica, AviaoRota, Objetos, Objetos2 e Objetos3.
  - Objetos: PulseiraHospital, CarteiraTrabalho, FichaAtendimento.
  - Objetos2: MultidaoPontos, Iceberg, Frascos, GotaMapa, GenomaFita, Particulas, MesaDeLuz, PastaInquerito, MoedasEscorrendo, Ampulheta, Balanca.
  - Objetos3: Torneira, Capsula, CaixasRemedio, BolsaSangue, FrascoLeite, Cigarro.
- **Bolsa Família:**
  - KitBF: LinhaPobreza, PessoasPontos (teto), PratoVazio, EscadaRenda, PortaSaida, ChamadaEscolar, SacolaFeira, Pente, Urna, Berco, TrofeuPremio, CartaoPrograma, GloboDelegacoes;
  - Graficos: Gauge, Pizza, CartaoEstudo, Lupa;
  - Serie: SerieLinha, com `minimo` para ampliar a variação.
- **SUAS (KitSUAS):** PainelSenhas (`cor`), CartaoSenha, PlacaCRAS (`sigla` e `texto`), Guiche, CasaTresAndares, RedeTerritorio, PranchetaCadastro, TubosNiveis, MoedaSolitaria, Crachas, LinhaConferencias, SeloPEC, Pauta, AbrigoSilhueta, Tripe, Pastas.

## Criar elemento [NOVO] do roteiro

Crie `Kit<TEMA>.tsx`, com uma função por elemento:
- props `entra`, `f` e `acende` em frames relativos;
- estados inicial e final como descritos no roteiro;
- um `data-foco` na raiz;
- nada de `Math.random` nem de CSS animation: tudo vem de `useCurrentFrame()` e `interpolate`, senão o render trava ou pisca;
- "aleatório" determinístico: `rnd(i) = frac(sin(i*12.9898+78.233)*43758.5453)`.

Gráficos:
- séries e linhas: SVG com `overflow: visible`, porque o auditor une os filhos;
- texto em SVG: use `<text>`/`<tspan>`, nunca `foreignObject`, que corta texto e o Chrome mede errado;
- animação de onda contínua (batimento): amostre em grade presa ao tempo, não à tela, senão o pico "pula" entre quadros.

## Mapas

O `gerar-dados.mjs` gera os mapas:
- `mapa.json` (estados do Brasil em Mercator 1000×1000, com `c` = centróide e `projecao.brasilia`);
- `mundo.json` (Natural Earth, equirretangular 2000×1000).

Para "pontos no mapa" (CRAS, Centros POP), a distribuição é ilustrativa por estado. Diga isso no rodapé.

## Fotos

Guarde as fotos em `public/fotos/` e registre cada uma em `CREDITOS.txt` (arquivo, autor, licença, fonte). Mostre com Polaroide (P&B por padrão).
