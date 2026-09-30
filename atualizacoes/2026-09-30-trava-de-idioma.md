# Atualização da skill `apuracao-oficial` — 30/09/2026 (trava de idioma da narração)

**Para o Claude da outra máquina:** esta máquina já tem a skill `~/.claude/skills/apuracao-oficial` instalada. Aplique os passos abaixo exatamente e confirme ao usuário o que foi criado ou alterado.

## Por que esta atualização

A voz `fr-FR-RemyMultilingualNeural` troca de idioma em quatro situações:
- palavras soltas no começo do bloco;
- sigla isolada em frase curta;
- sigla soletrada à mão ("i ene ésse ésse");
- nomes em inglês.

O usuário só percebia no vídeo pronto, e aí era preciso refazer render. Agora existe um verificador que roda **antes** de gerar a voz e trava a geração se houver risco alto.

## Passo 1 — criar o verificador

Crie o arquivo `~/.claude/skills/apuracao-oficial/scripts/producao/checar-locucao.py` com o conteúdo abaixo:

```python
# Verifica a locução ANTES de gerar a voz: aponta trechos que podem fazer a voz Remy trocar de idioma.
# Uso: python checar-locucao.py <pasta-do-projeto> [--raw]
#   padrão: lê locucao/NN.txt (texto que a voz vai ler, já normalizado)
#   --raw : lê locucao/NN_raw.txt (útil para a sessão de roteiro checar antes de normalizar)
# Saída: lista de avisos por bloco, com o motivo e a sugestão. Código de saída 1 se houver aviso ALTO.
import glob, os, re, sys

p = sys.argv[1]
raw = "--raw" in sys.argv
arqs = sorted(glob.glob(os.path.join(p, "locucao", "[0-9][0-9]_raw.txt" if raw else "[0-9][0-9].txt")))

# Siglas/formas já aprovadas pelo usuário em frase normal (ver references/12b)
APROVADAS = {"IBGE", "INSS", "SUS", "SUAS", "CRAS", "CREAS", "LOAS", "PIB", "BPC", "TCU", "STF", "CGU", "MDS", "NOB", "PEC", "CNJ", "PAIF", "POP", "CNAS", "PNAS", "LBA", "ONU", "FAO", "OMS"}
# Palavras e pedaços típicos de inglês (e francês) que a voz lê no idioma original
INGLES = re.compile(r"\b(the|of|and|with|journal|health|public|medical|review|report|world|bank|lancet|nature|science|online|app|delivery|fake|news|streaming|bet|bets|site|web|link|email|software|hardware|design|marketing|ranking|boom|lobby|impeachment|show|games?|free)\b", re.I)
MARCA_INGLES = re.compile(r"\b\w*(th|sh|ck|oo|ee|ght|tion|ing|w|y|k)\w*\b", re.I)
# Palavras portuguesas comuns que batem nos padrões acima (não são aviso)
PT_OK = {"show", "shopping", "whatsapp", "kg", "km", "yanomami", "kayapó", "walter", "wellington", "taylor", "voo", "voos", "zika", "pix"}
SIGLA = re.compile(r"\b[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{2,}\b")

def frases(txt):
    return [f.strip() for f in re.split(r"(?<=[.!?…])\s+", txt) if f.strip()]

altos = 0
for a in arqs:
    n = os.path.basename(a)[:2]
    txt = open(a, encoding="utf-8").read()
    if raw:
        txt = txt.split("\n", 1)[1] if txt.startswith("#") else txt
        txt = re.sub(r"[“”‘’]", "", txt)
    fs = frases(txt)
    avisos = []
    # 1) abertura do bloco com frases curtas/palavras soltas
    abertura = fs[:3]
    curtas = [f for f in abertura if len(re.findall(r"\w+", f)) <= 3]
    if len(curtas) >= 2 or (fs and len(re.findall(r"\w+", fs[0])) <= 2):
        avisos.append(("ALTO", f"abertura com palavras/frases soltas: {' '.join(abertura)[:90]}", "pôr frase introdutória em português antes (ex.: 'As acusações são conhecidas: …')"))
    for f in fs:
        palavras = re.findall(r"\w+", f)
        siglas = [s for s in SIGLA.findall(f)]
        # 2) sigla em frase curta
        if siglas and len(palavras) <= 5:
            nivel = "MÉDIO" if all(x in {"SUS", "SUAS", "CRAS", "CREAS", "LOAS", "PIB"} for x in siglas) else "ALTO"
            avisos.append((nivel, f"sigla em frase curta: \"{f}\"", "juntar com a frase vizinha (ex.: 'Você conhece o SUS e conhece o INSS.')"))
        # 3) sigla não aprovada (pode ser soletrada em inglês)
        for s in siglas:
            if s not in APROVADAS and not re.fullmatch(r"[IVXLC]+", s):
                avisos.append(("MÉDIO", f"sigla não testada: {s} em \"{f[:80]}\"", "gerar amostra (amostra-pronuncia.sh) e mapear no siglas.json se preciso"))
        # 4) palavras em inglês/estrangeiras
        for m in INGLES.finditer(f):
            avisos.append(("ALTO", f"palavra estrangeira '{m.group(0)}' em \"{f[:90]}\"", "trocar por equivalente em português ou pôr dentro de frase longa; testar amostra"))
        for m in MARCA_INGLES.finditer(f):
            w = m.group(0)
            if w.lower() in PT_OK or w.isupper() or INGLES.fullmatch(w): continue
            forte = re.search(r"(th|sh|ck|oo|ee|ght|tion|ing)$|^(th|sh)", w, re.I)
            # nomes próprios só com w/k/y (Sarney, Oswaldo, Darcy) a voz lê bem; só avisa grafia forte de inglês
            if forte or (re.search(r"[wyk]", w, re.I) and not w[0].isupper()):
                avisos.append(("MÉDIO", f"grafia de outro idioma '{w}' em \"{f[:80]}\"", "conferir: nome estrangeiro? testar amostra ou adaptar"))
        # 5) frase de 1–2 palavras isolada logo após outra curta (sequência telegráfica)
    for i in range(1, len(fs)):
        if len(re.findall(r"\w+", fs[i])) <= 2 and len(re.findall(r"\w+", fs[i - 1])) <= 3:
            avisos.append(("MÉDIO", f"sequência telegráfica: \"{fs[i-1]} {fs[i]}\"", "juntar em uma frase"))
    vistos = set()
    for nivel, msg, sug in avisos:
        if (nivel, msg) in vistos: continue
        vistos.add((nivel, msg))
        if nivel == "ALTO": altos += 1
        print(f"[{nivel}] bloco {n}: {msg}\n        → {sug}")
print(f"\n{len(arqs)} blocos verificados · {altos} aviso(s) ALTO")
sys.exit(1 if altos else 0)
```

