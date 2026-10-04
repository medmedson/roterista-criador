import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Adesivo, Bola, Cursor, Etiqueta, GrafoBolinhas, Janela, Ligacao, Linhas, MarcaTexto, Mundo, PalavraGigante, PilhaNotas, Selo, SetaMao } from "../componentes/KitVivo";
import { Legenda } from "../componentes/Legenda";
import { Trilha } from "../componentes/Trilha";
import { Contador, Durante, PalavraReta, ElipseMao, Escreve, MapaPontos, NotaVaiVem, Papel, Som, tempos, Txt, viagem, Vida } from "../componentes/VivoA";
import cues from "../data/cues.json";
import { c, fontes } from "../tema";

// B3 · Quando o dinheiro volta para casa. Ciclo, Tarjan, funil 108.400 → 38.267 (levantamento), CIRCULAR ≠ ERRADO,
// R$ 177 mi (levantamento). Depois o CAMINHO do PT e o do PL com o MESMO componente <Caminho> (mesmo molde, mesmas
// cores, mesmos tamanhos de foto, mesma etiqueta "LEGAL · NÃO É ESQUEMA", ~23 s de tela cada) e, em 2026, dois cartões
// idênticos lado a lado (PT → Lula, PL → Flávio Bolsonaro) com um único selo CONFERIDO NO TSE centralizado.
const C = cues["03"];
const { t, em, DURACAO } = tempos(C, "B03");
export const DURACAO_03 = DURACAO;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ───────── geometria comum dos dois caminhos (PL = PT deslocado em DX) ─────────
const DX = 1880;
const N = [420, 560] as const; // diretório nacional
const K = [1500, 560] as const; // campanha
const R = 120;

