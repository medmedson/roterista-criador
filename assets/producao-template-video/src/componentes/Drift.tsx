import { interpolate, useCurrentFrame } from "remotion";

// Movimento lento contínuo (zoom + deslize) para a tela nunca ficar parada em cenas de leitura/mapa.
// dur = duração da cena em frames; zoom = escala final (1.06 = 6%); dx/dy = deslize em px até o fim.
export const Drift: React.FC<{ dur: number; zoom?: number; dx?: number; dy?: number; children: React.ReactNode; origem?: string }> = ({
  dur,
  zoom = 1.06,
  dx = 0,
  dy = 0,
  origem = "50% 45%",
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, Math.max(1, dur)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, scale: String(1 + (zoom - 1) * p), translate: `${dx * p}px ${dy * p}px`, transformOrigin: origem }}>{children}</div>
  );
};
