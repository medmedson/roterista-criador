import { DesfazCamera } from "./CameraViva";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { cores, fontes, ms } from "../tema";

export type Cue = { de: number; ate: number; texto: string };

// LEGENDA DINÂMICA (regra do usuário, 02/10/2026): nunca mostrar a fala inteira de uma vez. Cada fala é dividida em trechos de
// no máximo 2 linhas (~84 caracteres, quebrando de preferência em pontuação) e cada trecho aparece no momento em que é dito,
// em proporção ao tamanho do trecho dentro da duração da fala. Fala curta (≤ 84 caracteres) aparece inteira.
// `ocultar`: intervalos [de, ate) em frames onde a tela já mostra texto
// `atraso`: frames de pré-roll antes da narração começar
export const MAX_CARACTERES = 84;
export const dividirLegenda = (texto: string, max = MAX_CARACTERES): string[] => {
  const t = texto.replace(/\s+/g, " ").trim();
  if (t.length <= max) return [t];
  const palavras = t.split(" ");
  const partes: string[] = [];
  let atual = "";
  for (const p of palavras) {
    const prox = atual ? `${atual} ${p}` : p;
    if (prox.length > max && atual) {
      partes.push(atual);
      atual = p;
    } else {
      atual = prox;
      // pontuação forte fecha o trecho se ele já tem corpo (evita linha órfã de 2 palavras)
      if (/[.;:!?]$/.test(p) && atual.length >= 40) {
        partes.push(atual);
        atual = "";
      } else if (/,$/.test(p) && atual.length >= 60) {
        partes.push(atual);
        atual = "";
      }
    }
  }
  if (atual) partes.push(atual);
  // trecho final muito curto (< 18 caracteres) cola no anterior se couber em 2 linhas folgadas
  if (partes.length > 1 && partes[partes.length - 1].length < 18 && partes[partes.length - 2].length + 1 + partes[partes.length - 1].length <= max + 12) {
    const u = partes.pop() as string;
    partes[partes.length - 1] += ` ${u}`;
  }
  return partes;
};
const trechoAtual = (texto: string, de: number, ate: number, frame: number): string => {
  const partes = dividirLegenda(texto);
  if (partes.length === 1) return partes[0];
  const total = partes.reduce((s, p) => s + p.length, 0);
  const k = Math.max(0, Math.min(0.9999, (frame - de) / Math.max(1, ate - de)));
  let acc = 0;
  for (const p of partes) {
    acc += p.length / total;
    if (k < acc) return p;
  }
  return partes[partes.length - 1];
};
export const Legenda: React.FC<{ cues: Cue[]; ocultar?: [number, number][]; atraso?: number }> = ({ cues, ocultar = [], atraso = 0 }) => {
  const frame = useCurrentFrame() - atraso;
  if (ocultar.some(([de, ate]) => frame + atraso >= de && frame + atraso < ate)) return null;
  const cue = cues.find((c) => frame >= ms(c.de) && frame < ms(c.ate));
  if (!cue) return null;
  return (
    <DesfazCamera>
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 36 }}>
      <div
        data-legenda
        style={{
          maxWidth: 1500,
          textAlign: "center",
          fontFamily: fontes.legenda,
          fontWeight: 600,
          fontSize: 40,
          lineHeight: 1.25,
          color: cores.branco,
          backgroundColor: "rgba(8,6,5,0.78)",
          padding: "10px 26px",
          borderRadius: 6,
        }}
      >
        {trechoAtual(cue.texto, ms(cue.de), ms(cue.ate), frame)}
      </div>
    </AbsoluteFill>
    </DesfazCamera>
  );
};
