import { AbsoluteFill } from "remotion";
import { CartaoSenha, PainelSenhas, Pauta, PlacaCRAS } from "../componentes/KitSUAS";
import { Pelicula } from "../componentes/Quadro";
import { fontes } from "../tema";

// Capa 1280×720, paleta própria (azul-marinho + âmbar): painel de senhas (direita), placa CRAS (esquerda), "SUAS? NUNCA OUVI."
const AMBAR = "#FFB020";
const Rotulo: React.FC<{ texto: string }> = ({ texto }) => (
  <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: "#e0b43c", borderTop: "3px solid #e0b43c", paddingTop: 6, textAlign: "center", width: 140 }}>{texto}</div>
);

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0F1F3D" }}>
    <div style={{ position: "absolute", inset: 0, filter: "blur(4px) saturate(0.6)", opacity: 0.45 }}>
      <div style={{ position: "absolute", left: 480, top: 40, rotate: "-6deg", scale: "0.7" }}><CartaoSenha numero={1} entra={-100} /></div>
      <div style={{ position: "absolute", left: 60, top: 380, rotate: "4deg", scale: "0.55", transformOrigin: "0 0" }}>
        <Pauta abre={-100} titulo="CÂMARA · ORDEM DO DIA" linhas={["PEC 383/2017", "Sistema Único de Assistência Social"]} destaque={0} marca={-100} largura={800} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 40, top: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, filter: "blur(1.5px)" }}>
      <PlacaCRAS acende={-100} largura={380} />
      <Rotulo texto="1988" />
    </div>
    <div style={{ position: "absolute", right: 30, top: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, rotate: "-2deg", filter: `drop-shadow(0 0 40px rgba(255,176,32,0.45))` }}>
      <PainelSenhas numero={1} rolaDe={1} entra={-100} largura={740} cor={AMBAR} />
      <Rotulo texto="2026" />
    </div>
    <div style={{ position: "absolute", left: 30, top: 24, padding: "4px 14px", backgroundImage: "linear-gradient(rgba(255,176,32,0.85), rgba(255,176,32,0.85))", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: "#0F1F3D" }}>CONTRA PROVA</div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 290, background: "linear-gradient(transparent, rgba(5,10,22,0.95) 45%)" }} />
    <div style={{ position: "absolute", left: 50, bottom: 40, display: "flex", flexDirection: "column" }}>
      <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 132, lineHeight: 0.95, color: "#ffffff", whiteSpace: "nowrap", textShadow: "0 6px 24px rgba(0,0,0,0.9)" }}>
        SUAS? <span style={{ color: "#f2c230" }}>NUNCA OUVI.</span>
      </div>
      <div style={{ height: 16, width: 860, backgroundColor: AMBAR, marginTop: 8, rotate: "-1deg", opacity: 0.9 }} />
    </div>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
    <Pelicula />
  </AbsoluteFill>
);
