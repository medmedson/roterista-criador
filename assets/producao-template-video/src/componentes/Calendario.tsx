import { interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";

export type Dia = { data: string; texto: string; entra: number; alerta?: boolean };

// Faixa de datas em folhinhas de calendário que caem uma a uma
export const Calendario: React.FC<{ dias: Dia[] }> = ({ dias }) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  return (
    <div style={{ display: "flex", gap: 36 }}>
      {dias.map((d) => (
        <div
          key={d.data}
          data-foco={`dia: ${d.data}`}
          style={{
            width: 300,
            opacity: interpolate(frame, [d.entra, d.entra + 6], [0, 1], clamp),
            translate: `0 ${interpolate(frame, [d.entra, d.entra + 12], [-60, 0], clamp)}px`,
            rotate: `${interpolate(frame, [d.entra, d.entra + 12], [-8, 0], clamp)}deg`,
            backgroundColor: cores.papel,
            boxShadow: "0 18px 26px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ backgroundColor: d.alerta ? cores.vermelho : "#3a302a", color: cores.branco, fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 36, textAlign: "center", padding: "8px 0", letterSpacing: 4 }}>
            {d.data.split(" ")[1] ?? ""}
          </div>
          <div style={{ fontFamily: fontes.rotulo, fontWeight: 700, fontSize: 130, textAlign: "center", color: cores.tinta, lineHeight: 1.1 }}>{d.data.split(" ")[0]}</div>
          <div style={{ fontFamily: fontes.maquina, fontSize: 32, textAlign: "center", color: cores.tinta, padding: "0 16px 20px", lineHeight: 1.2, minHeight: 90 }}>{d.texto}</div>
        </div>
      ))}
    </div>
  );
};
