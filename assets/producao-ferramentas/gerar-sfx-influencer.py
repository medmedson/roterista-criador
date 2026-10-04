# Efeitos do vídeo curto "Siga o dinheiro" (estilo criador de conteúdo, tema CADERNO VIVO), originais, por síntese:
# pop, whoosh, whoosh-longo, clique, risco-caneta, plim, fita, moedas, papel, ding (assinatura), ziper.
# Curtos e limpos, picos a ~-2,5 dBFS (o volume final de -14 a -18 dB fica no Remotion).
# Uso: python gerar-sfx-influencer.py <saida>
import subprocess, sys, wave
import numpy as np
SR = 44100
saida = sys.argv[1]
rng = np.random.default_rng(57)
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
def fade_fim(s, d=0.02):
    k = min(len(s), int(d * SR)); s = s.copy(); s[-k:] *= np.linspace(1, 0, k); return s
def fade_ini(s, d=0.002):
    k = int(d * SR); s = s.copy(); s[:k] *= np.linspace(0, 1, k); return s
def passa_banda(x, fc, q=1.5):   # filtro de estado variável com frequência variando no tempo (fc: escalar ou array)
    fc = np.broadcast_to(np.asarray(fc, float), x.shape); y = np.zeros_like(x); lo = bp = 0.0; damp = 1 / q
    for i in range(len(x)):
        f = 2 * np.sin(np.pi * min(fc[i], SR / 6) / SR)
        hi = x[i] - lo - damp * bp; bp += f * hi; lo += f * bp; y[i] = bp
    return y
def salvar(nome, s, g=0.75):
    s = fade_fim(fade_ini(s)); s = s - np.mean(s); s = s / (np.max(np.abs(s)) + 1e-9) * g
    st = np.stack([s, s], axis=1); w = f"{saida}/{nome}.wav"
    with wave.open(w, "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((st * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", w, "-b:a", "192k", f"{saida}/{nome}.mp3"], check=True); subprocess.run(["rm", w])
    print(nome)
O = lambda s: int(s * SR)
def metal(fs, d, dec, amp):
    x = t(d); return sum(a * np.sin(2 * np.pi * f * x) * np.exp(-dec * x * (1 + 0.15 * i)) for i, (f, a) in enumerate(zip(fs, amp))) * np.minimum(1, x / 0.0008)
def estalo(d=0.01, k=2, dec=0.0015):
    return env(pa(ruido(d), k), 0.0001, dec)

# pop (bolha, 0,1 s): seno que sobe rápido de tom + estalo minúsculo
x = t(0.1); f = 380 + 900 * (1 - np.exp(-45 * x))
s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-38 * x) * np.minimum(1, x / 0.0015)
s[:len(estalo())] += estalo() * 0.25
salvar("pop", s, 0.72)

# whoosh (0,25 s) e whoosh-longo (0,6 s): ruído em banda que sobe e desce, corpo grave leve
def whoosh(d, f0, f1, q=1.2):
    x = t(d); u = x / d; forma = np.sin(np.pi * u) ** 1.6
    fc = f0 + (f1 - f0) * np.sin(np.pi * u) ** 0.8
    s = passa_banda(ruido(d), fc, q) * forma + passa_banda(ruido(d), fc * 0.35, 0.8) * forma * 0.5
    return s
salvar("whoosh", whoosh(0.25, 500, 3200), 0.72)
salvar("whoosh-longo", whoosh(0.6, 300, 2600, 1.0), 0.72)

# clique (mouse): estalo de apertar + estalo de soltar, plásticos e curtos (0,12 s)
def micro(f, brilho):
    x = t(0.02); return estalo(0.02, 2, 0.0012) * brilho + np.sin(2 * np.pi * f * x) * np.exp(-400 * x) * 0.6
s = junta((0, micro(3200, 1.0)), (O(0.075), micro(2700, 0.6) * 0.6), (0, np.zeros(O(0.12))))
salvar("clique", s, 0.7)

# risco-caneta (0,4 s): caneta no papel, três traços com atrito granulado
d = 0.4; x = t(d); s = np.zeros_like(x)
for ini, dur, ganho in [(0.0, 0.13, 1.0), (0.14, 0.11, 0.85), (0.27, 0.12, 0.9)]:
    i0, n = O(ini), O(dur); u = np.arange(n) / n
    grao = 1 + 0.6 * np.sign(np.sin(2 * np.pi * rng.uniform(70, 110) * np.arange(n) / SR)) * rng.uniform(0.3, 1, n)
    tr = passa_banda(ruido(dur), np.linspace(2600, 3800, n) * rng.uniform(0.9, 1.1), 1.4) * grao * np.sin(np.pi * u) ** 0.7
    s[i0:i0 + n] += tr * ganho
