import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";

// TEMA VIVO (estilo criador de conteúdo, aprovado na amostra de 04/10/2026): mesa escura com pontinhos, adesivos
// brancos, caneta vermelha/azul desenhando por cima, marca-texto amarelo, notas verdes. Câmera viva (KitVivo.Mundo).
const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const caveat = loadCaveat("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const mono = loadPlexMono("normal", { weights: ["500", "600"], subsets: ["latin"] }).fontFamily;
const nunito = loadNunito("normal", { weights: ["700", "800", "900"], subsets: ["latin"] }).fontFamily;

export const fontes = { titulo: anton, mao: caveat, mono, maquina: mono, texto: nunito, rotulo: anton, legenda: nunito, jornal: nunito, documento: nunito };

export const c = {
  mesa: "#15181D", // fundo
  ponto: "rgba(255,255,255,0.08)",
  papel: "#FFFFFF", // adesivo, cartão
  tinta: "#1B1B1F", // texto sobre papel
  claro: "#F4F4F2", // texto sobre a mesa
  vermelho: "#E0412F", // caneta: círculos, riscos, alerta
  azul: "#2D5BD8", // caneta: setas de partido, cursor
  marca: "#FFD43B", // marca-texto
  verde: "#2FD08A", // dinheiro, notas, "legal"
  verdeEscuro: "#1B7A50",
  cinza: "#9AA0A8",
  sombra: "0 30px 60px rgba(0,0,0,0.5)",
  // compatibilidade com componentes antigos
  branco: "#FFFFFF",
  laranja: "#FFD43B",
  fio: "#3A3F47",
  grafite: "#15181D",
  painel: "#1E2228",
  gelo: "#1E2228",
  dinheiro: "#2FD08A",
  ambar: "#FFB020",
  alerta: "#E0412F",
};
export const sombra = c.sombra;
export const cores = { fundo: c.mesa, cortica: c.mesa, papel: c.painel, papelEscuro: c.cinza, tinta: c.claro, vermelho: c.vermelho, fio: c.fio, amarelo: c.marca, branco: c.claro };

export const FPS = 30;
export const ms = (v: number) => Math.round((v / 1000) * FPS);
