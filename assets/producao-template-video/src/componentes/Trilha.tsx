import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import cues from "../data/cues.json";
import { ms } from "../tema";

// Voz SEMPRE acima da música (regra do usuário): enquanto a narração fala, a trilha baixa sozinha (ducking)
// para no máximo VOL_SOB_VOZ; nas pausas e cartelas ela pode subir até o volume pedido.
// As falas vêm do cues.json do bloco (id da composição "BlocoNN"). Se a voz começa depois (pré-roll), passe atrasoVoz.
export const VOL_SOB_VOZ = 0.12;
const SUAVE = 8; // frames de rampa para descer/subir
type Cue = { de: number; ate: number };

const ganhoDucking = (frameAbs: number, falas: [number, number][]) => {
  let g = 1;
  for (const [de, ate] of falas) {
    if (frameAbs >= de - SUAVE && frameAbs <= ate + SUAVE) {
      const k = Math.min(1, (frameAbs - (de - SUAVE)) / SUAVE, (ate + SUAVE - frameAbs) / SUAVE);
      g = Math.min(g, 1 - Math.max(0, Math.min(1, k)));
    }
  }
  return g; // 1 = sem fala; 0 = em fala
};

// Trecho de trilha com entrada e saída suaves (e ducking sob a voz)
export const Trilha: React.FC<{ arquivo: string; de: number; ate: number; volume?: number; fade?: number; atrasoVoz?: number }> = ({
  arquivo,
  de,
  ate,
  volume = 0.3,
  fade = 45,
  atrasoVoz = 0,
}) => {
  const { id } = useVideoConfig();
  const bloco = id.match(/Bloco(\d{2})/)?.[1];
  const lista = ((bloco ? (cues as Record<string, Cue[]>)[bloco] : undefined) ?? []) as Cue[];
  const falas: [number, number][] = lista.map((c) => [atrasoVoz + ms(c.de), atrasoVoz + ms(c.ate)]);
  const f2 = Math.max(1, Math.min(fade, Math.floor((ate - de) / 2) - 1));
  return (
    <Sequence name={`Trilha ${arquivo}`} from={de} durationInFrames={ate - de} layout="none">
      <Audio
        src={staticFile(arquivo)}
        loop
        volume={(f) => {
          const env = interpolate(f, [0, f2, ate - de - f2, ate - de], [0, volume, volume, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const g = ganhoDucking(de + f, falas);
          const sobVoz = Math.min(env, VOL_SOB_VOZ);
          return sobVoz + (env - sobVoz) * g;
        }}
      />
    </Sequence>
  );
};

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
