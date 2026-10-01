import { Composition, Still } from "remotion";
import { Bloco01, DURACAO_01 } from "./cenas/Bloco01";
import { Bloco02, DURACAO_02 } from "./cenas/Bloco02";
import { Bloco03, DURACAO_03 } from "./cenas/Bloco03";
import { Bloco04, DURACAO_04 } from "./cenas/Bloco04";
import { Bloco05, DURACAO_05 } from "./cenas/Bloco05";
import { Bloco06, DURACAO_06 } from "./cenas/Bloco06";
import { Bloco07, DURACAO_07 } from "./cenas/Bloco07";
import { Bloco08, DURACAO_08 } from "./cenas/Bloco08";
import { Bloco09, DURACAO_09 } from "./cenas/Bloco09";
import { Bloco10, DURACAO_10 } from "./cenas/Bloco10";
import { Bloco11, DURACAO_11 } from "./cenas/Bloco11";
import { Bloco12, DURACAO_12 } from "./cenas/Bloco12";
import { Bloco13, DURACAO_13 } from "./cenas/Bloco13";
import { Bloco14, DURACAO_14 } from "./cenas/Bloco14";
import { Bloco15, DURACAO_15 } from "./cenas/Bloco15";
import { Bloco16, DURACAO_16 } from "./cenas/Bloco16";
import { comChamada, duracaoChamada } from "./cenas/Chamada";
import { Thumbnail } from "./cenas/Thumbnail";
import { Vitrine } from "./cenas/Vitrine";
import { auditado } from "./componentes/Auditoria";
import { comFim, ConfigFim, duracaoFim, TelaFontes } from "./componentes/FimDoVideo";
import { c, FPS, sombra } from "./tema";

// Terras Raras: VÍDEO ÚNICO. Chamadas: depois do B1, depois do B8 (antes do CAPÍTULO IV) e no fim (FimDoVideo).
const CTA1 = duracaoChamada(7.032);
const CTA2 = duracaoChamada(9.912);
const FIM: ConfigFim = {
  paleta: { fundo: c.grafite, cartao: c.branco, texto: c.areia, secundario: c.cinza, destaque: c.enxofre, marca: c.ferrugem, sombra },
  fontes: [
    ["USGS", "Mineral Commodity Summaries 2025 e 2026 e Fact Sheets"],
    ["Agência Nacional de Mineração", "Sumário Mineral, SIGMINE e CFEM"],
    ["MDIC", "Comex Stat"],
    ["Agência Internacional de Energia", "relatórios sobre minerais críticos"],
    ["Química Nova e CETEM", "estudos de 2014 e 2019 e publicações do centro"],
    ["Lei 4.118/1962", "política nuclear e monopólio da União"],
    ["Lei 15.506/2026 e Decreto 13.118/2026", "Planalto"],
    ["Atos oficiais", "China (MOFCOM), Estados Unidos, União Europeia (2024/1252) e G7"],
    ["BNDES, Finep e DFC", "chamadas públicas e financiamento"],
    ["AIEA e estudos", "Agência Internacional de Energia Atômica · Li e colegas (2016)"],
  ],
  linhas: ["Fontes oficiais e estudos na descrição.", "Leia a Lei 15.506/2026 no site do Planalto.", "Veja também: o vídeo sobre eleições e o vídeo sobre o SAMU."],
  creditos: [],
  trilha: "sfx/desfecho-jazida.mp3",
  assinatura: "sfx/diapasao.mp3",
  cta: { audio: "audio/cta3.mp3", segundos: 11.328 },
  fadePara: "preto",
};
const A = {
  Bloco01: auditado(comChamada(Bloco01, DURACAO_01, "depois", "audio/cta1.mp3", CTA1)),
  Bloco02: auditado(Bloco02),
  Bloco03: auditado(Bloco03),
  Bloco04: auditado(Bloco04),
  Bloco05: auditado(Bloco05),
  Bloco06: auditado(Bloco06),
  Bloco07: auditado(Bloco07),
  Bloco08: auditado(comChamada(Bloco08, DURACAO_08, "depois", "audio/cta2.mp3", CTA2)),
  Bloco09: auditado(Bloco09),
  Bloco10: auditado(Bloco10),
  Bloco11: auditado(Bloco11),
  Bloco12: auditado(Bloco12),
  Bloco13: auditado(Bloco13),
  Bloco14: auditado(Bloco14),
  Bloco15: auditado(Bloco15),
  Bloco16: auditado(comFim(Bloco16, DURACAO_16, FIM)),
};
const D: Record<keyof typeof A, number> = { Bloco01: DURACAO_01 + CTA1, Bloco02: DURACAO_02, Bloco03: DURACAO_03, Bloco04: DURACAO_04, Bloco05: DURACAO_05, Bloco06: DURACAO_06, Bloco07: DURACAO_07, Bloco08: DURACAO_08 + CTA2, Bloco09: DURACAO_09, Bloco10: DURACAO_10, Bloco11: DURACAO_11, Bloco12: DURACAO_12, Bloco13: DURACAO_13, Bloco14: DURACAO_14, Bloco15: DURACAO_15, Bloco16: DURACAO_16 + duracaoFim(FIM) };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} />
      <Composition id="Vitrine" component={Vitrine} durationInFrames={260} fps={FPS} width={1920} height={1080} defaultProps={{ pagina: 0 }} />
      <Composition id="Fontes" component={auditado(() => <TelaFontes cfg={FIM} />)} durationInFrames={360} fps={FPS} width={1920} height={1080} />
      {(Object.keys(A) as (keyof typeof A)[]).map((id) => (
        <Composition key={id} id={id} component={A[id]} durationInFrames={D[id]} fps={FPS} width={1920} height={1080} />
      ))}
    </>
  );
};
