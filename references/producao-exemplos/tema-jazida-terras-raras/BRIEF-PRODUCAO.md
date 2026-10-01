# Briefing de produção: Terras Raras (cenas dos blocos)

Você escreve as cenas animadas (Remotion) de alguns blocos do documentário **Terras Raras no Brasil** do canal Contra Prova Brasil. É **um vídeo único** (16 blocos). A narração já está gravada; a base (tema noturno, kit visual, chamadas de inscrição, fim do vídeo, Root) está pronta. Seu trabalho é **só** o arquivo `src/cenas/BlocoNN.tsx` de cada bloco seu, até a auditoria dar 0 problemas.

**Leia antes:** `/Users/medmadson/.claude/skills/apuracao-oficial/references/17-producao-como-fazer-igual.md` (o método: tempos presos à voz, `em(i, trecho)`, movimento, interações, ciclo de QA) e `13c-producao-direcao-audiovisual.md`.

## Onde está cada coisa

- **Projeto:** `/Users/medmadson/canaldark/projetos/terras-raras/video` (blocos 01–16 = roteiro B1–B16).
- **Roteiro (fonte das cenas):** `/Users/medmadson/canaldark/projetos/terras-raras/roteiro.md`. Cada bloco tem "Cenas (decupagem)" com gatilhos, visual, som e transição. Apuração (verdade dos textos de tela): `/Users/medmadson/canaldark/projetos/terras-raras/apuracao/`.
- **Falas com tempo:** `src/data/cues.json`, chave "NN". Use `t(i) = ms(C[i].de)`, `r(i) = t(i) - inicio` e `em(i, "trecho")`. Algumas falas foram reescritas na gravação (siglas por extenso: "serviço geológico americano", "grupo dos sete", "Centro de Gestão e Estudos Estratégicos"…): ache a fala pelo conteúdo no `cues.json`. Na TELA use as grafias reais (USGS, G7, CGEE…).
- **Kit deste vídeo:** `src/componentes/KitJazida.tsx` (leia inteiro): TabelaPeriodica, CorteSolo, Amostra, EsteiraCadeia, MapaJazidas, MisturadorSeparador, ImaCampo, BalancaComercio, LinhaPreco, SeloLei, Cronometro2026, **CartelaCapitulo**. Exemplos em `src/cenas/Vitrine.tsx`. Componentes já no tema: `Contador`, `Etiqueta`, `Documento.tsx` (`Folha` + `Marca`), `Quadro`, `Pelicula`, `Legenda`, `Trilha`/`Efeito`, `Drift`, `Saida`, `Clarao`. Os demais da pasta são de outros temas: confira as cores; variações vão **dentro do seu BlocoNN.tsx**.
- **Tema:** `src/tema.ts` — "jazida": grafite `c.grafite`/`c.papel` fundo, xisto `c.xisto`/`c.gelo` painéis, `c.branco` cartão, areia `c.areia`/`c.tinta` texto, ferrugem `c.ferrugem` acento principal, verde-mineral `c.mineral`/`c.verde` oferta e positivos, enxofre `c.enxofre`/`c.laranja` marca-texto e alertas suaves, azul-aço `c.aco` mapas, vermelho-ferrugem `c.carimbo`/`c.vermelho` só carimbo de revelação (1 por bloco), `c.fio`, `c.cinza`; `sombra`. Fontes: `fontes.titulo` (Big Shoulders), `fontes.texto` (Inter), `fontes.mono` (IBM Plex Mono). **Proibido:** cortiça, fio vermelho, polaroide, recorte de jornal, fundo claro.
- **Sons** em `public/sfx/`: trilhas jazida, estrato, cadeia-terra, forja, mercado-frio, desfecho-jazida; efeitos diapasao (assinatura), cristal-clique, cascalho, esteira, sirene-mina-distante (raro), gota-acida (só em cena de processo), clique, carimbo, impacto, papel-virar, papel-deslizar, whoosh, riser, sting, estatica, porta, subida, pulso, tensao, relogio-tique, sala-espera, passos-corredor, murmurio-multidao. **Nunca** contador Geiger. Siga o "Mapa de trilha" do roteiro. Trilha só via `<Trilha>`; efeitos 0.3–0.6; 8 a 15 por minuto.

## Regras que não podem falhar

