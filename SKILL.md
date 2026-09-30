---
name: apuracao-oficial
description: Apura um tema em fontes oficiais e primárias (gov.br, leg.br, jus.br, IBGE, Banco Central, DataSUS, TSE, OMS/OPAS) e escreve o roteiro completo de vídeo documental jornalístico para canal dark do YouTube, no formato de projetos/bets/roteiro.md. Use quando o usuário pedir "roteiro", "novo vídeo", "documentário sobre X", "apure X", "pesquise com fontes oficiais", ou quando qualquer afirmação precisar de fonte verificável — nada inventado. Também cobre a PRODUÇÃO do vídeo a partir do roteiro: narração com edge-tts (voz Remy), trilhas e efeitos por síntese, cenas animadas em Remotion, auditoria de quadros, render final, thumbnail e descrição — use quando o usuário pedir "gerar o vídeo", "produzir", "narração", "renderizar", "corrigir cena/legenda/pronúncia", ou montar o canal em outra máquina.
---

# Apuração oficial + roteiro documental

Sessão de roteiro **só escreve texto**. Não edita vídeo, áudio, Remotion nem arquivos de `video/`, `audio/`, `render/`, `qa/` — isso é da sessão de produção.

Saída: `projetos/<tema>/roteiro.md` (+ `projetos/<tema>/apuracao/*.md` com notas de pesquisa e trechos citados).

## 0. Pacote portátil (instalar em outra máquina)

Esta pasta é autossuficiente. Copiar `~/.claude/skills/apuracao-oficial/` inteira para a mesma pasta da outra máquina e rodar:

```
bash ~/.claude/skills/apuracao-oficial/scripts/setup.sh ~/canaldark
```

Ele confere Node, Python, ffmpeg, Chrome, instala `marca/` (gerador de capas + fontes), `ferramentas/` (normalizador, trilhas, SFX) e cria o `.venv` com edge-tts. Depois, ler na ordem:

| Arquivo | Conteúdo |
|---|---|
| `references/00-visao-geral.md` | fluxo ponta a ponta, papéis das duas sessões, princípios |
| `references/01-setup-maquina.md` | ferramentas, pastas, regras de operação (caffeinate, disco, Chrome headless) |
| `references/02-pesquisa-e-nichos.md` | escolha de tema, pauta ampliada, fontes, APIs oficiais, subagentes, auditoria |
| `references/03-modelo-roteiro.md` | esqueleto do roteiro, regras de locução e decupagem |
| `references/04-capas-e-marca.md` | marca, capas por código, Chrome headless, checagem visual |
| `references/05-publicacao.md` | título, descrição, capítulos reais, tags, comentário fixado |
| `references/06-handoff-producao.md` | mensagem à sessão de produção e resumo do pipeline |
| `references/producao-exemplos/` | exemplos de componentes Remotion (mantidos pela sessão de produção) |
| `scripts/` | `setup.sh`, `render-svg.sh`, `checar-fontes.sh` |
| `assets/` | `marca/` (fontes e geradores), `producao-ferramentas/` (Python) |

Ao mudar o processo, editar ESTA skill (não criar outra) e atualizar o arquivo de `references/` correspondente. A sessão de produção acrescenta seus próprios arquivos em `references/` e `assets/` com prefixo `producao-`.

## 1. Regras de apuração (inegociáveis)

