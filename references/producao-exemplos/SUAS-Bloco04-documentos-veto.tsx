import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Carimbo } from "../componentes/Carimbo";
import { Clarao } from "../componentes/Clarao";
import { Contador } from "../componentes/Contador";
import { Folha, Marca } from "../componentes/Documento";
import { Etiqueta } from "../componentes/Etiqueta";
import { Folhinha } from "../componentes/Folhinha";
import { Legenda } from "../componentes/Legenda";
import { Ampulheta, MultidaoPontos } from "../componentes/Objetos2";
import { Placar } from "../componentes/Placar";
import { Polaroide } from "../componentes/Polaroide";
import { Pelicula, Quadro } from "../componentes/Quadro";
import { Efeito, Trilha } from "../componentes/Trilha";
import cues from "../data/cues.json";
import { cores, fontes, ms } from "../tema";

const C = cues["04"];
const t = (i: number) => ms(C[i].de);
const FIM = ms(C[C.length - 1].ate);
const CARTELA = { de: FIM + 45, dur: 100 };
export const DURACAO_04 = CARTELA.de + CARTELA.dur;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const AZUL = "#5a9ae6";

const Fundo: React.FC<{ children: React.ReactNode; treme?: number }> = ({ children, treme }) => {
  const frame = useCurrentFrame();
  const d = treme === undefined ? 0 : interpolate(frame - treme, [0, 3, 6, 9, 12, 16], [0, 9, -7, 5, -3, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: cores.cortica, translate: `${d}px ${-d / 2}px` }}>
      <Quadro />
      {children}
      <Pelicula />
    </AbsoluteFill>
  );
};
const Centro: React.FC<{ children: React.ReactNode; gap?: number; linha?: boolean; reserva?: number; cobre?: boolean }> = ({ children, gap = 40, linha, reserva = 200, cobre }) => (
  <AbsoluteFill data-cobre={cobre ? true : undefined} style={{ justifyContent: "center", alignItems: "center", flexDirection: linha ? "row" : "column", gap, paddingBottom: reserva }}>{children}</AbsoluteFill>
);
const Fonte: React.FC<{ texto: string }> = ({ texto }) => (
  <div data-foco={`fonte: ${texto}`} style={{ fontFamily: fontes.rotulo, fontSize: 30, letterSpacing: 3, color: cores.papelEscuro }}>{texto}</div>
);

