import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Carimbo } from "../componentes/Carimbo";
import { Contador } from "../componentes/Contador";
import { Etiqueta } from "../componentes/Etiqueta";
import { Fio } from "../componentes/Fio";
import { Folhinha } from "../componentes/Folhinha";
import { CasaTresAndares, PainelSenhas, Pauta, SeloPEC, TubosNiveis } from "../componentes/KitSUAS";
import { Legenda } from "../componentes/Legenda";
import { Ampulheta } from "../componentes/Objetos2";
import { Placar } from "../componentes/Placar";
import { Pelicula, Quadro } from "../componentes/Quadro";
import { Efeito, Trilha } from "../componentes/Trilha";
import cues from "../data/cues.json";
import { cores, fontes, ms } from "../tema";

const C = cues["12"];
const t = (i: number) => ms(C[i].de);
const FIM = ms(C[C.length - 1].ate);
const FINAL = FIM + 100; // 3 s de silêncio depois da última frase
export const DURACAO_12 = FINAL + 330;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OURO = "#e0b43c";
const CINZA = "#9a948a";

const Fundo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: cores.cortica }}>
    <Quadro />
    {children}
    <Pelicula />
  </AbsoluteFill>
);
const Centro: React.FC<{ children: React.ReactNode; gap?: number; linha?: boolean; reserva?: number; cobre?: boolean }> = ({ children, gap = 40, linha, reserva = 200, cobre }) => (
  <AbsoluteFill data-cobre={cobre ? true : undefined} style={{ justifyContent: "center", alignItems: "center", flexDirection: linha ? "row" : "column", gap, paddingBottom: reserva }}>{children}</AbsoluteFill>
);
const Fonte: React.FC<{ texto: string }> = ({ texto }) => (
  <div data-foco={`fonte: ${texto}`} style={{ fontFamily: fontes.rotulo, fontSize: 30, letterSpacing: 3, color: cores.papelEscuro, textAlign: "center" }}>{texto}</div>
);
const Aparece: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => {
  const frame = useCurrentFrame();
  return <div style={{ opacity: interpolate(frame, [f, f + 12], [0, 1], clamp) }}>{children}</div>;
};
const escreve = (frame: number, texto: string, f: number, vel = 1.2) => texto.slice(0, Math.max(0, Math.floor((frame - f) * vel)));

// Cadeado: fechado (sem piso) ou aberto e dourado (piso)
const Cadeado: React.FC<{ abre?: number; rotulo: string; rotuloAberto: string }> = ({ abre, rotulo, rotuloAberto }) => {
  const frame = useCurrentFrame();
  const a = abre === undefined ? 0 : interpolate(frame, [abre, abre + 20], [0, 1], clamp);
  const cor = a > 0.5 ? OURO : cores.vermelho;
  return (
    <div data-foco="cadeado do piso" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <svg width={170} height={200} viewBox="0 0 220 260">
        <path d={`M55 120 V80 A55 55 0 0 1 165 80 V${120 - 50 * a}`} fill="none" stroke={cor} strokeWidth={16} />
        <rect x={25} y={120} width={170} height={130} rx={18} fill={a > 0.5 ? OURO : "none"} stroke={cor} strokeWidth={8} />
      </svg>
      <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 44, color: cor }}>{a > 0.5 ? rotuloAberto : rotulo}</div>
    </div>
  );
};

