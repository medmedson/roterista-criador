import { Easing, interpolate, useCurrentFrame } from "remotion";
import mapa from "../data/mapa.json";
import { cores, fontes } from "../tema";

// Kit visual do vídeo SUAS: painel de senhas, placa do CRAS, balcão, prédio de três andares,
// rede no território, prancheta, tubos, moedas, crachás, conferências, selo, pauta, abrigo, tripé e pastas.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const AMBAR = "#ff3b2f";
export const AZUL_CRAS = "#1f5fa8";
const OURO = "#e0b43c";
const TRACO = "#d9d2c4";
const rnd = (v: number) => {
  const q = Math.sin(v * 12.9898 + 78.233) * 43758.5453;
  return q - Math.floor(q);
};

// Painel de senhas: dígitos vermelhos de sete segmentos (simulados com "8" apagado por baixo)
export const PainelSenhas: React.FC<{ numero: number; entra: number; rolaDe?: number; apagado?: boolean; treme?: number; largura?: number; cor?: string }> = ({
  numero,
  entra,
  rolaDe,
  apagado = false,
  treme,
  largura = 760,
  cor = AMBAR,
}) => {
  const frame = useCurrentFrame();
  const liga = apagado ? 0 : interpolate(frame, [entra, entra + 8], [0, 1], clamp);
  const de = rolaDe ?? Math.max(0, numero - 1);
  const rola = interpolate(frame, [entra + 4, entra + 22], [de, numero], { ...clamp, easing: Easing.bezier(0.3, 0.7, 0.2, 1) });
  const n = Math.round(rola);
  const txt = String(n).padStart(4, "0");
  const tr = treme === undefined ? 0 : interpolate(frame, [treme, treme + 4, treme + 8, treme + 12, treme + 16], [0, 1, -1, 0.6, 0], clamp);
  const altura = largura * 0.36;
  return (
    <div
      data-foco="painel de senhas"
      style={{
        width: largura,
        height: altura,
        borderRadius: 18,
        padding: 16,
        boxSizing: "border-box",
        background: "linear-gradient(180deg, #8d9096, #4c4f55 45%, #2c2e33)",
        boxShadow: `0 30px 50px rgba(0,0,0,0.8)${liga > 0 ? `, 0 0 ${80 * liga}px rgba(255,40,30,${0.35 * liga})` : ""}`,
        translate: `${tr * 12}px 0`,
        opacity: interpolate(frame, [entra - 12, entra - 2], [0, 1], clamp),
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: 10, backgroundColor: "#0b0707", display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${largura * 0.05}px`, boxSizing: "border-box" }}>
        <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: largura * 0.075, letterSpacing: 6, color: liga > 0.5 ? "#ff8a6b" : "#3a2320" }}>SENHA</div>
        <div style={{ position: "relative", fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: largura * 0.2, letterSpacing: largura * 0.012, lineHeight: 1 }}>
          <div style={{ color: "#2a1210" }}>8888</div>
          <div style={{ position: "absolute", inset: 0, color: cor, opacity: liga, textShadow: `0 0 ${18 * liga}px ${cor}` }}>{txt}</div>
        </div>
      </div>
    </div>
  );
};

// Bilhete de senha em papel térmico
export const CartaoSenha: React.FC<{ numero: number; entra: number }> = ({ numero, entra }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [entra, entra + 18], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0.7, 0.2, 1) });
  return (
    <div data-foco="bilhete de senha" style={{ width: 220, padding: "20px 16px", backgroundColor: "#f4f1ea", boxShadow: "0 12px 20px rgba(0,0,0,0.6)", translate: `0 ${(1 - p) * -120}px`, opacity: p, rotate: `${-4 * p}deg`, textAlign: "center", fontFamily: "'Courier New', monospace", color: "#222" }}>
      <div style={{ fontSize: 22, letterSpacing: 4 }}>SENHA</div>
      <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>{String(numero).padStart(4, "0")}</div>
      <div style={{ fontSize: 18 }}>aguarde ser chamado</div>
    </div>
  );
};

// Placa genérica do CRAS (sem brasão), com luz de porta aberta por baixo
export const PlacaCRAS: React.FC<{ acende: number; largura?: number; texto?: string; sigla?: string }> = ({ acende, largura = 900, texto = "CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL", sigla = "CRAS" }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [acende, acende + 10], [0, 1], clamp);
  return (
    <div data-foco={`placa ${sigla}`} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: largura, padding: "22px 30px", boxSizing: "border-box", backgroundColor: `rgba(31,95,168,${0.35 + 0.65 * a})`, border: "8px solid #f4f4f4", borderRadius: 10, textAlign: "center", boxShadow: a > 0 ? `0 0 ${60 * a}px rgba(90,160,255,0.45)` : "none" }}>
        <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: largura * 0.1, color: "#ffffff", lineHeight: 1 }}>{sigla}</div>
        <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: largura * 0.036, letterSpacing: 2, color: "#ffffff", marginTop: 8 }}>{texto}</div>
      </div>
      <div style={{ width: largura * 0.5, height: 70, background: `linear-gradient(180deg, rgba(255,236,190,${0.55 * a}), rgba(255,236,190,0))`, clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)" }} />
    </div>
  );
};

// Balcão de atendimento com vidro e placa
export const Guiche: React.FC<{ acende: number; fechado?: boolean; carimbo?: number; largura?: number }> = ({ acende, fechado = false, carimbo, largura = 760 }) => {
  const frame = useCurrentFrame();
  const a = fechado ? 0.15 : interpolate(frame, [acende, acende + 10], [0.15, 1], clamp);
  const c = carimbo === undefined ? 0 : interpolate(frame, [carimbo, carimbo + 5], [0, 1], clamp);
  return (
    <div data-foco="guichê" style={{ position: "relative", width: largura, height: largura * 0.62 }}>
      <div style={{ position: "absolute", left: "10%", right: "10%", top: 0, height: 60, backgroundColor: "#2b2f36", border: `3px solid ${TRACO}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: fechado ? CINZA : `rgba(255,255,255,${0.4 + 0.6 * a})` }}>
        {fechado ? "FECHADO" : "ATENDIMENTO"}
      </div>
      <div style={{ position: "absolute", left: "8%", right: "8%", top: 80, bottom: "34%", border: `6px solid ${TRACO}`, backgroundColor: `rgba(255,240,200,${0.18 * a})`, boxShadow: a > 0.5 ? "inset 0 0 60px rgba(255,230,170,0.25)" : "none" }}>
        <div style={{ position: "absolute", left: "35%", right: "35%", bottom: 0, height: 26, borderTop: `4px solid ${TRACO}` }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "34%", backgroundColor: "#3a2d22", border: `6px solid ${TRACO}`, boxSizing: "border-box" }} />
      {carimbo !== undefined ? (
        <div style={{ position: "absolute", left: "50%", bottom: "8%", translate: "-50% 0", rotate: "-6deg", scale: String(1.3 - 0.3 * c), opacity: c, border: `6px solid ${cores.vermelho}`, borderRadius: 8, padding: "4px 20px", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 44, letterSpacing: 6, color: cores.vermelho, backgroundColor: "rgba(20,12,10,0.6)" }}>ATENDIDO</div>
      ) : null}
    </div>
  );
};
const CINZA = "#9a948a";

