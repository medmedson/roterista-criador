import { loadFont as loadShoulders } from "@remotion/google-fonts/BigShoulders";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// TEMA NOTURNO DA CENTRAL (SAMU): sala de regulação à noite — azul-noite, painéis de vidro, telemetria ciano,
// giroflex âmbar/vermelho como acento. Sem pessoas, sem sangue, sem rostos.
const shoulders = loadShoulders("normal", { weights: ["600", "700", "800", "900"], subsets: ["latin"] }).fontFamily;
const mono = loadPlexMono("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily;
const inter = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }).fontFamily;

export const fontes = { titulo: shoulders, rotulo: shoulders, mono, maquina: mono, texto: inter, jornal: inter, documento: inter, legenda: inter };

// Paleta do roteiro. Os NOMES seguem o kit claro (papel = fundo, branco = cartão, tinta = texto, azul = cor principal…)
// para os componentes compartilhados funcionarem sem mudança.
export const c = {
  papel: "#0B1F3A", // azul-noite: fundo principal
  gelo: "#12294B", // painel
  branco: "#16315A", // cartão (vidro)
  tinta: "#F4F6F8", // branco-ambulância: texto
  azul: "#35C6E8", // ciano-telemetria: cor principal, dados, rotas
  verde: "#35C6E8", // positivo = ciano (o tema não tem verde)
  laranja: "#F5A524", // âmbar: giroflex, marca-texto
  vermelho: "#D62D20", // vermelho-giroflex: alerta e carimbo de revelação (1 por bloco)
  fio: "#5B7089", // grades e mapas base
  cinza: "#9FB0C6", // texto secundário
  noite: "#0B1F3A",
  painel: "#12294B",
  ciano: "#35C6E8",
  ambar: "#F5A524",
  giroflex: "#D62D20",
  claro: "#F4F6F8",
};
export const sombra = "0 18px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(53,198,232,0.12)";

export const cores = { fundo: c.papel, cortica: c.papel, papel: c.gelo, papelEscuro: c.cinza, tinta: c.tinta, vermelho: c.vermelho, fio: c.fio, amarelo: c.laranja, branco: c.tinta };

export const FPS = 30;
export const ms = (v: number) => Math.round((v / 1000) * FPS);
