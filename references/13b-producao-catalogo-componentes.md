# Catálogo de componentes (gerado dos arquivos em assets/producao-template-video/src/componentes)

Cada linha: componente → props. Leia o arquivo .tsx antes de usar um componente pela primeira vez; os comentários no topo de cada export dizem o que ele desenha.


## Auditoria.tsx
- **auditado** — Envolve uma cena: marca a raiz do vídeo e liga o auditor em modo QA

## AviaoRota.tsx
- **AviaoRota** — Avião visto de cima percorrendo uma rota tracejada entre dois pontos (coordenadas do SVG pai)
  `{ de: [number, number]; ate: [number, number]; entra: number; duracao?: number; escala?: number }`

## Barras.tsx
- **Barras** — Barras horizontais que crescem e contam o valor (em R$ bilhões)
  `{ barras: Barra[]; largura: number; maximo: number; unidade?: string; prefixo?: string; casas?: number }`

## CaixaTermica.tsx
- **CaixaTermica** — Caixa térmica de transporte de órgão com visor em contagem regressiva
  `{ entra: number; inicioSeg?: number; // tempo inicial do visor em segundos (4 h = 14400) contaDe?: number; // frame em que começa a contar congela?: number; // frame em que o visor para aceleracao?: number; // segundos do visor por segundo de vídeo trancos?: n`

## Calendario.tsx
- **Calendario** — Faixa de datas em folhinhas de calendário que caem uma a uma
  `{ dias: Dia[] }`

## Camera.tsx
- **RESERVA_LEGENDA** — A câmera centraliza o assunto na área livre acima dela.
- **enquadra** — (1920 × 1080 menos a faixa da legenda), com margem.
- **Camera** — Cada tomada define onde a câmera chega no frame f; o movimento dura `transicao` frames.
  `{ tomadas: Tomada[]; transicao?: number; tremores?: number[]; reserva?: number; largura: number; altura: number; children: React.ReactNode; }`

## Carimbo.tsx
- **Carimbo** 
  `{ x: number; y: number; texto: string; entra: number; rotacao?: number; tamanho?: number; cor?: string }`

## Celular.tsx
- **Celular** — Celular genérico com duas áreas da mesma plataforma: palpite esportivo e caça-níquel abstrato
  `{ entra: number; paraRolos: number; destacarCassino?: number; vitoria?: boolean; contarRodadas?: number; }`

## Clarao.tsx
- **Clarao** — Clarão rápido de cor nos momentos dramáticos
  `{ em: number[]; cor?: string; forca?: number }`

## Contador.tsx
- **Contador** — Número grande que conta de 0 até o valor, com rótulo embaixo
  `{ valor: number; entra: number; prefixo?: string; sufixo?: string; casas?: number; rotulo: string; cor?: string; tamanho?: number; }`

## Documento.tsx
- **Marca** — Trecho marcado com caneta marca-texto, que "pinta" da esquerda para a direita
  `{ entra: number; children: React.ReactNode }`
- **Folha** — Folha de documento oficial
  `{ largura: number; children: React.ReactNode }`

## Etiqueta.tsx
- **Etiqueta** — Etiqueta de checagem "A ≠ B": deixa claro o que um número NÃO é
  `{ a: string; b: string; entra: number; simbolo?: string }`

## FichaCandidato.tsx
- **FichaCandidato** — Ficha de candidato: nome, partido e posição verificada (foto opcional)
  `{ nome: string; partido: string; posicao: string; entra: number; foto?: string; cor?: string; largura?: number; }`

## Fichas.tsx
- **Fichas** — Repete em rodadas e acumula o saldo da casa para mostrar o efeito de longo prazo.
  `{ entra: number; rodadas: number; duracaoRodada?: number }`

## Fio.tsx
- **Fio** — Fio vermelho entre dois pontos do quadro, com leve curva de gravidade
  `{ de: [number, number]; ate: [number, number]; entra: number; duracao?: number }`

## FioRompido.tsx
- **FioRompido** — Fio vermelho que se estica e depois arrebenta no meio: as pontas caem com a gravidade
  `{ de: [number, number]; ate: [number, number]; entra: number; quebra: number }`

## Fluxo.tsx
- **Fluxo** — Fluxograma horizontal: caixas acendem em sequência e uma ficha percorre as setas
  `{ etapas: Etapa[]; largura: number; altura?: number }`

## Folhinha.tsx
- **Folhinha** — Folhinha de calendário que "folheia" datas aleatórias até parar na data alvo
  `{ dia: number; mes: number; ano: number; para: number; entra?: number; largura?: number }`

