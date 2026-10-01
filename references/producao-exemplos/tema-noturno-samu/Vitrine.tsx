import { AbsoluteFill } from "remotion";
import { AmbulanciaCorte, Balanca3, CartaoChamada, FluxoRegulacao, Giroflex, LinhaNorma, MapaRotas, PainelCentral, RadarCobertura, ReguaMinuto, TabelaEquipes, ValorReal } from "../componentes/KitSAMU";
import { Pelicula, Quadro } from "../componentes/Quadro";

// Vitrine do kit SAMU (conferência visual; não entra no vídeo). Frame alto = tudo já animado.
export const Vitrine: React.FC<{ pagina: number }> = ({ pagina }) => (
  <AbsoluteFill>
    <Quadro />
    {pagina === 0 ? (
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
        <MapaRotas entra={0} tamanho={760} rotas={[{ de: [-38.5, -12.97], ate: [-38.45, -12.9], f: 20, rotulo: "8 min" }, { de: [-46.6, -23.5], ate: [-47.1, -22.9], f: 40, rotulo: "base" }]} acende={[{ lonlat: [-43.2, -22.9], f: 60, rotulo: "Rio" }]} legenda="cada ponto: uma área do país" />
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <CartaoChamada entra={0} campos={[{ rotulo: "LOCAL", valor: "rua, número, bairro", f: 5 }, { rotulo: "QUEM CHAMA", valor: "familiar", f: 15 }, { rotulo: "NATUREZA", valor: "dor no peito", f: 25 }]} carimboEm={60} largura={820} />
          <ReguaMinuto entra={0} marcas={[{ min: 8, rotulo: "8 min", f: 10 }, { min: 15, rotulo: "15 min", f: 50 }]} largura={820} />
        </div>
      </AbsoluteFill>
    ) : pagina === 1 ? (
      <AbsoluteFill style={{ flexDirection: "column", alignItems: "center", justifyContent: "space-around", padding: 40 }}>
        <PainelCentral entra={0} largura={1300} />
        <FluxoRegulacao entra={0} escolhe={1} escolheEm={60} />
      </AbsoluteFill>
    ) : pagina === 2 ? (
      <AbsoluteFill style={{ flexDirection: "column", alignItems: "center", justifyContent: "space-around", padding: 40 }}>
        <AmbulanciaCorte entra={0} largura={1100} rotulos={[{ t: "MONITOR", x: 760, y: 180, f: 30 }, { t: "MACA", x: 300, y: 450, f: 40 }, { t: "OXIGÊNIO", x: 130, y: 180, f: 50 }]} />
        <TabelaEquipes largura={1600} linhas={[{ tipo: "unidade de suporte básico", sigla: "USB", funcoes: ["TÉCNICO", "CONDUTOR"], f: 0 }, { tipo: "unidade de suporte avançado", sigla: "USA", funcoes: ["MÉDICO", "ENFERMEIRO", "CONDUTOR"], f: 10 }]} />
      </AbsoluteFill>
    ) : (
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", padding: 40 }}>
        <Balanca3 entra={0} altura={420} colunas={[{ rotulo: "UNIÃO", pct: 50, texto: "50%", f: 10 }, { rotulo: "ESTADO", pct: 25, texto: "≥ 25%", f: 20 }, { rotulo: "MUNICÍPIO", pct: 25, texto: "≤ 25%", f: 30 }]} />
        <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
          <ValorReal entra={0} nominal="R$ 100" real="R$ 63" perda={0.37} encolheEm={20} />
          <LinhaNorma largura={900} marcos={[{ ano: "1999", titulo: "portaria", f: 0 }, { ano: "2002", titulo: "regulamento", f: 10 }, { ano: "2003", titulo: "política", f: 20 }, { ano: "2004", titulo: "decreto", f: 30 }]} destaque={[3]} />
        </div>
        <RadarCobertura entra={0} celula={70} valores={{ SP: 1, RJ: 0.9, AM: 0.4, PA: 0.5 }} legenda="cobertura por UF" />
      </AbsoluteFill>
    )}
    <Giroflex em={60} dur={200} forca={0.25} />
    <Pelicula />
  </AbsoluteFill>
);
