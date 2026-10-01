# Efeitos do vídeo SAMU (originais, por síntese; nada copiado de central real). Uso: python gerar-sfx-samu.py <saida>
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



# toque-central (assinatura): dois toques de telefone + clique de atendimento, sem voz
def toque(d=0.9):
    x = t(d); return (np.sin(2*np.pi*440*x) + np.sin(2*np.pi*480*x)) * 0.4 * (np.sin(2*np.pi*20*x) > -0.2) * np.minimum(1, x/0.01) * np.clip((d - x)/0.03, 0, 1)
clique = env(pa(ruido(0.05), 3), 0.0005, 0.01) + env(np.sin(2*np.pi*900*t(0.05)), 0.0005, 0.008) * 0.5
salvar("toque-central", junta((0, toque()), (O(1.4), toque()), (O(2.6), clique), (0, np.zeros(O(3.0)))), 0.6)
# radio-chiado: chiado de rádio com bipe curto (2 s)
d = 2.0; x = pa(ruido(d), 2) * (0.4 + 0.3*np.sin(2*np.pi*3*t(d))) * 0.5
salvar("radio-chiado", junta((0, x * np.minimum(1, t(d)/0.05) * np.clip((d - t(d))/0.1, 0, 1)), (O(0.05), env(np.sin(2*np.pi*1200*t(0.12)), 0.002, 0.08) * 0.5)), 0.5)
# tique-relogio: 4 tiques secos
s = np.zeros(O(4.0))
for i in range(4):
    c_ = env(pa(ruido(0.03), 2) * 0.6 + np.sin(2*np.pi*2400*t(0.03)) * 0.4, 0.0005, 0.006); s[O(i):O(i)+len(c_)] += c_
salvar("tique-relogio", s, 0.6)
# porta-ambulancia: porta de correr pesada (deslize + batida)
d = 0.8; desl = pb(ruido(d), 12) * np.linspace(0.2, 1, O(d)) * 0.5
salvar("porta-ambulancia", junta((0, desl), (O(0.75), env(pb(ruido(0.3), 40), 0.001, 0.06)), (O(0.75), env(np.sin(2*np.pi*80*t(0.3)), 0.001, 0.08) * 0.8)), 0.7)
# mapa-ping: ping digital curto (ponto acende no mapa)
x = t(0.5); salvar("mapa-ping", (np.sin(2*np.pi*1568*x) + 0.4*np.sin(2*np.pi*3136*x)) * np.exp(-9*x) * np.minimum(1, x/0.002), 0.5)
# impressora-termica: rolo de papel térmico (2,5 s)
d = 2.5; x = t(d); mot = np.sin(2*np.pi*(1200 + 80*np.sin(2*np.pi*50*x))*x) * 0.15 * (np.sin(2*np.pi*18*x) > 0) + pa(ruido(d), 3) * 0.12
salvar("impressora-termica", mot * np.minimum(1, x/0.05) * np.clip((d - x)/0.1, 0, 1), 0.5)
print("ok")
