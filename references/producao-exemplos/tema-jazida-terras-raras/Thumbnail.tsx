import { AbsoluteFill } from "remotion";
import { Amostra, ImaCampo, TabelaPeriodica } from "../componentes/KitJazida";
import { c, fontes } from "../tema";

// Capa 1280×720, TEMA JAZIDA: tabela periódica com os 17 em ferrugem à direita, ímã à esquerda, cristal em primeiro plano,
// chamada RARAS? NÃO. Sem rostos, bandeiras, símbolo de radioatividade ou setas.
const Rotulo: React.FC<{ texto: string; x: number; y: number }> = ({ texto, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
    <div style={{ width: 90, height: 3, backgroundColor: c.enxofre }} />
    <div style={{ fontFamily: fontes.titulo, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: c.enxofre, whiteSpace: "nowrap" }}>{texto}</div>
  </div>
);
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: c.grafite, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(30,34,38,0) 55%, rgba(181,83,42,0.55) 100%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }} />
    <div style={{ position: "absolute", left: 540, top: 40 }}>
      <TabelaPeriodica entra={-60} celula={38} passo={0} />
    </div>
    <div style={{ position: "absolute", left: 30, top: 70 }}>
      <ImaCampo entra={-60} giraEm={-30} tamanho={420} />
    </div>
    <div style={{ position: "absolute", left: 1040, top: 440 }}>
      <Amostra entra={-60} nome="" giraEm={-100} tamanho={190} />
    </div>
    <Rotulo texto="17 ELEMENTOS" x={880} y={448} />
    <Rotulo texto="1794" x={235} y={462} />
    <div style={{ position: "absolute", left: 50, bottom: 30 }}>
      <div style={{ position: "relative", padding: "0 18px" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, height: 58, backgroundColor: c.enxofre, opacity: 0.9, rotate: "-1.5deg", borderRadius: 6 }} />
        <div style={{ position: "relative", fontFamily: fontes.titulo, fontWeight: 900, fontSize: 168, lineHeight: 0.9, whiteSpace: "nowrap", textShadow: "0 4px 0 rgba(0,0,0,0.5)" }}>
          <span style={{ color: c.areia }}>RARAS? </span>
          <span style={{ color: c.ferrugem }}>NÃO.</span>
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
