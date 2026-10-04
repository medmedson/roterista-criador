# Trilhas do vídeo curto "Siga o dinheiro" (estilo criador de conteúdo, tema CADERNO VIVO, claro e leve):
# caderno (lo-fi leve: marimba, baixo, batida suave, pouco chiado), caderno-tenso (só baixo, pulso e um pad),
# caderno-resolve (acorde final de ~4 s para "a trilha resolve", sem loop).
# Loops de 96 s sem costura: 37 compassos a 92,5 BPM fecham exatamente 96 s; as notas só começam dentro do loop
# e a cauda (reverb, notas longas) é dobrada no começo.
# Uso: python gerar-trilhas-influencer.py <saida>
import subprocess, sys, wave
import numpy as np
SR = 44100
saida = sys.argv[1]
rng = np.random.default_rng(92)
D = 96            # duração do loop
CAUDA = 6         # segundos extras dobrados no começo
COMPASSOS = 37
BEAT = D / (COMPASSOS * 4)    # 0,6486 s = 92,5 BPM
def nota(n): return 440.0 * 2 ** ((n - 69) / 12)
def t(d): return np.arange(int(SR * d)) / SR
def env(tt, a, r, dur): return np.minimum(1, tt / a) * np.clip((dur - tt) / r, 0, 1)
def nova(d=D + CAUDA): return np.zeros(int(SR * d))
def add(s, pos, p):
    i = int(pos * SR); p = p[: max(0, len(s) - i)]; s[i:i + len(p)] += p
def pb(x, k=8): return np.convolve(x, np.ones(k) / k, mode="same")
def eco(s, a=0.3, fb=0.3, n=4):
    o = s.copy(); k = int(a * SR)
    for i in range(1, n + 1): o[k * i:] += s[: len(s) - k * i] * fb ** i
    return o
def reverb(s, n=6, mix=1.0):
    o = s.copy()
    for d, g in [(0.029, .5), (0.047, .45), (0.071, .4), (0.113, .33), (0.173, .27), (0.251, .2)][:n]:
        k = int(d * SR); o[k:] += s[:-k] * g * mix
    return o

# --- instrumentos ---
def marimba(f, d=0.9, vel=1.0):   # barra de madeira: fundamental + 4ª parcial (≈3,9×) que some rápido, ataque macio
    x = t(d)
    s = np.sin(2 * np.pi * f * x) + 0.22 * np.sin(2 * np.pi * f * 3.93 * x) * np.exp(-22 * x) + 0.08 * np.sin(2 * np.pi * f * 9.2 * x) * np.exp(-60 * x)
    return s * np.exp(-5.5 * x) * np.minimum(1, x / 0.003) * vel
def baixo(f, d=0.6, vel=1.0):     # baixo redondo: seno + 2ª harmônica, leve saturação, solta no fim
    x = t(d); s = np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-6 * x)
    s = np.tanh(1.4 * s) * np.exp(-2.2 * x) * env(x, 0.006, 0.06, d)
    return s * vel
def bumbo(vel=1.0):               # bumbo lo-fi macio
    x = t(0.35); f = 48 + 70 * np.exp(-30 * x)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-11 * x) * np.minimum(1, x / 0.002) * vel
def aro(vel=1.0):                 # caixa abafada / aro (rimshot suave)
    x = t(0.18); r = pb(rng.uniform(-1, 1, len(x)), 5)
    return (r * 0.9 * np.exp(-28 * x) + 0.5 * np.sin(2 * np.pi * 330 * x) * np.exp(-45 * x)) * vel
def chimbal(vel=1.0, d=0.05):     # chimbal fechado, filtrado (não fere)
    x = t(d); r = rng.uniform(-1, 1, len(x)); r = r - pb(r, 4); r = pb(r, 2)
    return r * np.exp(-90 * x) * vel
def teclado(freqs, dur, vel=1.0): # piano elétrico suave para a cama harmônica
    x = t(dur); trem = 1 + 0.12 * np.sin(2 * np.pi * 4.2 * x)
    s = sum(np.sin(2 * np.pi * f * x) + 0.18 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-3 * x) for f in freqs)
    return s * trem * env(x, 0.02, 0.5, dur) * np.exp(-0.35 * x) * vel / len(freqs)
def pad(freqs, dur, vel=1.0, brilho=3):
    x = t(dur); s = np.zeros_like(x)
    for f in freqs:
        for k in range(1, brilho + 1):
            for d in (-0.25, 0.25): s += np.sin(2 * np.pi * (f + d) * k * x + k) / (k * 1.7)
    return s * env(x, 1.2, 1.6, dur) * vel / (len(freqs) * brilho)
def vinil(dur, estalos=1.0):      # pouco chiado: ruído muito baixo + estalos esparsos
    n = int(SR * dur); r = rng.uniform(-1, 1, n); r = pb(r - pb(r, 8), 3) * 0.05
    for _ in range(int(dur * 3 * estalos)):
        i = rng.integers(0, n - 200); k = rng.integers(20, 120)
        r[i:i + k] += rng.uniform(-1, 1, k) * np.exp(-np.arange(k) / 15) * rng.uniform(0.1, 0.35)
    return r

