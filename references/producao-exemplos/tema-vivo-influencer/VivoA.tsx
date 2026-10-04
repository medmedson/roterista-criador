import { useMemo } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import mapa from "../data/mapa.json";
import { c, fontes, ms } from "../tema";
import { Caixa, Plano } from "./KitVivo";
import { Efeito } from "./Trilha";

// Auxiliares dos blocos 01–04 (agente vivoA). Complementam o KitVivo sem alterá-lo. Coordenadas do MUNDO (2×).
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (i: number) => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const usePulo = (em: number, amort = 11, rig = 170) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - em, fps, config: { damping: amort, stiffness: rig } });
};

// ───────── tempo amarrado à fala ─────────
type Cue = { de: number; ate: number; texto: string };
export const tempos = (C: Cue[], nome: string) => {
  const t = (i: number) => ms(C[i].de);
  const fim = (i: number) => ms(C[i].ate);
  const em = (i: number, trecho: string) => {
    const x = C[i];
    const k = x.texto.indexOf(trecho);
    if (k < 0) throw new Error(`${nome}: trecho não achado na fala ${i}: ${trecho}`);
    return ms(x.de + ((x.ate - x.de) * k) / x.texto.length);
  };
  return { t, fim, em, DURACAO: fim(C.length - 1) + 20 };
};

// Câmera: caixa inicial + lista de [frame em que começa a ir, nova caixa]; cada viagem dura T frames.
export const viagem = (inicio: Caixa, passos: [number, Caixa, number?][], T = 24): Plano[] => {
  const p: Plano[] = [[0, inicio]];
  let ant = inicio;
  for (const [f, cx, dur] of passos) {
    p.push([f, ant]);
    p.push([f + (dur ?? T), cx]);
    ant = cx;
  }
  return p;
};

// Som curto
export const Som: React.FC<{ a: string; em: number; v?: number }> = ({ a, em, v = 0.4 }) => <Efeito arquivo={`sfx/${a}.mp3`} em={Math.max(0, em)} volume={v} />;

// Some depois de `ate` (dissolve em `dur` frames). Use quando a câmera sai do trecho.
export const Vida: React.FC<{ ate: number; dur?: number; children: React.ReactNode }> = ({ ate, dur = 10, children }) => {
  const f = useCurrentFrame();
  if (f > ate + dur) return null;
  const o = interpolate(f, [ate, ate + dur], [1, 0], cl);
  return <div style={{ position: "absolute", left: 0, top: 0, opacity: o }}>{children}</div>;
};

// Folha de papel com pulo (cartão branco, post-it amarelo, papel pautado)
export const Papel: React.FC<{ x: number; y: number; w: number; h: number; em: number; foco: string; rot?: number; cor?: string; pauta?: boolean; children?: React.ReactNode; vem?: "cima" | "baixo" | "esquerda" }> = ({
  x,
  y,
  w,
  h,
  em,
  foco,
  rot = -2,
  cor = c.papel,
  pauta = false,
  children,
  vem = "baixo",
}) => {
  const p = usePulo(em, 13, 150);
  const d = (1 - p) * 260;
  const tr = vem === "cima" ? `translateY(${-d}px)` : vem === "esquerda" ? `translateX(${-d * 2}px)` : `translateY(${d}px)`;
  return (
    <div data-foco={foco} style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, background: cor, boxShadow: c.sombra, opacity: Math.min(1, p * 2), transform: `${tr} rotate(${rot}deg)`, overflow: "visible", backgroundImage: pauta ? "repeating-linear-gradient(transparent 0 78px, rgba(45,91,216,0.25) 78px 82px)" : undefined, backgroundPosition: "0 40px" }}>
      {children}
    </div>
  );
};

// Texto simples (dentro de Papel ou na mesa)
export const Txt: React.FC<{ children: React.ReactNode; tam?: number; cor?: string; f?: "titulo" | "mao" | "texto" | "mono"; peso?: number; style?: React.CSSProperties }> = ({ children, tam = 60, cor = c.tinta, f = "texto", peso = 800, style }) => (
  <div style={{ fontFamily: fontes[f], fontSize: tam, fontWeight: f === "titulo" ? 400 : peso, color: cor, lineHeight: 1.15, whiteSpace: "nowrap", ...style }}>{children}</div>
);