// Prédio em corte com três andares que acendem
export const CasaTresAndares: React.FC<{ andares: { rotulo: string; sub: string; f: number; cor: string }[]; entra: number; largura?: number }> = ({ andares, entra, largura = 900 }) => {
  const frame = useCurrentFrame();
  const h = 190;
  return (
    <div data-foco="prédio de três andares" style={{ width: largura, opacity: interpolate(frame, [entra, entra + 10], [0, 1], clamp) }}>
      <div style={{ width: 0, height: 0, margin: "0 auto", borderLeft: `${largura / 2 + 20}px solid transparent`, borderRight: `${largura / 2 + 20}px solid transparent`, borderBottom: `110px solid #3a3129` }} />
      {[...andares].reverse().map((a, i) => {
        const on = interpolate(frame, [a.f, a.f + 12], [0, 1], clamp);
        return (
          <div key={a.rotulo} style={{ height: h, borderLeft: `8px solid ${TRACO}`, borderRight: `8px solid ${TRACO}`, borderTop: `8px solid ${TRACO}`, borderBottom: i === andares.length - 1 ? `8px solid ${TRACO}` : "none", backgroundColor: `rgba(${a.cor},${0.12 + 0.5 * on})`, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 40, boxShadow: on > 0.5 ? `inset 0 0 50px rgba(${a.cor},0.5)` : "none" }}>
            <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 56, color: on > 0.3 ? "#fff" : "#6b625a", letterSpacing: 3 }}>{a.rotulo}</div>
            <div style={{ fontFamily: fontes.maquina, fontSize: 34, color: on > 0.3 ? cores.papel : "#5a524a" }}>{a.sub}</div>
          </div>
        );
      })}
    </div>
  );
};

