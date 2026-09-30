# Contra Prova Brasil — guia da marca

Tudo foi gerado por código (`src/gerar.mjs`), sem imagem de IA. O texto está convertido em contornos vetoriais, então os SVGs abrem iguais em qualquer computador, mesmo sem as fontes instaladas.

## Arquivos

| Arquivo | Uso | Tamanho |
|---|---|---|
| `png/avatar.png` · `svg/avatar.svg` | Foto do canal (YouTube recorta em círculo) | 800 × 800 |
| `png/banner-youtube.png` · `svg/banner-youtube.svg` | Banner do canal. Nome e selo dentro da área segura de celular (1546 × 423 no centro) | 2560 × 1440 |
| `png/logo-horizontal.png` · `svg/logo-horizontal.svg` | Logo completo em fundo escuro | 1600 × 572 |
| `png/logo-horizontal-transparente.png` · `.svg` | Logo sem fundo, para sobrepor em vídeo ou imagem escura | 1600 × 572 |
| `png/marca-dagua.png` · `svg/marca-dagua.svg` | Marca d'água no canto dos vídeos (sem subtítulo) | 673 × 150 |

Para regenerar tudo: `node src/gerar.mjs` e depois `zsh src/render.sh avatar,800,800 banner-youtube,2560,1440 logo-horizontal,1600,572 logo-horizontal-transparente,1600,572,00000000 marca-dagua,673,150,00000000`.

## Conceito

- **Marca-texto amarelo sobre "PROVA":** é o gesto do canal. A gente grifa o documento que prova o que é dito.
- **Vermelho de carimbo:** fio, linha de base e selo "FONTE OFICIAL", o mesmo vermelho dos carimbos e do fio dos vídeos.
- **Mono de documento:** o subtítulo e o "BRASIL" usam letra de máquina, como número de processo.
- No banner, ao fundo, aparecem as leis e os documentos que os vídeos já usaram de verdade: Lei 8.080, MP 132/2003, Acórdão TCU 1661/2024 e outros.

## Cores

| Nome | Hex | Uso |
|---|---|---|
| Tinta | `#0E0F11` | Fundo |
| Grafite | `#24272D` | Pautas e linhas de fundo |
| Papel | `#E9E4D8` | "CONTRA" e textos claros |
| Carimbo | `#C62B1F` | Linha, "BRASIL", selos |
| Marca-texto | `#F3C623` | Faixa atrás de "PROVA" e segunda palavra das capas |

## Fontes (licença OFL, uso comercial livre)

- **Big Shoulders Display Black:** o nome do canal. Condensada, pesada, com cara de cartaz de rua.
- **IBM Plex Mono SemiBold e Medium:** subtítulo, "BRASIL", selos e códigos.

## Regras de uso

- Não esticar, girar ou trocar as cores do logo.
- "PROVA" sempre sobre o marca-texto, nunca sozinho em amarelo sem faixa.
- Espaço livre em volta do logo: no mínimo a altura da letra "C".
- Em fundo claro, usar o logo com fundo (versão escura), não o transparente.
- A marca d'água entra no canto inferior direito dos vídeos, com cerca de 70% de opacidade e fora da faixa de legenda.
