# roterista-criador — skill `apuracao-oficial` (Contra Prova Brasil)

Skill do Claude Code que faz o canal inteiro, do tema ao vídeo publicado:
- **Roteiro:** apuração só em fontes oficiais, roteiro com decupagem, capa e pacote de publicação. Ver `SKILL.md`, seções 0 a 6, e `references/00–06`.
- **Produção:** narração edge-tts (voz Remy), trilhas e efeitos por síntese, cenas em Remotion, QA de quadros, render e descrição. Ver `SKILL.md`, seção 7, e `references/10–16`.

## Instalar numa máquina nova

```bash
git clone git@github.com:medmedson/roterista-criador.git ~/.claude/skills/apuracao-oficial
bash ~/.claude/skills/apuracao-oficial/scripts/setup.sh ~/canaldark
bash ~/.claude/skills/apuracao-oficial/scripts/producao/verificar-ambiente.sh ~/canaldark
```

## Atualizar uma máquina que já tem a skill

```bash
cd ~/.claude/skills/apuracao-oficial && git pull
```

Se a pasta não veio do git, apague-a ou renomeie e clone de novo. A pasta `atualizacoes/` lista o que mudou em cada data.

## Leitura obrigatória antes de gerar voz

Leia `references/12b-guia-locucao-sem-troca-de-idioma.md`. A voz troca de idioma com palavras soltas, siglas soletradas e nomes em inglês. O `scripts/producao/checar-locucao.py` trava a geração da voz quando encontra esse risco.
