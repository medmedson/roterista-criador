# Modelo do roteiro (esqueleto para copiar)

Exemplos completos e aprovados: `projetos/sus/roteiro.md`, `projetos/bolsa-familia/roteiro.md`, `projetos/suas/roteiro.md`. Copiar a estrutura, não o conteúdo.

```markdown
# TÍTULO EM CAIXA ALTA (subtítulo)
**Mini documentário jornalístico para canal dark (YouTube, 16:9)**
**Corte de informação:** <data>.
**Duração planejada:** cerca de N minutos, ~N×145 palavras de locução (Remy -5% lê ~130–150 palavras/min).
**Estado da história:** pontos vivos (votações, decisões pendentes, páginas [arquivo]).
**Apuração completa:** projetos/<tema>/apuracao/01..NN

## A decisão editorial
Título de publicação · Título alternativo (A/B) · Frase da capa (2 palavras)
Pergunta do vídeo · Tese narrativa (3 pontos) · Promessa de retenção
Tabela de atos: | Ato | Tempo | Função dramática | Revelação |

## Kit visual deste vídeo (novo)
Motivo visual próprio (ex.: SUS = linha de batimento; Bolsa Família = LinhaPobreza; SUAS = PainelSenhas)
Som-assinatura (onde usar / onde NÃO usar)
Tabela de elementos [NOVO]: Elemento | Forma | Estado inicial | Animação | Estado final
Componentes que continuam: Quadro, Recorte, Carimbo, Polaroide, Documento com marca-texto, MapaBrasil, MapaMundo, LinhaTempo, Contador, Barras, Medidor, Placar, Calendario, Relogio, Fluxo, Etiqueta, Celular, Clarao, Poeira, Fio, FioRompido
SFX do kit + [NOVO SFX] do tema
Padrão de revelação: riser 1–2 s → silêncio 0,5–1 s → impacto → informação
Regra de legenda (cenas só de texto = SEM LEGENDA)

## Mapa de trilha e curva emocional
Curva (ex.: suspense → melancolia → esperança → drama → didática → comoção → indignação → resolução)
Tabela: Bloco | Minuto | Clima | Trilha (nome, [NOVA TRILHA]) | Instrumentação | Intensidade | Entrada→saída
Regras: mesma trilha nunca abre dois blocos seguidos; comoção = piano+cordas, sem efeito por cima; silêncio antes de revelação.

## Roteiro mestre
# ATO I — NOME
### B1 · 00:00–01:45 — Nome do bloco
**Emoção:** ... **Curva:** ...   **Trilha:** `nome` em −20 dB.
**LOCUÇÃO**
“texto falado, só o que a voz diz, números por extenso”
**FIM DA LOCUÇÃO** [F01][F02]
**Cenas (decupagem):**
- **C1 · ANIMADO** · gatilho: “primeiras palavras da frase…”
  - Visual: componentes, plano/câmera, texto de tela exato, dados do gráfico (tipo, série, unidade, período, [Fnn])
  - SOM: trilha, SFX sincronizados, ambiência
  - Legenda: (omitir se só texto)
  - TRANSIÇÃO: tipo, duração em frames, SFX
**Assets:** fotos (link, licença, crédito) + alternativa sem foto
(repete B2..Bn; contar palavras por bloco e ajustar tempos)

## Escaleta de produção (resumo por bloco)  | Bloco | Emoção | Trilha | Elemento novo | Carimbos | Drama |
## Direção de locução   (ritmo, pausas, siglas por extenso, nomes, ressalvas que não se aceleram)
## Direção sonora
## Política de imagens  (proibidos, licenças, alternativas)
## Pacote de publicação (ver 05)
## Fontes e trilha de auditoria  [F01]… com URL, órgão, data, o que sustenta; cálculos próprios; o que ficou de fora
## Checagem final obrigatória no dia da publicação
```

## Regras de escrita da locução
- Só o que a voz fala entre LOCUÇÃO e FIM DA LOCUÇÃO. Sem notas, sem condicionais.
- Frases curtas, ritmo de telejornal. Pergunta-ponte no fim de cada bloco. Gancho de fato concreto nos primeiros 60 s.
- Números, datas, horas e siglas por extenso ("vinte e sete vírgula nove milhões"; "bê pê cê" só se a normalização exigir).
- **Abertura de bloco**: nunca começar com palavras soltas (a voz Remy troca de idioma); usar frase introdutória em português antes de qualquer lista. Ver também `12b-guia-locucao-sem-troca-de-idioma.md` (siglas isoladas, nomes estrangeiros).
- **Chamada de inscrição** em 3 pontos (fim do B1, meio antes do ato de maior interesse, fim junto da tela final), cada uma com locução própria e cena `ChamadaInscricao`. Sem pergunta curta solta ("E a compra de voto?", não "Compra de voto?").
- **Anos seguidos**: nunca "1990 e 2002" colados nem "em 1990 e sancionada em 1993". Use "de 1990 a 2002", "em 2022 e em 2023" ou reordene.
- Tudo que é estimativa, amostra ou associação carrega a ressalva dentro da frase.
- Citação literal entre aspas com autor, data e link; aparece em tela como documento com marca-texto.
- Estudos: autores, ano, revista, DOI; o que mediu, método em uma frase, limite.
- Toda foto de pessoa: licença confirmada **e** alternativa sem foto descrita na cena.
- Sem personagem inventado; exemplo didático só se marcado "hipotético".
- Fechamento: último bloco responde o título e as perguntas da abertura, faz balanço (funciona / falha / em disputa) e termina numa frase conclusiva, sem pergunta aberta.

## Decupagem (como a produção lê)
- `ESTÁTICO` (leitura: documento, citação, número-chave; segurar 3–6 s, só drift/zoom lento) × `ANIMADO` (dados, mapas, contadores, rotas). Alvo ~40/60; sem duas estáticas longas seguidas; número animado termina com hold estático de 2–3 s; nunca animar sobre texto que precisa ser lido.
- Cena só de texto (cartela, citação, documento, número sozinho, pergunta, tela final) = **SEM LEGENDA**.
- Carimbos: 1–2 por bloco, só em revelação, nunca sobre texto. Drama (tremor + clarão + impacto grave) só em revelações grandes.
- Transições com sentido: corte seco (choque), fusão lenta (tempo/luto), whip/whoosh (assunto), match cut, zoom-through (entrar em documento), flash (drama), fade a preto (fim de ato), página virando (capítulo), glitch (dado/tecnologia); 8–15 frames; SFX casado; não repetir o mesmo tipo mais de 2 vezes seguidas.
- Som: trilha muda de clima por bloco; nível sob a voz −18 a −24 dB; silêncio curto como recurso; batida/som-assinatura ligados ao motivo; comoção sem efeitos por cima.
- Etiquetas de tela curtas (~25 caracteres por linha); texto longo estoura a coluna.
- Nada cortado pela borda sem ser proposital; nada sob a legenda; nada sobreposto; nunca tela vazia.
