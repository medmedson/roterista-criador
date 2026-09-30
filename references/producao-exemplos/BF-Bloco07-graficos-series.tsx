import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Carimbo } from "../componentes/Carimbo";
import { Clarao } from "../componentes/Clarao";
import { Contador } from "../componentes/Contador";
import { Etiqueta } from "../componentes/Etiqueta";
import { LinhaPobreza, PessoasPontos, PratoVazio } from "../componentes/KitBF";
import { Legenda } from "../componentes/Legenda";
import { MapaMundo } from "../componentes/MapaMundo";
import { Pelicula, Quadro } from "../componentes/Quadro";
import { SerieLinha } from "../componentes/Serie";
import { Efeito, Trilha } from "../componentes/Trilha";
import cues from "../data/cues.json";
import { cores, fontes, ms } from "../tema";

const C = cues["07"];
const t = (i: number) => ms(C[i].de);
const FIM = ms(C[C.length - 1].ate);
export const DURACAO_07 = FIM + 40;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OURO = "#e0b43c";
const CINZA = "#9a948a";

const Fundo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: cores.cortica }}>
    <Quadro />
    {children}
    <Pelicula />
  </AbsoluteFill>
);
const Fonte: React.FC<{ texto: string }> = ({ texto }) => (
  <div data-foco={`fonte: ${texto}`} style={{ fontFamily: fontes.rotulo, fontSize: 30, letterSpacing: 3, color: cores.papelEscuro }}>{texto}</div>
);
const Centro: React.FC<{ children: React.ReactNode; gap?: number; linha?: boolean }> = ({ children, gap = 40, linha }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: linha ? "row" : "column", gap, paddingBottom: 200 }}>{children}</AbsoluteFill>
);
const Titulo: React.FC<{ texto: string }> = ({ texto }) => (
  <div data-foco={`título ${texto}`} style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: cores.papelEscuro }}>{texto}</div>
);

// C1–C2: extrema pobreza e pobreza (IBGE, SIS 2025) (frames relativos)
const P1: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  return (
    <Fundo>
      <Sequence durationInFrames={r(3)} layout="none">
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 50, flexDirection: "column", gap: 10 }}>
          <Titulo texto="EXTREMA POBREZA · US$ 2,15 PPC 2017" />
          <SerieLinha
            largura={1760}
            altura={700}
            maximo={10}
            entra={20}
            passo={Math.round((r(2) + 60) / 10)}
            pontos={[
              { a: "2012", v: 6.6 }, { a: "2014", v: 5.2 }, { a: "2016", v: 6.7 }, { a: "2018", v: 7.4 }, { a: "2019", v: 7.4 },
              { a: "2020", v: 6.1 }, { a: "2021", v: 9.0, destaque: true }, { a: "2022", v: 5.9 }, { a: "2023", v: 4.4 }, { a: "2024", v: 3.5, destaque: true, rotulo: "7,4 mi" },
            ]}
          />
          <Fonte texto="IBGE, Síntese de Indicadores Sociais 2025" />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={r(3)} layout="none">
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 50, flexDirection: "column", gap: 10 }}>
          <Titulo texto="POBREZA · US$ 6,85 PPC 2017" />
          <SerieLinha largura={1400} altura={620} maximo={40} entra={-10} passo={20} cor={cores.papel} pontos={[{ a: "2012", v: 34.7 }, { a: "2021", v: 36.8 }, { a: "2024", v: 23.1, destaque: true, rotulo: "48,9 mi" }]} />
          <div style={{ position: "relative", width: 700, height: 150, marginTop: 30 }}>
            <Carimbo x={350} y={80} texto="MENOR DA SÉRIE" entra={50} rotacao={-3} tamanho={56} cor="#2e8b57" />
          </div>
        </AbsoluteFill>
      </Sequence>
    </Fundo>
  );
};

// C3: simulação sem benefícios (frames relativos)
const P3: React.FC<{ inicio: number }> = ({ inicio }) => {
  const frame = useCurrentFrame();
  const r = (i: number) => t(i) - inicio;
  const a = interpolate(frame, [20, 50], [0, 1], clamp);
  const b = interpolate(frame, [70, 170], [0, 1], { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) });
  return (
    <Fundo>
      <Centro gap={24}>
        <div data-foco="colunas simulação" style={{ display: "flex", alignItems: "flex-end", gap: 140, height: 480 }}>
          {[
            { r: "COM BENEFÍCIOS", v: 3.5, p: a, c: OURO },
            { r: "SEM BENEFÍCIOS", v: 10.0, p: b, c: cores.vermelho },
          ].map((c) => (
            <div key={c.r} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 70, color: c.c, opacity: c.p }}>{(c.v * c.p).toFixed(1).replace(".", ",")}%</div>
              <div style={{ width: 240, height: (c.v / 10) * 340 * c.p, backgroundColor: c.c }} />
              <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 36, color: cores.papel }}>{c.r}</div>
            </div>
          ))}
        </div>
        <Fonte texto="simulação do IBGE retira TODOS os programas sociais (Bolsa Família, BPC e outros) · extrema pobreza 2024" />
        <Sequence from={r(5)} layout="none">
          <Etiqueta a="BOLSA FAMÍLIA" b="58,8% do volume desses benefícios (PNAD 2024)" simbolo="=" entra={0} />
        </Sequence>
      </Centro>
    </Fundo>
  );
};

