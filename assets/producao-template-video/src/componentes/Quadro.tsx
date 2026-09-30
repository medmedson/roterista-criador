import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Poeira } from "./Poeira";

// Fundo de quadro de investigação: cortiça escura, granulação e vinheta
export const Quadro: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <AbsoluteFill style={{ overflow: "visible" }}>
      <svg style={{ position: "absolute", left: -2500, top: -2500, width: "calc(100% + 5000px)", height: "calc(100% + 5000px)", opacity: 0.55 }}>
        <filter id="cortica">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="4" />
          <feColorMatrix values="0 0 0 0 0.16  0 0 0 0 0.11  0 0 0 0 0.07  0 0 0 0.9 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cortica)" />
      </svg>
      {children}
    </AbsoluteFill>
  );
};

// Camada fixa por cima de tudo: granulação animada de filme + vinheta
export const Pelicula: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Poeira />
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.13, mixBlendMode: "overlay" }}>
        <filter id="grao">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed={frame % 12} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grao)" />
      </svg>
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)" }}
      />
    </AbsoluteFill>
  );
};
