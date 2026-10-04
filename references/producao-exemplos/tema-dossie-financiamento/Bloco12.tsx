import { Audio } from "@remotion/media";
import { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Clarao } from "../componentes/Clarao";
import { RedeDinheiro, Tarja } from "../componentes/KitDossie";
import { Legenda } from "../componentes/Legenda";
import { cortarCurva, DUR, EASE, entrar } from "../componentes/Movimento";
import { ListaSancoes, PainelResumo, TelaSistema } from "../componentes/KitSistema";
import { Pelicula, Quadro } from "../componentes/Quadro";
import { Efeito, Trilha } from "../componentes/Trilha";
import cues from "../data/cues.json";
import { c, fontes, ms, sombra } from "../tema";

// B12 · A rede de ligações (coração do vídeo). Suspense e revelação, SEM acusação: todo achado é do autor do
// levantamento independente e leva tarja. Rótulos genéricos, nenhum nome. Bloco inteiro SEM LEGENDA (rede rotulada e telas de texto).
// Entra do preto (o B11 mergulha no preto); sai em mergulho no preto (o B13 abre com a cartela do Capítulo V).
// Três revelações: riser → 15 frames sem trilha → impacto + clarão âmbar (38.267 · R$ 2.504.200 · 66 casos).
const C = cues["12"];
const t = (i: number) => ms(C[i].de);
const em = (i: number, trecho: string) => {
  const x = C[i];
  const k = Math.max(0, x.texto.indexOf(trecho));
  return ms(x.de + ((x.ate - x.de) * k) / x.texto.length);
};
const corte = (i: number) => Math.max(ms(C[i - 1].ate) + 1, t(i) - 3);
export const DURACAO_12 = ms(C[C.length - 1].ate) + 30;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (i: number) => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const TARJA = "LEVANTAMENTO INDEPENDENTE · INDÍCIO, NÃO ACUSAÇÃO";
const EXEMPLO = "EXEMPLO ILUSTRATIVO · NOMES E VALORES FICTÍCIOS";
// revelações (frames absolutos)
const RV1 = em(6, "trinta e oito");
const RV2 = em(11, "dois milhões");
const RV3 = em(14, "sessenta e seis");
const SIL = 15; // frames sem trilha antes de cada impacto

