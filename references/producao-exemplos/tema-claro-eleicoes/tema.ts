import { loadFont as loadShoulders } from "@remotion/google-fonts/BigShoulders";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// TEMA CLARO / CLEAN (Eleições): papel branco-gelo, tipografia grande, sombras suaves, cor só em pontos de atenção.
// Nada de cortiça, fio vermelho ou polaroide escura.
const shoulders = loadShoulders("normal", { weights: ["600", "700", "800", "900"], subsets: ["latin"] }).fontFamily;
const mono = loadPlexMono("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily;
const inter = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }).fontFamily;

export const fontes = {
  titulo: shoulders, // títulos e números (Big Shoulders)
  rotulo: shoulders,
  mono, // datas, artigos de lei
  maquina: mono,
  texto: inter, // texto de apoio
  jornal: inter,
  documento: inter,
  legenda: inter,
};

// Paleta do roteiro
export const c = {
  papel: "#F6F4EE", // fundo principal
  gelo: "#EAEEF3", // painéis e cartões
  tinta: "#1B1F2A", // texto
  azul: "#1C3F94", // azul-cédula: cor principal
  verde: "#2E9E5B", // CONFIRMA, positivo, fecho
  laranja: "#F28C28", // CORRIGE, alertas suaves, marca-texto
  vermelho: "#B8342B", // só carimbo de revelação (1 por bloco, no máximo)
  fio: "#C9D0DA", // linhas, grades, mapas base
  cinza: "#6B7385", // texto secundário
  branco: "#FFFFFF",
};
export const sombra = "0 18px 40px rgba(27,31,42,0.12), 0 3px 8px rgba(27,31,42,0.08)";

// Compatibilidade com os componentes dos kits anteriores (reestilizados no claro)
export const cores = {
  fundo: c.papel,
  cortica: c.papel,
  papel: c.gelo,
  papelEscuro: c.cinza,
  tinta: c.tinta,
  vermelho: c.vermelho,
  fio: c.fio,
  amarelo: c.laranja,
  branco: c.tinta,
};

export const FPS = 30;
export const ms = (v: number) => Math.round((v / 1000) * FPS);
