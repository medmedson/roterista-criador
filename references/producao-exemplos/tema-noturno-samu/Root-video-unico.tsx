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

// SAMU 192: VÍDEO ÚNICO. Chamadas: depois do B1, depois do B7 (antes do CAPÍTULO III) e no fim (FimDoVideo).
const CTA1 = duracaoChamada(7.0320);
const CTA2 = duracaoChamada(9.2160);
const FIM: ConfigFim = {
  paleta: { fundo: c.noite, cartao: c.branco, texto: c.claro, secundario: c.cinza, destaque: c.ambar, marca: c.ciano, sombra },
  fontes: [
    ["Constituição Federal", "art. 196"],
    ["Ministério da Saúde · portarias", "2.048/2002 · 1.863 e 1.864/2003 · 1.600/2011 · 1.010/2012 · 958 e 1.631/2023"],
    ["Decreto 5.055/2004", "Planalto"],
    ["Ministério da Saúde", "SAMU 192 e notícias oficiais"],
    ["DATASUS", "produção ambulatorial (SIA/SUS)"],
    ["SIOP e IBGE", "orçamento federal e IPCA"],
    ["Câmara dos Deputados · ALMG", "audiências e documentos"],
    ["Defensoria Pública do Amazonas", "ação sobre o SAMU de Manaus"],
    ["Estudos científicos", "Cadernos de Saúde Pública (2017) · Vieira (2022) · Oliveira (2019) · Nacer (2023)"],
    ["Estudos internacionais", "Larsen (1993) · Emberson (2014)"],
    ["Lei 14.434/2022", "piso da enfermagem"],
  ],
  linhas: ["Fontes oficiais e estudos na descrição.", "Em emergência, ligue 192.", "Veja também: o vídeo sobre o SUS e o vídeo sobre o SUAS."],
  creditos: [],
  trilha: "sfx/desfecho-central.mp3",
  assinatura: "sfx/toque-central.mp3",
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
  Bloco07: auditado(comChamada(Bloco07, DURACAO_07, "depois", "audio/cta2.mp3", CTA2)),
  Bloco08: auditado(Bloco08),
  Bloco09: auditado(Bloco09),
  Bloco10: auditado(Bloco10),
  Bloco11: auditado(Bloco11),
  Bloco12: auditado(Bloco12),
  Bloco13: auditado(Bloco13),
  Bloco14: auditado(Bloco14),
  Bloco15: auditado(Bloco15),
  Bloco16: auditado(comFim(Bloco16, DURACAO_16, FIM)),
};
const D: Record<keyof typeof A, number> = { Bloco01: DURACAO_01 + CTA1, Bloco02: DURACAO_02, Bloco03: DURACAO_03, Bloco04: DURACAO_04, Bloco05: DURACAO_05, Bloco06: DURACAO_06, Bloco07: DURACAO_07 + CTA2, Bloco08: DURACAO_08, Bloco09: DURACAO_09, Bloco10: DURACAO_10, Bloco11: DURACAO_11, Bloco12: DURACAO_12, Bloco13: DURACAO_13, Bloco14: DURACAO_14, Bloco15: DURACAO_15, Bloco16: DURACAO_16 + duracaoFim(FIM) };

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
