import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

// Foto em papel instantâneo, pregada no quadro, em preto e branco
export const Polaroide: React.FC<{
  x: number;
  y: number;
  largura: number;
  foto: string;
  nome: string;
  entra: number;
  rotacao?: number;
  credito?: string;
  proporcao?: string;
  inteira?: boolean;
  enquadre?: string;
  colorida?: boolean;
}> = ({ x, y, largura, foto, nome, entra, rotacao = 0, credito, proporcao = "4 / 5", inteira = false, enquadre = "50% 18%", colorida = false }) => {
  const frame = useCurrentFrame();
  return (
    <div
      data-foco={`foto: ${nome}`}
      style={{
        position: "absolute",
        left: x - largura / 2,
        top: y,
        width: largura,
        rotate: `${rotacao}deg`,
        opacity: interpolate(frame, [entra, entra + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        scale: String(
          interpolate(frame, [entra, entra + 10], [1.18, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 0.9, 0.3, 1.2),
          }),
        ),
        backgroundColor: cores.papel,
        padding: "22px 22px 0",
        boxShadow: "0 22px 30px rgba(0,0,0,0.7)",
      }}
    >
      <Img
        src={staticFile(foto)}
        style={inteira ? { width: "100%", display: "block" } : { width: "100%", aspectRatio: proporcao, objectFit: "cover", objectPosition: enquadre, filter: colorida ? undefined : "grayscale(1) contrast(1.15) brightness(0.92) sepia(0.15)" }}
      />
      <div style={{ fontFamily: fontes.maquina, fontSize: Math.min(44, largura * 0.13), color: cores.tinta, textAlign: "center", padding: "18px 0 10px" }}>{nome}</div>
      {credito ? (
        <div style={{ fontFamily: fontes.rotulo, fontSize: 16, letterSpacing: 1, color: cores.tinta, opacity: 0.55, textAlign: "center", paddingBottom: 12 }}>
          {credito}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          top: inteira ? -34 : -14,
          left: "50%",
          marginLeft: -18,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, #ff6b5e, ${cores.vermelho} 55%, #5a0707)`,
          boxShadow: "0 6px 8px rgba(0,0,0,0.6)",
        }}
      />
    </div>
  );
};
