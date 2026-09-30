# Produção: como fazer igual (leitura, animação, interação, imagens)

Pedido do usuário: a outra máquina precisa produzir **exatamente** como a sessão de produção original. Este guia junta o jeito de trabalhar que deu certo em bets, SUS, Bolsa Família, SUAS e Eleições. As regras detalhadas continuam nos arquivos 12, 12b, 13, 13c, 14, 15 e 16; aqui está o **como**, passo a passo.

---

## 1. Leitura fluida e natural (voz)

A voz é `fr-FR-RemyMultilingualNeural`, com tom de âncora de telejornal. Ela soa natural quando o **texto é escrito para o ouvido**. A maior parte da qualidade vem do texto, não do ajuste da voz.

**Como o texto precisa estar (confira antes de gerar):**
- Frases de 12 a 30 palavras, uma ideia por frase. Frase longa demais cansa; frase curta demais (1 a 4 palavras) faz a voz trocar de idioma ou soar robótica.
- Ligue as ideias com conectivos de fala: "e", "mas", "por isso", "segundo o TSE", "ou seja", "no fim". Ex.: "Com a República, a Constituição de 1891 tirou…" em vez de "Veio a República. A Constituição…".
- Pergunta sempre com contexto: "E a compra de voto?" (com "E"), "Então, o que os documentos permitem afirmar?". Nunca pergunta de 2 palavras solta.
- Lista vira frase com dois pontos: "As acusações são conhecidas: esmola, preguiça, filho para ganhar mais." Nunca palavras soltas com ponto.
- Números, datas e anos **por extenso** (o `normalizar.py` faz, mas confira gênero: "três mil e quinhentas famílias"). Datas: "quatro de outubro de dois mil e vinte e seis". Anos em sequência separados por vírgula.
- Siglas: só as aprovadas (tabela do `12`); as outras por extenso na primeira vez ("o Tribunal Superior Eleitoral") e depois a sigla dentro de frase longa. Palavra em inglês vira português ("programa", "página na internet", "componente físico de segurança").
- Nome estrangeiro: dentro de frase longa, com o papel da pessoa antes ("o economista Thomas Fujiwara"). Testar em amostra.
- Sem parênteses, sem aspas longas, sem reticências no meio da frase. Citação literal curta, anunciada ("O TSE escreveu que…").

**Ritmo:**
- Padrão: `--rate=-5%`.
- Blocos sérios ou de dados sensíveis (críticas, neutralidade): `VOZ_EXTRA_NN="--rate=-9%"`.
- Comoção: `--rate=-12% --volume=-10%`.
- Ressalvas nunca aceleram ("segundo o TSE", "associação, não causa").
- Pausa depois de frases-chave: coloque a frase em `locucao/pausas.txt`. Silêncio de revelação e de capítulo se faz **na cena** (a voz começa depois de um pré-roll), não na voz.

**Como conferir (obrigatório):**
1. `checar-locucao.py <projeto> --raw`: zero ALTO.
2. Amostras A (atual) × B (proposta) de cada nome, sigla ou frase duvidosa, em `~/Downloads/<assunto>-opcoes/` (`amostra-pronuncia.sh`).
3. Narração completa em `~/Downloads/<tema>-narracao/` (`narracao-completa.sh`), para o usuário ouvir e apontar o **minuto** do que estranhou.
4. Aplicar a escolha no `NN_raw.txt` e **avisar o roteirista** para copiar a mesma redação no roteiro. Roteiro e áudio têm de ficar iguais; confira extraindo o roteiro numa pasta temporária e comparando.

---

## 2. Animações: o método

