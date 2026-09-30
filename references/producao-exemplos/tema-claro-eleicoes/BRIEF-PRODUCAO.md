# Briefing de produção: série Eleições (cenas dos blocos)

Você escreve as cenas animadas (Remotion) de alguns blocos da série "Eleições no Brasil", do canal Contra Prova Brasil.
A narração já está gravada. A base (tema claro, kit visual, chamadas de inscrição, Root) está pronta. Seu trabalho é **só** o arquivo `src/cenas/BlocoNN.tsx` de cada bloco seu, até a auditoria dar 0 problemas.

## Onde está cada coisa

- **Roteiro:** `/Users/medmadson/canaldark/projetos/eleicoes/roteiro.md`. É a fonte das cenas. Cada bloco tem "Cenas (decupagem)" com gatilhos, visual, som e transição.
  - Apuração: `/Users/medmadson/canaldark/projetos/eleicoes/apuracao/`, a fonte de verdade dos textos de tela.
- **Parte 1:** `/Users/medmadson/canaldark/projetos/eleicoes-parte1/video`. Blocos 01–07 = roteiro B1–B7; bloco **08 = "FECHO DA PARTE 1"**.
- **Parte 2:** `/Users/medmadson/canaldark/projetos/eleicoes-parte2/video`. Bloco **00 = "ABERTURA DA PARTE 2"**; blocos 08–15 = roteiro B8–B15.
- **Falas com tempo:** `src/data/cues.json`, chave "NN", uma lista de `{de, ate, texto}` em ms. Use sempre `const t = (i) => ms(C[i].de)` e, dentro de cada `Sequence`, frames relativos `r(i) = t(i) - inicio`. Numa Sequence aninhada, subtraia o início dela também.
  - Algumas falas foram reescritas na gravação, para evitar troca de idioma da voz. O gatilho do roteiro pode estar com outra redação: ache a fala pelo conteúdo, no `cues.json`.
- **Skill de produção:** `/Users/medmadson/.claude/skills/apuracao-oficial/`. Leia antes de começar:
  - `references/13-producao-cenas.md` (padrões de bloco);
  - `references/13c-producao-direcao-audiovisual.md` (**obrigatório**: tela sempre viva, transições, som, emoção, layout sem quebra);
  - `references/14-producao-som.md`;
  - `references/15-producao-qa-render.md`;
  - `references/16-producao-regras-e-armadilhas.md`.
  - Exemplos de blocos prontos em `references/producao-exemplos/`. Eles são do tema ESCURO: copie a estrutura, não as cores.
- **Kit deste vídeo:** `src/componentes/KitEleicoes.tsx`. Leia o arquivo inteiro. Ele traz:
  - TecladoUrna, Cedula, UrnaDeLona, CabineVoto, BobinaBU, SeloLacre, LinhaFita e CadeiaConfianca;
  - MosaicoUF, MapaPontosSecao, RelogioDia, BlocosQuociente, RegistroTicket e ProvasEmFila;
  - **CartelaCapitulo**.
  - Exemplo de uso de cada um em `src/cenas/Vitrine.tsx`.
- **Componentes já no tema claro:**
  - `Contador`;
  - `Etiqueta`;
  - `Documento.tsx` (`Folha` + `Marca`, o marca-texto laranja);
  - `Quadro`, que é o fundo de papel, e `Pelicula`;
  - `Legenda`;
  - `Trilha` e `Efeito`;
  - `Drift`, `Saida` e `Clarao`, se servirem.
  - Os outros componentes da pasta são do tema escuro. Se usar algum, confira as cores numa imagem. Precisando de variação, crie-a **dentro do seu BlocoNN.tsx**; não edite componentes compartilhados.
- **Tema:** `src/tema.ts`.
  - `c.papel` #F6F4EE é o fundo; `c.gelo` #EAEEF3 é para cartões.
  - `c.tinta` para texto, `c.azul` como cor principal, `c.verde` para CONFIRMA e positivo, `c.laranja` para CORRIGE e alerta suave.
  - `c.vermelho` só em carimbo de revelação, no máximo 1 por bloco. `c.fio` para linhas e `c.cinza` para texto secundário.
  - `sombra` é a sombra suave dos cartões.
  - Fontes: `fontes.titulo` (Big Shoulders: títulos e números), `fontes.texto` (Inter) e `fontes.mono` (IBM Plex Mono: datas e leis).
  - **Proibido:** cortiça, fio vermelho, polaroide escura, recorte de jornal amassado e fundo escuro.
