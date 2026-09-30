# Efeitos do vídeo Eleições (originais, por síntese; o bip NÃO copia o som da urna oficial). Uso: python gerar-sfx-eleicoes.py <saida>
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


# bip-confirma: um tom agudo e longo, limpo, seguido de 0,5 s de silêncio
x = t(1.1); bip = np.sin(2*np.pi*1760*x) * 0.8 + np.sin(2*np.pi*3520*x) * 0.08
bip = bip * np.minimum(1, x/0.01) * np.clip((1.1 - x)/0.06, 0, 1)
salvar("bip-confirma", np.concatenate([bip, np.zeros(O(0.5))]), 0.55)
# tecla-urna: clique seco de tecla de borracha
salvar("tecla-urna", junta((0, env(pb(ruido(0.05), 6), 0.0005, 0.008)), (0, env(np.sin(2*np.pi*420*t(0.05)), 0.0005, 0.012) * 0.6)), 0.7)
# cedula-dobrar: papel dobrando (dois vincos)
def vinco(d=0.25): x = ruido(d); return env(pa(x, 3) * (0.5 + 0.5*np.sin(2*np.pi*23*t(d))), 0.01, 0.08)
salvar("cedula-dobrar", junta((0, vinco()), (O(0.3), vinco(0.3) * 0.8)), 0.6)
# lona-rasgar: tecido grosso rasgando
d = 0.9; x = pb(ruido(d), 3) * (0.6 + 0.4*np.abs(np.sin(2*np.pi*37*t(d)))); x += pa(ruido(d), 2) * 0.3 * (rng.uniform(0, 1, len(x)) > 0.7)
salvar("lona-rasgar", x * np.minimum(1, t(d)/0.05) * np.clip((d - t(d))/0.2, 0, 1), 0.65)
# lacre-rasgar: adesivo arrancado (curto e agudo)
d = 0.45; x = pa(ruido(d), 2) * (0.5 + 0.5*np.abs(np.sin(2*np.pi*60*t(d))))
salvar("lacre-rasgar", x * np.minimum(1, t(d)/0.01) * np.clip((d - t(d))/0.1, 0, 1), 0.55)
# lacre-fechar: adesivo pressionado + batida leve de palma de mão
salvar("lacre-fechar", junta((0, env(pa(ruido(0.15), 4), 0.01, 0.05) * 0.4), (O(0.12), env(pb(ruido(0.2), 25), 0.001, 0.04)), (O(0.12), env(np.sin(2*np.pi*140*t(0.2)), 0.001, 0.05) * 0.5)), 0.6)
# impressora-termica: rolo de papel térmico com passos rápidos (2,5 s)
d = 2.5; x = t(d); mot = np.sin(2*np.pi*(1200 + 80*np.sin(2*np.pi*50*x))*x) * 0.15 * (np.sin(2*np.pi*18*x) > 0)
mot += pa(ruido(d), 3) * 0.12
salvar("impressora-termica", mot * np.minimum(1, x/0.05) * np.clip((d - x)/0.1, 0, 1), 0.5)
# lapis-marca: dois traços de lápis formando um X
def traco(d=0.22): x = t(d); return pa(ruido(d), 2) * (0.4 + 0.6*np.sin(np.pi*x/d)) * 0.7
salvar("lapis-marca", junta((0, traco()), (O(0.3), traco())), 0.5)
print("ok")
