# Produção: auditoria (QA), folha de contato e render

## Auditoria automática

```bash
cd projetos/<tema>/video
TMPDIR=<rascunho> node qa-quadros.mjs 07            # um bloco
TMPDIR=<rascunho> node qa-quadros.mjs 01 02 03      # vários
node qa-quadros.mjs 07 --sem-folha                  # só a lista de problemas
```

O script renderiza 1 a cada 6 quadros com `inputProps {qa: true}`. Em cada quadro, o componente `Auditoria` mede os elementos `data-foco`. A saída mostra `=== Bloco NN: X problema(s)` e a folha em `qa/blocoNN/folha.jpg`, um quadro por fala, numerado.

| Aviso | Significado | Correção típica |
|---|---|---|
| CORTADO | elemento sai da tela | encurtar o texto, reduzir `largura` ou `tamanho`, mover |
| SOB_LEGENDA | elemento na faixa da legenda (y > ~880) | subir o conteúdo, reduzir altura, ocultar a legenda se a tela for só texto |
| SOBREPOSTO | dois `data-foco` se cruzam (> 4% da área) | reposicionar, tirar o carimbo de cima do texto, ou `data-sobrepor-ok` se for decorativo |
| VAZIO | nenhum elemento inteiro visível (ex.: começo de parte com `entra` > 0) | fazer algo aparecer já no quadro 0 (`entra={-6}`) ou `data-pausa-ok` se o vazio for proposital |
| TRANSBORDA | texto vaza da própria caixa na horizontal | `whiteSpace: nowrap` com largura maior, ou texto menor |
| TEXTO_CORTADO | texto cortado por `overflow: hidden` ou `foreignObject` | aumentar a caixa ou trocar `foreignObject` por `<text>` SVG |
| TRANSBORDA (vertical) | texto quebrou linha e saiu da caixa com fundo pintado (ex.: visor "R$ 13,04 BI · SET/2026") | `whiteSpace: nowrap` + caixa com `minWidth`/`padding`; encurtar texto |
| PARADO | mais de 6 s sem mudança visível na tela (`qa-parado.py`) | a `CameraViva` já resolve a maioria; se ainda aparecer (tela preta ou fundo liso), adicionar elemento amarrado à fala, zoom/drift lento, marca-texto que avança (ver `13c`) |

Regra: só entregue o bloco com **0 problemas** e depois de olhar a folha de contato. A auditoria não vê várias coisas, e a folha pega:
- elemento que nunca aparece (erro de frame relativo em Sequence aninhada);
- tela vazia demais ou elemento pequeno demais;
- mapa ampliado mostrando o lugar errado;
- ordem de animação estranha;
- valor intermediário mostrado como se fosse real (contador de 400 → 600 exibindo "R$ 450"; prefira "R$ 400 → R$ 600");
- texto de documento inventado.

Para ver um quadro específico: `npx remotion still Bloco08 <saida>.png --frame=3700`.

## Render final

```bash
cd projetos/<tema> && caffeinate -dimsu ./render-final.sh > render/render.log 2>&1   # em segundo plano
tail -2 render/render.log                                                            # andamento
```

- Um mp4 por bloco em `render/blocos/`. Se o bloco já existe, é pulado, então o render é retomável.
- Depois o script junta tudo com `concat` (sem recodificar) e aplica loudnorm em `<tema>-documentario-final.mp4`.
- **Não gera prévia 720p**, a pedido do usuário. Ela só ocupava disco.
- Confira: `ffprobe -v error -show_entries format=duration,size -of csv=p=0 <final>.mp4`.
- Guarde `render/blocos/` até o vídeo ser publicado. As correções renderizam só os blocos afetados.
- Tempo: de 15 a 40 min por bloco de uns 2 min, conforme a CPU livre. Com mais núcleos, suba `--concurrency`.
  - A alternativa na nuvem é o Remotion Lambda, que cobra pela AWS.
- Depois de corrigir um bloco já renderizado:
  1. apague `render/blocos/blocoNN.mp4`;
  2. confira se nenhum `remotion render` antigo ficou rodando (processos órfãos dobram o tempo);
  3. rode o `render-final.sh` de novo.

## Entrega

- Mande o final para o usuário por arquivo (SendUserFile, `display: attach`), com o caminho da capa e da descrição.
- Mande a capa como imagem.
- Ofereça a limpeza dos blocos intermediários só depois da publicação.
- Varredura rápida de um vídeo pronto: `python scripts/producao/parado-video.py render/<tema>-documentario-final.mp4`.
