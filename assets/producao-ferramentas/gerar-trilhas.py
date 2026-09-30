# Gera trilhas originais (sem direitos de terceiros) por síntese: investigação, drama, desfecho.
# Uso: python gerar-trilhas.py <pasta-saida>
import subprocess, sys, wave
import numpy as np

SR = 44100
saida = sys.argv[1]

def nota(n):  # número MIDI -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)

def env(t, a, r, dur):
    e = np.minimum(1, t / a) * np.clip((dur - t) / r, 0, 1)
    return e

def pad(freqs, dur, brilho=4):
    t = np.arange(int(SR * dur)) / SR
    s = np.zeros_like(t)
    for f in freqs:
        for k in range(1, brilho + 1):  # dente de serra suave, levemente desafinado
            for d in (-0.15, 0.15):
                s += np.sin(2 * np.pi * (f + d) * k * t + k) / (k * 1.6)
    return s * env(t, 1.2, 1.5, dur) / (len(freqs) * brilho)

def pluck(f, dur=0.6):
    t = np.arange(int(SR * dur)) / SR
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-6 * t)

def grave(f, dur):
    t = np.arange(int(SR * dur)) / SR
    return np.sin(2 * np.pi * f * t) * env(t, 0.3, 0.8, dur)

def eco(s, atraso=0.32, fb=0.35, vezes=4):
    out = s.copy()
    n = int(atraso * SR)
    for i in range(1, vezes + 1):
        out[n * i:] += s[: len(s) - n * i] * fb ** i
    return out

def salvar(nome, s):
    s = s / (np.max(np.abs(s)) + 1e-9) * 0.8
    st = np.stack([s, np.roll(s, 441)], axis=1)  # estéreo leve
    wav = f"{saida}/{nome}.wav"
    with wave.open(wav, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-af", "lowpass=f=6000", "-b:a", "192k", f"{saida}/{nome}.mp3"], check=True)
    subprocess.run(["rm", wav])

def trilha(acordes, compasso, voltas, arpejo=True, bpm=84, nome="x", brilho=4, grave_on=True):
    total = len(acordes) * compasso * voltas + 3
    s = np.zeros(int(SR * total))
    beat = 60 / bpm
    pos = 0.0
    for v in range(voltas):
        for ac in acordes:
            i = int(pos * SR)
            p = pad([nota(n) for n in ac], compasso + 1.2, brilho)
            s[i:i + len(p)] += p * 0.9
            if grave_on:
                g = grave(nota(ac[0] - 12), compasso)
                s[i:i + len(g)] += g * 0.5
            if arpejo:
                passos = int(compasso / (beat / 2))
                for k in range(passos):
                    n = ac[[0, 1, 2, 1][k % 4]] + 12
                    pl = pluck(nota(n))
                    j = int((pos + k * beat / 2) * SR)
                    s[j:j + len(pl)] += pl * 0.18
            pos += compasso
    return eco(s)

# Investigação: Lá menor, ritmo contido, arpejo discreto
salvar("investigacao", trilha([[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], 4, 6, nome="investigacao"))
# Drama: acordes longos, sem arpejo, menor e mais escuro
salvar("drama", trilha([[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52]], 6, 4, arpejo=False, brilho=6))
# Desfecho: suspenso, resolve pouco
salvar("desfecho", trilha([[57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]], 5, 3, bpm=70))
print("ok")
