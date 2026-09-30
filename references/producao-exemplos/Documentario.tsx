import { AbsoluteFill, Series } from "remotion";
import { Bloco01, DURACAO_01 } from "./Bloco01";
import { Bloco02, DURACAO_02 } from "./Bloco02";
import { Bloco03, DURACAO_03 } from "./Bloco03";
import { Bloco04, DURACAO_04 } from "./Bloco04";
import { Bloco05, DURACAO_05 } from "./Bloco05";
import { Bloco06, DURACAO_06 } from "./Bloco06";
import { Bloco07, DURACAO_07 } from "./Bloco07";
import { Bloco08, DURACAO_08 } from "./Bloco08";
import { Bloco09, DURACAO_09 } from "./Bloco09";
import { Bloco10, DURACAO_10 } from "./Bloco10";
import { Bloco11, DURACAO_11 } from "./Bloco11";
import { Bloco12, DURACAO_12 } from "./Bloco12";

export const BLOCOS = [
  { C: Bloco01, d: DURACAO_01 },
  { C: Bloco02, d: DURACAO_02 },
  { C: Bloco03, d: DURACAO_03 },
  { C: Bloco04, d: DURACAO_04 },
  { C: Bloco05, d: DURACAO_05 },
  { C: Bloco06, d: DURACAO_06 },
  { C: Bloco07, d: DURACAO_07 },
  { C: Bloco08, d: DURACAO_08 },
  { C: Bloco09, d: DURACAO_09 },
  { C: Bloco10, d: DURACAO_10 },
  { C: Bloco11, d: DURACAO_11 },
  { C: Bloco12, d: DURACAO_12 },
];
export const DURACAO_TOTAL = BLOCOS.reduce((a, b) => a + b.d, 0);

export const Documentario: React.FC = () => (
  <AbsoluteFill>
    <Series>
      {BLOCOS.map(({ C, d }, i) => (
        <Series.Sequence key={i} name={`Bloco ${String(i + 1).padStart(2, "0")}`} durationInFrames={d}>
          <C />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
