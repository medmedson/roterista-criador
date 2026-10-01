import { AbsoluteFill } from "remotion";
import { AmbulanciaCorte, MapaRotas } from "../componentes/KitSAMU";
import { c, fontes } from "../tema";

// Capa 1280×720, TEMA NOTURNO (pacote do roteiro): telefone com 192 à direita, ambulância em desenho à esquerda,
// chamada LIGUE 192. Sem rostos, pessoas, sangue, emoji ou setas; sem marca nem símbolo oficial.
const Rotulo: React.FC<{ texto: string; x: number; y: number }> = ({ texto, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
    <div style={{ width: 90, height: 3, backgroundColor: c.ambar }} />
    <div style={{ fontFamily: fontes.titulo, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: c.ambar, whiteSpace: "nowrap" }}>{texto}</div>
  </div>
);

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: c.noite, overflow: "hidden" }}>
    {/* fundo desfocado: mapa de pontos e régua de minutos */}
    <div style={{ position: "absolute", left: 300, top: -60, filter: "blur(3px)", opacity: 0.45 }}>
      <MapaRotas entra={-60} tamanho={760} />
    </div>
    <div style={{ position: "absolute", left: 40, right: 40, top: 90, height: 6, backgroundColor: c.ciano, opacity: 0.25, filter: "blur(2px)" }} />
    {/* giroflex vazando pelas bordas */}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(214,45,32,0.55), rgba(214,45,32,0) 45%), radial-gradient(ellipse at 100% 100%, rgba(245,165,36,0.45), rgba(245,165,36,0) 45%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)" }} />
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0, opacity: 0.08, mixBlendMode: "screen" }}>
      <filter id="g">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={5} />
      </filter>
      <rect width="100%" height="100%" filter="url(#g)" />
    </svg>

    {/* ambulância à esquerda */}
    <div style={{ position: "absolute", left: 30, top: 170 }}>
      <AmbulanciaCorte entra={-200} largura={560} />
    </div>
    <div style={{ position: "absolute", left: 390, top: 222, width: 70, height: 17, borderRadius: 6, background: c.ambar, boxShadow: "0 0 46px 18px rgba(245,165,36,0.75), 0 -30px 60px 10px rgba(214,45,32,0.45)" }} />

    {/* telefone com 192 à direita */}
    <div style={{ position: "absolute", left: 880, top: 60, width: 300, height: 470, borderRadius: 42, backgroundColor: "#071629", border: `8px solid ${c.fio}`, boxShadow: "0 0 60px rgba(53,198,232,0.45)", rotate: "6deg", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 150, color: c.ciano, textShadow: "0 0 30px rgba(53,198,232,0.9)" }}>192</div>
      <div style={{ position: "absolute", bottom: 40, width: 74, height: 74, borderRadius: 37, backgroundColor: "#1FA36A", boxShadow: "0 0 22px rgba(31,163,106,0.8)" }} />
    </div>

    <Rotulo texto="1989" x={300} y={470} />
    <Rotulo texto="2004" x={1030} y={548} />

    {/* chamada LIGUE 192 com pincelada vermelha */}
    <div style={{ position: "absolute", left: 50, bottom: 30 }}>
      <div style={{ position: "relative", padding: "0 18px" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, height: 60, backgroundColor: c.giroflex, opacity: 0.9, rotate: "-1.5deg", borderRadius: 6 }} />
        <div style={{ position: "relative", fontFamily: fontes.titulo, fontWeight: 900, fontSize: 168, lineHeight: 0.9, whiteSpace: "nowrap", textShadow: "0 4px 0 rgba(0,0,0,0.5)" }}>
          <span style={{ color: c.claro }}>LIGUE </span>
          <span style={{ color: c.ambar }}>192</span>
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
