# Guia de locução: evitar que a voz troque de idioma

Vale para o roteiro (quem escreve a locução) e para a produção (quem gera o áudio). Aprendido na prática em 30/09/2026, depois de três erros que o usuário ouviu nos vídeos prontos.

## Por que acontece

A voz é `fr-FR-RemyMultilingualNeural` (edge-tts). Ela é multilíngue e escolhe o idioma pelo trecho que está lendo. Sem contexto suficiente, ela pode ler em francês, inglês ou num português estranho:
- frase curta;
- sigla sozinha;
- palavra solta;
- nome estrangeiro.

Nos vídeos prontos, o usuário percebeu logo nos primeiros segundos.

## Casos reais

| Onde | Texto que falhou | O que aconteceu | Versão aprovada pelo usuário |
|---|---|---|---|
| Bolsa Família, 0:00 | `Esmola. Preguiça. Filho para ganhar mais. Compra de voto.` | começou em outro idioma | `As acusações são conhecidas: esmola, preguiça, filho para ganhar mais, compra de voto.` |
| SUAS, 0:40 | `Você conhece o SUS. Conhece o INSS.` (INSS soletrado: "i ene ésse ésse") | trocou de idioma no INSS | `Você conhece o SUS e conhece o INSS.` (uma frase só, "INSS" escrito direto) |
| SUS e Bolsa Família | `IBGE` como "i bê gê é" | soava "ibgê" | `IBGE` escrito direto, dentro de frase normal |
| SUS | `Butantan` | sotaque estranho | `Butantã` |
| SUAS | `LBA` soletrada à mão ("éle bê á") | leitura ruim | `LBA` escrita direto |
| SUAS | `TCU` soletrado à mão ("tê cê u") | leitura ruim | `TCU` escrito direto |
| SUAS, ~11 min | `O SUS atende todos. O SUAS atende quem precisa.` | misturou idiomas | `O SUS atende todos, e o SUAS atende quem precisa.` |
| SUAS | `Funabem` | o usuário ouviu as opções | manter `Funabem` como está (aprovado) |
| SUS, ~7:26 | `British Medical Journal`, `The Lancet`, `Lancet Public Health` no meio de frase longa | testado em 30/09: o usuário achou atual e proposta boas | nome em inglês é aceitável DENTRO de frase longa em português; em frase curta, evitar |

## Regras para ESCREVER a locução (roteiro)

1. **Não abra bloco nem parágrafo com palavras ou frases soltas.** Listas como "Esmola. Preguiça." ou "Violência." sozinhas no início de um trecho são o gatilho mais forte. Ponha antes uma frase introdutória em português ("As acusações são conhecidas: …", "Há também a violência: …").
2. **Não isole sigla em frase curta.** "Conhece o INSS." sozinha falha. Junte com a frase vizinha: "Você conhece o SUS e conhece o INSS."
3. **Frase de tema solta** ("Violência.", "Calamidade.", "E pandemia.", "Crianças e adolescentes.") misturou idiomas no SUAS aos 15 min. Funda com a frase seguinte usando uma introdução ("Há também a violência: em 2025, …").
4. **Frases de efeito curtas** ("Ainda não é lei.", "O favor virava direito.") funcionam quando vêm DEPOIS de uma frase longa em português. Não use como primeira frase do bloco.
4. **Nomes estrangeiros:** use o equivalente em português ("revista médica britânica", "Banco Mundial"). Se o nome original for essencial, ponha dentro de uma frase longa em português.
5. **Siglas:** explique na primeira menção dentro de frase completa. Evite duas siglas seguidas.
6. **Anos em par:** "de 1990 a 2002", nunca "1990 e 2002".

## Verificador automático (roda antes de gerar qualquer voz)

`python3 scripts/producao/checar-locucao.py <pasta-do-projeto>` lê os `locucao/NN.txt`. Com `--raw`, lê os `NN_raw.txt`, e a sessão de roteiro pode usar assim antes de entregar. Ele aponta:
- **ALTO:** abertura de bloco com palavras soltas; sigla não testada em frase curta; palavras em inglês ("The Lancet", "British Medical Journal", "Public Health"…).
- **MÉDIO:** siglas ainda não testadas; grafias de outro idioma em palavra comum; sequências telegráficas ("O trabalhador informal. O desempregado.").

