# Extrai a locução de cada bloco do roteiro.md para locucao/NN_raw.txt.
# Formato esperado no roteiro: "### B1 · 00:00–01:45 — Título", depois "**LOCUÇÃO**", o texto, e "**FIM DA LOCUÇÃO**".
# Uso: python extrair-locucao.py <pasta-do-projeto>
import os, re, sys
p = sys.argv[1]
s = open(os.path.join(p, "roteiro.md"), encoding="utf-8").read()
blocos = re.findall(r"^### (B(\d+) · [^\n]+)\n(.*?)(?=^### B\d+ ·|^## |\Z)", s, re.S | re.M)
os.makedirs(os.path.join(p, "locucao"), exist_ok=True)
for titulo, n, corpo in blocos:
    m = re.search(r"\*\*LOCUÇÃO\*\*\s*\n(.*?)\n\*\*FIM DA LOCUÇÃO\*\*", corpo, re.S)
    if not m:
        print("sem locução:", titulo); continue
    txt = m.group(1).strip()
    open(os.path.join(p, "locucao", f"{int(n):02d}_raw.txt"), "w", encoding="utf-8").write(f"# {titulo}\n{txt}\n")
    print(f"B{int(n):02d}: {len(txt.split())} palavras")