**Antes de escrever qualquer bloco:**
1. Monte o kit do tema (`Kit<TEMA>.tsx`) com os elementos [NOVO] do roteiro e uma composição `Vitrine` que mostra todos. Renderize imagens da vitrine (`npx remotion still Vitrine … --props='{"pagina":N}'`) e **olhe** (Read na imagem). Corrija até ficar bonito.
2. Liste as falas do bloco com o índice de cada uma:
   ```bash
   python3 -c "import json;c=json.load(open('src/data/cues.json'))['07'];[print(i,x['texto'][:90]) for i,x in enumerate(c)]"
   ```
3. Faça o mapa cena → fala: cada cena da decupagem começa numa fala (gatilho). Toda fala precisa de algo novo na tela.

**Tempos (sempre presos à voz):**
```tsx
const C = cues["07"];
const t = (i: number) => ms(C[i].de);                 // frame em que a fala i começa
// frame aproximado em que um TRECHO é dito dentro da fala i (para acender algo na palavra exata)
const em = (i: number, trecho: string) => {
  const x = C[i]; const k = Math.max(0, x.texto.indexOf(trecho));
  return ms(x.de + ((x.ate - x.de) * k) / x.texto.length);
};
// dentro de <Sequence from={INICIO}>: frames relativos
const r = (i: number) => t(i) - inicio;
```
- Cada cena é uma `<Sequence from={t(a)} durationInFrames={t(b) - t(a)}>` com o componente da cena recebendo `inicio`.
- Sequence aninhada: subtraia o início dela também (erro clássico: elemento que nunca aparece).
- Pré-roll (cartela de capítulo antes da voz): `const OFF = 130`; áudio em `<Sequence from={OFF}>`, `<Legenda atraso={OFF}>` e `atrasoVoz={OFF}` em cada `Trilha`; `DURACAO_NN` inclui o OFF.

**Movimento (o "jeito" das animações):**
- Entrada: 10–14 frames, `Easing.bezier(0.2, 0.7, 0.2, 1)`, opacidade 0→1 com deslize de 20–60 px ou escala 0,8→1. Saída de cena com `Saida` (fade, chicote, zoom), 10–12 frames.
- Cascata: itens de uma lista entram um a um, 6 a 12 frames de intervalo, **ou** cada um na palavra em que é dito (`em(i, "trecho")`) — o segundo é o preferido.
- Nada parado mais de 6 s: a câmera viva é global, mas cada fala ainda precisa de um elemento novo (etiqueta, número, marca-texto, ponto no mapa).
- Composição: conteúdo centralizado **acima** da faixa da legenda (`paddingBottom: 200`), textos a 60 px das bordas, um ponto focal por vez. Tamanhos: títulos 80–110 px, números 110–200 px, rótulos 34–50 px, notas de fonte 22–28 px em mono.
- Texto em caixa fixa: `whiteSpace: "nowrap"`; se não couber, encurte.
- Todo elemento importante com `data-foco="nome"`; tela só de texto com `data-cobre data-pausa-ok` quando é pausa proposital.
- Fonte de cada dado na tela, pequena, em mono ("TSE · perfil do eleitorado, 14/07/2026").

**Ciclo de qualidade (um bloco por vez):**
`npx tsc --noEmit -p .` → `node qa-quadros.mjs NN` até 0 problemas → **olhar a folha de contato** (`qa/blocoNN/folha.jpg`) → `npx remotion still BlocoNN x.jpg --frame=N --scale=0.5` nos momentos duvidosos → corrigir. A auditoria não vê feiura: vazio grande, texto apertado, cor ruim no fundo, elemento que não diz nada. Isso se corrige olhando.

**Paralelo:** com a base pronta (tema, kit, Root com todos os blocos em esqueleto), divida os blocos entre agentes com o briefing modelo (`producao-exemplos/tema-claro-eleicoes/BRIEF-PRODUCAO.md`). Depois revise as folhas de contato de cada um.

---

## 3. Interações: a tela reage à fala

O espectador tem de sentir que a imagem "ouve" a narração. Exemplos que o usuário aprovou:

