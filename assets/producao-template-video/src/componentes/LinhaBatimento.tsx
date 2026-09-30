import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { cores } from "../tema";

export type EstadoBatimento = "normal" | "acelerado" | "reta" | "volta";
export type MudancaBatimento = { f: number; estado: EstadoBatimento };

// Forma de um batimento (fase 0..1): onda P, complexo QRS e onda T
const ecg = (p: number) => {
  const g = (c: number, w: number, a: number) => a * Math.exp(-(((p - c) / w) ** 2));
  return g(0.12, 0.035, 0.12) + g(0.28, 0.012, -0.18) + g(0.31, 0.012, 1) + g(0.34, 0.014, -0.35) + g(0.58, 0.06, 0.25);
};

// Linha de monitor cardíaco: rola da direita para a esquerda com ritmo por estado.
// "volta": um único pico e depois ritmo normal.
export const LinhaBatimento: React.FC<{
  x: number;
  y: number;
  largura: number;
  altura?: number;
  mudancas: MudancaBatimento[];
  entra?: number;
}> = ({ x, y, largura, altura = 140, mudancas, entra = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = 7; // px por frame
  const bpmDe = (e: EstadoBatimento) => (e === "acelerado" ? 120 : 60);
  // estado atual e amplitude (reta = 0), com transição suave
  let atual = mudancas[0];
  for (const m of mudancas) if (frame >= m.f) atual = m;
  const amp = interpolate(frame, [atual.f, atual.f + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ampAtual = atual.estado === "reta" ? 1 - amp : 1;
  const periodo = (v * fps * 60) / bpmDe(atual.estado);
  const pontos: string[] = [];
  // Amostras presas à linha do tempo (não à tela): o pico não "pula" entre quadros.
  const passo = 1;
  const inicioT = Math.ceil((frame * v - largura) / passo) * passo;
  for (let tk = inicioT; tk <= frame * v + 0.001; tk += passo) {
    const px = largura - (frame * v - tk);
    // posição "no tempo": pontos mais à esquerda são mais antigos
    const tpx = tk;
    const fase = ((tpx / periodo) % 1 + 1) % 1;
    const amostraFrame = frame - (largura - px) / v;
    const reta = mudancas.reduce((r, m) => (amostraFrame >= m.f ? m.estado === "reta" : r), false);
    const a = reta ? (amostraFrame < atual.f + 10 && atual.estado === "reta" ? ampAtual : 0) : 1;
    pontos.push(`${px},${(altura / 2 - ecg(fase) * a * altura * 0.45).toFixed(1)}`);
  }
  const op = interpolate(frame, [entra, entra + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg
      data-foco="linha de batimento"
      data-sobrepor-ok
      width={largura}
      height={altura}
      style={{ position: "absolute", left: x, top: y - altura / 2, overflow: "visible", opacity: op }}
    >
      <defs>
        <linearGradient id="rastro" x1="0" x2="1">
          <stop offset="0" stopColor={cores.vermelho} stopOpacity={0} />
          <stop offset="0.35" stopColor={cores.vermelho} stopOpacity={0.6} />
          <stop offset="1" stopColor="#ff4a3d" stopOpacity={1} />
        </linearGradient>
      </defs>
      <polyline points={pontos.join(" ")} fill="none" stroke="url(#rastro)" strokeWidth={4} strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(255,60,50,0.8))" }} />
      <circle cx={largura} cy={Number(pontos[pontos.length - 1].split(",")[1])} r={7} fill="#ff6b5e" style={{ filter: "drop-shadow(0 0 10px #ff3b30)" }} />
    </svg>
  );
};
