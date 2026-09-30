# Efeitos do vídeo SUAS (originais, por síntese). Uso: python gerar-sfx-suas.py <saida>
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

def sino(f, d=1.4, dec=3.0):
    x = t(d); return (np.sin(2*np.pi*f*x) + 0.35*np.sin(2*np.pi*f*2.01*x)*np.exp(-2*x) + 0.15*np.sin(2*np.pi*f*3.02*x)*np.exp(-4*x)) * np.exp(-dec*x) * np.minimum(1, x/0.002)
# ding-senha: ding-dong de dois tons (painel de senhas)
salvar("ding-senha", junta((0, sino(659.3)), (O(0.42), sino(523.3, 1.6))))
# dispensador-senha: motor curto e papel saindo
x = t(0.5); motor = np.sin(2*np.pi*(180 + 40*np.sin(2*np.pi*30*x))*x) * 0.3 + pa(ruido(0.5), 4) * 0.25
salvar("dispensador-senha", env(motor * np.minimum(1, (0.5 - x)/0.05), 0.01, 0.6) + junta((O(0.42), env(pa(ruido(0.06), 3), 0.001, 0.02) * 0.8), (0, np.zeros(O(0.5)))))
# carimbo-atendido: pancada seca + papel
salvar("carimbo-atendido", junta((0, env(pb(ruido(0.25), 30), 0.001, 0.05)), (0, env(np.sin(2*np.pi*90*t(0.25)), 0.001, 0.06) * 0.8), (O(0.04), env(pa(ruido(0.1), 6), 0.002, 0.03) * 0.3)))
# tique-parede: relógio de parede (tique-taque, 4 s)
s = np.zeros(O(4.0))
for i in range(4):
    for off, f in ((i, 2600), (i + 0.5, 2100)):
        c = env(pa(ruido(0.03), 2) * 0.5 + np.sin(2*np.pi*f*t(0.03)) * 0.5, 0.0005, 0.006); s[O(off):O(off)+len(c)] += c
salvar("tique-parede", s, 0.6)
# sala-espera: murmúrio baixo + ar-condicionado + tosse distante (20 s)
d = 20; base = pb(ruido(d), 60) * 0.6 + pb(ruido(d), 400) * 0.8
mod = 0.6 + 0.4 * np.sin(2*np.pi*0.13*t(d)) * np.sin(2*np.pi*0.07*t(d))
salvar("sala-espera", base * mod, 0.5)
# passos-corredor: 8 passos com eco
s = np.zeros(O(5.0))
for i in range(8):
    p = env(pb(ruido(0.12), 20) + np.sin(2*np.pi*70*t(0.12)) * 0.6, 0.001, 0.03); o = O(0.3 + i * 0.55); s[o:o+len(p)] += p
    for k, g in ((0.09, 0.35), (0.19, 0.18)): s[o+O(k):o+O(k)+len(p)] += p * g
salvar("passos-corredor", s, 0.7)
# chuva-distante: 20 s
d = 20; ch = pb(ruido(d), 3) * 0.3 + pb(ruido(d), 25) * 0.5
for i in range(900):
    o = rng.integers(0, O(d) - O(0.01)); g = env(pa(ruido(0.01), 2), 0.0005, 0.003) * rng.uniform(0.1, 0.4); ch[o:o+len(g)] += g
salvar("chuva-distante", ch, 0.45)
# sino-conferencia: sineta de mesa, duas batidas
salvar("sino-conferencia", junta((0, sino(1318.5, 1.8, 2.2)), (O(0.35), sino(1318.5, 1.8, 2.2) * 0.8)))
print("ok")