// ───────── auxiliares ─────────
const Cena: React.FC<{ dur: number; semSaida?: boolean; semEntrada?: boolean; children: React.ReactNode }> = ({ dur, semSaida, semEntrada, children }) => {
  const f = useCurrentFrame();
  const cc = f < dur / 2 ? (semEntrada ? null : cortarCurva(f, 0).entra) : semSaida ? null : cortarCurva(f, dur).sai;
  const movendo = (!semEntrada && f < 12) || (!semSaida && f > dur - 10);
  return (
    <AbsoluteFill style={cc ?? undefined} {...(movendo ? { "data-camera-movendo": true } : {})}>
      <AbsoluteFill style={{ translate: `${interpolate(f, [0, dur], [16, -16], { ...clamp, easing: EASE.fundo })}px 0` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const Num: React.FC<{ valor: number; de: number; dur?: number; casas?: number; prefixo?: string; sufixo?: string }> = ({ valor, de, dur = 36, casas = 0, prefixo = "", sufixo = "" }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [de, de + dur], [0, 1], { ...clamp, easing: EASE.padrao });
  return (
    <>
      {prefixo}
      {(valor * p).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })}
      {sufixo}
    </>
  );
};
const Titulo: React.FC<{ entra: number; n: string; txt: string }> = ({ entra, n, txt }) => {
  const f = useCurrentFrame();
  const a = entrar(f, entra, DUR.padrao, EASE.enfase);
  return (
    <div data-foco={`título: ${txt}`} style={{ position: "absolute", left: 90, top: 50, opacity: a, translate: `${(1 - a) * -30}px 0`, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
      <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 26, letterSpacing: 3, color: c.ambar, whiteSpace: "nowrap" }}>{n}</div>
      <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 56, letterSpacing: 1, color: c.claro, whiteSpace: "nowrap" }}>{txt}</div>
    </div>
  );
};
const Rodape: React.FC<{ entra: number; extra?: string; top?: number }> = ({ entra, extra, top = 962 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", gap: 24 }}>
    <Tarja texto={TARJA} entra={entra} />
    {extra ? <Tarja texto={extra} entra={entra + 6} /> : null}
  </div>
);
const Chip: React.FC<{ entra: number; foco: string; cor?: string; tam?: number; cheio?: boolean; children: React.ReactNode }> = ({ entra, foco, cor = c.dinheiro, tam = 26, cheio, children }) => {
  const f = useCurrentFrame();
  const a = entrar(f, entra - 2, DUR.padrao, EASE.enfase);
  return (
    <div data-foco={foco} style={{ opacity: a, translate: `${(1 - a) * -24}px 0`, padding: "10px 22px", borderRadius: 10, border: `2px solid ${cor}`, backgroundColor: cheio ? cor : c.painel, fontFamily: fontes.mono, fontWeight: 600, fontSize: tam, color: cheio ? c.grafite : cor, whiteSpace: "nowrap", width: "fit-content" }}>
      {children}
    </div>
  );
};

// ───────── C1 · o levantamento: cinco fontes oficiais → base consolidada ─────────
const CenaFontes: React.FC<{ ini: number; dur: number }> = ({ ini, dur }) => {
  const f = useCurrentFrame();
  const R = (i: number) => t(i) - ini;
  const E = (i: number, s: string) => em(i, s) - ini;
  const fontesN = [
    { id: "cand", x: 400, y: 640, rotulo: "CANDIDATURAS", sub: "TSE", tipo: "fundo" as const, f: E(0, "como candidaturas") + 4 },
    { id: "bens", x: 564, y: 360, rotulo: "BENS DECLARADOS", sub: "TSE", tipo: "fundo" as const, f: E(0, "bens declarados") },
    { id: "contas", x: 960, y: 250, rotulo: "PRESTAÇÕES DE CONTAS", sub: "TSE · 2018 a 2026", tipo: "fundo" as const, f: E(0, "prestações de contas") },
    { id: "socios", x: 1356, y: 360, rotulo: "QUADRO DE SÓCIOS", sub: "Receita Federal", tipo: "fundo" as const, f: E(0, "quadro de sócios") },
    { id: "cnpj", x: 1520, y: 640, rotulo: "CONSULTA DE CNPJ", sub: "serviço comunitário gratuito", tipo: "empresa" as const, f: E(0, "quadro de sócios") + 26 },
  ];
  const repo = E(0, "repositório");
  const video = E(0, "num vídeo") - 4;
  return (
    <Cena dur={dur} semEntrada>
      <RedeDinheiro
        nos={[{ id: "base", x: 960, y: 640, rotulo: "BASE CONSOLIDADA", sub: "dados oficiais cruzados", sigla: "DADOS", tipo: "fundo", raio: 76, f: R(0) + 30 }, ...fontesN.map((n) => ({ ...n, raio: 50 }))]}
        arestas={fontesN.map((n) => ({ de: n.id, para: "base", f: n.f + 8, curva: 0 }))}
      />
      <div data-foco="levantamento independente" style={{ position: "absolute", left: 90, top: 64, opacity: entrar(f, R(0) + 6, DUR.padrao, EASE.enfase), display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: c.ambar, whiteSpace: "nowrap" }}>2026 · LEVANTAMENTO INDEPENDENTE</div>
        <div style={{ opacity: entrar(f, repo, DUR.padrao), fontFamily: fontes.titulo, fontWeight: 800, fontSize: 44, color: c.claro, whiteSpace: "nowrap" }}>um programador · código em repositório público</div>
      </div>
      <div style={{ position: "absolute", right: 90, top: 80 }}>
        <Chip entra={video} foco="resultados em vídeo" cor={c.cinza} tam={22}>
          RESULTADOS APRESENTADOS EM VÍDEO
        </Chip>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div data-foco="atribuição" style={{ opacity: entrar(f, R(0) + 40, DUR.padrao), fontFamily: fontes.mono, fontSize: 22, color: c.cinza, whiteSpace: "nowrap" }}>
          Levantamento independente: YuriRDev / elosys (2026) · indícios, não provas
        </div>
        <Tarja texto={TARJA} entra={R(0) + 46} />
      </div>
    </Cena>
  );
};

// ───────── C2 · cartela de atribuição ─────────
const CenaAtribuicao: React.FC<{ ini: number; dur: number }> = ({ ini, dur }) => {
  const f = useCurrentFrame();
  const R = (i: number) => t(i) - ini;
  const E = (i: number, s: string) => em(i, s) - ini;
  const linhas = [
    { txt: "não conferidos de forma independente pelo canal", f: E(1, "não foram conferidos") },
    { txt: "“indícios, não provas”, avisa o próprio autor", f: E(1, "indícios") },
    { txt: "não constituem acusação contra ninguém", f: E(1, "não constituem") },
  ];
  const a = entrar(f, R(1), DUR.cena, EASE.enfase);
  return (
    <Cena dur={dur}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div data-foco="cartela atribuição" style={{ opacity: a, translate: `0 ${(1 - a) * 30}px`, width: 1400, padding: "56px 70px", borderRadius: 20, backgroundColor: c.painel, border: `3px solid ${c.ambar}`, boxShadow: sombra, display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 26, letterSpacing: 4, color: c.ambar, whiteSpace: "nowrap" }}>ATENÇÃO À FONTE</div>
          <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 70, lineHeight: 1.08, color: c.claro }}>
            OS NÚMEROS A SEGUIR SÃO DO
            <br />
            AUTOR DO LEVANTAMENTO
          </div>
          <div style={{ height: 3, width: 220 * entrar(f, R(1) + 10, 14), backgroundColor: c.ambar }} />
          {linhas.map((l, i) => {
            const p = entrar(f, l.f - 2, DUR.padrao, EASE.enfase);
            return (
              <div key={i} style={{ opacity: p, translate: `${(1 - p) * -24}px 0`, display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: c.ambar }} />
                <div style={{ fontFamily: fontes.texto, fontWeight: 600, fontSize: 38, color: c.claro, whiteSpace: "nowrap" }}>{l.txt}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Cena>
  );
};

// ───────── C3 · CicloCircular [NOVO]: o dinheiro que volta ao ponto de partida ─────────
const Pontinhos: React.FC<{ entra: number; n?: number }> = ({ entra, n = 260 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: n }).map((_, i) => {
        const p = entrar(f, entra + rnd(i * 3) * 60, 12);
        const x = 60 + rnd(i * 7 + 1) * 1800;
        const y = 40 + rnd(i * 11 + 2) * 1000;
        return <circle key={i} cx={x + Math.sin(f / 50 + i) * 3} cy={y} r={1.6 + rnd(i) * 1.6} fill={i % 9 === 0 ? c.ambar : c.dinheiro} opacity={0.22 * p} />;
      })}
    </svg>
  );
};
const CenaCiclo: React.FC<{ ini: number; dur: number }> = ({ ini, dur }) => {
  const f = useCurrentFrame();
  const R = (i: number) => t(i) - ini;
  const E = (i: number, s: string) => em(i, s) - ini;
  const ed = [E(4, "quem doa"), E(4, "quem recebe a quem fornece") - 6, E(4, "quem fornece"), E(4, "voltam ao ponto")];
  const fecha = ed[3] + 18;
  const saltos = ed.filter((x) => f >= x + 14).length;
  return (
    <Cena dur={dur}>
      <Pontinhos entra={R(3)} />
      <RedeDinheiro
        nos={[
          { id: "doador", x: 960, y: 250, rotulo: "CAMPANHA A", sub: "candidatura", tipo: "candidato", f: R(3) + 10 },
          { id: "campA", x: 1420, y: 530, rotulo: "DIRETÓRIO", sub: "partido", tipo: "partido", f: R(3) + 16 },
          { id: "campB", x: 960, y: 800, rotulo: "CAMPANHA B", sub: "candidatura", tipo: "candidato", f: R(3) + 22 },
          { id: "forn", x: 500, y: 530, rotulo: "GRÁFICA X", sub: "fornecedora", tipo: "empresa", f: R(3) + 28 },
        ]}
        arestas={[
          { de: "doador", para: "campA", valor: "doa", f: ed[0], curva: 30 },
          { de: "campA", para: "campB", valor: "repassa", f: ed[1], curva: 30 },
          { de: "campB", para: "forn", valor: "paga", f: ed[2], curva: 30 },
          { de: "forn", para: "doador", valor: "volta?", f: ed[3], curva: 30 },
        ]}
        ciclo={{ ids: ["doador", "campA", "campB", "forn"], em: fecha }}
      />
      <Titulo entra={R(3)} n="1º ACHADO" txt="A REDE DE LIGAÇÕES" />
      <div data-foco="contador de saltos" style={{ position: "absolute", right: 90, top: 70, opacity: entrar(f, ed[0], DUR.padrao), display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 22, letterSpacing: 3, color: c.cinza, whiteSpace: "nowrap" }}>SALTOS</div>
        <div style={{ display: "flex", gap: 14 }}>
          {[1, 2, 3, 4].map((k) => (
            <div key={k} style={{ width: 54, height: 54, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${k <= saltos ? (f >= fecha ? c.ambar : c.dinheiro) : c.fio}`, fontFamily: fontes.titulo, fontWeight: 900, fontSize: 34, color: k <= saltos ? (f >= fecha ? c.ambar : c.dinheiro) : c.fio }}>
              {k}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", right: 90, top: 860 }}>
        <Chip entra={fecha + 4} foco="ciclo fechado" cor={c.ambar} tam={24}>
          CICLO FECHADO: O CAMINHO VOLTA À ORIGEM
        </Chip>
      </div>
      <div style={{ position: "absolute", left: 90, top: 860, opacity: entrar(f, R(4), DUR.padrao), fontFamily: fontes.mono, fontSize: 22, lineHeight: 1.5, color: c.cinza, whiteSpace: "nowrap" }} data-foco="regra do programa">
        quem doa → quem recebe
        <br />
        quem recebe → quem fornece
      </div>
      <Rodape entra={R(3) + 12} extra={EXEMPLO} />
    </Cena>
  );
};

// ───────── C4 · LupaFiltro [NOVO]: 108.400 ciclos → 38.267 acima de R$ 10 mil ─────────
const FX = 640; // centro do funil
const larg = (y: number) => (y < 300 ? 620 : y > 600 ? 150 : 620 - ((y - 300) / 300) * 470);
const CenaFunil: React.FC<{ ini: number; dur: number }> = ({ ini, dur }) => {
  const f = useCurrentFrame();
  const R = (i: number) => t(i) - ini;
  const E = (i: number, s: string) => em(i, s) - ini;
  const rv = RV1 - ini;
  const funil = entrar(f, R(5) + 2, DUR.cena, EASE.enfase);
  const fluxo = E(5, "cento e oito");
  const trava = E(6, "mais de dez mil") - 6;
  const pTrava = entrar(f, trava, DUR.padrao, EASE.enfase);
  const out = entrar(f, rv, 6, EASE.enfase);
  const circ = R(7);
  return (
    <Cena dur={dur}>
      {/* funil */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: funil }}>
        <path d={`M ${FX - 310} 300 L ${FX + 310} 300 L ${FX + 75} 600 L ${FX + 75} 720 L ${FX - 75} 720 L ${FX - 75} 600 Z`} fill="rgba(47,208,138,0.05)" stroke={c.fio} strokeWidth={3} />
        {f >= fluxo
          ? Array.from({ length: 46 }).map((_, k) => {
              const q = (((f - fluxo) / 80 + k / 46) % 1 + 1) % 1;
              const y = 230 + q * 560;
              const passa = rnd(k + 5) < 0.36 || f < trava + 10;
              if (!passa && y > 575) return null;
              const fade = !passa && y > 520 ? 1 - (y - 520) / 55 : 1;
              const x = FX + (rnd(k * 13) - 0.5) * (larg(y) - 30);
              const surge = entrar(f, fluxo + (k / 46) * 20, 8);
              return <circle key={k} cx={x} cy={y} r={5} fill={y > 600 && f >= trava + 10 ? c.ambar : c.dinheiro} opacity={0.85 * fade * surge} />;
            })
          : null}
        {/* trava do filtro */}
        <g opacity={pTrava}>
          <rect x={FX - 200} y={556} width={400 * pTrava} height={8} rx={4} fill={c.ambar} />
        </g>
      </svg>
      <Titulo entra={R(5)} n="1º ACHADO" txt="DOAÇÕES CIRCULARES" />
      <div style={{ position: "absolute", left: FX - 310, width: 620, top: 166, display: "flex", justifyContent: "center" }}>
        <div data-foco="108.400 ciclos" style={{ opacity: entrar(f, fluxo - 2, DUR.pequeno), display: "flex", alignItems: "baseline", gap: 14, whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 84, lineHeight: 1, color: c.dinheiro, fontVariantNumeric: "tabular-nums" }}>
            <Num valor={108400} de={fluxo} dur={40} />
          </div>
          <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 26, color: c.cinza }}>ciclos</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: FX + 200, top: 536 }}>
        <Chip entra={trava} foco="trava > R$ 10 mil" cor={c.ambar} tam={24}>
          {"> R$ 10 MIL"}
        </Chip>
      </div>
      <div style={{ position: "absolute", left: FX - 310, width: 620, top: 744, display: "flex", justifyContent: "center" }}>
        <div data-foco="38.267" style={{ opacity: out, translate: `0 ${(1 - out) * 26}px`, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 116, lineHeight: 1, color: c.ambar, whiteSpace: "nowrap", textShadow: "0 0 30px rgba(255,176,32,0.45)" }}>38.267</div>
          <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 22, color: c.claro, whiteSpace: "nowrap" }}>ciclos com mais de R$ 10 mil</div>
        </div>
      </div>
      {/* coluna direita */}
      <div style={{ position: "absolute", left: 1150, top: 190, display: "flex", flexDirection: "column", gap: 18 }}>
        <Chip entra={E(5, "cinco milhões")} foco="tamanho da rede" cor={c.dinheiro} tam={24}>
          REDE: 5,35 MI PONTOS · 7,66 MI LIGAÇÕES
        </Chip>
        <Chip entra={E(6, "até cinco")} foco="busca até 5 pontos" cor={c.cinza} tam={24}>
          BUSCA: CICLOS DE ATÉ 5 PONTOS
        </Chip>
        <div data-foco="circular ≠ ilegal" style={{ marginTop: 34, opacity: entrar(f, circ, DUR.padrao, EASE.enfase), translate: `${(1 - entrar(f, circ, DUR.padrao)) * -30}px 0`, fontFamily: fontes.titulo, fontWeight: 900, fontSize: 92, lineHeight: 1, color: c.dinheiro, whiteSpace: "nowrap" }}>
          CIRCULAR <span style={{ color: c.claro }}>≠</span> ILEGAL
        </div>
        <div style={{ opacity: entrar(f, E(7, "explicação legítima") - 4, DUR.padrao), fontFamily: fontes.mono, fontSize: 22, color: c.cinza, whiteSpace: "nowrap" }} data-foco="explicação legítima">
          explicações legítimas, segundo o autor:
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Chip entra={E(7, "coligações")} foco="coligação" cor={c.dinheiro} tam={26} cheio>
            COLIGAÇÃO
          </Chip>
          <Chip entra={E(7, "ressarcimentos")} foco="ressarcimento" cor={c.dinheiro} tam={26} cheio>
            RESSARCIMENTO
          </Chip>
        </div>
        <div data-foco="categoria do TSE" style={{ marginTop: 18, opacity: entrar(f, E(7, "as planilhas") - 2, DUR.padrao, EASE.enfase), width: 680, padding: "16px 22px", borderRadius: 12, backgroundColor: c.painel, border: `1px solid ${c.fio}`, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontFamily: fontes.mono, fontSize: 19, color: c.cinza, whiteSpace: "nowrap" }}>nota do canal · planilhas do TSE</div>
          <div style={{ fontFamily: fontes.texto, fontWeight: 600, fontSize: 28, color: c.claro, whiteSpace: "nowrap" }}>categoria “recursos de outros candidatos”</div>
        </div>
      </div>
      <Rodape entra={R(5) + 10} />
    </Cena>
  );
};

// ───────── C5 · CurvaMediana [NOVO]: gasto fora do padrão ─────────
const LX = (v: number) => 170 + ((Math.log10(v) - 1.5) / 5.1) * 1580;
const MED = 253.5;
const DOTS = Array.from({ length: 64 }).map((_, i) => {
  const g = (rnd(i * 3 + 1) + rnd(i * 5 + 2) + rnd(i * 7 + 3) - 1.5) * 1.15;
  return { v: MED * Math.pow(10, g * 0.55), y: 600 - rnd(i * 17) * 110 };
});
const SINAIS = [5200, 8100, 14500, 41000].map((v, i) => ({ v, y: 560 - i * 22 }));
const CenaMediana: React.FC<{ ini: number; dur: number }> = ({ ini, dur }) => {
  const f = useCurrentFrame();
  const R = (i: number) => t(i) - ini;
  const E = (i: number, s: string) => em(i, s) - ini;
  const rv = RV2 - ini;
  const eixo = entrar(f, R(8) + 4, DUR.cena, EASE.padrao);
  const queda = R(9);
  const med = E(9, "mediana histórica");
  const faixa = E(9, "quinze vezes") - 4;
  const pf = entrar(f, faixa, 18, EASE.padrao);
  const longe = entrar(f, rv, 6, EASE.enfase);
  const xm = LX(MED);
  const x15 = LX(MED * 15);
  const xl = LX(2504200);
  return (
    <Cena dur={dur}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* faixa âmbar: acima de 15× a mediana */}
        <rect x={x15} y={300} width={(1780 - x15) * pf} height={360} fill="rgba(255,176,32,0.08)" />
        <line x1={x15} y1={300} x2={x15} y2={660} stroke={c.ambar} strokeWidth={2} strokeDasharray="8 8" opacity={pf} />
        {/* eixo log */}
        <line x1={170} y1={662} x2={170 + 1610 * eixo} y2={662} stroke={c.fio} strokeWidth={3} />
        {[100, 1000, 10000, 100000, 1000000].map((v, i) => (
          <g key={v} opacity={entrar(f, R(8) + 8 + i * 2, DUR.pequeno)}>
            <line x1={LX(v)} y1={656} x2={LX(v)} y2={674} stroke={c.cinza} strokeWidth={2} />
            <text x={LX(v)} y={706} textAnchor="middle" fontFamily={fontes.mono} fontSize={22} fill={c.cinza}>
              {["R$ 100", "R$ 1 mil", "R$ 10 mil", "R$ 100 mil", "R$ 1 mi"][i]}
            </text>
          </g>
        ))}
        {/* pontos que caem em ordem */}
        {DOTS.map((d, i) => {
          const p = entrar(f, queda + (i / DOTS.length) * 40, 12, EASE.padrao);
          return <circle key={i} cx={LX(d.v)} cy={d.y - (1 - p) * 140} r={7} fill={c.dinheiro} opacity={0.75 * p} />;
        })}
        {SINAIS.map((d, i) => {
          const p = entrar(f, faixa + 8 + i * 3, 10, EASE.padrao);
          return <circle key={`s${i}`} cx={LX(d.v)} cy={d.y - (1 - p) * 120} r={8} fill={c.ambar} opacity={0.9 * p} />;
        })}
        {/* mediana */}
        <line x1={xm} y1={662} x2={xm} y2={662 - 360 * entrar(f, med, 16, EASE.padrao)} stroke={c.claro} strokeWidth={4} />
        {/* o ponto distante */}
        <g opacity={longe}>
          <circle cx={xl} cy={470} r={18} fill={c.ambar} style={{ filter: "drop-shadow(0 0 16px rgba(255,176,32,0.9))" }} />
          <line x1={xl} y1={490} x2={xl} y2={662} stroke={c.ambar} strokeWidth={2} strokeDasharray="4 6" />
        </g>
      </svg>
      <Titulo entra={R(8)} n="2º ACHADO" txt="GASTO FORA DO PADRÃO" />
      <div style={{ position: "absolute", left: 90, top: 174, display: "flex", gap: 12, alignItems: "center" }}>
        <Chip entra={E(9, "dezoito itens")} foco="18 itens baratos" cor={c.claro} tam={22}>
          18 ITENS BARATOS
        </Chip>
        {["caneta", "lápis", "adesivo", "crachá", "envelope"].map((x) => (
          <Chip key={x} entra={E(9, x)} foco={`item ${x}`} cor={x === "adesivo" ? c.ambar : c.cinza} tam={22}>
            {x.toUpperCase()}
          </Chip>
        ))}
      </div>
      <div data-foco="mediana" style={{ position: "absolute", left: xm - 230, width: 460, top: 250, textAlign: "center", opacity: entrar(f, med + 10, DUR.padrao), fontFamily: fontes.mono, fontWeight: 600, fontSize: 24, color: c.claro, whiteSpace: "nowrap" }}>
        MEDIANA · R$ 253,50
        <div style={{ fontFamily: fontes.mono, fontWeight: 400, fontSize: 19, color: c.cinza }}>o valor do meio · material adesivo</div>
      </div>
      <div data-foco="15× a mediana" style={{ position: "absolute", left: x15 + 20, top: 316, opacity: entrar(f, faixa + 6, DUR.padrao), fontFamily: fontes.mono, fontWeight: 600, fontSize: 24, color: c.ambar, whiteSpace: "nowrap" }}>
        ACIMA DE 15× A MEDIANA = SINAL
      </div>
      <div data-foco="28.743 sinais" style={{ position: "absolute", right: 90, top: 60, opacity: entrar(f, E(10, "vinte e oito") - 2, DUR.pequeno), display: "flex", alignItems: "baseline", gap: 14 }}>
        <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 84, lineHeight: 1, color: c.ambar, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
          <Num valor={28743} de={E(10, "vinte e oito")} dur={36} />
        </div>
        <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 26, color: c.cinza, whiteSpace: "nowrap" }}>sinais</div>
      </div>
      <div data-foco="maior caso" style={{ position: "absolute", right: 1920 - xl + 40, top: 410, opacity: longe, translate: `${(1 - longe) * 30}px 0`, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
        <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 64, lineHeight: 1, color: c.ambar, whiteSpace: "nowrap" }}>R$ 2.504.200</div>
        <div style={{ opacity: entrar(f, E(11, "quase dez mil") - 2, DUR.padrao), fontFamily: fontes.mono, fontWeight: 600, fontSize: 24, color: c.claro, whiteSpace: "nowrap" }}>9.879× a mediana · material adesivo</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 770, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
        <Chip entra={R(12)} foco="valor, não quantidade" cor={c.claro} tam={26}>
          A PLANILHA MOSTRA O VALOR, NÃO A QUANTIDADE
        </Chip>
        <Chip entra={E(12, "exagero")} foco="exagero?" cor={c.ambar} tam={26}>
          EXAGERO?
        </Chip>
        <Chip entra={E(12, "compra muito grande")} foco="compra grande?" cor={c.ambar} tam={26}>
          COMPRA MUITO GRANDE?
        </Chip>
      </div>
      <div data-foco="escala log" style={{ position: "absolute", left: 170, top: 720, opacity: eixo, fontFamily: fontes.mono, fontSize: 18, color: c.cinza, whiteSpace: "nowrap" }}>
        escala logarítmica · cada ponto = uma despesa (ilustrativo)
      </div>
      <Rodape entra={R(8) + 10} />
    </Cena>
  );
};

// ───────── C6 · candidato que também é sócio de fornecedor ─────────
const CenaSocio: React.FC<{ ini: number; dur: number }> = ({ ini, dur }) => {
  const f = useCurrentFrame();
  const R = (i: number) => t(i) - ini;
  const E = (i: number, s: string) => em(i, s) - ini;
  const rv = RV3 - ini;
  const arco = entrar(f, E(13, "também é sócio") - 4, 20, EASE.padrao);
  const p533 = E(14, "quinhentos");
  const p66 = entrar(f, rv, 6, EASE.enfase);
  const cpf = R(15);
  const pc = entrar(f, cpf, DUR.cena, EASE.enfase);
  return (
    <Cena dur={dur}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d="M 600 270 Q 960 40 1320 270" fill="none" stroke={c.ambar} strokeWidth={4} strokeDasharray="14 10" style={{ clipPath: `inset(0 ${100 - arco * 100}% 0 0)` }} />
      </svg>
      <RedeDinheiro
        nos={[
          { id: "cand", x: 560, y: 340, rotulo: "CAMPANHA A", sub: "candidato", tipo: "candidato", raio: 62, f: R(13) + 2 },
          { id: "emp", x: 1360, y: 340, rotulo: "GRÁFICA X", sub: "empresa fornecedora", tipo: "empresa", raio: 62, f: R(13) + 10 },
        ]}
        arestas={[{ de: "cand", para: "emp", valor: "pagamento da campanha", f: E(14, "teria contratado") - 10, curva: 0 }]}
      />
      <div data-foco="sócio?" style={{ position: "absolute", left: 960 - 80, width: 160, top: 128, textAlign: "center", opacity: entrar(f, E(13, "também é sócio") + 10, DUR.padrao), padding: "6px 0", borderRadius: 10, backgroundColor: c.grafite, border: `2px dashed ${c.ambar}`, fontFamily: fontes.titulo, fontWeight: 900, fontSize: 40, color: c.ambar, whiteSpace: "nowrap" }}>
        SÓCIO?
      </div>
      <Titulo entra={R(13)} n="3º ACHADO" txt="O SÓCIO" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 540, display: "flex", justifyContent: "center", gap: 50 }}>
        <div data-foco="533 vínculos" style={{ opacity: entrar(f, p533 - 2, DUR.padrao, EASE.enfase), width: 600, padding: "22px 30px", borderRadius: 16, backgroundColor: c.painel, border: `1px solid ${c.fio}`, boxShadow: sombra, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 86, lineHeight: 1, color: c.dinheiro, whiteSpace: "nowrap" }}>
            <Num valor={533} de={p533} dur={30} />
          </div>
          <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 22, color: c.claro, lineHeight: 1.35 }}>vínculos possíveis entre candidatos e empresas pagas por campanhas</div>
        </div>
        <div data-foco="66 casos" style={{ opacity: p66, translate: `0 ${(1 - p66) * 26}px`, width: 680, padding: "22px 30px", borderRadius: 16, backgroundColor: c.painel, border: `2px solid ${c.ambar}`, boxShadow: `0 0 30px rgba(255,176,32,0.2)`, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 86, lineHeight: 1, color: c.ambar, whiteSpace: "nowrap" }}>66</div>
          <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 22, color: c.claro, lineHeight: 1.35 }}>casos: a campanha teria pago empresa do próprio candidato</div>
          <div style={{ opacity: entrar(f, E(14, "gráficas") - 2, DUR.padrao), fontFamily: fontes.mono, fontSize: 20, color: c.cinza, whiteSpace: "nowrap" }}>ex.: gráficas, escritórios de advocacia</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center" }}>
        <div data-foco="CPF mascarado" style={{ opacity: pc, translate: `0 ${(1 - pc) * 24}px`, display: "flex", alignItems: "center", gap: 28, padding: "16px 28px", borderRadius: 14, backgroundColor: c.painel, border: `1px solid ${c.fio}` }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontFamily: fontes.mono, fontSize: 18, color: c.cinza, whiteSpace: "nowrap" }}>CPF de sócio na base da Receita · número fictício</div>
            <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 40, letterSpacing: 4, color: c.claro, whiteSpace: "nowrap" }}>
              <span style={{ color: c.fio }}>***</span>
              <span style={{ color: f >= E(15, "seis dígitos") ? c.ambar : c.claro }}>123456</span>
              <span style={{ color: c.fio }}>**</span>
            </div>
          </div>
          <div style={{ opacity: entrar(f, E(15, "seis dígitos") + 6, DUR.padrao), fontFamily: fontes.texto, fontWeight: 600, fontSize: 26, color: c.claro, whiteSpace: "nowrap" }}>
            nome + 6 dígitos visíveis = <span style={{ color: c.ambar }}>vínculo possível, não confirmado</span>
          </div>
        </div>
      </div>
      <Rodape entra={R(13) + 10} extra={EXEMPLO} />
    </Cena>
  );
};

// ───────── C7 · o alerta sobre os próprios dados ─────────
const ROLO = ["R$ 1.210.000,00", "R$ 12.100.000,00", "R$ 121.000.000,00", "R$ 1.210.000.000,00", "R$ 12.100.000.000,00"];
const CenaErro: React.FC<{ ini: number; dur: number }> = ({ ini, dur }) => {
  const f = useCurrentFrame();
  const R = (i: number) => t(i) - ini;
  const E = (i: number, s: string) => em(i, s) - ini;
  const a = entrar(f, R(19) + 6, DUR.cena, EASE.enfase);
  const gira = E(20, "doze bilhões") - 10;
  const k = Math.max(0, Math.min(ROLO.length - 1, Math.floor((f - gira) / 4)));
  const valor = f < gira ? ROLO[0] : ROLO[k];
  const alerta = f >= gira + 16;
  const selo = E(20, "erro de digitação") - 2;
  const ps = entrar(f, selo, DUR.padrao, EASE.enfase);
  const linhas = [
    { r: "CANDIDATO", v: "▬▬▬▬▬▬▬▬ (sem nome)" },
    { r: "ELEIÇÃO", v: "2024" },
    { r: "ITENS", v: "▬▬▬ · ▬▬▬▬ · ▬▬" },
  ];
  return (
    <Cena dur={dur}>
      <Titulo entra={R(19)} n="5º ACHADO" txt="UM ALERTA SOBRE OS DADOS" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}>
        <div data-foco="ficha de bens" style={{ opacity: a, translate: `0 ${(1 - a) * 40}px`, width: 1180, borderRadius: 18, backgroundColor: c.painel, boxShadow: sombra, overflow: "hidden", border: `2px solid ${alerta ? c.ambar : c.fio}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 28px", backgroundColor: c.branco }}>
            {[c.alerta, c.ambar, c.dinheiro].map((k2, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: k2, opacity: 0.8 }} />
            ))}
            <div style={{ marginLeft: 10, fontFamily: fontes.mono, fontWeight: 600, fontSize: 24, color: c.claro, whiteSpace: "nowrap" }}>BENS DECLARADOS · 2024</div>
            <div style={{ marginLeft: "auto", fontFamily: fontes.mono, fontSize: 19, color: c.cinza, whiteSpace: "nowrap" }}>ilustração hipotética do tipo de erro · sem nome</div>
          </div>
          <div style={{ padding: "10px 28px 24px" }}>
            {linhas.map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 0", borderBottom: `1px solid ${c.fio}`, opacity: entrar(f, R(19) + 14 + i * 3, DUR.pequeno) }}>
                <div style={{ width: 300, fontFamily: fontes.mono, fontSize: 24, color: c.cinza, whiteSpace: "nowrap" }}>{l.r}</div>
                <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 28, color: c.claro, whiteSpace: "nowrap" }}>{l.v}</div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 0 4px", opacity: entrar(f, R(20), DUR.pequeno) }}>
              <div style={{ width: 300, fontFamily: fontes.mono, fontSize: 24, color: c.cinza, whiteSpace: "nowrap" }}>TOTAL DE BENS</div>
              <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 48, color: alerta ? c.ambar : c.claro, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{valor}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div data-foco="12,1 bilhões" style={{ opacity: entrar(f, gira + 18, DUR.pequeno), fontFamily: fontes.titulo, fontWeight: 900, fontSize: 72, lineHeight: 1, color: c.ambar, whiteSpace: "nowrap" }}>
            {"> R$ 12 BILHÕES"}
          </div>
          <div data-foco="selo provável erro" style={{ opacity: ps, translate: `${(1 - ps) * -24}px 0`, padding: "12px 24px", borderRadius: 10, border: `3px solid ${c.ambar}`, rotate: "-2deg", fontFamily: fontes.titulo, fontWeight: 800, fontSize: 34, letterSpacing: 1, color: c.ambar, whiteSpace: "nowrap" }}>
            PROVÁVEL ERRO DE DIGITAÇÃO <span style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 20 }}>(segundo o autor)</span>
          </div>
        </div>
        <Tarja texto="DADO DECLARADO PELO CANDIDATO" entra={R(19) + 16} />
      </AbsoluteFill>
      <Rodape entra={R(19) + 10} extra={EXEMPLO} />
    </Cena>
  );
};

