import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Contador } from "../componentes/Contador";
import { Etiqueta } from "../componentes/Etiqueta";
import { AMBAR, Pastas, PainelSenhas, PlacaCRAS, PranchetaCadastro, RedeTerritorio, Tripe, TubosNiveis } from "../componentes/KitSUAS";
import { Legenda } from "../componentes/Legenda";
import { Pelicula, Quadro } from "../componentes/Quadro";
import { Recorte } from "../componentes/Recorte";
import { Efeito, Trilha } from "../componentes/Trilha";
import cues from "../data/cues.json";
import { cores, fontes, ms } from "../tema";

const C = cues["01"];
const OFF = 110; // painel de senhas antes da voz
const t = (i: number) => OFF + ms(C[i].de);
const FIM = OFF + ms(C[C.length - 1].ate);
const CARTELA = { de: FIM + 45, dur: 100 };
export const DURACAO_01 = CARTELA.de + CARTELA.dur;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OURO = "#e0b43c";
const AZUL = "#8fc3f2";

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
const Centro: React.FC<{ children: React.ReactNode; gap?: number; linha?: boolean; reserva?: number }> = ({ children, gap = 40, linha, reserva = 200 }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: linha ? "row" : "column", gap, paddingBottom: reserva }}>{children}</AbsoluteFill>
);

// Pontos: 1 ponto = 1 milhão de famílias do Cadastro Único
const PontosCadastro: React.FC<{ bolsa: number; bpc: number }> = ({ bolsa, bpc }) => {
  const frame = useCurrentFrame();
  const total = 44; // 43,4 milhões: o último ponto aparece pela metade
  return (
    <div data-foco="pontos do cadastro" style={{ display: "grid", gridTemplateColumns: "repeat(11, 64px)", gap: 18, width: "fit-content" }}>
      {Array.from({ length: total }, (_, i) => {
        const o = interpolate(frame, [i * 0.8, i * 0.8 + 6], [0, 1], clamp) * (i === total - 1 ? 0.4 : 1);
        const ouro = i < 19 && frame >= bolsa + i * 2;
        const meio = i === 18; // 19,3: o 20º ponto fica parcial
        const azul = i >= 20 && i < 27 && frame >= bpc + (i - 20) * 3;
        const cor = ouro ? OURO : azul ? AZUL : "#5a524a";
        return <div key={i} style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: i === 19 && frame >= bolsa + 40 ? "rgba(224,180,60,0.35)" : cor, opacity: i === 26 && azul ? 0.5 * o : o, outline: meio ? undefined : undefined }} />;
      })}
    </div>
  );
};

