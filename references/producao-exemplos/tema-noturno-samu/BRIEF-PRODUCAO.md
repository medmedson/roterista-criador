# Briefing de produção: SAMU 192 (cenas dos blocos)

Você escreve as cenas animadas (Remotion) de alguns blocos do documentário **SAMU 192** do canal Contra Prova Brasil. É **um vídeo único** (16 blocos). A narração já está gravada; a base (tema noturno, kit visual, chamadas de inscrição, fim do vídeo, Root) está pronta. Seu trabalho é **só** o arquivo `src/cenas/BlocoNN.tsx` de cada bloco seu, até a auditoria dar 0 problemas.

**Leia antes:** `/Users/medmadson/.claude/skills/apuracao-oficial/references/17-producao-como-fazer-igual.md` (o método: tempos presos à voz, `em(i, trecho)`, movimento, interações, ciclo de QA) e `13c-producao-direcao-audiovisual.md`.

## Onde está cada coisa

- **Projeto:** `/Users/medmadson/canaldark/projetos/samu/video` (blocos 01–16 = roteiro B1–B16).
- **Roteiro (fonte das cenas):** `/Users/medmadson/canaldark/projetos/samu/roteiro.md`. Cada bloco tem "Cenas (decupagem)" com gatilhos, visual, som e transição. Apuração (verdade dos textos de tela): `/Users/medmadson/canaldark/projetos/samu/apuracao/`.
- **Falas com tempo:** `src/data/cues.json`, chave "NN". Use `t(i) = ms(C[i].de)`, `r(i) = t(i) - inicio` e `em(i, "trecho")`. Algumas falas foram reescritas na gravação (B13: "corrigindo os valores pela inflação oficial medida pelo IPCA, do IBGE"; B15: "por aplicativo de mensagens"): ache a fala pelo conteúdo no `cues.json`.
- **Kit deste vídeo:** `src/componentes/KitSAMU.tsx` (leia inteiro): Giroflex, MapaRotas, PainelCentral, CartaoChamada, FluxoRegulacao, AmbulanciaCorte, TabelaEquipes, ReguaMinuto, Balanca3, ValorReal, LinhaNorma, RadarCobertura, **CartelaCapitulo**. Exemplos em `src/cenas/Vitrine.tsx`. Componentes já no tema: `Contador`, `Etiqueta`, `Documento.tsx` (`Folha` + `Marca`), `Quadro` (fundo), `Pelicula`, `Legenda`, `Trilha`/`Efeito`, `Drift`, `Saida`, `Clarao`. Os demais componentes da pasta são de outros temas: se usar, confira as cores; variações vão **dentro do seu BlocoNN.tsx**.
- **Tema:** `src/tema.ts` — noturno da central. `c.noite`/`c.papel` #0B1F3A fundo, `c.painel`/`c.gelo` painéis, `c.branco` cartão (vidro escuro), `c.tinta`/`c.claro` texto claro, `c.ciano`/`c.azul` dados e rotas, `c.ambar`/`c.laranja` giroflex e marca-texto, `c.vermelho`/`c.giroflex` só alerta e carimbo de revelação (no máx. 1 por bloco), `c.fio` grades, `c.cinza` texto secundário; `sombra`. Fontes: `fontes.titulo` (Big Shoulders), `fontes.texto` (Inter), `fontes.mono` (IBM Plex Mono). **Proibido:** cortiça, fio vermelho, polaroide, recorte de jornal, fundo claro.
- **Sons** em `public/sfx/`: trilhas plantao, vazio, regulacao, norma, relogio-cru, comocao-central, balanco-cru, desfecho-central; efeitos toque-central (assinatura), radio-chiado, tique-relogio, sirene-distante (curta, baixa, no máx. 1 por capítulo), porta-ambulancia, mapa-ping, impressora-termica, clique, carimbo, impacto, papel-virar, papel-deslizar, whoosh, riser, sting, estatica, porta, passos-corredor, subida, pulso, tensao, relogio-tique, sala-espera, murmurio-multidao. Siga o "Mapa de trilha" do roteiro. Trilha só via `<Trilha>`; efeitos 0.3–0.6; 8 a 15 por minuto (B11 e B12: nenhum efeito por cima, só piano e violoncelo).

## Regras que não podem falhar

1. **Nenhuma imagem de paciente, vítima, sangue, hospital com pessoas ou local de tragédia** (Kiss, Brumadinho, enchente = só cartões de texto). Nunca pessoas nem rostos: só pontos, ícones, ambulâncias em desenho, telas.
2. **Nunca dizer/mostrar que "o SAMU salva X vidas"**: nenhum estudo mede.
3. **Financiamento só com fatos e datas**, sem adjetivo partidário. "+58%" é CÁLCULO DO CANAL (IPCA): tarja na tela (o `ValorReal` já traz).
4. **Investigações (Goiânia) = suspeitas, nunca condenação** ("é uma investigação, e não uma condenação" na tela junto).
5. Nada de "abandono/sucateamento/descaso" na tela.
6. **Legenda:** cena só de texto = SEM legenda (`ocultar`). Nada sob a legenda (reserve 200 px embaixo nas cenas com legenda).
7. **Tela sempre viva**, cada fala com elemento novo amarrado a `r(i)`/`em(i, …)`; nada parado > 6 s; todo número, data, lei e lugar falado aparece na tela.
8. **Layout preciso:** `whiteSpace: "nowrap"` em etiquetas/títulos/botões; texto a 60 px das bordas.
9. **Capítulos, nunca "ATO":** use `CartelaCapitulo` onde o roteiro marca `# CAPÍTULO …` (25 frames de fundo antes, `toque-central` ou `sting` suave, sem legenda, voz depois com pré-roll OFF≈130: áudio em `<Sequence from={OFF}>`, `<Legenda atraso={OFF}>`, `atrasoVoz={OFF}` em cada Trilha, `DURACAO_NN` inclui o OFF). O CAPÍTULO III abre o bloco 08 (a chamada 2 vem colada depois do 07).
10. **Chamadas e fim:** NÃO coloque `ChamadaInscricao`, tela de fontes nem tela final no bloco. O Root cola a chamada 1 depois do 01, a chamada 2 depois do 07 e o fim inteiro (FONTES → tela final → chamada 3 → toque-central → fade) depois do 16. O bloco 16 termina na última fala (sem som-assinatura no fim do bloco).
11. **Revelação:** riser curto → 0,5 s sem trilha → `impacto` discreto + clarão âmbar; só onde o roteiro marca; nunca em dado de vítima.
12. **Fotos:** nenhuma foi baixada; não baixe nada. Onde o roteiro pede foto, use desenho do kit, cartão tipográfico ou documento.
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
- Não use "ato" na tela. Não edite `KitSAMU.tsx` (bug? contorne no seu bloco e avise).

## Relatório final (curto)

Para cada bloco: se está pronto, o resultado da auditoria (0 problemas), o que foi trocado em relação ao roteiro e por quê, e qualquer bug de componente que você contornou.
