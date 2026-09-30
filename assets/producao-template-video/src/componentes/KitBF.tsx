import { Easing, interpolate, useCurrentFrame } from "remotion";
import mundo from "../data/mundo.json";
import { cores, fontes } from "../tema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OURO = "#e0b43c";
const TRACO = "#e9e2d2";
const rnd = (i: number) => {
  const v = Math.sin(i * 12.9898 + 7.3) * 43758.5453;
  return v - Math.floor(v);
};

// Linha da pobreza: linha dourada tracejada com valor na ponta; sobe entre alturas conforme `niveis`
export const LinhaPobreza: React.FC<{
  largura: number;
  niveis: { f: number; y: number; valor: string }[];
  x?: number;
}> = ({ largura, niveis, x = 0 }) => {
  const frame = useCurrentFrame();
  let atual = niveis[0];
  let y = niveis[0].y;
  for (let i = 1; i < niveis.length; i++) {
    const n = niveis[i];
    if (frame >= n.f) {
      y = interpolate(frame, [n.f, n.f + 30], [atual.y, n.y], { ...clamp, easing: Easing.bezier(0.5, 0, 0.3, 1) });
      atual = frame >= n.f + 30 ? n : { ...n, y };
    }
  }
  const rotulo = niveis.reduce((a, n) => (frame >= n.f ? n.valor : a), niveis[0].valor);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: largura, height: 0 }}>
      <div data-foco="linha da pobreza" style={{ position: "absolute", left: 0, right: 0, top: -5, height: 10, borderTop: `6px dashed ${OURO}`, boxSizing: "border-box", filter: "drop-shadow(0 0 8px rgba(224,180,60,0.7))" }} />
      <div data-foco={`valor da linha ${rotulo}`} style={{ position: "absolute", right: 10, top: -78, fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 44, color: OURO }}>{rotulo}</div>
    </div>
  );
};

// Pessoas-pontos: pontos cinza abaixo da linha que sobem e ganham cor ao cruzar
export const PessoasPontos: React.FC<{
  largura: number;
  altura: number;
  total: number;
  cruzam: number;
  sobe: number;
  linhaY: number;
  cor?: string;
  teto?: number;
}> = ({ largura, altura, total, cruzam, sobe, linhaY, cor = OURO, teto = 60 }) => {
  const frame = useCurrentFrame();
  return (
    <svg data-foco="pessoas-pontos" data-sobrepor-ok width={largura} height={altura} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {Array.from({ length: total }, (_, i) => {
        const bx = 60 + rnd(i) * (largura - 120);
        const by = linhaY + 60 + rnd(i + 99) * (altura - linhaY - 100);
        const passa = i < cruzam;
        const e = sobe + (i / Math.max(1, cruzam)) * 60;
        const p = passa ? interpolate(frame, [e, e + 30], [0, 1], { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) }) : 0;
        const ty = by - p * (by - (linhaY - 60 - rnd(i + 7) * (linhaY - 60 - teto)));
        return <circle key={i} cx={bx} cy={ty} r={9} fill={p > 0.6 ? cor : "#6b625a"} />;
      })}
    </svg>
  );
};

