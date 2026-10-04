import { useLayoutEffect, useRef, useState } from "react";
import { continueRender, delayRender, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { c, fontes } from "../tema";

// KIT VIVO — estilo criador de conteúdo (aprovado em 04/10/2026). Regras:
// • MUNDO 2× (3840×2160) + câmera por ENQUADRAMENTO de caixas com margem de 8%: nada corta na borda e o texto não
//   treme (a camada é rasterizada uma vez em alta resolução e só movida). Zoom liberado neste estilo.
// • Entradas com "pulo" (spring com leve ultrapassagem), traços à mão desenhados, cursor que clica, notas 3D.
// • Todas as coordenadas dos componentes são do MUNDO (2×). Frames relativos à cena.
export const W = 3840;
export const H = 2160;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.2, 1);
const src = (s: string) => (s.startsWith("http") ? s : staticFile(s));
const rnd = (i: number) => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const usePulo = (em: number, amort = 11, rig = 170) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - em, fps, config: { damping: amort, stiffness: rig } });
};

// ───────────────── Mundo + câmera ─────────────────
export type Caixa = [number, number, number, number]; // x, y, largura, altura no mundo
export type Plano = [number, Caixa]; // [frame, caixa a enquadrar]
const MARGEM = 0.08;
const encaixa = ([x, y, w, h]: Caixa) => {
  const z = Math.min(1920 / (w * (1 + 2 * MARGEM)), 1080 / (h * (1 + 2 * MARGEM))) / 0.5;
  return { x: x + w / 2, y: y + h / 2, z: Math.max(1, z) };
};
export const camera = (f: number, planos: Plano[]) => {
  if (planos.length === 1) return { ...encaixa(planos[0][1]), movendo: false };
  let i = 0;
  while (i < planos.length - 2 && f > planos[i + 1][0]) i++;
  const a = encaixa(planos[i][1]);
  const b = encaixa(planos[i + 1][1]);
  const k = interpolate(f, [planos[i][0], planos[i + 1][0]], [0, 1], { ...cl, easing: ease });
  const z = Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * k);
  const movendo = k > 0 && k < 1 && (a.x !== b.x || a.y !== b.y || a.z !== b.z);
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, z, movendo };
};
// Envolve a cena. `planos` = sequência de caixas a enquadrar (a câmera viaja suave entre elas). `respira` = deriva
// mínima contínua (0–0.03) para a tela nunca ficar parada.
export const Mundo: React.FC<{ planos: Plano[]; respira?: number; fundo?: boolean; children: React.ReactNode }> = ({ planos, respira = 0.015, fundo = true, children }) => {
  const f = useCurrentFrame();
  const cam = camera(f, planos);
  const z = cam.z * (1 + respira * Math.sin(f / 45));
  const s = 0.5 * z;
  const tx = 960 - (cam.x + Math.sin(f / 60) * 20) * s;
  const ty = 540 - cam.y * s;
  return (
    <div {...(cam.movendo ? { "data-camera-movendo": "" } : {})} style={{ position: "absolute", inset: 0, overflow: "hidden", backgroundColor: c.mesa }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate3d(${tx}px, ${ty}px, 0) scale(${s})`, willChange: "transform" }}>
        {fundo ? <div style={{ position: "absolute", left: -W, top: -H, width: W * 3, height: H * 3, backgroundColor: c.mesa, backgroundImage: `radial-gradient(${c.ponto} 3px, transparent 3px)`, backgroundSize: "80px 80px" }} /> : null}
        {children}
      </div>
    </div>
  );
};

// ───────────────── Adesivo (foto real) ─────────────────
export const Adesivo: React.FC<{ foto?: string; x: number; y: number; w: number; h: number; em: number; rot?: number; rotulo?: string; credito?: string; foco?: string; corRotulo?: string; children?: React.ReactNode }> = ({
  foto,
  x,
  y,
  w,
  h,
  em,
  rot = -3,
  rotulo,
  credito,
  foco = "50% 35%",
  corRotulo = c.marca,
  children,
}) => {
  const p = usePulo(em);
  return (
    <div data-foco={`adesivo: ${rotulo ?? foto ?? ""}`} style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: Math.min(1, p * 2), transform: `rotate(${rot + (1 - p) * 8}deg) scale(${0.6 + 0.4 * p})`, transformOrigin: "50% 60%" }}>
      <div style={{ position: "absolute", inset: 0, padding: 20, background: c.papel, borderRadius: 30, boxShadow: c.sombra }}>
        {foto ? <Img src={src(foto)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: foco, borderRadius: 16 }} /> : children}
      </div>
      {credito ? <div style={{ position: "absolute", right: 34, bottom: 30, padding: "4px 12px", borderRadius: 8, background: "rgba(0,0,0,0.6)", color: "#ddd", fontFamily: fontes.mono, fontSize: 24, whiteSpace: "nowrap" }}>{credito}</div> : null}
      {rotulo ? (
        <div style={{ position: "absolute", left: 36, bottom: -64, padding: "12px 30px", background: corRotulo, color: c.tinta, borderRadius: 14, fontFamily: fontes.titulo, fontSize: 58, letterSpacing: 1, transform: "rotate(2deg)", whiteSpace: "nowrap", boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }}>{rotulo}</div>
      ) : null}
    </div>
  );
};

// ───────────────── Tipografia cinética ─────────────────
export const PalavraGigante: React.FC<{ texto: string; x: number; y: number; em: number; cor?: string; tam?: number; ate?: number; circularEm?: number; marcarEm?: number }> = ({
  texto,
  x,
  y,
  em,
  cor = c.claro,
  tam = 240,
  ate,
  circularEm,
  marcarEm,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sai = ate !== undefined ? interpolate(f, [ate, ate + 10], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) }) : 0;
  const palavras = (
    <div style={{ display: "flex", gap: tam * 0.18, opacity: 1 - sai, transform: `translateY(${-sai * 160}px)` }}>
      {texto.split(" ").map((w, i) => {
        const p = spring({ frame: f - em - i * 3, fps, config: { damping: 12, stiffness: 180 } });
        return (
          <span key={i} style={{ display: "inline-block", fontFamily: fontes.titulo, fontSize: tam, lineHeight: 1.05, color: cor, whiteSpace: "nowrap", opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 120}px) rotate(${(1 - p) * -6}deg)`, textShadow: "0 10px 0 rgba(0,0,0,0.35)" }}>{w}</span>
        );
      })}
    </div>
  );
  let corpo = palavras;
  if (marcarEm !== undefined) corpo = <MarcaTexto em={marcarEm}>{corpo}</MarcaTexto>;
  if (circularEm !== undefined) corpo = <Circulado em={circularEm}>{corpo}</Circulado>;
  return <div data-foco={`palavra: ${texto}`} style={{ position: "absolute", left: x, top: y }}>{corpo}</div>;
};

