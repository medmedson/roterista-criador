# Produção: trilhas e efeitos (síntese própria)

Todos os sons são gerados por código (numpy → wav → mp3 com ffmpeg). São originais, sem direitos de terceiros. Os geradores ficam em `assets/producao-ferramentas/`, copiados para `<canal>/ferramentas/`. Uso: `python gerar-X.py <video>/public/sfx`.

| Script | Gera |
|---|---|
| gerar-sfx.py | batimento, bip-monitor, flatline, turbina, papel-virar, papel-deslizar, maquina-escrever, flash-camera, whoosh, riser, sting, gaveta-arquivo, elastico-pasta, vidro-tilintar, moedas, relogio-tique, sirene-distante, estatica, lampada-fluorescente, murmurio-multidao |
| gerar-trilhas.py | investigacao, drama, desfecho |
| assets/producao-sfx-base/ (arquivos prontos) | clique, carimbo, impacto, pulso, subida, tensao |
| gerar-trilhas-sus.py | arquivo, esperanca, hospital, ciencia, denuncia |
| gerar-sfx-bf.py | leitora-cartao, notas, cartao-bip, panela, carimbo-duplo, sino-escola, urna-bip, pente-papel, porta, feira-ambiencia |
| gerar-trilhas-bf.py | provocacao, linha-do-tempo, mundo, confronto |
| gerar-sfx-suas.py | ding-senha, dispensador-senha, carimbo-atendido, tique-parede, sala-espera, passos-corredor, chuva-distante, sino-conferencia |
| gerar-trilhas-suas.py | senha, caridade, constituinte, veto, rede, balanco, comocao, votacao |

O projeto novo já roda todos os geradores (`novo-projeto.sh`).

## Criar trilha ou efeito [NOVO] do roteiro

Copie o gerador mais parecido e reaproveite os blocos já prontos:
- `pad` (acordes sustentados), `corda` (pizzicato/staccato), `bumbo`, `caixa`, `tom` (marimba);
- `piano` e `cello` (com vibrato), `reverb` (multi-tap + eco), `tique`, `ding`.

Cada trilha tem 96 a 100 s. O componente `Trilha` repete em loop quando precisa. Regras:
- Troque de trilha a cada mudança de clima.
- Não repita a mesma trilha em blocos seguidos.
- Comoção é só piano e violoncelo, sem riser nem impacto por cima.
- Em arrays numpy, calcule o tamanho a partir do array (`len(x) - k`), não de `t(dur)`. O arredondamento dá erro de broadcast.

## Uso nas cenas

```tsx
<Audio src={staticFile("audio/07.mp3")} />                               // narração
<Trilha arquivo="sfx/balanco.mp3" de={t(8)} ate={t(13)} volume={0.22} fade={20} />
<Efeito arquivo="sfx/carimbo.mp3" em={t(3) + 44} volume={0.6} duracao={15} />
```

- Trilha sob a voz: volume 0.16 a 0.26 (cerca de −20 a −24 dB). Ambiência: 0.10 a 0.15.
- **`ate - de` precisa ser maior que `2 × fade`.** Se não for, o Remotion dá erro "inputRange must be strictly monotonically increasing".
- Revelação: `riser` (30 a 45 frames), 0,5 a 1 s de silêncio, depois `impacto` e só então a informação.
- Drama forte (um por ato): `impacto` + tremor do `Fundo` (translate) + `<Clarao>`.
- Som-assinatura do tema (batimento no SUS, ding-senha no SUAS): no máximo 1 a 2 por cena, só em momentos humanos. Nunca sob dado de orçamento.
- O usuário quer trilha cobrindo quase todo o vídeo, com suspense e drama onde cabe. Silêncio só como pausa curta.

## Mixagem final

O `render-final.sh` junta os blocos e aplica `loudnorm=I=-14:TP=-1.5:LRA=11`, o padrão do YouTube. Sem isso, os picos chegaram a 0 dB.
