import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores } from "../tema";

// Fio vermelho entre dois pontos do quadro, com leve curva de gravidade
export const Fio: React.FC<{ de: [number, number]; ate: [number, number]; entra: number; duracao?: number }> = ({
  de,
  ate,
  entra,
  duracao = 20,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [entra, entra + duracao], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.2, 1),
  });
  const mx = (de[0] + ate[0]) / 2;
  const my = (de[1] + ate[1]) / 2 + Math.hypot(ate[0] - de[0], ate[1] - de[1]) * 0.08;
  return (
    <path
      d={`M${de[0]} ${de[1]} Q${mx} ${my} ${ate[0]} ${ate[1]}`}
      stroke={cores.fio}
      strokeWidth={5}
      fill="none"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
      style={{ filter: "drop-shadow(0 6px 4px rgba(0,0,0,0.6))" }}
    />
  );
};
