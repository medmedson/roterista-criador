import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// Clarão rápido de cor nos momentos dramáticos
export const Clarao: React.FC<{ em: number[]; cor?: string; forca?: number }> = ({ em, cor = "#c8201e", forca = 0.45 }) => {
  const frame = useCurrentFrame();
  const o = em.reduce(
    (acc, f) => Math.max(acc, interpolate(frame - f, [0, 2, 16], [0, forca, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
    0,
  );
  if (o <= 0) return null;
  return <AbsoluteFill style={{ backgroundColor: cor, opacity: o, mixBlendMode: "screen", pointerEvents: "none" }} />;
};