// Escreve à mão aos poucos (para usar DENTRO de outro elemento; sem data-foco)
export const Escreve: React.FC<{ texto: string; em: number; tam?: number; cor?: string; style?: React.CSSProperties }> = ({ texto, em, tam = 80, cor = c.tinta, style }) => {
  const f = useCurrentFrame();
  const n = Math.round(texto.length * interpolate(f, [em, em + Math.max(8, texto.length * 1.1)], [0, 1], cl));
  return <div style={{ fontFamily: fontes.mao, fontWeight: 700, fontSize: tam, color: cor, whiteSpace: "nowrap", lineHeight: 1.1, opacity: f >= em ? 1 : 0, ...style }}>{texto.slice(0, n) || " "}</div>;
};

// ───────── Ícones desenhados (adesivo redondo/quadrado com desenho) ─────────
const estrela = (n: number, r1: number, r2: number) =>
  Array.from({ length: n * 2 }, (_, i) => {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const r = i % 2 ? r2 : r1;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");
export const engrenagemD = (dentes = 10, r1 = 42, r2 = 32) => {
  const pts: string[] = [];
  for (let i = 0; i < dentes; i++) {
    const a0 = (2 * Math.PI * i) / dentes;
    const s = (2 * Math.PI) / dentes;
    for (const [k, r] of [[0, r2], [0.18, r1], [0.5, r1], [0.68, r2]] as [number, number][]) pts.push(`${50 + r * Math.cos(a0 + k * s)},${50 + r * Math.sin(a0 + k * s)}`);
  }
  return `M ${pts.join(" L ")} Z`;
};
export type NomeIcone = "distintivo" | "martelo" | "engrenagem" | "lupa" | "pessoa" | "predio" | "banco" | "regua" | "pessoaEmpresa" | "jornal" | "pasta" | "cifrao";
const Desenho: React.FC<{ nome: NomeIcone; giro?: number }> = ({ nome, giro = 0 }) => {
  const t = c.tinta;
  switch (nome) {
    case "distintivo":
      return (
        <g>
          <polygon points={estrela(6, 44, 30)} fill="#F2C14E" stroke={t} strokeWidth={3.5} strokeLinejoin="round" />
          <circle cx={50} cy={50} r={17} fill="#fff" stroke={t} strokeWidth={3} />
          <polygon points={estrela(5, 11, 5)} fill={t} />
        </g>
      );
    case "martelo":
      return (
        <g stroke={t} strokeWidth={3.5} strokeLinejoin="round">
          <g transform="rotate(-35 50 45)">
            <rect x={24} y={22} width={52} height={22} rx={5} fill="#B5713A" />
            <rect x={46} y={44} width={8} height={44} rx={3} fill="#D99A5B" />
          </g>
          <rect x={14} y={80} width={46} height={10} rx={3} fill="#B5713A" />
        </g>
      );
    case "engrenagem":
      return (
        <g transform={`rotate(${giro} 50 50)`}>
          <path d={engrenagemD()} fill={c.cinza} stroke={t} strokeWidth={3} strokeLinejoin="round" />
          <circle cx={50} cy={50} r={12} fill="#fff" stroke={t} strokeWidth={3} />
        </g>
      );
    case "lupa":
      return (
        <g stroke={t} strokeWidth={5} strokeLinecap="round">
          <line x1={62} y1={62} x2={86} y2={86} strokeWidth={10} />
          <circle cx={42} cy={42} r={26} fill="rgba(160,210,255,0.5)" />
        </g>
      );
    case "pessoa":
      return (
        <g fill="#555">
          <circle cx={50} cy={34} r={18} />
          <path d="M14 92c0-22 16-36 36-36s36 14 36 36z" />
        </g>
      );
    case "predio":
      return (
        <g stroke={t} strokeWidth={3}>
          <rect x={22} y={14} width={56} height={78} fill="#C9D3E0" />
          {[0, 1, 2, 3].map((r) => [0, 1, 2].map((k) => <rect key={`${r}${k}`} x={30 + k * 15} y={22 + r * 15} width={9} height={9} fill={t} stroke="none" />))}
          <rect x={42} y={78} width={16} height={14} fill={t} />
        </g>
      );
    case "banco":
      return <path d="M10 38l40-24 40 24v6H10zM18 48h8v32h-8zm18 0h8v32h-8zm18 0h8v32h-8zm18 0h8v32h-8zM10 84h80v8H10z" fill="#555" />;
    case "regua":
      return (
        <g>
          <g transform="rotate(-20 50 50)">
            <rect x={6} y={40} width={70} height={20} rx={3} fill="#F2C14E" stroke={t} strokeWidth={3} />
            {[0, 1, 2, 3, 4, 5, 6].map((k) => <line key={k} x1={12 + k * 10} y1={40} x2={12 + k * 10} y2={k % 2 ? 47 : 51} stroke={t} strokeWidth={2.5} />)}
          </g>
          <polygon points={estrela(8, 16, 7).split(" ").map((p) => p.split(",").map(Number)).map(([a, b]) => `${a + 30},${b - 28}`).join(" ")} fill={c.vermelho} />
        </g>
      );
    case "pessoaEmpresa":
      return (
        <g>
          <circle cx={22} cy={36} r={10} fill="#555" />
          <path d="M4 70c0-14 8-22 18-22s18 8 18 22z" fill="#555" />
          <path d="M42 50 L58 50" stroke={c.verde} strokeWidth={5} strokeLinecap="round" />
          <path d="M52 43 L60 50 L52 57" stroke={c.verde} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x={64} y={24} width={30} height={50} fill="#C9D3E0" stroke={t} strokeWidth={3} />
          {[0, 1, 2].map((r) => <rect key={r} x={71} y={31 + r * 13} width={16} height={6} fill={t} />)}
        </g>
      );
    case "jornal":
      return (
        <g stroke={t} strokeWidth={3}>
          <rect x={10} y={18} width={80} height={64} rx={3} fill="#F4F1E8" />
          <rect x={18} y={26} width={64} height={12} fill={t} stroke="none" />
          <rect x={18} y={44} width={28} height={30} fill="#C9C3B5" stroke="none" />
          {[0, 1, 2, 3].map((k) => <line key={k} x1={52} y1={47 + k * 8} x2={82} y2={47 + k * 8} strokeWidth={2.5} />)}
        </g>
      );
    case "pasta":
      return (
        <g stroke={t} strokeWidth={3} strokeLinejoin="round">
          <path d="M10 28h28l6 8h46v50H10z" fill="#E7B24A" />
          <rect x={30} y={16} width={36} height={34} fill="#fff" transform="rotate(6 48 33)" />
          <path d="M10 42h80v44H10z" fill="#F2C14E" />
        </g>
      );
    case "cifrao":
      return <text x={50} y={74} textAnchor="middle" fontFamily={fontes.titulo} fontSize={70} fill={c.verdeEscuro}>R$</text>;
  }
};
export const Icone: React.FC<{ nome: NomeIcone; x: number; y: number; tam: number; em: number; foco?: string; fundo?: string; redondo?: boolean; rot?: number; giro?: number }> = ({ nome, x, y, tam, em, foco, fundo = c.papel, redondo = true, rot = 0, giro = 0 }) => {
  const p = usePulo(em, 10, 200);
  return (
    <div data-foco={foco ?? `ícone: ${nome}`} style={{ position: "absolute", left: x, top: y, width: tam, height: tam, borderRadius: redondo ? "50%" : tam * 0.14, background: fundo, boxShadow: c.sombra, padding: tam * 0.1, opacity: Math.min(1, p * 2), transform: `scale(${0.5 + 0.5 * p}) rotate(${rot + (1 - p) * 10}deg)` }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <Desenho nome={nome} giro={giro} />
      </svg>
    </div>
  );
};

// Programador de costas, no notebook, de madrugada (silhueta desenhada; sem imagem de pessoa real)
export const Programador: React.FC<{ x: number; y: number; w: number; em: number }> = ({ x, y, w, em }) => {
  const f = useCurrentFrame();
  const p = usePulo(em, 13, 150);
  const h = w * 0.62;
  const brilho = 0.75 + 0.25 * Math.sin(f / 7);
  return (
    <div data-foco="programador (silhueta)" style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 30, background: c.papel, padding: 18, boxShadow: c.sombra, opacity: Math.min(1, p * 2), transform: `rotate(2deg) translateY(${(1 - p) * 200}px)` }}>
      <svg viewBox="0 0 160 100" width="100%" height="100%" style={{ borderRadius: 16, display: "block" }}>
        <rect width={160} height={100} fill="#1E2A44" />
        <circle cx={22} cy={18} r={8} fill="#F4EBC8" />
        <circle cx={26} cy={15} r={7} fill="#1E2A44" />
        {[[50, 12], [70, 22], [140, 10], [110, 18]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={0.9} fill="#fff" opacity={0.7} />)}
        <polygon points="118,30 100,82 150,82" fill="#FFD43B" opacity={0.22 * brilho} />
        <path d="M140 84 L132 40 L120 28" stroke="#C9D3E0" strokeWidth={2.5} fill="none" />
        <path d="M112 24 L126 24 L122 34 L114 34 Z" fill="#F2C14E" transform="rotate(-25 119 29)" />
        <polygon points="62,52 100,52 104,80 58,80" fill="#B9C2CF" />
        <rect x={68} y={56} width={30} height={20} fill="#9FD8FF" opacity={0.25 * brilho} />
        <rect x={0} y={80} width={160} height={20} fill="#3B2F2A" />
        <circle cx={44} cy={46} r={11} fill="#0B0F18" />
        <path d="M22 82 C22 62, 32 58, 44 58 C56 58, 66 62, 66 82 Z" fill="#0B0F18" />
        <path d="M60 70 L70 76" stroke="#0B0F18" strokeWidth={5} strokeLinecap="round" />
      </svg>
    </div>
  );
};

// Urna estilizada (caixa com fenda), leve 3D
export const Urna: React.FC<{ x: number; y: number; w: number; em: number }> = ({ x, y, w, em }) => {
  const p = usePulo(em, 12, 160);
  const f = useCurrentFrame();
  return (
    <div data-foco="urna" style={{ position: "absolute", left: x, top: y, width: w, height: w * 1.05, opacity: Math.min(1, p * 2), transform: `scale(${0.6 + 0.4 * p}) rotate(${Math.sin(f / 40) * 2}deg)` }}>
      <svg viewBox="0 0 100 105" width="100%" height="100%" style={{ overflow: "visible", filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.5))" }}>
        <polygon points="10,30 50,14 90,30 50,46" fill="#F4F4F2" stroke={c.tinta} strokeWidth={2.5} strokeLinejoin="round" />
        <polygon points="36,29 50,23 64,29 50,35" fill={c.tinta} />
        <polygon points="10,30 50,46 50,100 10,84" fill="#D7DCE3" stroke={c.tinta} strokeWidth={2.5} strokeLinejoin="round" />
        <polygon points="90,30 50,46 50,100 90,84" fill="#B9C2CF" stroke={c.tinta} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M20 62 l8 6 l12 -16" stroke={c.verdeEscuro} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// Pasta de arquivo com etiqueta (cai na mesa)
export const Pasta: React.FC<{ x: number; y: number; w: number; em: number; titulo: string; sub?: string; abreEm?: number; rot?: number }> = ({ x, y, w, em, titulo, sub, abreEm, rot = -3 }) => {
  const f = useCurrentFrame();
  const p = usePulo(em, 12, 170);
  const h = w * 0.7;
  const ab = abreEm !== undefined ? interpolate(f, [abreEm, abreEm + 12], [0, 1], { ...cl, easing: Easing.out(Easing.back(1.5)) }) : 0;
  return (
    <div data-foco={`pasta: ${titulo}`} style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * -500}px) rotate(${rot + (1 - p) * -12}deg)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w * 0.38, height: h * 0.2, background: "#D9A13B", borderRadius: "18px 18px 0 0" }} />
      <div style={{ position: "absolute", left: w * 0.08, top: h * 0.06 - ab * h * 0.22, width: w * 0.84, height: h * 0.6, background: "#fff", borderRadius: 8, transform: `rotate(${ab * -5}deg)`, boxShadow: "0 6px 12px rgba(0,0,0,0.2)" }} />
      <div style={{ position: "absolute", left: 0, top: h * 0.16, width: w, height: h * 0.84, background: "#F2C14E", borderRadius: "0 18px 18px 18px", boxShadow: c.sombra, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, transformOrigin: "50% 100%", transform: `perspective(1600px) rotateX(${ab * 18}deg)` }}>
        <div style={{ background: c.papel, padding: "14px 30px", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: w * 0.92 }}>
          <Txt tam={w * 0.07} f="titulo">{titulo}</Txt>
          {sub ? <Txt tam={w * 0.045} cor="#555">{sub}</Txt> : null}
        </div>
      </div>
    </div>
  );
};