salvar("risco-caneta", s, 0.68)

# plim (sino agudo, 0,9 s): parciais de sino com batimento suave
x = t(0.9)
s = metal([2349, 2349 * 2.0, 2349 * 2.76, 2349 * 5.4], 0.9, 4.5, [1.0, 0.35, 0.3, 0.1]) + 0.25 * np.sin(2 * np.pi * 2352 * x) * np.exp(-5 * x)
salvar("plim", s, 0.68)

# fita (fita adesiva puxada, 0,55 s): crepitar que acelera + rasgo final curto
d = 0.55; s = np.zeros(O(d)); pos = 0.0; i = 0
while pos < 0.42:
    c = estalo(0.006, 2, 0.0008) * rng.uniform(0.4, 1.0); o = O(pos); s[o:o + len(c)] += c
    pos += max(0.004, 0.022 * np.exp(-6 * pos)) * rng.uniform(0.6, 1.4); i += 1
x = t(d); s += passa_banda(ruido(d), 2200, 0.9) * np.clip(x / 0.42, 0, 1) ** 2 * (x < 0.42) * 0.35
rasgo = passa_banda(ruido(0.1), np.linspace(4000, 1500, O(0.1)), 0.8) * np.exp(-30 * t(0.1)) * 1.2
s[O(0.42):O(0.42) + len(rasgo)] += rasgo
salvar("fita", s, 0.7)

# moedas (tilintar curto, 0,6 s): quatro toques metálicos de moedas pequenas
s = np.zeros(O(0.6))
for pos, base, g in [(0.0, 3520, 1.0), (0.07, 4186, 0.7), (0.15, 3729, 0.8), (0.24, 4699, 0.5)]:
    fs = [base, base * 1.47, base * 2.09, base * 2.83]
    c = metal(fs, 0.34, 14, [0.6, 0.4, 0.25, 0.12]) * g; e = estalo(0.004, 2, 0.0005); c[:len(e)] += e * 0.3 * g
    o = O(pos); c = c[: len(s) - o]; s[o:o + len(c)] += c
salvar("moedas", s, 0.7)

# papel (folha virando, 0,5 s): sopro de papel com tremulação irregular e "flap" no fim
d = 0.5; x = t(d); u = x / d
trem = 1 + 0.55 * np.sin(2 * np.pi * np.cumsum(18 + 14 * u) / SR) * rng.uniform(0.6, 1, len(x))
s = passa_banda(ruido(d), 1200 + 2400 * np.sin(np.pi * u), 0.9) * np.sin(np.pi * u) ** 1.2 * trem
flap = pb(ruido(0.06), 10) * np.exp(-60 * t(0.06)) * 1.4
s[O(0.4):O(0.4) + len(flap)] += flap
salvar("papel", s, 0.7)

# ding (assinatura, 0,4 s): caixa registradora pequena — tique mecânico e sino limpo e brilhante
x = t(0.37)
sino = metal([2637, 2637 * 2.01, 2637 * 2.74, 2637 * 4.1], 0.37, 6.5, [1.0, 0.3, 0.22, 0.08])
sino = sino * np.clip((0.37 - x) / 0.12, 0, 1)   # some até 0,4 s
tique = estalo(0.012, 2, 0.0015) * 0.5 + np.sin(2 * np.pi * 900 * t(0.012)) * np.exp(-500 * t(0.012)) * 0.3
s = junta((0, tique), (O(0.03), sino), (0, np.zeros(O(0.4))))
salvar("ding", s[:O(0.4)], 0.72)

# ziper (pasta com zíper abrindo, 0,35 s): dentes em sequência que acelera, timbre plástico
d = 0.35; s = np.zeros(O(d)); pos = 0.0
while pos < 0.32:
    x = t(0.008); c = estalo(0.008, 3, 0.0012) * 0.8 + np.sin(2 * np.pi * 1700 * x) * np.exp(-600 * x) * 0.3
    o = O(pos); s[o:o + len(c)] += c * (0.6 + 0.4 * pos / 0.32)
    pos += 0.012 - 0.006 * pos / 0.32
s += passa_banda(ruido(d), 1800, 1.0) * np.sin(np.pi * t(d) / d) * 0.25
salvar("ziper", s, 0.68)
