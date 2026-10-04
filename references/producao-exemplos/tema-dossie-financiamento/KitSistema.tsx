import { interpolate, useCurrentFrame } from "remotion";
import { c, fontes } from "../tema";
import { Tarja } from "./KitDossie";
import { DUR, EASE, entrar, escalonar } from "./Movimento";

// KIT SISTEMA — recriação das telas de um painel de dados eleitorais (referência visual: sistema elosys, de YuriRDev).
// Tudo redesenhado do zero no tema do canal (grafite, verde-dinheiro, âmbar); nenhum código/CSS/texto do original.
// Regras (ref. 18 da skill): sem zoom de tela; só translate/opacity; curvas EASE; escalonamento total ≤ 15 frames.
// Nada de nome real de pessoa/empresa nem foto: rótulos genéricos ("Campanha A", "Fornecedor 3") e CNPJ mascarado.
// Frames RELATIVOS da cena (entra, f…).

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const num = (v: number, casas = 0) => v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
export const CNPJ_MASCARADO = "••.•••.•••/0001-••";
export const SELO_SISTEMA = "RECRIAÇÃO · baseada no sistema elosys (YuriRDev)";

// Paleta da tela: o "dark dashboard" do sistema traduzido para o tema do canal.
const t = {
  fundo: "#0B0E11",
  lateral: "#0F1317",
  cartao: c.painel,
  hover: c.branco,
  borda: "#252D36",
  borda2: c.fio,
  texto: c.claro,
  texto2: "#C9D1DA",
  mudo: c.cinza,
  mudo2: "#6B7785",
  marca: c.dinheiro,
  marcaTinta: "rgba(47,208,138,0.12)",
  alerta: c.ambar,
  alertaTinta: "rgba(255,176,32,0.14)",
};

// Área útil do conteúdo dentro da TelaSistema (para posicionar filhos com coordenadas absolutas).
export const JANELA = { x: 70, y: 56, w: 1780, h: 864 };
const LATERAL = 330;
const TOPO = 78;
const PAD_X = 44;
const PAD_Y = 34;
export const CONTEUDO = { w: JANELA.w - LATERAL - PAD_X * 2, h: JANELA.h - TOPO - PAD_Y * 2 };

// ───────────────── peças pequenas ─────────────────
const Selo: React.FC<{ texto: string; cor?: string }> = ({ texto, cor = t.mudo }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 12px", borderRadius: 7, border: `1.5px solid ${cor}66`, fontFamily: fontes.mono, fontSize: 19, color: cor, whiteSpace: "nowrap" }}>{texto}</span>
);
const Pilula: React.FC<{ texto: string; ativo?: boolean }> = ({ texto, ativo }) => (
  <span style={{ padding: "7px 18px", borderRadius: 9, border: `1.5px solid ${ativo ? t.marca : t.borda2}`, backgroundColor: ativo ? t.marcaTinta : "transparent", fontFamily: fontes.texto, fontWeight: 500, fontSize: 20, color: ativo ? t.marca : t.texto2, whiteSpace: "nowrap" }}>{texto}</span>
);
const Rotulo: React.FC<{ children: React.ReactNode; estilo?: React.CSSProperties }> = ({ children, estilo }) => (
  <div style={{ fontFamily: fontes.texto, fontWeight: 500, fontSize: 19, color: t.mudo2, whiteSpace: "nowrap", ...estilo }}>{children}</div>
);
// Ícone de fonte (alvo): círculo com ponto, desenhado aqui.
const IconeFonte: React.FC<{ tam?: number; cor?: string }> = ({ tam = 26, cor = t.mudo }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" fill="none" stroke={cor} strokeWidth="2" />
    <circle cx="12" cy="12" r="3.2" fill={cor} />
  </svg>
);
const Lupa: React.FC<{ cor?: string }> = ({ cor = t.mudo }) => (
  <svg width={24} height={24} viewBox="0 0 24 24">
    <circle cx="10.5" cy="10.5" r="6.5" stroke={cor} strokeWidth="2.2" fill="none" />
    <path d="M15.5 15.5l5 5" stroke={cor} strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
const Ponteiro: React.FC = () => (
  <svg width={34} height={40} viewBox="0 0 17 20" style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.7))" }}>
    <path d="M1 1v15l4-3.6 2.8 6 2.6-1.2-2.8-5.9H13z" fill={c.claro} stroke={c.grafite} strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

