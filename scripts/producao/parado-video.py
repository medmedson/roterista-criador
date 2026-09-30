# Detecta trechos parados (> N s sem mudança visível) num mp4 já renderizado. Uso: python parado-video.py video.mp4 [6]
import subprocess, sys, numpy as np
arq, lim = sys.argv[1], float(sys.argv[2]) if len(sys.argv)>2 else 6
W,H,FPS=320,180,4
p=subprocess.Popen(["ffmpeg","-v","error","-i",arq,"-vf",f"fps={FPS},scale={W}:{H},format=gray","-f","rawvideo","-"],stdout=subprocess.PIPE)
ant=None;ini=0;ult=0;i=0
def fmt(s): return f"{int(s//60)}:{s%60:04.1f}"
while True:
    b=p.stdout.read(W*H)
    if len(b)<W*H: break
    im=np.frombuffer(b,np.uint8).astype(np.int16); t=i/FPS
    if ant is None: ant=im
    elif np.abs(im-ant).mean()>2.0:
        if ult-ini>=lim: print(f"{fmt(ini)}-{fmt(ult)} {ult-ini:.1f}s")
        ini=t; ant=im
    ult=t; i+=1
if ult-ini>=lim: print(f"{fmt(ini)}-{fmt(ult)} {ult-ini:.1f}s")