// C1–C5: a PEC (frames relativos)
const P1: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  const frame = useCurrentFrame();
  const degraus = [
    { a: "ano 1", v: 0.3, f: r(3) + 60 },
    { a: "ano 2", v: 0.5, f: r(3) + 140 },
    { a: "ano 3", v: 0.75, f: r(3) + 220 },
    { a: "ano 4 em diante", v: 1, f: r(3) + 300 },
  ];
  return (
    <Fundo>
      <Sequence durationInFrames={r(3)} layout="none">
        <div style={{ position: "absolute", left: 90, top: 110 }}>
          <Folhinha dia={8} mes={3} ano={2026} para={24} largura={300} />
        </div>
        <Sequence from={r(1)} durationInFrames={r(2) - r(1)} layout="none">
          <Placar x={1150} y={140} titulo="1º TURNO · 08/04/2026" sim={464} nao={16} legenda="Câmara dos Deputados · PEC 383/2017" entra={0} />
        </Sequence>
        <Sequence from={r(2)} layout="none">
          <Placar x={1150} y={140} titulo="2º TURNO · 28/04/2026" sim={444} nao={12} legenda="Câmara dos Deputados · PEC 383/2017" entra={0} />
        </Sequence>
      </Sequence>
      <Sequence from={r(3)} durationInFrames={r(4) - r(3)} layout="none">
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 70, gap: 20 }}>
          <div data-foco="título RCL" style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 40, letterSpacing: 5, color: cores.papelEscuro }}>PARCELA DA RECEITA CORRENTE LÍQUIDA PARA O SUAS</div>
          <div data-foco="degraus" style={{ display: "flex", alignItems: "flex-end", gap: 50, height: 470 }}>
            {degraus.map((d) => {
              const p = interpolate(frame, [d.f, d.f + 20], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.7, 0.2, 1) });
              return (
                <div key={d.a} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 250 }}>
                  <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 60, color: OURO, opacity: p }}>{String(d.v).replace(".", ",")}%</div>
                  <div style={{ width: 200, height: 330 * d.v * p, backgroundColor: OURO }} />
                  <div style={{ fontFamily: fontes.rotulo, fontSize: 34, color: cores.papel }}>{d.a}</div>
                </div>
              );
            })}
          </div>
          <Aparece f={20}><Fonte texto="União, estados, Distrito Federal e municípios · Agência Câmara, 28/04/2026" /></Aparece>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={r(4)} durationInFrames={r(6) - r(4)} layout="none">
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 90, gap: 40 }}>
          <div style={{ display: "flex", gap: 50 }}>
            {["BOLSA FAMÍLIA", "BPC", "OUTRAS TRANSFERÊNCIAS"].map((c, i) => (
              <div key={c} style={{ position: "relative", width: 480, height: 320 }}>
                <div data-foco={`cartão ${c}`} style={{ padding: "30px 30px", backgroundColor: "#efe6cf", boxShadow: "0 16px 24px rgba(0,0,0,0.6)", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 40, color: "#2a221d", textAlign: "center", whiteSpace: "nowrap" }}>{c}</div>
                <Carimbo x={240} y={250} texto="NÃO PODE" entra={30 + i * 20} rotacao={-5} tamanho={52} />
              </div>
            ))}
          </div>
          <Sequence from={r(5) - r(4)} layout="none">
            <Contador valor={4.95} casas={2} prefixo="R$ " sufixo=" bi" entra={0} rotulo="previstos no 1º ano, só na União (0,3% da RCL projetada de R$ 1,65 tri)" tamanho={110} cor={OURO} />
          </Sequence>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={r(6)} durationInFrames={r(8) - r(6)} layout="none">
        <Centro linha gap={60} reserva={0} cobre>
          <SeloPEC entra={10} linhas={["PEC", "383/2017", "7/2026"]} tamanho={360} />
          <Pauta abre={20} titulo="SENADO FEDERAL · SITUAÇÃO" linhas={["PEC 7/2026", "AGUARDANDO DESPACHO", "29/09/2026"]} destaque={1} marca={r(7) - r(6)} largura={760} />
          <Ampulheta entra={0} duracao={99999} altura={420} />
        </Centro>
      </Sequence>
      <Sequence from={r(8)} layout="none">
        <AbsoluteFill data-cobre style={{ backgroundColor: "#060504", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 60 }}>
          <div style={{ filter: "grayscale(1) brightness(0.5)" }}>
            <PainelSenhas numero={1} rolaDe={1} entra={-30} largura={760} />
          </div>
          <div style={{ position: "relative", width: 900, height: 160 }}>
            <Carimbo x={450} y={80} texto="AINDA NÃO É LEI" entra={0} rotacao={-4} tamanho={80} cor={CINZA} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </Fundo>
  );
};

