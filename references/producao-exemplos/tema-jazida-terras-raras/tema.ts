import { loadFont as loadShoulders } from "@remotion/google-fonts/BigShoulders";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// TEMA "JAZIDA" (Terras Raras): grafite e xisto, areia nos textos, ferrugem como acento, verde-mineral e azul-aço nos dados.
// Motivo: TABELA PERIÓDICA em mosaico e CORTE DO SOLO. Sem cortiça, fio, polaroide, contador Geiger nem símbolo de radiação.
const shoulders = loadShoulders("normal", { weights: ["600", "700", "800", "900"], subsets: ["latin"] }).fontFamily;
const mono = loadPlexMono("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily;
const inter = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }).fontFamily;

export const fontes = { titulo: shoulders, rotulo: shoulders, mono, maquina: mono, texto: inter, jornal: inter, documento: inter, legenda: inter };

// Os NOMES seguem o kit dos temas anteriores (papel = fundo, branco = cartão, tinta = texto, azul = cor principal…)
// para os componentes compartilhados funcionarem sem mudança.
export const c = {
  papel: "#1E2226", // grafite: fundo principal
  gelo: "#2B3238", // xisto: painéis
  branco: "#313A42", // cartão (xisto claro)
  tinta: "#E8DCC8", // areia: texto
  azul: "#E0B73A", // cor principal de destaque nos componentes compartilhados = enxofre
  verde: "#2F7D6B", // verde-mineral: oferta, positivo
  laranja: "#E0B73A", // enxofre: marca-texto, alertas suaves
  vermelho: "#A63A22", // vermelho-ferrugem: só carimbo de revelação (1 por bloco)
  fio: "#5A656F", // linhas e grades
  cinza: "#A79F90", // texto secundário
  grafite: "#1E2226",
  xisto: "#2B3238",
  areia: "#E8DCC8",
  ferrugem: "#B5532A",
  mineral: "#2F7D6B",
  enxofre: "#E0B73A",
  aco: "#3C5A78",
  carimbo: "#A63A22",
};
export const sombra = "0 18px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(232,220,200,0.08)";

export const cores = { fundo: c.papel, cortica: c.papel, papel: c.gelo, papelEscuro: c.cinza, tinta: c.tinta, vermelho: c.vermelho, fio: c.fio, amarelo: c.laranja, branco: c.tinta };

export const FPS = 30;
export const ms = (v: number) => Math.round((v / 1000) * FPS);
