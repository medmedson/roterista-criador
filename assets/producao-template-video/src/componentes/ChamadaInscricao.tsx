import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fontes } from "../tema";

// Chamada "Inscreva-se + ative o sininho" em super produção (sem logotipo do YouTube):
// 0–20 f: cartão entra com brilho; 25 f: cursor desliza e clica em INSCREVA-SE (botão afunda e vira INSCRITO ✓);
// 55 f: cursor vai ao sino e clica: sino balança, ondas de notificação e confetes dourados; saída em 12 f.
// Duração recomendada: 150 f (5 s). Sons casados (na cena): clique em 40 f, "ding" em 72 f, whoosh na entrada e na saída.
// Uso: <Sequence from={X} durationInFrames={150}><ChamadaInscricao duracao={150} canal="CONTRA PROVA BRASIL" /></Sequence>
const rnd = (v: number) => {
  const q = Math.sin(v * 12.9898 + 78.233) * 43758.5453;
  return q - Math.floor(q);
};
export const ChamadaInscricao: React.FC<{ duracao: number; canal?: string; frase?: string; titulo?: string; posicao?: "centro" | "baixo" }> = ({
  duracao,
  canal = "CONTRA PROVA BRASIL",
  frase = "Documentos oficiais. Nada inventado.",
  titulo = "GOSTANDO? INSCREVA-SE E ATIVE O SININHO",
  posicao = "centro",
}) => {
  const f = useCurrentFrame();
  const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const entra = interpolate(f, [0, 18], [0, 1], { ...c, easing: Easing.bezier(0.2, 0.9, 0.3, 1.25) });
  const sai = interpolate(f, [duracao - 12, duracao], [1, 0], c);
  const inscrito = f >= 42;
  const aperta = interpolate(f, [38, 42, 48], [1, 0.9, 1], c);
  const sinoAtivo = f >= 72;
  const balanco = sinoAtivo ? Math.sin((f - 72) / 2.2) * 22 * Math.exp(-(f - 72) / 30) : 0;
  // cursor: entra da direita, vai ao botão (40 f) e depois ao sino (72 f)
  const cx = interpolate(f, [18, 38, 55, 70], [1500, 830, 830, 985], { ...c, easing: Easing.bezier(0.4, 0, 0.2, 1) });
  const cy = interpolate(f, [18, 38, 55, 70], [760, 560, 560, 540], { ...c, easing: Easing.bezier(0.4, 0, 0.2, 1) });
  const clique = (t0: number) => interpolate(f, [t0, t0 + 12], [0, 1], c);
  const topo = posicao === "centro" ? 330 : 560;
  return (
    <AbsoluteFill data-cobre style={{ opacity: sai, backgroundColor: `rgba(5,4,4,${0.72 * entra})` }}>
      <div data-foco="chamada título" style={{ position: "absolute", left: 0, width: 1920, top: topo - 120, textAlign: "center", opacity: entra, translate: `0 ${(1 - entra) * -40}px`, fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 64, letterSpacing: 6, color: "#f4efe6", textShadow: "0 0 30px rgba(224,180,60,0.5)", whiteSpace: "nowrap" }}>
        {titulo}
      </div>
      <div data-foco="chamada inscrição" style={{ position: "absolute", left: 960, top: topo, translate: "-50% 0", scale: String(0.7 + 0.3 * entra), opacity: entra, width: 1080, padding: "40px 50px", borderRadius: 28, background: "linear-gradient(135deg, #1b1715, #2a211b)", border: "3px solid #e0b43c", boxShadow: `0 30px 60px rgba(0,0,0,0.8), 0 0 ${60 * entra}px rgba(224,180,60,0.35)`, display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #f2c230, #9a6f12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 56, color: "#1b1715", flexShrink: 0 }}>CP</div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 44, letterSpacing: 3, color: "#f4efe6", whiteSpace: "nowrap" }}>{canal}</div>
          <div style={{ fontFamily: fontes.maquina, fontSize: 28, color: "#d6c9ab", whiteSpace: "nowrap" }}>{frase}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 14 }}>
            <div style={{ scale: String(aperta), padding: "16px 34px", borderRadius: 40, backgroundColor: inscrito ? "#3a3a3a" : "#e0261c", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 36, letterSpacing: 2, color: "#fff", whiteSpace: "nowrap", boxShadow: inscrito ? "none" : "0 0 30px rgba(224,38,28,0.6)" }}>
              {inscrito ? "INSCRITO ✓" : "INSCREVA-SE"}
            </div>
            <div style={{ position: "relative", width: 70, height: 70 }}>
              <svg width={70} height={70} viewBox="0 0 70 70" style={{ rotate: `${balanco}deg`, transformOrigin: "35px 8px" }}>
                <path d="M35 8 C22 8 16 18 16 30 V44 L10 52 H60 L54 44 V30 C54 18 48 8 35 8 Z" fill={sinoAtivo ? "#f2c230" : "#d6c9ab"} />
                <circle cx={35} cy={58} r={6} fill={sinoAtivo ? "#f2c230" : "#d6c9ab"} />
              </svg>
              {sinoAtivo
                ? [0, 1, 2].map((k) => {
                    const p = interpolate(f, [72 + k * 6, 110 + k * 6], [0, 1], c);
                    return <div key={k} style={{ position: "absolute", left: 35, top: 35, width: 60 + 140 * p, height: 60 + 140 * p, translate: "-50% -50%", borderRadius: "50%", border: "3px solid #f2c230", opacity: 1 - p }} />;
                  })
                : null}
            </div>
            <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 30, color: sinoAtivo ? "#f2c230" : "#d6c9ab", whiteSpace: "nowrap" }}>{sinoAtivo ? "ALERTAS ATIVADOS" : "ATIVE O SININHO"}</div>
          </div>
        </div>
      </div>
      {sinoAtivo
        ? Array.from({ length: 40 }, (_, i) => {
            const p = interpolate(f, [72, 130], [0, 1], c);
            const ang = rnd(i) * Math.PI * 2;
            const dist = 120 + rnd(i + 9) * 420;
            return <div key={i} style={{ position: "absolute", left: 985 + Math.cos(ang) * dist * p, top: topo + 210 + Math.sin(ang) * dist * p + 200 * p * p, width: 12, height: 18, backgroundColor: i % 3 ? "#f2c230" : "#e0261c", rotate: `${rnd(i + 3) * 360 + p * 540}deg`, opacity: 1 - p }} />;
          })
        : null}
      <svg width={60} height={60} viewBox="0 0 60 60" style={{ position: "absolute", left: cx, top: cy, opacity: f >= 18 && f < duracao - 14 ? 1 : 0, scale: String(1 - 0.15 * (clique(38) - clique(50)) - 0.15 * (clique(70) - clique(82))) }}>
        <path d="M8 4 L8 46 L20 36 L28 54 L36 50 L28 32 L44 32 Z" fill="#ffffff" stroke="#111" strokeWidth={3} />
      </svg>
    </AbsoluteFill>
  );
};
