import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

// Ficha de candidato: nome, partido e posição verificada (foto opcional)
export const FichaCandidato: React.FC<{
  nome: string;
  partido: string;
  posicao: string;
  entra: number;
  foto?: string;
  cor?: string;
  largura?: number;
}> = ({ nome, partido, posicao, entra, foto, cor = cores.amarelo, largura = 540 }) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  return (
    <div
      data-foco={`candidato: ${nome}`}
      style={{
        width: largura,
        opacity: interpolate(frame, [entra, entra + 8], [0, 1], clamp),
        translate: `0 ${interpolate(frame, [entra, entra + 12], [30, 0], clamp)}px`,
        display: "flex",
        gap: 20,
        padding: 22,
        backgroundColor: "rgba(10,8,7,0.82)",
        borderTop: `8px solid ${cor}`,
        boxShadow: "0 18px 26px rgba(0,0,0,0.6)",
      }}
    >
      {foto ? (
        <Img src={staticFile(foto)} style={{ width: 130, height: 160, objectFit: "cover", objectPosition: "50% 15%", filter: "grayscale(1) contrast(1.1)" }} />
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 40, color: cores.papel, lineHeight: 1.05 }}>{nome}</div>
        <div style={{ fontFamily: fontes.rotulo, fontSize: 26, letterSpacing: 3, color: cores.papelEscuro }}>{partido}</div>
        <div style={{ fontFamily: fontes.maquina, fontSize: 30, color: cor, lineHeight: 1.2 }}>{posicao}</div>
      </div>
    </div>
  );
};