1. **Fonte primária manda.** Lei no Planalto, ata/votação no Senado/Câmara, dado na base oficial (IBGE, BCB, DataSUS, TSE, Tesouro, ministério), relatório de órgão (OMS, OPAS, Fiocruz, Butantan, TCU, CGU). Imprensa só como pista ou para citar fala/entrevista — e com o veículo nomeado.
2. **Conflito:** documento oficial vence reportagem. Registrar o conflito na lista de fontes.
3. **Cada afirmação factual** leva `[Fnn]` logo após o bloco de locução; cada `Fnn` tem link, órgão, data do documento e o que ele sustenta.
4. **Número sempre com definição e período** ("transplantes realizados em 2025, dado preliminar do SNT"). Não trocar categorias (receita ≠ lucro, cobertura ≠ doses, usuários exclusivos ≠ usuários eventuais).
5. **Não achou = não afirma.** Escrever "não localizado" nas notas; nunca preencher com suposição, arredondamento criativo ou "estima-se" sem autor.
6. **Estimativas** ditas como estimativas, com autor e método ("estimativa modelada do IEPS").
7. **Atribuição histórica precisa:** quem propôs, quem aprovou, quem sancionou, em que data. Distinguir Congresso, Executivo, Judiciário, movimento social.
8. **Sem personagem inventado.** Nenhuma família, diálogo, depoimento ou caso fictício. Exemplo didático só se marcado "exemplo hipotético".
9. **Equilíbrio:** tema positivo também mostra limites e críticas documentadas (filas, financiamento, desigualdade), com fonte.
10. **Checagem cruzada final:** antes de entregar, um agente independente confere cada `Fnn` contra o texto da locução e aponta afirmação sem suporte.

## 2. Ferramentas de pesquisa

- `WebSearch` com `allowed_domains` para restringir a fontes oficiais: `gov.br`, `leg.br`, `jus.br`, `ibge.gov.br`, `bcb.gov.br`, `fiocruz.br`, `butantan.gov.br`, `who.int`, `paho.org`, `scielo.br`.
- `WebFetch` para abrir a página/PDF e extrair o trecho exato.
- Navegador do app (`mcp__Claude_Browser__*`) para Google e sites com JavaScript.
- APIs oficiais via `curl` (gratuitas):
  - IBGE SIDRA: `https://apisidra.ibge.gov.br/values/...` ; IBGE serviços: `https://servicodados.ibge.gov.br/api/`
  - Banco Central SGS: `https://api.bcb.gov.br/dados/serie/bcdata.sgs.<codigo>/dados?formato=json`
  - Câmara: `https://dadosabertos.camara.leg.br/api/v2/` ; Senado: `https://legis.senado.leg.br/dadosabertos/`
  - TSE: `https://dadosabertos.tse.jus.br/`
  - Saúde: `https://opendatasus.saude.gov.br/` , TabNet DataSUS
  - Planalto (leis): `https://www.planalto.gov.br/ccivil_03/`
- Para temas grandes: disparar agentes de pesquisa em paralelo (um por eixo), cada um devolvendo fatos + URL + trecho literal + data; salvar em `apuracao/`.

## 3. Formato do roteiro (espelho de projetos/bets/roteiro.md)

1. Cabeçalho: título, corte de informação (data), duração planejada, estado da história.
2. **Decisão editorial:** título de publicação, frase da capa, pergunta do vídeo, tese narrativa, promessa de retenção, tabela de atos (tempo, função dramática, revelação).
3. **Roteiro mestre:** blocos `### mm:ss–mm:ss — Nome`, cada um com **Imagem**, **Áudio** (quando relevante), `**LOCUÇÃO**` “texto falado” `**FIM DA LOCUÇÃO** [Fnn]`, e **Tela/Inserção**.
4. Tabelas comparativas quando o tema pedir.
4b. **Dados gráficos obrigatórios:** cada bloco com número relevante traz um `**Gráfico:**` pronto para a produção — tipo (barra, linha, contador, mapa, pizza), série completa de valores com unidade e período, rótulos de tela, e `[Fnn]` da base. Só valores apurados; nada interpolado.
4d. **Estudos científicos:** sempre que existirem, citar estudos revisados por pares (autores, ano, revista, DOI/link — Lancet, BMJ, PLoS, SciELO, PubMed, Fiocruz, IPEA). Dizer o que o estudo mediu, método em uma frase e limite (associação ≠ causalidade). Nunca atribuir ao estudo conclusão que ele não tira.
4c. **Citações:** falas e trechos literais (lei, relatório, discurso) entre aspas, com autor, data e link; indicar se aparecem em tela como documento com marca-texto.
5. Escaleta de produção (trecho, encaixe visual, texto de tela, nota).
6. Direção sonora, direção de locução, política de imagens.
7. **Pacote de publicação:** thumbnail, título alternativo, descrição pronta (com capítulos), tags, comentário fixado, cortes curtos.
8. Fontes `[Fnn]` com links.
9. Checagem final obrigatória para a data de publicação.