## Graficos.tsx
- **Gauge** — Barra de percentual que enche (opcional: parte cinza em seguida)
  `{ rotulo: string; valor: number; texto: string; entra: number; largura?: number; cor?: string; resto?: { v: number; texto: string }; nota?: string }`
- **Pizza** — Pizza: fatias em sequência; fatia com destaque sai do centro
  `{ fatias: { v: number; cor: string; rotulo?: string; destaque?: boolean }[]; entra: number; tamanho?: number; nome: string }`
- **CartaoEstudo** — Cartão de estudo (borda vermelha ou cinza)
  `{ titulo: string; valor: string; fonte: string; entra: number; cinza?: boolean; largura?: number; carimbo?: { texto: string; f: number } }`
- **Lupa** — Lupa que passa sobre um ponto
  `{ de: [number, number]; ate: [number, number]; entra: number; dur?: number }`

## KitBF.tsx
- **LinhaPobreza** — Linha da pobreza: linha dourada tracejada com valor na ponta; sobe entre alturas conforme `niveis`
  `{ largura: number; niveis: { f: number; y: number; valor: string }[]; x?: number; }`
- **PessoasPontos** — Pessoas-pontos: pontos cinza abaixo da linha que sobem e ganham cor ao cruzar
  `{ largura: number; altura: number; total: number; cruzam: number; sobe: number; linhaY: number; cor?: string; teto?: number; }`
- **CartaoPrograma** — Cartão genérico do programa (sem logotipo oficial, sem dados pessoais), gira e passa na leitora
  `{ entra: number; passa?: number; valor?: string; largura?: number; cores2?: [string, string]; texto?: string }`
- **PratoVazio** — Prato em traço (visto de cima) que enche em camadas
  `{ enche?: number; nivel?: number; tamanho?: number }`
- **EscadaRenda** — Escada de renda: um ponto sobe três degraus até a porta de saída
  `{ entra: number; degraus: { rotulo: string; f: number }[]; porta?: number }`
- **PortaSaida** — Porta com placa "SAÍDA" que abre com luz; pontos atravessam
  `{ abre: number; pontos?: number }`
- **ChamadaEscolar** — Caderno de chamada: "P" se preenchem em sequência
  `{ entra: number; linhas?: number; colunas?: number; faltas?: number }`
- **SacolaFeira** — Sacola de feira: moeda entra e circula entre pequenos comércios
  `{ entra: number }`
- **Pente** — Pente que passa sobre uma pilha de fichas; algumas caem com carimbo
  `{ passa: number; fichas?: number; caem?: number }`
- **Urna** — Urna eletrônica estilizada e genérica, sem brasão; tela acende com um placar
  `{ acende: number; linhas: { rotulo: string; valor: string }[] }`
- **Berco** — Berço em traço
  `{ tamanho?: number }`
- **GloboDelegacoes** — Globo de delegações: alfinetes caem sobre países e rotas chegam ao Brasil; contador
  `{ entra: number; total: number; largura?: number }`
- **TrofeuPremio** — Troféu em traço dourado que acende
  `{ acende: number; tamanho?: number }`

## KitSUAS.tsx
- **AMBAR** 
- **AZUL_CRAS** 
- **PainelSenhas** — Painel de senhas: dígitos vermelhos de sete segmentos (simulados com "8" apagado por baixo)
  `{ numero: number; entra: number; rolaDe?: number; apagado?: boolean; treme?: number; largura?: number; cor?: string }`
- **CartaoSenha** — Bilhete de senha em papel térmico
  `{ numero: number; entra: number }`
- **PlacaCRAS** — Placa genérica do CRAS (sem brasão), com luz de porta aberta por baixo
  `{ acende: number; largura?: number; texto?: string; sigla?: string }`
- **Guiche** — Balcão de atendimento com vidro e placa
  `{ acende: number; fechado?: boolean; carimbo?: number; largura?: number }`
- **CasaTresAndares** — Prédio em corte com três andares que acendem
  `{ andares: { rotulo: string; sub: string; f: number; cor: string }[]; entra: number; largura?: number }`
- **RedeTerritorio** — Rede no território: pontos (ilustrativos) nos estados, ligados a vizinhos por fios finos
  `{ entra: number; tamanho?: number; pontosPorEstado?: number; x?: number; y?: number }`
- **PranchetaCadastro** — Prancheta com formulário que se preenche e carimbo
  `{ entra: number; carimbo?: number; largura?: number }`
- **TubosNiveis** — Dois tubos: o largo transborda, o estreito mal enche
  `{ entra: number; largo: { v: number; rotulo: string }; estreito: { v: number; rotulo: string } }`
- **MoedaSolitaria** — Uma moeda ao lado de uma pilha de N moedas
  `{ entra: number; pilha?: number; rotuloPilha: string; rotuloMoeda: string }`
