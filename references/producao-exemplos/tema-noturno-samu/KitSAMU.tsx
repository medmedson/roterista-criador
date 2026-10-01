import { Easing, interpolate, useCurrentFrame } from "remotion";
import grade from "../data/grade-brasil.json";
import { c, fontes, sombra } from "../tema";

// KIT SAMU — tema noturno da central. Nunca pessoas, pacientes, vítimas, sangue ou rostos: só pontos, ícones,
// ambulâncias em desenho e telas. Cada elemento recebe frames RELATIVOS da cena (entra, …).
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.2, 0.7, 0.2, 1);
const ap = (f: number, a: number, d = 12) => interpolate(f, [a, a + d], [0, 1], { ...clamp, easing: suave });
const rnd = (i: number) => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const brilho = (cor: string, r = 18) => `0 0 ${r}px ${cor}`;

// ───────────────── Giroflex (motivo) ─────────────────
// Luz giratória âmbar e vermelha que varre a tela por `dur` frames a partir de `em`. Camada por cima, sem data-foco.
export const Giroflex: React.FC<{ em: number; dur?: number; forca?: number }> = ({ em, dur = 90, forca = 0.35 }) => {
  const f = useCurrentFrame();
  const env = interpolate(f, [em, em + 10, em + dur - 15, em + dur], [0, 1, 1, 0], clamp);
  if (env <= 0) return null;
  const ang = (f - em) * 9;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: env * forca, mixBlendMode: "screen" }}>
      <div style={{ position: "absolute", left: "50%", top: -260, width: 2600, height: 2600, translate: "-50% 0", rotate: `${ang}deg`, background: `conic-gradient(from 0deg, rgba(245,165,36,0.9) 0deg, rgba(245,165,36,0) 40deg, rgba(0,0,0,0) 180deg, rgba(214,45,32,0.9) 180deg, rgba(214,45,32,0) 220deg, rgba(0,0,0,0) 360deg)` }} />
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 220px rgba(214,45,32,${0.5 * env})` }} />
    </div>
  );
};

// ───────────────── MapaRotas ─────────────────
// Cartograma de pontos do Brasil. Cada rota liga um ponto de chamado a uma base (lon/lat), desenha-se em ciano
// e abre um círculo de tempo-resposta no destino. `acende`: cidades/pontos destacados com ping.
type G = { k: number; t: [number, number]; pts: [number, number][] };
const G_ = grade as unknown as G;
const proj = (lon: number, lat: number): [number, number] => {
  const l = (lon * Math.PI) / 180;
  const p = (lat * Math.PI) / 180;
  return [G_.t[0] + G_.k * l, G_.t[1] - G_.k * Math.log(Math.tan(Math.PI / 4 + p / 2))];
};
export const MapaRotas: React.FC<{
  entra: number;
  tamanho?: number;
  rotas?: { de: [number, number]; ate: [number, number]; f: number; rotulo?: string }[];
  acende?: { lonlat: [number, number]; f: number; rotulo?: string }[];
  legenda?: string;
}> = ({ entra, tamanho = 820, rotas = [], acende = [], legenda }) => {
  const f = useCurrentFrame();
  const o = ap(f, entra, 14);
  return (
    <div data-foco="mapa de rotas" style={{ opacity: o, width: tamanho, height: tamanho + (legenda ? 50 : 0), position: "relative" }}>
      <svg width={tamanho} height={tamanho} viewBox="0 0 1000 1000" style={{ overflow: "visible" }}>
        {G_.pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={4.2} fill={c.fio} opacity={interpolate(f, [entra + (i % 40), entra + (i % 40) + 12], [0, 0.75], clamp)} />
        ))}
        {rotas.map((r, i) => {
          const [x1, y1] = proj(r.de[0], r.de[1]);
          const [x2, y2] = proj(r.ate[0], r.ate[1]);
          const p = ap(f, r.f, 30);
          const circ = ap(f, r.f + 28, 24);
          const mx = (x1 + x2) / 2 - (y2 - y1) * 0.25;
          const my = (y1 + y2) / 2 + (x2 - x1) * 0.25;
          const len = 1200;
          return (
            <g key={i}>
              <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} fill="none" stroke={c.ciano} strokeWidth={6} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} style={{ filter: `drop-shadow(0 0 6px ${c.ciano})` }} />
              <circle cx={x1} cy={y1} r={10} fill={c.ambar} opacity={ap(f, r.f - 6, 6)} />
              <circle cx={x2} cy={y2} r={10} fill={c.ciano} opacity={p} />
              <circle cx={x2} cy={y2} r={20 + 70 * circ} fill="none" stroke={c.ciano} strokeWidth={3} opacity={circ * (1 - 0.6 * circ)} />
              {r.rotulo ? <text x={x2 + 18} y={y2 - 18} fontFamily={fontes.mono} fontSize={30} fill={c.claro} opacity={circ}>{r.rotulo}</text> : null}
            </g>
          );
        })}
        {acende.map((a, i) => {
          const [x, y] = proj(a.lonlat[0], a.lonlat[1]);
          const e = ap(f, a.f, 8);
          const pul = (f - a.f) % 30 / 30;
          return (
            <g key={`a${i}`} opacity={e}>
              <circle cx={x} cy={y} r={11} fill={c.ambar} />
              <circle cx={x} cy={y} r={11 + 30 * pul} fill="none" stroke={c.ambar} strokeWidth={3} opacity={1 - pul} />
              {a.rotulo ? <text x={x + 20} y={y + 10} fontFamily={fontes.titulo} fontWeight={800} fontSize={34} fill={c.claro}>{a.rotulo}</text> : null}
            </g>
          );
        })}
      </svg>
      {legenda ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center", fontFamily: fontes.mono, fontSize: 24, color: c.cinza, whiteSpace: "nowrap" }}>{legenda}</div> : null}
    </div>
  );
};

// ───────────────── PainelCentral ─────────────────
// Mesa da central vista de cima: tela de mapa (pontos), lista de chamados e faixa de status. SEM pessoas.
export const PainelCentral: React.FC<{ entra: number; largura?: number; chamados?: string[]; status?: string }> = ({
  entra,
  largura = 1500,
  chamados = ["CHAMADO 0418 · aguardando regulação", "CHAMADO 0419 · equipe enviada", "CHAMADO 0420 · orientação médica", "CHAMADO 0421 · em atendimento"],
  status = "CENTRAL DE REGULAÇÃO · 192",
}) => {
  const f = useCurrentFrame();
  const k = largura / 1500;
  const tela = (i: number) => ap(f, entra + 8 + i * 10, 14);
  const Tela: React.FC<{ i: number; w: number; children: React.ReactNode }> = ({ i, w, children }) => (
    <div style={{ width: w * k, height: 420 * k, borderRadius: 14 * k, backgroundColor: "#071629", border: `${3 * k}px solid ${c.fio}`, boxShadow: tela(i) > 0.5 ? brilho("rgba(53,198,232,0.35)", 30 * k) : "none", opacity: 0.3 + 0.7 * tela(i), overflow: "hidden", position: "relative" }}>
      {children}
    </div>
  );
  return (
    <div data-foco="painel da central" style={{ opacity: ap(f, entra, 10), width: largura, padding: 30 * k, borderRadius: 26 * k, backgroundColor: c.painel, boxShadow: sombra, display: "flex", flexDirection: "column", gap: 20 * k }}>
      <div style={{ display: "flex", gap: 20 * k }}>
        <Tela i={0} w={440}>
          <svg width="100%" height="100%" viewBox="0 0 1000 1000">
            {G_.pts.filter((_, i) => i % 2 === 0).map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={7} fill={rnd(i) > 0.93 ? c.ambar : c.ciano} opacity={interpolate(f, [entra + 20 + (i % 50), entra + 30 + (i % 50)], [0, rnd(i) > 0.93 ? 1 : 0.45], clamp)} />
            ))}
          </svg>
        </Tela>
        <Tela i={1} w={620}>
          <div style={{ padding: 22 * k, display: "flex", flexDirection: "column", gap: 14 * k }}>
            {chamados.map((ch, i) => (
              <div key={i} style={{ opacity: ap(f, entra + 30 + i * 12, 8), display: "flex", alignItems: "center", gap: 12 * k, fontFamily: fontes.mono, fontSize: 24 * k, color: c.claro, whiteSpace: "nowrap" }}>
                <div style={{ width: 14 * k, height: 14 * k, borderRadius: 7 * k, backgroundColor: i === 0 ? c.ambar : c.ciano, flexShrink: 0 }} />
                {ch}
              </div>
            ))}
          </div>
        </Tela>
        <Tela i={2} w={360}>
          <div style={{ padding: 22 * k, display: "flex", flexDirection: "column", gap: 18 * k }}>
            {[0.82, 0.56, 0.71, 0.4].map((v, i) => (
              <div key={i} style={{ height: 22 * k, borderRadius: 11 * k, backgroundColor: "#0F2747" }}>
                <div style={{ width: `${v * 100 * ap(f, entra + 40 + i * 6, 20)}%`, height: "100%", borderRadius: 11 * k, backgroundColor: i === 1 ? c.ambar : c.ciano }} />
              </div>
            ))}
          </div>
        </Tela>
      </div>
      <div style={{ height: 56 * k, borderRadius: 10 * k, backgroundColor: "#071629", display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${24 * k}px`, fontFamily: fontes.mono, fontSize: 24 * k, color: c.ciano, whiteSpace: "nowrap", opacity: tela(3) }}>
        <span>{status}</span>
        <span style={{ color: c.ambar }}>● AO VIVO</span>
      </div>
    </div>
  );
};

