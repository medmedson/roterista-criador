import { AbsoluteFill, useCurrentFrame } from "remotion";

// Luzes desfocadas (bokeh) flutuando devagar: clima dramático sem encenar pessoas
export const Luzes: React.FC<{ quantidade?: number; cor?: string }> = ({ quantidade = 26, cor = "#f2c230" }) => {
  const frame = useCurrentFrame();
  const rnd = (i: number) => {
    const v = Math.sin(i * 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none", filter: "blur(18px)" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        {Array.from({ length: quantidade }, (_, i) => {
          const x = (rnd(i) * 2200 + frame * (0.2 + rnd(i + 1) * 0.5)) % 2200 - 140;
          const y = rnd(i + 2) * 1080 + Math.sin(frame / 60 + i) * 20;
          const r = 20 + rnd(i + 3) * 70;
          const o = 0.05 + 0.12 * (0.5 + 0.5 * Math.sin(frame / 40 + i * 2));
          return <circle key={i} cx={x} cy={y} r={r} fill={i % 4 === 0 ? "#c8201e" : cor} opacity={o} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
