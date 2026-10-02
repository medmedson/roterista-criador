import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import reels from "../data/reels.json";
import { Pelicula, Quadro } from "../componentes/Quadro";
import * as T from "../tema";

// REELS 1080×1920 — clipe do vídeo completo (legenda queimada recortada), título, LEGENDA DINÂMICA grande, chamada com logo e
// FECHAMENTO COERENTE: o clipe termina no fim de uma frase, faz fade e entra um cartão final (logo grande, nome do canal,
// símbolo do YouTube) com a voz "Assista ao vídeo completo no canal Contra Prova Brasil." Nunca corte seco.
// ZONA SEGURA do Instagram/Reels: nada importante abaixo de y≈1560 (perfil, nome e legenda do post) nem à direita de x≈940
// entre y 1000 e 1700 (botões curtir/comentar/compartilhar). Topo: nada acima de y≈170.

// Paleta/fontes do tema do projeto: temas novos exportam `c` (papel, azul, laranja, verde, tinta, cinza, branco) e `sombra`;
// o tema antigo (cortiça) só exporta `cores`: mapeamos para o equivalente escuro.
const antigo = (T as any).cores;
const c = ((T as any).c ?? {
  papel: antigo.cortica, azul: antigo.amarelo, laranja: antigo.amarelo, verde: antigo.amarelo,
  tinta: antigo.branco, cinza: antigo.papelEscuro, branco: "#2a211b",
}) as Record<"papel" | "azul" | "laranja" | "verde" | "tinta" | "cinza" | "branco", string>;
const sombra: string = (T as any).sombra ?? "0 18px 40px rgba(0,0,0,0.5)";
const F = (T as any).fontes;
const fontes = { titulo: F.titulo ?? F.rotulo, texto: F.texto ?? F.legenda, mono: F.mono ?? F.maquina };
const LEGENDA_FUNDO = (T as any).c ? "rgba(27,31,42,0.92)" : "rgba(8,6,5,0.88)";

const MAX = 42; // caracteres por trecho de legenda (2 linhas de ~21)
export const FINAL = 150; // quadros do cartão final (5 s)
export const dividir = (texto: string, max = MAX): string[] => {
  const t = texto.replace(/\s+/g, " ").trim();
  if (t.length <= max) return [t];
  const palavras = t.split(" ");
  const partes: string[] = [];
  let atual = "";
  for (const p of palavras) {
    const prox = atual ? `${atual} ${p}` : p;
    if (prox.length > max && atual) {
      partes.push(atual);
      atual = p;
    } else {
      atual = prox;
      if (/[.;:!?]$/.test(p) && atual.length >= 24) {
        partes.push(atual);
        atual = "";
      } else if (/,$/.test(p) && atual.length >= 32) {
        partes.push(atual);
        atual = "";
      }
    }
  }
  if (atual) partes.push(atual);
  if (partes.length > 1 && partes[partes.length - 1].length < 14 && partes[partes.length - 2].length + 1 + partes[partes.length - 1].length <= max + 8) {
    const u = partes.pop() as string;
    partes[partes.length - 1] += ` ${u}`;
  }
  return partes;
};
const trecho = (texto: string, de: number, ate: number, t: number): string => {
  const partes = dividir(texto);
  if (partes.length === 1) return partes[0];
  const total = partes.reduce((s, p) => s + p.length, 0);
  const k = Math.max(0, Math.min(0.9999, (t - de) / Math.max(0.01, ate - de)));
  let acc = 0;
  for (const p of partes) {
    acc += p.length / total;
    if (k < acc) return p;
  }
  return partes[partes.length - 1];
};

export const quadrosClipe = (i: number) => Math.ceil(reels[i].duracao * 30);
export const duracaoReel = (i: number) => quadrosClipe(i) + FINAL;

const IconeYouTube: React.FC<{ largura: number; pulso?: number }> = ({ largura, pulso = 0 }) => (
  <svg width={largura} height={largura * 0.7} viewBox="0 0 150 106" style={{ flexShrink: 0, scale: String(1 + 0.05 * pulso), filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.4))" }}>
    <rect x={2} y={2} width={146} height={102} rx={28} fill="#FF0000" />
    <polygon points="60,30 60,76 102,53" fill="#FFFFFF" />
  </svg>
);

