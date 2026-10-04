import { loadFont as loadShoulders } from "@remotion/google-fonts/BigShoulders";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// TEMA DOSSIÊ DIGITAL (dinheiro das campanhas): grafite quase preto, painéis de dados, verde-dinheiro para fluxos
// e valores, âmbar para alerta e marca-texto, vermelho só na revelação (no máx. 1 por bloco). Fotos reais em cartão
// sobre a mesma foto desfocada; rede de ligações com fotos recortadas em círculo.
const shoulders = loadShoulders("normal", { weights: ["600", "700", "800", "900"], subsets: ["latin"] }).fontFamily;
const mono = loadPlexMono("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily;
const inter = loadInter("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] }).fontFamily;

export const fontes = { titulo: shoulders, rotulo: shoulders, mono, maquina: mono, texto: inter, jornal: inter, documento: inter, legenda: inter };

// Nomes compatíveis com o kit claro (papel = fundo, branco = cartão, tinta = texto, azul = cor principal…)
export const c = {
  papel: "#0E1114", // grafite: fundo principal
  gelo: "#151A20", // painel
  branco: "#1B2129", // cartão
  tinta: "#EEF1F4", // texto
  azul: "#2FD08A", // verde-dinheiro: cor principal, fluxos, valores
  verde: "#2FD08A",
  laranja: "#FFB020", // âmbar: alerta, marca-texto
  vermelho: "#E5484D", // revelação (1 por bloco)
  fio: "#323C48", // grades, arestas apagadas
  cinza: "#93A0B0", // texto secundário
  grafite: "#0E1114",
  painel: "#151A20",
  dinheiro: "#2FD08A",
  ambar: "#FFB020",
  alerta: "#E5484D",
  claro: "#EEF1F4",
  noite: "#0E1114",
};
export const sombra = "0 18px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(47,208,138,0.10)";

export const cores = { fundo: c.papel, cortica: c.papel, papel: c.gelo, papelEscuro: c.cinza, tinta: c.tinta, vermelho: c.vermelho, fio: c.fio, amarelo: c.laranja, branco: c.tinta };

export const FPS = 30;
export const ms = (v: number) => Math.round((v / 1000) * FPS);