// Cartão genérico do programa (sem logotipo oficial, sem dados pessoais), gira e passa na leitora
export const CartaoPrograma: React.FC<{ entra: number; passa?: number; valor?: string; largura?: number; cores2?: [string, string]; texto?: string }> = ({ entra, passa, valor, largura = 560, cores2 = ["#1f8a4c", "#f2c230"], texto = "PROGRAMA DE TRANSFERÊNCIA DE RENDA" }) => {
  const frame = useCurrentFrame();
  const gira = interpolate(frame, [entra, entra + 30], [180, 0], { ...clamp, easing: Easing.bezier(0.3, 0.7, 0.3, 1) });
  const desliza = passa === undefined ? 0 : interpolate(frame, [passa, passa + 20], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.5, 1) });
  const h = largura * 0.63;
  return (
    <div data-foco="cartão do programa" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50, perspective: 1400 }}>
      <div
        style={{
          width: largura,
          height: h,
          borderRadius: 26,
          background: `linear-gradient(135deg, ${cores2[0]} 0%, ${cores2[0]} 55%, ${cores2[1]} 55%, ${cores2[1]} 100%)`,
          boxShadow: "0 24px 40px rgba(0,0,0,0.7)",
          transform: `rotateY(${gira}deg)`,
          translate: `${desliza * 40}px ${-desliza * 20}px`,
          padding: 34,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          opacity: interpolate(frame, [entra, entra + 8], [0, 1], clamp),
        }}
      >
        <div style={{ width: largura * 0.15, height: largura * 0.11, borderRadius: 8, background: "linear-gradient(135deg, #e8d48a, #b8963c)" }} />
        <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: largura * 0.045, letterSpacing: 3, color: "#ffffff", maxWidth: "48%", lineHeight: 1.2 }}>{texto}</div>
      </div>
      {passa !== undefined ? (
        <div style={{ width: largura * 0.8, height: 110, borderRadius: 16, backgroundColor: "#1d1d1f", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 30px rgba(0,0,0,0.7)", opacity: interpolate(frame, [passa - 20, passa - 10], [0, 1], clamp) }}>
          <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 56, color: "#7CFC9A", opacity: frame >= passa + 22 ? 1 : 0 }}>{valor ?? "APROVADO"}</div>
        </div>
      ) : null}
    </div>
  );
};

// Prato em traço (visto de cima) que enche em camadas
export const PratoVazio: React.FC<{ enche?: number; nivel?: number; tamanho?: number }> = ({ enche, nivel = 1, tamanho = 460 }) => {
  const frame = useCurrentFrame();
  const p = enche === undefined ? 0 : interpolate(frame, [enche, enche + 60], [0, nivel], clamp);
  return (
    <svg data-foco="prato" width={tamanho * 1.3} height={tamanho} viewBox="0 0 600 460">
      <circle cx={260} cy={230} r={210} fill="none" stroke={TRACO} strokeWidth={8} />
      <circle cx={260} cy={230} r={150} fill="none" stroke={TRACO} strokeWidth={4} opacity={0.6} />
      <ellipse cx={210} cy={200} rx={70} ry={55} fill="#f4efe6" opacity={Math.min(1, p * 3)} />
      <ellipse cx={310} cy={200} rx={60} ry={50} fill="#5a3322" opacity={Math.min(1, Math.max(0, p * 3 - 1))} />
      <ellipse cx={260} cy={290} rx={65} ry={35} fill="#3f8a3a" opacity={Math.min(1, Math.max(0, p * 3 - 2))} />
      <path d="M540 60 V400 M520 60 V150 M560 60 V150 M520 150 Q540 175 560 150" fill="none" stroke={TRACO} strokeWidth={8} />
    </svg>
  );
};

// Escada de renda: um ponto sobe três degraus até a porta de saída
export const EscadaRenda: React.FC<{ entra: number; degraus: { rotulo: string; f: number }[]; porta?: number }> = ({ entra, degraus, porta }) => {
  const frame = useCurrentFrame();
  const passo = degraus.reduce((a, d, i) => (frame >= d.f ? i : a), -1);
  const aberta = porta === undefined ? 0 : interpolate(frame, [porta, porta + 30], [0, 1], clamp);
  return (
    <svg data-foco="escada de renda" width={1300} height={640} viewBox="0 0 1300 640" style={{ opacity: interpolate(frame, [entra, entra + 10], [0, 1], clamp), overflow: "visible" }}>
      <path d="M60 600 H360 V440 H660 V280 H960 V120 H1060" fill="none" stroke={TRACO} strokeWidth={8} />
      {degraus.map((d, i) => (
        <text key={d.rotulo} x={210 + i * 300} y={590 - i * 160 - 30} textAnchor="middle" fontFamily={fontes.rotulo} fontWeight={700} fontSize={44} fill={frame >= d.f ? OURO : cores.papelEscuro}>
          {d.rotulo}
        </text>
      ))}
      {passo >= 0 ? <circle cx={210 + passo * 300} cy={600 - passo * 160 - 110} r={26} fill={OURO} /> : null}
      <rect x={1070} y={-60} width={170} height={180} fill={`rgba(124,252,154,${0.25 * aberta})`} stroke="#39d353" strokeWidth={7} />
      <text x={1155} y={-80} textAnchor="middle" fontFamily={fontes.rotulo} fontWeight={700} fontSize={38} fill="#39d353">SAÍDA</text>
    </svg>
  );
};