def salvar(nome, s, lp=9000, loop=True, alvo_db=-17):
    if loop:
        n = int(SR * D); out = s[:n].copy(); out[: len(s) - n] += s[n:]   # dobra a cauda: o fim emenda no começo
    else:
        out = s.copy()
    out = out / (np.max(np.abs(out)) + 1e-9)
    rms = np.sqrt(np.mean(out ** 2)); alvo = 10 ** (alvo_db / 20)
    if rms < alvo:
        k = min(alvo / rms, 2.0); out = np.tanh(k * out) / np.tanh(k)
    out = out * 0.7                      # ~ -3 dBFS: folga para o mp3
    if not loop:
        k = int(0.4 * SR); out[-k:] *= np.linspace(1, 0, k)
    st = np.stack([out, np.roll(out, 331) if loop else np.concatenate([np.zeros(331), out[:-331]])], axis=1)
    w = f"{saida}/{nome}.wav"
    with wave.open(w, "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((st * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", w, "-af", f"lowpass=f={lp}", "-b:a", "192k", f"{saida}/{nome}.mp3"], check=True)
    subprocess.run(["rm", w])
    print(nome)

# progressão clara e leve (dó maior): Cmaj7, Am7, Fmaj7, G6 — um acorde por compasso
PROG = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 64]]
BAIXOS = [36, 33, 41, 43]
# figuras de marimba (posição em colcheias, grau do acorde, oitava): motivos curtos, repetitivos e calmos
FIGURAS = [[(0, 0, 12), (3, 2, 12), (6, 1, 12)],
           [(0, 1, 12), (2, 3, 0), (5, 2, 12)],
           [(1, 0, 12), (3, 1, 12), (4, 2, 12), (7, 3, 0)],
           [(0, 2, 0), (3, 3, 0), (6, 0, 12)]]

# caderno: lo-fi leve a 92,5 BPM; entra seca (batida desde o 1º compasso), respiro sem bumbo nos compassos 24 a 27
s = nova(); mar = nova(); col = BEAT / 2; swing = 0.08 * BEAT
for c in range(COMPASSOS):
    t0 = c * 4 * BEAT; ch = PROG[c % 4]; respiro = 24 <= c < 28
    # baixo: tônica no 1, quinta/oitava no "e" do 2, aproximação no 4
    b = BAIXOS[c % 4]
    add(s, t0, baixo(nota(b), 1.1 * BEAT, 0.55))
    add(s, t0 + 1.5 * BEAT + swing, baixo(nota(b + 7), 0.7 * BEAT, 0.35))
    add(s, t0 + 3 * BEAT, baixo(nota(b + 12 if c % 2 else b), 0.8 * BEAT, 0.4))
    # batida suave
    if not respiro:
        add(s, t0, bumbo(0.55)); add(s, t0 + 2.5 * BEAT + swing, bumbo(0.35))
    add(s, t0 + BEAT, aro(0.22 if respiro else 0.3)); add(s, t0 + 3 * BEAT, aro(0.22 if respiro else 0.3))
    for i in range(8):
        add(s, t0 + i * col + (swing if i % 2 else 0), chimbal((0.09 if i % 2 else 0.13) * rng.uniform(0.8, 1.0)))
    # cama harmônica: teclado bem baixo, um acorde por compasso
    add(s, t0, teclado([nota(n) for n in ch], 4 * BEAT + 0.6, 0.16))
    # marimba: figura muda a cada 2 compassos; variações pequenas, sem melodia aguda
    fig = FIGURAS[(c // 2) % 4]
    for pos, grau, oit in fig:
        if rng.random() < 0.12: continue
        add(mar, t0 + pos * col + (swing if pos % 2 else 0), marimba(nota(ch[grau] + oit), 0.9, 0.3 * rng.uniform(0.8, 1.0)))
s += reverb(eco(mar, 3 * col, 0.2, 2), 6, 0.6)
s[: int(SR * D)] += vinil(D, 0.8) * 0.5
salvar("caderno", s)

# caderno-tenso: só baixo, pulso e um pad (lá menor). Mesmo andamento para trocar sem tropeço.
PROG_T = [[57, 60, 64, 71], [57, 60, 64, 71], [53, 57, 60, 64], [52, 56, 59, 62]]   # Am(add9) Am(add9) Fmaj7 E7
BAIXOS_T = [33, 33, 29, 28]
s = nova()
for c in range(COMPASSOS):
    t0 = c * 4 * BEAT; i = (c // 2) % 4; b = BAIXOS_T[i]
    # baixo: notas longas no 1 e um empurrão curto no "e" do 3
    add(s, t0, baixo(nota(b), 2.2 * BEAT, 0.6))
    add(s, t0 + 2.5 * BEAT, baixo(nota(b), 0.4 * BEAT, 0.35))
    # pulso: colcheias abafadas graves, acento no tempo, como um coração calmo
    for k in range(8):
        x = t(0.16); p = np.sin(2 * np.pi * nota(b + 12) * x) * np.exp(-26 * x) * np.minimum(1, x / 0.002)
        add(s, t0 + k * BEAT / 2, p * (0.22 if k % 2 == 0 else 0.11))
    add(s, t0, bumbo(0.3))
    if c % 2 == 0:
        add(s, t0, pad([nota(n) for n in PROG_T[i]], 8 * BEAT + 1.5, 0.5))
salvar("caderno-tenso", reverb(s, 4, 0.5), 7000)

# caderno-resolve: acorde final (Cmaj9) de marimba, teclado, baixo e pad, ~4,5 s, sem loop
s = nova(5)
ch = [48, 55, 60, 64, 67, 71, 74]
for k, n in enumerate(ch[2:]):
    add(s, 0.03 * k, marimba(nota(n + 12 if k > 2 else n), 2.5, 0.32))
add(s, 0, teclado([nota(n) for n in ch[2:6]], 4.5, 0.3))
add(s, 0, baixo(nota(36), 3.5, 0.6)); add(s, 0, bumbo(0.4))
add(s, 0, pad([nota(n) for n in ch[1:5]], 4.5, 0.5))
salvar("caderno-resolve", reverb(s, 6, 0.6), 9000, loop=False, alvo_db=-30)