## 4. Regras de texto para a produção

- **Locução limpa:** entre LOCUÇÃO e FIM DA LOCUÇÃO só o que a voz fala. Nenhuma instrução de produção, condicional ("se conseguirmos...") ou nota.
- Voz TTS (edge-tts Remy, ~150 palavras/min reais). Para N minutos de vídeo, escrever ~N × 145 palavras de locução.
- Frases curtas, ritmo de telejornal; pausas dramáticas indicadas fora da locução.
- **Abertura de bloco sem lista de palavras soltas:** a voz Remy começa em outro idioma quando o bloco abre com palavras isoladas ("Esmola. Preguiça. Filho para ganhar mais."). Sempre uma frase introdutória em português antes da lista ("As acusações são conhecidas: esmola, preguiça, filho para ganhar mais.").
- **Guia obrigatório de locução:** ler `references/12b-guia-locucao-sem-troca-de-idioma.md`. Além da regra acima: não isolar sigla em frase curta ("Você conhece o SUS e conhece o INSS.", não "Você conhece o SUS. Conhece o INSS.") e usar equivalente em português para nomes estrangeiros.
- **Nomes de periódicos e instituições em inglês** ("The Lancet", "British Medical Journal"): a locução descreve em português ("uma das principais revistas médicas do mundo") e o nome original vai na tela ou no rodapé. Antes de entregar, rodar `scripts/producao/checar-locucao.py --raw` sobre as locuções.
- Anos seguidos: evitar "1990 e 2002" colados (TTS lê "noventa e dois mil e dois"); preferir "de 1990 a 2002" ou separar por vírgula. O normalizador da produção (`ferramentas/normalizar.py`) já trata a vírgula, mas o roteiro deve evitar a construção ambígua.
- Toda foto de pessoa no roteiro precisa de licença confirmada no catálogo **e** de uma alternativa sem foto (documento com marca-texto ou recorte de texto) já descrita na cena.
- Siglas: explicar na primeira menção. A produção normaliza números por extenso, mas evitar construções ambíguas.
- **Tópicos do usuário são piso, não teto:** contar a história completa do tema (origem, quem, quando, como, por quê, o que faz, impacto social, lados negativos como corrupção/falhas/críticas documentadas, estado atual) e ampliar a apuração além da lista pedida.
- **Propor pauta ampliada:** antes de escrever, listar os capítulos propostos (títulos com o ponto crucial de cada um), incluindo temas que o usuário não citou: mitos × fatos, como funciona na prática, política e disputa entre governos, comparação internacional, conexões com vídeos anteriores do canal.
- **Fechamento obrigatório:** o último bloco responde explicitamente a pergunta do título e as perguntas da abertura, faz balanço (o que funciona, o que falha, o que está em disputa hoje) e termina com uma frase conclusiva, sem pergunta aberta. O espectador não pode sentir que o vídeo acabou sem conclusão.
- **Começo, meio e fim sem pontas abertas:** toda pergunta feita na abertura é respondida até o fechamento; nenhum personagem ou dado introduzido sem desfecho.
- Gancho no primeiro minuto (fato concreto, cena real documentada) e perguntas-ponte entre blocos.

## 5. Direção visual (estilo aprovado do canal)

Indicar imagens compatíveis com o quadro de investigação: cortiça escura, recortes de jornal com texto próprio (sem imitar veículos reais), fio vermelho, carimbos (1–2 por bloco, só em revelações), mapas do Brasil/mundo com rotas e marcadores, contadores animados, polaroides P&B de fotos CC com crédito, documentos oficiais com marca-texto, placares, linhas do tempo. Marcar momentos de drama (tremor + clarão + impacto) e de silêncio curto. Trilha cobre quase todo o vídeo, variando clima. Evitar tela estática.

