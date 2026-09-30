// Pente fino automático de um ou mais blocos.
// 1) Auditoria: renderiza 1 a cada N frames com inputProps { qa: true } e coleta
//    os avisos do componente Auditoria (CORTADO, SOB_LEGENDA, SOBREPOSTO, VAZIO).
// 2) Folha de contato: um quadro no meio de cada frase, numerado, para revisão visual.
// Uso: node qa-quadros.mjs 03 [04 ...]   (opção --sem-folha para pular a folha)
import { bundle } from "@remotion/bundler";
import { enableTailwind } from "@remotion/tailwind-v4";
import { renderFrames, renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const semFolha = args.includes("--sem-folha");
const blocos = args.filter((a) => !a.startsWith("--"));
const PASSO = 6;
const todosCues = JSON.parse(fs.readFileSync("src/data/cues.json", "utf8"));
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), webpackOverride: enableTailwind });
let totalProblemas = 0;

for (const bloco of blocos) {
  const saida = path.resolve(`../qa/bloco${bloco}`);
  fs.mkdirSync(saida, { recursive: true });
  const inputProps = { qa: true };
  const composition = await selectComposition({ serveUrl, id: `Bloco${bloco}`, inputProps });

  const avisos = new Map(); // "tipo|nome" -> frames[]
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qa-"));
  await renderFrames({
    serveUrl,
    composition,
    inputProps,
    outputDir: tmp,
    everyNthFrame: PASSO,
    imageFormat: "jpeg",
    scale: 0.2,
    concurrency: 3,
    logLevel: "error",
    onStart: () => {},
    onFrameUpdate: () => {},
    onBrowserLog: ({ text }) => {
      if (!text.startsWith("QA|")) return;
      const [, frame, tipo, nome] = text.split("|");
      const k = `${tipo}|${nome}`;
      if (!avisos.has(k)) avisos.set(k, []);
      avisos.get(k).push(Number(frame));
    },
  });
  fs.rmSync(tmp, { recursive: true, force: true });

  const linhas = [...avisos.entries()]
    .map(([k, fs_]) => {
      fs_.sort((a, b) => a - b);
      const [tipo, nome] = k.split("|");
      return `${tipo.padEnd(11)} frames ${fs_[0]}–${fs_[fs_.length - 1]} (${fs_.length}x)  ${nome}`;
    })
    .sort();
  totalProblemas += linhas.length;
  const relatorio = linhas.length ? linhas.join("\n") : "OK — nenhum problema";
  fs.writeFileSync(path.join(saida, "auditoria.txt"), relatorio + "\n");
  console.log(`\n=== Bloco ${bloco}: ${linhas.length} problema(s)\n${relatorio}`);

  if (!semFolha) {
    const arquivos = [];
    for (const [i, c] of todosCues[bloco].entries()) {
      const frame = Math.min(composition.durationInFrames - 1, Math.round(((c.de + c.ate) / 2 / 1000) * composition.fps));
      const arq = path.join(saida, `q${String(i).padStart(2, "0")}.jpg`);
      await renderStill({ serveUrl, composition, frame, output: arq, imageFormat: "jpeg", scale: 0.4 });
      arquivos.push(arq);
    }
    execFileSync("python3", ["folha-contato.py", path.join(saida, "folha.jpg"), ...arquivos]);
    console.log("folha:", path.join(saida, "folha.jpg"));
  }
}
// apaga o bundle temporário criado nesta execução
fs.rmSync(serveUrl, { recursive: true, force: true });
process.exit(totalProblemas ? 1 : 0);
