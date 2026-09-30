# Visão geral do fluxo (ponta a ponta)

Canal: **Contra Prova Brasil** (YouTube, documentários curtos, só fontes oficiais). Temas feitos: bets, SUS, Bolsa Família, SUAS. Nichos: saúde, política, história do Brasil, fatos e acontecimentos.

## Duas sessões, dois papéis (não misturar)

| Sessão | Faz | Nunca faz |
|---|---|---|
| **Roteirista** (esta skill) | pesquisa, apuração, roteiro `.md`, decupagem, pacote de publicação, capas e marca por código | editar vídeo, áudio, Remotion, render, QA |
| **Produção** ("Canal dark: geração de mídia") | narração (edge-tts), trilhas/SFX, cenas Remotion, QA de quadros, render, mixagem | inventar fato, mudar locução sem avisar |

Se a máquina nova tiver uma sessão só, ela faz os dois papéis em sequência: primeiro roteiro completo, depois produção.

## Etapas

1. **Preparar a máquina**: `bash scripts/setup.sh` (ver `01-setup-maquina.md`).
2. **Escolher o tema e ampliar a pauta** (`02-pesquisa-e-nichos.md`): o pedido do usuário é o piso; propor capítulos com pontos cruciais.
3. **Apurar em paralelo** com subagentes, um por eixo, só fontes oficiais; salvar em `projetos/<tema>/apuracao/NN-*.md` (`02`).
4. **Escrever o roteiro** `projetos/<tema>/roteiro.md` no modelo de `03-modelo-roteiro.md`.
5. **Auditar**: agente independente confere locução × notas; aplicar correções (`02`, seção "Auditoria").
6. **Capa e pacote de publicação** (`04-capas-e-marca.md`, `05-publicacao.md`).
7. **Entregar à produção** com mensagem-padrão (`06-handoff-producao.md`).
8. **Após o render**: montar a descrição com os capítulos REAIS do vídeo final (`05`).
9. **Checagem no dia da publicação** (fim do roteiro).

## Princípios (valem para tudo)

- Nada inventado. Sem fonte oficial confirmada, a afirmação não entra; vai para "o que ficou de fora".
- Documento oficial vence reportagem. Estimativa é dita como estimativa; associação não é causa.
- Sem personagem, diálogo ou caso fictício. Sem foto de beneficiário identificável.
- Todo vídeo fecha: responde a pergunta do título e as perguntas da abertura, sem ponta aberta.
- Cada vídeo tem identidade visual/sonora própria (motivo visual + som-assinatura + elementos [NOVO]) para não parecer repetição.
- Cada capa tem paleta própria (não repetir as anteriores), mesma estrutura de leitura.

## Produção: ponto de entrada
`references/10-producao-visao-geral.md` e `scripts/producao/novo-projeto.sh` (mantidos pela sessão de produção).
