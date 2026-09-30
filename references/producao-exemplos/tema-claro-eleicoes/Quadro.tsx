import { DesfazCamera } from "./CameraViva";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { c } from "../tema";

// TEMA CLARO: fundo de papel branco-gelo com fibra suave e uma grade de infográfico quase invisível.
// (Nos vídeos anteriores era cortiça escura; aqui a linguagem é editorial/infográfico limpo.)
export const Quadro: React.FC<{ children?: React.ReactNode; grade?: boolean }> = ({ children, grade = true }) => {
  return (
    <AbsoluteFill style={{ overflow: "visible", backgroundColor: c.papel }}>
      <svg style={{ position: "absolute", left: -2500, top: -2500, width: "calc(100% + 5000px)", height: "calc(100% + 5000px)", opacity: 0.35 }}>
        <filter id="fibra">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7" />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.55  0 0 0 0 0.6  0 0 0 0.18 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#fibra)" />
        {grade ? (
          <>
            <defs>
              <pattern id="grade" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke={c.fio} strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grade)" opacity={0.35} />
          </>
        ) : null}
      </svg>
      {children}
    </AbsoluteFill>
  );
};

// Camada fixa por cima de tudo: grão levíssimo e luz de papel (sem vinheta escura)
export const Pelicula: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <DesfazCamera>
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.05, mixBlendMode: "multiply" }}>
        <filter id="grao">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={frame % 12} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grao)" />
      </svg>
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 55%, rgba(27,31,42,0.07) 100%)" }}
      />
    </AbsoluteFill>
    </DesfazCamera>
  );
};
