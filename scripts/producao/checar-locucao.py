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
# Nomes de letras: sigla soletrada à mão no siglas.json ("éle bê á", "i ene ésse ésse") — o usuário reprovou LBA e INSS assim
LETRAS = r"(á|bê|cê|dê|é|éfe|gê|agá|i|jota|cá|éle|ême|ene|ó|pê|quê|érre|ésse|tê|u|vê|xis|zê)"
SOLETRADA = re.compile(rf"\b{LETRAS}(\s+{LETRAS}){{1,}}\b")
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
        # 3b) sigla soletrada à mão
        for m in SOLETRADA.finditer(f):
            ok = re.sub(r"\s+é$", "", m.group(0)) in {"bê pê cê", "ésse tê éfe", "cê gê u", "agá i vê", "cê pê í", "u bê ésse"}
            avisos.append(("MÉDIO" if ok else "ALTO", f"sigla soletrada à mão '{m.group(0)}' em \"{f[:80]}\"", "gerar amostras: sigla direta, nome por extenso ou só o nome (ex.: 'a Legião'); soletrar à mão já falhou com INSS e LBA"))
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
        # 5) frase de tema isolada ("Violência.", "E pandemia.", "Crianças e adolescentes.") — misturou idioma no SUAS aos 15 min
        # verbo presente = frase de efeito ("Faltava a lei.") costuma ir bem; sem verbo = rótulo solto, que falhou
        tem_verbo = re.search(r"\b(é|são|há|tem|foi|era|eram|está|vai|\w+(ou|ava|ia|am|em|ar|er|ir|iu|eu))\b", f, re.I)
        if 1 <= len(palavras) <= 3 and f not in abertura[:1]:
            avisos.append(("MÉDIO" if (tem_verbo and len(palavras) == 3) else "ALTO", f"frase de tema solta: \"{f}\"", "fundir com a frase seguinte com introdução (ex.: 'Há também a violência: em 2025, …')"))
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