// C4: o efeito isolado (Ipea) (frames relativos)
const P4: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  return (
    <Fundo>
      <PessoasPontos largura={1920} altura={880} total={34} cruzam={34} sobe={r(7) + 30} linhaY={560} teto={330} />
      <LinhaPobreza largura={1920} niveis={[{ f: -20, y: 560, valor: "extrema pobreza" }]} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 50, flexDirection: "column", gap: 10 }}>
        <Sequence from={r(7)} layout="none">
          <Contador valor={3.4} casas={1} sufixo=" milhões" entra={0} rotulo="fora da extrema pobreza em 2017 · −25%" tamanho={110} cor={OURO} />
        </Sequence>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: 1920, top: 830, display: "flex", justifyContent: "center", opacity: interpolate(useCurrentFrame(), [r(7), r(7) + 10], [0, 1], clamp) }}>
        <Fonte texto="Souza, Osorio, Paiva e Soares (Ipea TD 2499 / Enap 2018) · 1 ponto = 100 mil pessoas" />
      </div>
    </Fundo>
  );
};

// C5: Gini (frames relativos)
const P5: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  return (
    <Fundo>
      <Sequence durationInFrames={r(9)} layout="none">
        <Centro>
          <Contador valor={10} prefixo="≈ " sufixo="%" entra={-4} rotulo="da queda da desigualdade (Gini) entre 2001 e 2015" tamanho={170} cor={OURO} />
        </Centro>
      </Sequence>
      <Sequence from={r(9)} layout="none">
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 50, flexDirection: "column", gap: 10 }}>
          <Titulo texto="ÍNDICE DE GINI · IBGE (SIDRA 7435)" />
          <SerieLinha largura={1500} altura={680} maximo={0.56} minimo={0.48} entra={-10} passo={18} casas={3} sufixo="" pontos={[{ a: "2012", v: 0.54 }, { a: "2019", v: 0.543 }, { a: "2021", v: 0.543 }, { a: "2024", v: 0.504, destaque: true, rotulo: "menor da série" }, { a: "2025", v: 0.511 }]} />
        </AbsoluteFill>
      </Sequence>
    </Fundo>
  );
};

