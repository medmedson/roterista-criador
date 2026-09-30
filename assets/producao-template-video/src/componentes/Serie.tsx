import { interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

export type PontoSerie = { a: string; v: number; rotulo?: string; destaque?: boolean };

// Série em linha, desenhada ponto a ponto (só os anos informados; nada interpolado entre eles no rótulo)
export const SerieLinha: React.FC<{
  pontos: PontoSerie[];
  maximo: number;
  minimo?: number;
  largura: number;
  altura: number;
  entra: number;
  passo?: number;
  cor?: string;
  casas?: number;
  sufixo?: string;
}> = ({ pontos, maximo, minimo = 0, largura, altura, entra, passo = 12, cor = "#e0b43c", casas = 1, sufixo = "%" }) => {
  const frame = useCurrentFrame();
  const x0 = 60, x1 = largura - 60, yTop = 70, yBase = altura - 60;
  const x = (i: number) => x0 + (i / Math.max(1, pontos.length - 1)) * (x1 - x0);
  const y = (v: number) => yBase - ((v - minimo) / (maximo - minimo)) * (yBase - yTop);
  const n = interpolate(frame, [entra, entra + passo * (pontos.length - 1)], [0, pontos.length - 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const k = Math.floor(n);
  const f = n - k;
  const pts = pontos.slice(0, k + 1).map((p, i) => `${x(i)},${y(p.v)}`);
  if (k < pontos.length - 1 && frame >= entra) pts.push(`${x(k) + (x(k + 1) - x(k)) * f},${y(pontos[k].v) + (y(pontos[k + 1].v) - y(pontos[k].v)) * f}`);
  return (
    <svg data-foco="série em linha" width={largura} height={altura} style={{ overflow: "visible", opacity: interpolate(frame, [entra - 10, entra], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke={cores.papelEscuro} strokeWidth={3} />
      <polyline points={pts.join(" ")} fill="none" stroke={cor} strokeWidth={7} strokeLinejoin="round" />
      {pontos.map((p, i) =>
        i <= k ? (
          <g key={p.a}>
            <circle cx={x(i)} cy={y(p.v)} r={p.destaque ? 14 : 8} fill={p.destaque ? cores.vermelho : cor} />
            <text x={x(i)} y={y(p.v) - 24} textAnchor="middle" fill={p.destaque ? cores.branco : cor} fontFamily={fontes.rotulo} fontWeight={700} fontSize={p.destaque ? 40 : 30}>
              {p.v.toFixed(casas).replace(".", ",")}{sufixo}
            </text>
            {p.rotulo ? <text x={x(i)} y={y(p.v) - 70} textAnchor="middle" fill={cores.papel} fontFamily={fontes.maquina} fontSize={28}>{p.rotulo}</text> : null}
          </g>
        ) : null,
      )}
      {pontos.map((p, i) => (
        <text key={`a${p.a}`} x={x(i)} y={yBase + 40} textAnchor="middle" fill={cores.papel} fontFamily={fontes.rotulo} fontSize={28}>{p.a}</text>
      ))}
    </svg>
  );
};