- **Crachas** — Crachás que viram e mostram a cor do vínculo
  `{ itens: { cor: string; rotulo: string; n: number }[]; entra: number; colunas?: number }`
- **LinhaConferencias** 
  `{ marcos: number[]; largura?: number; destaque?: number }`
- **SeloPEC** — Selo circular carimbado
  `{ entra: number; linhas: string[]; tamanho?: number }`
- **Pauta** — Pauta de audiência que abre e ganha marca-texto numa linha
  `{ abre: number; titulo: string; linhas: string[]; destaque: number; marca: number; largura?: number }`
- **AbrigoSilhueta** — Casa-lar em traço, janelas acendem (sem pessoas)
  `{ acende: number; tamanho?: number }`
- **Tripe** — Tripé da seguridade social
  `{ entra: number; pes: { rotulo: string; sub: string; f: number }[] }`
- **Pastas** — Pastas com perguntas escritas à mão
  `{ perguntas: string[]; entra: number }`

## Legenda.tsx
- **Legenda** — `atraso`: frames de pré-roll antes da narração começar
  `{ cues: Cue[]; ocultar?: [number, number][]; atraso?: number }`

## LinhaBatimento.tsx
- **LinhaBatimento** — "volta": um único pico e depois ritmo normal.
  `{ x: number; y: number; largura: number; altura?: number; mudancas: MudancaBatimento[]; entra?: number; }`

## LinhaTempo.tsx
- **LinhaTempo** — Linha do tempo horizontal: eixo por anos, marcas pontuais e trechos (colchetes) que se preenchem
  `{ x: number; y: number; largura: number; inicio: number; fim: number; entra: number; marcas?: Marca[]; trechos?: Trecho[]; semAnos?: boolean; }`

## Luzes.tsx
- **Luzes** — Luzes desfocadas (bokeh) flutuando devagar: clima dramático sem encenar pessoas
  `{ quantidade?: number; cor?: string }`

## MapaBrasil.tsx
- **MapaBrasil** — Mapa do Brasil em traço, desenhado estado a estado
  `{ x: number; y: number; tamanho: number; entra: number; alfinete?: number; pontos?: { entra: number; porEstado: number }; corteOk?: boolean; destaques?: { sigla: string; cor: string; entra: number }[]; }`

## MapaMundo.tsx
- **MapaMundo** — Mapa-múndi em traço com o Brasil em destaque e rotas chegando ao país
  `{ largura: number; entra: number; origens?: Origem[]; pontos?: { entra: number; quantidade: number }; destaques?: { iso: string; entra: number; cor?: string }[]; }`

## Maquina.tsx
- **Maquina** — Texto datilografado letra a letra
  `{ texto: string; entra: number; porLetra?: number; tamanho?: number; cor?: string }`

## Medidor.tsx
- **Medidor** — Medidor de devolução média: barra que para antes dos 100%; o espaço que sobra é a margem da casa
  `{ entra: number; largura: number; valor?: number; mostrarValor?: boolean }`

## Objetos.tsx
- **PulseiraHospital** — Pulseira branca de identificação hospitalar (texto genérico), com leve giro 3D
  `{ entra: number; texto?: string; largura?: number }`
- **CarteiraTrabalho** — Carteira de trabalho antiga (capa genérica) que abre e recebe um carimbo
  `{ entra: number; abre?: number; carimbo?: { texto: string; em: number }; largura?: number }`
- **FichaAtendimento** — Ficha de atendimento dos anos 1980, preenchida a máquina, com X em "NÃO" e carimbo final
  `{ entra: number; campos: { rotulo: string; valor: string; em: number }[]; marcaNao?: number; carimbo?: { texto: string; em: number }; largura?: number; }`

## Objetos2.tsx
- **MultidaoPontos** — Grade de pontos (1 ponto = 1 milhão): grupos acendem em ondas com cor própria
  `{ total: number; colunas: number; grupos: { qtd: number; cor: string; entra: number; rotulo: string }[]; largura: number; }`
- **Iceberg** — Iceberg em traço: a ponta aparece primeiro; a água sobe (câmera desce) e revela rótulos no casco
  `{ ponta: string; rotulos: { texto: string; entra: number }[]; desce: number; largura?: number }`
- **Frascos** — Frasco de vacina genérico; em fileiras multiplica conforme o tempo
  `{ entra: number; linhas: number; colunas: number; cor?: string; tamanho?: number }`
- **GotaMapa** — Gota que cai sobre um ponto e se espalha em pontos (coordenadas do SVG pai)
  `{ alvo: [number, number]; entra: number; espalha?: [number, number][]; escala?: number }`
