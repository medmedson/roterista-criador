import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import reels from "../data/reels.json";
import { Pelicula, Quadro } from "../componentes/Quadro";
import * as T from "../tema";

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
// Cor do texto de legenda e do cartão: no tema claro a legenda é escura com texto branco; no escuro, cartão claro-transparente.
const LEGENDA_FUNDO = (T as any).c ? "rgba(27,31,42,0.92)" : "rgba(8,6,5,0.85)";

// REELS 1080×1920 (tema claro de Eleições): clipe do vídeo completo (sem a legenda queimada, cortada pelo recorte) no centro,
// título em cima, LEGENDA DINÂMICA grande embaixo (trechos de até 2 linhas, no tempo da fala) e chamada para o vídeo completo.
const MAX = 46; // caracteres por trecho (2 linhas de ~23)
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
      if (/[.;:!?]$/.test(p) && atual.length >= 26) {
        partes.push(atual);
        atual = "";
      } else if (/,$/.test(p) && atual.length >= 34) {
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

export const duracaoReel = (i: number) => Math.ceil(reels[i].duracao * 30);

export const Reel: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const r = reels[i];
  const t = f / fps;
  const cap = r.caps.find((x) => t >= x.de && t < x.ate) ?? null;
  const entra = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const prog = f / durationInFrames;
  return (
    <AbsoluteFill style={{ backgroundColor: c.papel }}>
      <Quadro />
      {/* barra de progresso */}
      <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: `${prog * 100}%`, backgroundColor: c.azul }} />
      {/* título */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 120, opacity: entra, translate: `0 ${(1 - entra) * -30}px`, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontFamily: fontes.mono, fontWeight: 600, fontSize: 34, letterSpacing: 6, color: c.cinza, whiteSpace: "nowrap" }}>ELEIÇÕES 2026 · DOCUMENTÁRIO</div>
        <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 118, lineHeight: 0.98, color: c.azul }}>{r.titulo}</div>
        <div style={{ width: 150, height: 8, borderRadius: 4, backgroundColor: c.laranja }} />
        <div style={{ fontFamily: fontes.texto, fontWeight: 600, fontSize: 40, color: c.tinta }}>{r.sub}</div>
      </div>
      {/* clipe */}
      <div style={{ position: "absolute", left: 40, top: 520, width: 1000, height: 460, borderRadius: 20, overflow: "hidden", boxShadow: sombra, backgroundColor: c.branco }}>
        <OffthreadVideo src={staticFile(`reels/r${r.id}.mp4`)} style={{ width: 1000, height: 460, objectFit: "cover", objectPosition: "center top" }} />
      </div>
      {/* legenda dinâmica grande */}
      <div style={{ position: "absolute", left: 40, right: 40, top: 1030, height: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {cap ? (
          <div data-legenda style={{ backgroundColor: "rgba(27,31,42,0.92)", color: "#FFFFFF", fontFamily: fontes.texto, fontWeight: 800, fontSize: 70, lineHeight: 1.16, textAlign: "center", padding: "26px 36px", borderRadius: 18, maxWidth: 1000 }}>
            {trecho(cap.texto, cap.de, cap.ate, t)}
          </div>
        ) : null}
      </div>
      {/* chamada */}
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 120, display: "flex", alignItems: "center", gap: 22, padding: "24px 34px", borderRadius: 18, backgroundColor: c.branco, boxShadow: sombra, borderLeft: `12px solid ${c.verde}` }}>
        <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 52, color: c.tinta, whiteSpace: "nowrap" }}>VÍDEO COMPLETO NO CANAL</div>
        <div style={{ marginLeft: "auto", fontFamily: fontes.mono, fontWeight: 600, fontSize: 26, color: c.azul, whiteSpace: "nowrap" }}>CONTRA PROVA BRASIL</div>
      </div>
      <Pelicula />
    </AbsoluteFill>
  );
};
