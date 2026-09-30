# Padrão do fim do vídeo: tela de fontes, tela final, créditos e aviso de voz sintética

Vale para **todo vídeo** do canal (um vídeo completo por tema, nunca em partes). O roteirista escreve o conteúdo de cada tela numa seção do roteiro; a produção monta. Isto é tudo o que o espectador vê e ouve depois da última fala do fecho (B15/B16).

## Ordem exata do fim

1. **Última fala do fecho** (a frase conclusiva). Silêncio de 1 a 2 s.
2. **Tela de FONTES** (8 a 12 fontes principais; 10 a 12 s; sem legenda; sem voz).
3. **Tela final** (fundo neutro do tema; linhas que entram uma a uma; créditos de imagens rolando embaixo; aviso de voz sintética).
4. **Chamada de inscrição 3** (`ChamadaInscricao`, 5 s) sobre a tela final, com cards de "próximo vídeo" e "veja também".
5. **Som-assinatura do tema**, silêncio de 2 s, fade (para branco no tema claro, para preto nos escuros; 20 frames).

A ordem, em resumo: **fala final → fontes → tela final com créditos e aviso → chamada → assinatura sonora → fade.**

## 1. Tela de FONTES

- Seção do roteiro: **"Tela de FONTES (fim do vídeo, antes da última chamada de inscrição)"**, colocada antes de "Fontes e trilha de auditoria".
- Lista numerada de **8 a 12 fontes principais**, em linguagem de espectador: órgão + documento ou base + ano. Exemplos aprovados:
  - `Constituição Federal de 1988 e constituições anteriores (Planalto)`
  - `Tribunal Superior Eleitoral: notícias, resoluções e dados abertos`
  - `DATASUS: produção ambulatorial (SIA/SUS)`
  - `USGS: Mineral Commodity Summaries 2025 e 2026`
  - `Estudos de Vieira (2022), Oliveira (2019) e Nacer (2023)`
- Agrupe fontes parecidas em uma linha. Não coloque URL na tela (não dá tempo de ler). A lista completa com links vai na **descrição** e no **primeiro comentário fixado** (arquivo `render/fontes-completas.txt`, gerado da seção "Fontes e trilha de auditoria").
- O **B1** avisa na abertura: "Os dados vêm de fontes seguras: ... Todas as fontes estão no final do vídeo." (regra do B1). A tela de fontes cumpre essa promessa.
- Visual: cartões em coluna no estilo do tema (papel-vidro, cartões de areia etc.), sem legenda. Segurar 10 a 12 s; a leitura não pode ser acelerada.

## 2. Tela final (créditos + aviso)

Conteúdo em três grupos, nesta ordem. O roteiro traz a seção **"Tela final (padrão)"** com os textos exatos.

**a) Linhas de fechamento (entram uma a uma, a cada ~1 s):**
1. `Fontes oficiais e estudos na descrição.` (fixa)
2. **Linha de serviço do tema** (uma frase útil ao espectador, sempre com fonte oficial). Exemplos:
   - SUAS/Bolsa Família: `Cadastro Único e serviços: procure o CRAS do seu município.`
   - SAMU: `Em emergência, ligue 192.`
   - Eleições: `Seu local de votação e a justificativa de ausência: aplicativo e-Título.`
   - Terras raras: `Leia a Lei 15.506/2026 no site do Planalto.`
3. `Veja também: “<título do vídeo anterior 1>” e “<título do vídeo anterior 2>”.` (em destaque de cor)

**b) Créditos de imagens (rolando embaixo, fonte mono, lentamente):**
- Primeira linha: `FOTOS · Wikimedia Commons` (ou a origem).
- Uma linha por imagem: `<descrição curta> · <autor> · <licença>` (ex.: `Itamar Franco · Radiobrás (Arquivo Nacional) · CC BY 3.0 BR`).
- **Só as imagens efetivamente usadas**. Sem foto, a linha de fotos some. Imagens vetoriais próprias não precisam de crédito.
- Os mesmos créditos, com links, vão na descrição.

**c) Aviso de voz sintética (última linha dos créditos, sempre):**
`Narração sintética · trilha e efeitos originais`
- Significa: a voz é gerada por computador (não é uma pessoa gravando) e a música e os efeitos são produzidos pelo canal por síntese, sem material de terceiros.
- Também aparece **no fim da descrição** do YouTube, com o texto: `Narração sintética. Trilha e efeitos originais.` Mantenha a frase idêntica nos dois lugares.
- Nunca dizer que a voz é "de um narrador" ou "de um repórter" e nunca simular nome de pessoa.

## 3. Chamada de inscrição 3

- Frase de locução própria, diferente das duas anteriores. Padrão: `Se este documentário ajudou você, inscreva-se no canal, deixe a sua curtida e ative o sininho. Os próximos temas seguem o mesmo método: só documentos oficiais.`
- Cena `ChamadaInscricao` por cima da tela final. **Sem legenda.**

## 4. Som e tempo

- Depois da última fala, a trilha de fecho continua por baixo de fontes e créditos (−24 dB) e desce em fade; o **som-assinatura do tema** toca uma vez (diapasão, bip-confirma, toque-central, ding-senha etc.) e vem **2 s de silêncio**.
- **O som-assinatura do fim toca uma vez só.** Se a última cena do fecho já traz o bip/diapasão/toque, o fim não repete: basta um dos dois. No roteiro, marque onde ele toca.
- Componente da produção: `FimDoVideo.tsx` (`TelaFontes`, `TelaFinal`, `comFim`), ver 13c seção 4c e `17-producao-como-fazer-igual.md`. Tempos típicos da produção: fontes 12 s, tela final 4 s, chamada 3 por cima (voz + 2 s), assinatura, silêncio e fade.
- Duração típica: fontes 10–12 s + tela final 12–20 s + chamada 5 s.
- Nenhuma legenda, nenhuma locução extra durante fontes e créditos.

## 5. Descrição do YouTube (campo de baixo, padrão)

Ordem fixa, < 5000 caracteres:
1. Parágrafo de abertura com o gancho e o que o vídeo cobre.
2. `📌 NESTE VÍDEO` (lista de tópicos).
3. `⏱ CAPÍTULOS` (tempos reais do vídeo renderizado).
4. `🔎 COMO ESTE CANAL TRABALHA` (fontes oficiais; estimativa dita como estimativa; associação não é causa; páginas lidas em cópia arquivada; limites da apuração).
5. `📚 PRINCIPAIS FONTES` (uma linha) + "Lista completa com links no primeiro comentário".
6. `🖼 CRÉDITOS DAS IMAGENS` (autor, licença, fonte de cada uma).
7. `Narração sintética. Trilha e efeitos originais.`
8. Hashtags (3 a 5).
O primeiro comentário fixado leva a lista completa de fontes com links (conteúdo de `fontes-completas.txt`).

## 6. Checklist do roteirista para esta parte
- [ ] Seção "Tela de FONTES" com 8 a 12 itens.
- [ ] Seção "Tela final (padrão)" com: linha de serviço, "veja também", lista de créditos prevista, aviso de voz sintética.
- [ ] B1 com a frase "Todas as fontes estão no final do vídeo."
- [ ] Descrição com o bloco final "Narração sintética. Trilha e efeitos originais."
- [ ] Chamada 3 sem "parte".
