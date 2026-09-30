import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { cores, fontes } from "../tema";

// Caixa térmica de transporte de órgão com visor em contagem regressiva
export const CaixaTermica: React.FC<{
  entra: number;
  inicioSeg?: number; // tempo inicial do visor em segundos (4 h = 14400)
  contaDe?: number; // frame em que começa a contar
  congela?: number; // frame em que o visor para
  aceleracao?: number; // segundos do visor por segundo de vídeo
  trancos?: number[];
  largura?: number;
}> = ({ entra, inicioSeg = 14400, contaDe, congela, aceleracao = 1, trancos = [], largura = 620 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fim = congela ?? Infinity;
  const f = Math.min(frame, fim);
  const decorrido = contaDe === undefined || f < contaDe ? 0 : ((f - contaDe) / fps) * aceleracao;
  const resto = Math.max(0, Math.round(inicioSeg - decorrido));
  const hh = String(Math.floor(resto / 3600)).padStart(2, "0");
  const mm = String(Math.floor((resto % 3600) / 60)).padStart(2, "0");
  const ss = String(resto % 60).padStart(2, "0");
  const tranco = trancos.reduce((a, t) => (frame - t >= 0 && frame - t < 10 ? a + (1 - (frame - t) / 10) * 8 : a), 0);
  const congelado = frame >= fim;
  return (
    <div
      data-foco="caixa térmica"
      style={{
        width: largura,
        opacity: interpolate(frame, [entra, entra + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translate: `${Math.sin(frame * 2.3) * tranco}px ${Math.cos(frame * 2.9) * tranco}px`,
        position: "relative",
        paddingTop: 60,
      }}
    >
      {/* alça */}
      <div style={{ position: "absolute", top: 0, left: "30%", width: "40%", height: 80, border: "16px solid #cfd3d6", borderBottom: "none", borderRadius: "40px 40px 0 0", boxSizing: "border-box" }} />
      <div
        style={{
          background: "linear-gradient(180deg, #f3f5f6, #cdd2d5)",
          borderRadius: 26,
          padding: "40px 40px 46px",
          boxShadow: "0 30px 50px rgba(0,0,0,0.75), inset 0 -10px 0 rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div style={{ backgroundColor: "#0b0b0b", borderRadius: 12, padding: "18px 34px", boxShadow: "inset 0 0 20px rgba(0,0,0,0.9)" }}>
          <div
            style={{
              fontFamily: fontes.rotulo,
              fontWeight: 700,
              fontSize: largura * 0.19,
              letterSpacing: 6,
              color: congelado ? "#ff8a80" : cores.vermelho,
              textShadow: "0 0 24px rgba(255,40,30,0.8)",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}
          >
            {hh}:{mm}:{ss}
          </div>
        </div>
        <div style={{ backgroundColor: cores.vermelho, color: cores.branco, fontFamily: fontes.rotulo, fontWeight: 700, fontSize: largura * 0.055, letterSpacing: 4, padding: "10px 24px" }}>
          ÓRGÃO PARA TRANSPLANTE
        </div>
      </div>
    </div>
  );
};