## 5b. Tom e decupagem para a sessão de produção

Tom de **mini documentário**: drama, suspense, emoção, esperança, indignação — escolher a emoção de cada bloco e dizê-la. Emoção vem de fatos reais documentados, nunca de cena inventada.

Cada bloco do roteiro traz, além da locução:
- **Emoção do bloco** e **curva** (ex.: tensão → alívio).
- **Decupagem em cenas numeradas** (`C1, C2...`), cada cena amarrada à frase da locução que a dispara (citar as primeiras palavras). Para cada cena: plano/câmera (zoom, pan, afastamento, tremor), elementos em quadro (usar vocabulário dos componentes existentes: Quadro, Recorte, Fio, FioRompido, Carimbo, Polaroide, Documento com marca-texto, MapaBrasil, MapaMundo com rotas, LinhaTempo, Contador, Barras, Medidor, Placar, Calendario, Relogio, Fluxo, Etiqueta, Celular, Clarao, Poeira), animação, texto de tela exato, dados do gráfico, SFX (`clique, carimbo, impacto, pulso, subida`) e trilha (`investigacao, tensao, drama, desfecho` ou nova sugerida), transição para a próxima cena.
- **Elementos novos por tema:** não repetir só o kit do vídeo anterior. Cada roteiro propõe um **motivo visual próprio** (ex.: SUS = linha de batimento cardíaco no lugar do fio vermelho) e uma lista de **elementos novos** ligados ao assunto, descritos com forma, estado inicial, animação e estado final, para a produção construir como componente reutilizável. Marcar `[NOVO]` na primeira aparição.
- **Equilíbrio estático × animado:** indicar em cada cena `ESTÁTICO` (leitura: documento, citação, número-chave — segurar 3–6 s, só drift/zoom lento) ou `ANIMADO` (dados, mapas, rotas, contadores, transições). Alvo ~40% estático / 60% animado; nunca duas cenas estáticas longas seguidas; nunca animação sobre texto que precisa ser lido.
- **Transições:** cada troca de cena e de bloco tem linha `TRANSIÇÃO:` escolhida pelo sentido narrativo, não por enfeite — corte seco (choque, revelação), fusão lenta (passagem de tempo, luto), whip pan/whoosh (mudança de assunto rápida), match cut (forma que vira outra: gota de vacina → ponto no mapa), zoom-through (entrar num documento/objeto), flash branco/vermelho (drama), fade para preto (fim de ato), wipe de papel/página virando (mudança de capítulo), glitch de monitor (dado/tecnologia). Cada transição com duração (ex.: 8–15 frames) e SFX casado. Variar; não repetir o mesmo tipo em sequência mais de 2 vezes.
- **Desenho de som cinematográfico (prioridade):** cada cena tem linha `SOM:` com (a) **trilha** — nome do clima (ex.: `investigacao`, `tensao`, `drama`, `desfecho`, ou nova sugerida como `esperanca`, `hospital`, `denuncia`), entrada/saída (fade, corte seco, sting), nível sob a voz (−18 a −24 dB típico), troca de trilha a cada mudança de clima; (b) **SFX sincronizados** ao evento visual: virar página, papel deslizando, clique, carimbo, máquina de escrever, flash de câmera, pulso/batimento, monitor cardíaco (bip/linha contínua), porta, avião/turbina, whoosh de transição, riser antes de revelação, impacto grave, hit de silêncio. Novos SFX marcados `[NOVO SFX]`. (c) **ambiência** quando couber (corredor de hospital, sala de arquivo, chuva). Riser → silêncio de 0,5–1 s → impacto antes de toda revelação grande.
- **Mapa de trilha (obrigatório em todo roteiro):** seção própria "Mapa de trilha" com uma tabela por bloco/cena: minuto, clima (suspense, drama, emoção, comoção, esperança, tensão, denúncia, resolução), instrumentação sugerida (piano, cordas, pulso grave, drone, percussão seca, silêncio), andamento/intensidade (crescendo, sustentado, decrescendo), tipo de entrada e saída (fade, corte seco, sting, ponte de silêncio) e a **curva emocional do vídeo inteiro** (ex.: suspense → indignação → comoção → esperança). Regras: trocar de trilha a cada mudança de clima, nunca repetir a mesma trilha em dois atos seguidos, reservar 1 ou 2 momentos de comoção (piano/cordas, sem efeito) e 1 ou 2 de suspense (drone + pulso), deixar silêncio curto antes de revelações, e reservar a trilha mais forte para a virada e o fechamento. Nomear as trilhas novas como `[NOVA TRILHA]`, com 1 linha de referência de clima para a produção compor.
- **Legenda:** toda cena cuja animação é só texto (cartela, citação, documento, contador/número sozinho, recorte de texto, pergunta, cartela de ato, tela final) é `SEM LEGENDA` (ocultar) — evita poluição e redundância. Legenda só sobre imagem não textual.
- **Batida de coração / SFX-assinatura:** cada roteiro define um som-assinatura ligado ao motivo visual (ex.: SUS = batimento cardíaco) e diz onde usá-lo (tensão, espera, perda, revelação humana) e onde não usar (dados frios).
- **Momentos de drama** marcados (tremor + clarão + impacto), **silêncios** com duração e **sem legenda** quando a tela já é texto.
- Assets necessários (fotos CC com link e crédito, documentos com URL e página) listados por bloco.

