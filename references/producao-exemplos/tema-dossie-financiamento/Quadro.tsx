import { DesfazCamera } from "./CameraViva";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { c } from "../tema";

// TEMA DOSSIÊ DIGITAL: grafite com pontos de grade bem fracos (papel quadriculado de planilha) e brilho verde ao centro.
export const Quadro: React.FC<{ children?: React.ReactNode; grade?: boolean }> = ({ children, grade = true }) => {
  return (
    <AbsoluteFill style={{ overflow: "visible", backgroundColor: c.papel }}>
      <svg style={{ position: "absolute", left: -2500, top: -2500, width: "calc(100% + 5000px)", height: "calc(100% + 5000px)", opacity: 0.4 }}>
        <filter id="fibra">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="11" />
          <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.35  0 0 0 0 0.32  0 0 0 0.08 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#fibra)" />
        {grade ? (
          <>
            <defs>
              <pattern id="pontos" width="48" height="48" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill={c.cinza} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pontos)" opacity={0.18} />
          </>
        ) : null}
      </svg>
      {children}
    </AbsoluteFill>
  );
};

// Camada fixa por cima de tudo: grão leve, brilho verde ao centro e vinheta escura
export const Pelicula: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <DesfazCamera>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.06, mixBlendMode: "screen" }}>
          <filter id="grao">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={Math.floor(frame / 2) % 12} />
          </filter>
          <rect width="100%" height="100%" filter="url(#grao)" />
        </svg>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(47,208,138,0.06) 0%, rgba(14,17,20,0) 55%, rgba(0,0,0,0.5) 100%)" }} />
      </AbsoluteFill>
    </DesfazCamera>
  );
};
