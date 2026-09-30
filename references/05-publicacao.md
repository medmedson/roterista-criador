# Pacote de publicação

Entregue no fim do roteiro e, depois do render, em arquivos: `render/descricao-youtube*.txt`, `render/fontes-completas.txt`, `render/thumbnail-*.png`. Copiar para `~/Downloads` quando o usuário pedir.

## Conteúdo
1. **Título** (≤ 100 caracteres; curiosidade com número real, ou acusação a testar) + 2–4 alternativas para teste A/B.
2. **Thumbnail**: descrição no roteiro + PNG gerado (`04-capas-e-marca.md`).
3. **Descrição** (< 5000 caracteres):
   - Abertura de 2–3 linhas com o gancho + lista do que o vídeo cobre.
   - Nota de método: estudos = associação; estimativa dita como estimativa; páginas [arquivo] por bloqueio eleitoral.
   - **Capítulos com os tempos do vídeo RENDERIZADO** (não os planejados): medir a duração de cada `render/blocos/blocoNN.mp4` com `ffprobe -v error -show_entries format=duration -of csv=p=0` e somar; formato `mm:ss Título`; o primeiro é `00:00`.
   - "Veja também" com vídeos anteriores; créditos das imagens (autor, licença, fonte); "Narração sintética. Trilha e efeitos originais."
   - Fontes principais em uma linha e lista completa com links em arquivo à parte (`fontes-completas.txt`, para colar no comentário fixado).
   - 3–5 hashtags.
4. **Tags** (15–25, do específico ao geral), **comentário fixado** (fontes + pergunta que gera debate), **cortes curtos** (4–5 ideias, cada uma com o bloco de origem e contexto suficiente).
5. **Checagem do dia**: itens vivos (votações, números do mês, páginas [arquivo]), licenças de imagem com print, cronometragem real, QA de quadros.

## Regras
- Não afirmar na descrição nada que o vídeo não sustenta.
- Não usar logotipo de órgão público nem imitar veículo real.
- Fotos de pessoas só com licença conferida; créditos completos.

## Fim do vídeo e descrição padrão
O padrão completo (ordem exata do fim, tela de fontes, tela final, créditos, aviso de voz sintética, descrição em 8 partes) está em `07-tela-final-e-creditos.md`.
