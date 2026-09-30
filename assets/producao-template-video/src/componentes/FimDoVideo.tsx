import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, Series, staticFile, useCurrentFrame } from "remotion";
import { ChamadaInscricao } from "./ChamadaInscricao";
import { Pelicula, Quadro } from "./Quadro";
import { Efeito, Trilha } from "./Trilha";
import { fontes as F } from "../tema";

// PADRÃO DO FIM DO VÍDEO (skill: references/07-tela-final-e-creditos.md e 13c §4c).
// Ordem: [bloco do fecho] → tela de FONTES (10–12 s) → tela final (linhas + créditos rolando + aviso de voz sintética)
//        com a chamada 3 por cima → som-assinatura → 2 s de silêncio → fade (branco no tema claro, preto nos escuros).
// Sem legenda e sem locução extra em fontes e créditos. A trilha de fecho continua baixa por baixo e sai em fade.
export type Paleta = { fundo: string; cartao: string; texto: string; secundario: string; destaque: string; marca: string; sombra: string };
export type ConfigFim = {
  paleta: Paleta;
  fontes: [string, string][]; // 8 a 12 fontes principais: [órgão/grupo, documento]
  linhas: [string, string, string]; // "Fontes oficiais e estudos na descrição." · linha de serviço · "Veja também: …"
  creditos: string[]; // uma linha por imagem usada (vazio = sem fotos)
  aviso?: string; // sempre "Narração sintética · trilha e efeitos originais"
  trilha: string; // trilha de fecho (sfx/…)
  assinatura: string; // som-assinatura do tema (sfx/…)
  cta: { audio: string; segundos: number };
  fadePara: "branco" | "preto";
};
export const DUR_FONTES = 360; // 12 s
const ANTES_CTA = 120; // tela final aparece sozinha por 4 s antes da chamada
const CAUDA = 90; // assinatura + 2 s de silêncio + fade
export const duracaoTelaFinal = (cfg: ConfigFim) => ANTES_CTA + Math.max(250, Math.ceil(cfg.cta.segundos * 30) + 60) + CAUDA;
export const duracaoFim = (cfg: ConfigFim) => DUR_FONTES + duracaoTelaFinal(cfg);

