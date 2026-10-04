import { AbsoluteFill, Img, staticFile } from "remotion";
import { c, fontes } from "../tema";

// Capa 1280×720 no estilo pedido pelo usuário (referência YuriRDev): dois candidatos de lados opostos, mesmo tamanho
// de cabeça e o MESMO tratamento (faixa preta igual nos olhos, sem texto), fundo vermelho-escuro com gráfico e
// planilha desfocados, chamada INVESTIGANDO POLÍTICOS E CANDIDATOS. Equilíbrio: nenhum lado em destaque.
// Fotos: Lula (Ricardo Stuckert/PR, CC BY-SA 4.0) e Flávio Bolsonaro (Carlos Moura/Agência Senado, CC BY-SA 4.0).
const Faixa: React.FC<{ x: number; y: number; w: number; rot: number }> = ({ x, y, w, rot }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - 30, width: w, height: 60, background: "#0b0b0b", transform: `rotate(${rot}deg)`, boxShadow: "0 4px 10px rgba(0,0,0,0.6)" }} />
);
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1a0606", overflow: "hidden" }}>
    {/* fundo: planilha e gráfico desfocados */}
    <div style={{ position: "absolute", inset: 0, filter: "blur(4px)", opacity: 0.55 }}>
      {["receitas_candidatos_2026.csv", "despesas_contratadas_2022.csv", "doação circular · 38.267 sinais", "bens declarados · R$ 12 bi"].map((t, i) => (
        <div key={i} style={{ position: "absolute", left: 560 + (i % 2) * 60, top: 30 + i * 170, fontFamily: fontes.texto, fontWeight: 800, fontSize: 46, color: "#d9b0a8", whiteSpace: "nowrap" }}>{t}</div>
      ))}
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        <polyline points="560,520 650,470 720,500 800,380 880,420 960,300 1040,340 1120,220 1200,260 1280,150" fill="none" stroke={c.marca} strokeWidth={6} />
        {[650, 800, 960, 1120].map((x, i) => (
          <circle key={i} cx={x} cy={[470, 380, 300, 220][i]} r={10} fill={c.marca} />
        ))}
      </svg>
    </div>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 15% 50%, rgba(255,40,30,0.35), rgba(0,0,0,0) 55%), radial-gradient(ellipse at 100% 0%, rgba(255,40,30,0.3), rgba(0,0,0,0) 45%), linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)" }} />

    {/* Flávio atrás, à direita do Lula */}
    <div style={{ position: "absolute", left: -20, top: 40 }}>
      <Img src={staticFile("fotos/pessoas/flavio-recorte.png")} style={{ width: 1088, height: 1278, filter: "contrast(1.08) saturate(0.95) drop-shadow(0 20px 30px rgba(0,0,0,0.6))" }} />
    </div>
    {/* Lula à frente, à esquerda */}
    <div style={{ position: "absolute", left: -175, top: -80 }}>
      <Img src={staticFile("fotos/pessoas/lula-recorte.png")} style={{ width: 752, height: 1062, filter: "contrast(1.08) saturate(0.95) drop-shadow(0 20px 30px rgba(0,0,0,0.6))" }} />
    </div>
    <Faixa x={-175 + 381} y={-80 + 335} w={230} rot={-3} />
    <Faixa x={572} y={224} w={140} rot={-4} />

    {/* chamada: branco com contorno preto + faixa vermelha com texto branco */}
    <div style={{ position: "absolute", right: 22, top: 300, display: "flex", flexDirection: "column", alignItems: "flex-end", transform: "rotate(-4deg)", gap: 6 }}>
      <div style={{ fontFamily: fontes.titulo, fontSize: 150, lineHeight: 0.92, color: "#fff", WebkitTextStroke: "7px #000", paintOrder: "stroke fill", textShadow: "0 10px 0 #000, 0 0 40px rgba(0,0,0,0.8)", whiteSpace: "nowrap" }}>INVESTIGANDO</div>
      <div style={{ background: "#ff1f12", padding: "4px 26px 10px", transform: "skewX(-8deg)", boxShadow: "0 10px 0 #000, 0 0 50px rgba(255,31,18,0.7)" }}>
        <div style={{ fontFamily: fontes.titulo, fontSize: 104, lineHeight: 1, color: "#fff", transform: "skewX(8deg)", textShadow: "0 5px 0 rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}>POLÍTICOS E CANDIDATOS</div>
      </div>
    </div>
  </AbsoluteFill>
);
