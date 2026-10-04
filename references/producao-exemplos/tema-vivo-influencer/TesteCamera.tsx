import { useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { c, fontes } from "../tema";

// AMOSTRA (20 s) do estilo novo "influencer": câmera viva (aproximar/afastar/deslizar suaves), fotos-adesivo com pulo,
// círculo desenhado à mão, tipografia cinética, cursor que clica, notas voando em 3D.
// Câmera sem tremor: o mundo é desenhado em 2× (3840×2160) e a câmera só reduz (escala ≤ 1), numa camada
// will-change: transform. Assim o navegador rasteriza uma vez em alta resolução e só move a imagem: o texto não "pula".
const W = 3840;
const H = 2160;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.2, 1);

// CÂMERA POR ENQUADRAMENTO: cada plano diz a CAIXA do mundo que tem de caber inteira na tela (x, y, largura, altura),
// com margem de 8%. O zoom e o centro saem da caixa, então nada fica cortado na borda.
type Caixa = [number, number, number, number];
const PLANOS: [number, Caixa][] = [
  [0, [0, 0, W, H]],
  [70, [250, 180, 1800, 1560]], // título + urna
  [150, [250, 180, 1800, 1560]],
  [220, [2200, 200, 1250, 1500]], // TSE + cartão do R$ 69
  [330, [2200, 200, 1250, 1500]],
  [420, [0, 0, W, H]],
  [600, [0, 0, W, H]],
];
const MARGEM = 0.08;
const encaixa = ([x, y, w, h]: Caixa) => {
  const z = Math.min(1920 / (w * (1 + 2 * MARGEM)), 1080 / (h * (1 + 2 * MARGEM))) / 0.5;
  return { x: x + w / 2, y: y + h / 2, z: Math.max(1, z) };
};
const camera = (f: number) => {
  let i = 0;
  while (i < PLANOS.length - 2 && f > PLANOS[i + 1][0]) i++;
  const a = encaixa(PLANOS[i][1]);
  const b = encaixa(PLANOS[i + 1][1]);
  const k = interpolate(f, [PLANOS[i][0], PLANOS[i + 1][0]], [0, 1], { ...cl, easing: ease });
  // zoom interpolado em escala logarítmica: aproximar e afastar com velocidade constante para o olho
  const z = Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * k);
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, z };
};

const Adesivo: React.FC<{ src: string; x: number; y: number; w: number; h: number; em: number; rot?: number; rotulo?: string }> = ({ src, x, y, w, h, em, rot = -3, rotulo }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - em, fps, config: { damping: 11, stiffness: 160 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: Math.min(1, p * 2), transform: `rotate(${rot + (1 - p) * 8}deg) scale(${0.6 + 0.4 * p})`, transformOrigin: "50% 60%" }}>
      <div style={{ position: "absolute", inset: 0, padding: 22, background: "#fff", borderRadius: 34, boxShadow: "0 40px 80px rgba(0,0,0,0.55)" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18 }} />
      </div>
      {rotulo ? (
        <div style={{ position: "absolute", left: 40, bottom: -70, padding: "14px 34px", background: c.ambar, color: "#111", borderRadius: 16, fontFamily: fontes.titulo, fontWeight: 900, fontSize: 64, transform: "rotate(2deg)", whiteSpace: "nowrap" }}>{rotulo}</div>
      ) : null}
    </div>
  );
};

// CÍRCULO À MÃO que ENVOLVE o filho: mede a caixa real do conteúdo (depois das fontes carregarem) e desenha a
// elipse irregular em pixels de verdade, com folga. Sempre circula a palavra certa, sem falhas no traço.
const Circulado: React.FC<{ em: number; cor?: string; folga?: number; children: React.ReactNode }> = ({ em, cor = c.ambar, folga = 70, children }) => {
  const f = useCurrentFrame();
  const ref = useRef<HTMLDivElement>(null);
  const [tam, setTam] = useState<[number, number] | null>(null);
  const [handle] = useState(() => delayRender("medir palavra circulada"));
  useLayoutEffect(() => {
    document.fonts.ready.then(() => {
      if (ref.current) setTam([ref.current.offsetWidth, ref.current.offsetHeight]);
      continueRender(handle);
    });
  }, [handle]);
  const p = interpolate(f, [em, em + 16], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const w = (tam?.[0] ?? 0) + folga * 2;
  const h = (tam?.[1] ?? 0) + folga * 2.2;
  const d = `M ${w * 0.1} ${h * 0.42} C ${w * 0.04} ${h * 0.02}, ${w * 0.96} ${-h * 0.04}, ${w * 0.97} ${h * 0.5} C ${w * 0.98} ${h * 1.02}, ${w * 0.05} ${h * 1.03}, ${w * 0.03} ${h * 0.5} C ${w * 0.02} ${h * 0.28}, ${w * 0.18} ${h * 0.1}, ${w * 0.34} ${h * 0.06}`;
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {children}
      {tam ? (
        <svg width={w} height={h} style={{ position: "absolute", left: -folga, top: -folga * 1.1, overflow: "visible" }}>
          <path d={d} fill="none" stroke={cor} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        </svg>
      ) : null}
    </div>
  );
};

