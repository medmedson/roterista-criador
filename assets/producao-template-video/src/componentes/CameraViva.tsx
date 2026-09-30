import { createContext, useContext } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// Câmera viva: movimento lento e contínuo (zoom que respira + deslize) no vídeo inteiro,
// para nenhuma imagem ficar parada (regra: nada parado > 6 s). Aplicada pelo auditado() em todo bloco.
// Legenda e película ficam fixas (DesfazCamera aplica a transformação inversa exata).
// Escala mínima 1.02 cobre o deslize máximo, então nunca aparece borda.
type Cam = { s: number; tx: number; ty: number };
const PARADA: Cam = { s: 1, tx: 0, ty: 0 };
const Ctx = createContext<Cam>(PARADA);

export const camera = (frame: number, fps: number): Cam => {
  const T = frame / fps;
  return {
    s: 1.04 + 0.02 * Math.sin((2 * Math.PI * T) / 23),
    tx: 12 * Math.sin((2 * Math.PI * T) / 31 + 1),
    ty: 7 * Math.sin((2 * Math.PI * T) / 37 + 2),
  };
};

const estilo = (c: Cam) => `translate(${c.tx}px, ${c.ty}px) scale(${c.s})`;
const inverso = (c: Cam) => `scale(${1 / c.s}) translate(${-c.tx}px, ${-c.ty}px)`;

export const CameraViva: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = camera(frame, fps);
  return (
    <Ctx.Provider value={c}>
      <AbsoluteFill style={{ transform: estilo(c), transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
    </Ctx.Provider>
  );
};

// Para camadas que devem ficar paradas na tela (legenda, película). Precisa ocupar a tela toda (mesma caixa).
export const DesfazCamera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const c = useContext(Ctx);
  if (c === PARADA) return <>{children}</>;
  return <AbsoluteFill style={{ transform: inverso(c), transformOrigin: "50% 50%", pointerEvents: "none" }}>{children}</AbsoluteFill>;
};