1. **NEUTRALIDADE:** descreva atos e números; nenhuma recomendação de empresa. **Projeção de empresa = projeção**: tarja na tela "PROJEÇÃO DO FINANCIADOR". **Dados da China/Malásia nunca aplicados ao Brasil**: tarja "OUTROS PAÍSES, NÃO O BRASIL".
2. **Não afirmar contaminação no Brasil nem que não há** (cartela do B14, com as duas ressalvas).
3. **Proibido:** contador Geiger, símbolo de radioatividade, imagem de barragem real, pessoas, terras indígenas, bandeiras.
4. Números de comércio: o código de ímãs (NCM 8505.11) inclui ímãs que não são só de terras raras — nota na tela.
5. A Lei 15.506 **não** tem as palavras "terras raras" nem proíbe exportar minério bruto (cartão do B13).
6. **Legenda:** cena só de texto = SEM legenda (`ocultar`). Nada sob a legenda (reserve 200 px embaixo nas cenas com legenda).
7. **Tela sempre viva**, cada fala com elemento novo amarrado a `r(i)`/`em(i, …)`; nada parado > 6 s; todo número, data, lei e lugar falado aparece na tela.
8. **Layout preciso:** `whiteSpace: "nowrap"` em etiquetas/títulos/botões; texto a 60 px das bordas.
9. **Capítulos, nunca "ATO":** use `CartelaCapitulo` onde o roteiro marca `# CAPÍTULO …` (25 frames de fundo antes, `diapasao` ou `sting` suave, sem legenda, voz depois com pré-roll OFF≈130: áudio em `<Sequence from={OFF}>`, `<Legenda atraso={OFF}>`, `atrasoVoz={OFF}` em cada Trilha, `DURACAO_NN` inclui o OFF). Os capítulos abrem o bloco indicado no roteiro (`# CAPÍTULO …`); a chamada 2 vem colada depois do B8, então o CAPÍTULO IV abre o bloco 09; o CAPÍTULO I abre o bloco 02 (a chamada 1 vem depois do B1).
10. **Chamadas e fim:** NÃO coloque `ChamadaInscricao`, tela de fontes nem tela final no bloco. O Root cola a chamada 1 depois do 01, a chamada 2 depois do 08 e o fim inteiro (FONTES → tela final → chamada 3 → diapasão → fade) depois do 16. O bloco 16 termina na última fala (sem som-assinatura no fim do bloco).
11. **Revelação:** riser curto → 0,5 s sem trilha → `impacto` discreto + clarão âmbar; só onde o roteiro marca; nunca em dado de vítima.
12. **Fotos:** nenhuma foi baixada; não baixe nada. Onde o roteiro pede foto (Pitinga, marcas de carro, logotipo da Lynas…), use desenho do kit, cartão tipográfico ou documento; nunca logotipo de empresa.
13. **Duração:** exporte `DURACAO_NN` e mantenha os nomes `BlocoNN`/`DURACAO_NN`.

## Auditoria (obrigatória, um bloco por vez)

```bash
cd <pasta video da parte>
export TMPDIR=<sua pasta temporária própria>   # ex.: /private/tmp/claude-501/-Users-medmadson-canaldark/b18c249e-cf40-4c89-97cc-a35fe259093a/scratchpad/agNN
mkdir -p $TMPDIR
npx tsc --noEmit -p .
node qa-quadros.mjs NN
```

- Precisa dar **0 problemas**: CORTADO, SOB_LEGENDA, SOBREPOSTO, VAZIO, TRANSBORDA, TEXTO_CORTADO e **PARADO**.
- Depois **olhe a folha de contato** `../qa/blocoNN/folha.jpg` com a ferramenta Read. Corrija o que a auditoria não vê: texto apertado, cor ruim no fundo claro, elemento feio ou vazio.
- Para ver um quadro específico: `npx remotion still BlocoNN $TMPDIR/x.jpg --frame=N --scale=0.5`, e depois Read.
- Rode a auditoria de **um bloco por vez**. A máquina tem 8 GB e há outros renders rodando.

## Não faça

- Não edite `Root.tsx`, `tema.ts`, os arquivos de `componentes/` nem blocos de outros agentes.
  - Achou um erro num componente do kit? Contorne no seu bloco com uma cópia local e avise no relatório.
- Não renderize o vídeo final nem mexa em outros projetos.
- Não apague nada fora dos seus próprios arquivos temporários. Não use `rm -rf`.
- Não use "ato" na tela. Não edite `KitJazida.tsx` (bug? contorne no seu bloco e avise).

## Relatório final (curto)

Para cada bloco: se está pronto, o resultado da auditoria (0 problemas), o que foi trocado em relação ao roteiro e por quê, e qualquer bug de componente que você contornou.