// C1: o painel acende antes da voz (sem legenda)
const P0: React.FC = () => (
  <AbsoluteFill data-cobre data-pausa-ok style={{ backgroundColor: "#050404", justifyContent: "center", alignItems: "center" }}>
    <PainelSenhas numero={1} rolaDe={0} entra={15} largura={900} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, ${AMBAR}22 100%)` }} />
  </AbsoluteFill>
);

// C2–C4: CRAS, cadastro, Bolsa Família e BPC (frames relativos)
const P1: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  const frame = useCurrentFrame();
  return (
    <Fundo>
      <Sequence durationInFrames={r(2)} layout="none">
        <RedeTerritorio entra={-6} x={120} y={40} tamanho={760} pontosPorEstado={7} />
        <div style={{ position: "absolute", left: 1000, top: 110, width: 820, display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
          <Contador valor={8546} entra={20} rotulo="CRAS · Censo SUAS 2024" tamanho={150} cor={cores.branco} />
          <Sequence from={r(1)} layout="none">
            <PlacaCRAS acende={0} largura={760} />
          </Sequence>
        </div>
      </Sequence>
      <Sequence from={r(2)} durationInFrames={r(3) - r(2)} layout="none">
        <Centro linha gap={120}>
          <PranchetaCadastro entra={-6} carimbo={120} largura={520} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: 760 }}>
            <Contador valor={43.4} casas={1} sufixo=" mi" entra={40} rotulo="famílias no Cadastro Único (set/2026)" tamanho={150} cor={cores.branco} />
            <div style={{ opacity: interpolate(frame, [r(2) + 60, r(2) + 70], [0, 1], clamp) }}>
              <Fonte texto="cálculo com dados do MDS" />
            </div>
          </div>
        </Centro>
      </Sequence>
      <Sequence from={r(3)} layout="none">
        <AbsoluteFill style={{ padding: "90px 0 0 110px" }}>
          <PontosCadastro bolsa={10} bpc={r(4) - r(3) + 10} />
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 1150, top: 120, width: 680, display: "flex", flexDirection: "column", gap: 40, alignItems: "flex-start" }}>
          <div data-foco="legenda pontos" style={{ fontFamily: fontes.maquina, fontSize: 32, color: cores.papelEscuro }}>1 ponto = 1 milhão de famílias</div>
          <Etiqueta a="BOLSA FAMÍLIA" b="19,3 mi" simbolo="·" entra={20} />
          <Sequence from={r(4) - r(3)} layout="none">
            <Etiqueta a="BPC" b="1 salário mínimo · R$ 1.621" simbolo="·" entra={0} />
            <Contador valor={6.52} casas={2} sufixo=" mi" entra={30} rotulo="BPC (ago/2026)" tamanho={110} cor={AZUL} />
          </Sequence>
        </div>
      </Sequence>
    </Fundo>
  );
};

// C5: SUS, INSS e ? (sem legenda)
const P5: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  const frame = useCurrentFrame();
  const vira = frame >= r(7);
  return (
    <Fundo>
      <div style={{ position: "absolute", left: 0, top: 320, width: 1920 }}>
        <Recorte x={420} y={0} largura={440} tamanhoTitulo={110} rotacao={-2} entra={-4} semente={1} chapeu="SAÚDE" titulo="SUS" />
        <Recorte x={960} y={0} largura={440} tamanhoTitulo={110} rotacao={1.5} entra={r(6)} semente={2} chapeu="PREVIDÊNCIA" titulo="INSS" />
        <Recorte x={1500} y={0} largura={440} tamanhoTitulo={110} rotacao={-1} entra={r(6) + 30} semente={3} chapeu={vira ? "ASSISTÊNCIA" : "?"} titulo={vira ? "SUAS" : "?"} />
      </div>
    </Fundo>
  );
};

// C6: tripé (frames relativos)
const P6: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  return (
    <Fundo>
      <Centro reserva={160}>
        <Tripe entra={10} pes={[{ rotulo: "SAÚDE", sub: "para todos", f: r(9) }, { rotulo: "PREVIDÊNCIA", sub: "para quem contribui", f: r(10) }, { rotulo: "ASSISTÊNCIA SOCIAL", sub: "para quem precisa", f: r(11) }]} />
      </Centro>
    </Fundo>
  );
};

// C7–C8: pastas e tubos (frames relativos)
const P7: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  return (
    <Fundo>
      <Sequence durationInFrames={r(16)} layout="none">
        <Centro reserva={0}>
          <Pastas entra={-6} perguntas={["QUEM CRIOU?", "COMO FUNCIONA?", "QUEM CHEGA?", "O QUE FALHA?", "O QUE ESTÁ EM JOGO?"]} />
        </Centro>
      </Sequence>
      <Sequence from={r(16)} layout="none">
        <Centro gap={30}>
          <TubosNiveis entra={-6} largo={{ v: 1, rotulo: "BPC · 93%" }} estreito={{ v: 0.022, rotulo: "SERVIÇOS ≈ 2%" }} />
          <Fonte texto="Fundo Nacional de Assistência Social · execução 2025" />
        </Centro>
      </Sequence>
    </Fundo>
  );
};

const Cartela: React.FC = () => (
  <AbsoluteFill data-cobre style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20 }}>
    <div data-foco="cartela capítulo I" style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 60, letterSpacing: 16, color: cores.papelEscuro }}>CAPÍTULO I</div>
    <div data-foco="cartela o favor" style={{ fontFamily: fontes.jornal, fontWeight: 900, fontSize: 130, color: cores.papel }}>O favor</div>
  </AbsoluteFill>
);

export const Bloco01: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: cores.cortica }}>
    <Sequence name="C1 · painel" durationInFrames={t(0)}><P0 /></Sequence>
    <Sequence name="C2–C4 · CRAS e cadastro" from={t(0)} durationInFrames={t(5) - t(0)}><P1 inicio={t(0)} /></Sequence>
    <Sequence name="C5 · SUS INSS SUAS" from={t(5)} durationInFrames={t(8) - t(5)}><P5 inicio={t(5)} /></Sequence>
    <Sequence name="C6 · tripé" from={t(8)} durationInFrames={t(12) - t(8)}><P6 inicio={t(8)} /></Sequence>
    <Sequence name="C7–C8 · pastas e tubos" from={t(12)} durationInFrames={FIM + 20 - t(12)}><P7 inicio={t(12)} /></Sequence>
    <Sequence name="Preto" from={FIM + 20} durationInFrames={CARTELA.de - FIM - 20}>
      <AbsoluteFill data-cobre data-pausa-ok style={{ backgroundColor: "#000" }} />
    </Sequence>
    <Sequence name="Cartela capítulo I" from={CARTELA.de}><Cartela /></Sequence>
    <Legenda cues={C} atraso={OFF} ocultar={[[0, t(0)], [t(5), t(8)], [t(12), t(16)], [FIM + 20, DURACAO_01]]} />

    <Sequence from={OFF}><Audio src={staticFile("audio/01.mp3")} /></Sequence>
    <Efeito arquivo="sfx/ding-senha.mp3" em={22} volume={0.7} duracao={60} />
    <Trilha arquivo="sfx/senha.mp3" de={50} ate={FIM + 5} volume={0.22} fade={30} />
    <Efeito arquivo="sfx/tique-parede.mp3" em={60} volume={0.3} duracao={110} />
    <Trilha arquivo="sfx/sala-espera.mp3" de={t(0)} ate={t(2)} volume={0.12} fade={20} />
    <Efeito arquivo="sfx/clique.mp3" em={t(0) + 30} volume={0.4} duracao={8} />
    <Efeito arquivo="sfx/clique.mp3" em={t(0) + 80} volume={0.4} duracao={8} />
    <Efeito arquivo="sfx/ding-senha.mp3" em={t(1) + 4} volume={0.35} duracao={60} />
    <Efeito arquivo="sfx/whoosh.mp3" em={t(2) - 8} volume={0.35} duracao={12} />
    <Efeito arquivo="sfx/maquina-escrever.mp3" em={t(2) + 10} volume={0.4} duracao={60} />
    <Efeito arquivo="sfx/carimbo-atendido.mp3" em={t(2) + 120} volume={0.55} duracao={20} />
    <Efeito arquivo="sfx/subida.mp3" em={t(3)} volume={0.3} duracao={80} />
    <Efeito arquivo="sfx/moedas.mp3" em={t(4) + 20} volume={0.3} duracao={30} />
    {[0, 1, 2].map((k) => <Efeito key={k} arquivo="sfx/papel-deslizar.mp3" em={[t(5), t(6), t(6) + 30][k]} volume={0.5} duracao={20} />)}
    <Efeito arquivo="sfx/riser.mp3" em={t(7) - 40} volume={0.35} duracao={40} />
    <Efeito arquivo="sfx/subida.mp3" em={t(8) + 10} volume={0.3} duracao={80} />
    <Efeito arquivo="sfx/impacto.mp3" em={t(11)} volume={0.35} />
    <Efeito arquivo="sfx/papel-deslizar.mp3" em={t(12)} volume={0.5} duracao={30} />
    <Efeito arquivo="sfx/maquina-escrever.mp3" em={t(13)} volume={0.35} duracao={50} />
    <Efeito arquivo="sfx/impacto.mp3" em={t(16) + 90} volume={0.45} />
    <Efeito arquivo="sfx/sting.mp3" em={CARTELA.de} volume={0.7} duracao={40} />
  </AbsoluteFill>
);