// ───────── C8 · cartela: filtrar antes de somar ─────────
const CenaLicao: React.FC<{ ini: number; dur: number }> = ({ ini, dur }) => {
  const f = useCurrentFrame();
  const R = (i: number) => t(i) - ini;
  const E = (i: number, s: string) => em(i, s) - ini;
  const a = entrar(f, R(21), DUR.cena, EASE.enfase);
  const b = entrar(f, E(21, "quem soma") - 2, DUR.cena, EASE.enfase);
  const preto = interpolate(f, [dur - 12, dur - 2], [0, 1], clamp);
  return (
    <Cena dur={dur} semSaida>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}>
        <div data-foco="autodeclarado tem erro" style={{ opacity: a, translate: `0 ${(1 - a) * 30}px`, fontFamily: fontes.titulo, fontWeight: 900, fontSize: 110, lineHeight: 1, color: c.claro, whiteSpace: "nowrap" }}>
          DADO AUTODECLARADO <span style={{ color: c.ambar }}>TEM ERRO</span>
        </div>
        <div style={{ width: 360 * b, height: 4, borderRadius: 2, backgroundColor: c.dinheiro }} />
        <div data-foco="filtrar antes de somar" style={{ opacity: b, translate: `0 ${(1 - b) * 24}px`, fontFamily: fontes.titulo, fontWeight: 800, fontSize: 72, letterSpacing: 2, color: c.dinheiro, whiteSpace: "nowrap" }}>
          FILTRAR ANTES DE SOMAR
        </div>
      </AbsoluteFill>
      {preto > 0 ? <AbsoluteFill data-pausa-ok style={{ backgroundColor: "#000", opacity: preto }} /> : null}
    </Cena>
  );
};

