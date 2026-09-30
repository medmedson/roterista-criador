import { Easing, interpolate, useCurrentFrame } from "remotion";
import mundo from "../data/mundo.json";
import { cores } from "../tema";

type Origem = { x: number; y: number; entra: number };

// Mapa-múndi em traço com o Brasil em destaque e rotas chegando ao país
export const MapaMundo: React.FC<{
  largura: number;
  entra: number;
  origens?: Origem[];
  pontos?: { entra: number; quantidade: number };
  destaques?: { iso: string; entra: number; cor?: string }[];
}> = ({ largura, entra, origens = [], pontos, destaques = [] }) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const [bx, by] = mundo.brasil;
  const rnd = (i: number) => {
    const v = Math.sin(i * 91.7) * 43758.5453;
    return v - Math.floor(v);
  };
  return (
    <svg data-foco="mapa-múndi" data-sobrepor-ok width={largura} height={largura / 2} viewBox={`0 0 ${mundo.w} ${mundo.h}`} style={{ overflow: "visible" }}>
      <g opacity={interpolate(frame, [entra, entra + 20], [0, 1], clamp)}>
        {mundo.paises.map((p) => (
          <path
            key={p.iso + p.d.length}
            d={p.d}
            fill={(() => {
              const d = destaques.find((x) => x.iso === p.iso);
              if (d && frame >= d.entra) return d.cor ?? cores.amarelo;
              return p.iso === "BRA" && destaques.length === 0 ? cores.vermelho : "#2a221d";
            })()}
            fillOpacity={destaques.some((x) => x.iso === p.iso && frame >= x.entra) ? 0.85 : p.iso === "BRA" && destaques.length === 0 ? 0.55 : 1}
            stroke={cores.papelEscuro}
            strokeOpacity={0.35}
            strokeWidth={1}
          />
        ))}
      </g>
      {origens.map((o, i) => {
        const p = interpolate(frame, [o.entra, o.entra + 30], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.3, 1) });
        const cx = (o.x + bx) / 2;
        const cy = Math.min(o.y, by) - 160;
        return (
          <g key={i}>
            <circle cx={o.x} cy={o.y} r={9} fill={cores.amarelo} opacity={p > 0 ? 1 : 0} />
            <path
              d={`M${o.x} ${o.y} Q${cx} ${cy} ${bx} ${by}`}
              fill="none"
              stroke={cores.amarelo}
              strokeWidth={4}
              strokeDasharray="1"
              pathLength={1}
              strokeDashoffset={1 - p}
            />
          </g>
        );
      })}
      {pontos
        ? Array.from({ length: pontos.quantidade }, (_, i) => {
            // Crescimento acelerado: cada ponto entra mais rápido que o anterior
            const f = pontos.entra + Math.sqrt(i) * 9;
            const o = interpolate(frame, [f, f + 4], [0, 1], clamp);
            return (
              <circle
                key={i}
                cx={bx - 55 + rnd(i) * 150}
                cy={by - 70 + rnd(i + 500) * 170}
                r={5}
                fill={cores.amarelo}
                opacity={o}
              />
            );
          })
        : null}
    </svg>
  );
};
