import { AbsoluteFill, Img, staticFile } from "remotion";
import { c, fontes } from "../tema";

// Capa 1280×720, tema dossiê digital: rede desfocada ao fundo, nó-foto do TSE grande à direita com três setas
// (R$ 4,96 bi · ? · ↺), ficha "DADOS ABERTOS" à esquerda, chamada SIGA O / DINHEIRO com pincelada âmbar.
// Sem rostos, sem emoji, sem sigla de partido.
const nosFundo = [
  [120, 90], [300, 200], [520, 70], [700, 230], [880, 110], [1080, 60], [1200, 260], [180, 380], [420, 330], [640, 420], [980, 400],
];
const Pilula: React.FC<{ x: number; y: number; texto: string; cor: string }> = ({ x, y, texto, cor }) => (
  <div style={{ position: "absolute", left: x, top: y, padding: "6px 18px", borderRadius: 30, backgroundColor: c.grafite, border: `3px solid ${cor}`, fontFamily: fontes.mono, fontWeight: 600, fontSize: 34, color: cor, whiteSpace: "nowrap", boxShadow: `0 0 24px ${cor}66` }}>{texto}</div>
);
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: c.grafite, overflow: "hidden" }}>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0, filter: "blur(3px)", opacity: 0.5 }}>
      {nosFundo.map(([x, y], i) => {
        const [x2, y2] = nosFundo[(i + 3) % nosFundo.length];
        return <line key={`l${i}`} x1={x} y1={y} x2={x2} y2={y2} stroke={c.dinheiro} strokeWidth={2} opacity={0.6} />;
      })}
      {nosFundo.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={14} fill={c.dinheiro} opacity={0.7} />
      ))}
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(255,176,32,0.35), rgba(255,176,32,0) 45%), radial-gradient(ellipse at 100% 100%, rgba(255,176,32,0.3), rgba(255,176,32,0) 45%), radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0, opacity: 0.08, mixBlendMode: "screen" }}>
      <filter id="g">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={4} />
      </filter>
      <rect width="100%" height="100%" filter="url(#g)" />
    </svg>

    {/* setas saindo do nó do TSE */}
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <marker id="s" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L10 5L0 10z" fill={c.dinheiro} />
        </marker>
        <marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L10 5L0 10z" fill={c.ambar} />
        </marker>
      </defs>
      <path d="M800 170 Q650 90 520 110" stroke={c.dinheiro} strokeWidth={9} fill="none" markerEnd="url(#s)" />
      <path d="M790 300 Q640 300 560 330" stroke={c.dinheiro} strokeWidth={9} fill="none" markerEnd="url(#s)" />
      <path d="M1160 450 Q1120 520 1010 500 Q930 490 900 470" stroke={c.ambar} strokeWidth={9} fill="none" markerEnd="url(#a)" />
    </svg>
    <Pilula x={560} y={60} texto="R$ 4,96 bi" cor={c.dinheiro} />
    <Pilula x={600} y={250} texto="?" cor={c.dinheiro} />
    <Pilula x={1170} y={410} texto="↺" cor={c.ambar} />

    {/* nó-foto do TSE */}
    <div style={{ position: "absolute", left: 780, top: 60, width: 420, height: 420, borderRadius: 210, overflow: "hidden", boxShadow: `0 0 0 10px ${c.dinheiro}, 0 0 60px rgba(47,208,138,0.6), 0 30px 60px rgba(0,0,0,0.6)` }}>
      <Img src={staticFile("fotos/tse1.jpg")} style={{ width: 420, height: 420, objectFit: "cover", objectPosition: "50% 50%", filter: "saturate(0.8) contrast(1.15)" }} />
    </div>

    {/* ficha à esquerda */}
    <div style={{ position: "absolute", left: 50, top: 140, width: 420, padding: "18px 24px", borderRadius: 14, backgroundColor: c.painel, boxShadow: "0 18px 40px rgba(0,0,0,0.6)", border: `2px solid ${c.fio}` }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[c.alerta, c.ambar, c.dinheiro].map((k, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: k }} />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 70, color: c.ambar, lineHeight: 1 }}>↺</div>
        <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 30, color: c.claro, whiteSpace: "nowrap" }}>DADOS ABERTOS</div>
      </div>
      <div style={{ marginTop: 10, height: 10, width: "80%", borderRadius: 5, backgroundColor: c.fio }} />
      <div style={{ marginTop: 10, height: 10, width: "55%", borderRadius: 5, backgroundColor: c.fio }} />
    </div>

    {/* rótulo pequeno */}
    <div style={{ position: "absolute", left: 60, top: 60, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ width: 90, height: 3, backgroundColor: c.ambar }} />
      <div style={{ fontFamily: fontes.titulo, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: c.ambar, whiteSpace: "nowrap" }}>DADOS ABERTOS · TSE</div>
    </div>

    {/* chamada */}
    <div style={{ position: "absolute", left: 40, bottom: 26 }}>
      <div style={{ position: "relative", padding: "0 18px" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, height: 62, backgroundColor: c.ambar, opacity: 0.9, rotate: "-1.5deg", borderRadius: 6 }} />
        <div style={{ position: "relative", fontFamily: fontes.titulo, fontWeight: 900, fontSize: 176, lineHeight: 0.9, whiteSpace: "nowrap", textShadow: "0 5px 0 rgba(0,0,0,0.55)" }}>
          <span style={{ color: c.claro }}>SIGA O </span>
          <span style={{ color: c.dinheiro }}>DINHEIRO</span>
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
