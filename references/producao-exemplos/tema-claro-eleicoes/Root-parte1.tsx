import { Composition } from "remotion";
import { Bloco01, DURACAO_01 } from "./cenas/Bloco01";
import { Bloco02, DURACAO_02 } from "./cenas/Bloco02";
import { Bloco03, DURACAO_03 } from "./cenas/Bloco03";
import { Bloco04, DURACAO_04 } from "./cenas/Bloco04";
import { Bloco05, DURACAO_05 } from "./cenas/Bloco05";
import { Bloco06, DURACAO_06 } from "./cenas/Bloco06";
import { Bloco07, DURACAO_07 } from "./cenas/Bloco07";
import { Bloco08, DURACAO_08 } from "./cenas/Bloco08";
import { comChamada, duracaoChamada } from "./cenas/Chamada";
import { Vitrine } from "./cenas/Vitrine";
import { auditado } from "./componentes/Auditoria";
import { FPS } from "./tema";

// Série Eleições (eleicoes-parte1). Chamadas de inscrição (frase própria do roteiro) coladas depois dos blocos marcados.
const A = {
  Bloco01: auditado(comChamada(Bloco01, DURACAO_01, "depois", "audio/cta1.mp3", duracaoChamada(7.032))),
  Bloco02: auditado(Bloco02),
  Bloco03: auditado(Bloco03),
  Bloco04: auditado(comChamada(Bloco04, DURACAO_04, "depois", "audio/cta2.mp3", duracaoChamada(9.36))),
  Bloco05: auditado(Bloco05),
  Bloco06: auditado(Bloco06),
  Bloco07: auditado(Bloco07),
  Bloco08: auditado(comChamada(Bloco08, DURACAO_08, "depois", "audio/cta3.mp3", duracaoChamada(9.072))),
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Vitrine" component={Vitrine} durationInFrames={200} fps={FPS} width={1920} height={1080} defaultProps={{ pagina: 0 }} />
      <Composition id="Bloco01" component={A.Bloco01} durationInFrames={DURACAO_01 + duracaoChamada(7.032)} fps={FPS} width={1920} height={1080} />
      <Composition id="Bloco02" component={A.Bloco02} durationInFrames={DURACAO_02} fps={FPS} width={1920} height={1080} />
      <Composition id="Bloco03" component={A.Bloco03} durationInFrames={DURACAO_03} fps={FPS} width={1920} height={1080} />
      <Composition id="Bloco04" component={A.Bloco04} durationInFrames={DURACAO_04 + duracaoChamada(9.36)} fps={FPS} width={1920} height={1080} />
      <Composition id="Bloco05" component={A.Bloco05} durationInFrames={DURACAO_05} fps={FPS} width={1920} height={1080} />
      <Composition id="Bloco06" component={A.Bloco06} durationInFrames={DURACAO_06} fps={FPS} width={1920} height={1080} />
      <Composition id="Bloco07" component={A.Bloco07} durationInFrames={DURACAO_07} fps={FPS} width={1920} height={1080} />
      <Composition id="Bloco08" component={A.Bloco08} durationInFrames={DURACAO_08 + duracaoChamada(9.072)} fps={FPS} width={1920} height={1080} />
    </>
  );
};
