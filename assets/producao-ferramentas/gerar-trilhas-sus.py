# Trilhas originais extras: arquivo, esperanca, hospital, ciencia, denuncia. Uso: python gerar-trilhas-sus.py <saida>
import subprocess, sys, wave
import numpy as np
SR = 44100
saida = sys.argv[1]
rng = np.random.default_rng(3)
def nota(n): return 440.0 * 2 ** ((n - 69) / 12)
def t(d): return np.arange(int(SR * d)) / SR
def env(tt, a, r, dur): return np.minimum(1, tt / a) * np.clip((dur - tt) / r, 0, 1)
def pad(freqs, dur, brilho=4, detune=0.15):
    x = t(dur); s = np.zeros_like(x)
    for f in freqs:
        for k in range(1, brilho + 1):
            for d in (-detune, detune): s += np.sin(2 * np.pi * (f + d) * k * x + k) / (k * 1.6)
    return s * env(x, 1.5, 2.0, dur) / (len(freqs) * brilho)
def piano(f, dur=2.5):
    x = t(dur); return sum(np.sin(2 * np.pi * f * k * x) * 0.6 ** k for k in range(1, 5)) * np.exp(-2.2 * x) * np.minimum(1, x / 0.004)
def eco(s, atraso=0.35, fb=0.4, vezes=5):
    out = s.copy(); n = int(atraso * SR)
    for i in range(1, vezes + 1): out[n * i:] += s[: len(s) - n * i] * fb ** i
    return out
def add(s, pos, p):
    i = int(pos * SR); p = p[: max(0, len(s) - i)]; s[i:i + len(p)] += p
def salvar(nome, s):
    s = s / (np.max(np.abs(s)) + 1e-9) * 0.8
    st = np.stack([s, np.roll(s, 441)], axis=1); wav = f"{saida}/{nome}.wav"
    with wave.open(wav, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-af", "lowpass=f=7000", "-b:a", "192k", f"{saida}/{nome}.mp3"], check=True)
    subprocess.run(["rm", wav])
D = 96
# arquivo: piano esparso em lá menor + chiado de fita
s = np.zeros(int(SR * D))
seq = [57, 60, 64, 62, 60, 55, 57, 53, 52, 57, 60, 59]
for i in range(int(D / 1.6)):
    add(s, i * 1.6 + rng.uniform(0, 0.15), piano(nota(seq[i % len(seq)] + 12)) * 0.5)
    if i % 4 == 0: add(s, i * 1.6, piano(nota(seq[i % len(seq)] - 12), 5) * 0.35)
s += np.convolve(rng.uniform(-1, 1, len(s)), np.ones(20) / 20, "same") * 0.03
salvar("arquivo", eco(s, 0.42, 0.3))
# esperanca: pad que sobe em dó maior / lá menor
s = np.zeros(int(SR * D)); ac = [[48, 52, 55], [45, 48, 52], [41, 45, 48], [43, 47, 50]]
for i in range(int(D / 6)):
    a = ac[i % 4]; add(s, i * 6, pad([nota(n + (12 if i >= 8 else 0)) for n in a], 7.2, 5) * (0.5 + 0.5 * min(1, i / 8)))
    for k in range(6): add(s, i * 6 + k, piano(nota(a[k % 3] + 24), 1.5) * 0.12)
salvar("esperanca", eco(s, 0.5, 0.35))
# hospital: zumbido de lâmpada + bips distantes + ar
x = t(D); s = (np.sin(2 * np.pi * 120 * x) * 0.08 + np.sin(2 * np.pi * 240 * x) * 0.03)
s += np.convolve(rng.uniform(-1, 1, len(x)), np.ones(60) / 60, "same") * 0.25
for i in range(int(D / 2.3)):
    b = t(0.12); add(s, i * 2.3 + 0.7, np.sin(2 * np.pi * 880 * b) * 0.05 * np.minimum(1, b / 0.005))
s += pad([nota(45), nota(52)], D, 3) * 0.6
salvar("hospital", eco(s, 0.6, 0.3))
# ciencia: arpejo sintetizado pulsante e curioso
s = np.zeros(int(SR * D)); arp = [60, 64, 67, 71, 72, 71, 67, 64]
for i in range(int(D / 0.25)):
    n = arp[i % 8] + (2 if (i // 32) % 2 else 0); b = t(0.22)
    sq = np.sign(np.sin(2 * np.pi * nota(n) * b)) * 0.15 + np.sin(2 * np.pi * nota(n) * b) * 0.5
    add(s, i * 0.25, sq * np.exp(-9 * b) * 0.4)
for i in range(int(D / 8)): add(s, i * 8, pad([nota(48), nota(55), nota(59)], 9, 3) * 0.7)
salvar("ciencia", eco(s, 0.375, 0.35))
# denuncia: cordas graves dissonantes + percussão seca
s = np.zeros(int(SR * D))
for i in range(int(D / 8)): add(s, i * 8, pad([nota(38), nota(39), nota(45), nota(51)], 9, 6, 0.4) * 0.9)
for i in range(int(D / 1.0)):
    if i % 4 in (0, 3):
        b = t(0.3); add(s, i * 1.0, np.sin(2 * np.pi * (60 + 80 * np.exp(-40 * b)) * b) * np.exp(-12 * b) * 0.9)
salvar("denuncia", eco(s, 0.5, 0.25))
print("ok")
