import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { c, fontes, sombra } from "../tema";
import { DUR, EASE, entrar, escalonar } from "./Movimento";

// KIT DOSSIÊ DIGITAL — dinheiro das campanhas. Regras (refs 18/19 da skill): sem zoom de tela; movimento só com
// translate/opacity; curvas EASE; escalonamento total ≤ 15 frames; vermelho só na revelação.
// Cada elemento recebe frames RELATIVOS da cena (entra, f…).
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (i: number) => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const brilho = (cor: string, r = 18) => `0 0 ${r}px ${cor}`;
const foto = (src: string) => (src.startsWith("http") ? src : staticFile(src));
export const brl = (v: number, casas = 0) => v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });

// ───────────────── FotoCartao (fotos reais) ─────────────────
// Foto real em cartão com borda e sombra, sobre a MESMA foto desfocada e escurecida cobrindo a tela.
// O cartão entra deslizando da direita e deriva devagar para a esquerda; o fundo deriva no sentido oposto (paralaxe).
// Sem zoom. `foco` = object-position (ex.: "50% 30%"). Crédito obrigatório (licença).
export const FotoCartao: React.FC<{
  src?: string;
  entra?: number;
  dur: number;
  credito: string;
  rotulo?: string;
  largura?: number;
  altura?: number;
  foco?: string;
  deriva?: number;
  y?: number;
  pb?: boolean;
}> = ({ src, entra = 0, dur, credito, rotulo, largura = 1180, altura = 664, foco = "50% 50%", deriva = 70, y = -60, pb = false }) => {
  const f = useCurrentFrame();
  const a = entrar(f, entra, DUR.cena, EASE.enfase);
  const k = interpolate(f, [entra, entra + dur], [0, 1], clamp);
  const filtro = `${pb ? "grayscale(1) " : "saturate(0.82) "}contrast(1.08) brightness(0.96)`;
  const imagem = (estilo: React.CSSProperties) =>
    src ? (
      <Img src={foto(src)} style={{ ...estilo, objectFit: "cover", objectPosition: foco, filter: filtro }} />
    ) : (
      <div style={{ ...estilo, background: `repeating-linear-gradient(45deg, ${c.gelo} 0 24px, ${c.branco} 24px 48px)` }} />
    );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -120, top: -80, width: 2160, height: 1240, opacity: 0.55 * a, translate: `${(k - 0.5) * 50}px 0`, filter: "blur(34px) brightness(0.45)" }}>
        {imagem({ width: "100%", height: "100%" })}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,17,20,0.35), rgba(14,17,20,0.75))" }} />
      <div
        data-foco={`foto: ${rotulo ?? credito}`}
        style={{
          position: "absolute",
          left: 960 - largura / 2,
          top: 540 - altura / 2 + y,
          width: largura,
          height: altura,
          opacity: a,
          translate: `${(1 - a) * 160 - k * deriva}px 0`,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: `${sombra}, 0 0 0 2px rgba(238,241,244,0.14)`,
        }}
      >
        {imagem({ width: largura + deriva, height: altura, marginLeft: -deriva / 2 })}
        <div style={{ position: "absolute", right: 14, bottom: 12, padding: "5px 12px", borderRadius: 8, backgroundColor: "rgba(14,17,20,0.72)", fontFamily: fontes.mono, fontSize: 18, color: c.cinza, whiteSpace: "nowrap" }}>
          {credito}
        </div>
      </div>
      {rotulo ? (
        <div
          data-foco={`rótulo foto: ${rotulo}`}
          data-sobrepor-ok
          style={{
            position: "absolute",
            left: 960 - largura / 2 + 28,
            top: 540 - altura / 2 + y - 30,
            opacity: entrar(f, entra + 8, DUR.padrao),
            translate: `${-k * deriva}px 0`,
            padding: "8px 18px",
            borderRadius: 8,
            backgroundColor: c.dinheiro,
            color: c.grafite,
            fontFamily: fontes.titulo,
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: 3,
            whiteSpace: "nowrap",
          }}
        >
          {rotulo}
        </div>
      ) : null}
    </div>
  );
};

