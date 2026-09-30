import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type Tomada = { f: number; x: number; y: number; zoom: number };

// Altura reservada para a legenda na parte de baixo do quadro.
// A câmera centraliza o assunto na área livre acima dela.
export const RESERVA_LEGENDA = 200;

// Tomada que enquadra uma caixa do mundo [x1, y1, x2, y2] inteira na área livre
// (1920 × 1080 menos a faixa da legenda), com margem.
export const enquadra = (f: number, x1: number, y1: number, x2: number, y2: number, margem = 70): Tomada => {
  const livreW = 1920 - margem * 2;
  const livreH = 1080 - RESERVA_LEGENDA - margem * 2;
  const zoom = Math.min(livreW / (x2 - x1), livreH / (y2 - y1), 1.3);
  return { f, x: (x1 + x2) / 2, y: (y1 + y2) / 2, zoom };
};

// Câmera sobre um "mundo" grande: move o centro do quadro e o zoom entre tomadas.
// Cada tomada define onde a câmera chega no frame f; o movimento dura `transicao` frames.
export const Camera: React.FC<{
  tomadas: Tomada[];
  transicao?: number;
  tremores?: number[];
  reserva?: number;
  largura: number;
  altura: number;
  children: React.ReactNode;
}> = ({ tomadas, transicao = 36, tremores = [], reserva = RESERVA_LEGENDA, largura, altura, children }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  let atual = tomadas[0];
  let movendo = false;
  for (let i = 1; i < tomadas.length; i++) {
    const t = tomadas[i];
    if (frame < t.f) break;
    const ant = atual;
    const p = interpolate(frame, [t.f, t.f + transicao], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.65, 0, 0.35, 1),
    });
    if (p > 0 && p < 1) movendo = true;
    atual = {
      f: t.f,
      x: ant.x + (t.x - ant.x) * p,
      y: ant.y + (t.y - ant.y) * p,
      zoom: ant.zoom + (t.zoom - ant.zoom) * p,
    };
  }
  // Deriva lenta contínua para a imagem nunca ficar parada (pequena, não tira nada do quadro)
  const deriva = Math.sin(frame / 90) * 6;
  // Tremor que decai em ~14 frames
  const tremor = tremores.reduce((acc, f) => {
    const d = frame - f;
    return d >= 0 && d < 14 ? acc + (1 - d / 14) * 18 : acc;
  }, 0);
  const tx = Math.sin(frame * 2.7) * tremor;
  const ty = Math.cos(frame * 3.1) * tremor;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }} {...(movendo || tremor > 0 ? { "data-camera-movendo": true } : {})}>
      <div
        style={{
          position: "absolute",
          width: largura,
          height: altura,
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          translate: `${width / 2 - (atual.x + deriva) * atual.zoom + tx}px ${(height - reserva) / 2 - atual.y * atual.zoom + ty}px`,
          scale: String(atual.zoom),
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