// Porta com placa "SAÍDA" que abre com luz; pontos atravessam
export const PortaSaida: React.FC<{ abre: number; pontos?: number }> = ({ abre, pontos = 8 }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [abre, abre + 30], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.3, 1) });
  return (
    <svg data-foco="porta de saída" width={760} height={620} viewBox="0 0 760 620">
      <rect x={260} y={60} width={240} height={500} fill={`rgba(255,240,190,${0.6 * a})`} stroke={TRACO} strokeWidth={8} />
      <path d={`M260 60 L${260 - 120 * a} ${80} V${580} L260 560 Z`} fill="#241d18" stroke={TRACO} strokeWidth={6} />
      <rect x={300} y={10} width={160} height={40} fill="#1f8a4c" />
      <text x={380} y={40} textAnchor="middle" fontFamily={fontes.rotulo} fontWeight={700} fontSize={28} fill="#ffffff">SAÍDA</text>
      {Array.from({ length: pontos }, (_, i) => {
        const e = abre + 30 + i * 8;
        const p = interpolate(frame, [e, e + 40], [0, 1], clamp);
        return <circle key={i} cx={40 + p * 680} cy={520 - (i % 3) * 26} r={12} fill={p > 0.4 ? OURO : "#6b625a"} opacity={p > 0 && p < 1 ? 1 : p >= 1 ? 0.9 : 0.6} />;
      })}
    </svg>
  );
};

