import { useEffect } from "react";
import { getInputProps, useCurrentFrame, useDelayRender } from "remotion";

// Auditoria de enquadramento (só roda com inputProps { qa: true }).
// Regras:
// - Todo elemento marcado com data-foco precisa estar 100% dentro do quadro,
//   a menos que tenha data-corte-ok (corte proposital).
// - Nenhum data-foco visível pode ficar sob a legenda (data-legenda).
// - Dois data-foco visíveis não podem se sobrepor (carimbo sobre texto, foto sobre recorte...),
//   salvo data-sobrepor-ok.
// - Tela sem nenhum data-foco inteiro visível = VAZIO (proibido; o vídeo nunca fica só com fundo).
// - Se houver uma camada data-cobre opaca, só o conteúdo dela é auditado.
// Os problemas saem no console como "QA|frame|tipo|nome".
const W = 1920;
const H = 1080;
const TOL = 4;

const opacidadeEfetiva = (el: Element) => {
  let o = 1;
  let n: Element | null = el;
  while (n) {
    o *= Number(getComputedStyle(n).opacity);
    n = n.parentElement;
  }
  return o;
};

const Auditor: React.FC = () => {
  const frame = useCurrentFrame();
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    const handle = delayRender("auditoria");
    const id = requestAnimationFrame(() => {
      const raiz = document.querySelector("[data-raiz-video]");
      if (raiz) {
        const base = raiz.getBoundingClientRect();
        const escala = base.width / W;
        const ret = (el: Element) => {
          let r: { left: number; top: number; right: number; bottom: number } = el.getBoundingClientRect();
          // SVG com overflow visível: a caixa real é a união dos filhos (rótulos fora da área nominal)
          if (el instanceof SVGSVGElement && getComputedStyle(el).overflow === "visible") {
            for (const f of el.querySelectorAll("text, foreignObject, path, circle, rect, line, polygon")) {
              const q = f.getBoundingClientRect();
              if (!q.width && !q.height) continue;
              r = { left: Math.min(r.left, q.left), top: Math.min(r.top, q.top), right: Math.max(r.right, q.right), bottom: Math.max(r.bottom, q.bottom) };
            }
          }
          return {
            x1: (r.left - base.left) / escala,
            y1: (r.top - base.top) / escala,
            x2: (r.right - base.left) / escala,
            y2: (r.bottom - base.top) / escala,
          };
        };
        const capas = [...document.querySelectorAll("[data-cobre]")].filter((c) => opacidadeEfetiva(c) > 0.9);
        const capa = capas[capas.length - 1];
        // Durante movimento de câmera, cortes são de passagem (proposital); só sobreposição e legenda contam
        const movendo = Boolean(document.querySelector("[data-camera-movendo]"));
        const legenda = document.querySelector("[data-legenda]");
        const rl = legenda ? ret(legenda) : null;
        const visiveis: { el: Element; nome: string; r: ReturnType<typeof ret> }[] = [];
        let inteiros = 0;
        for (const el of document.querySelectorAll("[data-foco]")) {
          if (capa && !capa.contains(el)) continue;
          if (opacidadeEfetiva(el) < 0.3) continue;
          const r = ret(el);
          if (r.x2 < 0 || r.x1 > W || r.y2 < 0 || r.y1 > H) continue; // totalmente fora: ok
          const nome = el.getAttribute("data-foco") ?? "?";
          const dentro = r.x1 >= -TOL && r.y1 >= -TOL && r.x2 <= W + TOL && r.y2 <= H + TOL;
          if (dentro || el.hasAttribute("data-corte-ok")) inteiros++;
          if (!movendo && !el.hasAttribute("data-corte-ok") && !dentro) {
            console.log(`QA|${frame}|CORTADO|${nome}`);
          }
          if (!movendo && rl && !el.hasAttribute("data-corte-ok") && r.x1 < rl.x2 && r.x2 > rl.x1 && r.y1 < rl.y2 && r.y2 > rl.y1 + TOL) {
            console.log(`QA|${frame}|SOB_LEGENDA|${nome}`);
          }
          // Texto vazando da própria caixa: mede cada trecho de texto contra o elemento que o contém
          const andador = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          let vaza = false;
          for (let no = andador.nextNode(); no && !vaza; no = andador.nextNode()) {
            if (!no.textContent?.trim() || !no.parentElement || no.parentElement instanceof SVGElement) continue;
            const faixa = document.createRange();
            faixa.selectNodeContents(no);
            const rt = faixa.getBoundingClientRect();
            const rp = no.parentElement.getBoundingClientRect();
            const tol = 6 * escala;
            if (rt.width > 0 && (rt.right > rp.right + tol || rt.left < rp.left - tol)) vaza = true;
            // Vertical: texto que quebrou linha e saiu da caixa visível (fundo pintado) que o contém
            for (let a: Element | null = no.parentElement; a && !vaza; a = a.parentElement) {
              const bg = getComputedStyle(a).backgroundColor;
              if (bg && bg !== "transparent" && !/rgba\(\d+, \d+, \d+, 0\)/.test(bg)) {
                const ra = a.getBoundingClientRect();
                const tv = Math.max(tol, rt.height * 0.3); // folga para a caixa de linha de fontes grandes
                if (rt.height > 0 && (rt.bottom > ra.bottom + tv || rt.top < ra.top - tv)) vaza = true;
                break;
              }
              if (a === el) break;
            }
          }
          if (vaza) console.log(`QA|${frame}|TRANSBORDA|${nome}`);
          // Texto cortado por uma caixa que recorta (foreignObject ou overflow hidden/clip)
          if (!movendo && !el.hasAttribute("data-corte-ok")) {
            const andador2 = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            let recortado = false;
            for (let no = andador2.nextNode(); no && !recortado; no = andador2.nextNode()) {
              if (!no.textContent?.trim() || !no.parentElement) continue;
              let clip: Element | null = null;
              for (let a: Element | null = no.parentElement; a && a !== document.body; a = a.parentElement) {
                if (a.tagName.toLowerCase() === "foreignobject") { clip = a; break; }
                const ov = getComputedStyle(a).overflow;
                if (ov === "hidden" || ov === "clip") { clip = a; break; }
              }
              if (!clip) continue;
              const faixa = document.createRange();
              faixa.selectNodeContents(no);
              const rt = faixa.getBoundingClientRect();
              const rc = clip.getBoundingClientRect();
              const tol = 4 * escala;
              if (rt.width > 0 && (rt.bottom > rc.bottom + tol || rt.top < rc.top - tol || rt.right > rc.right + tol || rt.left < rc.left - tol)) recortado = true;
            }
            if (recortado) console.log(`QA|${frame}|TEXTO_CORTADO|${nome}`);
          }
          visiveis.push({ el, nome, r });
        }
        for (let i = 0; !movendo && i < visiveis.length; i++) {
          for (let j = i + 1; j < visiveis.length; j++) {
            const a = visiveis[i];
            const b = visiveis[j];
            if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
            // Camadas diferentes (ex.: cena de documento entrando por cima do quadro) não contam
            if (a.el.closest("[data-cobre]") !== b.el.closest("[data-cobre]")) continue;
            if (a.el.hasAttribute("data-sobrepor-ok") || b.el.hasAttribute("data-sobrepor-ok")) continue;
            const ix = Math.min(a.r.x2, b.r.x2) - Math.max(a.r.x1, b.r.x1);
            const iy = Math.min(a.r.y2, b.r.y2) - Math.max(a.r.y1, b.r.y1);
            if (ix <= 0 || iy <= 0) continue;
            const area = (q: typeof a.r) => (q.x2 - q.x1) * (q.y2 - q.y1);
            if ((ix * iy) / Math.min(area(a.r), area(b.r)) > 0.04) {
              console.log(`QA|${frame}|SOBREPOSTO|${a.nome} + ${b.nome}`);
            }
          }
        }
        if (!movendo && inteiros === 0 && !document.querySelector("[data-pausa-ok]")) {
          console.log(`QA|${frame}|VAZIO|nenhum elemento inteiro na tela`);
        }
      }
      continueRender(handle);
    });
    return () => cancelAnimationFrame(id);
  }, [frame, delayRender, continueRender]);
  return null;
};

// Envolve uma cena: marca a raiz do vídeo e liga o auditor em modo QA
export const auditado = <P extends object>(Cena: React.FC<P>): React.FC<P> => {
  const Comp: React.FC<P> = (props) => {
    const qa = Boolean((getInputProps() as { qa?: boolean }).qa);
    return (
      <div data-raiz-video style={{ position: "absolute", inset: 0 }}>
        <Cena {...props} />
        {qa ? <Auditor /> : null}
      </div>
    );
  };
  return Comp;
};
