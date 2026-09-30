// Gera paths SVG do mapa e cues das legendas a partir dos .srt
import fs from "node:fs";
import { geoEquirectangular, geoMercator, geoPath } from "d3-geo";
const dir = new URL("./", import.meta.url).pathname;
const geo = JSON.parse(fs.readFileSync(dir + "public/data/brasil.geojson", "utf8"));
const W = 1000, H = 1000;
const proj = geoMercator().fitSize([W, H], geo);
const path = geoPath(proj).digits(1);
const estados = geo.features.map((f) => ({ sigla: f.properties.sigla, d: path(f), c: path.centroid(f).map((v) => Math.round(v)) }));
fs.writeFileSync(dir + "src/data/mapa.json", JSON.stringify({ w: W, h: H, estados, projecao: { brasilia: proj([-47.88, -15.79]).map(Math.round) } }));

// Mapa-múndi (Natural Earth 110m) em equiretangular para cenas de alcance global
const mundo = JSON.parse(fs.readFileSync(dir + "public/data/mundo.geojson", "utf8"));
const projM = geoEquirectangular().fitSize([2000, 1000], { type: "Sphere" });
const pathM = geoPath(projM).digits(1);
fs.writeFileSync(dir + "src/data/mundo.json", JSON.stringify({
  w: 2000, h: 1000,
  paises: mundo.features.filter((f) => f.properties.ISO_A3 !== "ATA").map((f) => ({ iso: f.properties.ISO_A3, d: pathM(f) })),
  brasil: projM([-51, -12]).map(Math.round),
}));

const toMs = (t) => { const [h, m, r] = t.split(":"); const [s, ms] = r.split(","); return ((+h * 60 + +m) * 60 + +s) * 1000 + +ms; };
// Texto das legendas: desfaz a grafia falada usada no TTS (pares gerados por ferramentas/normalizar.py)
const PARES = JSON.parse(fs.readFileSync(dir + "../locucao/substituicoes.json", "utf8"));
const EXIBIR = Object.entries(PARES).sort((a, b) => b[0].length - a[0].length);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const exibir = (t) => EXIBIR.reduce((acc, [a, b]) => acc.replace(new RegExp(`(?<![\\p{L}\\p{N}])${esc(a)}(?![\\p{L}\\p{N}])`, "gu"), () => b), t).replace(/(\d{4}), e (\d{4})/g, "$1 e $2").replace(/\s*\.\.\.(?=\s|$)/g, "").replace(/\s+/g, " ");
const cues = {};
// Qualquer numeração (ex.: série em partes: 00, 08, 09…): um cue por NN.srt existente
const blocos = fs.readdirSync(dir + "public/audio").filter((f) => /^\d{2}\.srt$/.test(f)).map((f) => f.slice(0, 2)).sort();
for (const n of blocos) {
  const srt = fs.readFileSync(dir + `public/audio/${n}.srt`, "utf8").trim().split(/\n\s*\n/);
  cues[n] = srt.map((b) => { const l = b.split("\n"); const [a, z] = l[1].split(" --> "); return { de: toMs(a), ate: toMs(z), texto: exibir(l.slice(2).join(" ")) }; }).filter((c) => c.texto.trim() !== "");
}
fs.writeFileSync(dir + "src/data/cues.json", JSON.stringify(cues, null, 1));
console.log("ok", geo.features.length, Object.keys(cues).length);
