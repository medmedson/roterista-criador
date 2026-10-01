# Normaliza texto de locução para o TTS (voz Remy): números por extenso e siglas faladas.
# Grava locucao/NN.txt e locucao/substituicoes.json (pares falado -> exibido, usados nas legendas).
# Uso: python normalizar.py <pasta-projeto> [siglas.json]
import json, re, sys, glob, os

UN = "zero um dois três quatro cinco seis sete oito nove dez onze doze treze catorze quinze dezesseis dezessete dezoito dezenove".split()
DEZ = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"]
CEN = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"]

def ate999(n):
    if n == 100: return "cem"
    c, r = divmod(n, 100)
    partes = []
    if c: partes.append(CEN[c])
    if r:
        if r < 20: partes.append(UN[r])
        else:
            d, u = divmod(r, 10)
            partes.append(DEZ[d] + (f" e {UN[u]}" if u else ""))
    return " e ".join(partes) if partes else "zero"

def extenso(n):
    if n < 1000: return ate999(n)
    if n < 1_000_000:
        m, r = divmod(n, 1000)
        pre = "mil" if m == 1 else f"{ate999(m)} mil"
        if not r: return pre
        return pre + (" e " if r < 100 or r % 100 == 0 else " ") + ate999(r)
    mi, r = divmod(n, 1_000_000)
    pre = ("um milhão" if mi == 1 else f"{ate999(mi)} milhões")
    return pre + ((" e " if r < 1000 else " ") + extenso(r) if r else "")

pasta = sys.argv[1]
siglas = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else {}
pares = {}
for raw in sorted(glob.glob(os.path.join(pasta, "locucao", "[0-9][0-9]_raw.txt"))):
    txt = open(raw, encoding="utf-8").read().split("\n", 1)[1]
    txt = re.sub(r"[“”‘’]", "", txt).replace(" — ", "... ")
    for a, b in siglas.items():
        novo = re.sub(rf"\b{re.escape(a)}\b", b, txt)
        if novo != txt: pares[b] = a
        txt = novo
    # intervalo de anos ("1990 e 2002"): vírgula evita ler "noventa e dois mil"
    txt = re.sub(r"(\d{4}) e (\d{4})", r"\1, e \2", txt)
    def num(m):
        bruto = m.group(0)
        n = int(bruto.replace(".", ""))
        falado = extenso(n)
        # só números grandes (anos, milhares) viram par para a legenda: um par como "setenta" -> "70" trocaria também
        # o meio de "cento e setenta e cinco" (bug visto em Terras Raras)
        if n >= 1000: pares[falado] = bruto
        return falado
    # inteiros (com ponto de milhar), sem mexer em números colados a letras
    txt = re.sub(r"(?<![\w,])\d{1,3}(?:\.\d{3})+(?!\w|,\d)|(?<![\w,.])\d+(?!\w|[,.]\d)", num, txt)
    out = raw.replace("_raw", "")
    open(out, "w", encoding="utf-8").write(txt.strip() + "\n")
    resto = re.findall(r"\d+|\b[A-Z]{2,}\b", txt)
    print(os.path.basename(out), "restou:", sorted(set(resto)))
json.dump(pares, open(os.path.join(pasta, "locucao", "substituicoes.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
