import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const aparece = (frame: number, entra: number) => interpolate(frame, [entra, entra + 10], [0, 1], clamp);

// Pulseira branca de identificação hospitalar (texto genérico), com leve giro 3D
export const PulseiraHospital: React.FC<{ entra: number; texto?: string; largura?: number }> = ({ entra, texto = "PACIENTE · ATENDIMENTO", largura = 900 }) => {
  const frame = useCurrentFrame();
  return (
    <div data-foco="pulseira" style={{ perspective: 1200, opacity: aparece(frame, entra) }}>
      <div
        style={{
          width: largura,
          height: largura * 0.14,
          borderRadius: largura * 0.07,
          background: "linear-gradient(180deg, #ffffff, #dfe3e6)",
          boxShadow: "0 20px 30px rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          padding: `0 ${largura * 0.06}px`,
          gap: largura * 0.04,
          rotate: `y ${interpolate(frame, [entra, entra + 40], [35, 8], clamp)}deg`,
          transform: `rotateX(${interpolate(frame, [entra, entra + 40], [25, 12], clamp)}deg)`,
        }}
      >
        <div style={{ width: largura * 0.07, height: largura * 0.07, borderRadius: "50%", border: "5px solid #b9bec2" }} />
        <div style={{ flex: 1, fontFamily: fontes.rotulo, fontWeight: 700, fontSize: largura * 0.04, letterSpacing: 4, color: "#39424a" }}>{texto}</div>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i} style={{ width: i % 3 ? 4 : 8, height: largura * 0.07, backgroundColor: "#39424a" }} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Carteira de trabalho antiga (capa genérica) que abre e recebe um carimbo
export const CarteiraTrabalho: React.FC<{ entra: number; abre?: number; carimbo?: { texto: string; em: number }; largura?: number }> = ({
  entra,
  abre,
  carimbo,
  largura = 420,
}) => {
  const frame = useCurrentFrame();
  const a = abre === undefined ? 0 : interpolate(frame, [abre, abre + 24], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.3, 1) });
  const h = largura * 1.4;
  return (
    <div data-foco="carteira de trabalho" style={{ position: "relative", width: largura * 2, height: h, opacity: aparece(frame, entra), perspective: 1600 }}>
      {/* página interna */}
      <div style={{ position: "absolute", left: largura, top: 0, width: largura, height: h, backgroundColor: "#e9dfc4", boxShadow: "0 20px 30px rgba(0,0,0,0.6)", padding: 30, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 18 }}>
        {["NOME", "EMPREGADOR", "ADMISSÃO", "CARGO"].map((c) => (
          <div key={c} style={{ borderBottom: "2px solid #9b8e70", fontFamily: fontes.rotulo, fontSize: largura * 0.05, color: "#6b5f45", paddingBottom: 6 }}>{c}</div>
        ))}
        {carimbo && frame >= carimbo.em ? (
          <div
            style={{
              marginTop: 20,
              alignSelf: "center",
              border: `6px solid ${cores.vermelho}`,
              color: cores.vermelho,
              fontFamily: fontes.rotulo,
              fontWeight: 700,
              fontSize: largura * 0.09,
              padding: "6px 18px",
              rotate: "-8deg",
              scale: String(interpolate(frame, [carimbo.em, carimbo.em + 6], [1.5, 1], clamp)),
            }}
          >
            {carimbo.texto}
          </div>
        ) : null}
      </div>
      {/* capa que gira */}
      <div
        style={{
          position: "absolute",
          left: largura,
          top: 0,
          width: largura,
          height: h,
          transformOrigin: "0 50%",
          transform: `rotateY(${-180 * a}deg)`,
          backfaceVisibility: "hidden",
          background: "linear-gradient(135deg, #1f3355, #15223b)",
          borderRadius: "4px 14px 14px 4px",
          boxShadow: "0 20px 30px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          color: "#c9b98a",
          fontFamily: fontes.jornal,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        <div style={{ width: largura * 0.3, height: largura * 0.3, borderRadius: "50%", border: "4px solid #c9b98a" }} />
        <div style={{ fontSize: largura * 0.1, lineHeight: 1.15 }}>CARTEIRA DE<br />TRABALHO</div>
      </div>
    </div>
  );
};

// Ficha de atendimento dos anos 1980, preenchida a máquina, com X em "NÃO" e carimbo final
export const FichaAtendimento: React.FC<{
  entra: number;
  campos: { rotulo: string; valor: string; em: number }[];
  marcaNao?: number;
  carimbo?: { texto: string; em: number };
  largura?: number;
}> = ({ entra, campos, marcaNao, carimbo, largura = 900 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      data-foco="ficha de atendimento"
      data-sobrepor-ok
      style={{
        width: largura,
        opacity: aparece(frame, entra),
        backgroundColor: "#e6d7a8",
        backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(120,90,30,0.25))",
        boxShadow: "0 24px 36px rgba(0,0,0,0.7)",
        padding: "40px 50px",
        display: "flex",
        flexDirection: "column",
        gap: 22,
        color: "#2a2418",
        rotate: "-1.5deg",
      }}
    >
      <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 34, letterSpacing: 6, borderBottom: "3px solid #2a2418", paddingBottom: 10 }}>FICHA DE ATENDIMENTO</div>
      {campos.map((c) => {
        const n = Math.floor(interpolate(frame, [c.em, c.em + c.valor.length * 1.4], [0, c.valor.length], clamp));
        return (
          <div key={c.rotulo} style={{ display: "flex", gap: 16, alignItems: "baseline", borderBottom: "2px dotted #7a6a45", paddingBottom: 6 }}>
            <div style={{ fontFamily: fontes.rotulo, fontSize: 30, width: 200 }}>{c.rotulo}</div>
            <div style={{ fontFamily: fontes.maquina, fontSize: 40 }}>{c.valor.slice(0, n)}</div>
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 40, fontFamily: fontes.rotulo, fontSize: 34, alignItems: "center" }}>
        <span>SEGURADO:</span>
        <span>SIM (&nbsp;&nbsp;)</span>
        <span>
          NÃO (<span style={{ fontFamily: fontes.maquina, color: cores.vermelho, opacity: marcaNao !== undefined && frame >= marcaNao ? 1 : 0 }}>X</span>)
        </span>
      </div>
      <div style={{ height: 130, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {carimbo && frame >= carimbo.em ? (
          <div
            style={{
              border: `8px solid ${cores.vermelho}`,
              color: cores.vermelho,
              fontFamily: fontes.rotulo,
              fontWeight: 700,
              fontSize: 80,
              letterSpacing: 10,
              padding: "0 30px",
              rotate: "-5deg",
              scale: String(interpolate(frame, [carimbo.em, carimbo.em + 6], [1.5, 1], clamp)),
            }}
          >
            {carimbo.texto}
          </div>
        ) : null}
      </div>
    </div>
  );
};
