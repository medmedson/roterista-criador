# Produção: regras do usuário, imagens e armadilhas já vividas

## Preferências do usuário (confirmadas em 4 vídeos)

- Narração com tom de telejornal (voz Remy). Manter a duração que a voz der, sem forçar corte.
- Estilo: cada tema tem identidade própria (cortiça escura em SUS/BF/SUAS; claro/clean em Eleições; noturno no SAMU; "jazida" em Terras Raras), sempre com mapas animados e muito elemento animado.
- Vídeo sempre único e completo por tema, nunca em partes.
- Trilha em quase todo o vídeo, com suspense e drama nos momentos certos.
- Sem legenda em tela só de texto. Legenda nunca sobre o ponto focal.
- Carimbo só quando faz sentido e nunca sobre texto.
- Nada cortado nem vazando da caixa. O usuário assiste no celular e aponta.
- Sem prévia 720p. Entregar o arquivo final.
- Terminar um vídeo antes de começar as correções de outro, se ele pedir.
- Pronúncias: ver `12-producao-narracao.md`.

## Imagens e licenças

- Passo a passo completo da busca na web: `17-producao-como-fazer-igual.md`, seção 4. Baixar exige o OK do usuário no chat.
- Wikimedia Commons é a fonte principal. Confira a licença pela API antes de usar:
  `https://commons.wikimedia.org/w/api.php?action=query&titles=File:<nome>&prop=imageinfo&iiprop=extmetadata&format=json`
  (campos LicenseShortName, Artist, Credit). Baixe com `Special:FilePath/<nome>?width=1600` e um User-Agent identificado.
- Agência Brasil: só do acervo "memória". Não use Fotos Públicas.
- BY-ND (ex.: retrato do Bolsonaro): foto inteira, na proporção original, sem corte, cor ou nada por cima (`Polaroide inteira colorida`).
- Sem crianças, sem beneficiário identificável e sem pessoa em situação de rua. Borre rostos de fila.
- Licença duvidosa: sem foto, só recorte de texto com nome e cargo.
- Recorte de jornal com texto próprio, sem imitar veículo real.
- Captcha (ex.: visualizador do DOU): não contorne. Use o texto da lei no Planalto.
- Documento na tela: só trechos que estão nas notas de apuração, entre "(...)". Não componha frase de lei ou acórdão. Resumo nosso vai em cartão ou etiqueta, nunca com cara de documento.
- Miniaturas de vídeos anteriores do canal podem aparecer como "card" de referência. Credite as fotos que elas contêm.

## Armadilhas e correções (para não repetir)

| Sintoma | Causa | Correção |
|---|---|---|
| elemento nunca aparece / aparece tarde | `entra` absoluto dentro de `<Sequence from>` aninhada | subtrair o início da Sequence |
| legenda "2000hões", "décima IV" | substituição reversa sem limite de palavra ou sigla ampla demais | regex com limites Unicode (já no gerar-dados); sigla com contexto ("IV Conferência") |
| texto cortado em 3ª linha | `foreignObject` com altura fixa | `<text>` + `<tspan>` |
| batimento "travando" | amostragem de 3 px presa à tela; pico estreito | grade presa ao tempo, passo de 1 px |
| voz trocou de sotaque | nome estrangeiro, sigla solta, frase curta de abertura | amostras, equivalente em português, testar em frase |
| vídeo começa "em outro idioma" | bloco abre com palavras soltas ("Esmola. Preguiça.") | frase introdutória antes da lista ("As acusações são conhecidas: esmola, preguiça…") |
| "1992 mil e dois" | anos colados com "e" | vírgula (normalizador) |
| "três mil e quinhentos famílias" | o normalizador escreve números no masculino | substantivo feminino: escrever por extenso no roteiro ("três mil e quinhentas famílias") ou ajustar o NN.txt |
| disco cheio no render | temporários do Remotion acumulados pelo QA | TMPDIR próprio, bundle apagado, checar df |
| render 2× mais lento | processo de render órfão ou apps pesados abertos | listar `remotion render`, encerrar só os seus; fechar apps |
| render caiu "Timed out… browser" | app fechado ou máquina dormiu | rodar de novo (retoma); `caffeinate` |
| erro de interpolate "strictly monotonically increasing" | `Trilha` curta demais para o fade | `ate - de > 2 × fade` |
| número intermediário enganoso | contador animando entre valores reais | mostrar os dois valores reais com seta |
| título largo cortado | letterSpacing + fonte grande | encurtar ("CALAMIDADE · RS · MAIO DE 2024") |
| picos a 0 dB | sem normalização | loudnorm no render-final |
| descrição > 5.000 caracteres | fontes na descrição | fontes em `fontes-completas.txt` / comentário fixado |
| `pkill` matou coisa de outra sessão | padrão amplo | nunca `pkill caffeinate`; matar por PID que você mesmo criou |
