# Trilhas do vídeo Financiamento de campanhas (tema DOSSIÊ DIGITAL, escuro e tecnológico):
# dossie, dossie-grave (variação do B11), arquivo-antigo, inquerito, porta-aberta, caixa-dois, plenario, tesouro,
# regra-fina, fachada, fluxo-dados, rede, cidadao, desfecho-dossie.
# Cada trilha tem 96 s e fecha em loop (a cauda do reverb é dobrada no começo). Comoção (fachada) só piano e violoncelo.
# Uso: python gerar-trilhas-financiamento.py <saida>
import subprocess, sys, wave
import numpy as np
SR = 44100
saida = sys.argv[1]
rng = np.random.default_rng(23)
D = 96          # duração do loop
CAUDA = 6       # segundos extras gerados e dobrados no começo (loop sem emenda)
def nota(n): return 440.0 * 2 ** ((n - 69) / 12)
def t(d): return np.arange(int(SR * d)) / SR
def env(tt, a, r, dur): return np.minimum(1, tt / a) * np.clip((dur - tt) / r, 0, 1)
def nova(): return np.zeros(int(SR * (D + CAUDA)))
def pad(freqs, dur, brilho=4):
    x = t(dur); s = np.zeros_like(x)
    for f in freqs:
        for k in range(1, brilho + 1):
            for d in (-0.2, 0.2): s += np.sin(2 * np.pi * (f + d) * k * x + k) / (k * 1.6)
    return s * env(x, 1.0, 1.5, dur) / (len(freqs) * brilho)
def corda(f, dur=0.18):
    x = t(dur); return sum(np.sin(2 * np.pi * f * k * x) / k for k in range(1, 6)) * np.exp(-14 * x) * np.minimum(1, x / 0.004)
def caixa_abafada():
    x = t(0.25); r = rng.uniform(-1, 1, len(x)); r = np.convolve(r, np.ones(12) / 12, mode="same")
    return (r * 1.6 + 0.4 * np.sin(2 * np.pi * 180 * x)) * np.exp(-18 * x) * 0.5
def tom(f, d=0.25, dec=10): x = t(d); return np.sin(2 * np.pi * f * x) * np.exp(-dec * x) * np.minimum(1, x / 0.003)
def add(s, pos, p):
    i = int(pos * SR); p = p[: max(0, len(s) - i)]; s[i:i + len(p)] += p
def eco(s, a=0.3, fb=0.3, n=4):
    o = s.copy(); k = int(a * SR)
    for i in range(1, n + 1): o[k * i:] += s[: len(s) - k * i] * fb ** i
    return o
def reverb(s, n=6):
    o = s.copy()
    for d, g in [(0.029, .5), (0.047, .45), (0.071, .4), (0.113, .33), (0.173, .27), (0.251, .2)][:n]:
        k = int(d * SR); o[k:] += s[:-k] * g
    return eco(o, 0.37, 0.25, 3)
def salvar(nome, s, lp=7000):
    n = int(SR * D); loop = s[:n].copy(); loop[: len(s) - n] += s[n:]   # dobra a cauda: o fim emenda no começo
    loop = loop / (np.max(np.abs(loop)) + 1e-9)
    rms = np.sqrt(np.mean(loop ** 2)); alvo = 10 ** (-17 / 20)   # trilhas esparsas: saturação suave até ~-19 dB de média
    if rms < alvo:
        k = min(alvo / rms, 2.5); loop = np.tanh(k * loop) / np.tanh(k)
    loop = loop * 0.72
    st = np.stack([loop, np.roll(loop, 441)], axis=1); w = f"{saida}/{nome}.wav"
    with wave.open(w, "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((st * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", w, "-af", f"lowpass=f={lp}", "-b:a", "192k", f"{saida}/{nome}.mp3"], check=True)
    subprocess.run(["rm", w])
    print(nome)

def piano(f, dur=3.0, vel=1.0):
    x = t(dur); s = sum(np.sin(2 * np.pi * f * k * x * (1 + 0.0004 * k * k)) * np.exp(-(1.2 + 0.9 * k) * x) / k ** 1.3 for k in range(1, 8))
    return s * np.minimum(1, x / 0.003) * vel
