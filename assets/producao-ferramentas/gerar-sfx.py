# Efeitos sonoros originais por síntese (sem direitos de terceiros).
# Uso: python gerar-sfx.py <pasta-saida>
import subprocess, sys, wave
import numpy as np

SR = 44100
saida = sys.argv[1]
rng = np.random.default_rng(7)

def t(d): return np.arange(int(SR * d)) / SR
def ruido(d): return rng.uniform(-1, 1, int(SR * d))
def env(x, a=0.005, r=0.1):
    n = len(x); tt = np.arange(n) / SR
    return x * np.minimum(1, tt / max(a, 1e-4)) * np.exp(-tt / max(r, 1e-4))
def passa_baixa(x, k=8):
    return np.convolve(x, np.ones(k) / k, mode="same")
def passa_alta(x, k=8):
    return x - passa_baixa(x, k)
def junta(*partes):
    n = max(off + len(p) for off, p in partes)
    s = np.zeros(n)
    for off, p in partes: s[off:off + len(p)] += p
    return s
def salvar(nome, s, ganho=0.8):
    s = s / (np.max(np.abs(s)) + 1e-9) * ganho
    st = np.stack([s, s], axis=1)
    wav = f"{saida}/{nome}.wav"
    with wave.open(wav, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-b:a", "192k", f"{saida}/{nome}.mp3"], check=True)
    subprocess.run(["rm", wav])

# batimento: tum-tum grave
def tum(f=50, d=0.25): x = t(d); return np.sin(2 * np.pi * (f + 40 * np.exp(-30 * x)) * x) * np.exp(-14 * x)
salvar("batimento", junta((0, tum()), (int(0.28 * SR), 0.7 * tum(46))))
# bip de monitor
x = t(0.14); salvar("bip-monitor", np.sin(2 * np.pi * 1000 * x) * np.minimum(1, x / 0.005) * np.clip((0.14 - x) / 0.02, 0, 1), 0.5)
# flatline: tom contínuo 2 s
x = t(2.0); salvar("flatline", np.sin(2 * np.pi * 1000 * x) * np.minimum(1, x / 0.02) * np.clip((2 - x) / 0.2, 0, 1), 0.45)
# turbina: ruído filtrado com sweep e passagem
x = t(4.0); r = passa_baixa(ruido(4.0), 30) * 3
tom = np.sin(2 * np.pi * (180 + 120 * np.sin(np.pi * x / 4)) * x) * 0.3
salvar("turbina", (r + tom) * np.sin(np.pi * x / 4) ** 2)
# papel virar / deslizar
x = t(0.5); salvar("papel-virar", passa_alta(ruido(0.5), 4) * np.sin(np.pi * x / 0.5) ** 3 * (1 + 0.6 * np.sin(2 * np.pi * 30 * x)), 0.6)
x = t(0.6); salvar("papel-deslizar", passa_alta(ruido(0.6), 6) * np.sin(np.pi * x / 0.6) ** 2 * 0.8, 0.5)
# máquina de escrever: 6 teclas + campainha no fim
teclas = [(int(i * 0.11 * SR), env(passa_alta(ruido(0.05), 3), 0.001, 0.012)) for i in range(6)]
salvar("maquina-escrever", junta(*teclas), 0.7)
# flash de câmera: clique + chiado de carga
x = t(0.9); carga = np.sin(2 * np.pi * (2000 + 4000 * x) * x) * 0.08 * np.exp(-3 * x)
salvar("flash-camera", junta((0, env(passa_alta(ruido(0.08), 2), 0.001, 0.02)), (0, carga)), 0.6)
# whoosh
x = t(0.5); salvar("whoosh", passa_baixa(ruido(0.5), 12) * np.sin(np.pi * x / 0.5) ** 2, 0.7)
# riser 1,5 s
x = t(1.5); salvar("riser", (passa_alta(ruido(1.5), 5) * 0.5 + np.sin(2 * np.pi * (200 + 900 * (x / 1.5) ** 2) * x) * 0.5) * (x / 1.5) ** 2, 0.7)
# sting: acorde dissonante curto
x = t(1.2); salvar("sting", sum(np.sin(2 * np.pi * f * x) for f in (220, 233, 330, 466)) * np.exp(-3 * x), 0.7)
# gaveta de arquivo
x = t(0.7); salvar("gaveta-arquivo", junta((0, passa_baixa(ruido(0.6), 20) * np.sin(np.pi * t(0.6) / 0.6)), (int(0.6 * SR), env(passa_baixa(ruido(0.1), 5), 0.001, 0.03) * 2)), 0.7)
# elástico da pasta
x = t(0.35); salvar("elastico-pasta", np.sin(2 * np.pi * (140 - 60 * x) * x) * np.exp(-12 * x) + env(ruido(0.35), 0.001, 0.01) * 0.3, 0.6)
# vidro tilintando
parts = [(int(i * 0.09 * SR), sum(np.sin(2 * np.pi * f * t(0.6)) for f in (2600 + i * 180, 4100 + i * 90)) * np.exp(-9 * t(0.6)) * 0.4) for i in range(4)]
salvar("vidro-tilintar", junta(*parts), 0.5)
# moedas
parts = [(int(rng.uniform(0, 0.8) * SR), np.sin(2 * np.pi * rng.uniform(3000, 5200) * t(0.25)) * np.exp(-18 * t(0.25))) for _ in range(18)]
salvar("moedas", junta(*parts), 0.5)
# tique de relógio (1 s em loop: tique curto)
salvar("relogio-tique", junta((0, env(passa_alta(ruido(0.03), 2), 0.0005, 0.006)), (int(0.999 * SR), np.zeros(1))), 0.5)
# sirene distante
x = t(5.0); salvar("sirene-distante", np.sin(2 * np.pi * (650 + 180 * np.sin(2 * np.pi * 0.5 * x)) * x) * 0.3 * np.sin(np.pi * x / 5), 0.3)
# estática / glitch
x = t(0.4); salvar("estatica", ruido(0.4) * (np.sin(2 * np.pi * 23 * x) > 0), 0.5)
# lâmpada fluorescente: zumbido 100 Hz com piscadas
x = t(3.0); salvar("lampada-fluorescente", (np.sin(2 * np.pi * 100 * x) + 0.3 * np.sin(2 * np.pi * 200 * x)) * (0.6 + 0.4 * (rng.uniform(0, 1, len(x)) > 0.02)), 0.25)
# murmúrio de multidão
x = t(5.0); m = sum(passa_baixa(ruido(5.0), 40) * np.sin(2 * np.pi * rng.uniform(0.2, 0.8) * x + i) for i in range(6))
salvar("murmurio-multidao", m * np.sin(np.pi * x / 5), 0.4)
print("ok")
