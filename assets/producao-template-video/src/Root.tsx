import { Composition } from "remotion";
import { Bloco01, DURACAO_01 } from "./cenas/Bloco01";
import { auditado } from "./componentes/Auditoria";
import { FPS } from "./tema";

// Cada bloco novo: importar, embrulhar com auditado() e registrar uma Composition.
// No fim: cenas/Documentario.tsx (Series com todos os blocos) e cenas/Thumbnail.tsx (Still 1280x720).
const A = { Bloco01: auditado(Bloco01) };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Bloco01" component={A.Bloco01} durationInFrames={DURACAO_01} fps={FPS} width={1920} height={1080} />
    </>
  );
};
