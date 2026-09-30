// Identidade visual do canal Contra Prova Brasil — SVG puro, texto convertido em contornos.
// Fontes: Big Shoulders Display Black (OFL) e IBM Plex Mono (OFL).
// Texturas (tinta de carimbo, marca-texto, grão) são filtros SVG procedurais, sem imagem gerada.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const opentype = require("opentype.js");
const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const saida = join(raiz, "svg");
mkdirSync(saida, { recursive: true });

const F = {
  display: opentype.loadSync(join(raiz, "fontes/BSD-900.woff")),
  mono: opentype.loadSync(join(raiz, "fontes/IBMPlexMono-SemiBold.ttf")),
  monoM: opentype.loadSync(join(raiz, "fontes/IBMPlexMono-Medium.ttf")),
};

export const C = {
  tinta: "#0E0F11",
  grafite: "#24272D",
  papel: "#E9E4D8",
  carimbo: "#C62B1F",
  marca: "#F3C623",
};

const capH = (font) => (font.tables.os2.sCapHeight || font.unitsPerEm * 0.7) / font.unitsPerEm;

// Mede e desenha texto como contorno. size = altura das maiúsculas em px.
function medir(font, str, cap, tracking = 0) {
  const fs = cap / capH(font);
  let w = 0;
  const glyphs = font.stringToGlyphs(str);
  glyphs.forEach((g, i) => {
    w += (g.advanceWidth / font.unitsPerEm) * fs;
    if (i < glyphs.length - 1) {
      w += (font.getKerningValue(g, glyphs[i + 1]) / font.unitsPerEm) * fs + tracking * fs;
    }
  });
  return { w, fs };
}
function texto(font, str, x, baseline, cap, { fill, anchor = "start", tracking = 0, opacity } = {}) {
  const { w, fs } = medir(font, str, cap, tracking);
  let cx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  const glyphs = font.stringToGlyphs(str);
  let d = "";
  glyphs.forEach((g, i) => {
    d += g.getPath(cx, baseline, fs).toPathData(2);
    cx += (g.advanceWidth / font.unitsPerEm) * fs;
    if (i < glyphs.length - 1) cx += (font.getKerningValue(g, glyphs[i + 1]) / font.unitsPerEm) * fs + tracking * fs;
  });
  return { svg: `<path d="${d}" fill="${fill}"${opacity ? ` opacity="${opacity}"` : ""}/>`, w };
}

const filtros = `
<filter id="tintaCarimbo" x="-10%" y="-10%" width="120%" height="120%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.7" result="m"/>
  <feComposite in="SourceGraphic" in2="m" operator="in" result="gasto"/>
  <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="2" seed="3" result="d"/>
  <feDisplacementMap in="gasto" in2="d" scale="2.5"/>
</filter>
<filter id="marcaTexto" x="-6%" y="-25%" width="112%" height="150%">
  <feTurbulence type="fractalNoise" baseFrequency="0.01 0.22" numOctaves="3" seed="11" result="d"/>
  <feDisplacementMap in="SourceGraphic" in2="d" scale="12" xChannelSelector="R" yChannelSelector="G" result="borda"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.003 0.5" numOctaves="2" seed="5" result="riscos"/>
  <feColorMatrix in="riscos" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.55 1.18" result="alfa"/>
  <feComposite in="borda" in2="alfa" operator="in"/>
</filter>
<filter id="grao" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="2" stitchTiles="stitch"/>
  <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0"/>
</filter>`;

const cab = (w, h, fundo = true) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<title>Contra Prova Brasil</title>
<defs>${filtros}</defs>
${fundo ? `<rect width="${w}" height="${h}" fill="${C.tinta}"/>` : ""}`;
const grao = (w, h) => `<rect width="${w}" height="${h}" filter="url(#grao)"/>`;

// Wordmark completo. (x, top) = canto superior esquerdo das maiúsculas; cap = altura das maiúsculas.
// Retorna svg e largura total.
function wordmark(x, top, cap, { claro = C.papel, subtitulo = true } = {}) {
  const base = top + cap;
  const gap = cap * 0.2;
  const contra = texto(F.display, "CONTRA", x, base, cap, { fill: claro, tracking: 0.004 });
  const px = x + contra.w + gap;
  const prova = texto(F.display, "PROVA", px, base, cap, { fill: C.tinta, tracking: 0.004 });
  const total = contra.w + gap + prova.w;
  const padX = cap * 0.07, padY = cap * 0.09;
  let s = `
<g>
  <rect x="${px - padX}" y="${top - padY}" width="${prova.w + padX * 2}" height="${cap + padY * 2}" fill="${C.marca}" filter="url(#marcaTexto)" transform="rotate(-1.1 ${px} ${top})"/>
  ${contra.svg}
  ${prova.svg}`;
  if (subtitulo) {
    const ly = base + cap * 0.17;
    const sub = cap * 0.085;
    s += `
  <rect x="${x}" y="${ly}" width="${total}" height="${cap * 0.016}" fill="${C.carimbo}"/>
  ${texto(F.mono, "BRASIL", x + total, ly + cap * 0.075 + sub, sub, { fill: C.carimbo, anchor: "end", tracking: 0.42 }).svg}
  ${texto(F.monoM, "DOCUMENTÁRIOS COM FONTE OFICIAL", x, ly + cap * 0.075 + sub, sub * 0.78, { fill: claro, tracking: 0.2, opacity: 0.62 }).svg}`;
  }
  return { svg: s + "\n</g>", w: total, h: subtitulo ? cap * 1.36 : cap };
}

// ---------- 1. Avatar 800 × 800 (o YouTube recorta em círculo) ----------
function avatar() {
  const W = 800, cap = 300, base = 400 + cap / 2;
  const c = medir(F.display, "C", cap), p = medir(F.display, "P", cap);
  const gap = 10, total = c.w + gap + p.w, x0 = 400 - total / 2, px = x0 + c.w + gap;
  const brasil = texto(F.mono, "BRASIL", 400, base + 78, 26, { fill: C.carimbo, anchor: "middle", tracking: 0.5 });
  return `${cab(W, W)}