// ───────────────── TelaSistema (moldura do aplicativo) ─────────────────
// Barra lateral (marca, Início, Ranking, Grafo, grupo Sinais), barra superior com trilha, busca e botão "fonte" (modo
// análise), área de conteúdo com os filhos. Selo de recriação preso à borda superior da janela.
export type ItemSistema = "inicio" | "ranking" | "grafo" | "doacao" | "despesa" | "socio";
const NAV: { id: ItemSistema; rotulo: string }[] = [
  { id: "inicio", rotulo: "Início" },
  { id: "ranking", rotulo: "Ranking" },
  { id: "grafo", rotulo: "Grafo de ligações" },
];
const SINAIS: { id: ItemSistema; rotulo: string }[] = [
  { id: "doacao", rotulo: "Doação circular" },
  { id: "despesa", rotulo: "Despesa desproporcional" },
  { id: "socio", rotulo: "Sócio-fornecedor" },
];
export const TelaSistema: React.FC<{
  ativo?: ItemSistema;
  entra?: number;
  trilha?: [string, string];
  busca?: string;
  buscaEm?: number;
  modoFonteEm?: number;
  nota?: string;
  children?: React.ReactNode;
}> = ({ ativo, entra = 0, trilha = ["elosys", "Início"], busca, buscaEm, modoFonteEm, nota, children }) => {
  const f = useCurrentFrame();
  const a = entrar(f, entra, DUR.cena, EASE.enfase);
  const s = entrar(f, entra + 8, DUR.padrao, EASE.enfase);
  const fonteAtiva = modoFonteEm !== undefined && f >= modoFonteEm;
  const nBusca = busca ? Math.round(busca.length * interpolate(f, [buscaEm ?? entra + 14, (buscaEm ?? entra + 14) + busca.length * 1.6], [0, 1], clamp)) : 0;
  const item = (it: { id: ItemSistema; rotulo: string }, i: number, base: number) => {
    const on = it.id === ativo;
    const p = entrar(f, entra + 6 + escalonar(i + base, 6, 2), DUR.pequeno);
    return (
      <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 12, height: 50, padding: "0 16px", borderRadius: 9, opacity: p, translate: `${(1 - p) * -14}px 0`, backgroundColor: on ? t.marcaTinta : "transparent", boxShadow: on ? `inset 3px 0 0 ${t.marca}` : "none", fontFamily: fontes.texto, fontWeight: on ? 600 : 500, fontSize: 22, color: on ? t.texto : t.mudo, whiteSpace: "nowrap" }}>
        {it.rotulo}
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        data-foco={`tela do sistema: ${trilha.join(" / ")}`}
        style={{ position: "absolute", left: JANELA.x, top: JANELA.y, width: JANELA.w, height: JANELA.h, opacity: a, translate: `0 ${(1 - a) * 36}px`, borderRadius: 18, overflow: "hidden", backgroundColor: t.fundo, border: `1.5px solid ${t.borda}`, boxShadow: "0 30px 70px rgba(0,0,0,0.6)", display: "flex" }}
      >
        {/* barra lateral */}
        <div style={{ width: LATERAL, flex: "none", backgroundColor: t.lateral, borderRight: `1.5px solid ${t.borda}`, padding: "22px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 8px 22px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: t.marca, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontes.texto, fontWeight: 800, fontSize: 24, color: c.grafite }}>
              <svg width={26} height={26} viewBox="0 0 24 24"><circle cx="6" cy="6" r="3" fill={c.grafite} /><circle cx="18" cy="9" r="3" fill={c.grafite} /><circle cx="10" cy="18" r="3" fill={c.grafite} /><path d="M6 6L18 9L10 18Z" stroke={c.grafite} strokeWidth="1.6" fill="none" /></svg>
            </div>
            <div style={{ fontFamily: fontes.texto, fontWeight: 600, fontSize: 26, color: t.texto }}>elosys</div>
            <div style={{ marginLeft: "auto", width: 40, height: 40, borderRadius: 9, border: `1.5px solid ${t.borda2}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lupa />
            </div>
          </div>
          {NAV.map((it, i) => item(it, i, 0))}
          <Rotulo estilo={{ padding: "26px 16px 8px" }}>Sinais</Rotulo>
          {SINAIS.map((it, i) => item(it, i, NAV.length))}
          <div style={{ marginTop: "auto", padding: "14px 16px", borderRadius: 10, border: `1.5px dashed ${t.borda2}`, fontFamily: fontes.texto, fontSize: 18, lineHeight: 1.35, color: t.mudo }}>indício não é prova: cada dado leva à fonte oficial</div>
        </div>
        {/* coluna principal */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ height: TOPO, flex: "none", display: "flex", alignItems: "center", gap: 14, padding: `0 ${PAD_X}px`, borderBottom: `1.5px solid ${t.borda}` }}>
            <span style={{ fontFamily: fontes.texto, fontSize: 22, color: t.mudo2, whiteSpace: "nowrap" }}>{trilha[0]}</span>
            <span style={{ fontFamily: fontes.texto, fontSize: 22, color: t.borda2 }}>/</span>
            <span style={{ fontFamily: fontes.texto, fontWeight: 600, fontSize: 22, color: t.texto, whiteSpace: "nowrap" }}>{trilha[1]}</span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12, width: 470, height: 48, padding: "0 16px", borderRadius: 10, backgroundColor: t.cartao, border: `1.5px solid ${busca && nBusca > 0 ? t.marca + "88" : t.borda}` }}>
              <Lupa />
              <span style={{ fontFamily: busca && nBusca > 0 ? fontes.mono : fontes.texto, fontSize: 20, color: busca && nBusca > 0 ? t.texto : t.mudo2, whiteSpace: "nowrap", overflow: "hidden" }}>
                {busca && nBusca > 0 ? busca.slice(0, nBusca) : "buscar nome, CPF ou CNPJ…"}
              </span>
              <span style={{ marginLeft: "auto", fontFamily: fontes.mono, fontSize: 16, color: t.mudo2, padding: "2px 8px", borderRadius: 6, border: `1px solid ${t.borda2}` }}>Ctrl K</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, height: 48, padding: "0 18px", borderRadius: 10, border: `1.5px solid ${fonteAtiva ? t.marca : t.borda2}`, backgroundColor: fonteAtiva ? t.marcaTinta : "transparent", fontFamily: fontes.texto, fontWeight: 600, fontSize: 20, color: fonteAtiva ? t.marca : t.texto2, whiteSpace: "nowrap" }}>
              <IconeFonte tam={22} cor={fonteAtiva ? t.marca : t.texto2} />
              fonte
            </div>
          </div>
          <div style={{ position: "relative", flex: 1, padding: `${PAD_Y}px ${PAD_X}px`, overflow: "hidden" }}>
            <div style={{ position: "relative", width: CONTEUDO.w, height: CONTEUDO.h }}>{children}</div>
          </div>
        </div>
      </div>
      {/* selo de recriação */}
      <div data-foco="selo recriação" data-sobrepor-ok style={{ position: "absolute", right: 1920 - JANELA.x - JANELA.w + 30, top: JANELA.y - 24, opacity: s, translate: `${(1 - s) * 24}px 0`, display: "flex", alignItems: "center", gap: 12, padding: "7px 18px", borderRadius: 9, backgroundColor: c.grafite, border: `2px solid ${c.ambar}`, fontFamily: fontes.mono, fontWeight: 600, fontSize: 20, color: c.ambar, whiteSpace: "nowrap" }}>
        {SELO_SISTEMA}
        {nota ? <span style={{ fontWeight: 400, color: c.cinza }}>{`· ${nota}`}</span> : null}
      </div>
    </div>
  );
};

// Cabeçalho de página dentro do sistema (rótulo mono, título, texto curto).
const CabecalhoPagina: React.FC<{ entra: number; rotulo?: string; titulo: string; texto?: string }> = ({ entra, rotulo, titulo, texto }) => {
  const f = useCurrentFrame();
  const p = entrar(f, entra, DUR.padrao, EASE.enfase);
  return (
    <div style={{ opacity: p, translate: `0 ${(1 - p) * 20}px` }}>
      {rotulo ? <div style={{ fontFamily: fontes.mono, fontSize: 19, color: t.mudo, marginBottom: 10, whiteSpace: "nowrap" }}>{rotulo}</div> : null}
      <div style={{ fontFamily: fontes.texto, fontWeight: 600, fontSize: 46, lineHeight: 1.1, letterSpacing: -0.5, color: t.texto, whiteSpace: "nowrap" }}>{titulo}</div>
      {texto ? <div style={{ marginTop: 12, maxWidth: 1100, fontFamily: fontes.texto, fontSize: 22, lineHeight: 1.4, color: t.mudo }}>{texto}</div> : null}
    </div>
  );
};

// ───────────────── PainelResumo (início: cartões de totais) ─────────────────
// Cabeçalho da página inicial + grade 2×2 de cartões. Cada número conta de 0 até o total; a linha de dinheiro conta junto.
export type ItemResumo = { rotulo: string; total: number; unidade: string; dinheiro?: number; casas?: number };
export const RESUMO_PADRAO: ItemResumo[] = [
  { rotulo: "doações recebidas", total: 5161222, unidade: "doações", dinheiro: 26.7, casas: 1 },
  { rotulo: "despesas contratadas", total: 9471259, unidade: "despesas", dinheiro: 16.2, casas: 1 },
  { rotulo: "pagamentos feitos", total: 10890868, unidade: "pagamentos", dinheiro: 18.85, casas: 2 },
  { rotulo: "CNPJs de campanha", total: 1044812, unidade: "inscrições" },
];
export const PainelResumo: React.FC<{ entra?: number; itens?: ItemResumo[]; titulo?: string; rotulo?: string; destaque?: number; destaqueEm?: number; durContagem?: number }> = ({
  entra = 0,
  itens = RESUMO_PADRAO,
  titulo = "O dinheiro das campanhas, linha por linha",
  rotulo = "dados públicos · prestação de contas · TSE",
  destaque,
  destaqueEm = 0,
  durContagem = 40,
}) => {
  const f = useCurrentFrame();
  return (
    <div data-foco="painel de totais" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", gap: 34 }}>
      <CabecalhoPagina entra={entra} rotulo={rotulo} titulo={titulo} texto="Cada número é a soma direta dos arquivos oficiais, com a fonte exposta em cada campo." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {itens.map((it, i) => {
          const fi = entra + 8 + escalonar(i, itens.length, 3);
          const p = entrar(f, fi, DUR.padrao, EASE.enfase);
          const k = interpolate(f, [fi + 4, fi + 4 + durContagem], [0, 1], { ...clamp, easing: EASE.padrao });
          const ac = destaque === i && f >= destaqueEm;
          const apaga = destaque !== undefined && destaque !== i && f >= destaqueEm ? 1 - 0.5 * entrar(f, destaqueEm, DUR.padrao) : 1;
          return (
            <div key={i} data-foco={`total: ${it.rotulo}`} style={{ height: 236, padding: "30px 34px", borderRadius: 14, backgroundColor: t.cartao, border: `1.5px solid ${ac ? t.alerta : t.borda}`, boxShadow: ac ? `0 0 0 4px ${t.alertaTinta}` : "none", opacity: p * apaga, translate: `0 ${(1 - p) * 24}px`, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Rotulo estilo={{ fontSize: 22, color: t.mudo }}>{it.rotulo}</Rotulo>
                <div style={{ marginLeft: "auto" }}>
                  <IconeFonte tam={24} cor={t.mudo2} />
                </div>
              </div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 14 }}>
                <span style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 72, letterSpacing: -1, color: ac ? t.alerta : t.texto, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{num(Math.round(it.total * k))}</span>
                <span style={{ fontFamily: fontes.texto, fontSize: 22, color: t.mudo, whiteSpace: "nowrap" }}>{it.unidade}</span>
              </div>
              {it.dinheiro !== undefined ? (
                <div style={{ marginTop: "auto", fontFamily: fontes.mono, fontWeight: 600, fontSize: 32, color: t.marca, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{`R$ ${num(it.dinheiro * k, it.casas ?? 1)} bi`}</div>
              ) : (
                <div style={{ marginTop: "auto", fontFamily: fontes.texto, fontSize: 20, color: t.mudo2, whiteSpace: "nowrap" }}>um CNPJ por candidatura registrada</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───────────────── TabelaSinais (lista de sinais) ─────────────────
// Cabeçalho da página de sinais, linha de resumo mono, filtros e cartões de sinal com a severidade na barra esquerda.
// Linhas entram escalonadas; a linha `acende` fica em âmbar a partir de `acendeEm` e as outras esmaecem.
export type Sinal = { tipo: string; severidade: "alta" | "média"; nome: string; doc?: string; valor: string; detalhe?: string };
export const SINAIS_PADRAO: Sinal[] = [
  { tipo: "doação circular", severidade: "alta", nome: "Campanha A", doc: "3 nós", valor: "R$ 48.000,00", detalhe: "volta à mesma cadeia" },
  { tipo: "sócio-fornecedor", severidade: "alta", nome: "Fornecedor 3", doc: CNPJ_MASCARADO, valor: "R$ 112.500,00", detalhe: "sócio é candidato" },
  { tipo: "despesa desproporcional", severidade: "média", nome: "Campanha B", doc: "adesivos", valor: "R$ 61.000,00", detalhe: "× 9 a mediana" },
  { tipo: "doação circular", severidade: "média", nome: "Campanha C", doc: "4 nós", valor: "R$ 15.300,00", detalhe: "volta à mesma cadeia" },
  { tipo: "sócio-fornecedor", severidade: "média", nome: "Fornecedor 7", doc: CNPJ_MASCARADO, valor: "R$ 27.840,00", detalhe: "paga por outra campanha" },
];
export const TabelaSinais: React.FC<{ entra?: number; sinais?: Sinal[]; acende?: number; acendeEm?: number; titulo?: string; texto?: string }> = ({
  entra = 0,
  sinais = SINAIS_PADRAO,
  acende,
  acendeEm = 0,
  titulo = "Sinais encontrados no cruzamento",
  texto = "Movimentações estatisticamente incomuns. Indício, não prova: cada linha pede conferência manual.",
}) => {
  const f = useCurrentFrame();
  const altas = sinais.filter((s) => s.severidade === "alta").length;
  const pf = entrar(f, entra + 6, DUR.padrao);
  return (
    <div data-foco="tabela de sinais" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", gap: 20 }}>
      <CabecalhoPagina entra={entra} titulo={titulo} texto={texto} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: pf }}>
        <span style={{ fontFamily: fontes.mono, fontSize: 20, color: t.mudo, whiteSpace: "nowrap", marginRight: 14 }}>
          <span style={{ color: t.texto }}>{sinais.length}</span> sinais · <span style={{ color: t.alerta }}>{altas}</span> alta · {sinais.length - altas} média
        </span>
        <Pilula texto="todos" ativo />
        <Pilula texto="alta" />
        <Pilula texto="média" />
        <div style={{ width: 1.5, height: 30, backgroundColor: t.borda2, margin: "0 8px" }} />
        <Rotulo>ordenar por</Rotulo>
        <Pilula texto="severidade" ativo />
        <Pilula texto="valor" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sinais.map((s, i) => {
          const p = entrar(f, entra + 12 + escalonar(i, sinais.length, 3), DUR.padrao, EASE.enfase);
          const ac = acende === i && f >= acendeEm;
          const kac = ac ? entrar(f, acendeEm, DUR.padrao) : 0;
          const apaga = acende !== undefined && acende !== i && f >= acendeEm ? 1 - 0.55 * entrar(f, acendeEm, DUR.padrao) : 1;
          const barra = s.severidade === "alta" ? t.alerta : t.mudo2;
          return (
            <div
              key={i}
              data-foco={`sinal: ${s.tipo} · ${s.nome}`}
              style={{ position: "relative", height: 98, display: "flex", alignItems: "center", gap: 28, padding: "0 30px 0 32px", borderRadius: 11, backgroundColor: t.cartao, border: `1.5px solid ${t.borda}`, boxShadow: `inset 4px 0 0 ${barra}`, opacity: p * apaga, translate: `${(1 - p) * 40}px 0` }}
            >
              <div style={{ position: "absolute", inset: -1.5, borderRadius: 11, border: `2px solid ${t.alerta}`, backgroundColor: t.alertaTinta, opacity: kac }} />
              <div style={{ position: "relative", width: 300, flex: "none", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                <Selo texto={`severidade ${s.severidade}`} cor={s.severidade === "alta" ? t.alerta : t.mudo} />
                <span style={{ fontFamily: fontes.mono, fontSize: 19, color: t.mudo, whiteSpace: "nowrap" }}>{s.tipo}</span>
              </div>
              <div style={{ position: "relative", flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                  <span style={{ fontFamily: fontes.texto, fontWeight: 600, fontSize: 29, color: ac ? t.alerta : t.texto, whiteSpace: "nowrap" }}>{s.nome}</span>
                  {s.doc ? <span style={{ fontFamily: fontes.mono, fontSize: 21, color: t.mudo2, whiteSpace: "nowrap" }}>{s.doc}</span> : null}
                </div>
                {s.detalhe ? <span style={{ fontFamily: fontes.texto, fontSize: 20, color: t.mudo, whiteSpace: "nowrap" }}>{s.detalhe}</span> : null}
              </div>
              <span style={{ position: "relative", flex: "none", textAlign: "right", fontFamily: fontes.mono, fontWeight: 600, fontSize: 30, color: ac ? t.alerta : t.texto, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{s.valor}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───────────────── GrafoCiclo (tela do grafo de ciclo) ─────────────────
// Cartão com nós circulares dispostos em anel, setas curvas com o valor e, em `cicloEm`, o ciclo acende em âmbar aresta
// por aresta (dinheiro que volta à origem); bolinhas correm pelo anel. Faixa inferior com severidade, rótulo e total.
export type NoCiclo = { rotulo: string; tipo: "candidato" | "empresa" | "pessoa" | "partido" };
const corNo = (tp: NoCiclo["tipo"]) => (tp === "empresa" ? "#7FA7FF" : tp === "partido" ? c.dinheiro : tp === "pessoa" ? c.cinza : c.claro);
const nomeTipo = { candidato: "candidatura", empresa: "empresa", pessoa: "pessoa física", partido: "partido" } as const;
const GlifoNo: React.FC<{ tipo: NoCiclo["tipo"]; cor: string; ciclo: boolean }> = ({ tipo, cor, ciclo }) => {
  if (ciclo)
    return (
      <svg width={40} height={40} viewBox="0 0 24 24">
        <path d="M19 12a7 7 0 1 1-2.05-4.95" fill="none" stroke={c.ambar} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M19.5 3.5v4.5H15" fill="none" stroke={c.ambar} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (tipo === "empresa")
    return (
      <svg width={36} height={36} viewBox="0 0 24 24">
        <path d="M4 20V9l5 2.5V9l5 2.5V5h6v15z" fill={cor} />
      </svg>
    );
  if (tipo === "partido")
    return (
      <svg width={36} height={36} viewBox="0 0 24 24">
        <path d="M4 10l8-5 8 5zM6 11h2.5v7H6zm4.75 0h2.5v7h-2.5zM15.5 11H18v7h-2.5zM4 19h16v2H4z" fill={cor} />
      </svg>
    );
  return (
    <svg width={36} height={36} viewBox="0 0 24 24">
      <circle cx="12" cy="8.5" r="4" fill={cor} />
      <path d="M4.5 20.5c0-4.4 3.4-7 7.5-7s7.5 2.6 7.5 7z" fill={cor} />
    </svg>
  );
};
export const CICLO_PADRAO: NoCiclo[] = [
  { rotulo: "Campanha A", tipo: "candidato" },
  { rotulo: "Diretório X", tipo: "partido" },
  { rotulo: "Campanha B", tipo: "candidato" },
  { rotulo: "Fornecedor 3", tipo: "empresa" },
];
export const GrafoCiclo: React.FC<{ entra?: number; nos?: NoCiclo[]; valores?: string[]; cicloEm?: number; total?: string; severidade?: "alta" | "média"; raio?: [number, number] }> = ({
  entra = 0,
  nos = CICLO_PADRAO,
  valores = ["R$ 50 mil", "R$ 32 mil", "R$ 18 mil", "R$ 9,6 mil"],
  cicloEm = 70,
  total = "R$ 109.600,00",
  severidade = "alta",
  raio = [370, 200],
}) => {
  const f = useCurrentFrame();
  const W = CONTEUDO.w;
  const H = CONTEUDO.h;
  const cx = W / 2;
  const cy = 300;
  const n = nos.length;
  const R = 46;
  const pos = nos.map((_, i) => {
    const ang = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return { x: cx + raio[0] * Math.cos(ang), y: cy + raio[1] * Math.sin(ang) };
  });
  const a = entrar(f, entra, DUR.cena, EASE.enfase);
  const noF = (i: number) => entra + 6 + escalonar(i, n, 3);
  const arF = (i: number) => entra + 22 + escalonar(i, n, 3);
  const acF = (i: number) => cicloEm + escalonar(i, n, 3);
  const pr = entrar(f, entra + 4, DUR.padrao);
  return (
    <div data-foco="grafo de ciclo" style={{ position: "absolute", inset: 0, opacity: a, translate: `0 ${(1 - a) * 24}px`, borderRadius: 16, backgroundColor: t.cartao, border: `1.5px solid ${t.borda}`, overflow: "hidden" }}>
      {/* grade de fundo do canvas */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="grade-grafo" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1.3" fill={t.borda2} />
          </pattern>
          <marker id="ponta-grafo" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0L10 5L0 10z" fill={t.mudo} />
          </marker>
          <marker id="ponta-ciclo" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0L10 5L0 10z" fill={c.ambar} />
          </marker>
        </defs>
        <rect width={W} height={H} fill="url(#grade-grafo)" opacity={0.7} />
        {nos.map((_, i) => {
          const A = pos[i];
          const B = pos[(i + 1) % n];
          const dx = B.x - A.x;
          const dy = B.y - A.y;
          const L = Math.hypot(dx, dy);
          const ux = dx / L;
          const uy = dy / L;
          // controle empurrado para fora do centro (arco do anel)
          const mx0 = (A.x + B.x) / 2;
          const my0 = (A.y + B.y) / 2;
          const ox = mx0 - cx;
          const oy = my0 - cy;
          const ol = Math.hypot(ox, oy) || 1;
          const bojo = L * 0.22;
          const mx = mx0 + (ox / ol) * bojo;
          const my = my0 + (oy / ol) * bojo;
          const x1 = A.x + ux * (R + 14);
          const y1 = A.y + uy * (R + 14);
          const x2 = B.x - ux * (R + 14);
          const y2 = B.y - uy * (R + 14);
          const d = `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
          const comp = L * 1.15;
          const p = entrar(f, arF(i), 16, EASE.padrao);
          const k = entrar(f, acF(i), DUR.padrao);
          const on = k > 0.5;
          const lx = 0.25 * x1 + 0.5 * mx + 0.25 * x2;
          const ly = 0.25 * y1 + 0.5 * my + 0.25 * y2;
          const ex = lx;
          const ey = ly;
          const v = valores[i] ?? "";
          const vw = v.length * 12.5 + 26;
          const bolas =
            f >= acF(i) + DUR.padrao
              ? [0, 1].map((j) => {
                  const q = ((((f - acF(i)) / 45 + j / 2) % 1) + 1) % 1;
                  const bx = (1 - q) * (1 - q) * x1 + 2 * (1 - q) * q * mx + q * q * x2;
                  const by = (1 - q) * (1 - q) * y1 + 2 * (1 - q) * q * my + q * q * y2;
                  return <circle key={j} cx={bx} cy={by} r={5.5} fill={c.ambar} style={{ filter: "drop-shadow(0 0 6px rgba(255,176,32,0.9))" }} />;
                })
              : null;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={t.mudo} strokeOpacity={0.75} strokeWidth={2.4} strokeDasharray={comp} strokeDashoffset={comp * (1 - p)} markerEnd={p > 0.95 && !on ? "url(#ponta-grafo)" : undefined} />
              <path d={d} fill="none" stroke={c.ambar} strokeWidth={4} opacity={k} markerEnd={on ? "url(#ponta-ciclo)" : undefined} />
              {bolas}
              {v ? (
                <g opacity={entrar(f, arF(i) + 10, DUR.pequeno)}>
                  <rect x={ex - vw / 2} y={ey - 19} width={vw} height={38} rx={8} fill={t.fundo} stroke={on ? c.ambar : t.borda2} strokeWidth={1.5} />
                  <text x={ex} y={ey + 7} textAnchor="middle" fontFamily={fontes.mono} fontWeight={600} fontSize={20} fill={on ? c.ambar : t.texto2}>
                    {v}
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
      {nos.map((no, i) => {
        const p = entrar(f, noF(i), DUR.padrao, EASE.enfase);
        const k = entrar(f, acF(i), DUR.padrao);
        const cor = corNo(no.tipo);
        const P = pos[i];
        return (
          <div key={i} data-foco={`nó: ${no.rotulo}`} style={{ position: "absolute", left: P.x - 130, top: P.y - R, width: 260, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: p, translate: `0 ${(1 - p) * 18}px` }}>
            <div style={{ position: "relative", width: R * 2, height: R * 2 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: R, backgroundColor: c.branco, border: `3px solid ${cor}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,0.5)" }}>
                <GlifoNo tipo={no.tipo} cor={cor} ciclo={false} />
              </div>
              <div style={{ position: "absolute", inset: 0, borderRadius: R, backgroundColor: c.branco, border: `3.5px solid ${c.ambar}`, boxShadow: "0 0 0 6px rgba(255,176,32,0.22), 0 0 26px rgba(255,176,32,0.55)", display: "flex", alignItems: "center", justifyContent: "center", opacity: k }}>
                <GlifoNo tipo={no.tipo} cor={cor} ciclo />
              </div>
            </div>
            <div style={{ padding: "3px 10px", borderRadius: 6, backgroundColor: "rgba(11,14,17,0.8)", fontFamily: fontes.mono, fontWeight: 600, fontSize: 22, color: k > 0.5 ? c.ambar : t.texto, whiteSpace: "nowrap" }}>{no.rotulo}</div>
            <div style={{ marginTop: -4, fontFamily: fontes.texto, fontSize: 17, color: t.mudo2, whiteSpace: "nowrap" }}>{k > 0.5 ? "no ciclo" : nomeTipo[no.tipo]}</div>
          </div>
        );
      })}
      {/* botão do canto */}
      <div style={{ position: "absolute", right: 22, top: 20, opacity: pr, padding: "8px 18px", borderRadius: 9, border: `1.5px solid ${t.borda2}`, backgroundColor: t.fundo, fontFamily: fontes.texto, fontWeight: 500, fontSize: 20, color: t.texto2 }}>grafo completo</div>
      <div style={{ position: "absolute", left: 26, top: 22, opacity: pr, fontFamily: fontes.mono, fontSize: 19, color: t.mudo, whiteSpace: "nowrap" }}>ciclo de doação/despesa · {n} nós</div>
      {/* faixa inferior */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 84, display: "flex", alignItems: "center", gap: 18, padding: "0 28px", backgroundColor: "rgba(11,14,17,0.92)", borderTop: `1.5px solid ${t.borda}`, opacity: entrar(f, entra + 14, DUR.padrao) }}>
        <Selo texto={`severidade ${severidade}`} cor={severidade === "alta" ? c.ambar : t.mudo} />
        <span style={{ fontFamily: fontes.mono, fontSize: 20, color: t.mudo, whiteSpace: "nowrap" }}>{`doação circular · ${n} nós · o dinheiro volta à mesma cadeia`}</span>
        <span style={{ marginLeft: "auto", fontFamily: fontes.mono, fontWeight: 600, fontSize: 28, color: f >= cicloEm ? c.ambar : t.texto, whiteSpace: "nowrap" }}>{total}</span>
      </div>
    </div>
  );
};

// ───────────────── FichaComFonte (ficha de registro + modo análise) ─────────────────
// Cabeçalho de uma ficha anonimizada (sem foto), campos com ícone de fonte à direita. Em `clicaEm`, um ponteiro chega
// ao ícone do campo `campoFonte`, "clica" e abre o balão de proveniência: órgão, arquivo, URL, data de acesso e SHA-256.
export type CampoFicha = { rotulo: string; valor: string; verde?: boolean };
export type FonteDado = { orgao: string; arquivo: string; url: string; acesso: string; hash: string; linhas?: string };
export const FONTE_PADRAO: FonteDado = {
  orgao: "TSE · dados abertos eleitorais",
  arquivo: "prestacao_de_contas_eleitorais_candidatos_2024",
  url: "cdn.tse.jus.br/estatistica/sead/odsele/prestacao_contas/…_2024.zip",
  acesso: "acessado em 12/09/2026 · 14:32",
  hash: "sha256 4be1…9c07",
};
export const CAMPOS_PADRAO: CampoFicha[] = [
  { rotulo: "recebido em doações", valor: "R$ 182.400,00", verde: true },
  { rotulo: "despesas contratadas", valor: "R$ 176.950,00" },
  { rotulo: "pago até agora", valor: "R$ 171.200,00" },
  { rotulo: "maior fornecedor", valor: "Fornecedor 3" },
  { rotulo: "doadores pessoa física", valor: "38" },
];
export const FichaComFonte: React.FC<{ entra?: number; nome?: string; sub?: string; campos?: CampoFicha[]; campoFonte?: number; clicaEm?: number; fonte?: FonteDado }> = ({
  entra = 0,
  nome = "Candidatura A",
  sub = "vereança · município X · eleição 2024",
  campos = CAMPOS_PADRAO,
  campoFonte = 0,
  clicaEm = 60,
  fonte = FONTE_PADRAO,
}) => {
  const f = useCurrentFrame();
  const ph = entrar(f, entra, DUR.padrao, EASE.enfase);
  const LARG = 720;
  const TOPO_CAMPOS = 196;
  const HL = 82;
  const iconeX = LARG - 52;
  const iconeY = TOPO_CAMPOS + 16 + campoFonte * HL + HL / 2;
  // ponteiro: chega ao ícone em 14 frames antes do clique
  const pm = interpolate(f, [clicaEm - 16, clicaEm - 2], [0, 1], { ...clamp, easing: EASE.padrao });
  const pOp = entrar(f, clicaEm - 20, DUR.pequeno) * (1 - entrar(f, clicaEm + 30, DUR.padrao));
  const px = iconeX + 260 * (1 - pm);
  const py = iconeY + 150 * (1 - pm);
  const clique = f >= clicaEm ? interpolate(f, [clicaEm, clicaEm + 12], [1, 0], clamp) : 0;
  const balao = entrar(f, clicaEm + 4, DUR.padrao, EASE.enfase);
  const hover = f >= clicaEm - 6;
  const bx = LARG + 34;
  const bw = CONTEUDO.w - bx;
  const linhasBalao: [string, string][] = [
    ["órgão", fonte.orgao],
    ["arquivo", fonte.arquivo],
    ["url", fonte.url],
    ["coleta", fonte.acesso],
    ["SHA-256", fonte.hash],
  ];
  return (
    <div data-foco={`ficha: ${nome}`} style={{ position: "absolute", inset: 0 }}>
      {/* cabeçalho da ficha */}
      <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: ph, translate: `0 ${(1 - ph) * 20}px` }}>
        <div style={{ width: 104, height: 104, borderRadius: 52, backgroundColor: t.cartao, border: `2px solid ${t.borda2}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <svg width={58} height={58} viewBox="0 0 24 24">
            <circle cx="12" cy="8.5" r="4" fill={t.borda2} />
            <path d="M4.5 21c0-4.6 3.4-7.3 7.5-7.3s7.5 2.7 7.5 7.3z" fill={t.borda2} />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: fontes.texto, fontWeight: 500, fontSize: 50, letterSpacing: -0.5, color: t.texto, whiteSpace: "nowrap" }}>{nome}</div>
          <div style={{ marginTop: 4, fontFamily: fontes.texto, fontSize: 23, color: t.mudo, whiteSpace: "nowrap" }}>{sub}</div>
          <div style={{ marginTop: 8, fontFamily: fontes.mono, fontSize: 19, color: t.mudo2, whiteSpace: "nowrap" }}>
            CPF <span style={{ color: t.mudo }}>•••.•••.•••-••</span>
            <span style={{ marginLeft: 30 }}>título eleitoral </span>
            <span style={{ color: t.mudo }}>•••• •••• ••••</span>
          </div>
        </div>
      </div>
      {/* campos */}
      <div style={{ position: "absolute", left: 0, top: TOPO_CAMPOS, width: LARG, padding: "16px 0", borderRadius: 14, backgroundColor: t.cartao, border: `1.5px solid ${t.borda}` }}>
        {campos.map((k, i) => {
          const p = entrar(f, entra + 8 + escalonar(i, campos.length, 3), DUR.padrao);
          const alvo = i === campoFonte && hover;
          return (
            <div key={i} style={{ position: "relative", height: HL, display: "flex", alignItems: "center", padding: "0 28px", borderTop: i ? `1px solid ${t.borda}` : "none", opacity: p, translate: `${(1 - p) * 20}px 0` }}>
              <div style={{ position: "absolute", left: 8, right: 8, top: 6, bottom: 6, borderRadius: 9, border: `2px solid ${t.marca}`, backgroundColor: t.marcaTinta, opacity: alvo ? 1 : 0 }} />
              <span style={{ position: "relative", width: 290, fontFamily: fontes.texto, fontSize: 22, color: t.mudo, whiteSpace: "nowrap" }}>{k.rotulo}</span>
              <span style={{ position: "relative", fontFamily: fontes.mono, fontWeight: 600, fontSize: 25, color: k.verde ? t.marca : t.texto, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{k.valor}</span>
              <div style={{ position: "absolute", right: 38, top: HL / 2 - 14 }}>
                <IconeFonte tam={28} cor={alvo ? t.marca : t.mudo2} />
              </div>
            </div>
          );
        })}
      </div>
      {/* balão de proveniência */}
      <div data-foco="balão de fonte" style={{ position: "absolute", left: bx, top: TOPO_CAMPOS - 20, width: bw, opacity: balao, translate: `${(1 - balao) * -24}px 0`, borderRadius: 14, backgroundColor: c.branco, border: `2px solid ${t.marca}88`, boxShadow: "0 24px 70px rgba(0,0,0,0.7)" }}>
        <div style={{ position: "absolute", left: -12, top: iconeY - (TOPO_CAMPOS - 20) - 12, width: 22, height: 22, backgroundColor: c.branco, borderLeft: `2px solid ${t.marca}88`, borderBottom: `2px solid ${t.marca}88`, rotate: "45deg" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 24px", borderBottom: `1.5px solid ${t.borda2}` }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: t.marca }} />
          <span style={{ fontFamily: fontes.texto, fontWeight: 600, fontSize: 23, color: t.texto, whiteSpace: "nowrap" }}>de onde veio este dado</span>

        </div>
        <div style={{ padding: "12px 24px 20px" }}>
          {linhasBalao.map(([r, v], i) => {
            const p = entrar(f, clicaEm + 8 + escalonar(i, linhasBalao.length, 2.5), DUR.pequeno);
            return (
              <div key={r} style={{ display: "flex", gap: 18, padding: "10px 0", borderTop: i ? `1px solid ${t.borda}` : "none", opacity: p }}>
                <span style={{ width: 104, flex: "none", fontFamily: fontes.texto, fontSize: 19, color: t.mudo2 }}>{r}</span>
                <span style={{ fontFamily: fontes.mono, fontSize: 19, lineHeight: 1.35, color: r === "SHA-256" ? c.ambar : r === "url" ? t.marca : t.texto2, overflowWrap: "anywhere" }}>{v}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* clique e ponteiro */}
      <div style={{ position: "absolute", left: iconeX - 26, top: iconeY - 26, width: 52, height: 52, borderRadius: 26, border: `3px solid ${t.marca}`, opacity: clique }} />
      <div style={{ position: "absolute", left: px - 4, top: py - 2, opacity: pOp }}>
        <Ponteiro />
      </div>
    </div>
  );
};

// ───────────────── ListaSancoes (cruzamento com cadastros de punição) ─────────────────
// Cartão com três números em funil (sanções → empresas → empresas que aparecem em campanhas), exemplos anonimizados e
// a tarja de ressalva do cruzamento.
export const ListaSancoes: React.FC<{ entra?: number; sancoes?: number; empresas?: number; emCampanhas?: number; exemplos?: { nome: string; cadastro: string; campanhas: string }[]; tarjaEm?: number; durContagem?: number }> = ({
  entra = 0,
  sancoes = 25535,
  empresas = 9822,
  emCampanhas = 474,
  exemplos = [
    { nome: "Fornecedor 3", cadastro: "CEIS", campanhas: "recebeu de 2 campanhas" },
    { nome: "Fornecedor 7", cadastro: "CNEP", campanhas: "recebeu de 1 campanha" },
    { nome: "Fornecedor 12", cadastro: "CEIS", campanhas: "recebeu de 4 campanhas" },
  ],
  tarjaEm,
  durContagem = 36,
}) => {
  const f = useCurrentFrame();
  const a = entrar(f, entra, DUR.cena, EASE.enfase);
  const nums = [
    { v: sancoes, r: "sanções registradas", cor: t.texto },
    { v: empresas, r: "empresas com sanção", cor: t.texto },
    { v: emCampanhas, r: "aparecem em campanhas", cor: c.ambar },
  ];
  return (
    <div data-foco="lista de sanções" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ opacity: a, translate: `0 ${(1 - a) * 24}px`, borderRadius: 16, backgroundColor: t.cartao, border: `1.5px solid ${t.borda}`, padding: "28px 34px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: c.ambar }} />
          <span style={{ fontFamily: fontes.texto, fontWeight: 600, fontSize: 34, color: t.texto, whiteSpace: "nowrap" }}>Empresas em cadastros de punição</span>
          <span style={{ fontFamily: fontes.mono, fontSize: 22, color: t.mudo, whiteSpace: "nowrap" }}>(CEIS/CNEP · CGU)</span>
          <div style={{ marginLeft: "auto" }}>
            <IconeFonte tam={26} cor={t.mudo2} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0, marginTop: 26 }}>
          {nums.map((it, i) => {
            const fi = entra + 8 + escalonar(i, 3, 5);
            const p = entrar(f, fi, DUR.padrao, EASE.enfase);
            const k = interpolate(f, [fi + 4, fi + 4 + durContagem], [0, 1], { ...clamp, easing: EASE.padrao });
            const ult = i === nums.length - 1;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ flex: 1, padding: "20px 26px", borderRadius: 12, border: `1.5px solid ${ult ? c.ambar : t.borda}`, backgroundColor: ult ? t.alertaTinta : t.fundo, opacity: p, translate: `0 ${(1 - p) * 18}px` }}>
                  <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 62, letterSpacing: -1, color: it.cor, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{num(Math.round(it.v * k))}</div>
                  <div style={{ marginTop: 2, fontFamily: fontes.texto, fontSize: 22, color: ult ? c.ambar : t.mudo, whiteSpace: "nowrap" }}>{it.r}</div>
                </div>
                {!ult ? (
                  <svg width={56} height={30} viewBox="0 0 56 30" style={{ flex: "none", opacity: p }}>
                    <path d="M10 15h32M34 7l9 8-9 8" fill="none" stroke={t.mudo2} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {exemplos.map((e, i) => {
          const p = entrar(f, entra + 26 + escalonar(i, exemplos.length, 3), DUR.padrao, EASE.enfase);
          return (
            <div key={i} style={{ height: 74, display: "flex", alignItems: "center", gap: 24, padding: "0 28px", borderRadius: 11, backgroundColor: t.cartao, border: `1.5px solid ${t.borda}`, boxShadow: `inset 4px 0 0 ${c.ambar}`, opacity: p, translate: `${(1 - p) * 36}px 0` }}>
              <span style={{ width: 230, fontFamily: fontes.texto, fontWeight: 600, fontSize: 25, color: t.texto, whiteSpace: "nowrap" }}>{e.nome}</span>
              <span style={{ fontFamily: fontes.mono, fontSize: 21, color: t.mudo2, whiteSpace: "nowrap" }}>{CNPJ_MASCARADO}</span>
              <Selo texto={e.cadastro} cor={c.ambar} />
              <span style={{ marginLeft: "auto", fontFamily: fontes.texto, fontSize: 22, color: t.mudo, whiteSpace: "nowrap" }}>{e.campanhas}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 4 }}>
        <Tarja texto="CRUZAMENTO DO AUTOR · CONFERIR CASO A CASO" entra={tarjaEm ?? entra + 40} />
      </div>
    </div>
  );
};
