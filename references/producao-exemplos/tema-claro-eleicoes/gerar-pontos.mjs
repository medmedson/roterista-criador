// Nuvem de pontos (MapaPontosSecao): pontos dentro do Brasil, na mesma projeção do mapa.json; ordem = litoral → interior
import fs from "node:fs";
import { geoContains, geoMercator } from "d3-geo";
const dir = new URL("./", import.meta.url).pathname;
const geo = JSON.parse(fs.readFileSync(dir + "public/data/brasil.geojson", "utf8"));
const proj = geoMercator().fitSize([1000, 1000], geo);
let s = 7; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
const pts = [];
while (pts.length < 1400) {
  const lon = -74 + rnd() * 40, lat = -34 + rnd() * 40;
  // mais densidade no litoral (onde vive mais gente): aceita interior com menor probabilidade
  const litoral = Math.max(0, Math.min(1, (lon + 55) / 20));
  if (rnd() > 0.25 + 0.75 * litoral) continue;
  if (!geo.features.some((f) => geoContains(f, [lon, lat]))) continue;
  const [x, y] = proj([lon, lat]);
  pts.push({ x: Math.round(x), y: Math.round(y), o: +(1 - litoral + rnd() * 0.25).toFixed(3) });
}
pts.sort((a, b) => a.o - b.o);
fs.writeFileSync(dir + "src/data/pontos-secoes.json", JSON.stringify(pts.map((p) => [p.x, p.y])));
console.log("pontos", pts.length);
