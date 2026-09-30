import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

// Gráfico de dois pontos (início e fim do período). Não inventa pontos intermediários.
export const Subida: React.FC<{ entra: number; de: string; ate: string; largura: number; altura: number; rotuloDe: string; rotuloAte: string }> = ({
  entra,
  de,
  ate,
  largura,
  altura,
  rotuloDe,
  rotuloAte,
}) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const p = interpolate(frame, [entra + 10, entra + 55], [0, 1], { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) });
  const x1 = 60, y1 = altura - 90, x2 = largura - 60, y2 = 70;
  return (
    <div data-foco="gráfico de subida" style={{ position: "relative", width: largura, height: altura, opacity: interpolate(frame, [entra, entra + 8], [0, 1], clamp) }}>
      <svg width={largura} height={altura} style={{ position: "absolute", inset: 0 }}>
        <line x1={x1} y1={altura - 50} x2={x2} y2={altura - 50} stroke={cores.papelEscuro} strokeWidth={3} />
        <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={cores.vermelho} strokeWidth={10} strokeLinecap="round" />
        <circle cx={x1} cy={y1} r={16} fill={cores.papel} />
        {p >= 1 ? <circle cx={x2} cy={y2} r={16} fill={cores.vermelho} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 0, top: altura - 40, fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 40, color: cores.papel }}>{rotuloDe}</div>
      <div style={{ position: "absolute", right: 0, top: altura - 40, fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 40, color: cores.papel }}>{rotuloAte}</div>
      <div style={{ position: "absolute", left: x1 - 30, top: y1 - 80, fontFamily: fontes.maquina, fontSize: 36, color: cores.papelEscuro }}>{de}</div>
      <div style={{ position: "absolute", right: 0, top: y2 - 60, fontFamily: fontes.maquina, fontSize: 36, color: cores.vermelho, opacity: p }}>{ate}</div>
    </div>
  );
};
