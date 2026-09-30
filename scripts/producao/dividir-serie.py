# Série em 2 partes: divide projetos/<tema>/roteiro.md em <tema>-parte1 e <tema>-parte2 (cada um com seu roteiro.md) e extrai a locução.
# Numeração: blocos mantêm o número do roteiro; "FECHO DA PARTE 1" vira o bloco seguinte ao último da parte 1;
# "ABERTURA DA PARTE 2" vira B0. A apuração é ligada por link. O roteiro original continua sendo a fonte.
# Uso: python dividir-serie.py <pasta-projetos> <tema>
import os, re, subprocess, sys
base, tema = sys.argv[1], sys.argv[2]
s = open(os.path.join(base, tema, "roteiro.md"), encoding="utf-8").read()
i1 = s.index("### B1 ·"); ip2 = s.index("# PARTE 2"); iesc = s.index("## Escaleta de produção")
cab, p1, p2, fim = s[:i1], s[i1:ip2], s[ip2:iesc], s[iesc:]
ult = max(int(n) for n in re.findall(r"^### B(\d+) ·", p1, re.M))
p1 = p1.replace("### FECHO DA PARTE 1 ·", f"### B{ult + 1} · FECHO DA PARTE 1 ·", 1)
p2 = p2.replace("### ABERTURA DA PARTE 2 ·", "### B0 · ABERTURA DA PARTE 2 ·", 1)
ext = os.path.join(os.path.dirname(os.path.abspath(__file__)), "extrair-locucao.py")
for n, corpo in ((1, p1), (2, p2)):
    d = os.path.join(base, f"{tema}-parte{n}"); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "roteiro.md"), "w", encoding="utf-8").write(cab + corpo + fim)
    link = os.path.join(d, "apuracao")
    if not os.path.exists(link): os.symlink(os.path.join("..", tema, "apuracao"), link)
    print(f"== parte {n}"); subprocess.run([sys.executable, ext, d], check=True)
print(f"fecho da parte 1 = bloco {ult + 1:02d}; abertura da parte 2 = bloco 00")