// C6–C8: fome, Mapa da Fome e a revisão (frames relativos)
const P6: React.FC<{ inicio: number }> = ({ inicio }) => {
  const frame = useCurrentFrame();
  const r = (i: number) => t(i) - inicio;
  const noMapa = frame >= r(14) && frame < r(15);
  const nivel = frame < r(12) ? 0 : frame < r(14) ? 1 : frame < r(15) ? 0.3 : 1;
  return (
    <Fundo>
      <Sequence durationInFrames={r(16)} layout="none">
        <Centro linha gap={50}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <PratoVazio enche={r(12)} nivel={nivel} tamanho={360} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: 1100 }}>
            <MapaMundo largura={1000} entra={-10} destaques={[{ iso: "BRA", entra: 0, cor: noMapa ? cores.vermelho : OURO }]} />
            <Sequence durationInFrames={r(14)} layout="none">
              <Etiqueta a="2014 · FORA DO MAPA DA FOME" b="conjunto de políticas (FAO)" simbolo="·" entra={r(12)} />
            </Sequence>
            <Sequence from={r(14)} durationInFrames={r(15) - r(14)} layout="none">
              <Etiqueta a="VOLTA AO MAPA" b="4,1% em 2019–21 (revisado: 2,8%)" simbolo="·" entra={0} />
            </Sequence>
            <Sequence from={r(15)} layout="none">
              <Etiqueta a="FAO 2025 · NOVA SAÍDA" b="< 2,5% em 2022–24" simbolo="·" entra={0} />
            </Sequence>
          </div>
        </Centro>
      </Sequence>
      <Sequence from={r(16)} durationInFrames={r(19) - r(16)} layout="none">
        <Centro gap={30}>
          <div data-foco="revisão FAO" style={{ display: "flex", alignItems: "center", gap: 50, fontFamily: fontes.rotulo, fontWeight: 700 }}>
            <span style={{ fontSize: 120, color: CINZA, textDecoration: frame >= r(17) ? `line-through ${cores.vermelho} 8px` : "none" }}>&lt; 2,5%</span>
            <span style={{ fontSize: 120, color: OURO, opacity: interpolate(frame, [r(17) + 20, r(17) + 30], [0, 1], clamp) }}>2,7%</span>
          </div>
          <div data-foco="triênio 2022-24" style={{ fontFamily: fontes.maquina, fontSize: 40, color: cores.papel }}>subalimentação no triênio 2022–24</div>
          <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
            <Etiqueta a="2023–25" b="< 2,5%" simbolo="·" entra={r(18) - r(16)} />
            <div style={{ position: "relative", width: 420, height: 110 }}>
              <Carimbo x={210} y={55} texto="REVISADO" entra={r(17) + 40} rotacao={-3} tamanho={56} cor={CINZA} />
            </div>
          </div>
          <Fonte texto="FAO, FAOSTAT, série revisada em 21/07/2026" />
        </Centro>
        <Clarao em={[0]} cor="#ffffff" forca={0.25} />
      </Sequence>
      <Sequence from={r(19)} layout="none">
        <Centro linha gap={60}>
          <PratoVazio enche={-60} nivel={1} tamanho={320} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Titulo texto="INSEGURANÇA ALIMENTAR GRAVE · FAO" />
            <div data-foco="barras insegurança" style={{ display: "flex", alignItems: "flex-end", gap: 40, height: 440 }}>
              {[
                { a: "2014–16", v: 0.7 }, { a: "2020–22", v: 8.5 }, { a: "2022–24", v: 3.1 }, { a: "2023–25", v: 0.6 },
              ].map((b, i) => {
                const k = interpolate(frame, [r(19) + i * 18, r(19) + i * 18 + 25], [0, 1], clamp);
                return (
                  <div key={b.a} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 170 }}>
                    <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 44, color: b.v > 5 ? cores.vermelho : OURO, opacity: k }}>{b.v.toFixed(1).replace(".", ",")}%</div>
                    <div style={{ width: 110, height: (b.v / 8.5) * 300 * k, backgroundColor: b.v > 5 ? cores.vermelho : OURO }} />
                    <div style={{ fontFamily: fontes.rotulo, fontSize: 30, color: cores.papel }}>{b.a}</div>
                  </div>
                );
              })}
            </div>
            <Sequence from={r(20) - r(19)} layout="none">
              <Etiqueta a="MINISTÉRIO" b="menor patamar da série" simbolo="·" entra={r(20)} />
            </Sequence>
          </div>
        </Centro>
      </Sequence>
    </Fundo>
  );
};

export const Bloco07: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: cores.cortica }}>
    <Sequence name="C1–C2 · pobreza" durationInFrames={t(4)}><P1 inicio={0} /></Sequence>
    <Sequence name="C3 · simulação" from={t(4)} durationInFrames={t(6) - t(4)}><P3 inicio={t(4)} /></Sequence>
    <Sequence name="C4 · efeito isolado" from={t(6)} durationInFrames={t(8) - t(6)}><P4 inicio={t(6)} /></Sequence>
    <Sequence name="C5 · Gini" from={t(8)} durationInFrames={t(11) - t(8)}><P5 inicio={t(8)} /></Sequence>
    <Sequence name="C6–C8 · fome" from={t(11)}><P6 inicio={t(11)} /></Sequence>
    <Legenda cues={C} ocultar={[[t(1), t(6)], [t(7), t(11)], [t(16), DURACAO_07]]} />

    <Audio src={staticFile("audio/07.mp3")} />
    <Trilha arquivo="sfx/esperanca.mp3" de={0} ate={t(16) + 10} volume={0.26} fade={30} />
    <Trilha arquivo="sfx/investigacao.mp3" de={t(16)} ate={t(19) + 10} volume={0.2} fade={20} />
    <Trilha arquivo="sfx/esperanca.mp3" de={t(19)} ate={DURACAO_07} volume={0.26} fade={30} />
    <Efeito arquivo="sfx/cartao-bip.mp3" em={t(2) + 30} volume={0.6} duracao={50} />
    <Efeito arquivo="sfx/carimbo.mp3" em={t(3) + 50} volume={0.7} duracao={15} />
    <Efeito arquivo="sfx/riser.mp3" em={t(4) + 20} volume={0.5} duracao={45} />
    <Efeito arquivo="sfx/impacto.mp3" em={t(4) + 170} volume={0.6} />
    <Efeito arquivo="sfx/notas.mp3" em={t(7) + 40} volume={0.5} duracao={20} />
    <Efeito arquivo="sfx/clique.mp3" em={t(9)} volume={0.5} duracao={10} />
    <Efeito arquivo="sfx/panela.mp3" em={t(11)} volume={0.5} duracao={30} />
    <Efeito arquivo="sfx/estatica.mp3" em={t(16)} volume={0.4} duracao={12} />
    <Efeito arquivo="sfx/clique.mp3" em={t(17)} volume={0.6} duracao={10} />
    <Efeito arquivo="sfx/subida.mp3" em={t(19)} volume={0.35} duracao={100} />
  </AbsoluteFill>
);
