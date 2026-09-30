import { interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

// Texto datilografado letra a letra
export const Maquina: React.FC<{ texto: string; entra: number; porLetra?: number; tamanho?: number; cor?: string }> = ({
  texto,
  entra,
  porLetra = 1.6,
  tamanho = 110,
  cor = cores.branco,
}) => {
  const frame = useCurrentFrame();
  const n = Math.floor(interpolate(frame, [entra, entra + texto.length * porLetra], [0, texto.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const cursor = Math.floor(frame / 12) % 2 === 0;
  return (
    <div data-foco={`texto: ${texto}`} style={{ opacity: frame >= entra ? 1 : 0, fontFamily: fontes.maquina, fontSize: tamanho, color: cor, whiteSpace: "pre-wrap", textAlign: "center", lineHeight: 1.15 }}>
      {texto.slice(0, n)}
      <span style={{ opacity: cursor && frame >= entra ? 1 : 0, color: cores.vermelho }}>▌</span>
    </div>
  );
};
