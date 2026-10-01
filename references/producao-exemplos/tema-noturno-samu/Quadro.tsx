import { DesfazCamera } from "./CameraViva";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { c } from "../tema";

// TEMA NOTURNO (SAMU): azul-noite com grade de telemetria ciano bem fraca e um brilho de tela ao centro.
export const Quadro: React.FC<{ children?: React.ReactNode; grade?: boolean }> = ({ children, grade = true }) => {
  return (
    <AbsoluteFill style={{ overflow: "visible", backgroundColor: c.papel }}>
      <svg style={{ position: "absolute", left: -2500, top: -2500, width: "calc(100% + 5000px)", height: "calc(100% + 5000px)", opacity: 0.35 }}>
        <filter id="fibra">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7" />
          <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.45  0 0 0 0 0.6  0 0 0 0.10 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#fibra)" />
        {grade ? (
          <>
            <defs>
              <pattern id="grade" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke={c.ciano} strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grade)" opacity={0.22} />
          </>
        ) : null}
      </svg>
      {children}
    </AbsoluteFill>
  );
};

// Camada fixa por cima de tudo: grão leve, brilho de tela ao centro e vinheta escura
export const Pelicula: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <DesfazCamera>
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.06, mixBlendMode: "screen" }}>
        <filter id="grao">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={frame % 12} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grao)" />
      </svg>
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(53,198,232,0.07) 0%, rgba(11,31,58,0) 55%, rgba(0,0,0,0.45) 100%)" }}
      />
    </AbsoluteFill>
    </DesfazCamera>
  );
};
