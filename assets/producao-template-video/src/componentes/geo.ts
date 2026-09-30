import mapa from "../data/mapa.json";

// Converte o centro de um estado (ou Brasília) para coordenadas de um MapaBrasil posicionado em (x, y) com `tamanho`
export const pontoEstado = (sigla: string, x: number, y: number, tamanho: number): [number, number] => {
  const e = mapa.estados.find((s) => s.sigla === sigla);
  const [cx, cy] = sigla === "DF" || !e ? mapa.projecao.brasilia : e.c;
  return [x + (cx * tamanho) / mapa.w, y + (cy * tamanho) / mapa.h];
};
export const SIGLAS = mapa.estados.map((e) => e.sigla);
