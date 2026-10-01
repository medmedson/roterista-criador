// Cartograma de pontos do Brasil (MapaRotas): grade regular de pontos dentro do país + parâmetros da projeção
// (Mercator, mesma do mapa.json: x = tx + k·λ, y = ty − k·ln(tan(π/4 + φ/2)), ângulos em radianos)
import fs from "node:fs";
import { geoContains, geoMercator } from "d3-geo";
const dir = new URL("./", import.meta.url).pathname;
const geo = JSON.parse(fs.readFileSync(dir + "public/data/brasil.geojson", "utf8"));
const proj = geoMercator().fitSize([1000, 1000], geo);
const pts = [];
for (let lat = 6; lat >= -34; lat -= 0.9)
  for (let lon = -74; lon <= -34; lon += 0.9)
    if (geo.features.some((f) => geoContains(f, [lon, lat]))) { const [x, y] = proj([lon, lat]); pts.push([Math.round(x), Math.round(y)]); }
fs.writeFileSync(dir + "src/data/grade-brasil.json", JSON.stringify({ k: proj.scale(), t: proj.translate(), pts }));
console.log("pontos", pts.length);
