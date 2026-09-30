import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Contador } from "../componentes/Contador";
import { Folha, Marca } from "../componentes/Documento";
import { Etiqueta } from "../componentes/Etiqueta";
import { AbrigoSilhueta, AMBAR, CasaTresAndares, PainelSenhas, PlacaCRAS } from "../componentes/KitSUAS";
import { Legenda } from "../componentes/Legenda";
import { MapaBrasil } from "../componentes/MapaBrasil";
import { Pelicula, Quadro } from "../componentes/Quadro";
import { Efeito, Trilha } from "../componentes/Trilha";
import cues from "../data/cues.json";
import mapa from "../data/mapa.json";
import { cores, fontes, ms } from "../tema";

const C = cues["08"];
const t = (i: number) => ms(C[i].de);
const FIM = ms(C[C.length - 1].ate);
const FECHO = { de: t(22), fim: FIM + 60 }; // painel sobe até 0100 e vira pontos; 2 s de silêncio no fim
export const DURACAO_08 = FECHO.fim + 60;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OURO = "#e0b43c";
const rnd = (v: number) => {
  const q = Math.sin(v * 12.9898 + 78.233) * 43758.5453;
  return q - Math.floor(q);
};

// Fundo mais escuro: bloco de comoção
const Fundo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: cores.cortica }}>
    <Quadro />
    <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.35)" }} />
    {children}
    <Pelicula />
  </AbsoluteFill>
);
const Centro: React.FC<{ children: React.ReactNode; gap?: number; linha?: boolean; reserva?: number; cobre?: boolean }> = ({ children, gap = 40, linha, reserva = 200, cobre }) => (
  <AbsoluteFill data-cobre={cobre ? true : undefined} style={{ justifyContent: "center", alignItems: "center", flexDirection: linha ? "row" : "column", gap, paddingBottom: reserva }}>{children}</AbsoluteFill>
);
const Fonte: React.FC<{ texto: string }> = ({ texto }) => (
  <div data-foco={`fonte: ${texto}`} style={{ fontFamily: fontes.rotulo, fontSize: 30, letterSpacing: 3, color: cores.papelEscuro }}>{texto}</div>
);
const Aparece: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => {
  const frame = useCurrentFrame();
  return <div style={{ opacity: interpolate(frame, [f, f + 12], [0, 1], clamp) }}>{children}</div>;
};
const Titulo: React.FC<{ texto: string }> = ({ texto }) => (
  <div data-foco={`tema ${texto}`} style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 64, letterSpacing: 10, color: cores.papel }}>{texto}</div>
);

// Mapa com 255 pontos (Centros POP, distribuição ilustrativa por estado)
const MapaPOP: React.FC<{ entra: number }> = ({ entra }) => {
  const frame = useCurrentFrame();
  return (
    <svg data-foco="mapa centros POP" width={700} height={700} viewBox={`0 0 ${mapa.w} ${mapa.h}`} style={{ overflow: "visible" }}>
      {mapa.estados.map((e) => <path key={e.sigla} d={e.d} fill="rgba(255,255,255,0.03)" stroke={cores.papelEscuro} strokeOpacity={0.35} strokeWidth={2.2} />)}
      {Array.from({ length: 255 }, (_, i) => {
        const e = mapa.estados[i % mapa.estados.length];
        const f = entra + i * 0.35;
        return <circle key={i} cx={e.c[0] + (rnd(i) - 0.5) * 80} cy={e.c[1] + (rnd(i + 300) - 0.5) * 80} r={interpolate(frame, [f, f + 6], [0, 5.5], clamp)} fill={OURO} />;
      })}
    </svg>
  );
};

// Chuva em traço
const Chuva: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg data-sobrepor-ok width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 90 }, (_, i) => {
        const x = rnd(i) * 1920;
        const y = ((rnd(i + 50) * 1080 + frame * (18 + rnd(i + 9) * 8)) % 1160) - 80;
        return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 36} stroke="#9fb3c8" strokeOpacity={0.35} strokeWidth={2} />;
      })}
    </svg>
  );
};