// C6–C10: as respostas (frames relativos)
const ELOS = ["CONSTITUINTE · 1988", "LEI VETADA · 1990", "LOAS · 1993", "CONFERÊNCIA · 2003", "LEI 12.435 · 2011"];
const P6: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  const frame = useCurrentFrame();
  const eloF = (i: number) => r(12) + i * 70;
  return (
    <Fundo>
      <Sequence durationInFrames={r(13)} layout="none">
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 100 }}>
          <div data-foco="pergunta quem criou" style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 80, letterSpacing: 6, color: cores.papel, opacity: interpolate(frame, [-10, 0], [0, 1], clamp) }}>QUEM CRIOU?</div>
          <div data-foco="resposta" style={{ marginTop: 20, fontFamily: fontes.maquina, fontSize: 48, color: OURO, opacity: interpolate(frame, [r(11), r(11) + 10], [0, 1], clamp) }}>não foi uma pessoa</div>
        </AbsoluteFill>
        {ELOS.map((e, i) => (
          <div key={e} data-foco={`elo ${e}`} style={{ position: "absolute", left: 60 + i * 370, top: 480 + (i % 2) * 90, width: 330, padding: "22px 10px", backgroundColor: "#efe6cf", boxShadow: "0 14px 20px rgba(0,0,0,0.6)", fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 36, color: "#2a221d", textAlign: "center", opacity: interpolate(frame, [eloF(i), eloF(i) + 10], [0, 1], clamp), rotate: `${[-2, 1.5, -1, 2, -1.5][i]}deg` }}>{e}</div>
        ))}
        <svg data-sobrepor-ok width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          {ELOS.slice(1).map((_, i) => (
            <Fio key={i} de={[60 + i * 370 + 330, 520 + (i % 2) * 90]} ate={[60 + (i + 1) * 370, 520 + ((i + 1) % 2) * 90]} entra={eloF(i + 1) - 10} duracao={14} />
          ))}
        </svg>
      </Sequence>
      <Sequence from={r(13)} durationInFrames={r(15) - r(13)} layout="none">
        <div style={{ position: "absolute", left: 90, top: 60 }}>
          <CasaTresAndares entra={-8} largura={760} andares={[
            { rotulo: "BÁSICA", sub: "CRAS", f: 0, cor: "90,160,255" },
            { rotulo: "ESPECIAL · MÉDIA", sub: "CREAS", f: 10, cor: "224,180,60" },
            { rotulo: "ESPECIAL · ALTA", sub: "acolhimento", f: 20, cor: "200,32,30" },
          ]} />
        </div>
        <div style={{ position: "absolute", left: 950, top: 90, width: 880, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <Contador valor={8500} prefixo="≈ " entra={r(14) - r(13)} rotulo="CRAS" tamanho={90} cor={cores.branco} />
          <Contador valor={2883} entra={r(14) - r(13) + 50} rotulo="CREAS" tamanho={90} cor={cores.branco} />
          <Contador valor={255} entra={r(14) - r(13) + 100} rotulo="Centros POP" tamanho={90} cor={cores.branco} />
          <Contador valor={553971} entra={r(14) - r(13) + 150} rotulo="trabalhadores no sistema" tamanho={90} cor={OURO} />
        </div>
      </Sequence>
      <Sequence from={r(15)} durationInFrames={r(19) - r(15)} layout="none">
        <Centro gap={30} reserva={170}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 160 }}>
            <TubosNiveis entra={-40} largo={{ v: 1, rotulo: "BPC · 93%" }} estreito={{ v: 0.022, rotulo: "SERVIÇOS ≈ 2%" }} />
            <Cadeado abre={r(17) - r(15) + 40} rotulo="SEM PISO" rotuloAberto="PISO" />
          </div>
          <Sequence from={r(17) - r(15)} layout="none">
            <Etiqueta a="SE A PEC PASSAR" b="piso na Constituição" simbolo="·" entra={30} />
          </Sequence>
        </Centro>
      </Sequence>
      <Sequence from={r(19)} layout="none">
        <Centro linha gap={60} reserva={0}>
          {[
            { tt: "FALHAS MEDIDAS", itens: ["financiamento instável", "dependência de emendas", "trabalho precário", "fila do BPC", "pouca avaliação de resultado"], f: r(20) - r(19) },
            { tt: "CONQUISTAS MEDIDAS", itens: ["rede em quase todos os municípios", "benefício bem focalizado", "cadastro de 43 milhões de famílias"], f: r(21) - r(19) },
          ].map((c) => (
            <div key={c.tt} data-foco={`coluna ${c.tt}`} style={{ width: 760, height: 620, padding: "40px 44px", border: `3px solid ${cores.papelEscuro}`, backgroundColor: "rgba(10,8,7,0.5)", display: "flex", flexDirection: "column", gap: 22, boxSizing: "border-box" }}>
              <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 52, letterSpacing: 4, color: cores.papel }}>{c.tt}</div>
              {c.itens.map((it, i) => (
                <div key={it} style={{ fontFamily: fontes.maquina, fontSize: 40, color: cores.papelEscuro, opacity: interpolate(frame, [c.f + i * 24, c.f + i * 24 + 10], [0, 1], clamp) }}>· {it}</div>
              ))}
            </div>
          ))}
        </Centro>
      </Sequence>
    </Fundo>
  );
};

