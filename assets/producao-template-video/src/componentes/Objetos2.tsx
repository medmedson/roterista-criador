import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (i: number) => {
  const v = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
  return v - Math.floor(v);
};

// Grade de pontos (1 ponto = 1 milhão): grupos acendem em ondas com cor própria
export const MultidaoPontos: React.FC<{
  total: number;
  colunas: number;
  grupos: { qtd: number; cor: string; entra: number; rotulo: string }[];
  largura: number;
}> = ({ total, colunas, grupos, largura }) => {
  const frame = useCurrentFrame();
  const passo = largura / colunas;
  const linhas = Math.ceil(total / colunas);
  let base = 0;
  const cor: (string | null)[] = Array(total).fill(null);
  const acende: number[] = Array(total).fill(Infinity);
  for (const g of grupos) {
    for (let i = 0; i < g.qtd && base + i < total; i++) {
      cor[base + i] = g.cor;
      acende[base + i] = g.entra + ((i % colunas) + Math.floor(i / colunas)) * 0.8;
    }
    base += g.qtd;
  }
  return (
    <div data-foco="multidão de pontos" style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
      <svg width={largura} height={linhas * passo}>
        {Array.from({ length: total }, (_, i) => {
          const on = Number.isFinite(acende[i]) ? interpolate(frame, [acende[i], acende[i] + 6], [0, 1], clamp) : 0;
          return (
            <circle
              key={i}
              cx={(i % colunas) * passo + passo / 2}
              cy={Math.floor(i / colunas) * passo + passo / 2}
              r={passo * 0.34}
              fill={on > 0 && cor[i] ? cor[i]! : "#4a403a"}
              opacity={0.5 + 0.5 * on}
            />
          );
        })}
      </svg>
      <div style={{ display: "flex", gap: 60 }}>
        {grupos.map((g) => {
          const n = Math.round(interpolate(frame, [g.entra, g.entra + 40], [0, g.qtd], clamp));
          return (
            <div key={g.rotulo} style={{ opacity: interpolate(frame, [g.entra, g.entra + 8], [0, 1], clamp), display: "flex", alignItems: "baseline", gap: 14 }}>
              <span style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 80, color: g.cor, fontVariantNumeric: "tabular-nums" }}>{n}</span>
              <span style={{ fontFamily: fontes.maquina, fontSize: 36, color: cores.papel }}>{g.rotulo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Iceberg em traço: a ponta aparece primeiro; a água sobe (câmera desce) e revela rótulos no casco
export const Iceberg: React.FC<{ ponta: string; rotulos: { texto: string; entra: number }[]; desce: number; largura?: number }> = ({
  ponta,
  rotulos,
  desce,
  largura = 1500,
}) => {
  const frame = useCurrentFrame();
  const d = interpolate(frame, [desce, desce + 50], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.3, 1) });
  const H = 1600;
  const agua = 330;
  return (
    <div data-foco="iceberg" data-corte-ok data-sobrepor-ok style={{ position: "relative", width: largura, height: 880, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: largura, height: H, translate: `0 ${-d * 700}px` }}>
        <div style={{ position: "absolute", left: 0, top: agua, width: largura, height: H - agua, background: "linear-gradient(180deg, rgba(40,70,100,0.55), rgba(5,10,20,0.95))" }} />
        <svg width={largura} height={H} style={{ position: "absolute", inset: 0 }}>
          <polygon points={`${largura / 2},60 ${largura / 2 + 150},${agua} ${largura / 2 - 170},${agua}`} fill="rgba(240,245,250,0.9)" />
          <polygon
            points={`${largura / 2 - 170},${agua} ${largura / 2 + 150},${agua} ${largura / 2 + 560},${agua + 520} ${largura / 2 + 300},${agua + 1050} ${largura / 2 - 380},${agua + 1000} ${largura / 2 - 600},${agua + 450}`}
            fill="rgba(170,200,225,0.35)"
            stroke="rgba(230,240,250,0.8)"
            strokeWidth={4}
          />
          <line x1={0} x2={largura} y1={agua} y2={agua} stroke="rgba(255,255,255,0.6)" strokeWidth={3} />
        </svg>
        <div style={{ position: "absolute", top: 120, left: largura / 2 + 180, fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 52, color: cores.branco }}>{ponta}</div>
        {rotulos.map((r, i) => (
          <div
            key={r.texto}
            data-foco={`iceberg: ${r.texto}`}
            style={{
              position: "absolute",
              top: 820 + (i % 3) * 200 + Math.floor(i / 3) * 60,
              left: i < 3 ? largura / 2 - 480 : largura / 2 + 40,
              width: 480,
              fontFamily: fontes.rotulo,
              fontWeight: 700,
              fontSize: 42,
              color: cores.amarelo,
              opacity: interpolate(frame, [r.entra, r.entra + 10], [0, 1], clamp),
            }}
          >
            {r.texto}
          </div>
        ))}
      </div>
    </div>
  );
};

// Frasco de vacina genérico; em fileiras multiplica conforme o tempo
export const Frascos: React.FC<{ entra: number; linhas: number; colunas: number; cor?: string; tamanho?: number }> = ({
  entra,
  linhas,
  colunas,
  cor = cores.vermelho,
  tamanho = 70,
}) => {
  const frame = useCurrentFrame();
  const total = linhas * colunas;
  return (
    <div data-foco="frascos" style={{ display: "grid", gridTemplateColumns: `repeat(${colunas}, ${tamanho}px)`, gap: tamanho * 0.3 }}>
      {Array.from({ length: total }, (_, i) => {
        const e = entra + Math.sqrt(i) * 5;
        return (
          <div key={i} style={{ width: tamanho, height: tamanho * 1.7, opacity: interpolate(frame, [e, e + 6], [0, 1], clamp), scale: String(interpolate(frame, [e, e + 8], [0.5, 1], clamp)), display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: tamanho * 0.62, height: tamanho * 0.3, backgroundColor: cor, borderRadius: 4 }} />
            <div style={{ width: tamanho * 0.5, height: tamanho * 0.12, backgroundColor: "#9aa3a8" }} />
            <div style={{ width: tamanho * 0.8, flex: 1, borderRadius: `${tamanho * 0.08}px ${tamanho * 0.08}px ${tamanho * 0.2}px ${tamanho * 0.2}px`, background: "linear-gradient(90deg, rgba(220,235,245,0.5), rgba(255,255,255,0.9), rgba(200,220,235,0.5))", display: "flex", alignItems: "center" }}>
              <div style={{ width: "100%", height: "38%", backgroundColor: "#f4efe6", borderTop: `3px solid ${cor}` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Gota que cai sobre um ponto e se espalha em pontos (coordenadas do SVG pai)
export const GotaMapa: React.FC<{ alvo: [number, number]; entra: number; espalha?: [number, number][]; escala?: number }> = ({ alvo, entra, espalha = [], escala = 1 }) => {
  const frame = useCurrentFrame();
  const queda = interpolate(frame, [entra, entra + 18], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const toque = frame - (entra + 18);
  if (frame < entra) return null;
  return (
    <g>
      {toque < 0 ? (
        <path
          transform={`translate(${alvo[0]} ${alvo[1] - 400 * (1 - queda)}) scale(${escala})`}
          d="M0 -40 C 14 -16, 24 0, 24 14 A 24 24 0 0 1 -24 14 C -24 0, -14 -16, 0 -40 Z"
          fill={cores.branco}
        />
      ) : (
        <>
          <circle cx={alvo[0]} cy={alvo[1]} r={interpolate(toque, [0, 30], [10, 120], clamp) * escala} fill="none" stroke={cores.branco} strokeWidth={4} opacity={interpolate(toque, [0, 30], [1, 0], clamp)} />
          <circle cx={alvo[0]} cy={alvo[1]} r={10 * escala} fill={cores.branco} />
          {espalha.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r={7 * escala} fill={cores.branco} opacity={interpolate(toque, [6 + i * 1.5, 12 + i * 1.5], [0, 0.9], clamp)} />
          ))}
        </>
      )}
    </g>
  );
};

// Sequenciador: colunas de A, C, G, T rolando; trava e destaca um trecho
export const GenomaFita: React.FC<{ entra: number; trava: number; colunas?: number; linhas?: number; destaque?: string }> = ({
  entra,
  trava,
  colunas = 16,
  linhas = 11,
  destaque = "ACGTTGCA",
}) => {
  const frame = useCurrentFrame();
  const B = "ACGT";
  const f = Math.min(frame, trava);
  const linhaDestaque = Math.floor(linhas / 2);
  return (
    <div data-foco="genoma" style={{ opacity: interpolate(frame, [entra, entra + 10], [0, 1], clamp), fontFamily: "monospace", fontSize: 44, lineHeight: 1.3, color: "#39d353", textShadow: "0 0 10px rgba(57,211,83,0.6)", backgroundColor: "rgba(0,12,4,0.85)", padding: "30px 40px", border: "3px solid #1f6f33" }}>
      {Array.from({ length: linhas }, (_, l) => {
        const txt = Array.from({ length: colunas }, (_, c) => B[Math.floor(rnd(l * 97 + c * 13 + Math.floor(f / 2) * 7) * 4)]).join(" ");
        const hl = frame >= trava && l === linhaDestaque;
        return (
          <div key={l} style={{ whiteSpace: "pre", backgroundColor: hl ? "rgba(242,194,48,0.25)" : undefined, color: hl ? cores.amarelo : undefined }}>
            {hl ? destaque.split("").join(" ").padEnd(colunas * 2 - 1, " ").slice(0, colunas * 2 - 1) : txt}
          </div>
        );
      })}
    </div>
  );
};

// Partículas virais estilizadas que se multiplicam e se espalham a partir de um ponto (SVG pai)
export const Particulas: React.FC<{ origem: [number, number]; entra: number; quantidade: number; raio: number; escala?: number }> = ({
  origem,
  entra,
  quantidade,
  raio,
  escala = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: quantidade }, (_, i) => {
        const e = entra + Math.sqrt(i) * 6;
        const p = interpolate(frame, [e, e + 40], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.7, 0.3, 1) });
        const ang = rnd(i) * Math.PI * 2;
        const dist = Math.sqrt(rnd(i + 50)) * raio * p;
        const x = origem[0] + Math.cos(ang) * dist;
        const y = origem[1] + Math.sin(ang) * dist;
        const r = (7 + rnd(i + 9) * 5) * escala;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${frame * 2 + i * 30})`} opacity={p > 0 ? 0.85 : 0}>
            <circle r={r} fill="none" stroke={cores.vermelho} strokeWidth={2.5 * escala} />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <line key={a} x1={0} y1={-r} x2={0} y2={-r - 5 * escala} stroke={cores.vermelho} strokeWidth={2 * escala} transform={`rotate(${a})`} />
            ))}
          </g>
        );
      })}
    </g>
  );
};

// Negatoscópio (caixa de luz) que liga com cintilação e mostra uma chapa genérica
export const MesaDeLuz: React.FC<{ liga: number; largura?: number; legenda?: string }> = ({ liga, largura = 900, legenda }) => {
  const frame = useCurrentFrame();
  const pisca = frame < liga ? 0 : frame < liga + 14 ? ([1, 0, 1, 1, 0, 1][Math.floor((frame - liga) / 2.4)] ?? 1) : 1;
  return (
    <div data-foco="mesa de luz" style={{ width: largura, padding: 26, backgroundColor: "#2b2f33", borderRadius: 14, boxShadow: "0 30px 50px rgba(0,0,0,0.8)" }}>
      <div style={{ height: largura * 0.6, backgroundColor: pisca ? "#eef6ff" : "#3a4046", boxShadow: pisca ? "0 0 60px rgba(220,240,255,0.6)" : undefined, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={largura * 0.8} height={largura * 0.5} viewBox="0 0 800 500">
          <rect x={0} y={0} width={800} height={500} fill="#101418" opacity={0.92} />
          <ellipse cx={400} cy={250} rx={260} ry={200} fill="none" stroke="#9fb3c4" strokeWidth={10} opacity={0.6} />
          <ellipse cx={320} cy={250} rx={90} ry={150} fill="#6d8396" opacity={0.35} />
          <ellipse cx={480} cy={250} rx={90} ry={150} fill="#6d8396" opacity={0.35} />
          <line x1={400} y1={60} x2={400} y2={440} stroke="#b9c9d6" strokeWidth={14} opacity={0.5} />
        </svg>
      </div>
      {legenda ? <div style={{ fontFamily: fontes.rotulo, fontSize: 30, letterSpacing: 4, color: cores.papelEscuro, marginTop: 14, textAlign: "center" }}>{legenda}</div> : null}
    </div>
  );
};

// Pasta parda de inquérito com elástico e tarja; desliza, solta o elástico e abre
export const PastaInquerito: React.FC<{ entra: number; abre: number; etiqueta?: string; largura?: number }> = ({ entra, abre, etiqueta = "OPERAÇÃO ______", largura = 900 }) => {
  const frame = useCurrentFrame();
  const entrada = interpolate(frame, [entra, entra + 20], [-300, 0], { ...clamp, easing: Easing.bezier(0.2, 0.8, 0.3, 1) });
  const a = interpolate(frame, [abre, abre + 22], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.3, 1) });
  const h = largura * 0.68;
  return (
    <div data-foco="pasta de inquérito" style={{ position: "relative", width: largura, height: h, translate: `${entrada}px 0`, opacity: interpolate(frame, [entra, entra + 8], [0, 1], clamp), perspective: 1800 }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#b08a55", borderRadius: 8, boxShadow: "0 30px 40px rgba(0,0,0,0.7)" }} />
      {/* documentos internos com tarja */}
      <div style={{ position: "absolute", left: 50, top: 40, right: 50, bottom: 40, backgroundColor: "#f1ece0", opacity: a, padding: 30, display: "flex", flexDirection: "column", gap: 16 }}>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} style={{ height: 18, width: `${60 + rnd(i) * 40}%`, backgroundColor: i === 1 ? "#111" : "#c9c2b2" }} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #c79d62, #a57c46)",
          borderRadius: 8,
          transformOrigin: "0 50%",
          transform: `rotateY(${-160 * a}deg)`,
          backfaceVisibility: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <div style={{ backgroundColor: cores.vermelho, width: "100%", height: 34 }} />
        <div style={{ backgroundColor: "#f1ece0", padding: "16px 40px", fontFamily: fontes.maquina, fontSize: largura * 0.05, color: cores.tinta }}>{etiqueta}</div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "90%", width: 14, backgroundColor: "#2a2420", opacity: a > 0 ? 0 : 1 }} />
      </div>
    </div>
  );
};

// Moedas escorrendo por uma fenda para fora do quadro (corte proposital)
export const MoedasEscorrendo: React.FC<{ entra: number; quantidade?: number; largura?: number; altura?: number }> = ({ entra, quantidade = 40, largura = 600, altura = 800 }) => {
  const frame = useCurrentFrame();
  return (
    <div data-foco="moedas escorrendo" data-corte-ok style={{ position: "relative", width: largura, height: altura }}>
      <div style={{ position: "absolute", left: largura / 2 - 120, top: altura * 0.45, width: 240, height: 16, backgroundColor: "#000", borderRadius: 8, boxShadow: "0 0 0 4px #5a4a3a" }} />
      {Array.from({ length: quantidade }, (_, i) => {
        const e = entra + i * 3;
        const p = interpolate(frame, [e, e + 45], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        const x = largura / 2 - 100 + rnd(i) * 200;
        const y = interpolate(p, [0, 1], [40 + rnd(i + 3) * 120, altura + 200]);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #ffe38a, #c9962c)", border: "3px solid #8a6a1d", opacity: frame >= e ? 1 : 0, rotate: `${frame * 8 + i * 40}deg` }} />
        );
      })}
    </div>
  );
};

// Ampulheta com areia vermelha escorrendo e contador ao lado
export const Ampulheta: React.FC<{ entra: number; duracao: number; altura?: number }> = ({ entra, duracao, altura = 620 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [entra, entra + duracao], [0, 1], clamp);
  const w = altura * 0.6;
  return (
    <svg data-foco="ampulheta" width={w} height={altura} viewBox="0 0 300 500">
      <path d="M40 20 H260 V40 C260 140 170 200 160 250 C170 300 260 360 260 460 V480 H40 V460 C40 360 130 300 140 250 C130 200 40 140 40 40 Z" fill="rgba(220,235,245,0.12)" stroke={cores.papel} strokeWidth={6} />
      <clipPath id="topo">
        <path d="M44 40 C44 140 132 200 146 250 L154 250 C168 200 256 140 256 40 Z" />
      </clipPath>
      <clipPath id="base">
        <path d="M146 250 C132 300 44 360 44 460 H256 C256 360 168 300 154 250 Z" />
      </clipPath>
      <rect x={40} y={40 + 210 * p} width={220} height={210} fill={cores.vermelho} clipPath="url(#topo)" />
      <rect x={40} y={460 - 200 * p} width={220} height={210} fill={cores.vermelho} clipPath="url(#base)" />
      {p > 0 && p < 1 ? <line x1={150} y1={250} x2={150} y2={460 - 200 * p} stroke={cores.vermelho} strokeWidth={4} /> : null}
      <rect x={30} y={8} width={240} height={16} fill="#6b4a2b" />
      <rect x={30} y={476} width={240} height={16} fill="#6b4a2b" />
    </svg>
  );
};

// Balança de dois pratos que pende conforme os pesos
export const Balanca: React.FC<{ entra: number; inclina: number; esquerda: string; direita: string; angulo?: number; largura?: number }> = ({
  entra,
  inclina,
  esquerda,
  direita,
  angulo = 14,
  largura = 1100,
}) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [inclina, inclina + 40], [0, angulo], { ...clamp, easing: Easing.bezier(0.3, 1.4, 0.4, 1) });
  const ouro = "#d4a93a";
  const L = largura / 2 - 60;
  const prato = (lado: -1 | 1, rot: string) => {
    const x = largura / 2 + lado * L * Math.cos((a * Math.PI) / 180);
    const y = 140 + lado * L * Math.sin((a * Math.PI) / 180);
    return (
      <g>
        <line x1={x} y1={y} x2={x - 90} y2={y + 220} stroke={ouro} strokeWidth={3} />
        <line x1={x} y1={y} x2={x + 90} y2={y + 220} stroke={ouro} strokeWidth={3} />
        <path d={`M${x - 120} ${y + 220} Q${x} ${y + 290} ${x + 120} ${y + 220} Z`} fill="rgba(212,169,58,0.25)" stroke={ouro} strokeWidth={5} />
        <text x={x} y={y + 350} textAnchor="middle" fontFamily={fontes.rotulo} fontWeight={700} fontSize={46} fill={cores.papel}>
          {rot.split("\n").map((l, k) => (
            <tspan key={k} x={x} dy={k === 0 ? 0 : 53}>{l}</tspan>
          ))}
        </text>
      </g>
    );
  };
  return (
    <svg data-foco="balança" width={largura} height={640} style={{ overflow: "visible", opacity: interpolate(frame, [entra, entra + 10], [0, 1], clamp) }}>
      <line x1={largura / 2} y1={140} x2={largura / 2} y2={600} stroke={ouro} strokeWidth={10} />
      <path d={`M${largura / 2 - 120} 610 H${largura / 2 + 120}`} stroke={ouro} strokeWidth={16} strokeLinecap="round" />
      <g transform={`rotate(${a} ${largura / 2} 140)`}>
        <line x1={largura / 2 - L} y1={140} x2={largura / 2 + L} y2={140} stroke={ouro} strokeWidth={10} strokeLinecap="round" />
      </g>
      <circle cx={largura / 2} cy={140} r={18} fill={ouro} />
      {prato(-1, esquerda)}
      {prato(1, direita)}
    </svg>
  );
};
