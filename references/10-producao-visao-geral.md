# Produção: visão geral (roteiro pronto → vídeo final)

A sessão de produção recebe `projetos/<tema>/roteiro.md` e entrega:
- `render/<tema>-documentario-final.mp4` (1080p, 30 fps, áudio -14 LUFS);
- `render/thumbnail.png` (1280×720);
- `render/descricao-youtube.txt` (capítulos com tempos REAIS);
- `render/fontes-completas.txt` (para o primeiro comentário).

Tudo é feito por código e de graça:
- voz: edge-tts, voz Remy;
- animação e edição: Remotion (React);
- trilhas e efeitos: síntese em numpy, sem direitos de terceiros;
- mixagem e junção: ffmpeg.

Não usa imagem de IA. As fotos são só de Wikimedia Commons com licença conferida.

## Pastas

```
<canal>/                      ex.: ~/canaldark
  .venv/                      python com edge-tts, numpy, pillow
  ferramentas/                normalizar.py, gerar-sfx*.py, gerar-trilhas*.py (cópia de assets/producao-ferramentas)
  projetos/<tema>/
    roteiro.md                vem da sessão de roteiro
    apuracao/                 notas da pesquisa (fonte de verdade para textos de tela)
    locucao/                  NN_raw.txt (extraído), NN.txt (normalizado), siglas.json, pausas.txt, substituicoes.json
    audio/                    NN.mp3 + NN.srt (edge-tts)
    video/                    projeto Remotion (cópia de assets/producao-template-video)
      public/audio|sfx|fotos|data
      src/cenas/BlocoNN.tsx   uma composição por bloco do roteiro
      src/componentes/        kit visual reutilizável
      src/data/               cues.json, mapa.json, mundo.json (gerados)
    qa/blocoNN/folha.jpg      folha de contato da auditoria
    render/blocos/            um mp4 por bloco (retomável; guardar até a publicação)
    render-final.sh
```

## Sequência (comandos)

S = pasta da skill; C = pasta do canal; T = tema.

1. Confira o ambiente: `bash $S/scripts/producao/verificar-ambiente.sh $C`. Se faltar algo, veja o `11-producao-setup.md`.
2. Crie o projeto: `bash $S/scripts/producao/novo-projeto.sh $C $T`. Ele copia o modelo, roda `npm ci` e gera trilhas e efeitos.
3. Extraia a locução: `python3 $S/scripts/producao/extrair-locucao.py $C/projetos/$T`.
4. Escreva as siglas e nomes em `locucao/siglas.json`, conforme a "Direção de locução" do roteiro e as regras do `12-producao-narracao.md`. Escreva as frases com pausa em `locucao/pausas.txt`.
5. Gere o áudio: `bash $S/scripts/producao/gerar-audio.sh $C $T`. Antes da voz, ele roda o **verificador de idioma** (`checar-locucao.py`) e para se houver risco ALTO (`12b-guia-locucao-sem-troca-de-idioma.md`). Confira a duração total e o que o normalizador deixou sem tratar.
6. **Revisão pelo usuário: no vídeo final.** O usuário não ouve a narração antes (não tem tempo); ele assiste o vídeo pronto e aponta o **minuto** do que estranhou.
   - Por isso a trava de idioma (passo 5) e as pronúncias aprovadas (`12`, `12b`) são aplicadas sem esperar aprovação: na dúvida, use a forma mais segura em português (sem sigla solta, sem palavra estrangeira).
   - `narracao-completa.sh` continua disponível se ele pedir para ouvir antes.
   - Correção apontada no vídeo: ache o bloco pelos capítulos (`capitulos.sh`), corrija o `NN_raw.txt`, regrave só esse bloco, confira a cena e re-renderize só os blocos afetados.
7. **Amostras para escolha (só em dúvida real; não travar a produção esperando):** `bash $S/scripts/producao/amostra-pronuncia.sh $C <assunto> "A-atual|frase atual com contexto" "B-proposta|…"`.
   - O script grava em `~/Downloads/<assunto>-opcoes/`: um `opcao-N-<rotulo>.mp3` por versão e `todas-em-sequencia.mp3`.
   - Sempre em Downloads, nunca só como anexo, porque o anexo no chat nem sempre abre para o usuário.
   - A primeira opção é sempre a atual (A). Cada amostra tem uma frase de contexto, nunca a palavra sozinha.
   - Pergunte: "qual número ficou bom?". Registre a escolha no `12b-guia…`, na tabela de casos, e no `siglas.json`.
8. Gere as trilhas e efeitos novos pedidos no roteiro. Crie `ferramentas/gerar-trilhas-<tema>.py` e `gerar-sfx-<tema>.py` a partir dos existentes (`14-producao-som.md`) e rode-os com saída em `video/public/sfx`.
9. Baixe e confira as fotos com licença e registre em `video/public/fotos/CREDITOS.txt` (`16`, seção imagens).
10. Crie o kit visual do tema em `src/componentes/Kit<TEMA>.tsx` com os elementos [NOVO] do roteiro (`13-producao-cenas.md`).
11. Faça os blocos, um por vez:
    - escreva `src/cenas/BlocoNN.tsx` e registre no `Root.tsx`;
    - rode `node qa-quadros.mjs NN` até dar 0 problemas;
    - olhe a folha de contato (`qa/blocoNN/folha.jpg`) e corrija o que a auditoria não vê.
12. Monte a composição completa e a capa: `cenas/Documentario.tsx` (Series com todos os blocos) e `cenas/Thumbnail.tsx`, seguindo o pacote de publicação do roteiro. Gere a capa com `npx remotion still Thumbnail ../render/thumbnail.png`.
13. Descrição: pegue o texto pronto do roteiro e troque os capítulos pelos tempos de `bash $S/scripts/producao/capitulos.sh $C/projetos/$T`. Preencha os créditos das fotos. Passe as fontes para `render/fontes-completas.txt`. A descrição tem de ficar abaixo de 5.000 caracteres.
14. Render: `caffeinate -dimsu ./render-final.sh`, em segundo plano. Leva de 15 a 40 min por bloco, conforme a carga da máquina (`15-producao-qa-render.md`).
15. Confira o arquivo com `ffprobe` (duração e tamanho) e entregue: final, capa, descrição e fontes. Não gere prévia 720p, porque o usuário pediu só o arquivo final.

## Ordem de trabalho com o usuário

- Um vídeo por vez. Se o usuário pedir para terminar um antes de corrigir outro, siga essa ordem.
- Correções que o usuário aponta assistindo:
  - anote em `projetos/<tema>/pendencias.md` com o minuto;
  - corrija a causa no componente ou script, não só no caso visto;
  - renderize de novo só os blocos afetados (apague `render/blocos/blocoNN.mp4` e rode o `render-final.sh`, que pula os prontos e junta de novo).
- Avise o andamento a cada etapa grande. O usuário acompanha pelo celular.
