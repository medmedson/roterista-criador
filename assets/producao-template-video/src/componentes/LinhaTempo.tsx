import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

type Marca = { ano: number; texto: string; entra: number; destaque?: boolean };
type Trecho = { de: number; ate: number; texto: string; entra: number };

// Linha do tempo horizontal: eixo por anos, marcas pontuais e trechos (colchetes) que se preenchem
export const LinhaTempo: React.FC<{
  x: number;
  y: number;
  largura: number;
  inicio: number;
  fim: number;
  entra: number;
  marcas?: Marca[];
  trechos?: Trecho[];
  semAnos?: boolean;
}> = ({ x, y, largura, inicio, fim, entra, marcas = [], trechos = [], semAnos = false }) => {
  const frame = useCurrentFrame();
  const px = (ano: number) => ((ano - inicio) / (fim - inicio)) * largura;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const anos = semAnos ? [] : Array.from({ length: fim - inicio }, (_, i) => inicio + i);
  const viradas = semAnos ? [] : Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: largura, height: 0 }}>
      {/* Eixo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: -3,
          height: 6,
          width: largura,
          backgroundColor: cores.papelEscuro,
          scale: `${interpolate(frame, [entra, entra + 30], [0, 1], { ...clamp, easing: Easing.bezier(0.6, 0, 0.2, 1) })} 1`,
          transformOrigin: "0 50%",
        }}
      />
      {viradas.map((a) => (
        <div key={`v${a}`} style={{ position: "absolute", left: px(a) - 2, top: -22, width: 4, height: 44, backgroundColor: cores.papelEscuro, opacity: interpolate(frame, [entra, entra + 20], [0, 1], clamp) }} />
      ))}
      {anos.map((a, i) => (
        <div
          key={a}
          data-foco={`ano ${a}`}
          style={{
            position: "absolute",
            left: px(a + 0.5),
            top: 30,
            translate: "-50% 0",
            fontFamily: fontes.rotulo,
            fontWeight: 700,
            fontSize: 70,
            color: cores.papel,
            opacity: interpolate(frame, [entra + i * 4, entra + i * 4 + 10], [0, 1], clamp),
          }}
        >
          {a}
        </div>
      ))}
      {trechos.map((t) => {
        const p = interpolate(frame, [t.entra, t.entra + 40], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.3, 1) });
        return (
          <div key={t.texto} style={{ position: "absolute", left: px(t.de), top: -150, width: px(t.ate) - px(t.de) }}>
            <div
              style={{
                height: 26,
                borderTop: `6px solid ${cores.amarelo}`,
                borderLeft: `6px solid ${cores.amarelo}`,
                borderRight: `6px solid ${cores.amarelo}`,
                scale: `${p} 1`,
                transformOrigin: "0 0",
              }}
            />
            <div
              data-foco={`trecho: ${t.texto}`}
              style={{
                position: "absolute",
                top: -80,
                width: "100%",
                textAlign: "center",
                fontFamily: fontes.maquina,
                fontSize: 64,
                color: cores.amarelo,
                opacity: interpolate(frame, [t.entra + 20, t.entra + 34], [0, 1], clamp),
              }}
            >
              {t.texto}
            </div>
          </div>
        );
      })}
      {marcas.map((m) => (
        <div
          key={m.texto}
          style={{
            position: "absolute",
            left: px(m.ano),
            top: 0,
            opacity: interpolate(frame, [m.entra, m.entra + 8], [0, 1], clamp),
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 34,
              height: 34,
              left: -17,
              top: -17,
              borderRadius: "50%",
              backgroundColor: m.destaque ? cores.vermelho : cores.papel,
              boxShadow: m.destaque ? "0 0 30px rgba(200,32,30,0.8)" : undefined,
            }}
          />
          <div
            data-foco={`marca: ${m.texto}`}
            style={{
              position: "absolute",
              top: semAnos ? 44 : 140,
              left: 0,
              translate: "-50% 0",
              whiteSpace: "pre",
              textAlign: "center",
              lineHeight: 1.1,
              fontFamily: fontes.maquina,
              fontSize: 56,
              color: m.destaque ? cores.vermelho : cores.papel,
            }}
          >
            {m.texto}
          </div>
        </div>
      ))}
    </div>
  );
};
