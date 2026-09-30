import { Easing, interpolate, useCurrentFrame } from "remotion";
import mapa from "../data/mapa.json";
import { cores, fontes } from "../tema";

// Mapa do Brasil em traço, desenhado estado a estado
export const MapaBrasil: React.FC<{
  x: number;
  y: number;
  tamanho: number;
  entra: number;
  alfinete?: number;
  pontos?: { entra: number; porEstado: number };
  corteOk?: boolean;
  destaques?: { sigla: string; cor: string; entra: number }[];
}> = ({ x, y, tamanho, entra, alfinete, pontos, corteOk, destaques = [] }) => {
  const frame = useCurrentFrame();
  const [bx, by] = mapa.projecao.brasilia;
  return (
    <svg
      data-foco="mapa do Brasil"
      {...(corteOk ? { "data-corte-ok": true } : {})}
      data-sobrepor-ok
      width={tamanho}
      height={tamanho}
      viewBox={`0 0 ${mapa.w} ${mapa.h}`}
      style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: interpolate(frame, [entra, entra + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}
    >
      {mapa.estados.map((e, i) => {
        const p = interpolate(frame, [entra + i * 1.2, entra + i * 1.2 + 40], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
        return (
          <path
            key={e.sigla}
            d={e.d}
            fill={destaques.find((d) => d.sigla === e.sigla && frame >= d.entra)?.cor ?? cores.vermelho}
            fillOpacity={destaques.some((d) => d.sigla === e.sigla && frame >= d.entra) ? 0.85 : 0.12 * p}
            stroke={cores.papelEscuro}
            strokeOpacity={0.75}
            strokeWidth={2.6}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
          />
        );
      })}
      {pontos
        ? mapa.estados.flatMap((e, i) =>
            Array.from({ length: pontos.porEstado }, (_, k) => {
              const n = i * 7 + k;
              const r = (v: number) => {
                const q = Math.sin(v * 78.233) * 43758.5453;
                return q - Math.floor(q);
              };
              const f = pontos.entra + Math.sqrt(n) * 6;
              return (
                <circle
                  key={`${e.sigla}${k}`}
                  cx={e.c[0] + (r(n) - 0.5) * 50}
                  cy={e.c[1] + (r(n + 99) - 0.5) * 50}
                  r={interpolate(frame, [f, f + 6, f + 14], [0, 11, 7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                  fill={cores.amarelo}
                />
              );
            }),
          )
        : null}
      {alfinete !== undefined ? (
        <g
          opacity={interpolate(frame, [alfinete, alfinete + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        >
          <circle
            cx={bx}
            cy={by}
            r={interpolate(frame, [alfinete, alfinete + 40], [10, 80], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            fill="none"
            stroke={cores.vermelho}
            strokeWidth={3}
            opacity={interpolate(frame, [alfinete, alfinete + 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          />
          <circle cx={bx} cy={by} r={14} fill={cores.vermelho} />
          <text x={bx + 26} y={by + 10} fill={cores.papel} fontFamily={fontes.maquina} fontSize={34}>
            BRASÍLIA
          </text>
        </g>
      ) : null}
    </svg>
  );
};
