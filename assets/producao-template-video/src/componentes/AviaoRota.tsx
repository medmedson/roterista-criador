import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores } from "../tema";

// Avião visto de cima percorrendo uma rota tracejada entre dois pontos (coordenadas do SVG pai)
export const AviaoRota: React.FC<{ de: [number, number]; ate: [number, number]; entra: number; duracao?: number; escala?: number }> = ({
  de,
  ate,
  entra,
  duracao = 60,
  escala = 1,
}) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const p = interpolate(frame, [entra, entra + duracao], [0, 1], { ...clamp, easing: Easing.bezier(0.45, 0, 0.3, 1) });
  const cx = (de[0] + ate[0]) / 2 + (ate[1] - de[1]) * 0.25;
  const cy = (de[1] + ate[1]) / 2 - (ate[0] - de[0]) * 0.25;
  const q = (tt: number) => [
    (1 - tt) ** 2 * de[0] + 2 * (1 - tt) * tt * cx + tt ** 2 * ate[0],
    (1 - tt) ** 2 * de[1] + 2 * (1 - tt) * tt * cy + tt ** 2 * ate[1],
  ];
  const [x, y] = q(p);
  const [x2, y2] = q(Math.min(1, p + 0.01));
  const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
  const pouso = interpolate(frame, [entra + duracao, entra + duracao + 24], [0, 1], clamp);
  if (frame < entra) return null;
  const caminho = `M${de[0]} ${de[1]} Q${cx} ${cy} ${ate[0]} ${ate[1]}`;
  const id = `rota-${entra}-${Math.round(de[0])}-${Math.round(ate[0])}`;
  return (
    <g>
      <defs>
        <mask id={id}>
          <path d={caminho} fill="none" stroke="#fff" strokeWidth={12 * escala} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
        </mask>
      </defs>
      <path d={caminho} fill="none" stroke={cores.papel} strokeWidth={3 * escala} strokeDasharray={`${9 * escala} ${9 * escala}`} opacity={0.85} mask={`url(#${id})`} />
      <circle cx={de[0]} cy={de[1]} r={8 * escala} fill={cores.amarelo} />
      {pouso > 0 ? <circle cx={ate[0]} cy={ate[1]} r={(10 + pouso * 50) * escala} fill="none" stroke={cores.amarelo} strokeWidth={4} opacity={1 - pouso} /> : null}
      {pouso > 0 ? <circle cx={ate[0]} cy={ate[1]} r={9 * escala} fill={cores.amarelo} /> : null}
      <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${escala})`} opacity={pouso > 0.5 ? 1 - pouso : 1}>
        <path d="M22 0 L6 -4 L-2 -22 L-8 -22 L-4 -4 L-16 -3 L-21 -10 L-25 -10 L-22 0 L-25 10 L-21 10 L-16 3 L-4 4 L-8 22 L-2 22 L6 4 Z" fill={cores.branco} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.7))" }} />
      </g>
    </g>
  );
};