// Elipse desenhada à mão em volta de uma área (sem medir)
export const ElipseMao: React.FC<{ x: number; y: number; w: number; h: number; em: number; cor?: string; esp?: number; dur?: number }> = ({ x, y, w, h, em, cor = c.vermelho, esp = 16, dur = 16 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [em, em + dur], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const d = `M ${w * 0.1} ${h * 0.42} C ${w * 0.04} ${h * 0.02}, ${w * 0.96} ${-h * 0.04}, ${w * 0.97} ${h * 0.5} C ${w * 0.98} ${h * 1.02}, ${w * 0.05} ${h * 1.03}, ${w * 0.03} ${h * 0.5} C ${w * 0.02} ${h * 0.28}, ${w * 0.18} ${h * 0.1}, ${w * 0.34} ${h * 0.06}`;
  if (f < em) return null;
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: x, top: y, overflow: "visible", pointerEvents: "none" }}>
      <path d={d} fill="none" stroke={cor} strokeWidth={esp} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

// Contador com casas decimais (formato brasileiro)
export const Contador: React.FC<{ valor: number; casas?: number; x: number; y: number; em: number; prefixo?: string; sufixo?: string; tam?: number; cor?: string; dur?: number; legenda?: string; foco?: string }> = ({
  valor,
  casas = 0,
  x,
  y,
  em,
  prefixo = "",
  sufixo = "",
  tam = 220,
  cor = c.claro,
  dur = 36,
  legenda,
  foco,
}) => {
  const f = useCurrentFrame();
  const p = usePulo(em);
  const k = interpolate(f, [em, em + dur], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const n = (valor * k).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  return (
    <div data-foco={foco ?? `contador: ${valor}`} style={{ position: "absolute", left: x, top: y, opacity: Math.min(1, p * 2), transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: "0 50%" }}>
      <div style={{ fontFamily: fontes.titulo, fontSize: tam, lineHeight: 1.05, color: cor, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", textShadow: "0 10px 0 rgba(0,0,0,0.35)" }}>
        {prefixo}
        {n}
        {sufixo}
      </div>
      {legenda ? <div style={{ fontFamily: fontes.texto, fontWeight: 800, fontSize: tam * 0.24, color: c.cinza, whiteSpace: "nowrap", marginTop: 6 }}>{legenda}</div> : null}
    </div>
  );
};

// Nota de dinheiro que vai e volta entre dois pontos (laço suave)
export const NotaVaiVem: React.FC<{ de: [number, number]; para: [number, number]; em: number; i?: number; periodo?: number; arco?: number }> = ({ de, para, em, i = 0, periodo = 50, arco = 160 }) => {
  const f = useCurrentFrame();
  const t = f - em - i * (periodo / 3);
  if (t < 0) return null;
  const fase = (t % (periodo * 2)) / periodo; // 0–2
  const ida = fase < 1;
  const q = Easing.inOut(Easing.cubic)(ida ? fase : fase - 1);
  const [ax, ay] = ida ? de : para;
  const [bx, by] = ida ? para : de;
  const x = ax + (bx - ax) * q;
  const y = ay + (by - ay) * q - Math.sin(q * Math.PI) * arco * (ida ? 1 : -1);
  return (
    <div style={{ position: "absolute", left: x - 110, top: y - 50, width: 220, height: 100, borderRadius: 12, background: "linear-gradient(135deg,#8fe0b3,#2fd08a)", border: `5px solid ${c.verdeEscuro}`, transform: `perspective(1000px) rotateY(${t * 7}deg) rotateZ(${Math.sin(t / 10) * 15}deg)`, boxShadow: "0 16px 30px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.titulo, fontSize: 52, color: "#0f4f33", opacity: interpolate(t, [0, 6], [0, 1], cl) }}>
      R$
    </div>
  );
};

// Mapa do Brasil feito de pontinhos (mar de bolinhas). `acende`: grupos que piscam em amarelo depois de `acendeEm`.
type Estado = { sigla: string; d: string; c: number[] };
export const MapaPontos: React.FC<{ x: number; y: number; tam: number; em: number; passo?: number; acendeEm?: number; opac?: number }> = ({ x, y, tam, em, passo = 26, acendeEm, opac = 1 }) => {
  const f = useCurrentFrame();
  const pontos = useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = 10;
    cv.height = 10;
    const ctx = cv.getContext("2d");
    if (!ctx) return [] as [number, number, number][];
    const caminhos = (mapa.estados as Estado[]).map((e) => new Path2D(e.d));
    const out: [number, number, number][] = [];
    let i = 0;
    for (let py = 0; py < 1000; py += passo / (tam / 1000)) {
      for (let px = 0; px < 1000; px += passo / (tam / 1000)) {
        i++;
        const jx = px + (rnd(i) - 0.5) * 8;
        const jy = py + (rnd(i + 7) - 0.5) * 8;
        if (caminhos.some((p) => ctx.isPointInPath(p, jx, jy))) out.push([jx, jy, i]);
      }
    }
    return out;
  }, [passo, tam]);
  const k = tam / 1000;
  return (
    <svg width={tam} height={tam} viewBox="0 0 1000 1000" style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: opac }}>
      {(mapa.estados as Estado[]).map((e) => (
        <path key={e.sigla} d={e.d} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2 / k} strokeLinejoin="round" opacity={interpolate(f, [em, em + 20], [0, 1], cl)} />
      ))}
      {pontos.map(([px, py, i], j) => {
        const a = interpolate(f, [em + (j % 30), em + (j % 30) + 10], [0, 1], cl);
        const lig = acendeEm !== undefined && f >= acendeEm && Math.sin((f - acendeEm) / 14 + (i % 9)) > 0.75 && i % 5 === 0;
        return <circle key={i} cx={px} cy={py} r={(lig ? 7 : 4.5) / k} fill={lig ? c.marca : i % 4 === 0 ? c.verde : "rgba(244,244,242,0.55)"} opacity={a} />;
      })}
    </svg>
  );
};
export const pontoMapa = (sigla: string, x: number, y: number, tam: number, dx = 0, dy = 0): [number, number] => {
  const e = (mapa.estados as Estado[]).find((s) => s.sigla === sigla);
  const [cx, cy] = e ? e.c : [500, 500];
  return [x + ((cx + dx) * tam) / 1000, y + ((cy + dy) * tam) / 1000];
};