// ───────────────── CartaoChamada ─────────────────
// Ficha de regulação genérica: campos que se preenchem; o carimbo REGULADO cai em `carimboEm`.
export const CartaoChamada: React.FC<{ entra: number; campos: { rotulo: string; valor: string; f: number }[]; carimboEm?: number; carimbo?: string; largura?: number }> = ({
  entra,
  campos,
  carimboEm,
  carimbo = "REGULADO",
  largura = 900,
}) => {
  const f = useCurrentFrame();
  const cai = carimboEm === undefined ? 0 : interpolate(f, [carimboEm, carimboEm + 6, carimboEm + 10], [0, 1.15, 1], clamp);
  return (
    <div data-foco="ficha de regulação" style={{ opacity: ap(f, entra, 10), width: largura, borderRadius: 16, backgroundColor: c.branco, boxShadow: sombra, padding: "36px 46px", position: "relative", display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 28, letterSpacing: 4, color: c.ciano, whiteSpace: "nowrap" }}>FICHA DE REGULAÇÃO · 192</div>
      {campos.map((cp, i) => {
        const e = ap(f, cp.f, 8);
        const n = Math.floor(interpolate(f, [cp.f, cp.f + 20], [0, cp.valor.length], clamp));
        return (
          <div key={i} style={{ display: "flex", gap: 20, alignItems: "baseline", opacity: 0.35 + 0.65 * e }}>
            <div style={{ width: 230, flexShrink: 0, fontFamily: fontes.mono, fontSize: 24, color: c.cinza, whiteSpace: "nowrap" }}>{cp.rotulo}</div>
            <div style={{ flex: 1, minHeight: 44, borderBottom: `2px solid ${c.fio}`, fontFamily: fontes.texto, fontWeight: 600, fontSize: 34, color: c.claro, whiteSpace: "nowrap" }}>{cp.valor.slice(0, n)}</div>
          </div>
        );
      })}
      {carimboEm !== undefined ? (
        <div style={{ position: "absolute", right: 40, bottom: 30, opacity: cai > 0 ? 1 : 0, scale: String(cai), rotate: "-8deg", padding: "8px 22px", border: `5px solid ${c.ciano}`, borderRadius: 10, fontFamily: fontes.titulo, fontWeight: 900, fontSize: 44, letterSpacing: 4, color: c.ciano, whiteSpace: "nowrap" }}>
          {carimbo}
        </div>
      ) : null}
    </div>
  );
};