- **GenomaFita** — Sequenciador: colunas de A, C, G, T rolando; trava e destaca um trecho
  `{ entra: number; trava: number; colunas?: number; linhas?: number; destaque?: string }`
- **Particulas** — Partículas virais estilizadas que se multiplicam e se espalham a partir de um ponto (SVG pai)
  `{ origem: [number, number]; entra: number; quantidade: number; raio: number; escala?: number }`
- **MesaDeLuz** — Negatoscópio (caixa de luz) que liga com cintilação e mostra uma chapa genérica
  `{ liga: number; largura?: number; legenda?: string }`
- **PastaInquerito** — Pasta parda de inquérito com elástico e tarja; desliza, solta o elástico e abre
  `{ entra: number; abre: number; etiqueta?: string; largura?: number }`
- **MoedasEscorrendo** — Moedas escorrendo por uma fenda para fora do quadro (corte proposital)
  `{ entra: number; quantidade?: number; largura?: number; altura?: number }`
- **Ampulheta** — Ampulheta com areia vermelha escorrendo e contador ao lado
  `{ entra: number; duracao: number; altura?: number }`
- **Balanca** — Balança de dois pratos que pende conforme os pesos
  `{ entra: number; inclina: number; esquerda: string; direita: string; angulo?: number; largura?: number }`

## Objetos3.tsx
- **Torneira** — Torneira em traço com uma gota caindo em câmera lenta e uma lupa com rótulo
  `{ entra: number; rotulo?: string }`
- **Capsula** — Cápsula de remédio girando
  `{ tamanho?: number }`
- **CaixasRemedio** — Pilha de caixas de remédio genéricas (tarja amarela com "G" estilizado)
  `{ entra: number; quantidade?: number }`
- **BolsaSangue** — Bolsa de sangue em traço que enche
  `{ entra: number; altura?: number }`
- **FrascoLeite** — Frasco de leite humano em traço
  `{ altura?: number }`
- **Cigarro** — Cigarro em traço que se apaga em fumaça
  `{ apaga: number }`

## Placar.tsx
- **Placar** — Placar de votação: números sobem de zero até o resultado
  `{ x: number; y: number; titulo: string; sim: number; nao: number; legenda: string; entra: number; }`

## Poeira.tsx
- **Poeira** — Partículas de poeira flutuando na luz: dá vida a qualquer cena parada
  `{ quantidade?: number }`

## Polaroide.tsx
- **Polaroide** — Foto em papel instantâneo, pregada no quadro, em preto e branco
  `{ x: number; y: number; largura: number; foto: string; nome: string; entra: number; rotacao?: number; credito?: string; proporcao?: string; inteira?: boolean; enquadre?: string; colorida?: boolean; }`

## Quadro.tsx
- **Quadro** — Fundo de quadro de investigação: cortiça escura, granulação e vinheta
  `{ children?: React.ReactNode }`
- **Pelicula** — Camada fixa por cima de tudo: granulação animada de filme + vinheta

## Recorte.tsx
- **Recorte** 
  `{ x: number; y: number; largura: number; rotacao?: number; entra: number; chapeu: string; titulo: string; linha?: string; fonte?: string; semente?: number; riscado?: number; apagado?: number; tamanhoTitulo?: number; }`

## Relogio.tsx
- **Relogio** — Relógio digital de contagem regressiva que termina em 23:59:59
  `{ x: number; y: number; entra: number }`

## Saida.tsx
- **Saida** — "zoom": atravessa a tela (zoom-through); "chicote": desliza rápido para o lado; "fade": fusão; "sepia": vira sépia
  `{ duracao: number; tipo: "zoom" | "chicote" | "fade" | "sepia"; frames?: number; children: React.ReactNode }`

## Serie.tsx
- **SerieLinha** — Série em linha, desenhada ponto a ponto (só os anos informados; nada interpolado entre eles no rótulo)
  `{ pontos: PontoSerie[]; maximo: number; minimo?: number; largura: number; altura: number; entra: number; passo?: number; cor?: string; casas?: number; sufixo?: string; }`

## Subida.tsx
- **Subida** — Gráfico de dois pontos (início e fim do período). Não inventa pontos intermediários.
  `{ entra: number; de: string; ate: string; largura: number; altura: number; rotuloDe: string; rotuloAte: string }`

## Trilha.tsx
- **Trilha** — Trecho de trilha com entrada e saída suaves
  `{ arquivo: string; de: number; ate: number; volume?: number; fade?: number }`
- **Efeito** — Efeito sonoro pontual
  `{ arquivo: string; em: number; volume?: number; duracao?: number }`

## geo.ts
- **pontoEstado** — Converte o centro de um estado (ou Brasília) para coordenadas de um MapaBrasil posicionado em (x, y) com `tamanho`
- **SIGLAS** 
