import { Easing, interpolate } from "remotion";

// Constantes de movimento do canal (ver references/18-producao-motion-regras.md). 30 fps.
// Entrada desacelera, saída acelera; nunca linear em posição; sem quique/elástico (tom jornalístico).
export const EASE = {
  padrao: Easing.bezier(0.2, 0, 0, 1),
  enfase: Easing.bezier(0.05, 0.7, 0.1, 1),
  saida: Easing.bezier(0.3, 0, 1, 1),
  fundo: Easing.bezier(0.4, 0, 0.2, 1),
};

// Durações em frames: pequeno (rótulo/ícone), padrão (card/lower third), cena (cartela/troca), drama (revelação).
export const DUR = { pequeno: 7, padrao: 10, cena: 15, drama: 27, maxEntrada: 24 };
export const PAUSA_CLIMAX = 15; // 9–23 frames entre a ação e o resultado
export const STAGGER_MAX = 15; // escalonamento total máximo, qualquer número de itens

// Atraso do item i num grupo de n: 1,5–3 frames por item, comprimido para caber em STAGGER_MAX.
export const escalonar = (i: number, n: number, passo = 2.5) => i * Math.min(passo, STAGGER_MAX / Math.max(1, n - 1));

// Saída dura ~70% da entrada.
export const durSaida = (entrada: number) => Math.round(entrada * 0.7);

// Progresso 0→1 de uma entrada que começa em `de`.
export const entrar = (f: number, de: number, dur: number = DUR.padrao, easing = EASE.padrao) =>
  interpolate(f, [de, de + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// Progresso 1→0 de uma saída que começa em `de`.
export const sair = (f: number, de: number, dur: number = DUR.pequeno, easing = EASE.saida) =>
  interpolate(f, [de, de + dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// "Cortar a curva": troca de cena com deslocamento lateral parcial e corte com os dois lados em movimento.
// `corte` = frame da troca. Retorna estilo da cena que sai e da que entra. Fundo das cenas deve ser opaco.
// desloc: 230 em 1920 de largura, 130 no reel de 1080. Direção fixa (esquerda).
export const cortarCurva = (f: number, corte: number, desloc = 230, durSai = 9, durEntra = 12) => {
  const s = interpolate(f, [corte - durSai, corte], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.poly(5)) });
  const e = interpolate(f, [corte, corte + durEntra], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.poly(5)) });
  return {
    sai: { translate: `${-desloc * s}px 0`, opacity: f >= corte ? 0 : 1 - Math.max(0, (s - 0.7) / 0.3) },
    entra: { translate: `${desloc * (1 - e)}px 0`, opacity: f < corte ? 0 : 0.35 + 0.65 * e },
  };
};
