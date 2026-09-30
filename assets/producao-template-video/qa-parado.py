# Detecta trechos PARADOS (tela sem mudança visível) nos quadros amostrados pelo qa-quadros.mjs.
# Uso: python3 qa-parado.py <pasta-dos-quadros> <passo-em-frames> <fps> [limite-segundos]
# Imprime "PARADO|<frame-inicial>|<frame-final>|<segundos>" para cada trecho acima do limite.
import glob, os, sys
from PIL import Image, ImageChops, ImageStat
pasta, passo, fps = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
limite = float(sys.argv[4]) if len(sys.argv) > 4 else 6.0
arqs = sorted(glob.glob(os.path.join(pasta, "*.jpeg")) + glob.glob(os.path.join(pasta, "*.jpg")))
if len(arqs) < 2: sys.exit(0)
def frame_de(a):
    # renderFrames numera pelo índice da amostra (element-000, 001…): frame real = índice × passo
    n = "".join(ch for ch in os.path.basename(a) if ch.isdigit())
    return (int(n) if n else 0) * passo
arqs.sort(key=frame_de)
ant = Image.open(arqs[0]).convert("L"); inicio = frame_de(arqs[0]); ultimo = inicio
for a in arqs[1:]:
    im = Image.open(a).convert("L")
    dif = ImageStat.Stat(ImageChops.difference(im, ant)).mean[0]
    f = frame_de(a)
    if dif > 2.0:  # mudou de verdade (grão da película fica abaixo disso)
        seg = (ultimo - inicio) / fps
        if seg >= limite: print(f"PARADO|{inicio}|{ultimo}|{seg:.1f}")
        inicio = f
        ant = im
    ultimo = f
seg = (ultimo - inicio) / fps
if seg >= limite: print(f"PARADO|{inicio}|{ultimo}|{seg:.1f}")
