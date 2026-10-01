# Efeitos do vídeo Terras Raras (originais, por síntese). Uso: python gerar-sfx-terras.py <saida>
import subprocess, sys, wave
import numpy as np
SR = 44100
saida = sys.argv[1]
rng = np.random.default_rng(11)
def t(d): return np.arange(int(SR * d)) / SR
def ruido(d): return rng.uniform(-1, 1, int(SR * d))
def pb(x, k=8): return np.convolve(x, np.ones(k) / k, mode="same")
def pa(x, k=8): return x - pb(x, k)
def env(x, a=0.005, r=0.1):
    tt = np.arange(len(x)) / SR
    return x * np.minimum(1, tt / max(a, 1e-4)) * np.exp(-tt / max(r, 1e-4))
def junta(*partes):
    n = max(o + len(p) for o, p in partes); s = np.zeros(n)
    for o, p in partes: s[o:o + len(p)] += p
    return s
def salvar(nome, s, g=0.8):
    s = s / (np.max(np.abs(s)) + 1e-9) * g
    st = np.stack([s, s], axis=1); w = f"{saida}/{nome}.wav"
    with wave.open(w, "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((st * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", w, "-b:a", "192k", f"{saida}/{nome}.mp3"], check=True); subprocess.run(["rm", w])
O = lambda s: int(s * SR)



# diapasao (assinatura): nota pura de 440 Hz com decaimento longo + clique de cristal
x = t(3.0); dia = (np.sin(2*np.pi*440*x) + 0.04*np.sin(2*np.pi*440*6.27*x)*np.exp(-6*x)) * np.exp(-1.5*x) * np.minimum(1, x/0.003)
cris = env(np.sin(2*np.pi*3000*t(0.2)) + 0.5*np.sin(2*np.pi*4500*t(0.2)), 0.001, 0.05) * 0.4
salvar("diapasao", junta((0, dia), (O(3.0), cris), (0, np.zeros(O(3.4)))), 0.6)
# cristal-clique: clique agudo e limpo
salvar("cristal-clique", env(np.sin(2*np.pi*3200*t(0.25)) + 0.5*np.sin(2*np.pi*4800*t(0.25)), 0.001, 0.05), 0.5)
# cascalho: pedrinhas caindo (1,2 s)
s = np.zeros(O(1.2))
for i in range(40):
    o = int(rng.uniform(0, 1.0) * SR); g = env(pa(ruido(0.03), 3) * rng.uniform(0.3, 1), 0.0005, 0.008); s[o:o+len(g)] += g
salvar("cascalho", s * np.linspace(1, 0.3, len(s)), 0.6)
# esteira: motor baixo e roletes (3 s)
d = 3.0; x = t(d); mot = np.sin(2*np.pi*(90 + 6*np.sin(2*np.pi*4*x))*x) * 0.25 + pb(ruido(d), 10) * 0.2 * (np.sin(2*np.pi*14*x) > 0)
salvar("esteira", mot * np.minimum(1, x/0.2) * np.clip((d - x)/0.2, 0, 1), 0.5)
# sirene-mina-distante: sirene longa e distante, baixa (raro)
d = 3.5; x = t(d); f = 420 + 120 * np.sin(np.pi * x / d); sir = np.sin(2*np.pi*np.cumsum(f)/SR) * 0.3
salvar("sirene-mina-distante", sir * np.minimum(1, x/0.6) * np.clip((d - x)/0.8, 0, 1), 0.3)
# gota-acida: gota de líquido (só em cena de processo)
x = t(0.4); salvar("gota-acida", np.sin(2*np.pi*(700 + 900*np.exp(-30*x))*x) * np.exp(-14*x) * np.minimum(1, x/0.002), 0.5)
print("ok")
