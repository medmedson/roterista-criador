import { Easing, interpolate, useCurrentFrame } from "remotion";
import grade from "../data/grade-brasil.json";
import { c, fontes, sombra } from "../tema";

// KIT JAZIDA — tema Terras Raras. Sem contador Geiger, sem símbolo de radiação, sem barragem real, sem pessoas, sem terras indígenas.
// Cada elemento recebe frames RELATIVOS da cena (entra, …).
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.2, 0.7, 0.2, 1);
const ap = (f: number, a: number, d = 12) => interpolate(f, [a, a + d], [0, 1], { ...clamp, easing: suave });
const rnd = (i: number) => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

// ───────────────── TabelaPeriodica (motivo) ─────────────────
// Tabela em mosaico (18 colunas × 7 períodos + linhas dos lantanídeos/actinídeos). Os 17 elementos de terras raras
// (Sc, Y e La–Lu) ficam em ferrugem. `acende`: símbolos para destacar em enxofre. Os outros acendem por grupo.
const TR = new Set("Sc Y La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu".split(" "));
const POS: Record<string, [number, number]> = {};
{
  const per: string[][] = [
    ["H", "He"], ["Li", "Be", "B", "C", "N", "O", "F", "Ne"], ["Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar"],
    "K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr".split(" "), "Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe".split(" "),
    ["Cs", "Ba", "La", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn"], ["Fr", "Ra", "Ac"],
  ];
  per.forEach((linha, y) => {
    linha.forEach((s, i) => {
      let x = i;
      if (y === 0 && i === 1) x = 17;
      else if (y === 1 || y === 2) x = i < 2 ? i : i + 10;
      POS[s] = [x, y];
    });
  });
  "Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu".split(" ").forEach((s, i) => (POS[s] = [i + 2, 8]));
  "Th Pa U".split(" ").forEach((s, i) => (POS[s] = [i + 2, 9]));
}
export const TabelaPeriodica: React.FC<{ entra: number; celula?: number; destaqueTR?: boolean; acende?: string[]; acendeEm?: number; passo?: number; foco?: string[] }> = ({
  entra,
  celula = 78,
  destaqueTR = true,
  acende = [],
  acendeEm = 0,
  passo = 1,
  foco = [],
}) => {
  const f = useCurrentFrame();
  const lista = Object.keys(POS);
  return (
    <div data-foco="tabela periódica" style={{ position: "relative", width: 18 * celula, height: 10.2 * celula }}>
      {lista.map((s, i) => {
        const [x, y] = POS[s];
        const a = ap(f, entra + (x + y) * passo, 10);
        const tr = TR.has(s);
        const on = acende.includes(s) && f >= acendeEm;
        const fc = foco.includes(s);
        const pulso = tr && destaqueTR ? 0.5 + 0.5 * Math.sin((f - entra) / 9 + i) : 0;
        return (
          <div key={s} style={{ position: "absolute", left: x * celula + 2, top: (y + (y >= 8 ? 0.3 : 0)) * celula + 2, width: celula - 4, height: celula - 4, borderRadius: 6, opacity: 0.25 + 0.75 * a, backgroundColor: on || fc ? c.enxofre : tr && destaqueTR ? c.ferrugem : c.gelo, border: `2px solid ${tr && destaqueTR ? c.ferrugem : c.fio}`, boxShadow: tr && destaqueTR ? `0 0 ${10 + 14 * pulso}px rgba(181,83,42,${0.3 + 0.4 * pulso})` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.mono, fontWeight: 600, fontSize: celula * 0.34, color: on || fc ? c.grafite : tr && destaqueTR ? c.areia : c.cinza }}>
            {s}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 3 * celula, top: 5.1 * celula, fontFamily: fontes.mono, fontSize: celula * 0.26, color: c.cinza, opacity: ap(f, entra + 20) }}>…</div>
    </div>
  );
};

// ───────────────── CorteSolo ─────────────────
// Perfil de solo em camadas (solo, saprolito, argila, rocha), em traço. A camada de argila iônica se ilumina em `iluminaEm`
// e pontos (íons) se soltam dela.
export const CorteSolo: React.FC<{ entra: number; iluminaEm?: number; largura?: number; rotulos?: boolean }> = ({ entra, iluminaEm, largura = 1100, rotulos = true }) => {
  const f = useCurrentFrame();
  const camadas = [
    { n: "SOLO", h: 90, cor: "#5C4632" },
    { n: "SAPROLITO", h: 130, cor: "#7A5C3E" },
    { n: "ARGILA COM ÍONS ADSORVIDOS", h: 150, cor: "#8F6B49" },
    { n: "ROCHA", h: 150, cor: "#3B4248" },
  ];
  const luz = iluminaEm === undefined ? 0 : ap(f, iluminaEm, 24);
  let y = 0;
  return (
    <div data-foco="corte do solo" style={{ opacity: ap(f, entra, 10), width: largura, height: 560, position: "relative" }}>
      {camadas.map((cm, i) => {
        const e = ap(f, entra + i * 8, 12);
        const top = y;
        y += cm.h;
        const iluminada = i === 2;
        return (
          <div key={cm.n} style={{ position: "absolute", left: 0, right: 0, top, height: cm.h, opacity: e, backgroundColor: iluminada ? `rgba(224,183,58,${0.25 + 0.55 * luz})` : cm.cor, border: `3px solid ${c.fio}`, boxShadow: iluminada && luz > 0.4 ? "inset 0 0 40px rgba(224,183,58,0.5)" : "none" }}>
            {rotulos ? <div style={{ position: "absolute", left: 24, top: cm.h / 2 - 18, fontFamily: fontes.mono, fontWeight: 600, fontSize: 28, color: iluminada && luz > 0.5 ? c.grafite : c.areia, whiteSpace: "nowrap" }}>{cm.n}</div> : null}
            {iluminada
              ? Array.from({ length: 26 }, (_, k) => {
                  const p = interpolate(f, [iluminaEm ?? 9999, (iluminaEm ?? 9999) + 60], [0, 1], clamp);
                  const x0 = 80 + rnd(k) * (largura - 160);
                  return <div key={k} style={{ position: "absolute", left: x0 + Math.sin(k + f / 18) * 14, top: 20 + rnd(k + 3) * 100 - p * rnd(k + 5) * 40, width: 12, height: 12, borderRadius: 6, backgroundColor: c.enxofre, opacity: p }} />;
                })
              : null}
          </div>
        );
      })}
    </div>
  );
};

// ───────────────── Amostra ─────────────────
// Mineral desenhado (cristal facetado) sobre papel areia; gira 360° em 3 s a partir de `giraEm`, com etiqueta mono.
export const Amostra: React.FC<{ entra: number; nome: string; formula?: string; giraEm?: number; cor?: string; tamanho?: number }> = ({ entra, nome, formula, giraEm, cor = c.ferrugem, tamanho = 360 }) => {
  const f = useCurrentFrame();
  const rot = giraEm === undefined ? 0 : interpolate(f, [giraEm, giraEm + 90], [0, 360], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <div data-foco={`amostra: ${nome}`} style={{ opacity: ap(f, entra, 12), width: tamanho + 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ width: tamanho, height: tamanho * 0.8, borderRadius: 16, backgroundColor: c.areia, boxShadow: sombra, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={tamanho * 0.7} height={tamanho * 0.7} viewBox="0 0 200 200" style={{ rotate: `${rot}deg` }}>
          <polygon points="100,12 176,70 150,168 50,168 24,70" fill={cor} stroke={c.grafite} strokeWidth={4} />
          <polygon points="100,12 176,70 100,96" fill="rgba(255,255,255,0.25)" />
          <polygon points="24,70 100,96 50,168" fill="rgba(0,0,0,0.25)" />
          <polygon points="176,70 150,168 100,96" fill="rgba(0,0,0,0.1)" />
          <line x1={100} y1={96} x2={100} y2={12} stroke={c.grafite} strokeWidth={2} opacity={0.5} />
        </svg>
      </div>
      <div style={{ fontFamily: fontes.titulo, fontWeight: 800, fontSize: 44, color: c.areia, whiteSpace: "nowrap" }}>{nome}</div>
      {formula ? <div style={{ fontFamily: fontes.mono, fontSize: 24, color: c.cinza, whiteSpace: "nowrap" }}>{formula}</div> : null}
    </div>
  );
};

// ───────────────── EsteiraCadeia ─────────────────
// Esteira com etapas (mina → … → ímã). Uma peça percorre e cada caixa acende em sequência; `paises` rotula cada etapa.
export const EsteiraCadeia: React.FC<{
  entra: number;
  etapas?: string[];
  paises?: (string | undefined)[];
  passo?: number;
  largura?: number;
  marca?: number[];
}> = ({ entra, etapas = ["MINA", "CONCENTRAÇÃO", "LIXIVIAÇÃO", "SEPARAÇÃO", "ÓXIDO", "METAL", "LIGA", "ÍMÃ"], paises = [], passo = 22, largura = 1700, marca = [] }) => {
  const f = useCurrentFrame();
  const n = etapas.length;
  const w = (largura - (n - 1) * 24) / n;
  const peca = interpolate(f, [entra, entra + passo * n], [0, n], clamp);
  return (
    <div data-foco="esteira da cadeia" style={{ opacity: ap(f, entra, 10), width: largura, height: 330, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 14, borderRadius: 7, backgroundColor: c.fio }} />
      {etapas.map((e, i) => {
        const acesa = peca > i + 0.3;
        const m = marca.includes(i);
        return (
          <div key={e} style={{ position: "absolute", left: i * (w + 24), top: 70, width: w, height: 170, borderRadius: 12, backgroundColor: acesa ? (m ? c.enxofre : c.ferrugem) : c.gelo, border: `3px solid ${acesa ? (m ? c.enxofre : c.ferrugem) : c.fio}`, boxShadow: acesa ? "0 0 22px rgba(181,83,42,0.45)" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.titulo, fontWeight: 800, fontSize: Math.min(34, w * 0.2), letterSpacing: 1, color: acesa ? (m ? c.grafite : c.areia) : c.cinza, whiteSpace: "nowrap" }}>
            {e}
            {paises[i] ? <div style={{ position: "absolute", left: 0, right: 0, top: 184, textAlign: "center", opacity: acesa ? 1 : 0, fontFamily: fontes.mono, fontWeight: 600, fontSize: 24, color: c.enxofre, whiteSpace: "nowrap" }}>{paises[i]}</div> : null}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: peca * (w + 24) - 20, top: 120, width: 40, height: 40, borderRadius: 8, backgroundColor: c.enxofre, rotate: "45deg", opacity: peca < n ? 1 : 0, boxShadow: "0 0 18px rgba(224,183,58,0.8)" }} />
    </div>
  );
};

// ───────────────── MapaJazidas ─────────────────
// Cartograma de pontos do Brasil com marcas de projetos (lon/lat) que ganham anel em `f`.
type G = { k: number; t: [number, number]; pts: [number, number][] };
const G_ = grade as unknown as G;
const proj = (lon: number, lat: number): [number, number] => {
  const l = (lon * Math.PI) / 180;
  const p = (lat * Math.PI) / 180;
  return [G_.t[0] + G_.k * l, G_.t[1] - G_.k * Math.log(Math.tan(Math.PI / 4 + p / 2))];
};
export const MapaJazidas: React.FC<{ entra: number; tamanho?: number; projetos?: { lonlat: [number, number]; rotulo: string; f: number; cor?: string }[]; legenda?: string }> = ({ entra, tamanho = 820, projetos = [], legenda }) => {
  const f = useCurrentFrame();
  return (
    <div data-foco="mapa de jazidas" style={{ opacity: ap(f, entra, 14), width: tamanho, height: tamanho + (legenda ? 50 : 0), position: "relative" }}>
      <svg width={tamanho} height={tamanho} viewBox="0 0 1000 1000" style={{ overflow: "visible" }}>
        {G_.pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={4.2} fill={c.fio} opacity={interpolate(f, [entra + (i % 40), entra + (i % 40) + 12], [0, 0.8], clamp)} />
        ))}
        {projetos.map((p, i) => {
          const [x, y] = proj(p.lonlat[0], p.lonlat[1]);
          const e = ap(f, p.f, 10);
          const pul = ((f - p.f) % 36) / 36;
          const cor = p.cor ?? c.ferrugem;
          return (
            <g key={i} opacity={e}>
              <circle cx={x} cy={y} r={12} fill={cor} />
              <circle cx={x} cy={y} r={12 + 34 * pul} fill="none" stroke={cor} strokeWidth={3} opacity={1 - pul} />
              <text x={x + 22} y={y + 10} fontFamily={fontes.titulo} fontWeight={800} fontSize={34} fill={c.areia}>{p.rotulo}</text>
            </g>
          );
        })}
      </svg>
      {legenda ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center", fontFamily: fontes.mono, fontSize: 24, color: c.cinza, whiteSpace: "nowrap" }}>{legenda}</div> : null}
    </div>
  );
};

// ───────────────── MisturadorSeparador ─────────────────
// Cascata de cubas (separação por solventes): o líquido passa de cuba em cuba e se divide em duas cores.
export const MisturadorSeparador: React.FC<{ entra: number; cubas?: number; passo?: number; largura?: number }> = ({ entra, cubas = 4, passo = 30, largura = 1500 }) => {
  const f = useCurrentFrame();
  const w = 200;
  const gap = (largura - cubas * w) / (cubas - 1);
  return (
    <div data-foco="separação por solventes" style={{ opacity: ap(f, entra, 10), width: largura, height: 420, position: "relative" }}>
      {Array.from({ length: cubas }, (_, i) => {
        const e = ap(f, entra + 10 + i * passo, 20);
        const dividido = i >= 1;
        return (
          <div key={i} style={{ position: "absolute", left: i * (w + gap), top: i * 18, width: w, height: 260 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "10px 10px 40px 40px", border: `4px solid ${c.areia}`, overflow: "hidden", backgroundColor: "#171B1E" }}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${70 * e}%`, background: dividido ? `linear-gradient(180deg, ${c.mineral} 0 50%, ${c.ferrugem} 50% 100%)` : c.aco }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: `${70 * e - 6}%`, height: 8, backgroundColor: "rgba(255,255,255,0.25)" }} />
            </div>
            {i < cubas - 1 ? <div style={{ position: "absolute", left: w - 4, top: 40, width: gap + 8, height: 10, backgroundColor: c.fio, opacity: ap(f, entra + 10 + (i + 1) * passo - 10, 10) }} /> : null}
            <div style={{ position: "absolute", left: 0, right: 0, top: 280, textAlign: "center", fontFamily: fontes.mono, fontWeight: 600, fontSize: 24, color: c.cinza, whiteSpace: "nowrap" }}>{`etapa ${i + 1}`}</div>
          </div>
        );
      })}
    </div>
  );
};

// ───────────────── ImaCampo ─────────────────
// Ímã de ferradura em traço com linhas de campo que pulsam; o rotor gira a partir de `giraEm`.
export const ImaCampo: React.FC<{ entra: number; giraEm?: number; tamanho?: number }> = ({ entra, giraEm, tamanho = 560 }) => {
  const f = useCurrentFrame();
  const rot = giraEm === undefined ? 0 : (f - giraEm) * 6;
  return (
    <div data-foco="ímã e campo" style={{ opacity: ap(f, entra, 12), width: tamanho, height: tamanho * 0.9 }}>
      <svg width={tamanho} height={tamanho * 0.9} viewBox="0 0 560 504">
        {[0, 1, 2].map((k) => {
          const p = ((f / 40 + k / 3) % 1);
          return <path key={k} d={`M 150 150 C ${150 - 60 - 60 * k} 330, ${410 + 60 + 60 * k} 330, 410 150`} fill="none" stroke={c.enxofre} strokeWidth={3} opacity={0.15 + 0.5 * (1 - p)} strokeDasharray="10 12" />;
        })}
        <path d="M 120 60 V 170 a 160 160 0 0 0 320 0 V 60" fill="none" stroke={c.ferrugem} strokeWidth={50} strokeLinecap="butt" />
        <rect x={95} y={40} width={50} height={46} fill={c.areia} />
        <rect x={415} y={40} width={50} height={46} fill={c.aco} />
        <g transform={`translate(280 330) rotate(${rot})`} opacity={giraEm === undefined ? 0.3 : 1}>
          <circle r={64} fill="none" stroke={c.areia} strokeWidth={5} />
          <line x1={-64} y1={0} x2={64} y2={0} stroke={c.areia} strokeWidth={5} />
          <line x1={0} y1={-64} x2={0} y2={64} stroke={c.areia} strokeWidth={5} />
        </g>
      </svg>
    </div>
  );
};

// ───────────────── BalancaComercio ─────────────────
// Dois pratos: exporta × importa, com valores; o prato da importação desce em `descerEm`.
export const BalancaComercio: React.FC<{ entra: number; exporta: { rotulo: string; valor: string }; importa: { rotulo: string; valor: string }; descerEm: number; nota?: string }> = ({ entra, exporta, importa, descerEm, nota }) => {
  const f = useCurrentFrame();
  const d = ap(f, descerEm, 40);
  const ang = d * 9;
  const Prato: React.FC<{ x: number; y: number; r: { rotulo: string; valor: string }; cor: string }> = ({ x, y, r, cor }) => (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 60, color: cor, whiteSpace: "nowrap" }}>{r.valor}</div>
      <div style={{ width: 380, height: 20, borderRadius: 10, backgroundColor: cor }} />
      <div style={{ fontFamily: fontes.titulo, fontWeight: 800, fontSize: 36, color: c.areia, whiteSpace: "nowrap" }}>{r.rotulo}</div>
    </div>
  );
  return (
    <div data-foco="balança comercial" style={{ opacity: ap(f, entra, 10), width: 1300, height: 600, position: "relative" }}>
      <div style={{ position: "absolute", left: 650, top: 150, width: 12, height: 380, backgroundColor: c.fio, translate: "-50% 0" }} />
      <div style={{ position: "absolute", left: 650, top: 150, width: 1000, height: 12, backgroundColor: c.areia, translate: "-50% 0", rotate: `${ang}deg` }} />
      <Prato x={650 - 500 * Math.cos((ang * Math.PI) / 180)} y={150 - 500 * Math.sin((ang * Math.PI) / 180) + 40 - 0} r={exporta} cor={c.mineral} />
      <Prato x={650 + 500 * Math.cos((ang * Math.PI) / 180)} y={150 + 500 * Math.sin((ang * Math.PI) / 180) + 40} r={importa} cor={c.ferrugem} />
      {nota ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center", fontFamily: fontes.mono, fontSize: 24, color: c.cinza, whiteSpace: "nowrap", opacity: ap(f, descerEm + 30) }}>{nota}</div> : null}
    </div>
  );
};

// ───────────────── LinhaPreco ─────────────────
// Gráfico de linha (anos × valor). A linha se desenha; `pico` (índice) pulsa; `notas` aparecem em `f`.
export const LinhaPreco: React.FC<{ entra: number; anos: string[]; valores: number[]; pico?: number; unidade?: string; largura?: number; altura?: number; cor?: string; notas?: { i: number; t: string; f: number }[] }> = ({
  entra,
  anos,
  valores,
  pico,
  unidade = "US$/kg",
  largura = 1400,
  altura = 520,
  cor = c.enxofre,
  notas = [],
}) => {
  const f = useCurrentFrame();
  const max = Math.max(...valores) * 1.1;
  const x = (i: number) => 90 + (i / (anos.length - 1)) * (largura - 140);
  const y = (v: number) => altura - 60 - (v / max) * (altura - 120);
  const d = valores.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const p = ap(f, entra + 6, 60);
  const tam = 2400;
  return (
    <div data-foco="gráfico de preço" style={{ opacity: ap(f, entra, 10), width: largura, height: altura, position: "relative" }}>
      <svg width={largura} height={altura} style={{ overflow: "visible" }}>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <g key={g}>
            <line x1={90} x2={largura - 50} y1={y(max * g / 1.1)} y2={y(max * g / 1.1)} stroke={c.fio} strokeWidth={1} opacity={0.5} />
            <text x={80} y={y(max * g / 1.1) + 8} textAnchor="end" fontFamily={fontes.mono} fontSize={22} fill={c.cinza}>{Math.round((max * g) / 1.1)}</text>
          </g>
        ))}
        {anos.map((a, i) => (i % Math.ceil(anos.length / 10) === 0 ? <text key={a} x={x(i)} y={altura - 20} textAnchor="middle" fontFamily={fontes.mono} fontSize={22} fill={c.cinza}>{a}</text> : null))}
        <text x={20} y={24} fontFamily={fontes.mono} fontSize={22} fill={c.cinza}>{unidade}</text>
        <path d={d} fill="none" stroke={cor} strokeWidth={6} strokeLinejoin="round" strokeDasharray={tam} strokeDashoffset={tam * (1 - p)} />
        {pico !== undefined ? <circle cx={x(pico)} cy={y(valores[pico])} r={10 + 6 * Math.sin(f / 6)} fill={cor} opacity={ap(f, entra + 50, 10)} /> : null}
        {notas.map((n, k) => (
          <g key={k} opacity={ap(f, n.f, 10)}>
            <line x1={x(n.i)} x2={x(n.i)} y1={y(valores[n.i]) - 14} y2={y(valores[n.i]) - 60} stroke={c.areia} strokeWidth={2} />
            <text x={x(n.i)} y={y(valores[n.i]) - 70} textAnchor="middle" fontFamily={fontes.titulo} fontWeight={800} fontSize={32} fill={c.areia}>{n.t}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ───────────────── SeloLei ─────────────────
// Selo circular em traço, que "carimba" em `carimbaEm`.
export const SeloLei: React.FC<{ entra: number; carimbaEm: number; texto?: string; sub?: string; tamanho?: number }> = ({ entra, carimbaEm, texto = "LEI 15.506/2026", sub = "SANCIONADA · 16/09/2026", tamanho = 420 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [carimbaEm, carimbaEm + 5, carimbaEm + 11], [1.6, 0.95, 1], clamp);
  const on = f >= carimbaEm;
  return (
    <div data-foco="selo da lei" style={{ opacity: ap(f, entra, 10), width: tamanho, height: tamanho, position: "relative" }}>
      <svg width={tamanho} height={tamanho} viewBox="0 0 400 400" style={{ scale: String(k), rotate: "-8deg", opacity: on ? 1 : 0.25 }}>
        <circle cx={200} cy={200} r={180} fill="none" stroke={on ? c.ferrugem : c.fio} strokeWidth={14} />
        <circle cx={200} cy={200} r={150} fill="none" stroke={on ? c.ferrugem : c.fio} strokeWidth={4} strokeDasharray="10 8" />
        <text x={200} y={190} textAnchor="middle" fontFamily={fontes.titulo} fontWeight={900} fontSize={56} fill={on ? c.areia : c.cinza}>{texto}</text>
        <text x={200} y={246} textAnchor="middle" fontFamily={fontes.mono} fontWeight={600} fontSize={22} fill={on ? c.enxofre : c.cinza}>{sub}</text>
      </svg>
    </div>
  );
};

// ───────────────── Cronometro2026 ─────────────────
// Relógio de contagem: o ponteiro corre até o marco (ex.: 10/11/2026) e para.
export const Cronometro2026: React.FC<{ entra: number; correEm: number; data?: string; rotulo?: string; tamanho?: number }> = ({ entra, correEm, data = "10/11/2026", rotulo = "SUSPENSÃO CHINESA", tamanho = 420 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [correEm, correEm + 90], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const ang = p * 330;
  return (
    <div data-foco="cronômetro" style={{ opacity: ap(f, entra, 10), width: tamanho, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <svg width={tamanho} height={tamanho} viewBox="0 0 400 400">
        <circle cx={200} cy={200} r={170} fill={c.gelo} stroke={c.areia} strokeWidth={8} />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={200 + 150 * Math.sin((i * Math.PI) / 6)} y1={200 - 150 * Math.cos((i * Math.PI) / 6)} x2={200 + 130 * Math.sin((i * Math.PI) / 6)} y2={200 - 130 * Math.cos((i * Math.PI) / 6)} stroke={c.cinza} strokeWidth={4} />
        ))}
        <path d={`M 200 200 L 200 40 A 160 160 0 ${ang > 180 ? 1 : 0} 1 ${200 + 160 * Math.sin((ang * Math.PI) / 180)} ${200 - 160 * Math.cos((ang * Math.PI) / 180)} Z`} fill={c.ferrugem} opacity={0.28} />
        <line x1={200} y1={200} x2={200 + 140 * Math.sin((ang * Math.PI) / 180)} y2={200 - 140 * Math.cos((ang * Math.PI) / 180)} stroke={c.enxofre} strokeWidth={8} strokeLinecap="round" />
        <circle cx={200} cy={200} r={12} fill={c.enxofre} />
      </svg>
      <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 72, color: p > 0.95 ? c.enxofre : c.areia, whiteSpace: "nowrap" }}>{data}</div>
      <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 26, color: c.cinza, whiteSpace: "nowrap" }}>{rotulo}</div>
    </div>
  );
};

// ───────────────── Cartela de capítulo (jazida) ─────────────────
export const CartelaCapitulo: React.FC<{ numero: string; titulo: string; entra?: number }> = ({ numero, titulo, entra = 0 }) => {
  const f = useCurrentFrame();
  const a = ap(f, entra, 14);
  const b = ap(f, entra + 10, 14);
  return (
    <div data-cobre data-pausa-ok style={{ position: "absolute", inset: 0, backgroundColor: c.grafite, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div data-foco="cartela capítulo" style={{ opacity: a, fontFamily: fontes.titulo, fontWeight: 700, fontSize: 56, letterSpacing: 16, color: c.cinza, whiteSpace: "nowrap" }}>{`CAPÍTULO ${numero}`}</div>
      <div style={{ width: 160 * b, height: 6, borderRadius: 3, backgroundColor: c.ferrugem }} />
      <div data-foco="título capítulo" style={{ opacity: b, translate: `0 ${(1 - b) * 20}px`, fontFamily: fontes.titulo, fontWeight: 900, fontSize: 104, color: c.areia, whiteSpace: "nowrap" }}>{titulo}</div>
    </div>
  );
};