// Rótulo de duas linhas centrado em x (acima ou abaixo de uma bolinha)
const Rotulo: React.FC<{ x: number; y: number; em: number; l1: string; l2?: string; w?: number }> = ({ x, y, em: e, l1, l2, w = 700 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [e, e + 10], [0, 1], cl);
  return (
    <div data-foco={`rótulo: ${l1}`} style={{ position: "absolute", left: x - w / 2, top: y, width: w, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
      <div style={{ fontFamily: fontes.titulo, fontSize: 56, color: c.claro, lineHeight: 1.1, whiteSpace: "nowrap", textShadow: "0 4px 10px rgba(0,0,0,0.7)" }}>{l1}</div>
      {l2 ? <div style={{ fontFamily: fontes.texto, fontWeight: 800, fontSize: 40, color: c.cinza, whiteSpace: "nowrap" }}>{l2}</div> : null}
    </div>
  );
};

// Ponto médio do rótulo de valor de uma ligação do GrafoBolinhas (mesma conta do kit)
const meioLig = (A: readonly [number, number], B: readonly [number, number], ra = R + 20, rb = R + 40, cv = 0.15) => {
  const dx = B[0] - A[0];
  const dy = B[1] - A[1];
  const L = Math.hypot(dx, dy);
  const [x1, y1, x2, y2] = [A[0] + (dx / L) * ra, A[1] + (dy / L) * ra, B[0] - (dx / L) * rb, B[1] - (dy / L) * rb];
  const mx = (x1 + x2) / 2 - (y2 - y1) * cv;
  const my = (y1 + y2) / 2 + (x2 - x1) * cv;
  return [0.25 * x1 + 0.5 * mx + 0.25 * x2, 0.25 * y1 + 0.5 * my + 0.25 * y2] as const;
};

type Extra = { id: string; x: number; y: number; l1: string; l2?: string; foto?: string; icone?: "pessoa" | "empresa" | "partido"; cor?: string; em: number };
type CaminhoProps = {
  ox: number;
  sigla: string;
  campanha: string;
  foto: string;
  emN: number;
  emK: number;
  extras: Extra[];
  ligacoes: Ligacao[];
  seloEm: number;
  volta: readonly [number, number]; // ponto do rótulo do valor que fecha o ciclo
  cliqueEm: number;
  elipseEm: number;
  calcEm: number;
  calc: { valor: string; linha: string; selo: "conferido" | "levantamento" };
  setaEm: number;
  legalEm: number;
  opac: number;
};
// O MESMO molde para o PT e para o PL
const Caminho: React.FC<CaminhoProps> = (p) => {
  const ox = p.ox;
  const bolas: Bola[] = [
    { id: "N", x: N[0] + ox, y: N[1], rotulo: "", icone: "partido", cor: c.azul, em: p.emN, raio: R },
    { id: "K", x: K[0] + ox, y: K[1], rotulo: "", foto: p.foto, cor: c.papel, em: p.emK, raio: R },
    ...p.extras.map((e) => ({ id: e.id, x: e.x + ox, y: e.y, rotulo: "", icone: e.icone, foto: e.foto, cor: e.cor ?? c.papel, em: e.em, raio: R })),
  ];
  const [vx, vy] = p.volta;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: p.opac }}>
      <ElipseMao x={60 + ox} y={240} w={1800} h={1500} em={p.elipseEm} esp={14} dur={20} />
      <GrafoBolinhas bolas={bolas} ligacoes={p.ligacoes} />
      <Rotulo x={N[0] + ox} y={290} em={p.emN} l1={`DIRETÓRIO NACIONAL · ${p.sigla}`} l2="partido" />
      <Rotulo x={K[0] + ox} y={290} em={p.emK} l1={`campanha de ${p.campanha}`} l2="2022 · presidente" />
      {p.extras.map((e) => (
        <Rotulo key={e.id} x={e.x + ox} y={e.y + R + 30} em={e.em} l1={e.l1} l2={e.l2} />
      ))}
      <Selo tipo="conferido" x={680 + ox} y={65} em={p.seloEm} rot={-3} />
      <ElipseMao x={vx - 190} y={vy - 80} w={380} h={160} em={p.cliqueEm + 4} esp={10} dur={12} />
      <Vida ate={p.cliqueEm + 34} dur={6}>
        <Cursor caminho={[[p.cliqueEm - 30, vx + 600, vy + 500], [p.cliqueEm, vx + 40, vy + 10], [p.cliqueEm + 30, vx + 500, vy + 400]]} cliques={[p.cliqueEm]} />
      </Vida>
      <Vida ate={p.legalEm - 12} dur={8}>
        <Papel x={660 + ox} y={710} w={600} h={520} em={p.calcEm} foco={`soma do caminho ${p.sigla}`} rot={1} vem="esquerda">
          <div style={{ position: "absolute", left: 40, top: 30 }}>
            <Txt f="mao" tam={60} cor="#555">
              soma do caminho
            </Txt>
            <Txt f="titulo" tam={100}>
              = {p.calc.valor}
            </Txt>
            <Txt tam={38} cor="#333">
              {p.calc.linha}
            </Txt>
          </div>
          <div style={{ position: "absolute", left: 20, top: 360, transform: "scale(0.9)", transformOrigin: "0 0" }}>
            <Selo tipo={p.calc.selo} x={0} y={0} em={p.calcEm + 16} rot={-4} />
          </div>
        </Papel>
      </Vida>
      <SetaMao x1={p.sigla === "PT" ? 690 : 2850} y1={p.sigla === "PT" ? 1180 : 700} x2={p.sigla === "PT" ? 560 : 2850} y2={p.sigla === "PT" ? 1050 : 575} em={p.setaEm} cor={c.vermelho} curva={0.25} />
      <Etiqueta texto="LEGAL · NÃO É ESQUEMA" x={600 + ox} y={1090} em={p.legalEm} cor={c.verdeEscuro} rot={-4} />
    </div>
  );
};

