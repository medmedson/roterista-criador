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
import { comChamada, duracaoChamada } from "./cenas/Chamada";
import { comFim, ConfigFim, duracaoFim, TelaFontes } from "./componentes/FimDoVideo";
import { Thumbnail } from "./cenas/Thumbnail";
import { Vitrine } from "./cenas/Vitrine";
import { auditado } from "./componentes/Auditoria";
import { c, FPS, sombra } from "./tema";

// Eleições: VÍDEO ÚNICO (regra do usuário: nada de Parte 1/Parte 2).
// Chamadas: depois do B1 (gancho), depois do B7 (antes do CAPÍTULO III) e no fim (depois da tela de FONTES).
const CTA1 = duracaoChamada(7.032);
const CTA2 = duracaoChamada(9.288);
// Fim do vídeo no padrão do canal (skill 07 e 13c §4c): fontes → tela final + chamada 3 → bip-confirma → silêncio → fade branco
const FIM: ConfigFim = {
  paleta: { fundo: c.papel, cartao: c.branco, texto: c.tinta, secundario: c.cinza, destaque: c.azul, marca: c.azul, sombra },
  fontes: [
    ["Constituições", "Constituição Federal de 1988 e constituições anteriores (Planalto)"],
    ["Leis eleitorais", "Decreto 21.076/1932 · Código Eleitoral (Lei 4.737/1965) · Lei 9.504/1997"],
    ["Tribunal Superior Eleitoral", "notícias, resoluções e dados abertos"],
    ["Supremo Tribunal Federal", "ADI 4543 e ADI 5889"],
    ["Câmara e Senado", "tramitações e PEC 135/2019"],
    ["Ministério da Defesa", "ofício 29126/GM-MD (2022)"],
    ["Organização dos Estados Americanos", "Missão de Observação Eleitoral (2022)"],
    ["Tribunal de Contas da União", "auditoria de boletins de urna (2022)"],
    ["IBGE", "Censo 2022"],
    ["Estudos científicos", "Nicolau (2015) · Fujiwara (2015) · Aranha e outros (2019) · Ferraz e Finan (2008) · Cepaluni e Hidalgo (2016)"],
  ],
  linhas: [
    "Fontes oficiais e estudos na descrição.",
    "Seu local de votação e a justificativa de ausência: aplicativo e-Título.",
    "Veja também: “Bolsa Família: esmola, comodismo ou solução?” e o vídeo sobre o SUS.",
  ],
  creditos: [],
  trilha: "sfx/desfecho-cidada.mp3",
  assinatura: "sfx/bip-confirma.mp3",
  cta: { audio: "audio/cta3.mp3", segundos: 11.328 },
  fadePara: "branco",
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
  Bloco15: auditado(comFim(Bloco15, DURACAO_15, FIM)),
};
const D: Record<keyof typeof A, number> = {
  Bloco01: DURACAO_01 + CTA1, Bloco02: DURACAO_02, Bloco03: DURACAO_03, Bloco04: DURACAO_04, Bloco05: DURACAO_05,
  Bloco06: DURACAO_06, Bloco07: DURACAO_07 + CTA2, Bloco08: DURACAO_08, Bloco09: DURACAO_09, Bloco10: DURACAO_10,
  Bloco11: DURACAO_11, Bloco12: DURACAO_12, Bloco13: DURACAO_13, Bloco14: DURACAO_14, Bloco15: DURACAO_15 + duracaoFim(FIM),
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} defaultProps={{ parte: 1 as 1 | 2 }} />
      <Composition id="Vitrine" component={Vitrine} durationInFrames={200} fps={FPS} width={1920} height={1080} defaultProps={{ pagina: 0 }} />
      <Composition id="Fontes" component={auditado(() => <TelaFontes cfg={FIM} />)} durationInFrames={360} fps={FPS} width={1920} height={1080} />
      {(Object.keys(A) as (keyof typeof A)[]).map((id) => (
        <Composition key={id} id={id} component={A[id]} durationInFrames={D[id]} fps={FPS} width={1920} height={1080} />
      ))}
    </>
  );
};