// Contorno de bug do KitSistema: o "selo recriação" fica preso à borda da janela e a auditoria acusa SOBREPOSTO
// com a própria tela. A sobreposição é proposital (selo colado na moldura), então marcamos o selo com data-sobrepor-ok.
const SeloOk: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    ref.current?.querySelectorAll('[data-foco="selo recriação"]').forEach((e) => e.setAttribute("data-sobrepor-ok", ""));
    // a barra lateral do kit traz "Ranking" (inglês); na tela fica "Classificação"
    ref.current?.querySelectorAll("div").forEach((e) => {
      const n = e.firstChild;
      if (e.childNodes.length === 1 && n && n.nodeType === 3 && n.nodeValue === "Ranking") n.nodeValue = "Classificação";
    });
  });
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0 }}>
      {children}
    </div>
  );
};

// ───────── C2b · a escala: totais do levantamento (tela recriada do sistema) ─────────
const CenaEscala: React.FC<{ ini: number; dur: number }> = ({ ini, dur }) => {
  const R = (i: number) => t(i) - ini;
  const E = (i: number, s: string) => em(i, s) - ini;
  return (
    <Cena dur={dur}>
      <SeloOk>
      <TelaSistema ativo="inicio" entra={R(2) - 2} trilha={["elosys", "Início"]} nota="totais do autor">
        <PainelResumo
          entra={E(2, "mais de cinco") - 12}
          itens={[
            { rotulo: "doações recebidas · 2018 a 2026", total: 5161222, unidade: "doações", dinheiro: 26.7, casas: 1 },
            { rotulo: "despesas contratadas · 2018 a 2026", total: 9471259, unidade: "despesas", dinheiro: 16.2, casas: 1 },
          ]}
          titulo="O dinheiro das campanhas, linha por linha"
          rotulo="prestações de contas · TSE · somadas pelo autor"
          destaque={1}
          destaqueEm={E(2, "nove milhões") - 4}
          durContagem={44}
        />
      </TelaSistema>
      </SeloOk>
      <Rodape entra={R(2) + 14} extra="NÚMEROS DO AUTOR · NÃO CONFERIDOS PELO CANAL" top={950} />
    </Cena>
  );
};

