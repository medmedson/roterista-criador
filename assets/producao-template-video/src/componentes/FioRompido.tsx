import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores } from "../tema";

// Fio vermelho que se estica e depois arrebenta no meio: as pontas caem com a gravidade
export const FioRompido: React.FC<{ de: [number, number]; ate: [number, number]; entra: number; quebra: number }> = ({
  de,
  ate,
  entra,
  quebra,
}) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const p = interpolate(frame, [entra, entra + 20], [0, 1], { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) });
  const queda = interpolate(frame, [quebra, quebra + 28], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0, 0.7, 1) });
  const tensao = interpolate(frame, [quebra - 20, quebra], [0, 1], clamp) * (frame < quebra ? 1 : 0);
  const mx = (de[0] + ate[0]) / 2;
  const my = (de[1] + ate[1]) / 2;
  const tremor = Math.sin(frame * 3) * 3 * tensao;
  if (frame < quebra) {
    return (
      <path
        d={`M${de[0]} ${de[1]} Q${mx} ${my + 40 - 36 * tensao + tremor} ${ate[0]} ${ate[1]}`}
        stroke={cores.fio}
        strokeWidth={5}
        fill="none"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
    );
  }
  const pendura = 30 + queda * 170;
  return (
    <g>
      <path d={`M${de[0]} ${de[1]} Q${de[0] + (mx - de[0]) * 0.5} ${my + pendura * 0.4} ${mx - 20 - queda * 40} ${my + pendura}`} stroke={cores.fio} strokeWidth={5} fill="none" />
      <path d={`M${ate[0]} ${ate[1]} Q${ate[0] - (ate[0] - mx) * 0.5} ${my + pendura * 0.4} ${mx + 20 + queda * 40} ${my + pendura}`} stroke={cores.fio} strokeWidth={5} fill="none" />
      <circle cx={mx} cy={my} r={interpolate(frame, [quebra, quebra + 10], [4, 60], clamp)} fill="none" stroke={cores.amarelo} strokeWidth={4} opacity={interpolate(frame, [quebra, quebra + 10], [1, 0], clamp)} />
    </g>
  );
};
