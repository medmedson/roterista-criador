import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

export type Etapa = { texto: string; sub?: string; entra: number; alerta?: boolean };

// Fluxograma horizontal: caixas acendem em sequência e uma ficha percorre as setas
export const Fluxo: React.FC<{ etapas: Etapa[]; largura: number; altura?: number }> = ({ etapas, largura, altura = 230 }) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const gap = 70;
  const w = (largura - gap * (etapas.length - 1)) / etapas.length;
  // posição da ficha: entre a caixa i-1 e i durante os 14 frames antes de cada entrada
  let fichaX: number | null = null;
  for (let i = 1; i < etapas.length; i++) {
    const e = etapas[i];
    if (frame >= e.entra - 14 && frame < e.entra) {
      const p = interpolate(frame, [e.entra - 14, e.entra], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.5, 1) });
      fichaX = (i - 1) * (w + gap) + w + p * gap;
    }
  }
  return (
    <div data-foco={`fluxo: ${etapas[0].texto}`} style={{ position: "relative", width: largura, height: altura }}>
      {etapas.map((e, i) => {
        const o = interpolate(frame, [e.entra, e.entra + 10], [0, 1], clamp);
        const ativa = frame >= e.entra && (i === etapas.length - 1 || frame < etapas[i + 1].entra);
        return (
          <div key={e.texto + i}>
            <div
              style={{
                position: "absolute",
                left: i * (w + gap),
                top: 0,
                width: w,
                height: altura,
                boxSizing: "border-box",
                border: `4px solid ${e.alerta ? cores.vermelho : ativa ? cores.amarelo : cores.papelEscuro}`,
                backgroundColor: ativa ? "rgba(242,194,48,0.12)" : "rgba(10,8,7,0.6)",
                opacity: 0.25 + 0.75 * o,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                padding: 16,
                textAlign: "center",
                scale: String(interpolate(frame, [e.entra, e.entra + 8], [1.08, 1], clamp)),
              }}
            >
              <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 44, lineHeight: 1.05, color: e.alerta ? cores.vermelho : cores.papel }}>{e.texto}</div>
              {e.sub ? <div style={{ fontFamily: fontes.maquina, fontSize: 28, color: cores.papelEscuro, lineHeight: 1.2 }}>{e.sub}</div> : null}
            </div>
            {i < etapas.length - 1 ? (
              <div
                style={{
                  position: "absolute",
                  left: i * (w + gap) + w + 10,
                  top: altura / 2 - 3,
                  width: gap - 20,
                  height: 6,
                  backgroundColor: cores.papelEscuro,
                  opacity: interpolate(frame, [etapas[i + 1].entra - 14, etapas[i + 1].entra], [0.2, 1], clamp),
                }}
              />
            ) : null}
          </div>
        );
      })}
      {fichaX !== null ? (
        <div style={{ position: "absolute", left: fichaX - 16, top: altura / 2 - 16, width: 32, height: 32, borderRadius: "50%", backgroundColor: cores.amarelo, boxShadow: "0 0 24px rgba(242,194,48,0.9)" }} />
      ) : null}
    </div>
  );
};