// ───────── C7b · cadastros de empresas punidas (CGU) · tela recriada ─────────
const CenaSancoes: React.FC<{ ini: number; dur: number }> = ({ ini, dur }) => {
  const f = useCurrentFrame();
  const R = (i: number) => t(i) - ini;
  const E = (i: number, s: string) => em(i, s) - ini;
  const lista = E(17, "quatrocentas") - 22;
  const intro = 1 - entrar(f, lista - 10, DUR.padrao);
  const cad = [
    { s: "CEIS", d: "empresas impedidas de contratar com o poder público", f: E(16, "impedidas") - 4 },
    { s: "CNEP", d: "empresas punidas por atos contra a administração", f: E(16, "punidas por atos") - 4 },
  ];
  const ressalva = entrar(f, R(18), DUR.padrao, EASE.enfase);
  return (
    <Cena dur={dur}>
      <SeloOk>
      <TelaSistema entra={R(16)} trilha={["Cruzamentos", "Sanções CGU"]} nota="nomes anonimizados">
        {f < lista ? (
          <div style={{ position: "absolute", inset: 0, opacity: intro, display: "flex", flexDirection: "column", gap: 26 }}>
            <div style={{ opacity: entrar(f, R(16) + 8, DUR.padrao), display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontFamily: fontes.mono, fontSize: 21, color: c.cinza, whiteSpace: "nowrap" }}>Portal da Transparência · Controladoria-Geral da União</div>
              <div style={{ fontFamily: fontes.texto, fontWeight: 600, fontSize: 46, color: c.claro, whiteSpace: "nowrap" }}>Cadastros oficiais de empresas punidas</div>
            </div>
            {cad.map((k) => {
              const p = entrar(f, k.f, DUR.padrao, EASE.enfase);
              return (
                <div key={k.s} data-foco={`cadastro ${k.s}`} style={{ opacity: p, translate: `${(1 - p) * 30}px 0`, display: "flex", alignItems: "center", gap: 26, padding: "26px 30px", borderRadius: 14, backgroundColor: c.painel, border: `1.5px solid ${c.fio}`, boxShadow: `inset 5px 0 0 ${c.ambar}` }}>
                  <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 44, color: c.ambar, whiteSpace: "nowrap" }}>{k.s}</div>
                  <div style={{ fontFamily: fontes.texto, fontWeight: 600, fontSize: 30, color: c.claro, whiteSpace: "nowrap" }}>{k.d}</div>
                </div>
              );
            })}
          </div>
        ) : null}
        {f >= lista ? <ListaSancoes entra={lista} tarjaEm={R(18) + 4} /> : null}
        <div style={{ position: "absolute", left: 0, top: 660, opacity: ressalva, translate: `${(1 - ressalva) * -24}px 0` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 22px", borderRadius: 10, border: `2px solid ${c.claro}`, backgroundColor: c.grafite, fontFamily: fontes.mono, fontWeight: 600, fontSize: 22, color: c.claro, whiteSpace: "nowrap" }}>
            A PUNIÇÃO JÁ VALIA NA DATA DA DOAÇÃO OU DO SERVIÇO? O CRUZAMENTO NÃO DIZ
          </div>
        </div>
      </TelaSistema>
      </SeloOk>
      <Rodape entra={R(16) + 14} extra={EXEMPLO} top={950} />
    </Cena>
  );
};