// ───────────────── Rede de ligações (motivo) ─────────────────
// Nós (foto em círculo, sigla ou ícone) e setas com o valor. A seta se desenha a partir de `f`; depois, moedas verdes
// correm pela seta. `ciclo` acende em âmbar uma sequência de nós/arestas fechada (dinheiro que volta à origem).
export type No = { id: string; x: number; y: number; rotulo: string; sub?: string; foto?: string; sigla?: string; tipo?: "candidato" | "empresa" | "pessoa" | "partido" | "fundo"; f: number; raio?: number };
export type Aresta = { de: string; para: string; valor?: string; f: number; curva?: number };
const corTipo = (t?: No["tipo"]) => (t === "empresa" ? c.ambar : t === "partido" ? "#7FA7FF" : t === "fundo" ? c.dinheiro : t === "pessoa" ? c.cinza : c.claro);
const Icone: React.FC<{ tipo?: No["tipo"]; tam: number }> = ({ tipo, tam }) => {
  const s = tam * 0.5;
  const cor = c.grafite;
  if (tipo === "empresa")
    return (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <path d="M3 21V8l6 3V8l6 3V4h6v17z" fill={cor} />
      </svg>
    );
  if (tipo === "fundo" || tipo === "partido")
    return (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <path d="M3 10l9-6 9 6v1H3zM5 12h2v7H5zm4 0h2v7H9zm4 0h2v7h-2zm4 0h2v7h-2zM3 20h18v2H3z" fill={cor} />
      </svg>
    );
  return (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4.5" fill={cor} />
      <path d="M3 22c0-5 4-8 9-8s9 3 9 8z" fill={cor} />
    </svg>
  );
};
export const RedeDinheiro: React.FC<{ nos: No[]; arestas: Aresta[]; ciclo?: { ids: string[]; em: number }; apagar?: { em: number; manter: string[] } }> = ({ nos, arestas, ciclo, apagar }) => {
  const f = useCurrentFrame();
  const mapa = Object.fromEntries(nos.map((n) => [n.id, n]));
  const noCiclo = (id: string) => !!ciclo && f >= ciclo.em && ciclo.ids.includes(id);
  const arestaCiclo = (a: Aresta) => {
    if (!ciclo || f < ciclo.em) return false;
    const i = ciclo.ids.indexOf(a.de);
    return i >= 0 && ciclo.ids[(i + 1) % ciclo.ids.length] === a.para;
  };
  const esmaece = (id: string) => (apagar && f >= apagar.em && !apagar.manter.includes(id) ? 1 - 0.75 * entrar(f, apagar.em, DUR.cena) : 1);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill={c.dinheiro} />
          </marker>
          <marker id="seta-ciclo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill={c.ambar} />
          </marker>
        </defs>
        {arestas.map((a, i) => {
          const A = mapa[a.de];
          const B = mapa[a.para];
          if (!A || !B) return null;
          const ra = (A.raio ?? 56) + 6;
          const rb = (B.raio ?? 56) + 14;
          const dx = B.x - A.x;
          const dy = B.y - A.y;
          const L = Math.hypot(dx, dy);
          const ux = dx / L;
          const uy = dy / L;
          const x1 = A.x + ux * ra;
          const y1 = A.y + uy * ra;
          const x2 = B.x - ux * rb;
          const y2 = B.y - uy * rb;
          const curva = a.curva ?? 0;
          const mx = (x1 + x2) / 2 - uy * curva;
          const my = (y1 + y2) / 2 + ux * curva;
          const d = `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
          const comp = L * 1.05;
          const p = entrar(f, a.f, 16, EASE.padrao);
          const ac = arestaCiclo(a);
          const cor = ac ? c.ambar : c.dinheiro;
          const op = Math.min(esmaece(a.de), esmaece(a.para));
          // moedas correndo (3 por seta, depois de desenhada)
          const moedas = p >= 1
            ? [0, 1, 2].map((k) => {
                const q = (((f - a.f - 16) / 60 + k / 3) % 1 + 1) % 1;
                const bx = (1 - q) * (1 - q) * x1 + 2 * (1 - q) * q * mx + q * q * x2;
                const by = (1 - q) * (1 - q) * y1 + 2 * (1 - q) * q * my + q * q * y2;
                return <circle key={k} cx={bx} cy={by} r={5} fill={cor} opacity={0.9 * op} style={{ filter: `drop-shadow(${brilho(cor, 6)})` }} />;
              })
            : null;
          const qv = 0.5;
          const lx = (1 - qv) * (1 - qv) * x1 + 2 * (1 - qv) * qv * mx + qv * qv * x2;
          const ly = (1 - qv) * (1 - qv) * y1 + 2 * (1 - qv) * qv * my + qv * qv * y2;
          return (
            <g key={i} opacity={op}>
              <path d={d} fill="none" stroke={cor} strokeOpacity={ac ? 1 : 0.7} strokeWidth={ac ? 4 : 2.5} strokeDasharray={comp} strokeDashoffset={comp * (1 - p)} markerEnd={p > 0.95 ? `url(#${ac ? "seta-ciclo" : "seta"})` : undefined} />
              {moedas}
              {a.valor && p > 0.6 ? (
                <g opacity={entrar(f, a.f + 10, DUR.pequeno)}>
                  <rect x={lx - (a.valor.length * 9.5 + 18) / 2} y={ly - 19} width={a.valor.length * 9.5 + 18} height={36} rx={8} fill={c.painel} stroke={cor} strokeOpacity={0.6} />
                  <text x={lx} y={ly + 7} textAnchor="middle" fontFamily={fontes.mono} fontWeight={600} fontSize={19} fill={cor}>
                    {a.valor}
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
      {nos.map((n) => {
        const a = entrar(f, n.f, DUR.padrao, EASE.enfase);
        const R = n.raio ?? 56;
        const nc = noCiclo(n.id);
        const anel = nc ? c.ambar : corTipo(n.tipo);
        return (
          <div
            key={n.id}
            data-foco={`nó: ${n.rotulo}`}
            style={{ position: "absolute", left: n.x - 150, top: n.y - R, width: 300, opacity: a * esmaece(n.id), translate: `0 ${(1 - a) * 24}px`, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
          >
            <div
              style={{
                width: R * 2,
                height: R * 2,
                borderRadius: R,
                overflow: "hidden",
                backgroundColor: anel,
                boxShadow: `0 0 0 4px ${anel}, ${nc ? brilho("rgba(255,176,32,0.8)", 26) : "0 10px 24px rgba(0,0,0,0.5)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {n.foto ? (
                <Img src={foto(n.foto)} style={{ width: R * 2, height: R * 2, objectFit: "cover", filter: "saturate(0.8) contrast(1.05)" }} />
              ) : n.sigla ? (
                <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: R * 0.62, color: c.grafite, whiteSpace: "nowrap" }}>{n.sigla}</div>
              ) : (
                <Icone tipo={n.tipo} tam={R * 2} />
              )}
            </div>
            <div style={{ fontFamily: fontes.titulo, fontWeight: 800, fontSize: 28, letterSpacing: 1, color: c.claro, whiteSpace: "nowrap", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>{n.rotulo}</div>
            {n.sub ? <div style={{ fontFamily: fontes.mono, fontSize: 18, color: c.cinza, whiteSpace: "nowrap", marginTop: -6 }}>{n.sub}</div> : null}
          </div>
        );
      })}
    </div>
  );
};

// ───────────────── Painel de ficha (dados abertos) ─────────────────
// Cartão estilo painel de sistema: cabeçalho mono, campos que se preenchem um a um (cursor piscando no campo ativo).
// `alerta` pinta o valor em âmbar com marca lateral.
export const PainelFicha: React.FC<{ entra?: number; titulo: string; sub?: string; campos: { rotulo: string; valor: string; f: number; alerta?: boolean }[]; largura?: number }> = ({ entra = 0, titulo, sub, campos, largura = 1100 }) => {
  const f = useCurrentFrame();
  const a = entrar(f, entra, DUR.cena, EASE.enfase);
  return (
    <div data-foco={`ficha: ${titulo}`} style={{ width: largura, opacity: a, translate: `0 ${(1 - a) * 40}px`, borderRadius: 18, backgroundColor: c.painel, boxShadow: sombra, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 28px", backgroundColor: c.branco, borderBottom: `1px solid ${c.fio}` }}>
        {[c.alerta, c.ambar, c.dinheiro].map((k, i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: k, opacity: 0.8 }} />
        ))}
        <div style={{ marginLeft: 10, fontFamily: fontes.mono, fontWeight: 600, fontSize: 24, color: c.claro, whiteSpace: "nowrap" }}>{titulo}</div>
        {sub ? <div style={{ marginLeft: "auto", fontFamily: fontes.mono, fontSize: 20, color: c.cinza, whiteSpace: "nowrap" }}>{sub}</div> : null}
      </div>
      <div style={{ padding: "14px 28px 22px" }}>
        {campos.map((k, i) => {
          const p = entrar(f, k.f, DUR.pequeno);
          const n = Math.round(k.valor.length * interpolate(f, [k.f, k.f + 14], [0, 1], clamp));
          const digitando = f >= k.f && f < k.f + 18;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 0", borderBottom: i < campos.length - 1 ? `1px solid ${c.fio}` : "none", opacity: p }}>
              <div style={{ width: 8, height: 34, borderRadius: 4, backgroundColor: k.alerta ? c.ambar : "transparent" }} />
              <div style={{ width: 360, fontFamily: fontes.mono, fontSize: 24, color: c.cinza, whiteSpace: "nowrap" }}>{k.rotulo}</div>
              <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 30, color: k.alerta ? c.ambar : c.claro, whiteSpace: "nowrap" }}>
                {k.valor.slice(0, n)}
                {digitando && Math.floor(f / 8) % 2 === 0 ? "▌" : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───────────────── Planilha (arquivo de dados abertos) ─────────────────
// Tabela de linhas tipo CSV que surgem e rolam para cima (translate, sem zoom). `destaque` = índice da linha que
// acende em âmbar a partir de `destaqueEm`.
export const Planilha: React.FC<{ entra?: number; nome: string; colunas: string[]; larguras: number[]; linhas: string[][]; rolar?: { de: number; ate: number; px: number }; destaque?: number; destaqueEm?: number; visiveis?: number }> = ({
  entra = 0,
  nome,
  colunas,
  larguras,
  linhas,
  rolar,
  destaque,
  destaqueEm = 0,
  visiveis = 9,
}) => {
  const f = useCurrentFrame();
  const a = entrar(f, entra, DUR.cena, EASE.enfase);
  const largura = larguras.reduce((s, v) => s + v, 0) + 48;
  const desl = rolar ? interpolate(f, [rolar.de, rolar.ate], [0, rolar.px], { ...clamp, easing: EASE.fundo }) : 0;
  const H = 58;
  return (
    <div data-foco={`planilha: ${nome}`} style={{ width: largura, opacity: a, translate: `0 ${(1 - a) * 40}px`, borderRadius: 16, backgroundColor: c.painel, boxShadow: sombra, overflow: "hidden" }}>
      <div style={{ padding: "14px 24px", backgroundColor: c.branco, fontFamily: fontes.mono, fontSize: 22, color: c.dinheiro, whiteSpace: "nowrap" }}>{nome}</div>
      <div style={{ display: "flex", padding: "10px 24px", borderBottom: `2px solid ${c.fio}` }}>
        {colunas.map((k, i) => (
          <div key={i} style={{ width: larguras[i], fontFamily: fontes.mono, fontWeight: 600, fontSize: 20, color: c.cinza, whiteSpace: "nowrap", overflow: "hidden" }}>{k}</div>
        ))}
      </div>
      <div style={{ height: H * visiveis, overflow: "hidden", position: "relative" }}>
        <div style={{ translate: `0 ${-desl}px` }}>
          {linhas.map((l, j) => {
            const p = entrar(f, entra + 10 + escalonar(j, Math.min(linhas.length, 12)), DUR.pequeno);
            const ac = destaque === j && f >= destaqueEm;
            return (
              <div key={j} style={{ display: "flex", alignItems: "center", height: H, padding: "0 24px", opacity: p, backgroundColor: ac ? "rgba(255,176,32,0.16)" : j % 2 ? "rgba(255,255,255,0.02)" : "transparent", boxShadow: ac ? `inset 6px 0 0 ${c.ambar}` : "none" }}>
                {l.map((v, i) => (
                  <div key={i} style={{ width: larguras[i], fontFamily: fontes.mono, fontSize: 22, color: ac ? c.ambar : c.claro, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "clip" }}>{v}</div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ───────────────── Régua da mediana ─────────────────
// Pontos de valores (já ordenados) sobre uma régua; a linha da mediana desce; o ponto `alvo` acende em âmbar longe
// da mediana com a marca "×N". Escala logarítmica opcional para caber o ponto fora do padrão.
export const ReguaMediana: React.FC<{ entra?: number; valores: number[]; mediana: number; medianaEm: number; alvo?: { valor: number; rotulo: string; f: number }; unidade?: string; log?: boolean; largura?: number; titulo?: string }> = ({
  entra = 0,
  valores,
  mediana,
  medianaEm,
  alvo,
  unidade = "R$",
  log = true,
  largura = 1500,
  titulo,
}) => {
  const f = useCurrentFrame();
  const todos = alvo ? [...valores, alvo.valor] : valores;
  const mn = Math.min(...todos);
  const mx = Math.max(...todos);
  const esc = (v: number) => (log ? (Math.log(v) - Math.log(mn)) / (Math.log(mx) - Math.log(mn)) : (v - mn) / (mx - mn));
  const X = (v: number) => 40 + esc(v) * (largura - 80);
  const pm = entrar(f, medianaEm, DUR.padrao);
  return (
    <div data-foco={`régua: ${titulo ?? "mediana"}`} style={{ position: "relative", width: largura, height: 360, opacity: entrar(f, entra, DUR.padrao) }}>
      {titulo ? <div style={{ position: "absolute", left: 40, top: 0, fontFamily: fontes.titulo, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: c.claro, whiteSpace: "nowrap" }}>{titulo}</div> : null}
      <div style={{ position: "absolute", left: 40, right: 40, top: 220, height: 3, backgroundColor: c.fio }} />
      {valores.map((v, i) => {
        const p = entrar(f, entra + 6 + escalonar(i, valores.length), DUR.pequeno);
        return <div key={i} style={{ position: "absolute", left: X(v) - 9, top: 192 - (rnd(i) * 70) | 0, width: 18, height: 18, borderRadius: 9, backgroundColor: c.dinheiro, opacity: 0.75 * p, translate: `0 ${(1 - p) * -20}px` }} />;
      })}
      <div style={{ position: "absolute", left: X(mediana) - 2, top: 90, width: 4, height: 170 * pm, backgroundColor: c.claro }} />
      <div style={{ position: "absolute", left: X(mediana) - 150, width: 300, top: 262, opacity: pm, textAlign: "center", fontFamily: fontes.mono, fontWeight: 600, fontSize: 26, color: c.claro, whiteSpace: "nowrap" }}>
        {`MEDIANA · ${unidade} ${brl(mediana)}`}
      </div>
      {alvo ? (
        <>
          <div style={{ position: "absolute", left: X(alvo.valor) - 16, top: 130, width: 32, height: 32, borderRadius: 16, backgroundColor: c.ambar, opacity: entrar(f, alvo.f, DUR.pequeno), boxShadow: brilho("rgba(255,176,32,0.9)", 24) }} />
          <div style={{ position: "absolute", left: X(alvo.valor) - 240, width: 260, top: 60, opacity: entrar(f, alvo.f + 6, DUR.pequeno), textAlign: "right", fontFamily: fontes.titulo, fontWeight: 900, fontSize: 52, color: c.ambar, whiteSpace: "nowrap" }}>{alvo.rotulo}</div>
        </>
      ) : null}
    </div>
  );
};

// ───────────────── Barras por eleição ─────────────────
// Colunas que crescem com scaleY (origem na base) e escalonamento curto; valor no topo; `destaque` em âmbar.
export const BarrasAno: React.FC<{ entra?: number; itens: { ano: string; valor: number; texto: string; f?: number }[]; max?: number; altura?: number; largura?: number; destaque?: string; nota?: string }> = ({
  entra = 0,
  itens,
  max,
  altura = 520,
  largura = 1400,
  destaque,
  nota,
}) => {
  const f = useCurrentFrame();
  const M = max ?? Math.max(...itens.map((i) => i.valor));
  const col = largura / itens.length;
  return (
    <div data-foco="barras por eleição" style={{ position: "relative", width: largura, height: altura + 130 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: altura, height: 3, backgroundColor: c.fio }} />
      {itens.map((it, i) => {
        const fi = it.f ?? entra + escalonar(i, itens.length);
        const p = entrar(f, fi, DUR.cena, EASE.padrao);
        const h = (it.valor / M) * (altura - 80);
        const cor = it.ano === destaque ? c.ambar : c.dinheiro;
        return (
          <div key={i} style={{ position: "absolute", left: i * col + col * 0.2, width: col * 0.6, top: 0, height: altura + 130 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: altura - h, height: h, transformOrigin: "50% 100%", scale: `1 ${p}`, borderRadius: "10px 10px 0 0", backgroundColor: cor, boxShadow: `0 0 30px ${cor}33` }} />
            <div style={{ position: "absolute", left: -40, right: -40, top: altura - h - 56, textAlign: "center", opacity: entrar(f, fi + 12, DUR.pequeno), fontFamily: fontes.mono, fontWeight: 600, fontSize: 30, color: cor, whiteSpace: "nowrap" }}>{it.texto}</div>
            <div style={{ position: "absolute", left: -40, right: -40, top: altura + 16, textAlign: "center", opacity: p, fontFamily: fontes.titulo, fontWeight: 800, fontSize: 40, color: c.claro, whiteSpace: "nowrap" }}>{it.ano}</div>
          </div>
        );
      })}
      {nota ? <div style={{ position: "absolute", left: 0, right: 0, top: altura + 80, textAlign: "center", opacity: entrar(f, entra + 20, DUR.padrao), fontFamily: fontes.mono, fontSize: 22, color: c.cinza, whiteSpace: "nowrap" }}>{nota}</div> : null}
    </div>
  );
};

// ───────────────── Linha do tempo de marcos ─────────────────
export const MarcosDossie: React.FC<{ marcos: { ano: string; titulo: string; f: number }[]; largura?: number; destaque?: number[] }> = ({ marcos, largura = 1700, destaque = [] }) => {
  const f = useCurrentFrame();
  const passo = (largura - 280) / Math.max(1, marcos.length - 1);
  const ultimo = marcos.filter((m) => f >= m.f).length;
  const prog = marcos.length > 1 ? interpolate(f, [marcos[0].f, marcos[marcos.length - 1].f + 10], [0, 1], clamp) : 1;
  return (
    <div data-foco="linha do tempo" style={{ position: "relative", width: largura, height: 300 }}>
      <div style={{ position: "absolute", left: 140, right: 140, top: 120, height: 3, backgroundColor: c.fio }} />
      <div style={{ position: "absolute", left: 140, width: (largura - 280) * prog, top: 119, height: 5, backgroundColor: c.dinheiro, boxShadow: brilho("rgba(47,208,138,0.6)", 10) }} />
      {marcos.map((m, i) => {
        const p = entrar(f, m.f, DUR.padrao, EASE.enfase);
        const d = destaque.includes(i);
        const x = marcos.length > 1 ? 140 + i * passo : largura / 2;
        return (
          <div key={i} style={{ position: "absolute", left: x - 140, width: 280, top: 0, height: 300, opacity: i < ultimo ? 1 : p }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: fontes.titulo, fontWeight: 900, fontSize: 52, color: d ? c.ambar : c.claro, translate: `0 ${(1 - p) * -16}px`, whiteSpace: "nowrap" }}>{m.ano}</div>
            <div style={{ position: "absolute", left: 128, top: 110, width: 24, height: 24, borderRadius: 12, backgroundColor: d ? c.ambar : c.dinheiro, boxShadow: brilho(d ? "rgba(255,176,32,0.8)" : "rgba(47,208,138,0.7)", 12) }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 156, textAlign: "center", fontFamily: fontes.texto, fontWeight: 600, fontSize: 25, lineHeight: 1.25, color: c.claro, translate: `0 ${(1 - p) * 16}px` }}>{m.titulo}</div>
          </div>
        );
      })}
    </div>
  );
};

// ───────────────── Busca (consulta do cidadão) ─────────────────
// Barra de busca que digita o termo, depois resultados em cartões curtos. Nunca nome de pessoa física investigada.
export const Busca: React.FC<{ entra?: number; termo: string; site?: string; resultados?: { a: string; b: string; f: number; alerta?: boolean }[]; largura?: number }> = ({ entra = 0, termo, site = "dadosabertos.tse.jus.br", resultados = [], largura = 1200 }) => {
  const f = useCurrentFrame();
  const a = entrar(f, entra, DUR.cena, EASE.enfase);
  const n = Math.round(termo.length * interpolate(f, [entra + 12, entra + 12 + termo.length * 2], [0, 1], clamp));
  return (
    <div data-foco={`busca: ${termo}`} style={{ width: largura, opacity: a, translate: `0 ${(1 - a) * 40}px`, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ fontFamily: fontes.mono, fontSize: 22, color: c.cinza, whiteSpace: "nowrap" }}>{site}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 30px", borderRadius: 16, backgroundColor: c.branco, boxShadow: `${sombra}, 0 0 0 2px ${c.dinheiro}55` }}>
        <svg width={34} height={34} viewBox="0 0 24 24">
          <circle cx="10" cy="10" r="6.5" stroke={c.dinheiro} strokeWidth="2.5" fill="none" />
          <path d="M15 15l6 6" stroke={c.dinheiro} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 36, color: c.claro, whiteSpace: "nowrap" }}>
          {termo.slice(0, n)}
          {Math.floor(f / 8) % 2 === 0 ? "▌" : ""}
        </div>
      </div>
      {resultados.map((r, i) => {
        const p = entrar(f, r.f, DUR.padrao, EASE.enfase);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 26px", borderRadius: 12, backgroundColor: c.painel, opacity: p, translate: `${(1 - p) * 40}px 0`, boxShadow: r.alerta ? `inset 6px 0 0 ${c.ambar}` : `inset 6px 0 0 ${c.dinheiro}` }}>
            <div style={{ fontFamily: fontes.texto, fontWeight: 700, fontSize: 30, color: c.claro, whiteSpace: "nowrap" }}>{r.a}</div>
            <div style={{ marginLeft: "auto", fontFamily: fontes.mono, fontSize: 26, color: r.alerta ? c.ambar : c.dinheiro, whiteSpace: "nowrap" }}>{r.b}</div>
          </div>
        );
      })}
    </div>
  );
};

// ───────────────── Tarja de ressalva ─────────────────
// Faixa curta que acompanha dado sensível: "LIGAÇÃO NÃO É IRREGULARIDADE", "DADO DECLARADO PELO CANDIDATO" etc.
export const Tarja: React.FC<{ texto: string; entra: number; cor?: string }> = ({ texto, entra, cor = c.ambar }) => {
  const f = useCurrentFrame();
  const p = entrar(f, entra, DUR.padrao, EASE.enfase);
  return (
    <div data-foco={`tarja: ${texto}`} style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "10px 22px", borderRadius: 10, border: `2px solid ${cor}`, backgroundColor: "rgba(14,17,20,0.85)", opacity: p, translate: `${(1 - p) * -30}px 0` }}>
      <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: cor }} />
      <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 24, letterSpacing: 1, color: cor, whiteSpace: "nowrap" }}>{texto}</div>
    </div>
  );
};

// ───────────────── Cartela de capítulo ─────────────────
export const CartelaCapitulo: React.FC<{ numero: string; titulo: string; entra?: number }> = ({ numero, titulo, entra = 0 }) => {
  const f = useCurrentFrame();
  const a = entrar(f, entra, DUR.cena, EASE.enfase);
  const b = entrar(f, entra + 8, DUR.cena, EASE.enfase);
  return (
    <div data-cobre data-pausa-ok style={{ position: "absolute", inset: 0, backgroundColor: c.grafite, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div data-foco="cartela capítulo" style={{ opacity: a, fontFamily: fontes.mono, fontWeight: 600, fontSize: 40, letterSpacing: 14, color: c.dinheiro, whiteSpace: "nowrap" }}>{`CAPÍTULO ${numero}`}</div>
      <div style={{ width: 180 * b, height: 4, borderRadius: 2, backgroundColor: c.dinheiro, boxShadow: brilho("rgba(47,208,138,0.8)", 14) }} />
      <div data-foco="título capítulo" style={{ opacity: b, translate: `0 ${(1 - b) * 24}px`, fontFamily: fontes.titulo, fontWeight: 900, fontSize: 112, color: c.claro, whiteSpace: "nowrap" }}>{titulo}</div>
    </div>
  );
};

// ───────────────── Mosaico de candidatos (escala) ─────────────────
// Fotos baixadas em 04/10/2026 (120, Portal de Dados Abertos do TSE): o mosaico sempre usa as fotos; `disponivel` ficou só por compatibilidade.
const MOSAICO_PRONTO = true;
// Grade de fotos oficiais de candidatos (Justiça Eleitoral) que acende em ondas e deriva devagar para a esquerda.
// SÓ para escala ("mais de um milhão de candidaturas"): nunca ao lado de indício, nunca com nome. Sem zoom.
// `total` fotos em public/fotos/candidatos/c001.jpg…; `disponivel=false` (antes do download) mostra silhuetas.
export const MosaicoCandidatos: React.FC<{ entra?: number; dur: number; total?: number; colunas?: number; disponivel?: boolean; destaqueEm?: number }> = ({ entra = 0, dur, total = 120, colunas = 15, disponivel = true, destaqueEm }) => {
  const f = useCurrentFrame();
  const W = 150;
  const H = 200;
  const G = 10;
  const linhas = Math.ceil(total / colunas);
  const k = interpolate(f, [entra, entra + dur], [0, 1], clamp);
  return (
    <div data-foco="mosaico de candidaturas" data-corte-ok style={{ position: "absolute", left: -60, top: -20, width: colunas * (W + G) + 400, height: linhas * (H + G), translate: `${-k * 220}px 0` }}>
      {Array.from({ length: total }, (_, i) => {
        const col = i % colunas;
        const lin = Math.floor(i / colunas);
        const onda = entra + Math.round((col + lin) * 1.2 + rnd(i) * 6);
        const p = entrar(f, onda, DUR.padrao);
        const apaga = destaqueEm !== undefined && f >= destaqueEm ? 1 - 0.6 * entrar(f, destaqueEm, DUR.cena) : 1;
        const id = String(i + 1).padStart(3, "0");
        return (
          <div key={i} style={{ position: "absolute", left: col * (W + G) + (lin % 2) * 40, top: lin * (H + G), width: W, height: H, borderRadius: 10, overflow: "hidden", opacity: p * apaga, translate: `0 ${(1 - p) * 20}px`, backgroundColor: c.painel, boxShadow: "0 6px 16px rgba(0,0,0,0.5)" }}>
            {MOSAICO_PRONTO || disponivel ? (
              <Img src={staticFile(`fotos/candidatos/c${id}.jpg`)} style={{ width: W, height: H, objectFit: "cover", filter: "saturate(0.75) contrast(1.05)" }} />
            ) : (
              <svg width={W} height={H} viewBox="0 0 24 32">
                <circle cx="12" cy="11" r="5" fill={c.fio} />
                <path d="M2 32c0-8 4.5-12 10-12s10 4 10 12z" fill={c.fio} />
              </svg>
            )}
          </div>
        );
      })}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${c.grafite}00 60%, ${c.grafite} 100%)` }} />
    </div>
  );
};
