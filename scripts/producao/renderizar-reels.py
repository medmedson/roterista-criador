# Registra Reel1..N no Root.tsx do projeto (se ainda não estiverem) e renderiza os reels para uma pasta.
# Uso: python renderizar-reels.py <pasta-do-projeto> <pasta-de-saida> [primeiro] [ultimo]
#   Pré-requisito: gerar-reels.py já rodou (src/data/reels.json + public/reels/rN.mp4) e src/cenas/Reel.tsx existe (copie do template).
#   Saída: <saida>/NN-titulo-em-minusculas.mp4 (pula os que já existem). Renderiza um por vez (--crf=23) e limpa temporários em caso de falha.
import json, os, re, shutil, subprocess, sys, unicodedata
proj, saida = sys.argv[1], os.path.expanduser(sys.argv[2])
V = os.path.join(proj, "video")
reels = json.load(open(os.path.join(V, "src/data/reels.json")))
n = len(reels)
a = int(sys.argv[3]) if len(sys.argv) > 3 else 1
z = int(sys.argv[4]) if len(sys.argv) > 4 else n
root_p = os.path.join(V, "src/Root.tsx")
s = open(root_p).read()
if "cenas/Reel" not in s:
    imps = list(re.finditer(r"^import .*;$", s, re.M))
    ult = imps[-1].end()
    s = s[:ult] + '\nimport { duracaoReel, Reel } from "./cenas/Reel";' + s[ult:]
    bloco = f'      {{[{", ".join(str(i) for i in range(n))}].map((i) => (\n        <Composition key={{`Reel${{i + 1}}`}} id={{`Reel${{i + 1}}`}} component={{() => <Reel i={{i}} />}} durationInFrames={{duracaoReel(i)}} fps={{30}} width={{1080}} height={{1920}} />\n      ))}}\n'
    m = re.search(r"return \(\s*\n\s*<>\n", s)
    s = s[:m.end()] + bloco + s[m.end():]
    open(root_p, "w").write(s)
    print("Root.tsx atualizado")
os.makedirs(saida, exist_ok=True)
def slug(t):
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:60]
tmp = os.path.expanduser("~/../../var/folders")  # só para legibilidade; limpeza é feita pelo Remotion e pelo script que chama
for r in reels[a - 1:z]:
    out = os.path.join(saida, f"{r['id']:02d}-{slug(r['titulo'])}.mp4")
    if os.path.exists(out): print("já existe", out); continue
    for t in (1, 2, 3):
        ok = subprocess.run(["npx", "remotion", "render", f"Reel{r['id']}", out + ".tmp.mp4", "--concurrency=4", "--crf=23", "--jpeg-quality=80", "--timeout=120000", "--log=error"], cwd=V).returncode == 0
        if ok: os.replace(out + ".tmp.mp4", out); print("pronto", out); break
        print("falhou, tentativa", t)