// Rede no território: pontos (ilustrativos) nos estados, ligados a vizinhos por fios finos
export const RedeTerritorio: React.FC<{ entra: number; tamanho?: number; pontosPorEstado?: number; x?: number; y?: number }> = ({ entra, tamanho = 780, pontosPorEstado = 6, x = 0, y = 0 }) => {
  const frame = useCurrentFrame();
  const pts: [number, number][] = [];
  mapa.estados.forEach((e, i) => {
    for (let k = 0; k < pontosPorEstado; k++) {
      const n = i * 13 + k;
      pts.push([e.c[0] + (rnd(n) - 0.5) * 70, e.c[1] + (rnd(n + 50) - 0.5) * 70]);
    }
  });
  const ordem = pts.map((p, i) => ({ p, i, d: Math.hypot(p[0] - mapa.projecao.brasilia[0], p[1] - mapa.projecao.brasilia[1]) })).sort((a, b) => a.d - b.d);
  const fios: [number, number, number][] = [];
  ordem.forEach((o, k) => {
    let melhor = -1;
    let dm = 1e9;
    for (let j = 0; j < k; j++) {
      const d = Math.hypot(o.p[0] - ordem[j].p[0], o.p[1] - ordem[j].p[1]);
      if (d < dm) {
        dm = d;
        melhor = j;
      }
    }
    if (melhor >= 0) fios.push([k, melhor, k]);
  });
  const t = (k: number) => entra + 10 + k * 0.9;
  return (
    <svg data-foco="rede no território" width={tamanho} height={tamanho} viewBox={`0 0 ${mapa.w} ${mapa.h}`} style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: interpolate(frame, [entra, entra + 10], [0, 1], clamp) }}>
      {mapa.estados.map((e) => (
        <path key={e.sigla} d={e.d} fill="rgba(31,95,168,0.12)" stroke={cores.papelEscuro} strokeOpacity={0.45} strokeWidth={2.2} />
      ))}
      {fios.map(([k, j]) => {
        const p = interpolate(frame, [t(k), t(k) + 10], [0, 1], clamp);
        const a = ordem[k].p;
        const b = ordem[j].p;
        return p > 0 ? <line key={k} x1={b[0]} y1={b[1]} x2={b[0] + (a[0] - b[0]) * p} y2={b[1] + (a[1] - b[1]) * p} stroke="#ffffff" strokeOpacity={0.5} strokeWidth={1.6} /> : null;
      })}
      {ordem.map((o, k) => (
        <circle key={k} cx={o.p[0]} cy={o.p[1]} r={interpolate(frame, [t(k), t(k) + 6, t(k) + 12], [0, 9, 6], clamp)} fill="#ffffff" />
      ))}
    </svg>
  );
};

