import { AbsoluteFill, useCurrentFrame } from "remotion";

// Partículas de poeira flutuando na luz: dá vida a qualquer cena parada
export const Poeira: React.FC<{ quantidade?: number }> = ({ quantidade = 40 }) => {
  const frame = useCurrentFrame();
  const rnd = (i: number) => {
    const v = Math.sin(i * 127.1) * 43758.5453;
    return v - Math.floor(v);
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        {Array.from({ length: quantidade }, (_, i) => {
          const vel = 0.15 + rnd(i) * 0.35;
          const x = (rnd(i + 1) * 1920 + frame * vel * (rnd(i + 2) > 0.5 ? 1 : -1) + 1920) % 1920;
          const y = (rnd(i + 3) * 1080 - frame * vel * 0.6 + 1080 * 10) % 1080;
          const brilho = 0.15 + 0.25 * (0.5 + 0.5 * Math.sin(frame / (20 + rnd(i) * 30) + i));
          return <circle key={i} cx={x} cy={y} r={1 + rnd(i + 4) * 2.2} fill="#f4e6c8" opacity={brilho} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