// Texto manuscrito (anotação de caneta)
export const Anotacao: React.FC<{ texto: string; x: number; y: number; em: number; cor?: string; tam?: number; rot?: number }> = ({ texto, x, y, em, cor = c.marca, tam = 90, rot = -4 }) => {
  const f = useCurrentFrame();
  const n = Math.round(texto.length * interpolate(f, [em, em + Math.max(8, texto.length * 1.2)], [0, 1], cl));
  return (
    <div data-foco={`anotação: ${texto}`} style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, fontFamily: fontes.mao, fontWeight: 700, fontSize: tam, color: cor, whiteSpace: "nowrap", opacity: f >= em ? 1 : 0 }}>
      {texto.slice(0, n)}
    </div>
  );
};

// ───────────────── Caneta: círculo, marca-texto, seta, risco ─────────────────
const useMedida = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [tam, setTam] = useState<[number, number] | null>(null);
  const [handle] = useState(() => delayRender("medir elemento"));
  useLayoutEffect(() => {
    document.fonts.ready.then(() => {
      if (ref.current) setTam([ref.current.offsetWidth, ref.current.offsetHeight]);
      continueRender(handle);
    });
  }, [handle]);
  return { ref, tam };
};
export const Circulado: React.FC<{ em: number; cor?: string; folga?: number; children: React.ReactNode }> = ({ em, cor = c.vermelho, folga = 70, children }) => {
  const f = useCurrentFrame();
  const { ref, tam } = useMedida();
  const p = interpolate(f, [em, em + 14], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const w = (tam?.[0] ?? 0) + folga * 2;
  const h = (tam?.[1] ?? 0) + folga * 2.2;
  const d = `M ${w * 0.1} ${h * 0.42} C ${w * 0.04} ${h * 0.02}, ${w * 0.96} ${-h * 0.04}, ${w * 0.97} ${h * 0.5} C ${w * 0.98} ${h * 1.02}, ${w * 0.05} ${h * 1.03}, ${w * 0.03} ${h * 0.5} C ${w * 0.02} ${h * 0.28}, ${w * 0.18} ${h * 0.1}, ${w * 0.34} ${h * 0.06}`;
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {children}
      {tam ? (
        <svg width={w} height={h} style={{ position: "absolute", left: -folga, top: -folga * 1.1, overflow: "visible", pointerEvents: "none" }}>
          <path d={d} fill="none" stroke={cor} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        </svg>
      ) : null}
    </div>
  );
};
export const MarcaTexto: React.FC<{ em: number; cor?: string; children: React.ReactNode }> = ({ em, cor = c.marca, children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [em, em + 8], [0, 1], { ...cl, easing: Easing.out(Easing.quad) });
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ position: "absolute", left: -20, top: "38%", height: "52%", width: `calc(${p * 100}% + ${p * 40}px)`, background: cor, opacity: 0.6, borderRadius: 10, transform: "rotate(-1deg)" }} />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};
// Seta à mão de (x1,y1) até (x2,y2), curva, com ponta; desenha em 12 frames
export const SetaMao: React.FC<{ x1: number; y1: number; x2: number; y2: number; em: number; cor?: string; curva?: number; esp?: number }> = ({ x1, y1, x2, y2, em, cor = c.vermelho, curva = 0.25, esp = 14 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [em, em + 12], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const mx = (x1 + x2) / 2 - (y2 - y1) * curva;
  const my = (y1 + y2) / 2 + (x2 - x1) * curva;
  const ang = Math.atan2(y2 - my, x2 - mx);
  const a1 = ang + 2.6;
  const a2 = ang - 2.6;
  const L = 60;
  const ponta = `M ${x2 + Math.cos(a1) * L} ${y2 + Math.sin(a1) * L} L ${x2} ${y2} L ${x2 + Math.cos(a2) * L} ${y2 + Math.sin(a2) * L}`;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} fill="none" stroke={cor} strokeWidth={esp} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d={ponta} fill="none" stroke={cor} strokeWidth={esp} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0.92 ? 1 : 0} />
    </svg>
  );
};
// Risco (X ou traço por cima de algo)
export const Risco: React.FC<{ x: number; y: number; w: number; h: number; em: number; cor?: string; xis?: boolean }> = ({ x, y, w, h, em, cor = c.vermelho, xis = false }) => {
  const f = useCurrentFrame();
  const p1 = interpolate(f, [em, em + 8], [0, 1], cl);
  const p2 = interpolate(f, [em + 6, em + 14], [0, 1], cl);
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
      <path d={`M 0 ${h * 0.55} L ${w} ${h * 0.4}`} stroke={cor} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p1} />
      {xis ? <path d={`M 0 ${h * 0.1} L ${w} ${h * 0.9}`} stroke={cor} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p2} /> : null}
    </svg>
  );
};

