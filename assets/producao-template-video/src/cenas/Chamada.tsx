import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, Series, staticFile } from "remotion";
import { ChamadaInscricao } from "../componentes/ChamadaInscricao";
import { Pelicula, Quadro } from "../componentes/Quadro";
import { Efeito } from "../componentes/Trilha";
import { cores } from "../tema";

// Chamada "inscreva-se + sininho" com voz própria (public/audio/ctaN.mp3) e trilha baixa constante (abaixo da voz).
// Cada chamada tem frase própria no roteiro; a duração acompanha a voz: duracaoChamada(segundos da voz).
export const DURACAO_CHAMADA = 250;
export const duracaoChamada = (segundosVoz: number) => Math.max(DURACAO_CHAMADA, Math.ceil(segundosVoz * 30) + 60);
const TRILHA = "sfx/desfecho.mp3"; // tema claro (Eleições): "sfx/desfecho-cidada.mp3"
const SOM_SINO = "sfx/ding-senha.mp3"; // tema claro (Eleições): "sfx/bip-confirma.mp3"

export const Chamada: React.FC<{ audio?: string; duracao?: number }> = ({ audio = "audio/cta.mp3", duracao = DURACAO_CHAMADA }) => (
  <AbsoluteFill style={{ backgroundColor: cores.cortica }}>
    <Quadro />
    <ChamadaInscricao duracao={duracao} titulo="GOSTANDO? INSCREVA-SE E ATIVE O SININHO" />
    <Pelicula />
    <Sequence from={10}><Audio src={staticFile(audio)} /></Sequence>
    <Audio src={staticFile(TRILHA)} volume={(f) => Math.min(0.1, f / 20, (duracao - f) / 20)} />
    <Efeito arquivo="sfx/whoosh.mp3" em={0} volume={0.3} duracao={15} />
    <Efeito arquivo="sfx/clique.mp3" em={40} volume={0.6} duracao={10} />
    <Efeito arquivo={SOM_SINO} em={72} volume={0.25} duracao={50} />
    <Efeito arquivo="sfx/whoosh.mp3" em={duracao - 14} volume={0.25} duracao={14} />
  </AbsoluteFill>
);

// Junta a chamada antes ou depois de um bloco, sem mexer no bloco (os tempos internos do bloco não mudam).
export const comChamada = (Bloco: React.FC, duracaoBloco: number, onde: "antes" | "depois", audio = "audio/cta.mp3", duracao = DURACAO_CHAMADA): React.FC => {
  const Comp: React.FC = () => (
    <Series>
      {onde === "antes" ? <Series.Sequence durationInFrames={duracao}><Chamada audio={audio} duracao={duracao} /></Series.Sequence> : null}
      <Series.Sequence durationInFrames={duracaoBloco}><Bloco /></Series.Sequence>
      {onde === "depois" ? <Series.Sequence durationInFrames={duracao}><Chamada audio={audio} duracao={duracao} /></Series.Sequence> : null}
    </Series>
  );
  return Comp;
};
