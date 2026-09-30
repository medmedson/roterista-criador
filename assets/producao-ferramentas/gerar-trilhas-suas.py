# Trilhas do vídeo SUAS: senha, caridade, constituinte, veto, rede, balanco, comocao, votacao. Uso: python gerar-trilhas-suas.py <saida>
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

def piano(f, dur=3.0, vel=1.0):
    x = t(dur); s = sum(np.sin(2 * np.pi * f * k * x * (1 + 0.0004 * k * k)) * np.exp(-(1.2 + 0.9 * k) * x) / k ** 1.3 for k in range(1, 8))
    return s * np.minimum(1, x / 0.003) * vel
def cello(f, dur=4.0, vel=1.0):
    x = t(dur); vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * x) * np.minimum(1, x / 0.8)
    s = sum(np.sin(2 * np.pi * f * k * np.cumsum(vib) / SR) / k ** 1.1 for k in range(1, 9))
    return s * env(x, 0.6, 1.2, dur) * vel
def reverb(s, n=6): 
    o = s.copy()
    for d, g in [(0.029, .5), (0.047, .45), (0.071, .4), (0.113, .33), (0.173, .27), (0.251, .2)][:n]:
        k = int(d * SR); o[k:] += s[:-k] * g
    return eco(o, 0.37, 0.25, 3)
def tique():
    x = t(0.03); return rng.uniform(-1, 1, len(x)) * np.exp(-200 * x) * 0.6
def ding(f1=nota(76), f2=nota(72)):
    x = t(1.4); a = np.sin(2*np.pi*f1*x)*np.exp(-3*x) + 0.3*np.sin(2*np.pi*f1*2.01*x)*np.exp(-5*x)
    b = np.zeros_like(x); k = int(0.45*SR); y = np.arange(len(x) - k) / SR
    b[k:] = np.sin(2*np.pi*f2*y)*np.exp(-3*y) + 0.3*np.sin(2*np.pi*f2*2.01*y)*np.exp(-5*y)
    return (a + b) * 0.5
D = 100
# senha: drone grave, tique de relógio de parede, ding distante
s = np.zeros(int(SR * D))
for i in range(int(D / 10)): add(s, i * 10, pad([nota(38), nota(45), nota(50)], 12, 3) * 0.9)
for i in range(int(D)): add(s, i, tique() * 0.5)
for i in range(3, int(D), 23): add(s, i, ding() * 0.18)
salvar("senha", reverb(s))
# caridade: piano solo em sala grande, melancólico (lá menor), sem percussão
s = np.zeros(int(SR * D)); prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [52, 55, 59]]
mel = [76, 74, 72, 71, 72, 69, 71, 72, 74, 72, 71, 69]
for i in range(int(D / 8)):
    ac = prog[i % 4]
    for j, n in enumerate(ac): add(s, i * 8 + j * 0.5, piano(nota(n - 12), 6, 0.5))
    for j in range(3): add(s, i * 8 + 2 + j * 2, piano(nota(mel[(i * 3 + j) % len(mel)]), 3, 0.35))
salvar("caridade", reverb(s))
# constituinte: cordas subindo em camadas, tímpano suave
s = np.zeros(int(SR * D)); prog = [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]]
for i in range(int(D / 6)):
    camada = min(4, 1 + i // 3)
    for n in prog[i % 4][:camada]: add(s, i * 6, cello(nota(n), 7, 0.4))
    if i % 2 == 1: add(s, i * 6, bumbo() * 0.35)
salvar("constituinte", reverb(s))
# veto: percussão seca e cordas graves em staccato
s = np.zeros(int(SR * D)); beat = 60 / 84
for i in range(int(D / beat)):
    add(s, i * beat, bumbo() * (1.0 if i % 4 == 0 else 0.45))
    if i % 4 == 3: add(s, i * beat, caixa() * 0.7)
    add(s, i * beat + beat / 2, corda(nota([38, 39, 38, 41][i % 4]), 0.2) * 0.6)
for i in range(int(D / 8)): add(s, i * 8, pad([nota(34), nota(41), nota(46)], 9, 5) * 0.8)
salvar("veto", eco(s, 0.23, 0.2))
# rede: pulsos leves em marcha, pizzicato e marimba
s = np.zeros(int(SR * D)); beat = 60 / 104; esc = [60, 62, 64, 67, 69, 72]
for i in range(int(D / (beat / 2))):
    add(s, i * beat / 2, tom(nota(esc[(i * 5) % 6] + 12), 0.35) * 0.3)
    if i % 2 == 0: add(s, i * beat / 2, corda(nota([48, 55, 53, 55][(i // 8) % 4]), 0.15) * 0.4)
    if i % 8 == 0: add(s, i * beat / 2, bumbo() * 0.4)
for i in range(int(D / 8)): add(s, i * 8, pad([nota(48), nota(55), nota(64)], 9, 3) * 0.45)
salvar("rede", eco(s, 0.29, 0.25))
# balanco: sintetizador grave, tique e pulso seco (indignação fria)
s = np.zeros(int(SR * D)); beat = 60 / 90
for i in range(int(D / beat)):
    add(s, i * beat, tique() * 0.8)
    if i % 2 == 0: add(s, i * beat, bumbo() * 0.55)
for i in range(int(D / 8)):
    x = t(9); f = nota([33, 33, 32, 35][i % 4]); saw = sum(np.sin(2 * np.pi * f * k * x) / k for k in range(1, 12))
    add(s, i * 8, saw * env(x, 0.8, 1.5, 9) * 0.35); add(s, i * 8, pad([nota(57), nota(60)], 9, 2) * 0.25)
salvar("balanco", eco(s, 0.33, 0.2))
# comocao: piano e violoncelo, lento, sem percussão
s = np.zeros(int(SR * D)); prog = [[50, 57, 62], [46, 53, 58], [43, 50, 55], [45, 52, 57]]
mel = [74, 72, 70, 69, 70, 67, 69, 65]
for i in range(int(D / 10)):
    ac = prog[i % 4]
    for j, n in enumerate(ac): add(s, i * 10 + j * 0.7, piano(nota(n), 7, 0.4))
    add(s, i * 10 + 0.3, cello(nota(ac[0] - 12), 10, 0.45))
    for j in range(2): add(s, i * 10 + 3 + j * 3.2, piano(nota(mel[(i * 2 + j) % len(mel)]), 4, 0.3))
salvar("comocao", reverb(s))
# votacao: pulso e cordas staccato, suspense político crescente
s = np.zeros(int(SR * D)); beat = 60 / 112
for i in range(int(D / beat)):
    g = min(1.0, 0.35 + i / (D / beat))
    add(s, i * beat, bumbo() * (0.7 if i % 2 == 0 else 0.3) * g)
    add(s, i * beat + beat / 2, corda(nota([45, 46, 45, 48, 45, 46, 50, 48][i % 8]), 0.1) * 0.5 * g)
for i in range(int(D / 8)): add(s, i * 8, pad([nota(33), nota(40), nota(45)], 9, 4) * 0.7)
salvar("votacao", eco(s, 0.27, 0.2))
print("ok")