// Prancheta com formulário que se preenche e carimbo
export const PranchetaCadastro: React.FC<{ entra: number; carimbo?: number; largura?: number }> = ({ entra, carimbo, largura = 520 }) => {
  const frame = useCurrentFrame();
  const campos = ["NOME", "ENDEREÇO", "RENDA POR PESSOA", "MORADORES", "NIS"];
  const c = carimbo === undefined ? 0 : interpolate(frame, [carimbo, carimbo + 5], [0, 1], clamp);
  return (
    <div data-foco="prancheta do cadastro" style={{ position: "relative", width: largura, padding: "70px 34px 34px", backgroundColor: "#8a5a32", borderRadius: 16, boxShadow: "0 24px 40px rgba(0,0,0,0.7)", opacity: interpolate(frame, [entra, entra + 10], [0, 1], clamp) }}>
      <div style={{ position: "absolute", left: "50%", top: 14, translate: "-50% 0", width: 180, height: 44, borderRadius: 8, backgroundColor: "#b9bcc2" }} />
      <div style={{ backgroundColor: "#f4f0e6", padding: 26, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 36, letterSpacing: 3, color: "#1f2b44" }}>CADASTRO ÚNICO</div>
        {campos.map((cp, i) => {
          const p = interpolate(frame, [entra + 15 + i * 12, entra + 27 + i * 12], [0, 1], clamp);
          return (
            <div key={cp} style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
              <div style={{ fontFamily: fontes.rotulo, fontSize: 22, color: "#555", width: 190 }}>{cp}</div>
              <div style={{ flex: 1, height: 26, borderBottom: "2px solid #999", position: "relative" }}>
                <div style={{ position: "absolute", left: 4, bottom: 6, height: 8, width: `${p * (50 + rnd(i) * 45)}%`, backgroundColor: "#2a3f6e", borderRadius: 4, opacity: 0.8 }} />
              </div>
            </div>
          );
        })}
      </div>
      {carimbo !== undefined ? (
        <div style={{ position: "absolute", right: 40, bottom: 50, rotate: "-8deg", opacity: c, scale: String(1.3 - 0.3 * c), border: `6px solid ${cores.vermelho}`, borderRadius: 8, padding: "4px 18px", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 42, letterSpacing: 5, color: cores.vermelho }}>INSCRITO</div>
      ) : null}
    </div>
  );
};

