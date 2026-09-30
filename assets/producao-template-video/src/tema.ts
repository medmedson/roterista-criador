import { loadFont as loadElite } from "@remotion/google-fonts/SpecialElite";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadOldStandard } from "@remotion/google-fonts/OldStandardTT";

export const fontes = {
  maquina: loadElite("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  jornal: loadPlayfair("normal", { weights: ["700", "900"], subsets: ["latin"] }).fontFamily,
  rotulo: loadOswald("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily,
  documento: loadOldStandard("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily,
  legenda: loadInter("normal", { weights: ["600"], subsets: ["latin"] }).fontFamily,
};

export const cores = {
  fundo: "#0d0b0a",
  cortica: "#1c1612",
  papel: "#e8dfcb",
  papelEscuro: "#d6c9ab",
  tinta: "#161311",
  vermelho: "#c8201e",
  fio: "#b3161a",
  amarelo: "#f2c230",
  branco: "#f4efe6",
};

export const FPS = 30;
export const ms = (v: number) => Math.round((v / 1000) * FPS);
