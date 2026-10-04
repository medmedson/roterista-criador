# Efeitos do vídeo Financiamento de campanhas (originais, por síntese):
# registro-caixa (assinatura), tecla-painel, pulso-dado, trava-cofre, corte-fio. Uso: python gerar-sfx-financiamento.py <saida>
import subprocess, sys, wave
import numpy as np
SR = 44100
saida = sys.argv[1]
rng = np.random.default_rng(31)
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
def fade_fim(s, d=0.03):
    k = min(len(s), int(d * SR)); s = s.copy(); s[-k:] *= np.linspace(1, 0, k); return s
def salvar(nome, s, g=0.8):
    s = fade_fim(s); s = s / (np.max(np.abs(s)) + 1e-9) * g
    st = np.stack([s, s], axis=1); w = f"{saida}/{nome}.wav"
    with wave.open(w, "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((st * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", w, "-b:a", "192k", f"{saida}/{nome}.mp3"], check=True); subprocess.run(["rm", w])
    print(nome)
O = lambda s: int(s * SR)
def clique_tecla(brilho=1.0):   # tecla mecânica: estalo filtrado + corpo grave curto
    x = t(0.05)
    est = env(pa(ruido(0.05), 3) * brilho + pb(ruido(0.05), 6) * 0.5, 0.0003, 0.006)
    corpo = np.sin(2 * np.pi * (240 + 200 * np.exp(-80 * x)) * x) * np.exp(-60 * x) * 0.5
    return est + corpo
def metal(fs, d, dec, amp):
    x = t(d); return sum(a * np.sin(2 * np.pi * f * x) * np.exp(-dec * x * (1 + 0.15 * i)) for i, (f, a) in enumerate(zip(fs, amp))) * np.minimum(1, x / 0.0008)

# registro-caixa (assinatura, 0,6 s): clique seco da tecla de registro + gaveta curta + tilintar curto e abafado
tecla = clique_tecla(1.2) * 1.0
gaveta = env(pb(ruido(0.12), 14) * np.linspace(0.3, 1, O(0.12)), 0.01, 0.05) * 0.35
x = t(0.42); baque = np.sin(2 * np.pi * 95 * x) * np.exp(-30 * x) * 0.4
tilim = pb(metal([2093, 2637, 4186, 5274], 0.42, 9, [0.5, 0.35, 0.15, 0.08]), 3) * 0.55   # abafado: passa-baixa leve
tilim2 = pb(metal([2349, 3136], 0.3, 12, [0.3, 0.15]), 3) * 0.3
s = junta((0, tecla), (O(0.05), gaveta), (O(0.15), baque), (O(0.16), tilim), (O(0.21), tilim2), (0, np.zeros(O(0.6))))
salvar("registro-caixa", s[:O(0.6)], 0.7)

# tecla-painel: digitação curta mono (4 teclas em ~0,45 s) para fichas
s = np.zeros(O(0.5))
for i, (pos, g) in enumerate([(0.0, 1.0), (0.11, 0.8), (0.2, 0.9), (0.33, 0.75)]):
    c = clique_tecla(0.9) * g * rng.uniform(0.85, 1.0); o = O(pos); s[o:o + len(c)] += c
salvar("tecla-painel", s, 0.55)

# pulso-dado: ping grave quando um nó acende (0,5 s)
x = t(0.5)
ping = (np.sin(2 * np.pi * 220 * x) + 0.35 * np.sin(2 * np.pi * 440 * x) * np.exp(-8 * x) + 0.6 * np.sin(2 * np.pi * 110 * x)) * np.exp(-7 * x) * np.minimum(1, x / 0.002)
salvar("pulso-dado", ping, 0.6)

# trava-cofre: estalo metálico curto (lingueta) + baque grave da porta do cofre (0,45 s)
est = env(pa(ruido(0.03), 2), 0.0002, 0.004) * 0.9
ling = metal([1180, 1730, 2870, 3920], 0.3, 22, [0.5, 0.4, 0.25, 0.12])
x = t(0.45); baque = np.sin(2 * np.pi * (70 + 60 * np.exp(-40 * x)) * x) * np.exp(-14 * x) * 0.8
est2 = env(pa(ruido(0.02), 2), 0.0002, 0.003) * 0.5
s = junta((0, est), (0, ling), (O(0.01), baque), (O(0.09), est2), (O(0.09), metal([1450, 2200], 0.2, 30, [0.25, 0.15])), (0, np.zeros(O(0.45))))
salvar("trava-cofre", s[:O(0.45)], 0.7)

# corte-fio: estalo seco de alicate cortando fio (0,25 s), sem cauda
est = env(pa(ruido(0.04), 2) * 1.0 + pa(ruido(0.04), 5) * 0.4, 0.0002, 0.005)
x = t(0.25); corpo = np.sin(2 * np.pi * (180 + 300 * np.exp(-90 * x)) * x) * np.exp(-40 * x) * 0.45
vibra = metal([3300, 4700], 0.12, 45, [0.18, 0.1])
s = junta((0, est), (0, corpo), (O(0.002), vibra), (0, np.zeros(O(0.25))))
salvar("corte-fio", s[:O(0.25)], 0.65)
print("ok")