// C1–C3: o projeto de 1989 e o veto (sem legenda)
const P1: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  const frame = useCurrentFrame();
  const faixa = interpolate(frame, [r(3) + 30, r(3) + 42], [0, 100], clamp);
  return (
    <Fundo treme={r(3) + 42}>
      <Sequence durationInFrames={r(4)} layout="none">
        <Centro cobre reserva={260} gap={30}>
          <Etiqueta a="JUN 1989" b="Raimundo Bezerra apresenta o projeto" simbolo="·" entra={-8} />
          <div style={{ position: "relative", rotate: "-1deg" }}>
            <Folha largura={1500}>
              <div style={{ fontSize: 30, letterSpacing: 4, textAlign: "center" }}>PROJETO DE LEI Nº 3.099/1989 · LEI ORGÂNICA DA ASSISTÊNCIA SOCIAL</div>
              <div style={{ fontSize: 46 }}>
                (...) <Marca entra={r(1)}>Secretaria Especial de Assistência Social</Marca> (...) <Marca entra={r(1) + 50}>Conferência Nacional</Marca> (...) <Marca entra={r(1) + 100}>Conselho Nacional de Assistência Social</Marca> (...)
              </div>
            </Folha>
            <div style={{ position: "absolute", left: -40, right: -40, top: "48%", height: 110, backgroundColor: "#050404", clipPath: `inset(0 ${100 - faixa}% 0 0)` }} />
          </div>
          <Sequence from={r(2)} durationInFrames={r(3) - r(2) + 30} layout="none">
            <Etiqueta a="CONGRESSO" b="aprovado" simbolo="·" entra={0} />
          </Sequence>
        </Centro>
        <Carimbo x={960} y={930} texto="VETADO TOTALMENTE · 17–18/09/1990" entra={r(3) + 44} rotacao={-5} tamanho={62} />
        <Clarao em={[r(3) + 44]} forca={0.45} />
      </Sequence>
      <Sequence from={r(4)} layout="none">
        <Centro cobre reserva={0} gap={50}>
          <div data-foco="razões não localizadas" style={{ width: 1300, height: 220, border: `5px dashed ${cores.papelEscuro}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 48, letterSpacing: 6, color: cores.papelEscuro }}>RAZÕES DO VETO · NÃO LOCALIZADAS</div>
            <div style={{ fontFamily: fontes.maquina, fontSize: 30, color: cores.papelEscuro }}>Mensagem 672/90 · DOFC 18/09/1990, p. 17828</div>
          </div>
          <Sequence from={r(5) - r(4)} layout="none">
            <div data-foco="citação MDS veto" style={{ width: 1400, padding: "36px 50px", backgroundColor: "#efe6cf", rotate: "1deg", boxShadow: "0 20px 30px rgba(0,0,0,0.6)", fontFamily: fontes.jornal, fontWeight: 700, fontSize: 46, lineHeight: 1.25, color: "#2a221d", textAlign: "center" }}>
              “discordância de setores do governo em se comprometer com a prestação de uma renda continuada”
              <div style={{ fontFamily: fontes.maquina, fontWeight: 400, fontSize: 28, marginTop: 16, color: "#5a4a3a" }}>Ministério do Desenvolvimento Social</div>
            </div>
          </Sequence>
        </Centro>
      </Sequence>
    </Fundo>
  );
};

// C4–C5: veto mantido em 1993 e o novo projeto (sem legenda)
const P4: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  const frame = useCurrentFrame();
  const barra = interpolate(frame, [40, 100], [0, 1], clamp);
  return (
    <Fundo>
      <Sequence durationInFrames={r(7)} layout="none">
        <Placar x={960} y={110} titulo="VETO MANTIDO · CÂMARA · 25/08/1993" sim={180} nao={117} legenda="1 abstenção" entra={-6} />
        <div data-foco="intervalo 1990-1993" style={{ position: "absolute", left: 460, top: 700, width: 1000, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 44, color: cores.papel }}>1990</div>
          <div style={{ flex: 1, height: 10, backgroundColor: "#3a332b" }}>
            <div style={{ width: `${barra * 100}%`, height: "100%", backgroundColor: cores.vermelho }} />
          </div>
          <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 44, color: cores.papel }}>1993</div>
        </div>
      </Sequence>
      <Sequence from={r(7)} layout="none">
        <Centro cobre reserva={0} gap={30}>
          <div style={{ rotate: "1deg" }}>
            <Folha largura={1400}>
              <div style={{ fontSize: 30, letterSpacing: 4, textAlign: "center" }}>PROJETO DE LEI Nº 4.100/1993 · PODER EXECUTIVO</div>
              <div style={{ fontSize: 46, textAlign: "center" }}>Lei Orgânica da Assistência Social</div>
            </Folha>
          </div>
          <Etiqueta a="RELATORA" b="dep. Fátima Pelaes" simbolo="·" entra={30} />
          <Sequence from={r(8) - r(7)} layout="none">
            <Etiqueta a="APROVADO" b="com urgência" simbolo="·" entra={0} />
          </Sequence>
        </Centro>
      </Sequence>
    </Fundo>
  );
};

// C6–C8: a sanção, o texto da LOAS, o CNAS (frames relativos)
const P6: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  return (
    <Fundo>
      <Sequence durationInFrames={r(10)} layout="none">
        <div style={{ position: "absolute", left: 110, top: 110 }}>
          <Folhinha dia={7} mes={11} ano={1993} para={24} largura={380} />
        </div>
        <Polaroide x={1000} y={60} largura={420} foto="fotos/itamar.jpg" nome="Itamar Franco" credito="Radiobrás · CC BY 3.0 BR" entra={20} rotacao={1.5} enquadre="50% 20%" />
        <div style={{ position: "absolute", left: 1320, top: 260, width: 500, height: 200 }}>
          <Carimbo x={250} y={100} texto="LEI 8.742" entra={70} rotacao={-6} tamanho={80} />
        </div>
      </Sequence>
      <Sequence from={r(10)} durationInFrames={r(11) - r(10)} layout="none">
        <Centro cobre reserva={0}>
          <div style={{ rotate: "-1deg" }}>
            <Folha largura={1500}>
              <div style={{ fontSize: 30, letterSpacing: 4, textAlign: "center" }}>LEI Nº 8.742, DE 7 DE DEZEMBRO DE 1993 · LOAS</div>
              <div style={{ fontSize: 48 }}>
                Art. 1º A assistência social, <Marca entra={30}>direito do cidadão e dever do Estado</Marca>, (...)
              </div>
            </Folha>
          </div>
        </Centro>
      </Sequence>
      <Sequence from={r(11)} durationInFrames={r(14) - r(11)} layout="none">
        <div style={{ position: "absolute", left: 110, top: 130 }}>
          <MultidaoPontos total={18} colunas={6} largura={720} grupos={[{ qtd: 9, cor: AZUL, entra: 10, rotulo: "governo" }, { qtd: 9, cor: cores.amarelo, entra: 50, rotulo: "sociedade civil" }]} />
        </div>
        <div style={{ position: "absolute", left: 1000, top: 130, width: 820, display: "flex", flexDirection: "column", gap: 34, alignItems: "flex-start" }}>
          <Etiqueta a="CNAS" b="18 membros · 9 + 9" simbolo="·" entra={20} />
          <Sequence from={r(12) - r(11)} layout="none">
            <Etiqueta a="FUNDO NACIONAL" b="de Assistência Social" simbolo="·" entra={0} />
          </Sequence>
          <Sequence from={r(13) - r(11)} layout="none">
            <div style={{ position: "relative", width: 700, height: 340 }}>
              <div data-foco="conselho de 1938" style={{ position: "absolute", left: 0, top: 0, width: 560, padding: "26px 30px", backgroundColor: "#efe6cf", fontFamily: fontes.jornal, fontWeight: 700, fontSize: 44, color: "#2a221d" }}>Conselho Nacional de Serviço Social · 1938</div>
              <Carimbo x={280} y={275} texto="EXTINTO" entra={10} rotacao={-8} tamanho={56} />
            </div>
          </Sequence>
        </div>
      </Sequence>
      <Sequence from={r(14)} durationInFrames={r(15) - r(14)} layout="none">
        <Centro cobre reserva={0}>
          <div style={{ rotate: "1deg" }}>
            <Folha largura={1500}>
              <div style={{ fontSize: 30, letterSpacing: 4, textAlign: "center" }}>LOAS · ART. 4º</div>
              <div style={{ fontSize: 48 }}>
                (...) <Marca entra={20}>vedando-se qualquer comprovação vexatória de necessidade</Marca> (...)
              </div>
            </Folha>
          </div>
        </Centro>
      </Sequence>
      <Sequence from={r(15)} layout="none">
        <Centro gap={26} reserva={0}>
          <div data-foco="um salário mínimo" style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 110, color: cores.amarelo }}>1 SALÁRIO MÍNIMO POR MÊS</div>
          <Etiqueta a="IDOSO" b="70 anos ou mais" simbolo="·" entra={40} />
          <Etiqueta a="PESSOA COM DEFICIÊNCIA" b="“incapacitada para a vida independente e para o trabalho”" simbolo="·" entra={130} />
          <Etiqueta a="RENDA POR PESSOA" b="inferior a 1/4 do salário mínimo" simbolo="<" entra={260} />
        </Centro>
      </Sequence>
    </Fundo>
  );
};

// C9: a espera até 1996 (frames relativos)
const P9: React.FC = () => (
  <Fundo>
    <Centro linha gap={120}>
      <Ampulheta entra={0} duracao={150} altura={560} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div data-foco="datas espera" style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 56, color: cores.papel }}>07/12/1993 → 01/01/1996</div>
        <Contador valor={25} prefixo="≈ " sufixo=" meses" entra={20} rotulo="de espera para pedir o benefício" tamanho={140} cor={cores.vermelho} />
        <Fonte texto="Decreto 1.744/1995, art. 40" />
      </div>
    </Centro>
  </Fundo>
);

const Cartela: React.FC = () => (
  <AbsoluteFill data-cobre style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20 }}>
    <div data-foco="cartela ato II" style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 60, letterSpacing: 16, color: cores.papelEscuro }}>ATO II</div>
    <div data-foco="cartela o sistema" style={{ fontFamily: fontes.jornal, fontWeight: 900, fontSize: 130, color: cores.papel }}>O sistema</div>
  </AbsoluteFill>
);

export const Bloco04: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: cores.cortica }}>
    <Sequence name="C1–C3 · projeto e veto" durationInFrames={t(6)}><P1 inicio={0} /></Sequence>
    <Sequence name="C4–C5 · 1993" from={t(6)} durationInFrames={t(9) - t(6)}><P4 inicio={t(6)} /></Sequence>
    <Sequence name="C6–C8 · LOAS" from={t(9)} durationInFrames={t(16) - t(9)}><P6 inicio={t(9)} /></Sequence>
    <Sequence name="C9 · espera" from={t(16)} durationInFrames={FIM + 20 - t(16)}><P9 /></Sequence>
    <Sequence name="Preto" from={FIM + 20} durationInFrames={CARTELA.de - FIM - 20}>
      <AbsoluteFill data-cobre data-pausa-ok style={{ backgroundColor: "#000" }} />
    </Sequence>
    <Sequence name="Cartela ato II" from={CARTELA.de}><Cartela /></Sequence>
    <Legenda cues={C} ocultar={[[0, t(9)], [t(10), t(11)], [t(14), t(16)], [FIM + 20, DURACAO_04]]} />

    <Audio src={staticFile("audio/04.mp3")} />
    <Trilha arquivo="sfx/constituinte.mp3" de={0} ate={t(3) - 20} volume={0.16} fade={30} />
    <Trilha arquivo="sfx/veto.mp3" de={t(3) + 30} ate={t(7)} volume={0.26} fade={20} />
    <Trilha arquivo="sfx/constituinte.mp3" de={t(7)} ate={t(16)} volume={0.22} fade={40} />
    <Trilha arquivo="sfx/veto.mp3" de={t(16)} ate={FIM + 15} volume={0.14} fade={30} />
    <Efeito arquivo="sfx/papel-virar.mp3" em={4} volume={0.5} duracao={25} />
    <Efeito arquivo="sfx/riser.mp3" em={t(3) - 10} volume={0.4} duracao={30} />
    <Efeito arquivo="sfx/carimbo.mp3" em={t(3) + 44} volume={0.75} duracao={15} />
    <Efeito arquivo="sfx/impacto.mp3" em={t(3) + 44} volume={0.6} />
    <Efeito arquivo="sfx/papel-deslizar.mp3" em={t(5)} volume={0.45} duracao={25} />
    <Efeito arquivo="sfx/urna-bip.mp3" em={t(6)} volume={0.45} duracao={30} />
    <Efeito arquivo="sfx/clique.mp3" em={t(6) + 40} volume={0.4} duracao={8} />
    <Efeito arquivo="sfx/papel-deslizar.mp3" em={t(7)} volume={0.45} duracao={25} />
    <Efeito arquivo="sfx/flash-camera.mp3" em={t(9) + 20} volume={0.4} duracao={15} />
    <Efeito arquivo="sfx/carimbo.mp3" em={t(9) + 70} volume={0.6} duracao={15} />
    <Efeito arquivo="sfx/sting.mp3" em={t(9) + 72} volume={0.3} duracao={30} />
    <Efeito arquivo="sfx/papel-virar.mp3" em={t(10)} volume={0.5} duracao={25} />
    <Efeito arquivo="sfx/clique.mp3" em={t(11) + 10} volume={0.4} duracao={8} />
    <Efeito arquivo="sfx/clique.mp3" em={t(11) + 50} volume={0.4} duracao={8} />
    <Efeito arquivo="sfx/carimbo.mp3" em={t(13) + 10} volume={0.55} duracao={15} />
    <Efeito arquivo="sfx/papel-virar.mp3" em={t(14)} volume={0.5} duracao={25} />
    <Efeito arquivo="sfx/tique-parede.mp3" em={t(16)} volume={0.4} duracao={120} />
    <Efeito arquivo="sfx/sting.mp3" em={CARTELA.de} volume={0.7} duracao={40} />
  </AbsoluteFill>
);