const cenas: { de: number; ate: number; C: React.FC<{ ini: number; dur: number }> }[] = [
  { de: 0, ate: corte(1), C: CenaFontes },
  { de: corte(1), ate: corte(2), C: CenaAtribuicao },
  { de: corte(2), ate: corte(3), C: CenaEscala },
  { de: corte(3), ate: corte(5), C: CenaCiclo },
  { de: corte(5), ate: corte(8), C: CenaFunil },
  { de: corte(8), ate: corte(13), C: CenaMediana },
  { de: corte(13), ate: corte(16), C: CenaSocio },
  { de: corte(16), ate: corte(19), C: CenaSancoes },
  { de: corte(19), ate: corte(21), C: CenaErro },
  { de: corte(21), ate: DURACAO_12, C: CenaLicao },
];

// trilha "rede" com silêncio de SIL frames antes de cada impacto
const TRECHOS: [number, number][] = [
  [0, RV1 - SIL],
  [RV1, RV2 - SIL],
  [RV2, RV3 - SIL],
  [RV3, DURACAO_12],
];
const Entrada: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 12], [1, 0], clamp);
  return o > 0 ? <AbsoluteFill data-pausa-ok style={{ backgroundColor: "#000", opacity: o }} /> : null;
};

export const Bloco12: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: c.grafite }}>
    <Quadro />
    {cenas.map(({ de, ate, C: Cn }, k) => (
      <Sequence key={k} from={de} durationInFrames={ate - de}>
        <Cn ini={de} dur={ate - de} />
      </Sequence>
    ))}
    <Clarao em={[RV1, RV2, RV3]} cor={c.ambar} forca={0.22} />
    <Pelicula />
    <Entrada />
    <Legenda cues={C} ocultar={[[0, DURACAO_12]]} />
    <Audio src={staticFile("audio/12.mp3")} />
    {TRECHOS.map(([de, ate], i) => (
      <Trilha key={i} arquivo="sfx/rede.mp3" de={de} ate={ate} volume={0.24 + i * 0.02} fade={i === 0 ? 30 : 5} />
    ))}
    {/* C1 · fontes */}
    <Efeito arquivo="sfx/tecla-painel.mp3" em={em(0, "programador")} volume={0.3} duracao={20} />
    {["como candidaturas", "bens declarados", "prestações de contas", "quadro de sócios"].map((s) => (
      <Efeito key={s} arquivo="sfx/pulso-dado.mp3" em={em(0, s)} volume={0.35} duracao={25} />
    ))}
    <Efeito arquivo="sfx/clique.mp3" em={em(0, "num vídeo")} volume={0.3} duracao={10} />
    {/* C2 · atribuição */}
    <Efeito arquivo="sfx/whoosh.mp3" em={corte(1) - 5} volume={0.3} duracao={15} />
    <Efeito arquivo="sfx/papel-deslizar.mp3" em={t(1) - 2} volume={0.35} duracao={25} />
    {["não foram conferidos", "indícios", "não constituem"].map((s) => (
      <Efeito key={s} arquivo="sfx/clique.mp3" em={em(1, s)} volume={0.3} duracao={10} />
    ))}
    {/* C2b · escala */}
    <Efeito arquivo="sfx/whoosh.mp3" em={corte(2) - 5} volume={0.3} duracao={15} />
    <Efeito arquivo="sfx/subida.mp3" em={em(2, "mais de cinco")} volume={0.25} duracao={44} />
    <Efeito arquivo="sfx/moedas.mp3" em={em(2, "vinte e seis")} volume={0.22} duracao={40} />
    <Efeito arquivo="sfx/clique.mp3" em={em(2, "nove milhões")} volume={0.3} duracao={10} />
    {/* C3 · ciclo */}
    <Efeito arquivo="sfx/whoosh.mp3" em={corte(3) - 5} volume={0.3} duracao={15} />
    {["quem doa", "quem fornece", "voltam ao ponto"].map((s) => (
      <Efeito key={s} arquivo="sfx/pulso-dado.mp3" em={em(4, s) + 14} volume={0.4} duracao={25} />
    ))}
    {/* C4 · funil + revelação 1 */}
    <Efeito arquivo="sfx/whoosh.mp3" em={corte(5) - 5} volume={0.3} duracao={15} />
    <Efeito arquivo="sfx/subida.mp3" em={em(5, "cento e oito")} volume={0.25} duracao={40} />
    <Efeito arquivo="sfx/trava-cofre.mp3" em={em(6, "mais de dez mil") + 4} volume={0.35} duracao={20} />
    <Efeito arquivo="sfx/riser.mp3" em={RV1 - SIL - 45} volume={0.3} duracao={45} />
    <Efeito arquivo="sfx/impacto.mp3" em={RV1} volume={0.45} duracao={40} />
    <Efeito arquivo="sfx/clique.mp3" em={t(7)} volume={0.35} duracao={10} />
    <Efeito arquivo="sfx/clique.mp3" em={em(7, "coligações")} volume={0.3} duracao={10} />
    <Efeito arquivo="sfx/clique.mp3" em={em(7, "ressarcimentos")} volume={0.3} duracao={10} />
    {/* C5 · mediana + revelação 2 */}
    <Efeito arquivo="sfx/whoosh.mp3" em={corte(8) - 5} volume={0.3} duracao={15} />
    <Efeito arquivo="sfx/moedas.mp3" em={t(9)} volume={0.25} duracao={45} />
    <Efeito arquivo="sfx/lapis-marca.mp3" em={em(9, "mediana histórica")} volume={0.3} duracao={20} />
    <Efeito arquivo="sfx/pulso-dado.mp3" em={em(9, "quinze vezes")} volume={0.35} duracao={25} />
    <Efeito arquivo="sfx/subida.mp3" em={em(10, "vinte e oito")} volume={0.25} duracao={36} />
    <Efeito arquivo="sfx/riser.mp3" em={RV2 - SIL - 45} volume={0.28} duracao={45} />
    <Efeito arquivo="sfx/impacto.mp3" em={RV2} volume={0.4} duracao={40} />
    <Efeito arquivo="sfx/clique.mp3" em={em(12, "exagero")} volume={0.3} duracao={10} />
    <Efeito arquivo="sfx/clique.mp3" em={em(12, "compra muito grande")} volume={0.3} duracao={10} />
    {/* C6 · sócio + revelação 3 */}
    <Efeito arquivo="sfx/whoosh.mp3" em={corte(13) - 5} volume={0.3} duracao={15} />
    <Efeito arquivo="sfx/pulso-dado.mp3" em={em(13, "também é sócio")} volume={0.35} duracao={25} />
    <Efeito arquivo="sfx/subida.mp3" em={em(14, "quinhentos")} volume={0.25} duracao={30} />
    <Efeito arquivo="sfx/riser.mp3" em={RV3 - SIL - 45} volume={0.28} duracao={45} />
    <Efeito arquivo="sfx/impacto.mp3" em={RV3} volume={0.4} duracao={40} />
    <Efeito arquivo="sfx/tecla-painel.mp3" em={t(15)} volume={0.3} duracao={20} />
    {/* C7b · sanções */}
    <Efeito arquivo="sfx/whoosh.mp3" em={corte(16) - 5} volume={0.3} duracao={15} />
    <Efeito arquivo="sfx/clique.mp3" em={em(16, "impedidas") - 4} volume={0.3} duracao={10} />
    <Efeito arquivo="sfx/clique.mp3" em={em(16, "punidas por atos") - 4} volume={0.3} duracao={10} />
    <Efeito arquivo="sfx/subida.mp3" em={em(17, "quatrocentas") - 14} volume={0.25} duracao={40} />
    <Efeito arquivo="sfx/pulso-dado.mp3" em={em(17, "quatrocentas") + 8} volume={0.35} duracao={25} />
    <Efeito arquivo="sfx/carimbo.mp3" em={t(18) + 4} volume={0.3} duracao={20} />
    {/* C7 · erro de digitação */}
    <Efeito arquivo="sfx/whoosh.mp3" em={corte(19) - 5} volume={0.3} duracao={15} />
    <Efeito arquivo="sfx/tecla-painel.mp3" em={em(20, "doze bilhões") - 10} volume={0.4} duracao={20} />
    <Efeito arquivo="sfx/impacto.mp3" em={em(20, "doze bilhões") + 8} volume={0.22} duracao={30} />
    <Efeito arquivo="sfx/carimbo.mp3" em={em(20, "erro de digitação")} volume={0.35} duracao={20} />
    {/* C8 · lição */}
    <Efeito arquivo="sfx/whoosh.mp3" em={corte(21) - 5} volume={0.3} duracao={15} />
  </AbsoluteFill>
);
