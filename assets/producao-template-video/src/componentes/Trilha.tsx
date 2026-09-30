import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile } from "remotion";

// Trecho de trilha com entrada e saída suaves
export const Trilha: React.FC<{ arquivo: string; de: number; ate: number; volume?: number; fade?: number }> = ({
  arquivo,
  de,
  ate,
  volume = 0.3,
  fade = 45,
}) => (
  <Sequence name={`Trilha ${arquivo}`} from={de} durationInFrames={ate - de} layout="none">
    <Audio
      src={staticFile(arquivo)}
      loop
      volume={(f) =>
        interpolate(f, [0, fade, ate - de - fade, ate - de], [0, volume, volume, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  </Sequence>
);

// Efeito sonoro pontual
export const Efeito: React.FC<{ arquivo: string; em: number; volume?: number; duracao?: number }> = ({
  arquivo,
  em,
  volume = 0.8,
  duracao = 90,
}) => (
  <Sequence name={`Efeito ${arquivo}`} from={em} durationInFrames={duracao} layout="none">
    <Audio src={staticFile(arquivo)} volume={volume} />
  </Sequence>
);
