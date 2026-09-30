# Reaplica pausas dramáticas ("...") nas frases listadas em locucao/pausas.txt (uma frase por linha,
# já na forma NORMALIZADA, ex.: "Ainda não é lei."). Rode depois do normalizar.py, que sobrescreve os NN.txt.
# Uso: python pausas.py <pasta-do-projeto>
import glob, os, sys
p = sys.argv[1]
arq = os.path.join(p, "locucao", "pausas.txt")
if not os.path.exists(arq): sys.exit(0)
frases = [l.strip() for l in open(arq, encoding="utf-8") if l.strip()]
achou = set()
for f in sorted(glob.glob(os.path.join(p, "locucao", "[0-9][0-9].txt"))):
    s = open(f, encoding="utf-8").read(); o = s
    for x in frases:
        if x in s: achou.add(x)
        if x in s and x + " ..." not in s: s = s.replace(x, x + " ...")
    if s != o: open(f, "w", encoding="utf-8").write(s); print("pausa em", os.path.basename(f))
for x in set(frases) - achou: print("NÃO ACHOU (confira a grafia normalizada):", x)