// Dois tubos: o largo transborda, o estreito mal enche
export const TubosNiveis: React.FC<{ entra: number; largo: { v: number; rotulo: string }; estreito: { v: number; rotulo: string } }> = ({ entra, largo, estreito }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [entra + 10, entra + 70], [0, largo.v], { ...clamp, easing: Easing.bezier(0.3, 0.6, 0.3, 1) });
  const b = interpolate(frame, [entra + 30, entra + 90], [0, estreito.v], { ...clamp, easing: Easing.bezier(0.3, 0.6, 0.3, 1) });
  const Tubo = ({ w, v, cor, rotulo }: { w: number; v: number; cor: string; rotulo: string }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ position: "relative", width: w, height: 480, border: `6px solid ${TRACO}`, borderTop: "none", borderRadius: "0 0 24px 24px", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.04)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${Math.min(1, v) * 100}%`, backgroundColor: cor, opacity: 0.85 }} />
      </div>
      <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 44, color: cor }}>{rotulo}</div>
    </div>
  );
  return (
    <div data-foco="tubos de nível" style={{ display: "flex", alignItems: "flex-end", gap: 120, opacity: interpolate(frame, [entra, entra + 10], [0, 1], clamp) }}>
      <Tubo w={300} v={a} cor={OURO} rotulo={largo.rotulo} />
      <Tubo w={90} v={b} cor={cores.vermelho} rotulo={estreito.rotulo} />
    </div>
  );
};

// Uma moeda ao lado de uma pilha de N moedas
export const MoedaSolitaria: React.FC<{ entra: number; pilha?: number; rotuloPilha: string; rotuloMoeda: string }> = ({ entra, pilha = 44, rotuloPilha, rotuloMoeda }) => {
  const frame = useCurrentFrame();
  const Moeda = ({ o }: { o: number }) => <div style={{ width: 150, height: 14, borderRadius: "50%", backgroundColor: OURO, border: "2px solid #8a6a1d", opacity: o, marginTop: -2 }} />;
  return (
    <div data-foco="moeda e pilha" style={{ display: "flex", alignItems: "flex-end", gap: 160 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Moeda o={interpolate(frame, [entra + 60, entra + 70], [0, 1], clamp)} />
        <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 40, color: cores.papel, opacity: interpolate(frame, [entra + 60, entra + 70], [0, 1], clamp) }}>{rotuloMoeda}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column-reverse" }}>
          {Array.from({ length: pilha }, (_, i) => <Moeda key={i} o={interpolate(frame, [entra + i * 1.1, entra + i * 1.1 + 4], [0, 1], clamp)} />)}
        </div>
        <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 40, color: OURO }}>{rotuloPilha}</div>
      </div>
    </div>
  );
};

// Crachás que viram e mostram a cor do vínculo
export const Crachas: React.FC<{ itens: { cor: string; rotulo: string; n: number }[]; entra: number; colunas?: number }> = ({ itens, entra, colunas = 10 }) => {
  const frame = useCurrentFrame();
  const lista = itens.flatMap((it) => Array.from({ length: it.n }, () => it));
  return (
    <div data-foco="crachás" style={{ display: "grid", gridTemplateColumns: `repeat(${colunas}, 56px)`, gap: 12 }}>
      {lista.map((it, i) => {
        const v = interpolate(frame, [entra + i * 1.5, entra + i * 1.5 + 8], [0, 1], clamp);
        return (
          <div key={i} style={{ width: 56, height: 80, borderRadius: 6, backgroundColor: v > 0.5 ? "#efe9dc" : "#4a423a", scale: `${Math.abs(1 - 2 * v)} 1`, overflow: "hidden", boxShadow: "0 6px 10px rgba(0,0,0,0.5)" }}>
            {v > 0.5 ? <div style={{ height: 22, backgroundColor: it.cor }} /> : null}
          </div>
        );
      })}
    </div>
  );
};

// Linha das conferências nacionais (I a XIV)
const ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV"];
const ANOS_CONF = [1995, 1997, 2001, 2003, 2005, 2007, 2009, 2011, 2013, 2015, 2017, 2019, 2023, 2025];
export const LinhaConferencias: React.FC<{ marcos: number[]; largura?: number; destaque?: number }> = ({ marcos, largura = 1700, destaque }) => {
  const frame = useCurrentFrame();
  const passo = largura / 14;
  return (
    <div data-foco="linha das conferências" style={{ position: "relative", width: largura, height: 200 }}>
      <div style={{ position: "absolute", left: passo / 2, right: passo / 2, top: 70, height: 4, backgroundColor: "#5a524a" }} />
      {ROMANOS.map((r, i) => {
        const f = marcos[i];
        const on = f === undefined ? 0 : interpolate(frame, [f, f + 8], [0, 1], clamp);
        const d = destaque === i;
        return (
          <div key={r} style={{ position: "absolute", left: i * passo, width: passo, top: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: d ? 40 : 30, color: on > 0.5 ? (d ? OURO : cores.papel) : "#5a524a" }}>{r}</div>
            <div style={{ width: d ? 34 : 22, height: d ? 34 : 22, borderRadius: "50%", backgroundColor: on > 0.5 ? (d ? OURO : cores.papel) : "#3a332b", boxShadow: d && on > 0.5 ? "0 0 30px rgba(224,180,60,0.9)" : "none" }} />
            <div style={{ fontFamily: fontes.rotulo, fontSize: 26, color: on > 0.5 ? cores.papelEscuro : "#4a423a" }}>{ANOS_CONF[i]}</div>
          </div>
        );
      })}
    </div>
  );
};

// Selo circular carimbado
export const SeloPEC: React.FC<{ entra: number; linhas: string[]; tamanho?: number }> = ({ entra, linhas, tamanho = 380 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [entra, entra + 6], [0, 1], clamp);
  return (
    <div data-foco="selo da PEC" style={{ width: tamanho, height: tamanho, borderRadius: "50%", border: `12px double ${cores.vermelho}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, rotate: "-10deg", opacity: p, scale: String(1.35 - 0.35 * p), backgroundColor: "rgba(20,12,10,0.55)" }}>
      {linhas.map((l, i) => (
        <div key={l} style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: i === 0 ? tamanho * 0.13 : tamanho * 0.1, color: cores.vermelho, letterSpacing: 3 }}>{l}</div>
      ))}
    </div>
  );
};

// Pauta de audiência que abre e ganha marca-texto numa linha
export const Pauta: React.FC<{ abre: number; titulo: string; linhas: string[]; destaque: number; marca: number; largura?: number }> = ({ abre, titulo, linhas, destaque, marca, largura = 1000 }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [abre, abre + 14], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0.7, 0.2, 1) });
  const m = interpolate(frame, [marca, marca + 18], [0, 100], clamp);
  return (
    <div data-foco="pauta" style={{ width: largura, backgroundColor: "#efe9dc", padding: "40px 50px", boxShadow: "0 30px 50px rgba(0,0,0,0.8)", scale: `1 ${a}`, transformOrigin: "top", fontFamily: fontes.documento, color: cores.tinta }}>
      <div style={{ fontSize: 30, letterSpacing: 3, textAlign: "center", marginBottom: 20 }}>{titulo}</div>
      {linhas.map((l, i) => (
        <div key={l} style={{ fontSize: 36, lineHeight: 1.6 }}>
          <span style={i === destaque ? { backgroundImage: "linear-gradient(rgba(242,194,48,0.75), rgba(242,194,48,0.75))", backgroundRepeat: "no-repeat", backgroundSize: `${m}% 78%`, backgroundPosition: "0 70%" } : undefined}>{l}</span>
        </div>
      ))}
    </div>
  );
};

