import { AbsoluteFill } from "remotion";
import { BlocosQuociente, BobinaBU, CabineVoto, CadeiaConfianca, Cedula, LinhaFita, MapaPontosSecao, MosaicoUF, ProvasEmFila, RegistroTicket, RelogioDia, SeloLacre, TecladoUrna, UrnaDeLona } from "../componentes/KitEleicoes";
import { Pelicula, Quadro } from "../componentes/Quadro";

// Vitrine do kit (só para conferência visual; não entra no vídeo). Frame alto = tudo já animado.
export const Vitrine: React.FC<{ pagina: number }> = ({ pagina }) => (
  <AbsoluteFill>
    <Quadro />
    {pagina === 0 ? (
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
        <TecladoUrna entra={0} digitos="2026" digitaEm={10} confirmaEm={80} largura={440} />
        <Cedula entra={0} abreEm={5} marcaEm={40} largura={380} />
        <UrnaDeLona entra={0} abreEm={20} tamanho={420} />
        <CabineVoto entra={0} luzEm={20} tamanho={480} />
      </AbsoluteFill>
    ) : pagina === 1 ? (
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
        <BobinaBU entra={0} dur={60} qrEm={70} comprimento={620} largura={340} />
        <SeloLacre entra={0} trocaEm={30} tamanho={320} />
        <RelogioDia entra={0} marcos={[{ h: 7, rotulo: "7h zerésima", f: 50 }, { h: 17, rotulo: "17h", f: 60 }, { h: 19.93, rotulo: "19h56", f: 70 }]} tamanho={560} />
        <MosaicoUF entra={0} celula={78} destaque={["SP"]} legenda="eleitores por UF" />
      </AbsoluteFill>
    ) : pagina === 2 ? (
      <AbsoluteFill style={{ flexDirection: "column", alignItems: "center", justifyContent: "space-around" }}>
        <LinhaFita marcos={[{ ano: "1932", titulo: "Código Eleitoral", f: 10 }, { ano: "1934", titulo: "voto feminino na Constituição", f: 20 }, { ano: "1946", titulo: "nova democracia", f: 30 }, { ano: "1996", titulo: "urna eletrônica", f: 40 }, { ano: "2000", titulo: "todo o país", f: 50 }]} largura={1700} />
        <CadeiaConfianca entra={0} passo={6} />
        <ProvasEmFila cartoes={[2009, 2012, 2016, 2017, 2019].map((a, i) => ({ titulo: `TPS ${a}`, linhas: ["investigadores", "planos"], selo: i % 2 ? "ACHADOS" : "SEM ACHADO", seloCor: i % 2 ? "#F28C28" : "#2E9E5B", f: i * 5 }))} largura={1500} />
      </AbsoluteFill>
    ) : (
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
        <MapaPontosSecao entra={0} dur={60} tamanho={700} legenda="cada ponto: um grupo de seções" />
        <div style={{ display: "flex", flexDirection: "column", gap: 60 }}>
          <BlocosQuociente entra={0} partidos={[{ nome: "A", votos: 45000, cadeiras: 4 }, { nome: "B", votos: 30000, cadeiras: 3 }, { nome: "C", votos: 25000, cadeiras: 3 }]} quociente={10000} divideEm={10} distribuiEm={20} largura={900} />
          <RegistroTicket titulo="LEI 9.504/1997" linhas={[{ texto: "É permitido levar a colinha.", marca: "colinha", f: 0 }, { texto: "Adesivo individual também.", marca: "individual", f: 10 }]} largura={900} />
        </div>
      </AbsoluteFill>
    )}
    <Pelicula />
  </AbsoluteFill>
);