const ap = (f: number, a: number, d = 12) => interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const TelaFontes: React.FC<{ cfg: ConfigFim }> = ({ cfg }) => {
  const f = useCurrentFrame();
  const p = cfg.paleta;
  return (
    <AbsoluteFill style={{ backgroundColor: p.fundo }}>
      <Quadro />
      <AbsoluteFill data-cobre data-pausa-ok style={{ padding: "80px 150px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div data-foco="título fontes" style={{ opacity: ap(f, 0), fontFamily: F.titulo, fontWeight: 900, fontSize: 84, color: p.marca, whiteSpace: "nowrap" }}>FONTES DESTE DOCUMENTÁRIO</div>
        <div style={{ opacity: ap(f, 6), fontFamily: F.texto, fontWeight: 500, fontSize: 30, color: p.secundario, whiteSpace: "nowrap" }}>Lista completa, com links, na descrição e no comentário fixado.</div>
        <div data-foco="lista de fontes" style={{ marginTop: 10, backgroundColor: p.cartao, boxShadow: p.sombra, borderRadius: 10, padding: "30px 44px", display: "flex", flexDirection: "column", gap: 10 }}>
          {cfg.fontes.map(([a, b], i) => (
            <div key={a} style={{ opacity: ap(f, 16 + i * 10), translate: `${(1 - ap(f, 16 + i * 10)) * 24}px 0`, display: "flex", gap: 24, alignItems: "baseline" }}>
              <div style={{ width: 560, flexShrink: 0, fontFamily: F.titulo, fontWeight: 800, fontSize: 34, color: p.texto, whiteSpace: "nowrap" }}>{a}</div>
              <div style={{ fontFamily: F.texto, fontWeight: 500, fontSize: 26, color: p.secundario, lineHeight: 1.25 }}>{b}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Pelicula />
    </AbsoluteFill>
  );
};

export const TelaFinal: React.FC<{ cfg: ConfigFim; dur: number }> = ({ cfg, dur }) => {
  const f = useCurrentFrame();
  const p = cfg.paleta;
  const aviso = cfg.aviso ?? "Narração sintética · trilha e efeitos originais";
  const cred = [...(cfg.creditos.length ? ["FOTOS · Wikimedia Commons", ...cfg.creditos] : []), aviso];
  const rola = interpolate(f, [20, dur - CAUDA], [0, Math.max(0, cred.length * 40 - 120)], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fade = interpolate(f, [dur - 20, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: p.fundo }}>
      <Quadro />
      <AbsoluteFill data-cobre data-pausa-ok style={{ alignItems: "center", justifyContent: "center", gap: 30, paddingBottom: 220 }}>
        {cfg.linhas.map((l, i) => (
          <div key={i} data-foco={`linha final ${i}`} style={{ opacity: ap(f, 8 + i * 30), translate: `0 ${(1 - ap(f, 8 + i * 30)) * 20}px`, fontFamily: i === 2 ? F.titulo : F.texto, fontWeight: i === 2 ? 800 : 600, fontSize: i === 2 ? 44 : 40, color: i === 2 ? p.destaque : p.texto, whiteSpace: "nowrap" }}>
            {l}
          </div>
        ))}
      </AbsoluteFill>
      {/* créditos rolando embaixo, fonte mono; a última linha é sempre o aviso de voz sintética */}
      <div data-foco="créditos" data-corte-ok style={{ position: "absolute", left: 0, right: 0, bottom: 70, height: 160, overflow: "hidden", opacity: ap(f, 40) }}>
        <div style={{ translate: `0 ${-rola}px`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          {cred.map((l, i) => (
            <div key={i} style={{ fontFamily: F.mono, fontSize: 26, color: i === cred.length - 1 ? p.texto : p.secundario, whiteSpace: "nowrap" }}>{l}</div>
          ))}
        </div>
      </div>
      <Pelicula />
      <AbsoluteFill style={{ backgroundColor: cfg.fadePara === "branco" ? "#FFFFFF" : "#000000", opacity: fade }} />
    </AbsoluteFill>
  );
};

// Monta o fim: bloco do fecho + FONTES + tela final com a chamada 3 por cima + assinatura + silêncio + fade.
export const comFim = (Bloco: React.FC, duracaoBloco: number, cfg: ConfigFim): React.FC => {
  const dFinal = duracaoTelaFinal(cfg);
  const dCta = dFinal - ANTES_CTA - CAUDA;
  const Comp: React.FC = () => (
    <Series>
      <Series.Sequence durationInFrames={duracaoBloco}><Bloco /></Series.Sequence>
      <Series.Sequence durationInFrames={DUR_FONTES}>
        <TelaFontes cfg={cfg} />
        <Trilha arquivo={cfg.trilha} de={0} ate={DUR_FONTES} volume={0.16} fade={30} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={dFinal}>
        <TelaFinal cfg={cfg} dur={dFinal} />
        <Trilha arquivo={cfg.trilha} de={0} ate={dFinal - CAUDA + 10} volume={0.12} fade={40} />
        <Sequence from={ANTES_CTA} durationInFrames={dCta}>
          <ChamadaInscricao duracao={dCta} />
          <Sequence from={10}><Audio src={staticFile(cfg.cta.audio)} /></Sequence>
          <Efeito arquivo="sfx/whoosh.mp3" em={0} volume={0.3} duracao={15} />
          <Efeito arquivo="sfx/clique.mp3" em={40} volume={0.5} duracao={10} />
          <Efeito arquivo="sfx/whoosh.mp3" em={dCta - 14} volume={0.25} duracao={14} />
        </Sequence>
        {/* som-assinatura uma vez, depois 2 s de silêncio e o fade */}
        <Efeito arquivo={cfg.assinatura} em={dFinal - CAUDA} volume={0.4} duracao={40} />
      </Series.Sequence>
    </Series>
  );
  return Comp;
};
