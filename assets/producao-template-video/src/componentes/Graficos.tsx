import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OURO = "#e0b43c";
const CINZA = "#9a948a";

// Barra de percentual que enche (opcional: parte cinza em seguida)
export const Gauge: React.FC<{ rotulo: string; valor: number; texto: string; entra: number; largura?: number; cor?: string; resto?: { v: number; texto: string }; nota?: string }> = ({ rotulo, valor, texto, entra, largura = 900, cor = OURO, resto, nota }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [entra + 6, entra + 46], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0.7, 0.2, 1) });
  const q = resto ? interpolate(frame, [entra + 50, entra + 70], [0, 1], clamp) : 0;
  return (
    <div data-foco={`medidor ${rotulo}`} style={{ width: largura, opacity: interpolate(frame, [entra, entra + 8], [0, 1], clamp) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 20, fontFamily: fontes.rotulo, fontWeight: 700, color: cores.papel, marginBottom: 10 }}>
        <span style={{ fontSize: 38 }}>{rotulo}</span>
        <span style={{ fontSize: 64, color: cor, whiteSpace: "nowrap" }}>{texto}</span>
      </div>
      <div style={{ height: 34, backgroundColor: "rgba(0,0,0,0.45)", border: `2px solid ${cores.papelEscuro}`, display: "flex" }}>
        <div style={{ width: `${valor * p * 100}%`, backgroundColor: cor }} />
        {resto ? <div style={{ width: `${resto.v * q * 100}%`, backgroundColor: CINZA }} /> : null}
      </div>
      {resto ? <div style={{ fontFamily: fontes.rotulo, fontSize: 32, color: CINZA, marginTop: 10, opacity: q }}>{resto.texto}</div> : null}
      {nota ? <div style={{ fontFamily: fontes.maquina, fontSize: 30, color: cores.papelEscuro, marginTop: 10, opacity: p }}>{nota}</div> : null}
    </div>
  );
};

// Pizza: fatias em sequência; fatia com destaque sai do centro
export const Pizza: React.FC<{ fatias: { v: number; cor: string; rotulo?: string; destaque?: boolean }[]; entra: number; tamanho?: number; nome: string }> = ({ fatias, entra, tamanho = 420, nome }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [entra, entra + 40], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0.7, 0.2, 1) });
  const R = 200;
  let acc = 0;
  const arco = (a0: number, a1: number, dx: number, dy: number) => {
    const pt = (a: number) => [250 + dx + R * Math.sin(a * 2 * Math.PI), 250 + dy - R * Math.cos(a * 2 * Math.PI)];
    const [x0, y0] = pt(a0);
    const [x1, y1] = pt(a1);
    return `M${250 + dx} ${250 + dy} L${x0} ${y0} A${R} ${R} 0 ${a1 - a0 > 0.5 ? 1 : 0} 1 ${x1} ${y1} Z`;
  };
  return (
    <svg data-foco={`pizza ${nome}`} width={tamanho} height={tamanho} viewBox="0 0 500 500" style={{ opacity: interpolate(frame, [entra - 4, entra + 4], [0, 1], clamp) }}>
      <circle cx={250} cy={250} r={R} fill="rgba(0,0,0,0.35)" stroke={cores.papelEscuro} strokeWidth={3} />
      {fatias.map((f, i) => {
        const a0 = acc * p;
        acc += f.v;
        const a1 = acc * p;
        const meio = ((a0 + a1) / 2) * 2 * Math.PI;
        const d = f.destaque ? 22 * p : 0;
        return a1 > a0 ? <path key={i} d={arco(a0, Math.min(a1, 0.9999), d * Math.sin(meio), -d * Math.cos(meio))} fill={f.cor} stroke={cores.cortica} strokeWidth={3} /> : null;
      })}
    </svg>
  );
};

// Cartão de estudo (borda vermelha ou cinza)
export const CartaoEstudo: React.FC<{ titulo: string; valor: string; fonte: string; entra: number; cinza?: boolean; largura?: number; carimbo?: { texto: string; f: number } }> = ({ titulo, valor, fonte, entra, cinza, largura = 520, carimbo }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [entra, entra + 10], [0, 1], clamp);
  const c = carimbo ? interpolate(frame, [carimbo.f, carimbo.f + 5], [0, 1], clamp) : 0;
  return (
    <div data-foco={`cartão ${titulo}`} style={{ width: largura, padding: "30px 34px", backgroundColor: "#f2ecdc", borderTop: `14px solid ${cinza ? CINZA : cores.vermelho}`, boxShadow: "0 20px 30px rgba(0,0,0,0.6)", opacity: o, translate: `0 ${(1 - o) * 60}px`, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 36, color: "#3a332b" }}>{titulo}</div>
      <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 56, color: cinza ? "#5b554c" : cores.vermelho, lineHeight: 1.05 }}>{valor}</div>
      <div style={{ fontFamily: fontes.maquina, fontSize: 26, color: "#6b5f45" }}>{fonte}</div>
      {carimbo ? (
        <div style={{ alignSelf: "flex-start", opacity: c, scale: String(1.2 - 0.2 * c), rotate: "-3deg", border: `5px solid ${cores.vermelho}`, borderRadius: 8, padding: "4px 18px", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: cores.vermelho }}>{carimbo.texto}</div>
      ) : null}
    </div>
  );
};

// Lupa que passa sobre um ponto
export const Lupa: React.FC<{ de: [number, number]; ate: [number, number]; entra: number; dur?: number }> = ({ de, ate, entra, dur = 60 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [entra, entra + dur], [0, 1], { ...clamp, easing: Easing.bezier(0.45, 0, 0.55, 1) });
  const x = de[0] + (ate[0] - de[0]) * p;
  const y = de[1] + (ate[1] - de[1]) * p;
  return (
    <svg data-sobrepor-ok width={320} height={320} viewBox="0 0 320 320" style={{ position: "absolute", left: x - 110, top: y - 110, opacity: interpolate(frame, [entra, entra + 8], [0, 1], clamp) }}>
      <circle cx={110} cy={110} r={90} fill="rgba(255,255,255,0.08)" stroke="#d9d2c4" strokeWidth={12} />
      <line x1={176} y1={176} x2={290} y2={290} stroke="#d9d2c4" strokeWidth={26} strokeLinecap="round" />
    </svg>
  );
};