| A voz diz | A tela faz (no mesmo instante) |
|---|---|
| um número | o contador conta enquanto a frase é dita e para no valor |
| o nome de uma instituição/lei | o chip ou o documento acende; o marca-texto passa sob o trecho citado |
| uma cidade/estado | o ponto do mapa pulsa; a UF do mosaico muda de cor |
| uma data | a folhinha vira ou o marco da linha do tempo se carimba |
| uma lista ("deputado, senador, governador…") | cada cartão entra na palavra dele (`em(i, "senador")`) |
| uma comparação | duas colunas do mesmo tamanho; a segunda só entra quando é dita |
| "segundo o TSE" | etiqueta de atribuição aparece junto |
| uma revelação | riser → 0,5 s de silêncio → impacto discreto + clarão → o dado |
| fim de capítulo | tecla/som-assinatura do tema |

Cada evento visual importante tem efeito sonoro casado (`clique`, `papel-deslizar`, `tecla`, `carimbo`…), 8 a 15 por minuto, menos na comoção.

---

## 4. Pesquisa de imagens na web

1. **Permissão:** baixar arquivo exige o OK do usuário no chat para aquele vídeo. Sem OK, o vídeo sai só com ilustrações (foi assim em Eleições) e isso é dito na entrega.
2. **Onde procurar:** Wikimedia Commons (principal); Agência Brasil só do acervo "memória"; Agência Senado/Câmara só se a licença estiver escrita na página. Nunca Fotos Públicas nem imagem de banco pago. A lista triada pelo roteirista fica em `apuracao/08-fotografias.md`.
3. **Buscar no Commons:**
   ```bash
   curl -s -A "ContraProvaBrasil/1.0 (contato do canal)" "https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=urna+eletronica&format=json&srlimit=20"
   ```
4. **Conferir a licença** de cada arquivo antes de usar (campos `LicenseShortName`, `Artist`, `Credit`, `UsageTerms`):
   ```bash
   curl -s -A "…" "https://commons.wikimedia.org/w/api.php?action=query&titles=File:<nome>&prop=imageinfo&iiprop=extmetadata|url&format=json"
   ```
   Aceitas: domínio público, CC0, CC BY, CC BY-SA (BY-ND só inteira, sem corte nem nada por cima). Guarde um print/registro da página de licença em `public/fotos/licencas/`.
5. **Baixar** em tamanho útil: `https://commons.wikimedia.org/wiki/Special:FilePath/<nome>?width=1600`, com User-Agent identificado. Confira a imagem aberta (Read): é mesmo o que o roteiro pede? Tem marca, placa, rosto de criança/vítima/beneficiário? Borre placas e rostos de fila; descarte o que não serve.
6. **Registrar** em `public/fotos/CREDITOS.txt`: `<arquivo> · <descrição curta> · <autor> · <licença> · <URL>`. Esses créditos vão para a tela final (rolando) e para a descrição.
7. **Na cena:** foto dentro de moldura do tema (polaroide/recorte nos temas escuros; cartão branco com `sombra` no tema claro), com legenda de crédito pequena quando a licença pedir. Movimento lento (Drift/zoom 1,00→1,06). Nunca rosto de pessoa real inventado; nunca imagem gerada por IA.

---

## 5. Fim do vídeo

Siga `07-tela-final-e-creditos.md` (conteúdo) e `13c`, seção 4c (montagem com `FimDoVideo.tsx`): fala final → FONTES → tela final com créditos e aviso de voz sintética → chamada 3 por cima → som-assinatura → 2 s de silêncio → fade.

---

## 6. Entrega (sempre igual)

- Vídeo **único e completo** por tema (nunca Parte 1/Parte 2).
- `render/<tema>-documentario-final.mp4`, `render/thumbnail.png`, `render/descricao-youtube.txt` (com título, capítulos reais, tags e comentário fixado), `render/fontes-completas.txt`.
- Conferir com `ffprobe` e avisar o caminho do arquivo. Sem prévia 720p.