## 6. Thumbnail (padrão aprovado)

1280×720. Rostos reais recortados (quantidade conforme o tema — pode ser zero, com objeto/lugar como protagonista), expressão séria; elemento principal maior à direita. Tratamento dessaturado, contraste alto, granulação, luz vermelha nas bordas. Fundo: colagem temática desfocada. Rótulos pequenos caixa alta com fio dourado. Chamada gigante no terço inferior, 2–3 palavras, condensada ultrabold texturizada, 1ª parte branca e 2ª amarela, pincelada vermelha embaixo. Sem emoji/setas. Fotos com licença e crédito na descrição.

## 7. Produção (sessão de produção: roteiro → vídeo final)

Tudo por código e gratuito: edge-tts (voz Remy) → Remotion (React) → ffmpeg; trilhas/efeitos por síntese numpy; fotos só Commons com licença conferida. Ler na ordem:

- `references/10-producao-visao-geral.md` — pastas, sequência completa de comandos, ordem de trabalho com o usuário.
- `references/11-producao-setup.md` — ferramentas e versões testadas, instalação em máquina nova, disco, CPU, caffeinate.
- `references/12b-guia-locucao-sem-troca-de-idioma.md` — **obrigatório para roteiro e produção**: como escrever e gerar a locução sem a voz trocar de idioma (casos reais e checklist).
- `references/12-producao-narracao.md` — voz, normalizador, siglas e **pronúncias aprovadas** (béts, IBGE, Butantã…), pausas, legendas.
- `references/13-producao-cenas.md` + `13b-producao-catalogo-componentes.md` — arquitetura Remotion, padrão de tempo `t()`/`r()`, regras visuais, marcas de auditoria, kits existentes; exemplos em `references/producao-exemplos/`.
- `references/14-producao-som.md` — geradores de trilha/efeito, níveis, revelação, mixagem.
- `references/15-producao-qa-render.md` — `qa-quadros.mjs` (0 problemas + folha de contato), render retomável, entrega.
- `references/16-producao-regras-e-armadilhas.md` — preferências do usuário, licenças, tabela de erros já vividos e correções.

Scripts: `scripts/producao/` (verificar-ambiente, novo-projeto, extrair-locucao, **checar-locucao** (trava de idioma antes da voz), gerar-audio, pausas, amostra-pronuncia (amostras em ~/Downloads/<assunto>-opcoes), narracao-completa (áudio inteiro para o usuário revisar ANTES das cenas), capitulos, render-final). Modelo de projeto: `assets/producao-template-video/` (package-lock travado; `npm ci`). Geradores de som: `assets/producao-ferramentas/` + `assets/producao-sfx-base/`.
