import { interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

// Folhinha de calendário que "folheia" datas aleatórias até parar na data alvo
export const Folhinha: React.FC<{ dia: number; mes: number; ano: number; para: number; entra?: number; largura?: number }> = ({
  dia,
  mes,
  ano,
  para,
  entra = -10,
  largura = 460,
}) => {
  const frame = useCurrentFrame();
  const parado = frame >= para;
  const k = Math.floor(frame / 3);
  const r = (n: number) => {
    const v = Math.sin(k * 91.3 + n) * 43758.5;
    return v - Math.floor(v);
  };
  const d = parado ? dia : 1 + Math.floor(r(1) * 28);
  const m = parado ? mes : Math.floor(r(2) * 12);
  const a = parado ? ano : ano - 3 + Math.floor(r(3) * 4);
  return (
    <div
      data-foco={`folhinha ${dia}/${mes + 1}/${ano}`}
      style={{
        width: largura,
        backgroundColor: cores.papel,
        boxShadow: "0 24px 36px rgba(0,0,0,0.7)",
        opacity: interpolate(frame, [entra, entra + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        scale: String(parado ? interpolate(frame, [para, para + 8], [1.06, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1),
      }}
    >
      <div style={{ backgroundColor: cores.vermelho, color: cores.branco, textAlign: "center", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: largura * 0.13, letterSpacing: 8, padding: "10px 0" }}>
        {MESES[m]} · {a}
      </div>
      <div style={{ textAlign: "center", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: largura * 0.52, color: cores.tinta, lineHeight: 1.15 }}>
        {String(d).padStart(2, "0")}
      </div>
    </div>
  );
};