// ───────────────── Cartões, etiquetas, selos, reações ─────────────────
export const Cartao: React.FC<{ x: number; y: number; w?: number; em: number; rot?: number; topo?: string; valor: string; base?: string; corValor?: string; acendeEm?: number }> = ({ x, y, w = 1100, em, rot = 2, topo, valor, base, corValor = c.tinta, acendeEm }) => {
  const f = useCurrentFrame();
  const p = usePulo(em, 13, 140);
  const aceso = acendeEm !== undefined && f >= acendeEm;
  return (
    <div data-foco={`cartão: ${valor}`} style={{ position: "absolute", left: x, top: y, width: w, padding: "46px 56px", borderRadius: 36, background: c.papel, color: c.tinta, transform: `rotate(${rot}deg) translateY(${(1 - p) * 200}px)`, opacity: Math.min(1, p * 2), boxShadow: c.sombra }}>
      {topo ? <div style={{ fontFamily: fontes.mono, fontWeight: 500, fontSize: 46, color: "#666", whiteSpace: "nowrap" }}>{topo}</div> : null}
      <div style={{ fontFamily: fontes.titulo, fontSize: 150, lineHeight: 1.05, color: aceso ? "#C98200" : corValor, whiteSpace: "nowrap" }}>{valor}</div>
      {base ? <div style={{ fontFamily: fontes.texto, fontWeight: 800, fontSize: 52, lineHeight: 1.2 }}>{base}</div> : null}
    </div>
  );
};
// Etiqueta de papel com fita: "LEGAL", "NÃO É CRIME", "SÓ SOBRENOME"…
export const Etiqueta: React.FC<{ texto: string; x: number; y: number; em: number; rot?: number; cor?: string }> = ({ texto, x, y, em, rot = -5, cor = c.verde }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - em, fps, config: { damping: 9, stiffness: 220 } });
  return (
    <div data-foco={`etiqueta: ${texto}`} style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) translateY(${(1 - p) * -120}px) scaleY(${0.9 + 0.1 * p})`, opacity: Math.min(1, p * 3) }}>
      <div style={{ position: "absolute", left: "50%", top: -26, width: 120, height: 44, marginLeft: -60, background: "rgba(255,255,230,0.75)", transform: "rotate(3deg)" }} />
      <div style={{ padding: "18px 40px", background: cor, color: "#fff", borderRadius: 10, fontFamily: fontes.titulo, fontSize: 72, letterSpacing: 2, whiteSpace: "nowrap", boxShadow: "0 12px 24px rgba(0,0,0,0.35)" }}>{texto}</div>
    </div>
  );
};
// Selo carimbado: CONFERIDO NO TSE (verde) ou SEGUNDO O LEVANTAMENTO (cinza). Mesmo tamanho.
export const Selo: React.FC<{ tipo: "conferido" | "levantamento"; x: number; y: number; em: number; rot?: number }> = ({ tipo, x, y, em, rot = -8 }) => {
  const f = useCurrentFrame();
  const bate = interpolate(f, [em, em + 4, em + 8], [1.6, 0.92, 1], cl);
  const cor = tipo === "conferido" ? c.verde : c.cinza;
  return (
    <div data-foco={`selo: ${tipo}`} style={{ position: "absolute", left: x, top: y, width: 560, height: 150, transform: `rotate(${rot}deg) scale(${bate})`, opacity: f >= em ? 1 : 0, border: `10px solid ${cor}`, borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, color: cor, fontFamily: fontes.titulo, fontSize: tipo === "conferido" ? 60 : 50, letterSpacing: 2, background: "rgba(21,24,29,0.85)", whiteSpace: "nowrap" }}>
      {tipo === "conferido" ? "✓ CONFERIDO NO TSE" : "SEGUNDO O LEVANTAMENTO"}
    </div>
  );
};
// Reação desenhada: ?, !, ✓, ✗
export const Reacao: React.FC<{ tipo: "?" | "!" | "ok" | "x"; x: number; y: number; em: number; tam?: number }> = ({ tipo, x, y, em, tam = 220 }) => {
  const p = usePulo(em, 8, 240);
  const f = useCurrentFrame();
  const cor = tipo === "ok" ? c.verde : tipo === "x" ? c.vermelho : c.marca;
  const txt = tipo === "ok" ? "✓" : tipo === "x" ? "✗" : tipo;
  return (
    <div data-foco={`reação ${tipo}`} style={{ position: "absolute", left: x, top: y, width: tam, height: tam, borderRadius: "50%", background: cor, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.titulo, fontSize: tam * 0.62, color: c.tinta, opacity: Math.min(1, p * 2), transform: `scale(${p}) rotate(${Math.sin((f - em) / 6) * 6}deg)`, boxShadow: "0 16px 30px rgba(0,0,0,0.4)" }}>
      {txt}
    </div>
  );
};

// ───────────────── Cursor ─────────────────
// Caminho de pontos [frame, x, y]; `cliques` = frames do clique (anel azul que expande).
export const Cursor: React.FC<{ caminho: [number, number, number][]; cliques?: number[] }> = ({ caminho, cliques = [] }) => {
  const f = useCurrentFrame();
  if (f < caminho[0][0]) return null;
  let i = 0;
  while (i < caminho.length - 2 && f > caminho[i + 1][0]) i++;
  const [f0, x0, y0] = caminho[i];
  const [f1, x1, y1] = caminho[Math.min(i + 1, caminho.length - 1)];
  const k = f1 === f0 ? 1 : interpolate(f, [f0, f1], [0, 1], { ...cl, easing: ease });
  const x = x0 + (x1 - x0) * k;
  const y = y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * 60;
  const ult = cliques.filter((q) => f >= q).pop();
  const aperta = ult !== undefined ? interpolate(f, [ult, ult + 3, ult + 8], [1, 0.82, 1], cl) : 1;
  const onda = ult !== undefined ? interpolate(f, [ult, ult + 20], [0, 1], cl) : 1;
  return (
    <>
      {ult !== undefined && onda < 1 ? <div style={{ position: "absolute", left: x - 100 * onda, top: y - 100 * onda, width: 200 * onda, height: 200 * onda, borderRadius: "50%", border: `8px solid ${c.azul}`, opacity: 1 - onda }} /> : null}
      <svg width={110} height={150} viewBox="0 0 24 32" style={{ position: "absolute", left: x, top: y, transform: `scale(${aperta})`, transformOrigin: "0 0", filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.5))" }}>
        <path d="M2 2 L2 26 L8 20 L12 30 L16 28 L12 18 L20 18 Z" fill="#111" stroke="#fff" strokeWidth={1.8} strokeLinejoin="round" />
      </svg>
    </>
  );
};

// ───────────────── Dinheiro 3D ─────────────────
export const Nota3D: React.FC<{ i: number; em: number; x: number; y: number; vx?: number; vy?: number }> = ({ i, em, x, y, vx = 5, vy = -2 }) => {
  const f = useCurrentFrame();
  const t = f - em - i * 3;
  if (t < 0) return null;
  const px = x + ((i * 397) % 600) + t * (vx + (i % 3));
  const py = y + ((i * 251) % 500) + t * (vy - (i % 2)) + Math.sin(t / 9 + i) * 30 + t * t * 0.02;
  return (
    <div style={{ position: "absolute", left: px, top: py, width: 300, height: 140, borderRadius: 14, background: "linear-gradient(135deg,#8fe0b3,#2fd08a)", border: `6px solid ${c.verdeEscuro}`, transform: `perspective(1200px) rotateY(${t * 6 + i * 40}deg) rotateZ(${Math.sin(t / 15 + i) * 25}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.titulo, fontSize: 70, color: "#0f4f33" }}>
      R$
    </div>
  );
};
export const ChuvaNotas: React.FC<{ em: number; x: number; y: number; n?: number; vx?: number; vy?: number }> = ({ em, x, y, n = 10, vx, vy }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <Nota3D key={i} i={i} em={em} x={x} y={y} vx={vx} vy={vy} />
    ))}
  </>
);
// Pilha de notas que cresce (escala de valor)
export const PilhaNotas: React.FC<{ x: number; y: number; em: number; n: number; rotulo?: string }> = ({ x, y, em, n, rotulo }) => {
  const f = useCurrentFrame();
  return (
    <div data-foco={`pilha: ${rotulo ?? n}`} style={{ position: "absolute", left: x, top: y, width: 340, height: 40 + n * 26 }}>
      {Array.from({ length: n }, (_, i) => {
        const p = interpolate(f, [em + i * 2, em + i * 2 + 8], [0, 1], { ...cl, easing: Easing.out(Easing.back(1.6)) });
        return <div key={i} style={{ position: "absolute", left: (rnd(i) - 0.5) * 30, bottom: i * 26, width: 320, height: 34, borderRadius: 6, background: "linear-gradient(90deg,#8fe0b3,#2fd08a)", border: `4px solid ${c.verdeEscuro}`, opacity: p, transform: `translateY(${(1 - p) * -300}px) rotate(${(rnd(i + 9) - 0.5) * 6}deg)` }} />;
      })}
      {rotulo ? <div style={{ position: "absolute", left: -100, right: -100, bottom: -110, textAlign: "center", fontFamily: fontes.titulo, fontSize: 80, color: c.claro, whiteSpace: "nowrap", opacity: interpolate(f, [em + n * 2, em + n * 2 + 8], [0, 1], cl) }}>{rotulo}</div> : null}
    </div>
  );
};