// funil com bolinhas caindo
const Funil: React.FC<{ em: number; peneira1: number; peneira2: number }> = ({ em: e, peneira1, peneira2 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [e, e + 12], [0, 1], { ...cl, easing: Easing.out(Easing.back(1.5)) });
  const pen = (q: number, y: number) => {
    const k = interpolate(f, [q, q + 10], [0, 1], cl);
    const meia = 500 - ((y - 2250) / 650) * 430;
    return <path d={`M ${5000 - meia} ${y} L ${5000 - meia + 2 * meia * k} ${y}`} stroke={c.marca} strokeWidth={12} strokeDasharray="30 22" />;
  };
  return (
    <div data-foco="funil" style={{ position: "absolute", left: 4450, top: 2230, width: 1100, height: 700, opacity: Math.min(1, p * 2), transform: `scale(${0.7 + 0.3 * p})` }}>
      <svg width={1100} height={700} viewBox="4450 2230 1100 700" style={{ overflow: "visible" }}>
        <path d="M 4500 2250 L 5500 2250 L 5070 2900 L 4930 2900 Z" fill="rgba(244,244,242,0.08)" stroke={c.claro} strokeWidth={12} strokeLinejoin="round" />
        {Array.from({ length: 14 }, (_, i) => {
          const tt = (f - e - i * 5) / 40;
          if (tt < 0) return null;
          const q = tt % 1;
          const x0 = 4560 + ((i * 137) % 880);
          const x = x0 + (5000 - x0) * q;
          const y = 2150 + q * 780;
          const vazou = f < peneira1 || i % 3 === 0;
          if (!vazou && q > 0.45) return null;
          return <circle key={i} cx={x} cy={y} r={20} fill={i % 2 ? c.verde : c.marca} opacity={1 - q * 0.3} />;
        })}
        {pen(peneira1, 2450)}
        {pen(peneira2, 2650)}
      </svg>
    </div>
  );
};

