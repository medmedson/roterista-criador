# Pesquisa, nichos e apuração

## Escolha e ampliação do tema
1. O usuário dá o tema e alguns tópicos. **Tópicos = piso.** Contar a história completa: origem, quem criou, quando, por quê, como funciona, o que faz além do óbvio, impacto social (baixa renda), críticas e falhas documentadas (corrupção, desvio, filas, financiamento), estado atual, disputa política e conclusão.
2. Antes de escrever, listar a **pauta ampliada**: capítulos com título + ponto crucial, incluindo o que o usuário não pediu (mitos × fatos, como funciona na prática, comparação internacional, conexão com vídeos anteriores).
3. Nichos do canal e ganchos que funcionam: saúde (SUS, vacinas, transplantes), política (bets, emendas, votações), assistência/economia (Bolsa Família, SUAS, BPC), história do Brasil. Título de curiosidade com número real ("43 milhões de famílias… você sabe o que é o SUAS?") ou acusação a testar ("Esmola, comodismo ou solução?"). Ver vídeos anteriores em `projetos/` para não repetir motivo visual nem som.
4. Sugestões de tema novo: pesquisar o que o brasileiro usa/ouve e não entende (sigla desconhecida, programa grande, lei recente, disputa em votação). Verificar antes que existam dados oficiais suficientes.

## Fontes permitidas (ordem de confiança)
1. Lei, decreto, mensagem de veto: `planalto.gov.br`. Tramitação: `camara.leg.br`, `senado.leg.br` (dados abertos).
2. Bases: IBGE (SIDRA), Tesouro (SICONFI, RTN), SIOP/SOF (orçamento), MDS/SAGI (MI Social), DataSUS/OpenDataSUS, BCB (SGS), TSE.
3. Controle e justiça: TCU (acórdãos), CGU, STF/STJ (notícias e peças).
4. Pesquisa: Ipea, Fiocruz, Butantan, OMS/OPAS, FAO, Banco Mundial; periódicos revisados (SciELO, Lancet, BMJ, Nature Medicine, JAMA, PLoS) com DOI.
5. Imprensa só como pista ou para citar fala, veículo nomeado. Wikipedia só para achar a fonte primária.

## Ferramentas e receitas
- `WebSearch` com `allowed_domains`: `["gov.br","leg.br","jus.br","ibge.gov.br","scielo.br","fiocruz.br","who.int","paho.org","doi.org"]`.
- `WebFetch` no PDF/página para extrair o trecho literal.
- APIs (todas gratuitas, via `curl`):
  - IBGE: `https://apisidra.ibge.gov.br/values/t/9514/n1/1/v/93/p/2022/...` e `https://servicodados.ibge.gov.br/api/`
  - Câmara: `https://dadosabertos.camara.leg.br/api/v2/proposicoes/<id>` (+ `/tramitacoes`, `/votacoes`)
  - Senado: `https://legis.senado.leg.br/dadosabertos/`
  - MDS MI Social: `https://aplicacoes.mds.gov.br/sagi/servicos/misocial` (CadÚnico, Bolsa Família, BPC, CADSUAS por município)
  - SIOP (SPARQL): `https://www1.siop.planejamento.gov.br/sparql/` (orçamento por função/ação/ano)
  - Tesouro/SICONFI: `https://apidatalake.tesouro.gov.br/ords/siconfi/tt/rreo?...`
  - BCB SGS: `https://api.bcb.gov.br/dados/serie/bcdata.sgs.<cod>/dados?formato=json`
  - TCU: dado aberto CSV de acórdãos; texto em `pesquisa.apps.tcu.gov.br`.
- **Período eleitoral**: páginas gov.br podem exibir "Conteúdo Restrito". Ler cópia em `web.archive.org/web/2026/<url>` e marcar **[arquivo]**; no dia da publicação reabrir o original.
- Corrigir valores pela inflação com IPCA (série BCB) e dizer "em reais de hoje".

## Pesquisa paralela com subagentes
Um agente por eixo (histórico, estrutura/números, benefício, público atendido, críticas/financiamento, situação hoje, fotografias/licenças). Instruções fixas no prompt:
- Só fontes oficiais; devolver **fato + URL + trecho literal + data**; "não localizado" quando não achar.
- Apontar conflitos entre fontes e qual vence (documento oficial).
- Salvar em `apuracao/NN-eixo.md`, com seção "Conflitos" e "Não confirmado".
- Fotografias: só licença livre confirmada (Wikimedia Commons, Agência Brasil acervo memória, Agência Senado/Câmara conforme licença); anotar autor, licença, URL.

## Regras de conteúdo
1. Número com definição e período. Não trocar categorias (receita ≠ lucro; pago ≠ empenhado; famílias ≠ pessoas).
2. Atribuição histórica precisa: quem propôs, aprovou, sancionou, quando.
3. Premissas do usuário ou de agentes que não se confirmam **são descartadas** e listadas em "o que ficou de fora" (já aconteceu: "orçamento zero 2021", autoria atribuída sem fonte, decreto errado).
4. Equilíbrio: tema positivo mostra limites documentados; tema negativo mostra o que funciona.
5. Cálculo próprio sempre declarado como tal, com a fórmula em `apuracao/`.

## Auditoria independente (obrigatória)
Depois de escrever, disparar um agente novo (sem o histórico) com o prompt: conferir cada afirmação factual da locução e dos textos de tela contra `apuracao/*.md`; apontar (1) sem suporte ou número/data diferente, (2) atribuição imprecisa, (3) causalidade indevida, (4) inconsistência interna entre blocos, (5) trechos que o TTS leria errado (anos colados por "e"). Não editar. Aplicar as correções com Python `str.replace` e registrar no fim do roteiro.
Rodar também `scripts/checar-fontes.sh roteiro.md`.
