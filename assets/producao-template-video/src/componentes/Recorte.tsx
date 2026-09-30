import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

// Borda rasgada determinística a partir de uma semente
const bordaRasgada = (semente: number) => {
  const rnd = (i: number) => {
    const x = Math.sin(semente * 99.1 + i * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const pts: string[] = [];
  const n = 18;
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${rnd(i) * 2.2}%`);
  for (let i = 0; i <= n; i++) pts.push(`${100 - rnd(i + 40) * 1.4}% ${(i / n) * 100}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${100 - rnd(i + 80) * 2.2}%`);
  for (let i = n; i >= 0; i--) pts.push(`${rnd(i + 120) * 1.4}% ${(i / n) * 100}%`);
  return `polygon(${pts.join(",")})`;
};

export const Recorte: React.FC<{
  x: number;
  y: number;
  largura: number;
  rotacao?: number;
  entra: number;
  chapeu: string;
  titulo: string;
  linha?: string;
  fonte?: string;
  semente?: number;
  riscado?: number;
  apagado?: number;
  tamanhoTitulo?: number;
}> = ({ x, y, largura, rotacao = 0, entra, chapeu, titulo, linha, fonte, semente = 1, riscado, apagado, tamanhoTitulo = 64 }) => {
  const frame = useCurrentFrame();
  const opacidade = interpolate(frame, [entra, entra + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const risco = riscado === undefined ? 0 : interpolate(frame, [riscado, riscado + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });

  return (
    <div
      data-foco={`recorte: ${chapeu}`}
      style={{
        position: "absolute",
        left: x - largura / 2,
        top: y,
        width: largura,
        opacity: opacidade,
        rotate: `${rotacao}deg`,
        scale: String(
          interpolate(frame, [entra, entra + 10], [1.18, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 0.9, 0.3, 1.2),
          }),
        ),
        filter: `drop-shadow(0 18px 22px rgba(0,0,0,0.7)) grayscale(${
          apagado === undefined ? 0 : interpolate(frame, [apagado, apagado + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        }) brightness(${apagado === undefined ? 1 : interpolate(frame, [apagado, apagado + 20], [1, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
      }}
    >
      <div
        style={{
          backgroundColor: cores.papel,
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.18), rgba(120,90,40,0.18))`,
          clipPath: bordaRasgada(semente),
          padding: "46px 48px 40px",
          color: cores.tinta,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: fontes.rotulo,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 4,
            color: cores.vermelho,
            borderBottom: `3px solid ${cores.tinta}`,
            paddingBottom: 10,
          }}
        >
          {chapeu}
        </div>
        <div style={{ fontFamily: fontes.jornal, fontWeight: 900, fontSize: tamanhoTitulo, lineHeight: 1.04 }}>{titulo}</div>
        {linha ? (
          <div style={{ fontFamily: fontes.maquina, fontSize: 32, lineHeight: 1.3, opacity: 0.85 }}>{linha}</div>
        ) : null}
        {fonte ? (
          <div style={{ fontFamily: fontes.rotulo, fontWeight: 500, fontSize: 22, letterSpacing: 2, opacity: 0.6 }}>
            {fonte}
          </div>
        ) : null}
      </div>
      {/* Tachinha */}
      <div
        style={{
          position: "absolute",
          top: -14,
          left: "50%",
          marginLeft: -18,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, #ff6b5e, ${cores.vermelho} 55%, #5a0707)`,
          boxShadow: "0 6px 8px rgba(0,0,0,0.6)",
        }}
      />
      {riscado !== undefined
        ? [-24, 24].map((graus) => (
            <div
              key={graus}
              style={{
                position: "absolute",
                left: "-4%",
                top: "50%",
                width: "108%",
                height: 16,
                marginTop: -8,
                borderRadius: 8,
                backgroundColor: cores.vermelho,
                opacity: 0.9,
                rotate: `${graus}deg`,
                scale: `${risco} 1`,
                transformOrigin: graus < 0 ? "0% 50%" : "100% 50%",
              }}
            />
          ))
        : null}
    </div>
  );
};
