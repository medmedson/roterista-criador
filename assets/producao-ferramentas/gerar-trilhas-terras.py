# Trilhas do vídeo Terras Raras (tema jazida): jazida, estrato, cadeia-terra, forja, mercado-frio, desfecho-jazida. Uso: python gerar-trilhas-terras.py <saida>
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

def marimba(f, d=0.6, vel=1.0):
    x = t(d); return (np.sin(2*np.pi*f*x) + 0.25*np.sin(2*np.pi*f*3.9*x)*np.exp(-18*x)) * np.exp(-7*x) * np.minimum(1, x/0.002) * vel
def sininho(f, d=2.0, vel=1.0):
    x = t(d); return (np.sin(2*np.pi*f*x) + 0.3*np.sin(2*np.pi*f*2.76*x)*np.exp(-3*x)) * np.exp(-2.2*x) * np.minimum(1, x/0.002) * vel
def madeira(f, dur=1.5, vel=1.0):
    x = t(dur); vib = 1 + 0.003*np.sin(2*np.pi*5*x)
    s = sum(np.sin(2*np.pi*f*k*np.cumsum(vib)/SR) * (0.6 if k % 2 else 0.2) / k for k in range(1, 7))
    return s * env(x, 0.08, 0.4, dur) * vel

def diapasao(f=nota(69), d=3.0, vel=1.0):
    x = t(d); return (np.sin(2*np.pi*f*x) + 0.05*np.sin(2*np.pi*f*6.27*x)*np.exp(-6*x)) * np.exp(-1.4*x) * np.minimum(1, x/0.003) * vel
D = 100
# jazida: sintetizador quente, pulso leve, diapasão (curiosidade) — lá menor
s = np.zeros(int(SR * D)); beat = 60 / 84
for i in range(int(D / beat)):
    if i % 2 == 0: add(s, i * beat, tom(nota(45), 0.35) * 0.3)
    if i % 4 == 2: add(s, i * beat, tique() * 0.3)
for i in range(int(D / 8)):
    add(s, i * 8, pad([nota([57, 53, 55, 52][i % 4]), nota([64, 60, 62, 59][i % 4]), nota([69, 65, 67, 64][i % 4])], 9, 3) * 0.4)
for i in range(3, int(D), 14): add(s, i, diapasao(nota(81), 4, 0.12))
salvar("jazida", reverb(s, 4))
# estrato: piano e cordas leves, espaçado (descoberta, nostalgia, números, técnico)
s = np.zeros(int(SR * D)); mel = [69, 72, 76, 74, 72, 69, 67, 64]
for i in range(int(D / 4)): add(s, i * 4 + 0.2, piano(nota(mel[i % 8]), 3.5, 0.28))
for i in range(int(D / 8)):
    for n in [[45, 52], [41, 48], [43, 50], [40, 47]][i % 4]: add(s, i * 8, cello(nota(n), 9, 0.2))
salvar("estrato", reverb(s))
# cadeia-terra: marimba, pizzicato, baixo (engenhosidade, didática)
s = np.zeros(int(SR * D)); beat = 60 / 100; esc = [57, 60, 62, 64, 67]
for i in range(int(D / (beat / 2))):
    add(s, i * beat / 2, marimba(nota(esc[(i * 3) % 5] + 12), 0.5, 0.33))
    if i % 2 == 0: add(s, i * beat / 2, corda(nota([45, 43, 48, 45][(i // 8) % 4]), 0.14) * 0.3)
for i in range(int(D / 8)): add(s, i * 8, pad([nota(45), nota(52), nota(57)], 9, 2) * 0.28)
salvar("cadeia-terra", eco(s, 0.28, 0.2))
# forja: percussão seca e cordas graves (competição, perda)
s = np.zeros(int(SR * D)); beat = 60 / 76
for i in range(int(D / beat)):
    add(s, i * beat, bumbo() * (0.55 if i % 4 == 0 else 0.25))
    if i % 4 == 2: add(s, i * beat, caixa() * 0.4)
    add(s, i * beat + beat / 2, corda(nota([38, 38, 41, 36][(i // 4) % 4]), 0.22) * 0.3)
for i in range(int(D / 8)): add(s, i * 8, pad([nota(38), nota(45), nota(50)], 9, 4) * 0.5)
salvar("forja", eco(s, 0.3, 0.2))
# mercado-frio: sintetizador grave e tique (tensão fria)
s = np.zeros(int(SR * D)); beat = 60 / 96
for i in range(int(D / beat)):
    add(s, i * beat, tique() * 0.55)
    if i % 4 == 0: add(s, i * beat, tom(nota(33), 0.4) * 0.35)
for i in range(int(D / 8)):
    x = t(9); f = nota([36, 36, 34, 38][i % 4]); add(s, i * 8, sum(np.sin(2*np.pi*f*k*x)/k for k in range(1, 9)) * env(x, 1.0, 1.5, 9) * 0.28)
    for n in [[57, 60], [55, 58]][i % 2]: add(s, i * 8, cello(nota(n), 9, 0.18))
salvar("mercado-frio", eco(s, 0.33, 0.2))
# desfecho-jazida: piano, cordas e diapasão final (resolução) — dó maior
s = np.zeros(int(SR * D)); prog = [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]]
mel = [72, 74, 76, 79, 76, 74, 72, 71]
for i in range(int(D / 8)):
    for j, n in enumerate(prog[i % 4]): add(s, i * 8 + j * 0.4, piano(nota(n), 6, 0.28))
    for n in prog[i % 4][:2]: add(s, i * 8, cello(nota(n), 9, 0.2))
    for j in range(2): add(s, i * 8 + 3 + j * 2.5, piano(nota(mel[(i * 2 + j) % 8]), 3, 0.26))
    if i % 4 == 3: add(s, i * 8 + 6, diapasao(nota(84), 4, 0.14))
salvar("desfecho-jazida", reverb(s))
print("ok")
