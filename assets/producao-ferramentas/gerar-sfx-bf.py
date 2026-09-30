# Efeitos do vídeo Bolsa Família (originais, por síntese). Uso: python gerar-sfx-bf.py <saida>
import subprocess, sys, wave
import numpy as np
SR = 44100
saida = sys.argv[1]
rng = np.random.default_rng(11)
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
def salvar(nome, s, g=0.8):
    s = s / (np.max(np.abs(s)) + 1e-9) * g
    st = np.stack([s, s], axis=1); w = f"{saida}/{nome}.wav"
    with wave.open(w, "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((st * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", w, "-b:a", "192k", f"{saida}/{nome}.mp3"], check=True); subprocess.run(["rm", w])
O = lambda s: int(s * SR)
# leitora de cartão: arrasto
x = t(0.45); leitora = pa(ruido(0.45), 3) * np.sin(np.pi * x / 0.45) ** 2 * 0.6
salvar("leitora-cartao", leitora, 0.6)
# bip do caixa
b = t(0.18); bip = np.sin(2 * np.pi * 1800 * b) * np.minimum(1, b / 0.004) * np.clip((0.18 - b) / 0.02, 0, 1) * 0.5
# notas saindo: estalos de papel
notas = junta(*[(O(i * 0.07), env(pa(ruido(0.06), 2), 0.001, 0.015)) for i in range(7)])
salvar("notas", notas, 0.5)
salvar("cartao-bip", junta((0, leitora), (O(0.5), bip), (O(0.75), notas * 0.7)), 0.7)
# tampa de panela
x = t(1.0); salvar("panela", sum(np.sin(2 * np.pi * f * x) * np.exp(-a * x) for f, a in [(820, 4), (1330, 5), (2210, 7)]) + env(ruido(1.0), 0.001, 0.01), 0.6)
# carimbo duplo
x = t(0.35); c1 = (rng.uniform(-1, 1, len(x)) * np.exp(-18 * x) * 0.9 + 0.6 * np.sin(2 * np.pi * 70 * x) * np.exp(-25 * x))
salvar("carimbo-duplo", junta((0, pb(c1, 6)), (O(0.22), pb(c1, 6))), 0.8)
# sino escolar
x = t(1.6); salvar("sino-escola", sum(np.sin(2 * np.pi * f * x) for f in (1320, 1980)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 18 * x))) * np.exp(-1.5 * x), 0.4)
# bip de fim de votação (genérico): três bips curtos e um longo
def tom(f, d): y = t(d); return np.sin(2 * np.pi * f * y) * np.minimum(1, y / 0.005) * np.clip((d - y) / 0.01, 0, 1)
salvar("urna-bip", junta((0, tom(1500, 0.1)), (O(0.15), tom(1500, 0.1)), (O(0.3), tom(1500, 0.1)), (O(0.45), tom(1500, 0.6))), 0.45)
# pente passando por papéis
salvar("pente-papel", junta(*[(O(i * 0.035), env(pa(ruido(0.03), 2), 0.001, 0.008)) for i in range(30)]) * 0.8, 0.5)
# porta abrindo (rangido + batente)
x = t(1.2); rang = np.sin(2 * np.pi * (180 + 90 * np.sin(2 * np.pi * 3 * x)) * x) * 0.3 * np.sin(np.pi * x / 1.2)
salvar("porta", junta((0, rang), (O(1.15), env(pb(ruido(0.2), 20), 0.001, 0.05))), 0.6)
# ambiência de feira: murmúrio + estalos
x = t(6.0); m = sum(pb(ruido(6.0), 40) * np.sin(2 * np.pi * rng.uniform(0.2, 0.9) * x + i) for i in range(6))
estalos = junta(*[(O(rng.uniform(0, 5.8)), env(pa(ruido(0.05), 2), 0.001, 0.01) * 0.4) for _ in range(20)])
estalos = np.pad(estalos, (0, max(0, len(m) - len(estalos))))[: len(m)]
salvar("feira-ambiencia", m * 0.6 + estalos, 0.35)
print("ok")
