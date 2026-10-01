# Trilhas do vídeo SAMU (tema noturno da central): plantao, vazio, regulacao, norma, relogio-cru, comocao-central, balanco-cru, desfecho-central.
# Comoção (comocao-central) só piano e violoncelo. Uso: python gerar-trilhas-samu.py <saida>
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

D = 100
# plantao: sintetizador limpo, pulso suave, tique de relógio (curiosidade, escala) — mi menor
s = np.zeros(int(SR * D)); beat = 60 / 90
for i in range(int(D / beat)):
    add(s, i * beat, tique() * 0.35)
    if i % 2 == 0: add(s, i * beat, tom(nota(40), 0.3) * 0.3)
for i in range(int(D / 8)):
    x = t(9); f = nota([52, 52, 48, 50][i % 4]); add(s, i * 8, sum(np.sin(2*np.pi*f*k*x)/k**1.5 for k in range(1,6)) * env(x, 1.2, 1.5, 9) * 0.25)
    add(s, i * 8, pad([nota(64), nota(67), nota(71)], 9, 2) * 0.3)
salvar("plantao", reverb(s, 4))
# vazio: piano espaçado + chiado de rádio ao fundo (estranhamento, cautela)
s = np.zeros(int(SR * D)); mel = [64, 67, 71, 69, 64, 62, 64, 59]
for i in range(int(D / 4)): add(s, i * 4 + 0.3, piano(nota(mel[i % 8]), 3.5, 0.3))
for i in range(int(D / 16)): add(s, i * 16, piano(nota(40), 8, 0.25))
s += np.convolve(rng.uniform(-1, 1, len(s)), np.ones(30) / 30, mode="same") * 0.015
salvar("vazio", reverb(s))
# regulacao: marimba, baixo suave, pizzicato (engenhosidade, movimento)
s = np.zeros(int(SR * D)); beat = 60 / 104; esc = [62, 64, 66, 69, 71]
for i in range(int(D / (beat / 2))):
    add(s, i * beat / 2, marimba(nota(esc[(i * 2) % 5] + 12), 0.5, 0.32))
    if i % 2 == 0: add(s, i * beat / 2, corda(nota([50, 47, 43, 45][(i // 8) % 4]), 0.14) * 0.32)
for i in range(int(D / 8)): add(s, i * 8, pad([nota(50), nota(57), nota(62)], 9, 2) * 0.3)
salvar("regulacao", eco(s, 0.28, 0.2))
# norma: cordas subindo e madeiras (nascimento, esperança cautelosa) — ré maior
s = np.zeros(int(SR * D)); prog = [[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]]
for i in range(int(D / 6)):
    camada = min(4, 1 + i // 3)
    for n in prog[i % 4][:camada]: add(s, i * 6, cello(nota(n), 7, 0.3))
    add(s, i * 6 + 2.5, madeira(nota(prog[i % 4][-1] + 12), 2.5, 0.2))
salvar("norma", reverb(s))
# relogio-cru: tique, baixo grave, cordas curtas (tensão do tempo)
s = np.zeros(int(SR * D)); beat = 60 / 112
for i in range(int(D / beat)):
    add(s, i * beat, tique() * 0.7)
    if i % 2 == 0: add(s, i * beat, bumbo() * 0.4)
    if i % 4 == 2: add(s, i * beat, corda(nota([40, 41, 40, 43][(i // 8) % 4]), 0.18) * 0.45)
for i in range(int(D / 8)): add(s, i * 8, pad([nota(28), nota(35)], 9, 4) * 0.5)
salvar("relogio-cru", eco(s, 0.26, 0.2))
# comocao-central: só piano e violoncelo, lento, sem percussão
s = np.zeros(int(SR * D)); prog = [[45, 52, 57], [41, 48, 53], [43, 50, 55], [40, 47, 52]]
mel = [69, 67, 65, 64, 65, 64, 62, 60]
for i in range(int(D / 10)):
    ac = prog[i % 4]
    for j, n in enumerate(ac): add(s, i * 10 + j * 0.8, piano(nota(n), 7, 0.35))
    add(s, i * 10 + 0.4, cello(nota(ac[0] - 12), 10, 0.42))
    for j in range(2): add(s, i * 10 + 3 + j * 3.3, piano(nota(mel[(i * 2 + j) % 8]), 4, 0.28))
salvar("comocao-central", reverb(s))
# balanco-cru: sintetizador grave e tique (seriedade, dinheiro)
s = np.zeros(int(SR * D)); beat = 60 / 88
for i in range(int(D / beat)):
    add(s, i * beat, tique() * 0.6)
    if i % 4 == 0: add(s, i * beat, bumbo() * 0.4)
for i in range(int(D / 8)):
    x = t(9); f = nota([31, 31, 29, 33][i % 4]); add(s, i * 8, sum(np.sin(2*np.pi*f*k*x)/k for k in range(1, 10)) * env(x, 0.8, 1.5, 9) * 0.3)
salvar("balanco-cru", eco(s, 0.33, 0.2))
# desfecho-central: piano, cordas e sino final (serenidade) — sol maior
s = np.zeros(int(SR * D)); prog = [[43, 50, 55, 59], [40, 47, 52, 55], [36, 43, 48, 52], [38, 45, 50, 54]]
mel = [67, 69, 71, 74, 71, 69, 67, 66]
for i in range(int(D / 8)):
    for j, n in enumerate(prog[i % 4]): add(s, i * 8 + j * 0.4, piano(nota(n + 12), 6, 0.28))
    for n in prog[i % 4][:2]: add(s, i * 8, cello(nota(n), 9, 0.2))
    for j in range(2): add(s, i * 8 + 3 + j * 2.5, piano(nota(mel[(i * 2 + j) % 8]), 3, 0.26))
    if i % 4 == 3: add(s, i * 8 + 6, sininho(nota(83), 3, 0.16))
salvar("desfecho-central", reverb(s))
print("ok")
