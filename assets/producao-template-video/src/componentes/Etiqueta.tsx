import { interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

// Etiqueta de checagem "A ≠ B": deixa claro o que um número NÃO é
export const Etiqueta: React.FC<{ a: string; b: string; entra: number; simbolo?: string }> = ({ a, b, entra, simbolo = "≠" }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [entra, entra + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      data-foco={`etiqueta: ${a} ${simbolo} ${b}`}
      style={{
        opacity: o,
        translate: `${interpolate(frame, [entra, entra + 12], [-40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px 0`,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "18px 32px",
        backgroundColor: "rgba(10,8,7,0.75)",
        borderLeft: `8px solid ${cores.vermelho}`,
        fontFamily: fontes.rotulo,
        fontWeight: 700,
        fontSize: 48,
        color: cores.papel,
        whiteSpace: "nowrap",
        width: "fit-content",
      }}
    >
      <span>{a}</span>
      {simbolo ? <span style={{ color: cores.vermelho, fontSize: 64 }}>{simbolo}</span> : null}
      <span>{b}</span>
    </div>
  );
};
