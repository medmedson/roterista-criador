# Corta REELS verticais (1080x1920) do vídeo final: prepara os clipes e os dados de legenda; o render é feito pelo Remotion (Reel1..N).
# Uso: python gerar-reels.py <pasta-do-projeto> <reels.json>
#   reels.json = [{"bloco":"05","de":0,"ate":8,"titulo":"A ELEIÇÃO ANULADA","sub":"e o nascimento da urna"}, ...]
#   "de"/"ate" = índices das falas (cues.json) do bloco: começa no início da fala "de" e termina no fim da fala "ate".
# Faz: tempo exato do início de cada bloco (soma das durações de render/blocos/blocoNN.mp4), pré-roll (const OFF no BlocoNN.tsx) e
#      chamada "antes" (comChamada(..., "antes") no Root.tsx = 250 quadros antes das falas do bloco), corta o trecho do vídeo final
#      (sem a legenda queimada: recorte de 880 px de altura) em video/public/reels/rN.mp4 e grava video/src/data/reels.json.
# Depois: npx remotion render Reel1 ... (cena src/cenas/Reel.tsx do template). Vale para qualquer tema.
import json, os, re, subprocess, sys
proj, cfg = sys.argv[1], sys.argv[2]
V = os.path.join(proj, "video")
cues = json.load(open(os.path.join(V, "src/data/cues.json")))
final = [f for f in os.listdir(os.path.join(proj, "render")) if f.endswith("-documentario-final.mp4")][0]
final = os.path.join(proj, "render", final)
blocos = sorted(f[5:7] for f in os.listdir(os.path.join(proj, "render/blocos")) if re.fullmatch(r"bloco\d\d\.mp4", f))
dur, start, acc = {}, {}, 0.0
for n in blocos:
    d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(proj, f"render/blocos/bloco{n}.mp4")], capture_output=True, text=True).stdout)
    start[n], dur[n] = acc, d; acc += d
def off(n):
    p = os.path.join(V, f"src/cenas/Bloco{n}.tsx")
    m = re.search(r"const OFF\s*=\s*(\d+)", open(p).read()) if os.path.exists(p) else None
    return int(m.group(1)) / 30 if m else 0.0
root = open(os.path.join(V, "src/Root.tsx")).read()
def chamada_antes(n):
    m = re.search(rf"Bloco{n}:\s*auditado\(comChamada\(Bloco{n},[^)]*\"antes\"([^)]*)\)\)", root)
    if not m: return 0.0
    return 250 / 30  # DURACAO_CHAMADA padrão dos vídeos antigos
os.makedirs(os.path.join(V, "public/reels"), exist_ok=True)
saida = []
for k, r in enumerate(json.load(open(cfg)), 1):
    n = r["bloco"]; cs = cues[n][r["de"]:r["ate"] + 1]
    base = start[n] + off(n) + chamada_antes(n)
    ini = max(0, base + cs[0]["de"] / 1000 - 0.2); fim = base + cs[-1]["ate"] / 1000 + 0.35
    caps = [{"de": round((c["de"] - cs[0]["de"]) / 1000 + 0.2, 3), "ate": round((c["ate"] - cs[0]["de"]) / 1000 + 0.2, 3), "texto": c["texto"]} for c in cs]
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{ini:.3f}", "-i", final, "-t", f"{fim - ini:.3f}", "-vf", "crop=1920:880:0:0,scale=1280:-2", "-c:v", "libx264", "-crf", "22", "-preset", "veryfast", "-c:a", "aac", "-b:a", "160k", os.path.join(V, f"public/reels/r{k}.mp4")], check=True)
    saida.append({"id": k, "titulo": r["titulo"], "sub": r["sub"], "duracao": round(fim - ini, 3), "caps": caps})
    print(k, r["titulo"], round(fim - ini, 1), "s", f"{int(ini // 60)}:{ini % 60:04.1f}")
json.dump(saida, open(os.path.join(V, "src/data/reels.json"), "w"), ensure_ascii=False, indent=1)
