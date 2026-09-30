import { interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

const SIMBOLOS = ["7", "★", "♦", "♣", "◆", "♥"];

// Celular genérico com duas áreas da mesma plataforma: palpite esportivo e caça-níquel abstrato
export const Celular: React.FC<{
  entra: number;
  paraRolos: number;
  destacarCassino?: number;
  vitoria?: boolean;
  contarRodadas?: number;
}> = ({ entra, paraRolos, destacarCassino, vitoria = false, contarRodadas }) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const escurece = destacarCassino === undefined ? 0 : interpolate(frame, [destacarCassino, destacarCassino + 15], [0, 0.7], clamp);
  return (
    <div
      data-foco="celular"
      style={{
        width: 620,
        height: 1180,
        borderRadius: 70,
        backgroundColor: "#050505",
        border: "14px solid #1a1a1a",
        boxShadow: "0 40px 80px rgba(0,0,0,0.9), inset 0 0 0 2px #333",
        padding: "70px 34px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 28,
        opacity: interpolate(frame, [entra, entra + 12], [0, 1], clamp),
        translate: `0 ${interpolate(frame, [entra, entra + 20], [80, 0], clamp)}px`,
      }}
    >
      {/* Palpite esportivo */}
      <div style={{ position: "relative", borderRadius: 24, backgroundColor: "#16301f", padding: 30, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontFamily: fontes.rotulo, fontSize: 30, letterSpacing: 4, color: "#9fd3a8" }}>PALPITE ESPORTIVO</div>
        <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 52, color: cores.branco }}>TIME A × TIME B</div>
        <div style={{ display: "flex", gap: 14 }}>
          {["2,10", "3,40", "3,25"].map((o, i) => (
            <div key={o} style={{ flex: 1, textAlign: "center", borderRadius: 14, backgroundColor: "#0c1c12", padding: "14px 0", fontFamily: fontes.rotulo, fontSize: 40, color: cores.branco }}>
              <div style={{ fontSize: 22, opacity: 0.6 }}>{["1", "X", "2"][i]}</div>
              {o}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: 24, backgroundColor: "#000", opacity: escurece }} />
      </div>
      {/* Caça-níquel abstrato */}
      <div
        style={{
          flex: 1,
          borderRadius: 24,
          background: "linear-gradient(180deg, #3a0d0d, #1a0505)",
          padding: 30,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          boxShadow: destacarCassino !== undefined && frame >= destacarCassino ? `0 0 0 6px ${cores.vermelho}` : undefined,
        }}
      >
        <div style={{ fontFamily: fontes.rotulo, fontSize: 30, letterSpacing: 4, color: "#f0a0a0" }}>CASSINO VIRTUAL</div>
        <div style={{ display: "flex", gap: 14, flex: 1 }}>
          {[0, 1, 2].map((c) => {
            // Modo "repetição": os rolos param e voltam a girar a cada 24 frames
            const ciclo = contarRodadas !== undefined && frame >= contarRodadas ? (frame - contarRodadas) % 24 : null;
            const parado = ciclo !== null ? ciclo > 12 + c * 3 : frame >= paraRolos + c * 10;
            const giro = parado ? 0 : (frame * (1.4 + c * 0.3)) % SIMBOLOS.length;
            const idx = parado ? (vitoria ? [0, 0, 0] : [0, 0, 1])[c] : Math.floor(giro);
            return (
              <div
                key={c}
                style={{
                  flex: 1,
                  borderRadius: 16,
                  backgroundColor: "#f4efe6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fontes.rotulo,
                  fontWeight: 700,
                  fontSize: 150,
                  color: cores.vermelho,
                  filter: parado ? undefined : "blur(3px)",
                  overflow: "hidden",
                }}
              >
                {SIMBOLOS[idx]}
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", borderRadius: 40, backgroundColor: cores.amarelo, padding: "18px 0", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 44, color: "#1a0505" }}>
          {vitoria && frame >= paraRolos + 30
            ? "PRÊMIO!"
            : contarRodadas !== undefined && frame >= contarRodadas
              ? `RODADA ${Math.floor((frame - contarRodadas) / 24) + 1}`
              : "GIRAR"}
        </div>
      </div>
    </div>
  );
};