// Caderno de chamada: "P" se preenchem em sequência
export const ChamadaEscolar: React.FC<{ entra: number; linhas?: number; colunas?: number; faltas?: number }> = ({ entra, linhas = 10, colunas = 14, faltas = 8 }) => {
  const frame = useCurrentFrame();
  return (
    <div data-foco="caderno de chamada" style={{ backgroundColor: "#f2ecdc", padding: 24, boxShadow: "0 20px 30px rgba(0,0,0,0.6)", display: "grid", gridTemplateColumns: `140px repeat(${colunas}, 40px)`, gap: 2 }}>
      {Array.from({ length: linhas }, (_, l) => (
        <div key={l} style={{ display: "contents" }}>
          <div style={{ height: 40, borderBottom: "1px solid #b9ad8e", fontFamily: fontes.maquina, fontSize: 22, color: "#6b5f45", display: "flex", alignItems: "center" }}>aluno {l + 1}</div>
          {Array.from({ length: colunas }, (_, c) => {
            const k = l * colunas + c;
            const on = frame >= entra + k * 0.5;
            const falta = rnd(k) * linhas * colunas < faltas;
            return (
              <div key={c} style={{ height: 40, borderBottom: "1px solid #b9ad8e", borderLeft: "1px solid #d8ceb2", fontFamily: fontes.maquina, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", color: falta ? cores.vermelho : "#1f3355" }}>
                {on ? (falta ? "F" : "P") : ""}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Sacola de feira: moeda entra e circula entre pequenos comércios
export const SacolaFeira: React.FC<{ entra: number }> = ({ entra }) => {
  const frame = useCurrentFrame();
  const lojas = [
    { n: "PADARIA", x: 160, y: 120 },
    { n: "FEIRA", x: 640, y: 80 },
    { n: "FARMÁCIA", x: 1060, y: 160 },
    { n: "MERCADO", x: 860, y: 460 },
    { n: "SACOLA", x: 300, y: 450 },
  ];
  const volta = ((frame - entra) / 90) % 1;
  const seg = Math.floor(((frame - entra) / 90) * lojas.length) % lojas.length;
  const a = lojas[(seg + lojas.length) % lojas.length];
  const b = lojas[(seg + 1) % lojas.length];
  const q = ((volta * lojas.length) % 1 + 1) % 1;
  return (
    <svg data-foco="sacola e comércios" width={1280} height={620} viewBox="0 0 1280 620" style={{ opacity: interpolate(frame, [entra, entra + 10], [0, 1], clamp) }}>
      {lojas.map((l, i) => (
        <g key={l.n}>
          <line x1={l.x} y1={l.y} x2={lojas[(i + 1) % lojas.length].x} y2={lojas[(i + 1) % lojas.length].y} stroke={cores.papelEscuro} strokeWidth={3} strokeDasharray="10 10" />
          <rect x={l.x - 90} y={l.y - 60} width={180} height={110} fill="rgba(10,8,7,0.6)" stroke={TRACO} strokeWidth={5} />
          <text x={l.x} y={l.y + 10} textAnchor="middle" fontFamily={fontes.rotulo} fontWeight={700} fontSize={30} fill={TRACO}>{l.n}</text>
        </g>
      ))}
      {frame >= entra ? <circle cx={a.x + (b.x - a.x) * q} cy={a.y + (b.y - a.y) * q} r={22} fill={OURO} stroke="#8a6a1d" strokeWidth={4} /> : null}
    </svg>
  );
};

// Pente que passa sobre uma pilha de fichas; algumas caem com carimbo
export const Pente: React.FC<{ passa: number; fichas?: number; caem?: number }> = ({ passa, fichas = 14, caem = 4 }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [passa, passa + 60], [-500, 1400], clamp);
  return (
    <svg data-foco="pente e fichas" data-corte-ok width={1300} height={640} viewBox="0 0 1300 640" style={{ overflow: "hidden" }}>
      {Array.from({ length: fichas }, (_, i) => {
        const cai = i < caem && frame > passa + 20 + i * 6;
        const p = cai ? interpolate(frame, [passa + 20 + i * 6, passa + 50 + i * 6], [0, 1], clamp) : 0;
        return (
          <g key={i} transform={`translate(${520 + (i % 2) * 14 + p * (200 + i * 120)} ${420 - i * 22 + p * 180}) rotate(${p * (20 + i * 10)})`}>
            <rect x={0} y={0} width={260} height={60} fill="#efe6cf" stroke="#9b8e70" strokeWidth={3} />
            {cai && p > 0.8 ? <text x={130} y={42} textAnchor="middle" fontFamily={fontes.rotulo} fontWeight={700} fontSize={30} fill={cores.vermelho}>CANCELADO</text> : null}
          </g>
        );
      })}
      <g transform={`translate(${x} 60)`}>
        <rect x={0} y={0} width={420} height={60} rx={20} fill="#9a948a" />
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={i} x={12 + i * 18} y={60} width={8} height={220} fill="#9a948a" />
        ))}
      </g>
    </svg>
  );
};

// Urna eletrônica estilizada e genérica, sem brasão; tela acende com um placar
export const Urna: React.FC<{ acende: number; linhas: { rotulo: string; valor: string }[] }> = ({ acende, linhas }) => {
  const frame = useCurrentFrame();
  const on = frame >= acende;
  return (
    <div data-foco="urna" style={{ width: 760, backgroundColor: "#d9d6cf", borderRadius: 20, padding: 30, boxShadow: "0 24px 40px rgba(0,0,0,0.7)", display: "flex", gap: 30 }}>
      <div style={{ flex: 1, height: 360, backgroundColor: on ? "#e9f3ea" : "#2a2a2a", borderRadius: 8, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        {on
          ? linhas.map((l, i) => (
              <div key={l.rotulo} style={{ display: "flex", justifyContent: "space-between", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 36, color: "#1a1a1a", opacity: interpolate(frame, [acende + i * 12, acende + i * 12 + 8], [0, 1], clamp) }}>
                <span>{l.rotulo}</span>
                <span>{l.valor}</span>
              </div>
            ))
          : null}
      </div>
      <div style={{ width: 200, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, alignContent: "center" }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{ height: 44, borderRadius: 6, backgroundColor: i === 11 ? "#2e8b57" : i === 9 ? "#ffffff" : "#222" }} />
        ))}
      </div>
    </div>
  );
};

// Berço em traço
export const Berco: React.FC<{ tamanho?: number }> = ({ tamanho = 360 }) => (
  <svg data-foco="berço" width={tamanho} height={tamanho * 0.8} viewBox="0 0 360 290">
    <rect x={30} y={60} width={300} height={170} fill="none" stroke={TRACO} strokeWidth={8} />
    {Array.from({ length: 9 }, (_, i) => (
      <line key={i} x1={60 + i * 30} y1={60} x2={60 + i * 30} y2={230} stroke={TRACO} strokeWidth={4} />
    ))}
    <line x1={30} y1={230} x2={30} y2={280} stroke={TRACO} strokeWidth={8} />
    <line x1={330} y1={230} x2={330} y2={280} stroke={TRACO} strokeWidth={8} />
  </svg>
);

const PAISES: [number, number][] = mundo.paises
  .filter((p) => p.iso !== "BRA")
  .map((p) => {
    const m = /M(-?[\d.]+),(-?[\d.]+)/.exec(p.d);
    return m ? ([Number(m[1]), Number(m[2])] as [number, number]) : null;
  })
  .filter((v): v is [number, number] => v !== null);

// Globo de delegações: alfinetes caem sobre países e rotas chegam ao Brasil; contador
export const GloboDelegacoes: React.FC<{ entra: number; total: number; largura?: number }> = ({ entra, total, largura = 1300 }) => {
  const frame = useCurrentFrame();
  const [bx, by] = mundo.brasil;
  const n = Math.round(interpolate(frame, [entra, entra + 120], [0, total], clamp));
  return (
    <div data-foco="globo de delegações" style={{ position: "relative", width: largura, height: largura / 2 }}>
      <svg width={largura} height={largura / 2} viewBox="0 0 2000 1000">
        {mundo.paises.map((p) => (
          <path key={p.iso + p.d.length} d={p.d} fill={p.iso === "BRA" ? OURO : "#2a221d"} stroke={cores.papelEscuro} strokeOpacity={0.35} />
        ))}
        {Array.from({ length: total }, (_, i) => {
          // alfinete sobre terra: primeiro vértice do contorno de um país (sem nomear países)
          const pais = PAISES[Math.floor(rnd(i) * PAISES.length)];
          const [x, y] = pais;
          const e = entra + (i / total) * 120;
          const p = interpolate(frame, [e, e + 20], [0, 1], clamp);
          return p > 0 ? (
            <g key={i}>
              <path d={`M${x} ${y} Q${(x + bx) / 2} ${Math.min(y, by) - 150} ${bx} ${by}`} fill="none" stroke={OURO} strokeWidth={1.5} opacity={0.25 * p} />
              <circle cx={x} cy={y} r={7} fill={cores.vermelho} opacity={p} />
            </g>
          ) : null;
        })}
      </svg>
      <div style={{ position: "absolute", right: 20, bottom: 10, fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 90, color: OURO }}>{n}</div>
    </div>
  );
};

// Troféu em traço dourado que acende
export const TrofeuPremio: React.FC<{ acende: number; tamanho?: number }> = ({ acende, tamanho = 360 }) => {
  const frame = useCurrentFrame();
  const b = interpolate(frame, [acende, acende + 20], [0, 1], clamp);
  return (
    <svg data-foco="troféu" width={tamanho} height={tamanho} viewBox="0 0 360 360" style={{ filter: b > 0 ? `drop-shadow(0 0 ${24 * b}px rgba(224,180,60,0.9))` : undefined }}>
      <path d="M100 40 H260 V120 Q260 210 180 230 Q100 210 100 120 Z" fill={`rgba(224,180,60,${0.25 + 0.5 * b})`} stroke={OURO} strokeWidth={8} />
      <path d="M100 70 Q40 70 50 120 Q60 160 110 170 M260 70 Q320 70 310 120 Q300 160 250 170" fill="none" stroke={OURO} strokeWidth={8} />
      <rect x={160} y={230} width={40} height={60} fill={OURO} />
      <rect x={110} y={290} width={140} height={34} fill={OURO} />
    </svg>
  );
};
