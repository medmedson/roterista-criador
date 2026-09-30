// Miniatura do vídeo do SUS (1280 × 720): paleta clara e clínica, diferente das capas escuras.
// Texto em contornos (opentype.js), sem imagem gerada.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const opentype = require("opentype.js");
const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const D = opentype.loadSync(join(raiz, "fontes/BSD-900.woff"));
const M = opentype.loadSync(join(raiz, "fontes/IBMPlexMono-SemiBold.ttf"));

const K = {
  fundo: "#EEF2EC",     // branco de ambulatório
  petroleo: "#0B4F4A",  // verde-petróleo de hospital
  petroleo2: "#083935",
  palido: "#C9D8D0",
  alerta: "#E8412C",    // vermelho de sinalização
  tinta: "#0E0F11",
  marca: "#F3C623",
};

const cap = (f) => (f.tables.os2.sCapHeight || f.unitsPerEm * 0.7) / f.unitsPerEm;
function texto(f, s, x, base, altura, { fill, anchor = "start", tr = 0 } = {}) {
  const fs = altura / cap(f);
  const gl = f.stringToGlyphs(s);
  let w = 0;
  gl.forEach((g, i) => {
    w += (g.advanceWidth / f.unitsPerEm) * fs;
    if (i < gl.length - 1) w += (f.getKerningValue(g, gl[i + 1]) / f.unitsPerEm) * fs + tr * fs;
  });
  let cx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  let d = "";
  gl.forEach((g, i) => {
    d += g.getPath(cx, base, fs).toPathData(2);
    cx += (g.advanceWidth / f.unitsPerEm) * fs;
    if (i < gl.length - 1) cx += (f.getKerningValue(g, gl[i + 1]) / f.unitsPerEm) * fs + tr * fs;
  });
  return { svg: `<path d="${d}" fill="${fill}"/>`, w };
}

const W = 1280, H = 720;

// Grade 10 × 10: 75 pontos cheios (sem plano médico) e 25 vazados (com plano).
let pontos = "";
const gx = 782, gy = 118, passo = 45;
for (let i = 0; i < 100; i++) {
  const c = i % 10, l = Math.floor(i / 10);
  const cheio = i < 75;
  const x = gx + c * passo + 22, y = gy + l * passo + 22;
  pontos += cheio
    ? `<circle cx="${x}" cy="${y}" r="16" fill="${K.petroleo}"/>`
    : `<circle cx="${x}" cy="${y}" r="14" fill="none" stroke="${K.palido}" stroke-width="4"/>`;
}

// Eletrocardiograma no rodapé
const ecg = (() => {
  const y = 684; let p = `M 0 ${y}`;
  const seg = (x0) => `L ${x0} ${y} L ${x0 + 14} ${y - 6} L ${x0 + 28} ${y} L ${x0 + 44} ${y} L ${x0 + 52} ${y + 22} L ${x0 + 68} ${y - 52} L ${x0 + 86} ${y + 26} L ${x0 + 98} ${y} L ${x0 + 122} ${y} L ${x0 + 140} ${y - 12} L ${x0 + 158} ${y} `;
  for (let x = -20; x < W; x += 300) p += seg(x);
  return `<path d="${p} L ${W} ${y}" fill="none" stroke="${K.alerta}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
})();

const n161 = texto(D, "161", 62, 352, 262, { fill: K.petroleo, tr: -0.01 });
const milh = texto(D, "MILHÕES", 66, 464, 98, { fill: K.petroleo2 });
const sub = texto(M, "DE BRASILEIROS SEM PLANO DE SAÚDE", 68, 512, 22, { fill: K.tinta, tr: 0.08 });
const pilTxt0 = texto(D, "SÓ TÊM O SUS", 0, 0, 44, { fill: "#FFFFFF", tr: 0.03 });
const pilW = Math.ceil(pilTxt0.w + 56);
const pilTxt = texto(D, "SÓ TÊM O SUS", 98, 602, 44, { fill: "#FFFFFF", tr: 0.03 });
const legenda = texto(M, "CADA PONTO = 1% DA POPULAÇÃO", gx + 4, gy + 10 * passo + 40, 15, { fill: K.petroleo, tr: 0.14 });
const tres = texto(D, "3 EM CADA 4", gx + 10 * passo, gy - 22, 34, { fill: K.alerta, anchor: "end", tr: 0.02 });
const c1 = texto(D, "CONTRA", 74, 60, 22, { fill: K.tinta });
const c2 = texto(D, "PROVA", 74 + c1.w + 8, 60, 22, { fill: K.tinta });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<title>SUS: 161 milhões de brasileiros sem plano de saúde</title>
<defs>
  <filter id="grao" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.045 0"/>
  </filter>
  <filter id="marca" x="-6%" y="-25%" width="112%" height="150%">
    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.22" numOctaves="3" seed="11" result="d"/>
    <feDisplacementMap in="SourceGraphic" in2="d" scale="9" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</defs>
<rect width="${W}" height="${H}" fill="${K.fundo}"/>
<rect x="0" y="0" width="14" height="${H}" fill="${K.petroleo}"/>
${pontos}
${tres.svg}
${legenda.svg}
${n161.svg}
${milh.svg}
${sub.svg}
<rect x="70" y="530" width="${pilW}" height="90" rx="4" fill="${K.alerta}"/>
${pilTxt.svg}
${ecg}
<rect x="66" y="30" width="${c1.w + c2.w + 22}" height="40" fill="${K.marca}" filter="url(#marca)" transform="rotate(-1 66 30)"/>
${c1.svg}${c2.svg}
<rect width="${W}" height="${H}" filter="url(#grao)"/>
</svg>`;
writeFileSync(join(raiz, "svg/miniatura-sus.svg"), svg);
console.log("ok");
