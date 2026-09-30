import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

// Exemplo hipotético: 10 fichas apostadas; 9 voltam como prêmio, 1 fica com a casa.
// Repete em rodadas e acumula o saldo da casa para mostrar o efeito de longo prazo.
export const Fichas: React.FC<{ entra: number; rodadas: number; duracaoRodada?: number }> = ({ entra, rodadas, duracaoRodada = 70 }) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const f = frame - entra;
  const rodada = Math.max(0, Math.min(rodadas - 1, Math.floor(f / duracaoRodada)));
  const t = f - rodada * duracaoRodada;
  const casa = Math.max(0, Math.min(rodadas, Math.floor((f + duracaoRodada * 0.25) / duracaoRodada)));
  const W = 1500;
  const H = 520;
  return (
    <div data-foco="fichas" style={{ position: "relative", width: W, height: H, opacity: interpolate(frame, [0, 10], [0, 1], clamp) }}>
      {[
        { x: 0, rot: "APOSTADOR" },
        { x: W / 2 - 150, rot: "MÁQUINA" },
        { x: W - 300, rot: "CASA" },
      ].map((c) => (
        <div key={c.rot} style={{ position: "absolute", left: c.x, top: 60, width: 300, height: 300, border: `4px solid ${cores.papelEscuro}`, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14, boxSizing: "border-box", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 38, letterSpacing: 4, color: cores.papelEscuro }}>
          {c.rot}
        </div>
      ))}
      {f >= 0
        ? Array.from({ length: 10 }, (_, i) => {
            const ida = interpolate(t, [i * 2, i * 2 + 18], [0, 1], { ...clamp, easing: Easing.bezier(0.4, 0, 0.3, 1) });
            const volta = interpolate(t, [34 + i * 2, 34 + i * 2 + 18], [0, 1], { ...clamp, easing: Easing.bezier(0.4, 0, 0.3, 1) });
            const paraCasa = i === 9;
            const x0 = 150;
            const xm = W / 2;
            const xf = paraCasa ? W - 150 : 150;
            const x = ida < 1 ? x0 + (xm - x0) * ida : xm + (xf - xm) * volta;
            const y = 170 - Math.sin(Math.PI * (ida < 1 ? ida : volta)) * 120 + (i % 3) * 22;
            return (
              <div key={i} style={{ position: "absolute", left: x - 26, top: y, width: 52, height: 52, borderRadius: "50%", backgroundColor: paraCasa ? cores.vermelho : cores.amarelo, border: "4px solid rgba(0,0,0,0.35)", boxSizing: "border-box" }} />
            );
          })
        : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "space-between", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 46, color: cores.papel }}>
        <span>Rodada {rodada + 1}</span>
        <span style={{ color: cores.amarelo }}>Aposta R$ 100 → prêmio R$ 90</span>
        <span style={{ color: cores.vermelho }}>Casa: R$ {casa * 10}</span>
      </div>
    </div>
  );
};
