# Produção: narração (edge-tts) e legendas

**Leia antes: `12b-guia-locucao-sem-troca-de-idioma.md`** (regras para a voz não trocar de idioma, com os casos reais).

## Voz

- Voz: `fr-FR-RemyMultilingualNeural` com `--rate=-5%`. O usuário escolheu essa voz entre Antonio, Andrew, Brian, Florian e Remy, com tom de âncora de telejornal.
- Blocos de comoção podem ir mais lentos e baixos, por exemplo `VOZ_EXTRA_08="--rate=-12% --volume=-10%"` no `gerar-audio.sh`.
- Ritmo real: cerca de 150 palavras por minuto. 3.700 palavras dão uns 25 min de voz.
- **Abertura de bloco com palavras soltas faz a voz começar em outro idioma.** Exemplo: "Esmola. Preguiça. Filho para ganhar mais." Solução aprovada pelo usuário: uma frase introdutória em português antes da lista ("As acusações são conhecidas: esmola, preguiça, filho para ganhar mais, compra de voto."). Foi a escolhida pelo usuário entre quatro opções (vírgulas, reticências, frase introdutória e voz Antonio). Se a lista de palavras soltas vier do roteiro, avise a sessão de roteiro e aplique a frase introdutória. Na cena, reparta a fala pelos termos para os cartões seguirem o ritmo (veja o Bloco01 do Bolsa Família).
- A voz é multilíngue: se o texto parece de outro idioma, ela troca o sotaque. O que dispara isso:
  - nomes estrangeiros ("British Medical Journal");
  - siglas soltas;
  - frases muito curtas no início do áudio ("Esmola. Preguiça.").
  Nesses casos, gere amostras e ouça. Onde a frase deixar, prefira um equivalente em português ("a revista médica britânica BMJ").

## Normalização (`ferramentas/normalizar.py`)

`python normalizar.py <pasta-do-projeto> <siglas.json>` lê `locucao/NN_raw.txt` e grava `locucao/NN.txt`, que é o que a voz lê. Ele faz três coisas:
- troca siglas e nomes pela forma falada, conforme `siglas.json`. A chave casa como palavra inteira e pode ter mais de uma palavra, como `"IV Conferência": "quarta Conferência"`;
- escreve números por extenso, inclusive com ponto de milhar;
- põe vírgula em pares de anos: "1990 e 2002" vira "1990, e 2002". Sem isso, a voz lê "noventa e dois mil e dois".

Ele grava ainda `locucao/substituicoes.json` (forma falada → forma exibida). O `gerar-dados.mjs` usa esse arquivo para as legendas voltarem a mostrar "IBGE", "2026" etc.

Depois de normalizar, confira o que ele imprime em "restou:" (números ou siglas sem tratamento) e resolva no `siglas.json`.

### Pronúncias aprovadas pelo usuário (valem para todo vídeo)

| Escrita | No siglas.json | Por quê |
|---|---|---|
| bets / bet | `béts` / `bét` | o usuário quer "béts", não "bêtis" |
| IBGE | deixar `IBGE` (sem mapear) | "i bê gê é" soava "ibgê"; "IBGE" direto, dentro de frase, foi aprovado |
| INSS | deixar `INSS` (sem mapear) e nunca em frase curta sozinha | "i ene ésse ésse" em "Conhece o INSS." trocou o idioma; aprovado: "Você conhece o SUS e conhece o INSS." |
| Butantan | `Butantã` | outras grafias mudavam o sotaque |
| LBA | deixar `LBA` (sem mapear) | "éle bê á" ficou ruim; direta aprovada (30/09) |
| Funabem | manter `Funabem` | aprovada como está (30/09) |
| Collor | `Kólor` | |
| siglas lidas como palavra (SUS, SUAS, CRAS, CREAS, LOAS, PIB) | `Sus`, `Suas`, `Cras`… | em maiúsculas a voz soletra |
| siglas soletradas (BPC, INSS, TCU, STF) | `bê pê cê`, `i ene ésse ésse`, `tê cê u`, `ésse tê éfe` | |
| numeral romano de evento | `"IV Conferência": "quarta Conferência"` | nunca mapear `IV` sozinho: "décima quarta" vira "décima IV" na legenda |

Na dúvida, use `bash scripts/producao/amostra-pronuncia.sh <canal> saida.mp3 "frase A" "frase B" …`. Mande o arquivo ao usuário e pergunte o número da versão. Teste sempre dentro de uma frase de contexto, não com a palavra sozinha.

## Pausas dramáticas

O edge-tts não aceita SSML de pausa. O que funciona é "…" depois da frase:
- escreva as frases já na forma normalizada em `locucao/pausas.txt`, uma por linha;
- o `scripts/producao/pausas.py` aplica as pausas (o `gerar-audio.sh` já chama);
- o "…" cria uma legenda vazia, e o `gerar-dados.mjs` remove essas legendas e os "…" do texto exibido.

## Legendas

O `edge-tts --write-subtitles` gera um `.srt` por bloco. O `gerar-dados.mjs` transforma em `src/data/cues.json`: `{ "01": [{ de, ate, texto }] }`, com tempo em ms.

As cenas usam `t(i) = ms(C[i].de)`, o frame em que começa a fala i. A partição das falas pode mudar quando o áudio é regenerado:
- compare a contagem de falas antes e depois;
- se uma fala se dividir em duas, junte de volta no bloco (exemplo no `producao-exemplos/`, BF Bloco10) ou reajuste os índices;
- depois, rode o QA de novo nos blocos afetados.

## Regenerar só alguns blocos

Rode `bash gerar-audio.sh <canal> <tema> 04 07`. Depois:
1. rode o QA desses blocos;
2. apague `render/blocos/blocoNN.mp4` dos afetados;
3. rode o `render-final.sh`.