// Caixinha de checklist que o cursor marca
export const Check: React.FC<{ x: number; y: number; em: number; marcaEm: number; texto: string; tam?: number }> = ({ x, y, em, marcaEm, texto, tam = 90 }) => {
  const f = useCurrentFrame();
  const p = usePulo(em);
  const m = interpolate(f, [marcaEm, marcaEm + 8], [0, 1], cl);
  return (
    <div data-foco={`check: ${texto}`} style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 34, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * -80}px)` }}>
      <div style={{ width: tam, height: tam, borderRadius: 14, border: `8px solid ${c.claro}`, position: "relative" }}>
        <svg viewBox="0 0 100 100" width={tam * 1.3} height={tam * 1.3} style={{ position: "absolute", left: -tam * 0.05, top: -tam * 0.35, overflow: "visible" }}>
          <path d="M14 52 L40 78 L94 10" fill="none" stroke={c.verde} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - m} />
        </svg>
      </div>
      <div style={{ fontFamily: fontes.mao, fontWeight: 700, fontSize: tam * 1.05, color: c.claro, whiteSpace: "nowrap" }}>{texto}</div>
    </div>
  );
};

// Só existe entre `de` e `ate` (para PalavraGigante com saída: fora do intervalo não conta na auditoria)
export const Durante: React.FC<{ de: number; ate: number; children: React.ReactNode }> = ({ de, ate, children }) => {
  const f = useCurrentFrame();
  if (f < de || f > ate) return null;
  return <>{children}</>;
};

// Palavra gigante sem giro na entrada (variante local da PalavraGigante: o giro fazia o texto "vazar" na auditoria)
export const PalavraReta: React.FC<{ texto: string; x: number; y: number; em: number; cor?: string; tam?: number }> = ({ texto, x, y, em, cor = c.claro, tam = 240 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div data-foco={`palavra: ${texto}`} style={{ position: "absolute", left: x, top: y, display: "flex", gap: tam * 0.18 }}>
      {texto.split(" ").map((w, i) => {
        const p = spring({ frame: f - em - i * 3, fps, config: { damping: 12, stiffness: 180 } });
        return (
          <span key={i} style={{ display: "inline-block", fontFamily: fontes.titulo, fontSize: tam, lineHeight: 1.05, color: cor, whiteSpace: "nowrap", opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 120}px)`, textShadow: "0 10px 0 rgba(0,0,0,0.35)" }}>{w}</span>
        );
      })}
    </div>
  );
};