// ───────────────── FluxoRegulacao ─────────────────
// Chamada → médico regulador (ícone) → 3 saídas. Em `escolheEm` a saída `escolhe` acende.
export const FluxoRegulacao: React.FC<{ entra: number; saidas?: [string, string, string]; escolhe?: number; escolheEm?: number }> = ({
  entra,
  saidas = ["CONSELHO MÉDICO", "ENVIO DE EQUIPE", "MÚLTIPLOS MEIOS"],
  escolhe,
  escolheEm,
}) => {
  const f = useCurrentFrame();
  const esc = escolheEm === undefined ? 0 : ap(f, escolheEm, 12);
  const No: React.FC<{ t: string; o: number; on?: boolean; w?: number }> = ({ t, o, on, w = 380 }) => (
    <div style={{ width: w, height: 100, opacity: o, borderRadius: 14, backgroundColor: on ? c.ciano : c.branco, border: `3px solid ${on ? c.ciano : c.fio}`, boxShadow: on ? brilho("rgba(53,198,232,0.6)", 26) : sombra, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.titulo, fontWeight: 800, fontSize: 36, color: on ? c.noite : c.claro, whiteSpace: "nowrap" }}>
      {t}
    </div>
  );
  return (
    <div data-foco="fluxo de regulação" style={{ width: 1500, height: 560, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 230 }}><No t="CHAMADA 192" o={ap(f, entra)} w={320} /></div>
      <div style={{ position: "absolute", left: 470, top: 200, width: 360, height: 160, opacity: ap(f, entra + 14), borderRadius: 18, backgroundColor: c.branco, border: `3px solid ${c.ambar}`, boxShadow: sombra, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
        {/* ícone genérico: estetoscópio + fone, sem rosto */}
        <svg width={70} height={70} viewBox="0 0 70 70">
          <path d="M14 8 V30 a21 21 0 0 0 42 0 V8" fill="none" stroke={c.ambar} strokeWidth={6} strokeLinecap="round" />
          <circle cx={35} cy={58} r={8} fill={c.ambar} />
        </svg>
        <div style={{ fontFamily: fontes.titulo, fontWeight: 800, fontSize: 34, color: c.claro, lineHeight: 1.05 }}>MÉDICO<br />REGULADOR</div>
      </div>
      <svg width={1500} height={560} style={{ position: "absolute", inset: 0 }}>
        <line x1={320} y1={280} x2={470} y2={280} stroke={c.fio} strokeWidth={5} opacity={ap(f, entra + 10)} />
        {[80, 280, 480].map((y, i) => (
          <path key={i} d={`M 830 280 C 950 280, 960 ${y}, 1100 ${y}`} fill="none" stroke={escolhe === i && esc > 0 ? c.ciano : c.fio} strokeWidth={escolhe === i && esc > 0 ? 8 : 4} opacity={ap(f, entra + 24 + i * 6)} />
        ))}
      </svg>
      {saidas.map((s, i) => (
        <div key={s} style={{ position: "absolute", left: 1100, top: 30 + i * 200 }}>
          <No t={s} o={ap(f, entra + 28 + i * 6) * (escolhe === undefined || esc === 0 || escolhe === i ? 1 : 0.4)} on={escolhe === i && esc > 0.5} />
        </div>
      ))}
    </div>
  );
};

// ───────────────── AmbulanciaCorte ─────────────────
// Ambulância em corte lateral (desenho), maca vazia; cada equipamento recebe rótulo em `f`. Sem paciente.
export const AmbulanciaCorte: React.FC<{ entra: number; rotulos?: { t: string; x: number; y: number; f: number }[]; largura?: number }> = ({ entra, rotulos = [], largura = 1400 }) => {
  const f = useCurrentFrame();
  const abre = ap(f, entra + 10, 20);
  return (
    <div data-foco="ambulância em corte" style={{ width: largura, height: largura * 0.5, position: "relative", opacity: ap(f, entra, 10) }}>
      <svg width={largura} height={largura * 0.5} viewBox="0 0 1400 700">
        {/* carroceria */}
        <path d="M80 520 V200 Q80 160 120 160 H880 V120 Q880 100 900 100 H1080 Q1130 100 1160 150 L1290 330 Q1320 370 1320 420 V520 Z" fill={c.claro} stroke={c.fio} strokeWidth={6} />
        <rect x={80} y={300} width={1240} height={34} fill={c.giroflex} />
        <rect x={900} y={130} width={170} height={40} rx={8} fill={c.ambar} />
        {/* janela da cabine */}
        <path d="M1100 170 H1150 L1260 330 H1100 Z" fill="#1E3B66" />
        {/* rodas */}
        {[300, 1080].map((x) => (
          <g key={x}>
            <circle cx={x} cy={540} r={78} fill="#0A1426" />
            <circle cx={x} cy={540} r={34} fill={c.fio} />
          </g>
        ))}
        {/* corte: interior aparece */}
        <g opacity={abre}>
          <rect x={110} y={190} width={840} height={300} rx={12} fill="#0F2747" stroke={c.ciano} strokeWidth={3} />
          <rect x={170} y={400} width={520} height={44} rx={10} fill={c.cinza} />
          <rect x={200} y={444} width={18} height={40} fill={c.fio} />
          <rect x={640} y={444} width={18} height={40} fill={c.fio} />
          <rect x={760} y={220} width={150} height={110} rx={10} fill="#071629" stroke={c.ciano} strokeWidth={3} />
          <path d="M775 290 L805 290 L815 255 L830 315 L845 270 L855 290 L895 290" fill="none" stroke={c.ciano} strokeWidth={4} />
          <rect x={150} y={220} width={60} height={150} rx={20} fill={c.ciano} opacity={0.8} />
          <rect x={250} y={230} width={160} height={90} rx={8} fill={c.ambar} opacity={0.85} />
          <rect x={450} y={230} width={140} height={90} rx={8} fill={c.claro} opacity={0.85} />
        </g>
      </svg>
      {rotulos.map((r, i) => {
        const e = ap(f, r.f, 8);
        return (
          <div key={i} style={{ position: "absolute", left: (r.x / 1400) * largura, top: (r.y / 700) * largura * 0.5, opacity: e, translate: `0 ${(1 - e) * 10}px`, padding: "6px 14px", borderRadius: 8, backgroundColor: c.noite, border: `2px solid ${c.ciano}`, fontFamily: fontes.mono, fontWeight: 600, fontSize: 22, color: c.claro, whiteSpace: "nowrap" }}>
            {r.t}
          </div>
        );
      })}
    </div>
  );
};

// ───────────────── TabelaEquipes ─────────────────
// Grade de tipos de unidade com ícones de função (letras em círculo, sem rostos).
export const TabelaEquipes: React.FC<{ linhas: { tipo: string; sigla: string; funcoes: string[]; f: number }[]; largura?: number }> = ({ linhas, largura = 1600 }) => {
  const f = useCurrentFrame();
  const corF: Record<string, string> = { MÉDICO: c.ambar, ENFERMEIRO: c.ciano, TÉCNICO: c.claro, CONDUTOR: c.cinza, PILOTO: c.cinza };
  return (
    <div data-foco="tabela de equipes" style={{ width: largura, display: "flex", flexDirection: "column", gap: 14 }}>
      {linhas.map((l, i) => {
        const e = ap(f, l.f, 10);
        return (
          <div key={l.sigla} style={{ opacity: e, translate: `${(1 - e) * -40}px 0`, display: "flex", alignItems: "center", gap: 26, padding: "16px 28px", borderRadius: 14, backgroundColor: c.branco, boxShadow: sombra }}>
            <div style={{ width: 150, fontFamily: fontes.titulo, fontWeight: 900, fontSize: 46, color: c.ciano, whiteSpace: "nowrap" }}>{l.sigla}</div>
            <div style={{ width: 560, fontFamily: fontes.texto, fontWeight: 600, fontSize: 30, color: c.claro, whiteSpace: "nowrap" }}>{l.tipo}</div>
            <div style={{ display: "flex", gap: 12 }}>
              {l.funcoes.map((fn, j) => (
                <div key={j} style={{ opacity: ap(f, l.f + 8 + j * 5, 8), padding: "6px 14px", borderRadius: 20, border: `2px solid ${corF[fn] ?? c.fio}`, fontFamily: fontes.mono, fontWeight: 600, fontSize: 20, color: corF[fn] ?? c.claro, whiteSpace: "nowrap" }}>{fn}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ───────────────── ReguaMinuto ─────────────────
// Régua de minutos com marcas; a agulha corre e para em cada marco no frame `f` dele.
export const ReguaMinuto: React.FC<{ entra: number; marcas: { min: number; rotulo: string; f: number }[]; max?: number; ticks?: number[]; largura?: number }> = ({
  entra,
  marcas,
  max = 60,
  ticks = [0, 5, 15, 30, 60],
  largura = 1560,
}) => {
  const f = useCurrentFrame();
  const x = (m: number) => 40 + (Math.sqrt(m) / Math.sqrt(max)) * (largura - 80); // escala raiz: os primeiros minutos ficam legíveis
  let alvo = 0;
  let de = 0;
  let t0 = 0;
  for (const m of marcas) if (f >= m.f) { de = alvo; alvo = m.min; t0 = m.f; }
  const pos = de + (alvo - de) * ap(f, t0, 24);
  return (
    <div data-foco="régua de minutos" style={{ opacity: ap(f, entra, 10), width: largura, height: 300, position: "relative" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 150, height: 10, borderRadius: 5, backgroundColor: c.fio }} />
      {ticks.map((m) => (
        <div key={m} style={{ position: "absolute", left: x(m), top: 136, translate: "-50% 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 4, height: 38, backgroundColor: c.cinza }} />
          <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 28, color: c.cinza, whiteSpace: "nowrap" }}>{`${m} min`}</div>
        </div>
      ))}
      {marcas.map((m, i) => (
        <div key={i} style={{ position: "absolute", left: x(m.min), top: 30, translate: "-50% 0", opacity: ap(f, m.f + 20, 10), fontFamily: fontes.titulo, fontWeight: 800, fontSize: 34, color: c.ambar, whiteSpace: "nowrap" }}>{m.rotulo}</div>
      ))}
      <div style={{ position: "absolute", left: x(pos), top: 86, translate: "-50% 0", width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `40px solid ${c.ciano}`, filter: `drop-shadow(0 0 8px ${c.ciano})` }} />
    </div>
  );
};

// ───────────────── Balanca3 ─────────────────
// Três colunas de custeio que se enchem (União / Estado / Município), com linha de referência opcional.
export const Balanca3: React.FC<{ entra: number; colunas: { rotulo: string; pct: number; texto: string; f: number; cor?: string }[]; linha?: number; altura?: number }> = ({ entra, colunas, linha = 50, altura = 520 }) => {
  const f = useCurrentFrame();
  return (
    <div data-foco="custeio em três partes" style={{ opacity: ap(f, entra, 10), display: "flex", gap: 70, alignItems: "flex-end", height: altura + 120, position: "relative", padding: "0 30px" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90 + (linha / 100) * altura, borderTop: `3px dashed ${c.ambar}`, opacity: ap(f, entra + 20, 10) }}>
        <span style={{ position: "absolute", right: 0, top: -40, fontFamily: fontes.mono, fontSize: 24, color: c.ambar, whiteSpace: "nowrap" }}>{`${linha}%`}</span>
      </div>
      {colunas.map((col, i) => {
        const p = ap(f, col.f, 30);
        return (
          <div key={col.rotulo} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 56, color: c.claro, opacity: p, whiteSpace: "nowrap" }}>{col.texto}</div>
            <div style={{ width: 230, height: altura, borderRadius: 14, border: `3px solid ${c.fio}`, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
              <div style={{ width: "100%", height: `${col.pct * p}%`, backgroundColor: col.cor ?? [c.ciano, c.ambar, c.cinza][i % 3] }} />
            </div>
            <div style={{ fontFamily: fontes.titulo, fontWeight: 800, fontSize: 36, color: c.claro, whiteSpace: "nowrap" }}>{col.rotulo}</div>
          </div>
        );
      })}
    </div>
  );
};

// ───────────────── ValorReal ─────────────────
// Dois cartões de moeda: valor nominal e em reais de hoje; o segundo encolhe com a inflação a partir de `encolheEm`.
export const ValorReal: React.FC<{ entra: number; nominal: string; real: string; perda: number; encolheEm: number; tarja?: string }> = ({ entra, nominal, real, perda, encolheEm, tarja = "CÁLCULO DO CANAL · IPCA/IBGE" }) => {
  const f = useCurrentFrame();
  const e = ap(f, encolheEm, 40);
  const Cart: React.FC<{ t: string; v: string; h: number; cor: string; o: number }> = ({ t, v, h, cor, o }) => (
    <div style={{ opacity: o, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ width: 380, height: 420, display: "flex", alignItems: "flex-end" }}>
        <div style={{ width: "100%", height: `${h * 100}%`, borderRadius: 16, backgroundColor: c.branco, border: `4px solid ${cor}`, boxShadow: sombra, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.titulo, fontWeight: 900, fontSize: 60, color: cor, whiteSpace: "nowrap" }}>{v}</div>
      </div>
      <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 26, color: c.cinza, whiteSpace: "nowrap" }}>{t}</div>
    </div>
  );
  return (
    <div data-foco="valor real" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <div style={{ display: "flex", gap: 90 }}>
        <Cart t="VALOR NOMINAL" v={nominal} h={1} cor={c.ciano} o={ap(f, entra)} />
        <Cart t="EM REAIS DE HOJE" v={real} h={1 - perda * e} cor={c.ambar} o={ap(f, entra + 12)} />
      </div>
      <div style={{ opacity: ap(f, encolheEm + 30, 10), padding: "6px 16px", borderRadius: 8, border: `2px solid ${c.ambar}`, fontFamily: fontes.mono, fontWeight: 600, fontSize: 24, color: c.ambar, whiteSpace: "nowrap" }}>{tarja}</div>
    </div>
  );
};

// ───────────────── LinhaNorma ─────────────────
// Fita de dados horizontal (sem rolagem: os marcos dividem a largura); cada marco acende com pulso ciano em `f`.
export const LinhaNorma: React.FC<{ marcos: { ano: string; titulo: string; f: number }[]; largura?: number; entra?: number; destaque?: number[] }> = ({ marcos, largura = 1700, entra = 0, destaque = [] }) => {
  const f = useCurrentFrame();
  const passo = largura / marcos.length;
  return (
    <div data-foco="linha da norma" style={{ opacity: ap(f, entra, 10), width: largura, height: 280, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 8, borderRadius: 4, backgroundColor: c.fio }} />
      <div style={{ position: "absolute", left: 0, top: 120, height: 8, borderRadius: 4, backgroundColor: c.ciano, width: `${(marcos.filter((m) => f >= m.f).length / marcos.length) * 100}%`, boxShadow: brilho(c.ciano, 10) }} />
      {marcos.map((m, i) => {
        const e = ap(f, m.f, 10);
        const pul = interpolate(f, [m.f, m.f + 20], [0, 1], clamp);
        const d = destaque.includes(i);
        return (
          <div key={i} style={{ position: "absolute", left: i * passo + passo / 2, top: 0, translate: "-50% 0", width: passo - 10, display: "flex", flexDirection: "column", alignItems: "center", opacity: 0.25 + 0.75 * e }}>
            <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 32, color: d ? c.ambar : c.claro, whiteSpace: "nowrap", height: 80, display: "flex", alignItems: "flex-end" }}>{m.ano}</div>
            <div style={{ position: "relative", width: 28, height: 28, marginTop: 26, borderRadius: 14, backgroundColor: e > 0.5 ? (d ? c.ambar : c.ciano) : c.fio }}>
              <div style={{ position: "absolute", inset: -24 * pul, borderRadius: "50%", border: `3px solid ${c.ciano}`, opacity: e > 0 ? 1 - pul : 0 }} />
            </div>
            <div style={{ marginTop: 22, fontFamily: fontes.texto, fontWeight: 600, fontSize: 22, lineHeight: 1.2, color: c.cinza, textAlign: "center" }}>{m.titulo}</div>
          </div>
        );
      })}
    </div>
  );
};

// ───────────────── RadarCobertura ─────────────────
// Mapa de UFs em quadrados (cartograma) com cor por cobertura/valor (0–1).
const GRADE: Record<string, [number, number]> = {
  RR: [2, 0], AP: [4, 0], AC: [0, 1], AM: [1, 1], PA: [3, 1], MA: [4, 1], CE: [5, 1], RN: [6, 1],
  RO: [1, 2], MT: [2, 2], TO: [3, 2], PI: [4, 2], PE: [5, 2], PB: [6, 2], MS: [2, 3], GO: [3, 3], BA: [4, 3], SE: [5, 3], AL: [6, 3],
  DF: [3, 4], MG: [4, 4], ES: [5, 4], SP: [3, 5], RJ: [4, 5], PR: [3, 6], SC: [3, 7], RS: [3, 8],
};
export const RadarCobertura: React.FC<{ entra: number; valores?: Record<string, number>; celula?: number; passo?: number; legenda?: string; destaque?: string[] }> = ({ entra, valores, celula = 92, passo = 2, legenda, destaque = [] }) => {
  const f = useCurrentFrame();
  return (
    <div data-foco="mapa de cobertura" style={{ position: "relative", width: 7 * celula, height: 9 * celula + (legenda ? 60 : 0) }}>
      {Object.entries(GRADE).map(([uf, [x, y]], i) => {
        const a = ap(f, entra + i * passo, 10);
        const v = valores ? valores[uf] ?? 0 : 1;
        const d = destaque.includes(uf);
        return (
          <div key={uf} style={{ position: "absolute", left: x * celula + 4, top: y * celula + 4, width: celula - 8, height: celula - 8, borderRadius: 8, opacity: 0.3 + 0.7 * a, backgroundColor: c.fio, overflow: "hidden", boxShadow: d ? `0 0 0 4px ${c.ambar}` : "none" }}>
            <div style={{ position: "absolute", inset: 0, backgroundColor: d ? c.ambar : c.ciano, opacity: a * (0.15 + 0.85 * v) }} />
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.titulo, fontWeight: 800, fontSize: 30, color: v * a > 0.55 || d ? c.noite : c.claro }}>{uf}</span>
          </div>
        );
      })}
      {legenda ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center", fontFamily: fontes.mono, fontSize: 24, color: c.cinza, whiteSpace: "nowrap" }}>{legenda}</div> : null}
    </div>
  );
};

// ───────────────── Cartela de capítulo (noturno) ─────────────────
export const CartelaCapitulo: React.FC<{ numero: string; titulo: string; entra?: number }> = ({ numero, titulo, entra = 0 }) => {
  const f = useCurrentFrame();
  const a = ap(f, entra, 14);
  const b = ap(f, entra + 10, 14);
  return (
    <div data-cobre data-pausa-ok style={{ position: "absolute", inset: 0, backgroundColor: c.noite, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div data-foco="cartela capítulo" style={{ opacity: a, fontFamily: fontes.titulo, fontWeight: 700, fontSize: 56, letterSpacing: 16, color: c.cinza, whiteSpace: "nowrap" }}>{`CAPÍTULO ${numero}`}</div>
      <div style={{ width: 160 * b, height: 6, borderRadius: 3, backgroundColor: c.giroflex, boxShadow: brilho("rgba(214,45,32,0.8)", 14) }} />
      <div data-foco="título capítulo" style={{ opacity: b, translate: `0 ${(1 - b) * 20}px`, fontFamily: fontes.titulo, fontWeight: 900, fontSize: 110, color: c.claro, whiteSpace: "nowrap" }}>{titulo}</div>
    </div>
  );
};
