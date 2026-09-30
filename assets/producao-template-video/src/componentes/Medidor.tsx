import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

// Medidor de devolução média: barra que para antes dos 100%; o espaço que sobra é a margem da casa
export const Medidor: React.FC<{ entra: number; largura: number; valor?: number; mostrarValor?: boolean }> = ({
  entra,
  largura,
  valor = 0.9,
  mostrarValor = false,
}) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const p = interpolate(frame, [entra + 10, entra + 60], [0, valor], { ...clamp, easing: Easing.bezier(0.3, 0.7, 0.2, 1) });
  const margem = interpolate(frame, [entra + 70, entra + 90], [0, 1], clamp);
  return (
    <div data-foco="medidor de devolução" style={{ width: largura, opacity: interpolate(frame, [entra, entra + 8], [0, 1], clamp) }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 40, color: cores.papel, marginBottom: 14 }}>
        <span>DEVOLUÇÃO MÉDIA EM PRÊMIOS</span>
        <span style={{ color: cores.papelEscuro }}>100% DO QUE FOI APOSTADO</span>
      </div>
      <div style={{ position: "relative", height: 110, border: `4px solid ${cores.papelEscuro}`, boxSizing: "border-box" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${p * 100}%`, backgroundColor: cores.amarelo }} />
        <div
          style={{
            position: "absolute",
            left: `${valor * 100}%`,
            top: 0,
            bottom: 0,
            right: 0,
            backgroundColor: cores.vermelho,
            opacity: margem,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fontes.rotulo,
            fontWeight: 700,
            fontSize: 30,
            color: cores.branco,
          }}
        >
          CASA
        </div>
        {mostrarValor ? (
          <div style={{ position: "absolute", left: 30, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 56, color: "#1a0505" }}>
            {Math.round(p * 100)}%
          </div>
        ) : null}
      </div>
      <div style={{ fontFamily: fontes.maquina, fontSize: 38, color: cores.vermelho, marginTop: 16, opacity: margem, textAlign: "right" }}>
        a diferença é a margem estatística da operação
      </div>
    </div>
  );
};
