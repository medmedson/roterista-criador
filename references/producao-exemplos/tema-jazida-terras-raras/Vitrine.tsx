import { AbsoluteFill } from "remotion";
import { Amostra, BalancaComercio, Cronometro2026, CorteSolo, EsteiraCadeia, ImaCampo, LinhaPreco, MapaJazidas, MisturadorSeparador, SeloLei, TabelaPeriodica } from "../componentes/KitJazida";
import { Pelicula, Quadro } from "../componentes/Quadro";

// Vitrine do kit Jazida (conferência visual; não entra no vídeo).
export const Vitrine: React.FC<{ pagina: number }> = ({ pagina }) => (
  <AbsoluteFill>
    <Quadro />
    {pagina === 0 ? (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <TabelaPeriodica entra={0} celula={86} acende={["Nd"]} acendeEm={60} />
      </AbsoluteFill>
    ) : pagina === 1 ? (
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", padding: 40 }}>
        <CorteSolo entra={0} iluminaEm={20} largura={900} />
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <Amostra entra={0} nome="MONAZITA" formula="(Ce, La, Nd, Th)PO₄" giraEm={10} tamanho={300} />
          <ImaCampo entra={0} giraEm={10} tamanho={420} />
        </div>
      </AbsoluteFill>
    ) : pagina === 2 ? (
      <AbsoluteFill style={{ flexDirection: "column", alignItems: "center", justifyContent: "space-around", padding: 30 }}>
        <EsteiraCadeia entra={0} paises={["Brasil", "Brasil", undefined, "China", "China", "China", undefined, "China"]} marca={[0]} />
        <MisturadorSeparador entra={0} largura={1300} />
      </AbsoluteFill>
    ) : (
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", padding: 30 }}>
        <MapaJazidas entra={0} tamanho={600} projetos={[{ lonlat: [-48.3, -13.5], rotulo: "Minaçu", f: 10 }, { lonlat: [-46.5, -21.9], rotulo: "Caldas", f: 25, cor: "#E0B73A" }]} legenda="cada ponto: uma área do país" />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <LinhaPreco entra={0} largura={900} altura={330} anos={["2015", "2018", "2021", "2022", "2025"]} valores={[40, 60, 120, 180, 90]} pico={3} notas={[{ i: 3, t: "pico", f: 80 }]} />
          <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
            <SeloLei entra={0} carimbaEm={30} tamanho={260} />
            <Cronometro2026 entra={0} correEm={20} tamanho={260} />
            <div style={{ scale: "0.35", marginLeft: -420, marginRight: -420 }}>
              <BalancaComercio entra={0} exporta={{ rotulo: "EXPORTA", valor: "US$ 1" }} importa={{ rotulo: "IMPORTA", valor: "US$ 9" }} descerEm={20} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    )}
    <Pelicula />
  </AbsoluteFill>
);
