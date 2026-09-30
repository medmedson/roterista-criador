import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

// Número grande que conta de 0 até o valor, com rótulo embaixo
export const Contador: React.FC<{
  valor: number;
  entra: number;
  prefixo?: string;
  sufixo?: string;
  casas?: number;
  rotulo: string;
  cor?: string;
  tamanho?: number;
}> = ({ valor, entra, prefixo = "", sufixo = "", casas = 0, rotulo, cor = cores.amarelo, tamanho = 200 }) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const p = interpolate(frame, [entra, entra + 45], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.7, 0.2, 1) });
  const n = (valor * p).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  return (
    <div
      data-foco={`contador: ${rotulo}`}
      style={{ opacity: interpolate(frame, [entra, entra + 6], [0, 1], clamp), display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
    >
      <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: tamanho, lineHeight: 1, color: cor, fontVariantNumeric: "tabular-nums", textShadow: "0 0 40px rgba(0,0,0,0.6)" }}>
        {prefixo}
        {n}
        {sufixo}
      </div>
      <div style={{ fontFamily: fontes.maquina, fontSize: 44, color: cores.papel, textAlign: "center", maxWidth: 900 }}>{rotulo}</div>
    </div>
  );
};