def cello(f, dur=4.0, vel=1.0):
    x = t(dur); vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * x) * np.minimum(1, x / 0.8)
    s = sum(np.sin(2 * np.pi * f * k * np.cumsum(vib) / SR) / k ** 1.1 for k in range(1, 9))
    return s * env(x, 0.6, 1.2, dur) * vel
def tique():
    x = t(0.03); return rng.uniform(-1, 1, len(x)) * np.exp(-200 * x) * 0.6
def marimba(f, d=0.6, vel=1.0):
    x = t(d); return (np.sin(2*np.pi*f*x) + 0.25*np.sin(2*np.pi*f*3.9*x)*np.exp(-18*x)) * np.exp(-7*x) * np.minimum(1, x/0.002) * vel
def sininho(f, d=2.0, vel=1.0):
    x = t(d); return (np.sin(2*np.pi*f*x) + 0.3*np.sin(2*np.pi*f*2.76*x)*np.exp(-3*x)) * np.exp(-2.2*x) * np.minimum(1, x/0.002) * vel
def madeira(f, dur=1.5, vel=1.0):
    x = t(dur); vib = 1 + 0.003*np.sin(2*np.pi*5*x)
    s = sum(np.sin(2*np.pi*f*k*np.cumsum(vib)/SR) * (0.6 if k % 2 else 0.2) / k for k in range(1, 7))
    return s * env(x, 0.08, 0.4, dur) * vel
def drone(f, dur, vel=1.0, harm=9):
    x = t(dur); mod = 1 + 0.15 * np.sin(2 * np.pi * 0.07 * x)
    s = sum(np.sin(2 * np.pi * f * k * x + k) / k ** 1.4 for k in range(1, harm + 1))
    return s * mod * env(x, 1.5, 2.0, dur) * vel
def tecla():   # tecla de painel ao fundo: blip curto e frio
    f = rng.choice([1320, 1480, 1760, 1980]); x = t(0.06)
    return np.sin(2 * np.pi * f * x) * np.exp(-70 * x) * np.minimum(1, x / 0.001)
def arp(f, d=0.22, vel=1.0):   # sintetizador de arpejo: seno + 3ª harmônica suave
    x = t(d); return (np.sin(2*np.pi*f*x) + 0.3*np.sin(2*np.pi*f*3*x) + 0.12*np.sin(2*np.pi*f*5*x)) * np.exp(-11*x) * np.minimum(1, x/0.002) * vel
def chiado(dur):   # chiado de fita: ruído filtrado com leve oscilação
    r = rng.uniform(-1, 1, int(SR * dur)); r = r - np.convolve(r, np.ones(6) / 6, mode="same")
    r = np.convolve(r, np.ones(3) / 3, mode="same"); x = t(dur)[: len(r)]
    return r * (1 + 0.25 * np.sin(2 * np.pi * 0.3 * x))

# progressão fria do dossiê (ré menor): Dm, Bb, Gm, A(sus)
PROG_DOSSIE = [[50, 57, 62, 65], [46, 53, 58, 62], [43, 50, 55, 58], [45, 52, 57, 62]]
MOTIVO = [38, 41, 40, 45]   # ré, fá, mi, lá no baixo (o desfecho resolve em ré maior)