## Passo 2 — travar o `gerar-audio.sh`

Em `~/.claude/skills/apuracao-oficial/scripts/producao/gerar-audio.sh`, logo depois da linha que roda `pausas.py`, acrescente:

```bash
# Trava de idioma: aponta abertura com palavras soltas, sigla em frase curta e palavras estrangeiras.
# Com aviso ALTO, para aqui. Resolva no NN_raw.txt/siglas.json (ou gere amostras) e rode de novo; FORCAR=1 ignora.
if ! "$PY" "$SK/checar-locucao.py" "$P"; then
  [ "${FORCAR:-0}" = 1 ] || { echo "PAROU: resolva os avisos ALTO acima (ou FORCAR=1 depois de o usuário aprovar as amostras)."; exit 2; }
fi
```

Se essa máquina ainda não tem `scripts/producao/`, gere a voz como já fazia, mas rode antes: `python3 checar-locucao.py <pasta-do-projeto>`.

## Passo 3 — siglas aprovadas (atualizar `locucao/siglas.json` dos projetos)

- **Remover** as entradas `"IBGE"` e `"INSS"`: as duas ficam escritas direto, sem soletrar.
- Butantan → `"Butantã"`. bets → `"béts"`, bet → `"bét"`.
- Nunca mapear numeral romano sozinho. Use o contexto: `"IV Conferência": "quarta Conferência"`.

## Passo 4 — criar o guia de locução

Crie `~/.claude/skills/apuracao-oficial/references/12b-guia-locucao-sem-troca-de-idioma.md` com o conteúdo abaixo e cite-o no `SKILL.md`, na seção de produção e nas regras de texto do roteiro, como leitura obrigatória:

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
| SUS, ~7:26 (suspeita) | `British Medical Journal` | nome em inglês muda o sotaque | preferir "a revista médica britânica BMJ" |

## Regras para ESCREVER a locução (roteiro)

1. **Não abra bloco nem parágrafo com palavras ou frases soltas.** Listas como "Esmola. Preguiça." ou "Violência." sozinhas no início de um trecho são o gatilho mais forte. Ponha antes uma frase introdutória em português ("As acusações são conhecidas: …", "Há também a violência: …").
2. **Não isole sigla em frase curta.** "Conhece o INSS." sozinha falha. Junte com a frase vizinha: "Você conhece o SUS e conhece o INSS."
3. **Frases de efeito curtas** ("Ainda não é lei.", "O favor virava direito.") funcionam quando vêm DEPOIS de uma frase longa em português. Não use como primeira frase do bloco.
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

**Nomes de revistas e instituições estrangeiras (recomendação; amostras A/B enviadas ao usuário em 30/09, confirmar a escolha):** não falar o nome em inglês. A narração usa a descrição em português ("uma das principais revistas médicas do mundo", "uma revista médica britânica", "uma revista internacional de saúde pública"). O nome original aparece na tela, no recorte ou no rodapé da fonte. Assim a informação continua completa e a voz não troca de idioma.

## Regras para GERAR o áudio (produção)

1. **Siglas no `locucao/siglas.json`:**
   - siglas que se leem como palavra (SUS, SUAS, CRAS, LOAS, PIB): `Sus`, `Suas`, `Cras`…;
   - INSS e IBGE: deixar **sem mapear** (escritas direto);
   - soletrar à mão ("i ene ésse ésse", "i bê gê é") piorou nos dois casos;
   - outras siglas soletradas (BPC, TCU, STF: "bê pê cê", "tê cê u", "ésse tê éfe") funcionaram bem no meio de frase. Se o usuário apontar problema, teste a forma direta.