export const Reel: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = reels[i] as (typeof reels)[number] & { completo?: string };
  const t = f / fps;
  const fimClipe = quadrosClipe(i);
  const noClipe = f < fimClipe;
  const cap = noClipe ? r.caps.find((x) => t >= x.de && t < x.ate) ?? null : null;
  const entra = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const saiClipe = interpolate(f, [fimClipe - 14, fimClipe], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const prog = Math.min(1, f / fimClipe);
  const fe = Math.max(0, f - fimClipe); // quadro dentro do cartão final
  const entraFim = interpolate(fe, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: c.papel }}>
      <Quadro />
      {noClipe ? (
        <AbsoluteFill style={{ opacity: saiClipe }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: `${prog * 100}%`, backgroundColor: c.azul }} />
          {/* título (abaixo da faixa de status do app) */}
          <div style={{ position: "absolute", left: 60, right: 140, top: 170, opacity: entra, translate: `0 ${(1 - entra) * -30}px`, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 30, letterSpacing: 5, color: c.cinza, whiteSpace: "nowrap" }}>DOCUMENTÁRIO · CONTRA PROVA BRASIL</div>
            <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 108, lineHeight: 0.98, color: c.azul }}>{r.titulo}</div>
            <div style={{ width: 150, height: 8, borderRadius: 4, backgroundColor: c.laranja }} />
            <div style={{ fontFamily: fontes.texto, fontWeight: 600, fontSize: 38, color: c.tinta }}>{r.sub}</div>
          </div>
          {/* clipe */}
          <div style={{ position: "absolute", left: 40, top: 560, width: 1000, height: 440, borderRadius: 20, overflow: "hidden", boxShadow: sombra, backgroundColor: c.branco }}>
            <OffthreadVideo src={staticFile(`reels/r${r.id}.mp4`)} style={{ width: 1000, height: 440, objectFit: "cover", objectPosition: "center top" }} volume={(q) => Math.min(1, Math.max(0, (fimClipe - q) / 12))} />
          </div>
          {/* legenda dinâmica */}
          <div style={{ position: "absolute", left: 90, width: 900, top: 1030, height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {cap ? (
              <div data-legenda style={{ backgroundColor: LEGENDA_FUNDO, color: "#FFFFFF", fontFamily: fontes.texto, fontWeight: 800, fontSize: 64, lineHeight: 1.16, textAlign: "center", padding: "22px 30px", borderRadius: 18, maxWidth: 900 }}>
                {trecho(cap.texto, cap.de, cap.ate, t)}
              </div>
            ) : null}
          </div>
          {/* chamada: logo + nome do canal + símbolo do YouTube (acima da zona do Instagram) */}
          <div style={{ position: "absolute", left: 110, width: 860, top: 1290, height: 220, display: "flex", alignItems: "center", gap: 22, padding: "0 28px", borderRadius: 26, backgroundColor: c.branco, boxShadow: sombra, borderLeft: `14px solid ${c.verde}` }}>
            <div style={{ width: 150, height: 150, borderRadius: 75, overflow: "hidden", flexShrink: 0, boxShadow: "0 0 0 6px rgba(255,255,255,0.18), 0 12px 30px rgba(0,0,0,0.45)", scale: String(1 + 0.025 * Math.sin(f / 12)) }}>
              <Img src={staticFile("marca/logo-cp-brasil.png")} style={{ width: 150, height: 150 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
              <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 52, lineHeight: 0.95, color: c.tinta, whiteSpace: "nowrap" }}>CONTRA PROVA BRASIL</div>
              <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 22, letterSpacing: 2, color: c.cinza, whiteSpace: "nowrap" }}>VÍDEO COMPLETO NO CANAL</div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <IconeYouTube largura={96} pulso={Math.sin(f / 9)} />
            </div>
          </div>
        </AbsoluteFill>
      ) : (
        /* cartão final: fechamento coerente com a voz */
        <AbsoluteFill style={{ opacity: entraFim, alignItems: "center", justifyContent: "flex-start" }}>
          <div style={{ marginTop: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, translate: `0 ${(1 - entraFim) * 40}px` }}>
            <div style={{ width: 380, height: 380, borderRadius: 190, overflow: "hidden", boxShadow: "0 0 0 12px rgba(255,255,255,0.2), 0 24px 60px rgba(0,0,0,0.5)", scale: String(0.9 + 0.1 * entraFim + 0.02 * Math.sin(fe / 10)) }}>
              <Img src={staticFile("marca/logo-cp-brasil.png")} style={{ width: 380, height: 380 }} />
            </div>
            <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 108, lineHeight: 0.95, color: c.tinta, whiteSpace: "nowrap" }}>CONTRA PROVA</div>
            <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 108, lineHeight: 0.95, color: c.azul, whiteSpace: "nowrap", marginTop: -24 }}>BRASIL</div>
            <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "18px 34px", borderRadius: 24, backgroundColor: c.branco, boxShadow: sombra }}>
              <IconeYouTube largura={120} pulso={Math.sin(fe / 8)} />
              <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 50, lineHeight: 1.0, color: c.tinta, whiteSpace: "nowrap" }}>
                ASSISTA AO VÍDEO
                <br />
                COMPLETO NO CANAL
              </div>
            </div>
            {r.completo ? <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 28, letterSpacing: 3, color: c.cinza, whiteSpace: "nowrap" }}>{r.completo}</div> : null}
          </div>
        </AbsoluteFill>
      )}
      <Sequence from={fimClipe + 4}>
        <Audio src={staticFile("marca/cta-reel.mp3")} />
      </Sequence>
      <Pelicula />
    </AbsoluteFill>
  );
};
