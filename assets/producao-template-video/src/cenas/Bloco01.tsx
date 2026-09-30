import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Contador } from "../componentes/Contador";
import { Etiqueta } from "../componentes/Etiqueta";
import { Legenda } from "../componentes/Legenda";
import { Pelicula, Quadro } from "../componentes/Quadro";
import { Efeito, Trilha } from "../componentes/Trilha";
import cues from "../data/cues.json";
import { cores, ms } from "../tema";

// MODELO DE BLOCO. Padrão: t(i) = frame em que começa a fala i (cues do .srt).
// Cada parte é uma Sequence; dentro dela use frames RELATIVOS: r(i) = t(i) - inicio.
const C = cues["01"];
const t = (i: number) => ms(C[i].de);
const FIM = ms(C[C.length - 1].ate);
export const DURACAO_01 = FIM + 30;

const Fundo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: cores.cortica }}>
    <Quadro />
    {children}
    <Pelicula />
  </AbsoluteFill>
);
// Conteúdo centralizado acima da faixa da legenda (reserva de 200 px embaixo)
const Centro: React.FC<{ children: React.ReactNode; gap?: number; reserva?: number }> = ({ children, gap = 40, reserva = 200 }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap, paddingBottom: reserva }}>{children}</AbsoluteFill>
);

const P1: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  return (
    <Fundo>
      <Centro>
        <Contador valor={1000} entra={-6} rotulo="exemplo de número animado" tamanho={160} cor={cores.amarelo} />
        {C.length > 1 ? (
          <Sequence from={r(1)} layout="none">
            <Etiqueta a="FONTE" b="exemplo de etiqueta" simbolo="·" entra={0} />
          </Sequence>
        ) : null}
      </Centro>
    </Fundo>
  );
};

export const Bloco01: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: cores.cortica }}>
    <Sequence name="C1 · exemplo" durationInFrames={DURACAO_01}><P1 inicio={0} /></Sequence>
    {/* ocultar: intervalos em que a tela é só texto (documento, citação, número sozinho, cartela) */}
    <Legenda cues={C} ocultar={[]} />
    <Audio src={staticFile("audio/01.mp3")} />
    <Trilha arquivo="sfx/investigacao.mp3" de={0} ate={DURACAO_01} volume={0.22} fade={30} />
    <Efeito arquivo="sfx/clique.mp3" em={10} volume={0.4} duracao={8} />
  </AbsoluteFill>
);