- **Sons** em `public/sfx/`:
  - trilhas: manha, papel, sufragio, chumbo, engrenagem, cofre, contraprova, relogio, guarda e desfecho-cidada;
  - efeitos: bip-confirma, tecla-urna, cedula-dobrar, lona-rasgar, lacre-rasgar, lacre-fechar, impressora-termica, lapis-marca, clique, carimbo, impacto, papel-virar, papel-deslizar, whoosh, riser, sting, estatica, porta, sala-espera, passos-corredor, subida, pulso, tensao, murmurio-multidao e relogio-tique.
  - Siga o "Mapa de trilha" do roteiro.
  - Trilha só via `<Trilha>`: ela baixa sozinha sob a voz.
  - Efeitos entre 0.3 e 0.6. Em média 8 a 15 por minuto; menos no B14, que é comoção.

## Regras que não podem falhar

1. **Neutralidade:** nenhum candidato, número de candidato real, partido real, coligação ou logotipo na tela. Partidos só como "PARTIDO A/B/C". A multa de 2022 aparece sem nomes. Toda afirmação sobre a urna é atribuída na tela: "Segundo o TSE", "Segundo a Defesa".
2. **B10 (As perguntas difíceis)**, no bloco 10 da Parte 2: sem drama, sem bip-confirma, colunas de peso igual e trilha `contraprova` sem percussão.
3. **Legenda:** a cena que é só texto fica SEM legenda. Isso vale para cartela, citação, documento, número sozinho, pergunta, cartela de capítulo e tela final. Passe os intervalos em `<Legenda cues={C} ocultar={[[de, ate], …]} />`, em frames do bloco. Nada fica sob a legenda: reserve 200 px embaixo nas cenas com legenda.
4. **Tela sempre viva:** cada fala tem elemento novo ou mudança amarrada a `r(i)`, e nada fica parado mais de 6 s. A câmera viva já é global, mas não basta sozinha. Todo número, data, lei e lugar falado aparece na tela.
5. **Layout preciso:** `whiteSpace: "nowrap"` em etiquetas, títulos e botões. Texto a pelo menos **60 px das bordas**, porque o zoom da câmera corta ~45 px. Nada de caixa com texto quebrando.
6. **Capítulos, nunca "ATO":** onde o roteiro põe cartela ("ATO II — A MÁQUINA" etc.), use `CartelaCapitulo numero="II" titulo="A MÁQUINA"`, com uns 25 frames de fundo papel antes, som `sting` suave, sem legenda. Veja no roteiro em que bloco cada cartela fica: normalmente no início do bloco que abre o capítulo, ou no fim do anterior, conforme a decupagem.
7. **Chamadas de inscrição:** NÃO coloque `ChamadaInscricao` no bloco. O Root cola as chamadas depois dos blocos 01, 04 e 08 da Parte 1 e depois dos blocos 00, 12 e 15 da Parte 2. Pule essas cenas do roteiro. A tela final dos blocos 08 (P1) e 15 (P2) continua no bloco, e a chamada entra depois dela.
8. **Fotos:** nenhuma foto foi baixada. Não baixe nada da internet. Onde o roteiro pede foto, use ilustração do kit, cartão tipográfico ou documento (`Folha` com `Marca`). Nunca rosto de pessoa real.
9. **Revelação:** riser curto → 0,5 s de silêncio → `impacto` discreto + `Clarao` branco (não vermelho). Só nos 3 momentos que o roteiro marca.
10. **Duração:** exporte `DURACAO_NN` (fim da última fala + folga para a tela final/cartela) e mantenha os nomes `BlocoNN` e `DURACAO_NN`. O Root já importa esses nomes.

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
- Não use "ato" na tela.

## Relatório final (curto)

Para cada bloco: se está pronto, o resultado da auditoria (0 problemas), o que foi trocado em relação ao roteiro e por quê, e qualquer bug de componente que você contornou.
