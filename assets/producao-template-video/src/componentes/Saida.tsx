import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// Transições de saída de uma parte (frames relativos à Sequence da parte)
// "zoom": atravessa a tela (zoom-through); "chicote": desliza rápido para o lado; "fade": fusão; "sepia": vira sépia
export const Saida: React.FC<{ duracao: number; tipo: "zoom" | "chicote" | "fade" | "sepia"; frames?: number; children: React.ReactNode }> = ({
  duracao,
  tipo,
  frames = 10,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [duracao - frames, duracao], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const estilo: React.CSSProperties =
    tipo === "zoom"
      ? { scale: String(1 + p * 2.5), opacity: 1 - p }
      : tipo === "chicote"
        ? { translate: `${-p * 1920}px 0`, filter: `blur(${p * 20}px)` }
        : tipo === "sepia"
          ? { filter: `sepia(${p}) brightness(${1 - p * 0.15})` }
          : { opacity: 1 - p };
  // durante a transição, cortes são propositais (a auditoria trata como movimento de câmera)
  return (
    <AbsoluteFill style={estilo} {...(p > 0 && tipo !== "sepia" ? { "data-camera-movendo": true } : {})}>
      {children}
    </AbsoluteFill>
  );
};
