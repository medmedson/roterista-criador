import { interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

// Trecho marcado com caneta marca-texto, que "pinta" da esquerda para a direita
export const Marca: React.FC<{ entra: number; children: React.ReactNode }> = ({ entra, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [entra, entra + 18], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <span
      style={{
        backgroundImage: "linear-gradient(rgba(242,194,48,0.75), rgba(242,194,48,0.75))",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${p}% 78%`,
        backgroundPosition: "0 70%",
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
};

// Folha de documento oficial
export const Folha: React.FC<{ largura: number; children: React.ReactNode }> = ({ largura, children }) => (
  <div
    data-foco="documento"
    data-corte-ok
    style={{
      width: largura,
      backgroundColor: "#efe9dc",
      backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(160,130,80,0.12))",
      color: cores.tinta,
      fontFamily: fontes.documento,
      fontSize: 44,
      lineHeight: 1.55,
      padding: "90px 110px",
      boxShadow: "0 40px 60px rgba(0,0,0,0.85)",
      display: "flex",
      flexDirection: "column",
      gap: 34,
    }}
  >
    {children}
  </div>
);
