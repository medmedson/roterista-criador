import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const TRACO = "#e9e2d2";

// Torneira em traço com uma gota caindo em câmera lenta e uma lupa com rótulo
export const Torneira: React.FC<{ entra: number; rotulo?: string }> = ({ entra, rotulo = "VIGIAGUA" }) => {
  const frame = useCurrentFrame();
  const ciclo = ((frame - entra) % 90 + 90) % 90;
  const y = interpolate(ciclo, [20, 80], [250, 560], { ...clamp, easing: Easing.in(Easing.quad) });
  const gota = interpolate(ciclo, [0, 20], [0.2, 1], clamp);
  return (
    <svg data-foco="torneira" width={620} height={700} viewBox="0 0 620 700" style={{ opacity: interpolate(frame, [entra, entra + 10], [0, 1], clamp) }}>
      <path d="M40 120 H300 Q360 120 360 180 V230 H330 V190 Q330 160 300 160 H40 Z" fill="none" stroke={TRACO} strokeWidth={8} />
      <rect x={150} y={70} width={60} height={50} fill="none" stroke={TRACO} strokeWidth={8} />
      <rect x={110} y={50} width={140} height={24} rx={10} fill="none" stroke={TRACO} strokeWidth={8} />
      <path d={`M345 ${y - 40} C 360 ${y - 10}, 372 ${y + 4}, 372 ${y + 16} A 27 27 0 0 1 318 ${y + 16} C 318 ${y + 4}, 330 ${y - 10}, 345 ${y - 40} Z`} fill="#7fb3e6" opacity={gota} />
      <circle cx={470} cy={430} r={100} fill="rgba(127,179,230,0.12)" stroke={TRACO} strokeWidth={8} />
      <line x1={540} y1={500} x2={600} y2={570} stroke={TRACO} strokeWidth={16} strokeLinecap="round" />
      <text x={470} y={442} textAnchor="middle" fontFamily={fontes.rotulo} fontWeight={700} fontSize={34} fill={cores.amarelo}>{rotulo}</text>
      <path d="M300 660 Q345 610 390 660" fill="none" stroke="#7fb3e6" strokeWidth={5} opacity={interpolate(ciclo, [80, 90], [1, 0], clamp)} />
    </svg>
  );
};

// Cápsula de remédio girando
export const Capsula: React.FC<{ tamanho?: number }> = ({ tamanho = 300 }) => {
  const frame = useCurrentFrame();
  return (
    <div data-foco="cápsula" style={{ width: tamanho, height: tamanho * 0.42, rotate: `${frame * 1.5}deg`, display: "flex", borderRadius: tamanho, overflow: "hidden", boxShadow: "0 20px 30px rgba(0,0,0,0.6)" }}>
      <div style={{ flex: 1, background: `linear-gradient(180deg, #ff6b5e, ${cores.vermelho})` }} />
      <div style={{ flex: 1, background: "linear-gradient(180deg, #ffffff, #d9dde0)" }} />
    </div>
  );
};

// Pilha de caixas de remédio genéricas (tarja amarela com "G" estilizado)
export const CaixasRemedio: React.FC<{ entra: number; quantidade?: number }> = ({ entra, quantidade = 12 }) => {
  const frame = useCurrentFrame();
  return (
    <div data-foco="caixas de remédio" style={{ display: "grid", gridTemplateColumns: "repeat(4, 150px)", gap: 10, alignItems: "end" }}>
      {Array.from({ length: quantidade }, (_, i) => {
        const e = entra + i * 5;
        return (
          <div key={i} style={{ height: 100, backgroundColor: "#f1eee7", borderRadius: 4, boxShadow: "0 8px 10px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: 10, padding: "0 14px", opacity: interpolate(frame, [e, e + 4], [0, 1], clamp), translate: `0 ${interpolate(frame, [e, e + 10], [-120, 0], { ...clamp, easing: Easing.in(Easing.quad) })}px` }}>
            <div style={{ width: 46, height: 46, borderRadius: 8, backgroundColor: "#f2c230", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 34, color: "#1a1a1a" }}>G</div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ height: 8, backgroundColor: "#9aa3a8" }} />
              <div style={{ height: 8, width: "60%", backgroundColor: "#c9ced1" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Bolsa de sangue em traço que enche
export const BolsaSangue: React.FC<{ entra: number; altura?: number }> = ({ entra, altura = 520 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [entra, entra + 90], [0.1, 0.9], clamp);
  return (
    <svg data-foco="bolsa de sangue" width={altura * 0.62} height={altura} viewBox="0 0 310 520">
      <clipPath id="bolsa">
        <path d="M40 60 H270 Q290 60 290 80 V400 Q290 440 250 440 H60 Q20 440 20 400 V80 Q20 60 40 60 Z" />
      </clipPath>
      <rect x={0} y={440 - 380 * p} width={310} height={400} fill={cores.vermelho} clipPath="url(#bolsa)" />
      <path d="M40 60 H270 Q290 60 290 80 V400 Q290 440 250 440 H60 Q20 440 20 400 V80 Q20 60 40 60 Z" fill="none" stroke={TRACO} strokeWidth={8} />
      <rect x={130} y={10} width={50} height={50} fill="none" stroke={TRACO} strokeWidth={8} />
      <path d="M155 440 V510" stroke={TRACO} strokeWidth={8} />
      <rect x={70} y={120} width={170} height={90} fill="rgba(255,255,255,0.85)" />
      <text x={155} y={178} textAnchor="middle" fontFamily={fontes.rotulo} fontWeight={700} fontSize={40} fill={cores.tinta}>SANGUE</text>
    </svg>
  );
};

// Frasco de leite humano em traço
export const FrascoLeite: React.FC<{ altura?: number }> = ({ altura = 360 }) => (
  <svg data-foco="frasco de leite" width={altura * 0.55} height={altura} viewBox="0 0 220 400">
    <rect x={60} y={10} width={100} height={50} rx={8} fill="#8fb6d9" />
    <path d="M50 60 H170 V90 Q200 110 200 150 V370 Q200 390 180 390 H40 Q20 390 20 370 V150 Q20 110 50 90 Z" fill="rgba(255,255,255,0.12)" stroke={TRACO} strokeWidth={8} />
    <path d="M24 200 H196 V370 Q196 386 180 386 H40 Q24 386 24 370 Z" fill="#f7f3ea" />
  </svg>
);

// Cigarro em traço que se apaga em fumaça
export const Cigarro: React.FC<{ apaga: number }> = ({ apaga }) => {
  const frame = useCurrentFrame();
  const brasa = interpolate(frame, [apaga, apaga + 30], [1, 0], clamp);
  return (
    <svg data-foco="cigarro" width={520} height={300} viewBox="0 0 520 300">
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M470 ${170 - k * 10} C 440 ${120 - k * 20}, 500 ${90 - k * 20}, ${470 + Math.sin(frame / 15 + k) * 20} ${40 - k * 10}`} fill="none" stroke="#bfb8ab" strokeWidth={4} opacity={0.4 * (0.5 + brasa * 0.5)} />
      ))}
      <rect x={20} y={180} width={140} height={46} fill="#c8914a" />
      <rect x={160} y={180} width={300} height={46} fill="#f1eee7" />
      <rect x={460} y={180} width={20} height={46} fill={`rgba(255,${80 + 60 * (1 - brasa)},40,${0.3 + 0.7 * brasa})`} style={{ filter: brasa > 0.1 ? "drop-shadow(0 0 12px #ff5a2a)" : undefined }} />
    </svg>
  );
};