# dossie: pulso eletrônico grave e limpo, teclas de painel ao fundo, tela que acende de madrugada (B1)
s = nova(); beat = 60 / 90
for i in range(int((D + CAUDA) / beat)):
    b = MOTIVO[(i // 8) % 4]
    add(s, i * beat, tom(nota(b), 0.4, 8) * (0.42 if i % 2 == 0 else 0.22))
    if i % 2 == 1: add(s, i * beat, tique() * 0.12)
    if rng.random() < 0.18: add(s, i * beat + rng.choice([0.17, 0.33, 0.5]), tecla() * 0.06)
for i in range(int((D + CAUDA) / 8)):
    add(s, i * 8, pad([nota(n) for n in PROG_DOSSIE[i % 4]], 9.5, 3) * 0.45)
salvar("dossie", eco(s, 0.333, 0.22))

# dossie-grave: variação do B11 (seriedade): mesmo motivo uma oitava abaixo, pulso mais lento, cordas baixas, sem teclas
s = nova(); beat = 60 / 72
for i in range(int((D + CAUDA) / beat)):
    b = MOTIVO[(i // 8) % 4] - 12
    add(s, i * beat, tom(nota(b), 0.6, 5) * (0.55 if i % 2 == 0 else 0.25))
    if i % 4 == 2: add(s, i * beat, tique() * 0.08)
for i in range(int((D + CAUDA) / 8)):
    ch = PROG_DOSSIE[i % 4]
    for n in ch[:2]: add(s, i * 8, cello(nota(n - 12), 9.5, 0.2))
    add(s, i * 8, pad([nota(n - 12) for n in ch], 9.5, 4) * 0.3)
salvar("dossie-grave", reverb(s, 4), 5000)

# arquivo-antigo: piano espaçado, chiado de fita, contrabaixo longo (sala de arquivo, B2) — lá menor
s = nova(); mel = [69, 64, 72, 71, 67, 64, 69, 62]
for i in range(int((D + CAUDA) / 4)):
    add(s, i * 4 + 0.3, piano(nota(mel[i % 8]), 3.6, 0.26))
    if i % 2 == 1: add(s, i * 4 + 2.3, piano(nota(mel[(i + 3) % 8] - 12), 3.0, 0.14))
for i in range(int((D + CAUDA) / 8)):
    add(s, i * 8, cello(nota([33, 29, 31, 28][i % 4]), 9.5, 0.3))
s = reverb(s); s += chiado(len(s) / SR)[: len(s)] * 0.035
salvar("arquivo-antigo", s, 6000)

# inquerito: drone grave e percussão seca, cordas graves curtas, sem melodia heroica (B3)
s = nova(); beat = 60 / 72
for i in range(int((D + CAUDA) / 12)):
    add(s, i * 12, drone(nota(26), 13.5, 0.35) + drone(nota(33), 13.5, 0.18))
for i in range(int((D + CAUDA) / beat)):
    if i % 4 == 3: add(s, i * beat, caixa_abafada() * 0.45)
    if i % 8 in (0, 1, 5): add(s, i * beat + (beat / 2 if i % 8 == 5 else 0), corda(nota([38, 38, 37, 39][(i // 8) % 4]), 0.24) * 0.35)
    if i % 16 == 0: add(s, i * beat, tom(nota(26), 0.6, 6) * 0.5)
salvar("inquerito", eco(s, 0.42, 0.2), 5000)

# porta-aberta: marimba e baixo em ostinato, pizzicato, engrenagem andando (B4) — mi menor / sol
s = nova(); beat = 60 / 108; ost = [64, 67, 71, 67, 66, 67, 71, 74]
baixos = [40, 36, 43, 38]
for i in range(int((D + CAUDA) / (beat / 2))):
    add(s, i * beat / 2, marimba(nota(ost[i % 8]), 0.45, 0.3 if i % 2 == 0 else 0.2))
    if i % 4 == 0: add(s, i * beat / 2, corda(nota(baixos[(i // 16) % 4]), 0.3) * 0.45)
    if i % 8 == 6: add(s, i * beat / 2, corda(nota(baixos[(i // 16) % 4] + 19), 0.12) * 0.18)
for i in range(int((D + CAUDA) / 8)):
    b = baixos[(i * 2) % 4]; add(s, i * 8, pad([nota(b + 12), nota(b + 19), nota(b + 24)], 9.5, 2) * 0.22)
salvar("porta-aberta", eco(s, 0.278, 0.18))

# caixa-dois: drone baixo, pulso de relógio, piano grave isolado; nada triunfal (B5)
s = nova()
for i in range(int((D + CAUDA) / 16)):
    add(s, i * 16, drone(nota(31), 17.5, 0.3, 7) + drone(nota(38), 17.5, 0.12, 5))
for i in range(int(D + CAUDA)):
    add(s, i, tique() * (0.32 if i % 2 == 0 else 0.2))
for i in range(int((D + CAUDA) / 8)):
    add(s, i * 8 + 4.5, piano(nota([43, 46, 42, 43][i % 4]), 5, 0.3))
salvar("caixa-dois", eco(s, 0.5, 0.15, 3), 5500)

# plenario: cordas sustentadas solenes e neutras, madeiras graves (B6) — fá menor modal, sem tensão
s = nova(); prog = [[41, 48, 53, 56], [39, 46, 51, 55], [37, 44, 49, 53], [36, 43, 48, 52]]
for i in range(int((D + CAUDA) / 12)):
    ch = prog[i % 4]
    for j, n in enumerate(ch): add(s, i * 12, cello(nota(n), 13.5, 0.22 if j < 2 else 0.14))
    add(s, i * 12 + 4, madeira(nota(ch[2]), 6, 0.12)); add(s, i * 12 + 7.5, madeira(nota(ch[3] - 12 + 12), 4, 0.09))
salvar("plenario", reverb(s), 6000)

# tesouro: pulso médio, cordas em escada que sobem com a série, sino baixo (B7) — dó menor → mi bemol
s = nova(); beat = 60 / 92; escada = [48, 50, 51, 53, 55, 56, 58, 60]
for i in range(int((D + CAUDA) / beat)):
    add(s, i * beat, tom(nota(36), 0.35, 9) * (0.4 if i % 2 == 0 else 0.18))
    if i % 4 == 2: add(s, i * beat, tique() * 0.12)
for i in range(int((D + CAUDA) / 2)):   # um degrau a cada 2 s; ciclo de 16 s
    n = escada[i % 8]; add(s, i * 2, cello(nota(n), 2.6, 0.18 + 0.02 * (i % 8))); add(s, i * 2, cello(nota(n - 12), 2.6, 0.12))
for i in range(int((D + CAUDA) / 16)):
    add(s, i * 16, pad([nota(36), nota(43), nota(48)], 17, 3) * 0.3)
    add(s, i * 16 + 14, sininho(nota(60), 3, 0.18))
salvar("tesouro", reverb(s, 4))

# regra-fina: pizzicato leve, marimba suave e sintetizador limpo (B8, didática) — dó maior
s = nova(); beat = 60 / 96; piz = [60, 64, 67, 64, 62, 65, 69, 65]
for i in range(int((D + CAUDA) / (beat / 2))):
    if i % 2 == 0: add(s, i * beat / 2, corda(nota(piz[(i // 2) % 8] + 12), 0.14) * 0.3)
    if i % 4 == 3: add(s, i * beat / 2, marimba(nota(piz[(i // 4 + 2) % 8] + 12), 0.4, 0.14))
    if i % 8 == 0: add(s, i * beat / 2, corda(nota([36, 41, 43, 36][(i // 16) % 4]), 0.25) * 0.35)
for i in range(int((D + CAUDA) / 8)):
    add(s, i * 8, pad([nota(n) for n in [[48, 55, 64], [53, 57, 65], [55, 59, 67], [48, 55, 64]][i % 4]], 9.5, 2) * 0.22)
salvar("regra-fina", eco(s, 0.312, 0.18))

# fachada: piano e violoncelo — sereno, tenso no meio, sereno no fim (B9; comoção contida, sem efeito)
s = nova()
sereno = [[45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59], [40, 47, 52, 55]]   # Am F G Em
tenso = [[45, 51, 57, 60], [44, 50, 56, 59], [41, 47, 53, 56], [40, 46, 52, 56]]    # mais escuro (trítonos)
plano = [sereno, sereno, tenso, tenso, tenso, sereno]   # 6 frases de 16 s
mel_s = [76, 74, 72, 71]; mel_t = [75, 74, 71, 68]
for i in range(int((D + CAUDA) / 4)):
    fase = plano[(i // 4) % 6]; ch = fase[i % 4]; tens = fase is tenso
    for j, n in enumerate(ch[1:]): add(s, i * 4 + j * 0.45, piano(nota(n), 3.8, 0.17))
    add(s, i * 4, cello(nota(ch[0]), 4.6, 0.26 if tens else 0.2))
    if i % 2 == 1: add(s, i * 4 + 1.9, piano(nota((mel_t if tens else mel_s)[(i // 2) % 4]), 3.2, 0.2))
salvar("fachada", reverb(s), 6500)

# fluxo-dados: arpejo eletrônico leve, pulsos de dado, pad (B10) — fá maior/ré menor, limpo
s = nova(); beat = 60 / 110; acordes = [[53, 57, 60, 65], [50, 53, 57, 62], [46, 50, 53, 58], [48, 52, 55, 60]]
for i in range(int((D + CAUDA) / (beat / 2))):
    ch = acordes[(i // 16) % 4]; ordem = [0, 1, 2, 3, 2, 1, 3, 2]
    add(s, i * beat / 2, arp(nota(ch[ordem[i % 8]] + 12), 0.2, 0.2 if i % 2 == 0 else 0.13))
    if i % 8 == 0: add(s, i * beat / 2, tom(nota(ch[0] - 12), 0.4, 8) * 0.35)
    if i % 16 == 12: add(s, i * beat / 2, tom(nota(81), 0.12, 30) * 0.08)
for i in range(int((D + CAUDA) / (16 * beat / 2))):
    add(s, i * 16 * beat / 2, pad([nota(n) for n in acordes[i % 4]], 16 * beat / 2 + 1.5, 2) * 0.25)
salvar("fluxo-dados", eco(s, 0.409, 0.2))

# rede: drone, pulso que acelera a cada achado (3 ciclos de 32 s), arpejo discreto (B12, suspense → revelação)
s = nova()
for i in range(int((D + CAUDA) / 16)):
    add(s, i * 16, drone(nota(29), 17.5, 0.32) + drone(nota(36), 17.5, 0.15))
for c in range(int((D + CAUDA) / 32) + 1):
    pos = 0.0
    while pos < 32:
        bpm = 70 + 60 * (pos / 32) ** 1.5; add(s, c * 32 + pos, tom(nota(41), 0.3, 11) * (0.3 + 0.2 * pos / 32))
        pos += 60 / bpm
    for j in range(64):   # arpejo em semicolcheias leves, crescendo no ciclo
        add(s, c * 32 + j * 0.5, arp(nota([65, 68, 72, 75][j % 4]), 0.18, 0.04 + 0.08 * j / 64))
    add(s, c * 32 + 26, pad([nota(53), nota(60), nota(65)], 6.5, 4) * 0.25 * np.linspace(0, 1, int(SR * 6.5)))
salvar("rede", eco(s, 0.375, 0.2), 6000)

# cidadao: piano e cordas leves, andamento que anda, marimba suave (B13, autonomia e esperança) — fá maior
s = nova(); beat = 60 / 100; prog = [[41, 53, 57, 60], [38, 50, 53, 57], [46, 53, 58, 62], [48, 52, 55, 60]]
mel = [69, 72, 70, 69, 67, 65, 67, 72]
for i in range(int((D + CAUDA) / (beat * 4))):
    ch = prog[i % 4]
    for k in range(4): add(s, (i * 4 + k) * beat, piano(nota(ch[1 + k % 3]), 1.6, 0.13))
    add(s, i * 4 * beat, piano(nota(ch[0]), 2.6, 0.2))
    add(s, i * 4 * beat, cello(nota(ch[0] + 12), 4 * beat + 0.6, 0.12))
    add(s, (i * 4 + 2) * beat, piano(nota(mel[i % 8]), 2.0, 0.17))
    if i % 2 == 1: add(s, (i * 4 + 3.5) * beat, marimba(nota(mel[(i + 4) % 8] + 12), 0.5, 0.08))
salvar("cidadao", reverb(s, 4))

# desfecho-dossie: piano e cordas, tema do dossie resolvido em ré maior, sino final de cada ciclo (B14)
s = nova(); prog = [[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]]   # D Bm G A
motivo = [62, 66, 64, 69]   # ré, fá#, mi, lá: o motivo do dossiê, agora em maior
for i in range(int((D + CAUDA) / 8)):
    ch = prog[i % 4]
    for j, n in enumerate(ch): add(s, i * 8 + j * 0.4, piano(nota(n), 6, 0.2))
    for n in ch[:2]: add(s, i * 8, cello(nota(n), 9.5, 0.18))
    add(s, i * 8 + 3.5, piano(nota(motivo[i % 4] + 12), 3.5, 0.2))
    if i % 4 == 3: add(s, i * 8 + 6, sininho(nota(86), 3, 0.12))
salvar("desfecho-dossie", reverb(s))
print("ok")
