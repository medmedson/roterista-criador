import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

// Placar de votação: números sobem de zero até o resultado
export const Placar: React.FC<{
  x: number;
  y: number;
  titulo: string;
  sim: number;
  nao: number;
  legenda: string;
  entra: number;
}> = ({ x, y, titulo, sim, nao, legenda, entra }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [entra + 6, entra + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.7, 0.2, 1),
  });
  return (
    <div
      data-foco={`placar: ${titulo}`}
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% 0",
        opacity: interpolate(frame, [entra, entra + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        backgroundColor: "#0a0908",
        border: `4px solid ${cores.papelEscuro}`,
        padding: "40px 70px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 30px 40px rgba(0,0,0,0.8)",
      }}
    >
      <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 42, letterSpacing: 8, color: cores.papel, whiteSpace: "nowrap" }}>{titulo}</div>
      <div style={{ display: "flex", gap: 60, alignItems: "baseline", fontFamily: fontes.rotulo, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 240, lineHeight: 1, color: cores.amarelo }}>{Math.round(sim * p)}</div>
          <div style={{ fontSize: 36, letterSpacing: 6, color: cores.papelEscuro }}>SIM</div>
        </div>
        <div style={{ fontSize: 120, color: cores.papelEscuro }}>×</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 240, lineHeight: 1, color: cores.vermelho }}>{Math.round(nao * p)}</div>
          <div style={{ fontSize: 36, letterSpacing: 6, color: cores.papelEscuro }}>NÃO</div>
        </div>
      </div>
      <div style={{ fontFamily: fontes.maquina, fontSize: 38, color: cores.papel, opacity: p }}>{legenda}</div>
    </div>
  );
};