<g filter="url(#tintaCarimbo)">
  <circle cx="400" cy="400" r="330" fill="none" stroke="${C.carimbo}" stroke-width="8"/>
  <circle cx="400" cy="400" r="310" fill="none" stroke="${C.carimbo}" stroke-width="2.5"/>
</g>
<rect x="${px - 22}" y="${400 - cap / 2 - 26}" width="${p.w + 44}" height="${cap + 52}" fill="${C.marca}" filter="url(#marcaTexto)" transform="rotate(-2 ${px} 400)"/>
${texto(F.display, "C", x0, base, cap, { fill: C.papel }).svg}
${texto(F.display, "P", px, base, cap, { fill: C.tinta }).svg}
${brasil.svg}
${grao(W, W)}
</svg>`;
}

// ---------- 2. Logo horizontal ----------
function logo(transparente = false) {
  const cap = 200, W = 1600;
  const m = wordmark(0, 0, cap);
  const x = (W - m.w) / 2, top = 150;
  const H = Math.round(top * 2 + m.h);
  const w2 = wordmark(x, top, cap);
  return `${cab(W, H, !transparente)}
${w2.svg}
${transparente ? "" : grao(W, H)}
</svg>`;
}

// ---------- 3. Marca d'água (canto dos vídeos, sem subtítulo) ----------
function marcaDagua() {
  const cap = 90;
  const m = wordmark(0, 0, cap, { subtitulo: false });
  const W = Math.ceil(m.w + 60), H = cap + 60;
  return `${cab(W, H, false)}
${wordmark(30, 30, cap, { subtitulo: false }).svg}
</svg>`;
}

// ---------- 4. Banner do YouTube 2560 × 1440 ----------
// Área segura em todos os dispositivos: 1546 × 423 no centro (x 507–2053, y 508–931).
function banner() {
  const W = 2560, H = 1440;
  const refs = [
    "LEI 13.756/2018", "MP 132/2003", "LEI 8.080/1990", "LEI 10.836/2004",
    "ACÓRDÃO TCU 1661/2024", "LEI 14.601/2023", "CF/1988 · ART. 196", "MP 1.394/2026",
    "IBGE · SIS 2025", "DECRETO 9.175/2017", "LEI 14.790/2023", "IBGE · PNS 2019",
  ];
  let fundo = "";
  refs.forEach((r, i) => {
    const col = i % 4, lin = Math.floor(i / 4);
    const x = 90 + col * 620 + (lin % 2) * 150;
    fundo += texto(F.monoM, r, x, 200 + lin * 92, 20, { fill: C.papel, tracking: 0.18, opacity: 0.09 }).svg;
    fundo += texto(F.monoM, refs[(i + 5) % refs.length], x + 40, 1110 + lin * 92, 20, { fill: C.papel, tracking: 0.18, opacity: 0.09 }).svg;
  });
  let pautas = "";
  for (let y = 290; y < 1180; y += 44) pautas += `<rect x="0" y="${y}" width="${W}" height="1" fill="${C.grafite}" opacity="0.6"/>`;

  const cap = 170;
  const m = wordmark(0, 0, cap);
  const selo = 250, folga = 70;
  const x = 1280 - (m.w + folga + selo) / 2, top = 720 - m.h / 2;
  const wm = wordmark(x, top, cap);
  const sx = x + m.w + folga + selo / 2, sy = top + cap * 0.12;
  const fonte = texto(F.mono, "FONTE", sx, sy + 50, 18, { fill: C.carimbo, anchor: "middle", tracking: 0.32 });
  const oficial = texto(F.mono, "OFICIAL", sx, sy + 92, 24, { fill: C.carimbo, anchor: "middle", tracking: 0.22 });
  return `${cab(W, H)}
${pautas}
${fundo}
<path d="M -20 1000 C 520 945, 900 1045, 1330 985 S 2140 940, 2600 1015" fill="none" stroke="${C.carimbo}" stroke-width="3" opacity="0.8"/>
${wm.svg}
<g transform="rotate(-7 ${sx} ${sy + 60})" filter="url(#tintaCarimbo)">
  <rect x="${sx - selo / 2}" y="${sy}" width="${selo}" height="122" fill="none" stroke="${C.carimbo}" stroke-width="6"/>
  <rect x="${sx - selo / 2 + 11}" y="${sy + 11}" width="${selo - 22}" height="100" fill="none" stroke="${C.carimbo}" stroke-width="2"/>
  ${fonte.svg}${oficial.svg}
</g>
${grao(W, H)}
</svg>`;
}

const arquivos = {
  "avatar.svg": avatar(),
  "logo-horizontal.svg": logo(false),
  "logo-horizontal-transparente.svg": logo(true),
  "marca-dagua.svg": marcaDagua(),
  "banner-youtube.svg": banner(),
};
for (const [nome, svg] of Object.entries(arquivos)) writeFileSync(join(saida, nome), svg);
console.log("gerados:", Object.keys(arquivos).join(", "));