O `gerar-audio.sh` roda o verificador e **para** se houver aviso ALTO. Para resolver cada aviso:
- reescreva o trecho, ou
- gere amostras A/B para o usuário, em arquivos em `~/Downloads/<assunto>-opcoes/`.

Rode com `FORCAR=1` só depois da aprovação do usuário. Assim o erro de fala aparece antes do render, não depois de o vídeo estar pronto.

**Nomes de revistas e instituições estrangeiras:** no teste de 30/09 o usuário aprovou tanto o nome em inglês dentro de frase longa quanto a descrição em português. Use o nome original só no meio de frase longa. Em frase curta ou no começo de bloco, prefira a descrição em português. A narração usa a descrição em português ("uma das principais revistas médicas do mundo", "uma revista médica britânica", "uma revista internacional de saúde pública"). O nome original aparece na tela, no recorte ou no rodapé da fonte. Assim a informação continua completa e a voz não troca de idioma.

## Regras para GERAR o áudio (produção)

1. **Siglas no `locucao/siglas.json`:**
   - siglas que se leem como palavra (SUS, SUAS, CRAS, LOAS, PIB): `Sus`, `Suas`, `Cras`…;
   - INSS, IBGE, LBA e TCU: deixar **sem mapear** (escritas direto);
   - soletrar à mão ("i ene ésse ésse", "i bê gê é", "éle bê á", "tê cê u") piorou em todos os casos testados;
   - siglas ainda soletradas sem queixa (BPC "bê pê cê", STF "ésse tê éfe") são suspeitas. Na primeira vez em um projeto, gere a amostra da forma direta e deixe o usuário escolher.
2. **Antes de gerar os blocos, faça um teste de abertura:**
   - pegue a primeira frase de cada bloco e cada frase curta com sigla;
   - gere amostras com `scripts/producao/amostra-pronuncia.sh`, sempre com a frase seguinte junto, para dar contexto;
   - compare variantes: frase atual, frase juntada, sigla direta, nome por extenso.
3. **Entregue as amostras ao usuário como arquivos em `~/Downloads/<assunto>-opcoes/`** com `scripts/producao/amostra-pronuncia.sh` (um `opcao-N-<rotulo>.mp3` por versão + `todas-em-sequencia.mp3`). O anexo na conversa nem sempre abre para ele. Pergunte o número da opção.
3b. **Antes de montar as cenas, mande a narração completa** (`scripts/producao/narracao-completa.sh`, em `~/Downloads/<tema>-narracao/`) para o usuário ouvir inteira e apontar os minutos com problema. Corrija tudo na narração antes de qualquer render.
4. **Registre a escolha** na tabela de pronúncias (`12-producao-narracao.md`) e no `siglas.json` do projeto. Vale para todos os vídeos seguintes.
5. **Quando juntar duas frases numa só, a cena muda:** o `.srt` passa a ter uma fala a menos e os índices `t(i)` se deslocam. Reparta a fala juntada em partes (pelo tamanho do texto) no começo do bloco, para os elementos continuarem entrando no ritmo. Veja o `Bloco01` do SUAS (SUS/INSS) e o `Bloco01` do Bolsa Família (acusações). Depois, rode o QA do bloco.
6. **Depois de trocar uma sigla ou frase:**
   - regrave só os blocos que a contêm (`gerar-audio.sh <canal> <tema> 01 07`);
   - rode o QA desses blocos;
   - apague `render/blocos/blocoNN.mp4` deles;
   - rode o `render-final.sh`.

## Checklist rápido antes do render

- [ ] Nenhum bloco começa com palavra ou frase solta.
- [ ] Nenhuma sigla sozinha em frase de até 5 palavras.
- [ ] INSS e IBGE escritos direto. Butantan como "Butantã". bets como "béts".
- [ ] Nomes estrangeiros trocados ou dentro de frase longa.
- [ ] Amostras das aberturas aprovadas pelo usuário quando o vídeo tem sigla ou nome novo.
