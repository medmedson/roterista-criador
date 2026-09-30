# Trilhas do vídeo Bolsa Família: provocacao, linha-do-tempo, mundo, confronto. Uso: python gerar-trilhas-bf.py <saida>
import subprocess, sys, wave
import numpy as np
SR = 44100
saida = sys.argv[1]
rng = np.random.default_rng(5)
def nota(n): return 440.0 * 2 ** ((n - 69) / 12)
def t(d): return np.arange(int(SR * d)) / SR
def env(tt, a, r, dur): return np.minimum(1, tt / a) * np.clip((dur - tt) / r, 0, 1)
def pad(freqs, dur, brilho=4):
    x = t(dur); s = np.zeros_like(x)
    for f in freqs:
        for k in range(1, brilho + 1):
            for d in (-0.2, 0.2): s += np.sin(2 * np.pi * (f + d) * k * x + k) / (k * 1.6)
    return s * env(x, 1.0, 1.5, dur) / (len(freqs) * brilho)
def corda(f, dur=0.18):
    x = t(dur); return sum(np.sin(2 * np.pi * f * k * x) / k for k in range(1, 6)) * np.exp(-14 * x) * np.minimum(1, x / 0.004)
def bumbo(): x = t(0.35); return np.sin(2 * np.pi * (55 + 90 * np.exp(-35 * x)) * x) * np.exp(-10 * x)
def caixa(): x = t(0.2); return rng.uniform(-1, 1, len(x)) * np.exp(-22 * x) * 0.5
def tom(f, d=0.25): x = t(d); return np.sin(2 * np.pi * f * x) * np.exp(-10 * x)
def add(s, pos, p):
    i = int(pos * SR); p = p[: max(0, len(s) - i)]; s[i:i + len(p)] += p
def eco(s, a=0.3, fb=0.3, n=4):
    o = s.copy(); k = int(a * SR)
    for i in range(1, n + 1): o[k * i:] += s[: len(s) - k * i] * fb ** i
    return o
def salvar(nome, s):
    s = s / (np.max(np.abs(s)) + 1e-9) * 0.8
    st = np.stack([s, np.roll(s, 441)], axis=1); w = f"{saida}/{nome}.wav"
    with wave.open(w, "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((st * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", w, "-af", "lowpass=f=7000", "-b:a", "192k", f"{saida}/{nome}.mp3"], check=True); subprocess.run(["rm", w])
D = 96
# provocacao: pulso grave + cordas em staccato, pergunta (menor com 2ª menor)
s = np.zeros(int(SR * D)); beat = 60 / 96
for i in range(int(D / beat)):
    add(s, i * beat, bumbo() * (0.9 if i % 2 == 0 else 0.4))
    if i % 2 == 1: add(s, i * beat, corda(nota([57, 58, 57, 60][(i // 2) % 4])) * 0.5)
for i in range(int(D / 8)): add(s, i * 8, pad([nota(45), nota(52)], 9, 3) * 0.6)
salvar("provocacao", eco(s, 0.31, 0.25))
# linha-do-tempo: marcha leve, avança como relógio
s = np.zeros(int(SR * D)); beat = 60 / 108
for i in range(int(D / beat)):
    add(s, i * beat, tom(nota(72 if i % 4 == 0 else 67), 0.08) * 0.35)
    if i % 4 in (0, 2): add(s, i * beat, bumbo() * 0.5)
    if i % 4 == 2: add(s, i * beat, caixa() * 0.5)
for i in range(int(D / 6)): add(s, i * 6, pad([nota(n) for n in [[48, 55, 60], [45, 52, 57], [41, 48, 53], [43, 50, 55]][i % 4]], 7, 4) * 0.8)
salvar("linha-do-tempo", eco(s, 0.28, 0.2))
# mundo: percussão com textura internacional (escala pentatônica)
s = np.zeros(int(SR * D)); beat = 60 / 100; pent = [60, 62, 64, 67, 69]
for i in range(int(D / (beat / 2))):
    if i % 3 != 1: add(s, i * beat / 2, tom(nota(pent[(i * 3) % 5] + 12), 0.3) * 0.3)
    if i % 4 == 0: add(s, i * beat / 2, bumbo() * 0.6)
    if i % 8 == 6: add(s, i * beat / 2, caixa() * 0.4)
for i in range(int(D / 8)): add(s, i * 8, pad([nota(48), nota(55), nota(64)], 9, 3) * 0.6)
salvar("mundo", eco(s, 0.3, 0.3))
# confronto: tensão rítmica tipo debate, cortes secos
s = np.zeros(int(SR * D)); beat = 60 / 120
for i in range(int(D / beat)):
    if (i // 16) % 2 == 1 and i % 16 >= 14: continue  # corte seco
    add(s, i * beat, bumbo() * (0.8 if i % 2 == 0 else 0.3))
    add(s, i * beat + beat / 2, corda(nota([50, 51, 50, 53][i % 4]), 0.12) * 0.45)
for i in range(int(D / 8)): add(s, i * 8, pad([nota(38), nota(45), nota(51)], 9, 5) * 0.7)
salvar("confronto", eco(s, 0.25, 0.2))
print("ok")
