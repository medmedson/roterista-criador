# Monta folha de contato numerada: python3 folha-contato.py saida.jpg q00.jpg q01.jpg ...
import sys
from PIL import Image, ImageDraw, ImageFont

saida, arquivos = sys.argv[1], sys.argv[2:]
imgs = [Image.open(a) for a in arquivos]
w, h = imgs[0].size
cols = 3
linhas = (len(imgs) + cols - 1) // cols
folha = Image.new("RGB", (w * cols, h * linhas), "black")
try:
    fonte = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 34)
except OSError:
    fonte = ImageFont.load_default()
for i, im in enumerate(imgs):
    x, y = (i % cols) * w, (i // cols) * h
    folha.paste(im, (x, y))
    d = ImageDraw.Draw(folha)
    d.rectangle([x, y, x + 70, y + 48], fill="black")
    d.text((x + 14, y + 6), str(i), fill="yellow", font=fonte)
folha.save(saida, quality=85)
