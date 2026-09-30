import { AbsoluteFill, useCurrentFrame } from "remotion";
import { cores, fontes, ms } from "../tema";

export type Cue = { de: number; ate: number; texto: string };

// Legenda de frase inteira na parte de baixo
// `ocultar`: intervalos [de, ate) em frames onde a tela já mostra texto
// `atraso`: frames de pré-roll antes da narração começar
export const Legenda: React.FC<{ cues: Cue[]; ocultar?: [number, number][]; atraso?: number }> = ({ cues, ocultar = [], atraso = 0 }) => {
  const frame = useCurrentFrame() - atraso;
  if (ocultar.some(([de, ate]) => frame + atraso >= de && frame + atraso < ate)) return null;
  const cue = cues.find((c) => frame >= ms(c.de) && frame < ms(c.ate));
  if (!cue) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 36 }}>
      <div
        data-legenda
        style={{
          maxWidth: 1600,
          textAlign: "center",
          fontFamily: fontes.legenda,
          fontWeight: 600,
          fontSize: 40,
          lineHeight: 1.25,
          color: cores.branco,
          backgroundColor: "rgba(8,6,5,0.78)",
          padding: "10px 26px",
          borderRadius: 6,
        }}
      >
        {cue.texto}
      </div>
    </AbsoluteFill>
  );
};