// C1–C4: abertura e pessoas em situação de rua (frames relativos)
const P1: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  const frame = useCurrentFrame();
  const frase = "NENHUM PERSONAGEM. SÓ DOCUMENTOS.";
  const cresce = (de: number) => interpolate(frame, [r(5) + 120 + de, r(5) + 150 + de], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.7, 0.2, 1) });
  return (
    <Fundo>
      <Sequence durationInFrames={r(3)} layout="none">
        <AbsoluteFill data-cobre style={{ backgroundColor: "#050404", justifyContent: "center", alignItems: "center", gap: 70, flexDirection: "column" }}>
          <div data-foco="frase sem personagens" style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 70, letterSpacing: 8, color: cores.branco, minHeight: 90 }}>{frase.slice(0, Math.max(0, Math.floor((frame - r(1)) * 0.9)))}</div>
          <PainelSenhas numero={1} rolaDe={0} entra={r(2)} largura={560} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={r(3)} durationInFrames={r(5) - r(3)} layout="none">
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 90 }}><Titulo texto="PESSOAS EM SITUAÇÃO DE RUA" /></AbsoluteFill>
        <Centro cobre reserva={0}>
          <div style={{ rotate: "-1deg", marginTop: 80 }}>
            <Folha largura={1500}>
              <div style={{ fontSize: 30, letterSpacing: 4, textAlign: "center" }}>IPEA · NOTA TÉCNICA Nº 103</div>
              <div style={{ fontSize: 46 }}>
                (...) <Marca entra={r(4) - r(3) + 10}>O Brasil não conta com dados oficiais sobre o número de pessoas em situação de rua</Marca> (...)
              </div>
            </Folha>
          </div>
        </Centro>
      </Sequence>
      <Sequence from={r(5)} durationInFrames={r(6) - r(5)} layout="none">
        <Centro linha gap={120}>
          <Contador valor={281472} prefixo="≈ " entra={-6} rotulo="pessoas em situação de rua · estimativa Ipea 2022" tamanho={130} cor={cores.branco} />
          <div data-foco="comparação anos" style={{ display: "flex", alignItems: "flex-end", gap: 36, height: 420 }}>
            {[
              { a: "2012", v: 1 / 3.11, n: "" },
              { a: "2019", v: 1 / 1.38, n: "+211% até 2022" },
              { a: "2022", v: 1, n: "+38% vs 2019" },
            ].map((b, i) => (
              <div key={b.a} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 170 }}>
                <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 26, color: OURO, opacity: cresce(i * 20), textAlign: "center", minHeight: 60 }}>{i === 0 ? "" : i === 1 ? "" : "+38% vs 2019 · +211% vs 2012"}</div>
                <div style={{ width: 110, height: 300 * b.v * cresce(i * 20), backgroundColor: i === 2 ? OURO : "#8a8279" }} />
                <div style={{ fontFamily: fontes.rotulo, fontSize: 34, color: cores.papel }}>{b.a}</div>
              </div>
            ))}
          </div>
        </Centro>
      </Sequence>
      <Sequence from={r(6)} durationInFrames={r(7) - r(6)} layout="none">
        <Centro cobre reserva={0}>
          <div style={{ rotate: "1deg" }}>
            <Folha largura={1500}>
              <div style={{ fontSize: 30, letterSpacing: 4, textAlign: "center" }}>STF · ADPF 976 · JULHO DE 2023</div>
              <div style={{ fontSize: 44 }}>
                (...) <Marca entra={40}>proibir o recolhimento forçado de bens e pertences, a remoção e o transporte compulsório de pessoas em situação de rua e o emprego de técnicas de arquitetura hostil</Marca> (...)
              </div>
            </Folha>
          </div>
        </Centro>
      </Sequence>
      <Sequence from={r(7)} layout="none">
        <div style={{ position: "absolute", left: 160, top: 70 }}><MapaPOP entra={0} /></div>
        <div style={{ position: "absolute", left: 1000, top: 200, width: 820, display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
          <Contador valor={255} entra={0} rotulo="Centros POP no país" tamanho={140} cor={OURO} />
          <Aparece f={70}><Etiqueta a="96% DOS MUNICÍPIOS" b="sem Centro POP" simbolo="·" entra={70} /></Aparece>
          <Fonte texto="Censo SUAS 2024 · pontos distribuídos de forma ilustrativa" />
        </div>
      </Sequence>
    </Fundo>
  );
};

