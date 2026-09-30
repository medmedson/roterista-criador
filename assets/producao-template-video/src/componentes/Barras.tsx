import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

export type Barra = { rotulo: string; valor: number; entra: number; cor?: string; nota?: string };

// Barras horizontais que crescem e contam o valor (em R$ bilhões)
export const Barras: React.FC<{ barras: Barra[]; largura: number; maximo: number; unidade?: string; prefixo?: string; casas?: number }> = ({
  barras,
  largura,
  maximo,
  unidade = "bi",
  prefixo = "R$ ",
  casas = 1,
}) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  return (
    <div style={{ width: largura, display: "flex", flexDirection: "column", gap: 44 }}>
      {barras.map((b) => {
        const p = interpolate(frame, [b.entra, b.entra + 40], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.7, 0.2, 1) });
        const o = interpolate(frame, [b.entra, b.entra + 6], [0, 1], clamp);
        return (
          <div key={b.rotulo} data-foco={`barra: ${b.rotulo}`} style={{ opacity: o, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 46, letterSpacing: 3, color: cores.papel }}>{b.rotulo}</div>
              <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 64, color: b.cor ?? cores.amarelo, fontVariantNumeric: "tabular-nums" }}>
                {prefixo}{(b.valor * p).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })}{unidade === "%" ? "" : " "}{unidade}
              </div>
            </div>
            <div style={{ height: 46, backgroundColor: "rgba(255,255,255,0.06)" }}>
              <div style={{ height: "100%", width: `${(b.valor / maximo) * 100 * p}%`, backgroundColor: b.cor ?? cores.amarelo }} />
            </div>
            {b.nota ? <div style={{ fontFamily: fontes.maquina, fontSize: 32, color: cores.papelEscuro }}>{b.nota}</div> : null}
          </div>
        );
      })}
    </div>
  );
};
