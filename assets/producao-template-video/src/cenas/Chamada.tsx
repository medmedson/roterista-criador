import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, Series, staticFile } from "remotion";
import { ChamadaInscricao } from "../componentes/ChamadaInscricao";
import { Pelicula, Quadro } from "../componentes/Quadro";
import { Efeito } from "../componentes/Trilha";
import { cores } from "../tema";

// Chamada "inscreva-se + sininho" (8 s) com voz própria (public/audio/cta.mp3) e trilha baixa constante (abaixo da voz).
export const DURACAO_CHAMADA = 250;
export const Chamada: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: cores.cortica }}>
    <Quadro />
    <ChamadaInscricao duracao={DURACAO_CHAMADA} />
    <Pelicula />
    <Sequence from={10}><Audio src={staticFile("audio/cta.mp3")} /></Sequence>
    <Audio src={staticFile("sfx/desfecho.mp3")} volume={(f) => Math.min(0.1, f / 20, (DURACAO_CHAMADA - f) / 20)} />
    <Efeito arquivo="sfx/whoosh.mp3" em={0} volume={0.35} duracao={15} />
    <Efeito arquivo="sfx/clique.mp3" em={40} volume={0.5} duracao={10} />
    <Efeito arquivo="sfx/ding-senha.mp3" em={72} volume={0.45} duracao={60} />
    <Efeito arquivo="sfx/whoosh.mp3" em={DURACAO_CHAMADA - 14} volume={0.3} duracao={14} />
  </AbsoluteFill>
);

// Junta a chamada antes ou depois de um bloco, sem mexer no bloco (os tempos internos do bloco não mudam).
export const comChamada = (Bloco: React.FC, duracaoBloco: number, onde: "antes" | "depois"): React.FC => {
  const Comp: React.FC = () => (
    <Series>
      {onde === "antes" ? <Series.Sequence durationInFrames={DURACAO_CHAMADA}><Chamada /></Series.Sequence> : null}
      <Series.Sequence durationInFrames={duracaoBloco}><Bloco /></Series.Sequence>
      {onde === "depois" ? <Series.Sequence durationInFrames={DURACAO_CHAMADA}><Chamada /></Series.Sequence> : null}
    </Series>
  );
  return Comp;
};