// C5–C7: crianças, violência e CREAS (frames relativos)
const P5: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  return (
    <Fundo>
      <Sequence durationInFrames={r(12)} layout="none">
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 }}><Titulo texto="CRIANÇAS E ADOLESCENTES" /></AbsoluteFill>
        <div style={{ position: "absolute", left: 170, top: 230 }}><AbrigoSilhueta acende={20} tamanho={560} /></div>
        <div style={{ position: "absolute", left: 900, top: 230, width: 900, display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
          <Sequence from={r(9)} layout="none">
            <Contador valor={1.65} casas={2} sufixo=" milhão" entra={0} rotulo="em trabalho infantil, 5 a 17 anos (2024)" tamanho={110} cor={cores.branco} />
          </Sequence>
          <Sequence from={r(10)} layout="none">
            <Etiqueta a="−21,4%" b="em relação a 2016" simbolo="·" entra={0} />
          </Sequence>
          <Sequence from={r(11) + 30} layout="none">
            <Contador valor={34820} entra={0} rotulo="em acolhimento (CNJ, 26/03/2020)" tamanho={110} cor={OURO} />
          </Sequence>
        </div>
      </Sequence>
      <Sequence from={r(12)} durationInFrames={r(16) - r(12)} layout="none">
        <AbsoluteFill data-cobre style={{ backgroundColor: "#070605", alignItems: "center", paddingTop: 90, gap: 60 }}>
          <Titulo texto="VIOLÊNCIA" />
          <div style={{ display: "flex", flexDirection: "column", gap: 44, alignItems: "center" }}>
            <Sequence from={r(13) - r(12)} layout="none">
              <Contador valor={1571} entra={0} rotulo="feminicídios · 2025" tamanho={100} cor={cores.branco} />
            </Sequence>
            <Sequence from={r(13) - r(12) + 150} layout="none">
              <Contador valor={84388} entra={0} rotulo="estupros e estupros de vulnerável · 2025" tamanho={100} cor={cores.branco} />
            </Sequence>
            <Sequence from={r(14) - r(12)} layout="none">
              <Contador valor={60.3} casas={1} sufixo="%" entra={0} rotulo="das vítimas de estupro tinham até 13 anos" tamanho={100} cor={cores.vermelho} />
            </Sequence>
          </div>
          <div style={{ position: "absolute", bottom: 60, display: "flex", gap: 40 }}>
            <Fonte texto="registros policiais · Anuário do FBSP 2026" />
            <Fonte texto="números, sem imagens" />
          </div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={r(16)} layout="none">
        <div style={{ position: "absolute", left: 110, top: 50 }}>
          <CasaTresAndares entra={-8} largura={800} andares={[
            { rotulo: "BÁSICA", sub: "CRAS", f: 9999, cor: "90,160,255" },
            { rotulo: "ESPECIAL · MÉDIA", sub: "CREAS · PAEFI", f: 20, cor: "224,180,60" },
            { rotulo: "ESPECIAL · ALTA", sub: "acolhimento", f: 9999, cor: "200,32,30" },
          ]} />
        </div>
        <div style={{ position: "absolute", left: 1010, top: 170, width: 820, display: "flex", flexDirection: "column", gap: 26, alignItems: "flex-start" }}>
          <Contador valor={650} prefixo="+ de " sufixo=" mil" entra={60} rotulo="denúncias ao Disque 100 (2024)" tamanho={100} cor={cores.branco} />
          <Aparece f={110}><Etiqueta a="CRIANÇAS E ADOLESCENTES" b="289 mil" simbolo="·" entra={110} /></Aparece>
          <Aparece f={140}><Etiqueta a="PESSOAS IDOSAS" b="180 mil" simbolo="·" entra={140} /></Aparece>
        </div>
      </Sequence>
    </Fundo>
  );
};

// C8–C9: calamidade e pandemia (frames relativos)
const P8: React.FC<{ inicio: number }> = ({ inicio }) => {
  const r = (i: number) => t(i) - inicio;
  return (
    <Fundo>
      <Sequence durationInFrames={r(19)} layout="none">
        <Chuva />
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 60 }}><Titulo texto="CALAMIDADE · RS · MAIO DE 2024" /></AbsoluteFill>
        <MapaBrasil x={200} y={140} tamanho={560} entra={-20} destaques={[{ sigla: "RS", cor: "#5a8fc4", entra: 0 }]} />
        <div style={{ position: "absolute", left: 1060, top: 200, width: 760, display: "flex", flexDirection: "column", gap: 34, alignItems: "flex-start", backgroundColor: "rgba(8,6,5,0.7)", padding: 30 }}>
          <Contador valor={141.26} casas={2} prefixo="R$ " sufixo=" mi" entra={40} rotulo="liberados com uso flexível" tamanho={90} cor={cores.branco} />
          <Aparece f={140}><Etiqueta a="497 MUNICÍPIOS" b="+ o estado" simbolo="·" entra={140} /></Aparece>
          <Aparece f={220}><Etiqueta a="+180 PROFISSIONAIS" b="enviados" simbolo="·" entra={220} /></Aparece>
        </div>
      </Sequence>
      <Sequence from={r(19)} layout="none">
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 60 }}><Titulo texto="PANDEMIA" /></AbsoluteFill>
        <div style={{ position: "absolute", left: 120, top: 230, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, filter: "grayscale(0.7) brightness(0.7)" }}>
          <PlacaCRAS acende={9999} largura={560} />
          <Sequence from={r(20) - r(19)} layout="none">
            <Etiqueta a="SUSPENSO" b="maior parte dos CRAS" simbolo="·" entra={0} />
          </Sequence>
        </div>
        <Sequence from={r(21) - r(19)} layout="none">
          <div style={{ position: "absolute", left: 900, top: 200, display: "flex", alignItems: "center", gap: 40 }}>
            <div data-foco="celular auxílio" style={{ width: 260, height: 480, borderRadius: 40, border: "10px solid #1b1714", backgroundColor: "#0e0c0b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, boxShadow: "0 24px 40px rgba(0,0,0,0.7)" }}>
              <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 30, color: cores.papel, textAlign: "center" }}>AUXÍLIO EMERGENCIAL</div>
              <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 58, color: "#32bcad" }}>R$ 600</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 560, alignItems: "center" }}>
              <Contador valor={330.35} casas={2} prefixo="R$ " sufixo=" bi" entra={20} rotulo="todas as fases" tamanho={86} cor={OURO} />
              <Contador valor={68.77} casas={2} sufixo=" mi" entra={80} rotulo="pessoas, sobretudo por aplicativo" tamanho={86} cor={cores.branco} />
              <Fonte texto="TCU, Acórdão 3142/2021" />
            </div>
          </div>
        </Sequence>
      </Sequence>
    </Fundo>
  );
};

