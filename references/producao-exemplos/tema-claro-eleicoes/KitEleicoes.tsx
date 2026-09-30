import { Easing, interpolate, useCurrentFrame } from "remotion";
import mapa from "../data/mapa.json";
import pontos from "../data/pontos-secoes.json";
import { c, fontes, sombra } from "../tema";

// KIT ELEIÇÕES — tema claro/clean. Todos os elementos são genéricos: nenhum nome ou número de candidato real,
// nenhum partido, nenhum logotipo, nenhuma marca de fabricante. Cada um recebe frames RELATIVOS (entra, …) da cena.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.2, 0.7, 0.2, 1);
const ap = (f: number, a: number, d = 12) => interpolate(f, [a, a + d], [0, 1], { ...clamp, easing: suave });
const rnd = (i: number) => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

// ───────────────────────── TecladoUrna (motivo do vídeo) ─────────────────────────
// Teclado genérico de 12 teclas + BRANCO / CORRIGE / CONFIRMA. Digita `digitos` a partir de `digitaEm` (1 tecla a cada `passo` frames).
// `acende`: tecla que fica acesa (marca de capítulo). `confirmaEm`: a tecla verde é pressionada e pulsa.
export const TecladoUrna: React.FC<{
  entra: number;
  largura?: number;
  digitos?: string;
  digitaEm?: number;
  passo?: number;
  acende?: "BRANCO" | "CORRIGE" | "CONFIRMA" | string | null;
  confirmaEm?: number;
  visor?: boolean;
}> = ({ entra, largura = 520, digitos = "", digitaEm = 0, passo = 12, acende = null, confirmaEm, visor = true }) => {
  const f = useCurrentFrame();
  const o = ap(f, entra, 14);
  const k = largura / 520;
  const teclas = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""];
  const idx = Math.floor((f - digitaEm) / passo);
  const digitado = f >= digitaEm ? digitos.slice(0, Math.min(digitos.length, idx + 1)) : "";
  const apertada = (t: string) => f >= digitaEm && idx >= 0 && idx < digitos.length && digitos[idx] === t && (f - digitaEm) % passo < 6;
  const conf = confirmaEm !== undefined && f >= confirmaEm;
  const pulso = conf ? 0.5 + 0.5 * Math.sin((f - confirmaEm!) / 5) : 0;
  const Tecla: React.FC<{ t: string; i: number }> = ({ t, i }) => {
    if (!t) return <div style={{ width: 130 * k, height: 96 * k }} />;
    const on = apertada(t) || acende === t;
    const e = ap(f, entra + 4 + i * 2, 8);
    return (
      <div
        style={{
          width: 130 * k,
          height: 96 * k,
          borderRadius: 14 * k,
          border: `${3 * k}px solid ${on ? c.azul : c.tinta}`,
          backgroundColor: on ? c.azul : c.branco,
          color: on ? c.branco : c.tinta,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fontes.titulo,
          fontWeight: 800,
          fontSize: 56 * k,
          opacity: e,
          scale: String(apertada(t) ? 0.92 : 1),
          boxShadow: on ? `0 0 ${24 * k}px rgba(28,63,148,0.45)` : "0 4px 10px rgba(27,31,42,0.10)",
        }}
      >
        {t}
      </div>
    );
  };
  const Colorida: React.FC<{ nome: string; cor: string; texto: string; i: number }> = ({ nome, cor, texto, i }) => {
    const on = acende === nome || (nome === "CONFIRMA" && conf);
    const brilho = nome === "CONFIRMA" && conf ? pulso : on ? 1 : 0;
    return (
      <div
        style={{
          flex: 1,
          height: 92 * k,
          borderRadius: 14 * k,
          backgroundColor: cor,
          border: `${3 * k}px solid ${nome === "BRANCO" ? c.tinta : cor}`,
          color: texto,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fontes.titulo,
          fontWeight: 800,
          fontSize: 30 * k,
          letterSpacing: 2 * k,
          whiteSpace: "nowrap",
          opacity: ap(f, entra + 30 + i * 3, 8) * (on || acende === null ? 1 : 0.45),
          scale: String(nome === "CONFIRMA" && conf && f - confirmaEm! < 6 ? 0.92 : 1),
          boxShadow: brilho ? `0 0 ${40 * k * (0.4 + brilho)}px ${cor}` : "0 4px 10px rgba(27,31,42,0.10)",
        }}
      >
        {nome}
      </div>
    );
  };
  return (
    <div data-foco="teclado da urna" style={{ opacity: o, translate: `0 ${(1 - o) * 30}px`, width: largura, padding: 28 * k, borderRadius: 26 * k, backgroundColor: c.gelo, boxShadow: sombra, display: "flex", flexDirection: "column", gap: 16 * k }}>
      {visor ? (
        <div style={{ height: 84 * k, borderRadius: 10 * k, backgroundColor: c.branco, border: `${2 * k}px solid ${c.fio}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 * k }}>
          {Array.from({ length: Math.max(4, digitos.length) }, (_, i) => (
            <div key={i} style={{ width: 52 * k, height: 62 * k, borderBottom: `${4 * k}px solid ${digitado[i] ? c.azul : c.fio}`, fontFamily: fontes.mono, fontWeight: 600, fontSize: 50 * k, color: c.tinta, textAlign: "center", lineHeight: `${62 * k}px` }}>
              {digitado[i] ?? ""}
            </div>
          ))}
        </div>
      ) : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 * k, justifyItems: "center" }}>
        {teclas.map((t, i) => (
          <Tecla key={i} t={t} i={i} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 12 * k }}>
        <Colorida nome="BRANCO" cor={c.branco} texto={c.tinta} i={0} />
        <Colorida nome="CORRIGE" cor={c.laranja} texto={c.tinta} i={1} />
        <Colorida nome="CONFIRMA" cor={c.verde} texto={c.branco} i={2} />
      </div>
    </div>
  );
};

// ───────────────────────── Cedula ─────────────────────────
// Cédula de papel dobrada em quatro que desdobra e mostra campos em branco; o lápis marca um X em `marcaEm`.
export const Cedula: React.FC<{ entra: number; abreEm?: number; marcaEm?: number; titulo?: string; largura?: number; campos?: number }> = ({
  entra,
  abreEm,
  marcaEm,
  titulo = "CÉDULA OFICIAL",
  largura = 560,
  campos = 4,
}) => {
  const f = useCurrentFrame();
  const o = ap(f, entra, 10);
  const abre = abreEm === undefined ? 1 : ap(f, abreEm, 24);
  const h = largura * 1.25;
  const x1 = marcaEm === undefined ? 0 : ap(f, marcaEm, 10);
  const x2 = marcaEm === undefined ? 0 : ap(f, marcaEm + 10, 10);
  const alvo = 1; // campo marcado
  const yCampo = (i: number) => 150 + i * ((h - 230) / campos);
  return (
    <div data-foco="cédula" style={{ opacity: o, width: largura, height: h, perspective: 1600 }}>
      <div style={{ width: "100%", height: "100%", transformOrigin: "50% 0%", transform: `rotateX(${(1 - abre) * 70}deg) scale(${0.6 + 0.4 * abre})`, backgroundColor: c.branco, boxShadow: sombra, borderRadius: 4, position: "relative" }}>
        {/* vincos da dobra em quatro */}
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", borderTop: `2px dashed ${c.fio}`, opacity: 0.8 }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", borderLeft: `2px dashed ${c.fio}`, opacity: 0.8 }} />
        <div style={{ position: "absolute", left: 36, top: 34, fontFamily: fontes.titulo, fontWeight: 800, fontSize: 40, color: c.azul, letterSpacing: 3, whiteSpace: "nowrap" }}>{titulo}</div>
        {/* carimbo redondo genérico */}
        <svg width={110} height={110} style={{ position: "absolute", right: 26, bottom: 22, opacity: 0.75 }}>
          <circle cx={55} cy={55} r={48} fill="none" stroke={c.azul} strokeWidth={4} />
          <circle cx={55} cy={55} r={36} fill="none" stroke={c.azul} strokeWidth={2} />
          <text x={55} y={62} textAnchor="middle" fontFamily={fontes.mono} fontSize={18} fill={c.azul}>MESA</text>
        </svg>
        {Array.from({ length: campos }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 36, right: 36, top: yCampo(i), display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 54, height: 54, border: `3px solid ${c.tinta}`, borderRadius: 4, flexShrink: 0 }} />
            <div style={{ flex: 1, height: 14, backgroundColor: c.gelo, borderRadius: 7 }} />
          </div>
        ))}
        {marcaEm !== undefined ? (
          <svg width={54} height={54} style={{ position: "absolute", left: 36, top: yCampo(alvo) }}>
            <line x1={8} y1={8} x2={8 + 38 * x1} y2={8 + 38 * x1} stroke={c.tinta} strokeWidth={6} strokeLinecap="round" />
            <line x1={46} y1={8} x2={46 - 38 * x2} y2={8 + 38 * x2} stroke={c.tinta} strokeWidth={6} strokeLinecap="round" />
          </svg>
        ) : null}
      </div>
    </div>
  );
};

// ───────────────────────── UrnaDeLona ─────────────────────────
// Saco de lona lacrado com etiqueta; em `abreEm` o lacre rompe, a boca abre e os papéis caem e se empilham.
export const UrnaDeLona: React.FC<{ entra: number; abreEm?: number; etiqueta?: string; tamanho?: number }> = ({ entra, abreEm, etiqueta = "SEÇÃO · URNA 1", tamanho = 520 }) => {
  const f = useCurrentFrame();
  const o = ap(f, entra, 12);
  const abre = abreEm === undefined ? 0 : ap(f, abreEm, 18);
  const lona = "#C8B894";
  return (
    <div data-foco="urna de lona" style={{ opacity: o, width: tamanho, height: tamanho * 1.05, position: "relative" }}>
      <svg width={tamanho} height={tamanho * 1.05} viewBox="0 0 520 546" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* papéis caindo e empilhando à frente */}
        {abreEm !== undefined
          ? Array.from({ length: 14 }, (_, i) => {
              const p = interpolate(f, [abreEm + 8 + i * 3, abreEm + 34 + i * 3], [0, 1], clamp);
              const x = 150 + rnd(i) * 220 + (rnd(i + 5) - 0.5) * 140 * p;
              const y = 90 + p * (420 - (i % 5) * 9);
              return <rect key={i} x={x} y={y} width={78} height={50} rx={3} fill={c.branco} stroke={c.fio} strokeWidth={2} transform={`rotate(${(rnd(i + 2) - 0.5) * 60 * p} ${x + 39} ${y + 25})`} opacity={p > 0 ? 1 : 0} />;
            })
          : null}
        {/* corpo */}
        <path d="M110 140 Q100 360 130 500 Q260 530 390 500 Q420 360 410 140 Z" fill={lona} stroke="#9C8B66" strokeWidth={5} />
        <path d="M140 200 Q260 215 380 200" stroke="#9C8B66" strokeWidth={3} fill="none" opacity={0.6} />
        <path d="M130 330 Q260 345 392 330" stroke="#9C8B66" strokeWidth={3} fill="none" opacity={0.5} />
        {/* boca: fechada (franzida) → aberta */}
        <path d={abre < 0.5 ? "M110 140 Q260 110 410 140 L380 120 Q260 95 140 120 Z" : "M110 140 Q260 170 410 140 L440 90 Q260 60 80 90 Z"} fill="#B5A47D" stroke="#9C8B66" strokeWidth={4} />
        {/* lacre */}
        <g opacity={1 - abre}>
          <rect x={235} y={112} width={50} height={40} rx={6} fill={c.vermelho} />
          <text x={260} y={138} textAnchor="middle" fontFamily={fontes.mono} fontSize={14} fill={c.branco}>LACRE</text>
        </g>
        {/* etiqueta */}
        <rect x={170} y={250} width={180} height={70} rx={6} fill={c.branco} stroke={c.tinta} strokeWidth={3} />
        <text x={260} y={293} textAnchor="middle" fontFamily={fontes.mono} fontWeight={600} fontSize={20} fill={c.tinta}>{etiqueta}</text>
      </svg>
    </div>
  );
};

// ───────────────────────── CabineVoto ─────────────────────────
// Cabine em corte vista de cima, SEM pessoas. Em `luzEm` uma luz acende e o teclado sobe da mesa.
export const CabineVoto: React.FC<{ entra: number; luzEm?: number; tamanho?: number }> = ({ entra, luzEm, tamanho = 640 }) => {
  const f = useCurrentFrame();
  const o = ap(f, entra, 12);
  const luz = luzEm === undefined ? 0 : ap(f, luzEm, 20);
  return (
    <div data-foco="cabine de votação" style={{ opacity: o, width: tamanho, height: tamanho * 0.8, position: "relative" }}>
      <svg width={tamanho} height={tamanho * 0.8} viewBox="0 0 640 512">
        <defs>
          <radialGradient id="luzCabine">
            <stop offset="0%" stopColor="#FFF6D8" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#FFF6D8" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect x={20} y={20} width={600} height={472} rx={16} fill={c.gelo} />
        {/* painéis em U */}
        <path d="M120 440 L120 90 L520 90 L520 440" fill="none" stroke={c.azul} strokeWidth={22} strokeLinejoin="round" />
        {/* mesa */}
        <rect x={180} y={120} width={280} height={150} rx={10} fill={c.branco} stroke={c.fio} strokeWidth={4} />
        <circle cx={320} cy={190} r={220} fill="url(#luzCabine)" opacity={luz} />
        {/* teclado sobe da mesa */}
        <g transform={`translate(320 195) scale(${0.3 + 0.7 * luz}) translate(-80 -55)`} opacity={luzEm === undefined ? 0.35 : 0.35 + 0.65 * luz}>
          <rect x={0} y={0} width={160} height={110} rx={10} fill={c.branco} stroke={c.tinta} strokeWidth={4} />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={14 + (i % 3) * 46} y={10 + Math.floor(i / 3) * 24} width={38} height={18} rx={4} fill={luz > 0.5 ? c.azul : c.fio} />
          ))}
          <rect x={14} y={84} width={38} height={18} rx={4} fill={c.branco} stroke={c.tinta} strokeWidth={2} />
          <rect x={60} y={84} width={38} height={18} rx={4} fill={c.laranja} />
          <rect x={106} y={84} width={38} height={18} rx={4} fill={c.verde} />
        </g>
        {/* chão / entrada */}
        <line x1={120} y1={470} x2={520} y2={470} stroke={c.fio} strokeWidth={4} strokeDasharray="14 12" />
      </svg>
    </div>
  );
};

// ───────────────────────── BobinaBU ─────────────────────────
// Impressora térmica e a tira do boletim de urna (linhas genéricas) saindo; o QR code aparece em `qrEm`.
const QR: React.FC<{ tam: number; semente?: number }> = ({ tam, semente = 3 }) => {
  const n = 21;
  const cel = tam / n;
  const olho = (x: number, y: number) => (
    <g>
      <rect x={x * cel} y={y * cel} width={7 * cel} height={7 * cel} fill={c.tinta} />
      <rect x={(x + 1) * cel} y={(y + 1) * cel} width={5 * cel} height={5 * cel} fill={c.branco} />
      <rect x={(x + 2) * cel} y={(y + 2) * cel} width={3 * cel} height={3 * cel} fill={c.tinta} />
    </g>
  );
  const cels = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const noOlho = (i < 8 && j < 8) || (i < 8 && j > n - 9) || (i > n - 9 && j < 8);
      if (!noOlho && rnd(i * n + j + semente * 1000) > 0.52) cels.push(<rect key={`${i}-${j}`} x={j * cel} y={i * cel} width={cel} height={cel} fill={c.tinta} />);
    }
  return (
    <svg width={tam} height={tam}>
      <rect width={tam} height={tam} fill={c.branco} />
      {cels}
      {olho(0, 0)}
      {olho(n - 7, 0)}
      {olho(0, n - 7)}
    </svg>
  );
};
export const BobinaBU: React.FC<{ entra: number; dur?: number; qrEm?: number; largura?: number; comprimento?: number; titulo?: string }> = ({
  entra,
  dur = 90,
  qrEm,
  largura = 380,
  comprimento = 640,
  titulo = "BOLETIM DE URNA",
}) => {
  const f = useCurrentFrame();
  const o = ap(f, entra, 8);
  const sai = interpolate(f, [entra, entra + dur], [0.12, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const qr = qrEm === undefined ? 0 : ap(f, qrEm, 14);
  const linhas = ["ZONA ····· 0000", "SEÇÃO ···· 0000", "ELEITORES APTOS ·· 000", "COMPARECIMENTO ··· 000", "CARGO A", "CANDIDATURA 1 ······ 000", "CANDIDATURA 2 ······ 000", "BRANCOS ··········· 00", "NULOS ············· 00", "TOTAL ············ 000"];
  return (
    <div data-foco="boletim de urna" style={{ opacity: o, width: largura + 80, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: largura + 80, height: 90, borderRadius: 14, backgroundColor: c.tinta, boxShadow: sombra, position: "relative", zIndex: 2 }}>
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 16, height: 10, borderRadius: 5, backgroundColor: "#000" }} />
        <div style={{ position: "absolute", left: 22, top: 18, width: 14, height: 14, borderRadius: 7, backgroundColor: c.verde }} />
      </div>
      <div style={{ width: largura, height: comprimento * sai, overflow: "hidden", marginTop: -20, boxShadow: sombra }}>
        <div style={{ width: largura, height: comprimento, backgroundColor: c.branco, padding: "40px 26px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12, fontFamily: fontes.mono, fontSize: 20, color: c.tinta }}>
          <div style={{ fontWeight: 600, fontSize: 24, textAlign: "center", letterSpacing: 2, whiteSpace: "nowrap" }}>{titulo}</div>
          {linhas.map((l, i) => (
            <div key={i} style={{ whiteSpace: "nowrap", color: l.startsWith("CARGO") ? c.azul : c.tinta, fontWeight: l.startsWith("TOTAL") ? 600 : 400 }}>
              {l}
            </div>
          ))}
          <div style={{ alignSelf: "center", marginTop: 10, opacity: qr, scale: String(0.8 + 0.2 * qr), boxShadow: qr > 0.9 ? `0 0 0 6px ${c.laranja}` : "none" }}>
            <QR tam={160} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────── SeloLacre ─────────────────────────
// Selo circular numerado sobre uma tampa. Em `trocaEm` um clarão rasga o selo e um novo (número seguinte) é aplicado.
export const SeloLacre: React.FC<{ entra: number; numero?: string; novo?: string; trocaEm?: number; tamanho?: number }> = ({ entra, numero = "004 218", novo = "004 219", trocaEm, tamanho = 360 }) => {
  const f = useCurrentFrame();
  const o = ap(f, entra, 10);
  const rasga = trocaEm === undefined ? 0 : ap(f, trocaEm, 10);
  const aplica = trocaEm === undefined ? 0 : ap(f, trocaEm + 22, 12);
  const clarao = trocaEm === undefined ? 0 : interpolate(f, [trocaEm, trocaEm + 4, trocaEm + 16], [0, 1, 0], clamp);
  const Selo: React.FC<{ n: string; cor: string }> = ({ n, cor }) => (
    <svg width={tamanho * 0.62} height={tamanho * 0.62} viewBox="0 0 200 200">
      <circle cx={100} cy={100} r={92} fill={cor} />
      <circle cx={100} cy={100} r={74} fill="none" stroke={c.branco} strokeWidth={4} strokeDasharray="6 6" />
      <text x={100} y={88} textAnchor="middle" fontFamily={fontes.titulo} fontWeight={800} fontSize={30} fill={c.branco} letterSpacing={3}>LACRE</text>
      <text x={100} y={126} textAnchor="middle" fontFamily={fontes.mono} fontWeight={600} fontSize={26} fill={c.branco}>{n}</text>
    </svg>
  );
  return (
    <div data-foco="selo de lacre" style={{ opacity: o, width: tamanho, height: tamanho, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: tamanho * 0.08, borderRadius: 24, backgroundColor: c.gelo, border: `4px solid ${c.fio}`, boxShadow: sombra }} />
      <div style={{ position: "relative", opacity: 1 - rasga, clipPath: rasga > 0 ? `polygon(0 0, 100% 0, 100% ${100 - rasga * 60}%, ${50 + rasga * 30}% ${60 - rasga * 20}%, 0 ${100 - rasga * 30}%)` : undefined, translate: `${rasga * 40}px ${-rasga * 30}px`, rotate: `${rasga * 18}deg` }}>
        <Selo n={numero} cor={c.azul} />
      </div>
      {trocaEm !== undefined ? (
        <div style={{ position: "absolute", opacity: aplica, scale: String(1.3 - 0.3 * aplica) }}>
          <Selo n={novo} cor={c.verde} />
        </div>
      ) : null}
      <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)", opacity: clarao }} />
    </div>
  );
};

// ───────────────────────── LinhaFita ─────────────────────────
// Fita de papel horizontal; cada marco se "carimba" em `f` (ano em mono, título em azul). A fita corre para a esquerda
// quando os marcos passam da largura visível. `destaque`: índice do marco com contorno laranja.
export const LinhaFita: React.FC<{ marcos: { ano: string; titulo: string; f: number }[]; largura?: number; passo?: number; entra?: number; destaque?: number }> = ({
  marcos,
  largura = 1600,
  passo = 360,
  entra = 0,
  destaque,
}) => {
  const f = useCurrentFrame();
  const o = ap(f, entra, 12);
  const vistos = marcos.filter((m) => f >= m.f).length;
  const total = marcos.length * passo + 120;
  const alvo = Math.max(0, Math.min(total - largura, (vistos - 0.5) * passo + 60 - largura / 2 - passo / 2 + passo));
  const ult = marcos[Math.max(0, vistos - 1)];
  const desl = interpolate(f, [ult ? ult.f : 0, (ult ? ult.f : 0) + 24], [0, 1], { ...clamp, easing: suave });
  const anterior = Math.max(0, Math.min(total - largura, (vistos - 1.5) * passo + 60 - largura / 2 - passo / 2 + passo));
  const x = -(anterior + (alvo - anterior) * desl);
  // data-corte-ok: a fita rola e recorta os marcos de propósito (sem isso o auditor acusa TEXTO_CORTADO)
  return (
    <div data-foco="linha do tempo" data-corte-ok style={{ opacity: o, width: largura, height: 300, overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", left: x, top: 0, width: total, height: 300 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 130, height: 46, backgroundColor: c.branco, boxShadow: sombra, borderTop: `3px solid ${c.fio}`, borderBottom: `3px solid ${c.fio}` }} />
        {marcos.map((m, i) => {
          const e = ap(f, m.f, 10);
          const bate = interpolate(f, [m.f, m.f + 5, m.f + 10], [1.5, 0.95, 1], clamp);
          return (
            <div key={i} style={{ position: "absolute", left: 60 + i * passo, top: 0, width: passo - 40, height: 300, opacity: e }}>
              <div style={{ position: "absolute", left: 0, top: 128, width: 50, height: 50, borderRadius: 25, backgroundColor: i === destaque ? c.laranja : c.azul, scale: String(bate), boxShadow: "0 4px 10px rgba(27,31,42,0.2)" }} />
              <div style={{ position: "absolute", left: 0, top: 40, fontFamily: fontes.mono, fontWeight: 600, fontSize: 52, color: c.tinta, whiteSpace: "nowrap" }}>{m.ano}</div>
              <div style={{ position: "absolute", left: 0, top: 200, width: passo - 50, fontFamily: fontes.texto, fontWeight: 600, fontSize: 30, lineHeight: 1.25, color: c.azul }}>{m.titulo}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───────────────────────── CadeiaConfianca ─────────────────────────
// Corrente de elos de papel que se conectam um a um; cada elo recebe um selo verde (✓) em sequência.
export const CadeiaConfianca: React.FC<{ elos?: string[]; entra: number; passo?: number; largura?: number; ativo?: number }> = ({
  elos = ["código aberto", "compilação", "assinatura", "lacração", "carga", "votação", "boletim", "totalização"],
  entra,
  passo = 24,
  largura = 1700,
  ativo,
}) => {
  const f = useCurrentFrame();
  const n = elos.length;
  const colunas = n > 4 ? Math.ceil(n / 2) : n;
  const w = (largura - (colunas - 1) * 40) / colunas;
  return (
    <div data-foco="cadeia de confiança" style={{ width: largura, display: "flex", flexWrap: "wrap", gap: "46px 40px", justifyContent: "center" }}>
      {elos.map((e, i) => {
        const a = ap(f, entra + i * passo, 10);
        const selo = ap(f, entra + i * passo + 12, 8);
        const liga = i < n - 1 ? ap(f, entra + (i + 1) * passo, 10) : 0;
        const on = ativo === undefined || ativo === i;
        return (
          <div key={i} style={{ width: w, height: 110, position: "relative", opacity: a * (on ? 1 : 0.4), translate: `${(1 - a) * -30}px 0` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 55, border: `6px solid ${c.azul}`, backgroundColor: c.branco, boxShadow: sombra, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.titulo, fontWeight: 800, fontSize: 36, color: c.tinta, letterSpacing: 1, whiteSpace: "nowrap", textTransform: "uppercase" }}>
              {e}
            </div>
            {(i + 1) % colunas !== 0 && i < n - 1 ? <div style={{ position: "absolute", right: -46, top: 49, width: 52 * liga, height: 12, borderRadius: 6, backgroundColor: c.azul }} /> : null}
            <div style={{ position: "absolute", right: -8, top: -18, width: 44, height: 44, borderRadius: 22, backgroundColor: c.verde, color: c.branco, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, fontFamily: fontes.texto, scale: String(selo), opacity: selo }}>✓</div>
          </div>
        );
      })}
    </div>
  );
};

// ───────────────────────── MosaicoUF ─────────────────────────
// Cartograma: cada UF é um quadrado na posição aproximada; `valores` codificam tamanho (modo "tamanho") ou cor (modo "cor").
const GRADE: Record<string, [number, number]> = {
  RR: [2, 0], AP: [4, 0],
  AC: [0, 1], AM: [1, 1], PA: [3, 1], MA: [4, 1], CE: [5, 1], RN: [6, 1],
  RO: [1, 2], MT: [2, 2], TO: [3, 2], PI: [4, 2], PE: [5, 2], PB: [6, 2],
  MS: [2, 3], GO: [3, 3], BA: [4, 3], SE: [5, 3], AL: [6, 3],
  DF: [3, 4], MG: [4, 4], ES: [5, 4],
  SP: [3, 5], RJ: [4, 5],
  PR: [3, 6], SC: [3, 7], RS: [3, 8],
};
export const MosaicoUF: React.FC<{
  entra: number;
  valores?: Record<string, number>;
  modo?: "tamanho" | "cor";
  cor?: string;
  celula?: number;
  destaque?: string[];
  passo?: number;
  legenda?: string;
}> = ({ entra, valores, modo = "cor", cor = c.azul, celula = 96, destaque = [], passo = 2, legenda }) => {
  const f = useCurrentFrame();
  const max = valores ? Math.max(...Object.values(valores)) : 1;
  const ufs = Object.keys(GRADE);
  return (
    <div data-foco="mapa das UFs" style={{ position: "relative", width: 7 * celula, height: 9 * celula + (legenda ? 60 : 0) }}>
      {ufs.map((uf, i) => {
        const [x, y] = GRADE[uf];
        const a = ap(f, entra + i * passo, 10);
        const v = valores ? (valores[uf] ?? 0) / max : 1;
        const lado = modo === "tamanho" ? (0.3 + 0.7 * Math.sqrt(v)) * (celula - 8) : celula - 8;
        const d = destaque.includes(uf);
        const fundo = modo === "cor" && valores ? cor : d ? c.laranja : cor;
        const op = modo === "cor" && valores ? 0.18 + 0.82 * v : 1;
        return (
          <div key={uf} style={{ position: "absolute", left: x * celula + (celula - lado) / 2, top: y * celula + (celula - lado) / 2, width: lado * (0.4 + 0.6 * a), height: lado * (0.4 + 0.6 * a), opacity: a, borderRadius: 8, backgroundColor: d ? c.laranja : a < 1 ? c.fio : fundo, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: d ? `0 0 0 4px ${c.tinta}` : "none" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 8, backgroundColor: d ? c.laranja : fundo, opacity: op }} />
            <span style={{ position: "relative", fontFamily: fontes.titulo, fontWeight: 800, fontSize: Math.max(18, Math.min(34, lado * 0.36)), color: op > 0.5 || d ? c.branco : c.tinta }}>{uf}</span>
          </div>
        );
      })}
      {legenda ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center", fontFamily: fontes.texto, fontWeight: 500, fontSize: 28, color: c.cinza, whiteSpace: "nowrap" }}>{legenda}</div> : null}
    </div>
  );
};

// ───────────────────────── MapaPontosSecao ─────────────────────────
// Mapa do Brasil em traço fino com nuvem de pontos (1 ponto = muitas seções; sem números de seção), do litoral ao interior.
export const MapaPontosSecao: React.FC<{ entra: number; dur?: number; tamanho?: number; cor?: string; legenda?: string }> = ({ entra, dur = 120, tamanho = 820, cor = c.azul, legenda }) => {
  const f = useCurrentFrame();
  const o = ap(f, entra, 12);
  const p = interpolate(f, [entra, entra + dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lista = pontos as [number, number][];
  const n = Math.floor(lista.length * p);
  const m = mapa as { w: number; h: number; estados: { sigla: string; d: string }[] };
  return (
    <div data-foco="mapa de seções" style={{ opacity: o, width: tamanho, height: tamanho + (legenda ? 50 : 0), position: "relative" }}>
      <svg width={tamanho} height={tamanho} viewBox={`0 0 ${m.w} ${m.h}`}>
        {m.estados.map((e) => (
          <path key={e.sigla} d={e.d} fill={c.branco} stroke={c.fio} strokeWidth={2} />
        ))}
        {lista.slice(0, n).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3.2} fill={cor} opacity={i > n - 40 ? 0.4 + 0.6 * ((n - i) / 40) : 0.85} />
        ))}
      </svg>
      {legenda ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center", fontFamily: fontes.texto, fontWeight: 500, fontSize: 28, color: c.cinza, whiteSpace: "nowrap" }}>{legenda}</div> : null}
    </div>
  );
};

// ───────────────────────── RelogioDia ─────────────────────────
// Relógio de arco de 24 h com a faixa de votação (8h–17h) e marcadores que acendem em `f`.
export const RelogioDia: React.FC<{ entra: number; marcos?: { h: number; rotulo: string; f: number }[]; faixa?: [number, number]; tamanho?: number }> = ({
  entra,
  marcos = [],
  faixa = [8, 17],
  tamanho = 640,
}) => {
  const f = useCurrentFrame();
  const o = ap(f, entra, 12);
  const pf = ap(f, entra + 10, 30);
  const R = 250;
  const ang = (h: number) => (h / 24) * Math.PI * 2 - Math.PI / 2;
  const pt = (h: number, r = R) => [320 + r * Math.cos(ang(h)), 320 + r * Math.sin(ang(h))];
  const arco = (h1: number, h2: number, r = R) => {
    const [x1, y1] = pt(h1, r);
    const [x2, y2] = pt(h2, r);
    return `M ${x1} ${y1} A ${r} ${r} 0 ${h2 - h1 > 12 ? 1 : 0} 1 ${x2} ${y2}`;
  };
  const fim = faixa[0] + (faixa[1] - faixa[0]) * pf;
  return (
    <div data-foco="relógio do dia" style={{ opacity: o, width: tamanho, height: tamanho }}>
      <svg width={tamanho} height={tamanho} viewBox="0 0 640 640" style={{ overflow: "visible" }}>
        <circle cx={320} cy={320} r={R} fill="none" stroke={c.fio} strokeWidth={34} />
        {pf > 0 ? <path d={arco(faixa[0], Math.max(faixa[0] + 0.01, fim))} fill="none" stroke={c.azul} strokeWidth={34} strokeLinecap="round" /> : null}
        {Array.from({ length: 24 }, (_, h) => {
          const [x1, y1] = pt(h, R - 30);
          const [x2, y2] = pt(h, R - (h % 6 === 0 ? 50 : 40));
          return <line key={h} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.cinza} strokeWidth={h % 6 === 0 ? 4 : 2} />;
        })}
        {[0, 6, 12, 18].map((h) => {
          const [x, y] = pt(h, R - 80);
          return <text key={h} x={x} y={y + 10} textAnchor="middle" fontFamily={fontes.mono} fontSize={28} fill={c.cinza}>{`${h}h`}</text>;
        })}
        {marcos.map((m, i) => {
          const a = ap(f, m.f, 10);
          const [x, y] = pt(m.h);
          const [lx, ly] = pt(m.h, R + 70);
          return (
            <g key={i} opacity={a}>
              <circle cx={x} cy={y} r={20 * (0.6 + 0.4 * a)} fill={c.laranja} stroke={c.branco} strokeWidth={5} />
              <text x={lx} y={ly + 10} textAnchor={lx > 330 ? "start" : lx < 310 ? "end" : "middle"} fontFamily={fontes.titulo} fontWeight={800} fontSize={34} fill={c.tinta}>{m.rotulo}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ───────────────────────── BlocosQuociente ─────────────────────────
// Votos viram blocos; o quociente divide o total em partes iguais e cada partido (genérico: A, B, C…) recebe suas cadeiras.
export const BlocosQuociente: React.FC<{ entra: number; partidos: { nome: string; votos: number; cadeiras: number; cor?: string }[]; quociente: number; divideEm?: number; distribuiEm?: number; largura?: number }> = ({
  entra,
  partidos,
  quociente,
  divideEm,
  distribuiEm,
  largura = 1500,
}) => {
  const f = useCurrentFrame();
  const o = ap(f, entra, 12);
  const div = divideEm === undefined ? 1 : ap(f, divideEm, 24);
  const dist = distribuiEm === undefined ? 1 : ap(f, distribuiEm, 30);
  const total = partidos.reduce((s, p) => s + p.votos, 0);
  const coresP = [c.azul, c.verde, c.laranja, c.cinza];
  const cadeiras = partidos.reduce((s, p) => s + p.cadeiras, 0);
  return (
    <div data-foco="blocos do quociente" style={{ opacity: o, width: largura, display: "flex", flexDirection: "column", gap: 34 }}>
      <div style={{ display: "flex", height: 120, gap: 8 * div }}>
        {partidos.map((p, i) => (
          <div key={i} style={{ flex: p.votos / total, height: "100%", borderRadius: 10, backgroundColor: p.cor ?? coresP[i % 4], position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {Array.from({ length: Math.floor(p.votos / quociente) }, (_, j) => (
              <div key={j} style={{ position: "absolute", top: 0, bottom: 0, left: `${((j + 1) * quociente / p.votos) * 100}%`, borderLeft: `4px dashed ${c.branco}`, opacity: div }} />
            ))}
            <span style={{ position: "relative", fontFamily: fontes.titulo, fontWeight: 800, fontSize: 44, color: c.branco, whiteSpace: "nowrap" }}>{`PARTIDO ${p.nome}`}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
        {Array.from({ length: cadeiras }, (_, k) => {
          let acc = 0;
          let dono = 0;
          for (let i = 0; i < partidos.length; i++) {
            if (k < acc + partidos[i].cadeiras) {
              dono = i;
              break;
            }
            acc += partidos[i].cadeiras;
          }
          const a = interpolate(dist, [k / (cadeiras + 1), (k + 1) / (cadeiras + 1)], [0, 1], clamp);
          return (
            <div key={k} style={{ width: 96, height: 96, borderRadius: "48px 48px 12px 12px", border: `4px solid ${c.tinta}`, backgroundColor: a > 0.5 ? partidos[dono].cor ?? coresP[dono % 4] : c.branco, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.titulo, fontWeight: 800, fontSize: 40, color: a > 0.5 ? c.branco : c.fio }}>
              {a > 0.5 ? partidos[dono].nome : "?"}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───────────────────────── RegistroTicket ─────────────────────────
// Caderno de anotações: as linhas entram em `f`; trechos em `marca` recebem marca-texto laranja logo depois.
export const RegistroTicket: React.FC<{ titulo?: string; linhas: { texto: string; marca?: string; f: number }[]; largura?: number; entra?: number }> = ({ titulo, linhas, largura = 1300, entra = 0 }) => {
  const f = useCurrentFrame();
  const o = ap(f, entra, 10);
  return (
    <div data-foco="caderno" style={{ opacity: o, width: largura, backgroundColor: c.branco, boxShadow: sombra, borderRadius: 8, padding: "50px 70px 50px 110px", position: "relative", backgroundImage: `repeating-linear-gradient(180deg, transparent 0 63px, ${c.gelo} 63px 66px)`, backgroundPositionY: 34 }}>
      <div style={{ position: "absolute", left: 76, top: 0, bottom: 0, borderLeft: `3px solid rgba(242,140,40,0.55)` }} />
      {titulo ? <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 30, color: c.azul, letterSpacing: 2, marginBottom: 18, whiteSpace: "nowrap" }}>{titulo}</div> : null}
      {linhas.map((l, i) => {
        const a = ap(f, l.f, 10);
        const m = l.marca ? interpolate(f, [l.f + 14, l.f + 34], [0, 100], clamp) : 0;
        const partes = l.marca && l.texto.includes(l.marca) ? l.texto.split(l.marca) : [l.texto];
        return (
          <div key={i} style={{ opacity: a, translate: `${(1 - a) * 20}px 0`, fontFamily: fontes.texto, fontWeight: 500, fontSize: 40, lineHeight: "66px", color: c.tinta }}>
            {partes[0]}
            {partes.length > 1 ? (
              <>
                <span style={{ backgroundImage: "linear-gradient(rgba(242,140,40,0.45), rgba(242,140,40,0.45))", backgroundRepeat: "no-repeat", backgroundSize: `${m}% 70%`, backgroundPosition: "0 75%", fontWeight: 700 }}>{l.marca}</span>
                {partes[1]}
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

// ───────────────────────── ProvasEmFila ─────────────────────────
// Fila de cartões (ex.: TPS 2009 … 2025) que entram da esquerda, viram e mostram os números; recebem selo ACHADOS / SEM ACHADO.
export const ProvasEmFila: React.FC<{ cartoes: { titulo: string; linhas: string[]; selo?: string; seloCor?: string; f: number }[]; largura?: number }> = ({ cartoes, largura = 1760 }) => {
  const f = useCurrentFrame();
  const w = Math.min(260, (largura - (cartoes.length - 1) * 16) / cartoes.length);
  return (
    <div data-foco="fila de testes" style={{ width: largura, display: "flex", gap: 16, justifyContent: "center", perspective: 1400 }}>
      {cartoes.map((k, i) => {
        const a = ap(f, k.f, 10);
        const vira = ap(f, k.f + 8, 14);
        const selo = ap(f, k.f + 22, 8);
        return (
          <div key={i} style={{ width: w, height: 330, opacity: a, translate: `${(1 - a) * -60}px 0`, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 14, backgroundColor: c.branco, boxShadow: sombra, border: `3px solid ${c.fio}`, transform: `rotateY(${(1 - vira) * 90}deg)`, padding: "22px 16px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <div style={{ fontFamily: fontes.titulo, fontWeight: 800, fontSize: 38, color: c.azul, whiteSpace: "nowrap" }}>{k.titulo}</div>
              {k.linhas.map((l, j) => (
                <div key={j} style={{ fontFamily: fontes.texto, fontWeight: 500, fontSize: 22, color: c.tinta, textAlign: "center", lineHeight: 1.25 }}>{l}</div>
              ))}
            </div>
            {k.selo ? (
              <div style={{ position: "absolute", left: "50%", bottom: 18, translate: "-50% 0", scale: String(1.4 - 0.4 * selo), opacity: selo, rotate: "-6deg", padding: "6px 12px", border: `4px solid ${k.seloCor ?? c.laranja}`, borderRadius: 8, fontFamily: fontes.titulo, fontWeight: 800, fontSize: 24, color: k.seloCor ?? c.laranja, whiteSpace: "nowrap", backgroundColor: c.branco }}>
                {k.selo}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

// ───────────────────────── Cartela de capítulo (tema claro) ─────────────────────────
// Tela de capítulo: número romano + título; a tecla do TecladoUrna que marca o capítulo acende ao lado.
export const CartelaCapitulo: React.FC<{ numero: string; titulo: string; entra?: number }> = ({ numero, titulo, entra = 0 }) => {
  const f = useCurrentFrame();
  const a = ap(f, entra, 14);
  const b = ap(f, entra + 10, 14);
  return (
    <div data-cobre data-pausa-ok style={{ position: "absolute", inset: 0, backgroundColor: c.papel, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div data-foco="cartela capítulo" style={{ opacity: a, fontFamily: fontes.titulo, fontWeight: 700, fontSize: 56, letterSpacing: 16, color: c.cinza, whiteSpace: "nowrap" }}>{`CAPÍTULO ${numero}`}</div>
      <div style={{ width: 160 * b, height: 6, borderRadius: 3, backgroundColor: c.verde }} />
      <div data-foco="título capítulo" style={{ opacity: b, translate: `0 ${(1 - b) * 20}px`, fontFamily: fontes.titulo, fontWeight: 900, fontSize: 110, color: c.azul, whiteSpace: "nowrap" }}>{titulo}</div>
    </div>
  );
};