// ───────────────── Grafo de bolinhas (adesivos ligados por setas com moeda) ─────────────────
export type Bola = { id: string; x: number; y: number; rotulo: string; sub?: string; foto?: string; cor?: string; em: number; raio?: number; icone?: "pessoa" | "empresa" | "partido" };
export type Ligacao = { de: string; para: string; em: number; valor?: string; cor?: string; curva?: number };
export const GrafoBolinhas: React.FC<{ bolas: Bola[]; ligacoes: Ligacao[]; destaque?: { ids: string[]; em: number } }> = ({ bolas, ligacoes, destaque }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = Object.fromEntries(bolas.map((b) => [b.id, b]));
  const aceso = (id: string) => !!destaque && f >= destaque.em && destaque.ids.includes(id);
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {ligacoes.map((l, i) => {
          const A = m[l.de];
          const B = m[l.para];
          if (!A || !B) return null;
          const ra = (A.raio ?? 130) + 20;
          const rb = (B.raio ?? 130) + 40;
          const dx = B.x - A.x;
          const dy = B.y - A.y;
          const L = Math.hypot(dx, dy);
          const [ux, uy] = [dx / L, dy / L];
          const [x1, y1, x2, y2] = [A.x + ux * ra, A.y + uy * ra, B.x - ux * rb, B.y - uy * rb];
          const cv = l.curva ?? 0.15;
          const mx = (x1 + x2) / 2 - (y2 - y1) * cv;
          const my = (y1 + y2) / 2 + (x2 - x1) * cv;
          const p = interpolate(f, [l.em, l.em + 14], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
          const cor = destaque && f >= destaque.em && destaque.ids.includes(l.de) && destaque.ids.includes(l.para) ? c.vermelho : l.cor ?? c.verde;
          const q = p >= 1 ? (((f - l.em - 14) / 40) % 1 + 1) % 1 : -1;
          const bx = (1 - q) * (1 - q) * x1 + 2 * (1 - q) * q * mx + q * q * x2;
          const by = (1 - q) * (1 - q) * y1 + 2 * (1 - q) * q * my + q * q * y2;
          const ang = Math.atan2(y2 - my, x2 - mx);
          const ponta = `M ${x2 + Math.cos(ang + 2.6) * 50} ${y2 + Math.sin(ang + 2.6) * 50} L ${x2} ${y2} L ${x2 + Math.cos(ang - 2.6) * 50} ${y2 + Math.sin(ang - 2.6) * 50}`;
          const lx = 0.25 * x1 + 0.5 * mx + 0.25 * x2;
          const ly = 0.25 * y1 + 0.5 * my + 0.25 * y2;
          return (
            <g key={i}>
              <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} fill="none" stroke={cor} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
              {p > 0.92 ? <path d={ponta} fill="none" stroke={cor} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /> : null}
              {q >= 0 ? <circle cx={bx} cy={by} r={22} fill={c.marca} stroke={c.verdeEscuro} strokeWidth={5} /> : null}
              {l.valor && p > 0.6 ? (
                <g>
                  <rect x={lx - (l.valor.length * 26 + 50) / 2} y={ly - 46} width={l.valor.length * 26 + 50} height={92} rx={20} fill={c.papel} />
                  <text x={lx} y={ly + 20} textAnchor="middle" fontFamily={fontes.titulo} fontSize={60} fill={c.tinta}>
                    {l.valor}
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
      {bolas.map((b) => {
        const p = spring({ frame: f - b.em, fps, config: { damping: 10, stiffness: 200 } });
        const R = b.raio ?? 130;
        const cor = aceso(b.id) ? c.vermelho : b.cor ?? c.papel;
        return (
          <div key={b.id} data-foco={`bola: ${b.rotulo}`} style={{ position: "absolute", left: b.x - 300, top: b.y - R, width: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: Math.min(1, p * 2), transform: `scale(${0.5 + 0.5 * p})`, transformOrigin: `300px ${R}px` }}>
            <div style={{ width: R * 2, height: R * 2, borderRadius: "50%", background: cor, padding: 12, boxShadow: c.sombra }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#e9e9e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {b.foto ? (
                  <Img src={src(b.foto)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 25%" }} />
                ) : (
                  <svg width={R} height={R} viewBox="0 0 24 24">
                    {b.icone === "empresa" ? <path d="M3 21V8l6 3V8l6 3V4h6v17z" fill="#555" /> : b.icone === "partido" ? <path d="M3 10l9-6 9 6v1H3zM5 12h2v7H5zm4 0h2v7H9zm4 0h2v7h-2zm4 0h2v7h-2zM3 20h18v2H3z" fill="#555" /> : <><circle cx="12" cy="8" r="4.5" fill="#555" /><path d="M3 22c0-5 4-8 9-8s9 3 9 8z" fill="#555" /></>}
                  </svg>
                )}
              </div>
            </div>
            <div style={{ fontFamily: fontes.titulo, fontSize: 62, color: c.claro, whiteSpace: "nowrap", textShadow: "0 4px 10px rgba(0,0,0,0.7)" }}>{b.rotulo}</div>
            {b.sub ? <div style={{ fontFamily: fontes.texto, fontWeight: 800, fontSize: 40, color: c.cinza, whiteSpace: "nowrap", marginTop: -10 }}>{b.sub}</div> : null}
          </div>
        );
      })}
    </>
  );
};

// ───────────────── Tela redesenhada (janela de navegador genérica, branca) ─────────────────
export const Janela: React.FC<{ x: number; y: number; w: number; h: number; em: number; titulo?: string; children: React.ReactNode; rot?: number }> = ({ x, y, w, h, em, titulo = "dados abertos", children, rot = -1.5 }) => {
  const p = usePulo(em, 14, 150);
  return (
    <div data-foco={`janela: ${titulo}`} style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 30, overflow: "hidden", background: c.papel, boxShadow: c.sombra, transform: `rotate(${rot}deg) translateY(${(1 - p) * 220}px)`, opacity: Math.min(1, p * 2) }}>
      <div style={{ height: 90, background: "#ECECEC", display: "flex", alignItems: "center", gap: 18, padding: "0 34px" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((k) => (
          <div key={k} style={{ width: 26, height: 26, borderRadius: 13, background: k }} />
        ))}
        <div style={{ marginLeft: 30, flex: 1, height: 52, borderRadius: 26, background: "#fff", display: "flex", alignItems: "center", padding: "0 30px", fontFamily: fontes.mono, fontSize: 32, color: "#666", whiteSpace: "nowrap", overflow: "hidden" }}>{titulo}</div>
      </div>
      <div style={{ position: "relative", padding: 50, color: c.tinta }}>{children}</div>
    </div>
  );
};
// Linhas de planilha que entram (dentro da Janela)
export const Linhas: React.FC<{ linhas: string[][]; em: number; larguras: number[]; destaque?: number; destaqueEm?: number; tam?: number }> = ({ linhas, em, larguras, destaque, destaqueEm = 0, tam = 40 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {linhas.map((l, j) => {
        const p = interpolate(f, [em + j * 2, em + j * 2 + 8], [0, 1], cl);
        const ac = destaque === j && f >= destaqueEm;
        return (
          <div key={j} style={{ display: "flex", padding: "12px 16px", borderRadius: 10, opacity: p, transform: `translateX(${(1 - p) * 60}px)`, background: ac ? "rgba(255,212,59,0.7)" : j === 0 ? "#F2F2F2" : "transparent", fontFamily: fontes.mono, fontWeight: j === 0 ? 600 : 500, fontSize: tam }}>
            {l.map((v, i) => (
              <div key={i} style={{ width: larguras[i], whiteSpace: "nowrap", overflow: "hidden" }}>{v}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

// ───────────────── Contador que pula ─────────────────
export const Numero: React.FC<{ valor: number; x: number; y: number; em: number; prefixo?: string; sufixo?: string; tam?: number; cor?: string; dur?: number; legenda?: string }> = ({ valor, x, y, em, prefixo = "", sufixo = "", tam = 300, cor = c.claro, dur = 40, legenda }) => {
  const f = useCurrentFrame();
  const p = usePulo(em);
  const k = interpolate(f, [em, em + dur], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const n = Math.round(valor * k).toLocaleString("pt-BR");
  return (
    <div data-foco={`número: ${valor}`} style={{ position: "absolute", left: x, top: y, opacity: Math.min(1, p * 2), transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: "0 50%" }}>
      <div style={{ fontFamily: fontes.titulo, fontSize: tam, lineHeight: 1, color: cor, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", textShadow: "0 12px 0 rgba(0,0,0,0.35)" }}>
        {prefixo}
        {n}
        {sufixo}
      </div>
      {legenda ? <div style={{ fontFamily: fontes.texto, fontWeight: 800, fontSize: tam * 0.2, color: c.cinza, whiteSpace: "nowrap", marginTop: 10 }}>{legenda}</div> : null}
    </div>
  );
};