// Casa-lar em traço, janelas acendem (sem pessoas)
export const AbrigoSilhueta: React.FC<{ acende: number; tamanho?: number }> = ({ acende, tamanho = 560 }) => {
  const frame = useCurrentFrame();
  const jan = [[120, 250], [260, 250], [400, 250], [120, 390], [400, 390]];
  return (
    <svg data-foco="casa de acolhimento" width={tamanho} height={tamanho * 0.9} viewBox="0 0 560 504">
      <path d="M40 200 L280 40 L520 200" fill="none" stroke={TRACO} strokeWidth={8} />
      <rect x={70} y={200} width={420} height={290} fill="rgba(0,0,0,0.3)" stroke={TRACO} strokeWidth={8} />
      <rect x={245} y={370} width={70} height={120} fill="none" stroke={TRACO} strokeWidth={6} />
      {jan.map(([x, y], i) => {
        const on = interpolate(frame, [acende + i * 12, acende + i * 12 + 10], [0, 1], clamp);
        return <rect key={i} x={x} y={y} width={80} height={80} fill={`rgba(255,214,130,${0.9 * on})`} stroke={TRACO} strokeWidth={5} style={{ filter: on > 0.5 ? "drop-shadow(0 0 14px rgba(255,200,110,0.8))" : undefined }} />;
      })}
    </svg>
  );
};

// Tripé da seguridade social
export const Tripe: React.FC<{ entra: number; pes: { rotulo: string; sub: string; f: number }[] }> = ({ entra, pes }) => {
  const frame = useCurrentFrame();
  const topo = interpolate(frame, [entra, entra + 12], [0, 1], clamp);
  return (
    <div data-foco="tripé da seguridade" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      <div style={{ width: 1100, padding: "20px 0", border: `6px solid ${TRACO}`, textAlign: "center", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 52, letterSpacing: 6, color: cores.papel, opacity: topo }}>SEGURIDADE SOCIAL · CF, art. 194</div>
      <div style={{ display: "flex", gap: 180 }}>
        {pes.map((p, i) => {
          const o = interpolate(frame, [p.f, p.f + 14], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0.7, 0.2, 1) });
          return (
            <div key={p.rotulo} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: o }}>
              <div style={{ width: 16, height: 300 * o, backgroundColor: i === 2 ? OURO : TRACO }} />
              <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 44, color: i === 2 ? OURO : cores.papel, whiteSpace: "nowrap" }}>{p.rotulo}</div>
              <div style={{ fontFamily: fontes.maquina, fontSize: 32, color: cores.papelEscuro, whiteSpace: "nowrap" }}>{p.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Pastas com perguntas escritas à mão
export const Pastas: React.FC<{ perguntas: string[]; entra: number }> = ({ perguntas, entra }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center", width: 1700 }}>
      {perguntas.map((p, i) => {
        const e = entra + i * 14;
        const o = interpolate(frame, [e, e + 10], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0.7, 0.2, 1) });
        return (
          <div key={p} data-foco={`pasta ${p}`} style={{ position: "relative", width: 300, height: 220, opacity: o, translate: `0 ${(1 - o) * -80}px`, rotate: `${[-3, 2, -1.5, 3, -2][i % 5]}deg` }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 120, height: 34, backgroundColor: "#c9a86a", borderRadius: "8px 8px 0 0" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 30, bottom: 0, backgroundColor: "#d9b877", boxShadow: "0 16px 24px rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, boxSizing: "border-box" }}>
              <div style={{ fontFamily: fontes.maquina, fontSize: 36, color: "#2a221d", textAlign: "center", lineHeight: 1.15 }}>{p}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