const PalavraGigante: React.FC<{ texto: string; x: number; y: number; em: number; cor?: string; tam?: number; circularEm?: number }> = ({ texto, x, y, em, cor = c.claro, tam = 260, circularEm }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palavras = (
    <div style={{ display: "flex", gap: 40 }}>
      {texto.split(" ").map((w, i) => {
        const p = spring({ frame: f - em - i * 4, fps, config: { damping: 12, stiffness: 180 } });
        return (
          <span key={i} style={{ display: "inline-block", fontFamily: fontes.titulo, fontWeight: 900, fontSize: tam, lineHeight: 1, color: cor, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 120}px) rotate(${(1 - p) * -6}deg)`, textShadow: "0 12px 0 rgba(0,0,0,0.35)" }}>{w}</span>
        );
      })}
    </div>
  );
  return <div style={{ position: "absolute", left: x, top: y }}>{circularEm !== undefined ? <Circulado em={circularEm}>{palavras}</Circulado> : palavras}</div>;
};

const Nota: React.FC<{ i: number; em: number }> = ({ i, em }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f - em - i * 3);
  const x = 2300 + ((i * 397) % 1200) + t * (4 + (i % 3));
  const y = 300 + ((i * 251) % 900) - t * (2 + (i % 2)) + Math.sin(t / 9 + i) * 30;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 300, height: 140, borderRadius: 14, background: "linear-gradient(135deg,#7fd6a6,#2fd08a)", border: "6px solid #1b7a50", opacity: f > em + i * 3 ? 1 : 0, transform: `perspective(1200px) rotateY(${t * 6 + i * 40}deg) rotateZ(${Math.sin(t / 15 + i) * 25}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.titulo, fontWeight: 900, fontSize: 70, color: "#0f4f33" }}>
      R$
    </div>
  );
};

const Cursor: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [230, 280, 300], [3500, 2900, 2900], { ...cl, easing: ease });
  const y = interpolate(f, [230, 280, 300], [1900, 1350, 1350], { ...cl, easing: ease });
  const clique = interpolate(f, [282, 288, 296], [1, 0.82, 1], cl);
  const onda = interpolate(f, [286, 310], [0, 1], cl);
  return (
    <>
      <div style={{ position: "absolute", left: 2900 - 90 * onda, top: 1350 - 90 * onda, width: 180 * onda, height: 180 * onda, borderRadius: "50%", border: `8px solid ${c.ambar}`, opacity: f > 286 ? 1 - onda : 0 }} />
      <svg width={120} height={160} viewBox="0 0 24 32" style={{ position: "absolute", left: x, top: y, transform: `scale(${clique})`, transformOrigin: "0 0", opacity: f > 225 ? 1 : 0, filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.5))" }}>
        <path d="M2 2 L2 26 L8 20 L12 30 L16 28 L12 18 L20 18 Z" fill="#fff" stroke="#111" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </>
  );
};

const Cartao: React.FC<{ em: number }> = ({ em }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - em, fps, config: { damping: 13, stiffness: 140 } });
  const aceso = f > 288;
  return (
    <div style={{ position: "absolute", left: 2250, top: 900, width: 1100, padding: "50px 60px", borderRadius: 40, background: "#fff", color: "#111", transform: `rotate(2deg) translateY(${(1 - p) * 200}px)`, opacity: Math.min(1, p * 2), boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
      <div style={{ fontFamily: fontes.mono, fontSize: 50, color: "#666" }}>doação declarada</div>
      <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 150, color: aceso ? "#c98200" : "#111" }}>R$ 69,10</div>
      <div style={{ fontFamily: fontes.texto, fontWeight: 700, fontSize: 54 }}>volta para o partido</div>
    </div>
  );
};

export const DURACAO_TESTE = 600;
export const TesteCamera: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camera(f);
  // escala da tela = 0.5 (mundo 2× → 1080p) × zoom
  const s = 0.5 * cam.z;
  const tx = 960 - cam.x * s;
  const ty = 540 - cam.y * s;
  return (
    <AbsoluteFill style={{ backgroundColor: "#15181d", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate3d(${tx}px, ${ty}px, 0) scale(${s})`, willChange: "transform" }}>
        {/* fundo do mundo: papel quadriculado escuro */}
        <div style={{ position: "absolute", inset: 0, backgroundColor: "#15181d", backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 3px, transparent 3px)", backgroundSize: "80px 80px" }} />
        <PalavraGigante texto="SIGA O" x={350} y={260} em={6} />
        <PalavraGigante texto="DINHEIRO" x={350} y={540} em={14} cor={c.dinheiro} tam={300} circularEm={110} />
        <Adesivo src="fotos/urna1.jpg" x={500} y={900} w={1150} h={760} em={40} rot={-4} rotulo="ELEIÇÕES 2026" />
        {Array.from({ length: 10 }, (_, i) => (
          <Nota key={i} i={i} em={150} />
        ))}
        <Cartao em={225} />
        <Cursor />
        <Adesivo src="fotos/tse1.jpg" x={2300} y={250} w={900} h={560} em={200} rot={3} rotulo="TSE" />
        <PalavraGigante texto="NÃO É ESQUEMA" x={1050} y={1800} em={350} cor={c.ambar} tam={200} />
      </div>
    </AbsoluteFill>
  );
};