// C10: o painel sobe até 0100 e vira pontos (sem legenda, sem texto)
const Fecho: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = FECHO.fim - FECHO.de;
  const n = Math.round(interpolate(frame, [10, dur * 0.55], [1, 100], { ...clamp, easing: Easing.bezier(0.5, 0, 0.8, 1) }));
  const vira = interpolate(frame, [dur * 0.55, dur * 0.7], [0, 1], clamp);
  return (
    <AbsoluteFill data-cobre style={{ backgroundColor: "#050404", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: 1 - vira, scale: String(1 + 0.4 * vira) }}>
        <PainelSenhas key={n} numero={n} rolaDe={n} entra={-30} largura={1300} />
      </div>
      <div data-foco="grade de pontos" data-sobrepor-ok style={{ position: "absolute", display: "grid", gridTemplateColumns: "repeat(20, 56px)", gap: 22, opacity: vira }}>
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i} style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: AMBAR, opacity: interpolate(frame, [dur * 0.55 + i * 0.5, dur * 0.55 + i * 0.5 + 8], [0, 0.9], clamp), boxShadow: "0 0 14px rgba(255,59,47,0.6)" }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Bloco08: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: cores.cortica }}>
    <Sequence name="C1–C4 · abertura e rua" durationInFrames={t(8)}><P1 inicio={0} /></Sequence>
    <Sequence name="C5–C7 · crianças e violência" from={t(8)} durationInFrames={t(17) - t(8)}><P5 inicio={t(8)} /></Sequence>
    <Sequence name="C8–C9 · calamidade e pandemia" from={t(17)} durationInFrames={FECHO.de - t(17)}><P8 inicio={t(17)} /></Sequence>
    <Sequence name="C10 · fecho" from={FECHO.de}><Fecho /></Sequence>
    <Legenda cues={C} ocultar={[[0, t(3)], [t(4), t(5)], [t(6), t(7)], [t(12), t(16)], [FECHO.de, DURACAO_08]]} />

    <Audio src={staticFile("audio/08.mp3")} />
    <Trilha arquivo="sfx/comocao.mp3" de={0} ate={FECHO.fim} volume={0.26} fade={120} />
    <Efeito arquivo="sfx/ding-senha.mp3" em={t(2) + 4} volume={0.25} duracao={45} />
    <Efeito arquivo="sfx/ding-senha.mp3" em={t(3)} volume={0.2} duracao={45} />
    <Efeito arquivo="sfx/papel-virar.mp3" em={t(6)} volume={0.4} duracao={25} />
    <Efeito arquivo="sfx/ding-senha.mp3" em={t(7)} volume={0.2} duracao={45} />
    <Efeito arquivo="sfx/ding-senha.mp3" em={t(13)} volume={0.18} duracao={40} />
    <Efeito arquivo="sfx/ding-senha.mp3" em={t(13) + 150} volume={0.18} duracao={40} />
    <Efeito arquivo="sfx/ding-senha.mp3" em={t(14)} volume={0.18} duracao={40} />
    <Efeito arquivo="sfx/passos-corredor.mp3" em={t(16)} volume={0.25} duracao={120} />
    <Trilha arquivo="sfx/chuva-distante.mp3" de={t(17)} ate={t(19)} volume={0.2} fade={30} />
    <Efeito arquivo="sfx/estatica.mp3" em={t(19)} volume={0.25} duracao={12} />
    <Efeito arquivo="sfx/ding-senha.mp3" em={t(21)} volume={0.18} duracao={40} />
  </AbsoluteFill>
);
