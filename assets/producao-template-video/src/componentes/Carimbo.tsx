import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

export const Carimbo: React.FC<{ x: number; y: number; texto: string; entra: number; rotacao?: number; tamanho?: number; cor?: string }> = ({
  x,
  y,
  texto,
  entra,
  rotacao = -12,
  tamanho = 88,
  cor = cores.vermelho,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      data-foco={`carimbo: ${texto}`}
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        rotate: `${rotacao}deg`,
        opacity: interpolate(frame, [entra, entra + 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        scale: String(
          interpolate(frame, [entra, entra + 6], [1.2, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.5, 0, 0.9, 0.6),
          }),
        ),
        border: `8px solid ${cor}`,
        borderRadius: 10,
        padding: "8px 34px",
        color: cor,
        fontFamily: fontes.rotulo,
        fontWeight: 700,
        fontSize: tamanho,
        letterSpacing: 8,
        whiteSpace: "nowrap",
        backgroundColor: "rgba(20,12,10,0.55)",
        textShadow: "0 0 18px rgba(200,32,30,0.35)",
      }}
    >
      {texto}
    </div>
  );
};