2. **Antes de gerar os blocos, faça um teste de abertura:**
   - pegue a primeira frase de cada bloco e cada frase curta com sigla;
   - gere amostras com `scripts/producao/amostra-pronuncia.sh`, sempre com a frase seguinte junto, para dar contexto;
   - compare variantes: frase atual, frase juntada, sigla direta, nome por extenso.
3. **Entregue as amostras ao usuário como arquivos em `~/Downloads/<assunto>-opcoes/`**, um arquivo por opção (`opcao-1.mp3`…) e mais um com todas em sequência. O anexo na conversa nem sempre abre para ele. Pergunte o número da opção.
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

## Passo 5 — conferir

1. Rode `python3 ~/.claude/skills/apuracao-oficial/scripts/producao/checar-locucao.py <pasta-de-um-projeto>`. Ele deve listar avisos [ALTO]/[MÉDIO] e terminar com "N blocos verificados".
2. Confirme ao usuário: arquivos criados, `gerar-audio.sh` alterado e siglas atualizadas.

## Complemento (30/09, mais tarde)

- **LBA:** escrever direto (`LBA`). "éle bê á" soletrado foi reprovado pelo usuário. Remova `"LBA"` do `siglas.json`.
- **Funabem:** manter como está (aprovado).
- O `checar-locucao.py` agora aponta sigla soletrada à mão como ALTO. Exceções já usadas sem queixa: bê pê cê, tê cê u, ésse tê éfe, cê gê u, a vê cê, agá i vê, cê pê í, u bê ésse, que ficam como MÉDIO.
- Frases curtas com sigla em sequência ("O SUS atende todos. O SUAS atende quem precisa.") misturaram idiomas por volta dos 11 min do SUAS. Junte numa frase só; as amostras estão em análise com o usuário.
- **TCU:** escrever direto (`TCU`). "tê cê u" foi reprovado. Remova `"TCU"` do `siglas.json`.
- **Frases de tema soltas** ("Violência.", "Calamidade.", "E pandemia.") misturam idiomas. O verificador agora aponta essas frases como ALTO. Funda com a frase seguinte ("Há também a violência: …").
- **Trecho de ~11 min do SUAS:** aprovado "O SUS atende todos, e o SUAS atende quem precisa." numa frase só.

## Novo fluxo de revisão (30/09)

- **Revisão da narração antes das cenas:** `scripts/producao/narracao-completa.sh <canal> <tema>` gera `~/Downloads/<tema>-narracao/` com o áudio completo, os blocos separados e um índice por minuto. O usuário ouve e aponta os minutos com problema. Só depois de aprovado começam as cenas e o render.
- **Amostras:** `scripts/producao/amostra-pronuncia.sh <canal> <assunto> "A-atual|…" "B-…|…"` grava em `~/Downloads/<assunto>-opcoes/` (um arquivo por opção + todas em sequência).

## Direção audiovisual e layout (30/09)

- Novo guia obrigatório: `references/13c-producao-direcao-audiovisual.md`. Ele cobre:
  - tela sempre viva, sem lacunas;
  - informação visual para todo dado;
  - transições com som;
  - trilha, efeitos e ambiência por emoção;
  - layout preciso.
- O QA agora aponta **PARADO**: mais de 6 s sem mudança na tela, via `qa-parado.py`. O arquivo tem de estar na pasta `video/` de cada projeto, e o `qa-quadros.mjs` chama esse script.
- A auditoria agora pega **texto que quebra linha e sai da caixa**: TRANSBORDA vertical. Caixa de altura fixa exige `whiteSpace: nowrap` e `minWidth` com `padding`.
- Em projetos já existentes, copie `assets/producao-template-video/{qa-parado.py,qa-quadros.mjs,src/componentes/Auditoria.tsx,src/componentes/KitBF.tsx}` para a pasta `video/`.

- **AVC:** escrever direto (`AVC`), sem mapear no `siglas.json`. "a vê cê" foi reprovado. **Regra geral: não soletrar sigla à mão.**
- **Revistas em inglês** (The Lancet, BMJ) no meio de frase longa: aprovadas como estão.

## Voz acima da música, chamada de inscrição, movimento (30/09, tarde)

- **`Trilha` com ducking automático**: a música desce para ≤ 0.12 enquanto a voz fala e depende de `useVideoConfig().id = BlocoNN` e do `cues.json`. Em projeto existente, copie `assets/producao-template-video/src/componentes/Trilha.tsx`. Em bloco com pré-roll, use `atrasoVoz`.
- **`ChamadaInscricao`** (inscreva-se + sininho): obrigatória em 3 momentos de todo vídeo. Ver `13c`, seção 4b. O roteiro precisa trazer a frase da chamada.
- **`Drift`**: zoom e deslize lento para cena de leitura ou mapa não ficar parada.
- **Pergunta curta solta** ("Compra de voto?") também troca o idioma. Use "E a compra de voto?". O verificador agora checa perguntas curtas.
