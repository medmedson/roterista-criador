import { interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

// Relógio digital de contagem regressiva que termina em 23:59:59
export const Relogio: React.FC<{ x: number; y: number; entra: number }> = ({ x, y, entra }) => {
  const frame = useCurrentFrame();
  const restante = Math.max(0, Math.round(interpolate(frame, [entra, entra + 100], [48, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const s = String(59 - restante).padStart(2, "0");
  return (
    <div
      data-foco="relógio"
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% 0",
        opacity: interpolate(frame, [entra, entra + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 44, letterSpacing: 10, color: cores.papel }}>
        05 · OUTUBRO · 2026
      </div>
      <div
        style={{
          fontFamily: fontes.rotulo,
          fontWeight: 700,
          fontSize: 230,
          lineHeight: 1,
          color: cores.vermelho,
          textShadow: `0 0 40px rgba(200,32,30,0.55)`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        23:59:{s}
      </div>
    </div>
  );
};