// pontos do "caderno de Tarjan" que se juntam em ilhas
const Tarjan: React.FC<{ junta: number; contorna: number }> = ({ junta, contorna }) => {
  const f = useCurrentFrame();
  const centros = [
    [520, 520],
    [1200, 760],
    [1880, 470],
  ];
  const k = interpolate(f, [junta, junta + 40], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const pts = Array.from({ length: 45 }, (_, i) => {
    const g = i % 3;
    const hx = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    const hy = Math.sin(i * 269.5 + 183.3) * 43758.5453;
    const sx = 120 + (hx - Math.floor(hx)) * 2150;
    const sy = 140 + (hy - Math.floor(hy)) * 900;
    const a = (i * 2.4) % (2 * Math.PI);
    const r = 60 + ((i * 37) % 120);
    const tx = centros[g][0] + Math.cos(a) * r * 1.5;
    const ty = centros[g][1] + Math.sin(a) * r;
    return [sx + (tx - sx) * k, sy + (ty - sy) * k + Math.sin(f / 20 + i) * 6, g] as const;
  });
  const lk = interpolate(f, [junta + 40, junta + 55], [0, 1], cl);
  return (
    <svg width={2400} height={1400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {lk > 0
        ? pts.map(([x, y, g], i) => {
            const j = pts.findIndex(([, , g2], jj) => jj > i && g2 === g);
            if (j < 0) return null;
            return <line key={`l${i}`} x1={x} y1={y} x2={pts[j][0]} y2={pts[j][1]} stroke="#8A93A3" strokeWidth={4} opacity={lk} />;
          })
        : null}
      {pts.map(([x, y, g], i) => (
        <circle key={i} cx={x} cy={y} r={18} fill={[c.vermelho, c.verdeEscuro, c.azul][g]} />
      ))}
      {centros.map(([x, y], i) => {
        const p = interpolate(f, [contorna + i * 8, contorna + i * 8 + 16], [0, 1], cl);
        const w = 640;
        const h = 470;
        const d = `M ${x - w * 0.4} ${y - h * 0.08} C ${x - w * 0.46} ${y - h * 0.48}, ${x + w * 0.46} ${y - h * 0.54}, ${x + w * 0.47} ${y} C ${x + w * 0.48} ${y + h * 0.52}, ${x - w * 0.45} ${y + h * 0.53}, ${x - w * 0.47} ${y} C ${x - w * 0.48} ${y - h * 0.22}, ${x - w * 0.32} ${y - h * 0.4}, ${x - w * 0.16} ${y - h * 0.44}`;
        return <path key={`e${i}`} d={d} fill="none" stroke={c.azul} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
      })}
    </svg>
  );
};

// Cartão de 2026 (idêntico para os dois lados)
const Cartao2026: React.FC<{ x: number; em: number; foto: string; sigla: string; campanha: string; valor: string; marcaEm: number }> = ({ x, em: e, foto, sigla, campanha, valor, marcaEm }) => (
  <Papel x={x} y={300} w={1600} h={760} em={e} foco={`2026: ${sigla}`} rot={0}>
    <Adesivo foto={foto} x={60} y={100} w={390} h={520} em={e + 8} rot={-3} />
    <div style={{ position: "absolute", left: 520, top: 120 }}>
      <Txt f="titulo" tam={64}>
        {`${sigla} → campanha de ${campanha}`}
      </Txt>
      <div style={{ marginTop: 40 }}>
        <MarcaTexto em={marcaEm}>
          <Txt f="titulo" tam={200}>
            {valor}
          </Txt>
        </MarcaTexto>
      </div>
      <Txt tam={46} cor="#555" style={{ marginTop: 30 }}>
        repasse do partido · 2026
      </Txt>
    </div>
    <Txt tam={44} cor="#555" style={{ position: "absolute", left: 60, top: 660 }}>
      dados parciais · 4/10/2026
    </Txt>
  </Papel>
);

export const Bloco03: React.FC = () => {
  const f = useCurrentFrame();
  // início: ciclo, Tarjan, funil
  const fBolas = 40;
  const fSegue = em(1, "segue as setas");
  const fCiclo = em(1, "achou um ciclo");
  const fTarjan = em(2, "algoritmo de Tarjan");
  const fSepara = em(2, "separa");
  const f108 = em(3, "cento e oito");
  const fSaltos = em(4, "cinco saltos");
  const fDezMil = em(4, "dez mil");
  const f38 = em(4, "sobraram");
  const f177 = em(6, "cento e setenta e sete");
  // PT
  const fN = em(7, "diretório nacional");
  const fK = em(7, "campanha de Lula");
  const fPE = em(7, "diretório de Pernambuco");
  const fCA = em(7, "uma candidata");
  const f69 = em(7, "sessenta e nove");
  const fFecha = em(8, "ciclo fecha");
  const fSoma = em(8, "soma tudo");
  const fCausa = em(8, "por causa");
  const fLegalPT = t(9) + 2;
  // PL
  const fJanela = t(10);
  const fCliquePL = em(10, "e acontece");
  const fN2 = em(11, "diretório nacional");
  const fK2 = em(11, "campanha de Jair");
  const f347 = em(11, "trinta e quatro");
  const fEntre = em(12, "Entre o primeiro");
  const fDevolveu = em(12, "devolveu");
  const fMesmo = em(12, "ao mesmo diretório");
  const fFecha2 = em(13, "ciclo de dois");
  const f40 = em(13, "quarenta milhões");
  const fLegalPL = em(13, "também é legal");
  // 2026
  const fCartoes = em(14, "o Partido dos Trabalhadores");
  const fPT85 = em(14, "oitenta e cinco");
  const fPL = em(14, "e o Partido Liberal");
  const fPL55 = em(14, "cinquenta e cinco");
  const fSelo26 = fPL55 + 50;

  const PTtopo: [number, number, number, number] = [80, 40, 1780, 1000];
  const PTtudo: [number, number, number, number] = [80, 40, 1780, 1950];
  const PLtopo: [number, number, number, number] = [80 + DX, 40, 1780, 1000];
  const PLtudo: [number, number, number, number] = [80 + DX, 40, 1780, 1950];
  const planos = viagem([0, 0, 3840, 2160], [
    [10, [1150, 150, 1700, 1400], 40],
    [t(2) - 6, [3950, 150, 2500, 1800], 30],
    [t(3) - 6, [3950, 1880, 2350, 1620], 28],
    [t(5) - 1, [800, 2650, 2100, 900], 1],
    [t(6) - 4, [850, 2700, 2600, 1000], 20],
    [t(7) - 6, PTtopo, 30],
    [fPE - 8, PTtudo, 24],
    [t(10) - 4, PLtudo, 30],
    [fN2 - 8, PLtopo, 24],
    [fEntre - 8, PLtudo, 24],
    [t(14) - 4, [0, 0, 3840, 2160], 34],
    [fCartoes + 16, [170, 270, 1690, 960], 26],
    [fPL - 6, [2010, 270, 1690, 960], 26],
    [fPL55 + 20, [0, 0, 3840, 2160], 26],
  ]);

  // PT some enquanto o caminho do PL é contado (a câmera está no outro lado) e volta para a comparação lado a lado
  const opPT = interpolate(f, [t(10) - 4, t(10) + 6, t(14) - 4, t(14) + 10, fCartoes - 14, fCartoes - 4], [1, 0, 0, 1, 1, 0], cl);
  const opPL = interpolate(f, [fCartoes - 14, fCartoes - 4], [1, 0], cl);
  const voltaPT = meioLig([420, 1400], N);
  const voltaPL = meioLig([K[0] + DX, K[1]], [N[0] + DX, N[1]]);

  return (
    <AbsoluteFill style={{ backgroundColor: c.mesa }}>
      <Mundo planos={planos}>
        {/* ciclo no mapa */}
        <Vida ate={12}>
          <div data-foco="anotação: mapa" style={{ position: "absolute", left: 1500, top: 140 }}>
            <Escreve texto="o mapa das setas" em={0} tam={110} cor={c.marca} />
          </div>
        </Vida>
        <Vida ate={t(2) + 2}>
          <div style={{ position: "absolute", left: 0, top: 0, opacity: 0.45 }}>
            <MapaPontos x={920} y={80} tam={2000} em={0} passo={30} />
          </div>
          <GrafoBolinhas
            bolas={[
              { id: "a", x: 1500, y: 700, rotulo: "", icone: "partido", cor: c.azul, em: fBolas, raio: 80 },
              { id: "b", x: 2300, y: 700, rotulo: "", icone: "pessoa", cor: c.ambar, em: fBolas + 4, raio: 80 },
              { id: "c", x: 2300, y: 1300, rotulo: "", icone: "partido", cor: c.azul, em: fBolas + 8, raio: 80 },
              { id: "d", x: 1500, y: 1300, rotulo: "", icone: "pessoa", cor: c.ambar, em: fBolas + 12, raio: 80 },
            ]}
            ligacoes={[
              { de: "a", para: "b", em: fSegue, cor: c.azul },
              { de: "b", para: "c", em: fSegue + 12, cor: c.azul },
              { de: "c", para: "d", em: fSegue + 24, cor: c.azul },
              { de: "d", para: "a", em: fSegue + 36, cor: c.azul },
            ]}
          />
          <ElipseMao x={1250} y={480} w={1300} h={1060} em={fCiclo - 6} />
          <Durante de={fCiclo} ate={t(2) + 2}>
            <PalavraReta texto="CICLO" x={1620} y={250} em={fCiclo} tam={260} />
          </Durante>
        </Vida>

        {/* Tarjan */}
        <Vida ate={t(3) + 2}>
          <Papel x={4000} y={200} w={2400} h={1400} em={t(2) - 4} foco="caderno: algoritmo de Tarjan" pauta rot={-1} vem="esquerda">
            <Tarjan junta={fTarjan - 10} contorna={fSepara} />
            <Escreve texto="algoritmo de Tarjan = acha os grupos fechados" em={fTarjan + 4} tam={92} cor={c.azul} style={{ position: "absolute", left: 90, top: 1180 }} />
          </Papel>
        </Vida>

        {/* funil */}
        <Vida ate={t(5) + 1} dur={1}>
          <Contador valor={108400} x={4450} y={1960} em={f108} tam={150} sufixo=" ciclos" foco="contador: ciclos" />
          <Funil em={t(3) - 4} peneira1={fSaltos} peneira2={fDezMil} />
          <Etiqueta texto="até 5 saltos" x={5650} y={2330} em={fSaltos} cor={c.azul} rot={-3} />
          <Etiqueta texto="mais de R$ 10 mil" x={5650} y={2680} em={fDezMil} cor={c.azul} rot={2} />
          <Durante de={f38} ate={t(5)}>
            <PalavraGigante texto="38.267" x={4700} y={2950} em={f38} tam={240} marcarEm={f38 + 14} />
          </Durante>
          <Selo tipo="levantamento" x={5620} y={3010} em={f108 + 24} />
        </Vida>

        {/* CIRCULAR ≠ ERRADO, depois R$ 177 milhões */}
        <Durante de={t(5)} ate={t(6) - 2}>
          <PalavraReta texto="CIRCULAR" x={900} y={2700} em={t(5) + 2} tam={340} />
          <PalavraReta texto="≠" x={900} y={3110} em={t(5) + 14} tam={340} cor={c.vermelho} />
          <PalavraReta texto="ERRADO" x={1200} y={3110} em={t(5) + 18} tam={340} />
        </Durante>
        <Vida ate={t(7) - 2}>
          <Durante de={t(6)} ate={t(7)}>
            <PilhaNotas x={950} y={2780} em={t(6)} n={26} />
          </Durante>
          <Contador valor={177} x={1500} y={2900} em={f177} prefixo="R$ " sufixo=" milhões" tam={220} legenda="o maior ciclo" foco="contador: 177 milhões" />
          <Selo tipo="levantamento" x={1550} y={3330} em={f177 + 30} />
        </Vida>

        {/* O CAMINHO DO PT */}
        <Caminho
          ox={0}
          sigla="PT"
          campanha="Lula"
          foto="fotos/pessoas/lula.jpg"
          emN={Math.min(fN, t(7) + 16)}
          emK={fK}
          extras={[
            { id: "PE", x: 1500, y: 1400, l1: "DIRETÓRIO · PT-PE", l2: "Pernambuco", icone: "partido", cor: c.azul, em: fPE },
            { id: "CA", x: 420, y: 1400, l1: "uma candidata", l2: "sem nome", icone: "pessoa", em: fCA },
          ]}
          ligacoes={[
            { de: "N", para: "K", em: fK + 6, valor: "R$ 122,2 mi", cor: c.azul },
            { de: "K", para: "PE", em: fPE + 6, valor: "R$ 244 mil", cor: c.azul },
            { de: "PE", para: "CA", em: fCA + 6, valor: "repasse", cor: c.azul },
            { de: "CA", para: "N", em: f69, valor: "R$ 69,10", cor: c.azul },
          ]}
          seloEm={fK + 24}
          volta={voltaPT}
          cliqueEm={f69 + 34}
          elipseEm={fFecha}
          calcEm={fSoma}
          calc={{ valor: "R$ 177 mi", linha: "por causa de R$ 69,10", selo: "levantamento" }}
          setaEm={fCausa}
          legalEm={fLegalPT}
          opac={opPT}
        />

        {/* conferindo o outro lado */}
        <Vida ate={fN2 - 14}>
          <Janela x={2150} y={480} w={1500} h={760} em={fJanela} titulo="dados abertos · Justiça Eleitoral">
            <Linhas linhas={[["ano", "doador", "para"], ["2022", "Partido dos Trabalhadores", "campanhas"], ["2022", "Partido Liberal", "campanhas"]]} larguras={[160, 760, 400]} em={fJanela + 8} tam={46} destaque={2} destaqueEm={fCliquePL} />
          </Janela>
          <Cursor caminho={[[fJanela + 10, 3700, 1500], [fCliquePL, 2700, 820], [fCliquePL + 30, 3300, 1300]]} cliques={[fCliquePL]} />
        </Vida>

        {/* O CAMINHO DO PL (mesmo componente, mesmo molde) */}
        <Caminho
          ox={DX}
          sigla="PL"
          campanha="Jair Bolsonaro"
          foto="fotos/pessoas/jair-bolsonaro.jpg"
          emN={fN2}
          emK={fK2}
          extras={[]}
          ligacoes={[
            { de: "N", para: "K", em: f347, valor: "R$ 34,7 mi", cor: c.azul },
            { de: "K", para: "N", em: fDevolveu, valor: "R$ 5,47 mi", cor: c.azul },
          ]}
          seloEm={f347 + 20}
          volta={voltaPL}
          cliqueEm={fDevolveu + 40}
          elipseEm={fFecha2}
          calcEm={fFecha2 + 8}
          calc={{ valor: "R$ 40,2 mi", linha: "2 saltos · ida e volta", selo: "conferido" }}
          setaEm={f40 + 10}
          legalEm={fLegalPL}
          opac={opPL}
        />
        <div style={{ position: "absolute", left: 0, top: 0, opacity: opPL }}>
          <Papel x={2400} y={1340} w={560} h={280} em={fEntre} foco="calendário: out/2022" rot={-2}>
            <div style={{ height: 70, background: c.vermelho, borderRadius: "18px 18px 0 0" }} />
            <Txt f="titulo" tam={84} style={{ position: "absolute", left: 40, top: 76 }}>
              out/2022
            </Txt>
            <Txt f="mao" tam={52} cor={c.vermelho} style={{ position: "absolute", left: 40, top: 190 }}>
              entre os turnos
            </Txt>
          </Papel>
          <Papel x={3050} y={1340} w={640} h={280} em={fMesmo} foco="descrição: transferência para partido" rot={2}>
            <Txt f="mono" tam={36} cor="#666" peso={500} style={{ position: "absolute", left: 36, top: 50 }}>
              descrição no TSE:
            </Txt>
            <Txt f="titulo" tam={52} style={{ position: "absolute", left: 36, top: 130 }}>
              TRANSFERÊNCIA PARA PARTIDO
            </Txt>
          </Papel>
        </div>

        {/* 2026: dois cartões idênticos */}
        <Vida ate={DURACAO}>
          <Cartao2026 x={200} em={fCartoes - 4} foto="fotos/pessoas/lula.jpg" sigla="PT" campanha="Lula" valor="R$ 85,3 mi" marcaEm={fPT85 + 6} />
          <Cartao2026 x={2040} em={fCartoes - 4} foto="fotos/pessoas/flavio-bolsonaro.jpg" sigla="PL" campanha="Flávio Bolsonaro" valor="R$ 55,2 mi" marcaEm={fPL55 + 6} />
          <Selo tipo="conferido" x={1640} y={1170} em={fSelo26} rot={-4} />
          <Durante de={fCartoes - 14} ate={fCartoes + 6}>
            <div data-pausa-ok />
          </Durante>
          {[0, 1, 2].map((i) => (
            <NotaVaiVem key={`a${i}`} de={[1350, 230]} para={[500, 230]} arco={70} em={t(15)} i={i} />
          ))}
          {[0, 1, 2].map((i) => (
            <NotaVaiVem key={`b${i}`} de={[1350 + 1840, 230]} para={[500 + 1840, 230]} arco={70} em={t(15)} i={i} />
          ))}
          <Durante de={t(15) + 6} ate={DURACAO}>
            <Escrita em={t(15) + 6} />
          </Durante>
        </Vida>
      </Mundo>

      <Legenda cues={C} ocultar={[[fCiclo, fCiclo + 60], [t(5), t(7)], [t(9), t(10)], [fLegalPL, fLegalPL + 63]]} />
      <Audio src={staticFile("audio/03.mp3")} />
      <Trilha arquivo="sfx/caderno-tenso.mp3" de={0} ate={t(7) + 20} volume={0.24} fade={30} />
      <Trilha arquivo="sfx/caderno.mp3" de={t(7) - 20} ate={DURACAO} volume={0.24} fade={30} />
      {/* sons: início */}
      <Som a="whoosh-longo" em={10} v={0.3} />
      <Som a="pop" em={fBolas} />
      <Som a="moedas" em={fSegue + 20} v={0.3} />
      <Som a="risco-caneta" em={fCiclo - 6} />
      <Som a="pop" em={fCiclo} />
      <Som a="whoosh" em={t(2) - 6} v={0.3} />
      <Som a="papel" em={t(2) - 2} />
      <Som a="risco-caneta" em={fSepara} v={0.35} />
      <Som a="whoosh" em={t(3) - 6} v={0.3} />
      <Som a="pop" em={f108} />
      <Som a="carimbo" em={f108 + 24} v={0.35} />
      <Som a="fita" em={fSaltos} />
      <Som a="fita" em={fDezMil} />
      <Som a="pop" em={f38} />
      <Som a="pop" em={t(5) + 2} v={0.5} />
      <Som a="moedas" em={t(6)} v={0.35} />
      <Som a="carimbo" em={f177 + 30} v={0.35} />
      {/* sons: PT */}
      <Som a="whoosh" em={t(7) - 6} v={0.3} />
      <Som a="pop" em={fN} />
      <Som a="pop" em={fK} />
      <Som a="risco-caneta" em={fK + 6} v={0.3} />
      <Som a="ding" em={fK + 24} v={0.5} />
      <Som a="pop" em={fPE} />
      <Som a="risco-caneta" em={fPE + 6} v={0.3} />
      <Som a="pop" em={fCA} />
      <Som a="risco-caneta" em={f69} v={0.3} />
      <Som a="clique" em={f69 + 34} v={0.5} />
      <Som a="risco-caneta" em={fFecha} />
      <Som a="papel" em={fSoma} v={0.35} />
      <Som a="risco-caneta" em={fCausa} v={0.3} />
      <Som a="fita" em={fLegalPT} />
      <Som a="plim" em={fLegalPT + 6} v={0.35} />
      {/* sons: PL (mesmos efeitos, mesma ordem) */}
      <Som a="whoosh" em={t(10) - 4} v={0.3} />
      <Som a="clique" em={fCliquePL} v={0.5} />
      <Som a="pop" em={fN2} />
      <Som a="pop" em={fK2} />
      <Som a="risco-caneta" em={f347} v={0.3} />
      <Som a="ding" em={f347 + 20} v={0.5} />
      <Som a="pop" em={fEntre} />
      <Som a="risco-caneta" em={fDevolveu} v={0.3} />
      <Som a="clique" em={fDevolveu + 40} v={0.5} />
      <Som a="pop" em={fMesmo} />
      <Som a="risco-caneta" em={fFecha2} />
      <Som a="papel" em={fFecha2 + 8} v={0.35} />
      <Som a="risco-caneta" em={f40 + 10} v={0.3} />
      <Som a="fita" em={fLegalPL} />
      <Som a="plim" em={fLegalPL + 6} v={0.35} />
      {/* sons: 2026 */}
      <Som a="whoosh-longo" em={t(14) - 4} v={0.3} />
      <Som a="pop" em={fCartoes} />
      <Som a="pop" em={fCartoes + 3} />
      <Som a="lapis-marca" em={fPT85 + 6} v={0.3} />
      <Som a="lapis-marca" em={fPL55 + 6} v={0.3} />
      <Som a="ding" em={fSelo26} v={0.5} />
      <Som a="moedas" em={t(15)} v={0.3} />
    </AbsoluteFill>
  );
};

const Escrita: React.FC<{ em: number }> = ({ em: e }) => (
  <div data-foco="anotação: partido e campanha" style={{ position: "absolute", left: 1320, top: 1390 }}>
    <Escreve texto="partido ↔ campanha = normal" em={e} tam={110} cor={c.marca} />
  </div>
);