// C11–C12: o painel e as duas frases (sem legenda)
const P11: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  const frame = useCurrentFrame();
  const f1 = "A Constituição já decidiu que assistência social não é favor.";
  const f2 = "Falta o Congresso decidir quanto dinheiro esse direito terá.";
  return (
    <AbsoluteFill data-cobre style={{ backgroundColor: "#050404", justifyContent: "center", alignItems: "center" }}>
      <Sequence durationInFrames={r(23)} layout="none">
        <div style={{ scale: String(interpolate(frame, [0, r(23)], [1, 1.15], clamp)) }}>
          <PainelSenhas numero={1} rolaDe={0} entra={0} largura={900} />
        </div>
      </Sequence>
      <Sequence from={r(23)} layout="none">
        <div style={{ display: "flex", flexDirection: "column", gap: 50, width: 1500 }}>
          <div data-foco="frase 1" style={{ fontFamily: fontes.jornal, fontWeight: 900, fontSize: 64, lineHeight: 1.25, color: cores.branco, minHeight: 170 }}>{escreve(frame, f1, r(23) + 5)}</div>
          <div data-foco="frase 2" style={{ fontFamily: fontes.jornal, fontWeight: 900, fontSize: 64, lineHeight: 1.25, color: OURO, minHeight: 170 }}>{escreve(frame, f2, r(24) + 5)}</div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

// C13: tela final com créditos
const CREDITOS = [
  "FOTOS · Wikimedia Commons",
  "Constituinte (1987–1988) · Senado Federal / Célio Azevedo · CC BY 2.0",
  "Encerramento das votações, 22/09/1988 · Senado Federal · CC BY 2.0",
  "Itamar Franco · Radiobrás (Arquivo Nacional) · CC BY 3.0 BR",
  "Dilma Rousseff · Roberto Stuckert Filho/PR · CC BY-SA 2.0",
  "Santa Casa de Misericórdia de Vitória · Jgdallorto · CC BY-SA 4.0",
  "Narração sintética · trilha e efeitos originais",
];
const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const linhas = ["Fontes oficiais e estudos na descrição.", "Cadastro Único e serviços: procure o CRAS do seu município.", "Veja também: “Bolsa Família: esmola ou solução?” e o vídeo sobre o SUS."];
  const rola = interpolate(frame, [110, 290], [0, 1], clamp);
  return (
    <AbsoluteFill data-cobre style={{ backgroundColor: "#000" }}>
      <div style={{ position: "absolute", left: 0, top: 170, width: 1920, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        {linhas.map((l, i) => (
          <div key={l} data-foco={`final ${i}`} style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: i === 0 ? 52 : 44, color: i === 2 ? OURO : cores.papel, opacity: interpolate(frame, [i * 30 - 12, i * 30], [0, 1], clamp), maxWidth: 1700, textAlign: "center" }}>{l}</div>
        ))}
      </div>
      <div data-corte-ok data-sobrepor-ok style={{ position: "absolute", left: 0, top: 540, width: 1920, height: 460, overflow: "hidden", opacity: interpolate(frame, [100, 115], [0, 1], clamp) }}>
        <div style={{ position: "absolute", left: 0, width: 1920, top: 460 - rola * 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          {CREDITOS.map((c, i) => (
            <div key={c} style={{ fontFamily: fontes.maquina, fontSize: i === 0 ? 34 : 30, color: i === 0 ? cores.papel : CINZA }}>{c}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Bloco12: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: cores.cortica }}>
    <Sequence name="C1–C5 · PEC" durationInFrames={t(9)}><P1 inicio={0} /></Sequence>
    <Sequence name="C6–C10 · respostas" from={t(9)} durationInFrames={t(22) - t(9)}><P6 inicio={t(9)} /></Sequence>
    <Sequence name="C11–C12 · fecho" from={t(22)} durationInFrames={FINAL - t(22)}><P11 inicio={t(22)} /></Sequence>
    <Sequence name="C13 · tela final" from={FINAL}><Final /></Sequence>
    <Legenda cues={C} ocultar={[[0, t(3)], [t(5), t(6)], [t(6), t(13)], [t(19), DURACAO_12]]} />

    <Audio src={staticFile("audio/12.mp3")} />
    <Trilha arquivo="sfx/votacao.mp3" de={0} ate={t(8)} volume={0.24} fade={30} />
    <Trilha arquivo="sfx/desfecho.mp3" de={t(9)} ate={t(15)} volume={0.22} fade={40} />
    <Trilha arquivo="sfx/balanco.mp3" de={t(15)} ate={t(17)} volume={0.18} fade={20} />
    <Trilha arquivo="sfx/constituinte.mp3" de={t(17)} ate={t(22)} volume={0.22} fade={40} />
    <Trilha arquivo="sfx/comocao.mp3" de={t(22)} ate={FIM + 20} volume={0.26} fade={60} />
    <Trilha arquivo="sfx/desfecho.mp3" de={FINAL} ate={DURACAO_12} volume={0.18} fade={60} />
    <Efeito arquivo="sfx/urna-bip.mp3" em={t(1)} volume={0.45} duracao={30} />
    <Efeito arquivo="sfx/urna-bip.mp3" em={t(2)} volume={0.45} duracao={30} />
    <Efeito arquivo="sfx/sino-conferencia.mp3" em={t(2) + 40} volume={0.3} duracao={50} />
    {[60, 140, 220, 300].map((f) => <Efeito key={f} arquivo="sfx/clique.mp3" em={t(3) + f} volume={0.35} duracao={8} />)}
    {[30, 50, 70].map((f) => <Efeito key={`c${f}`} arquivo="sfx/carimbo.mp3" em={t(4) + f} volume={0.45} duracao={15} />)}
    <Efeito arquivo="sfx/riser.mp3" em={t(6) - 20} volume={0.35} duracao={30} />
    <Efeito arquivo="sfx/impacto.mp3" em={t(6) + 10} volume={0.45} />
    <Efeito arquivo="sfx/tique-parede.mp3" em={t(6) + 30} volume={0.3} duracao={90} />
    {[0, 1, 2, 3, 4].map((i) => <Efeito key={`e${i}`} arquivo="sfx/clique.mp3" em={t(12) + i * 70} volume={0.35} duracao={8} />)}
    {[0, 50, 100, 150].map((f) => <Efeito key={`d${f}`} arquivo="sfx/ding-senha.mp3" em={t(14) + f} volume={0.15} duracao={40} />)}
    <Efeito arquivo="sfx/sting.mp3" em={t(17) + 40} volume={0.35} duracao={30} />
    <Efeito arquivo="sfx/ding-senha.mp3" em={t(22) + 4} volume={0.5} duracao={60} />
  </AbsoluteFill>
);
