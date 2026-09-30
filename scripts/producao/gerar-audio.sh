#!/bin/bash
# Normaliza o texto, aplica pausas, gera a narração (edge-tts, voz Remy) e as legendas, e atualiza os dados do vídeo.
# Uso: bash gerar-audio.sh <pasta-do-canal> <nome-do-projeto> [blocos...]   (sem blocos = todos)
# Voz padrão: fr-FR-RemyMultilingualNeural, -5%. Para um bloco mais lento/baixo: VOZ_EXTRA_08="--rate=-12% --volume=-10%"
set -e
CANAL="$1"; NOME="$2"; shift 2
P="$CANAL/projetos/$NOME"; SK="$(cd "$(dirname "$0")" && pwd)"
PY="$CANAL/.venv/bin/python"; TTS="$CANAL/.venv/bin/edge-tts"
"$PY" "$CANAL/ferramentas/normalizar.py" "$P" "$P/locucao/siglas.json"
"$PY" "$SK/pausas.py" "$P"
# Trava de idioma: aponta abertura com palavras soltas, sigla em frase curta e palavras estrangeiras.
# Com aviso ALTO, para aqui. Resolva no NN_raw.txt/siglas.json (ou gere amostras) e rode de novo; FORCAR=1 ignora.
if ! "$PY" "$SK/checar-locucao.py" "$P"; then
  [ "${FORCAR:-0}" = 1 ] || { echo "PAROU: resolva os avisos ALTO acima (ou FORCAR=1 depois de o usuário aprovar as amostras)."; exit 2; }
fi
BL="$@"; [ -z "$BL" ] && BL=$(ls "$P/locucao" | grep -E '^[0-9]{2}\.txt$' | sed 's/\.txt//')
for n in $BL; do
  extra_var="VOZ_EXTRA_$n"; extra="${!extra_var:---rate=-5%}"
  # até 3 tentativas: o serviço de voz às vezes devolve "No audio was received" (falha passageira)
  ( for k in 1 2 3; do "$TTS" -v fr-FR-RemyMultilingualNeural $extra -f "$P/locucao/$n.txt" --write-media "$P/audio/$n.mp3" --write-subtitles "$P/audio/$n.srt" 2>/dev/null && [ -s "$P/audio/$n.mp3" ] && break; echo "bloco $n: tentativa $k falhou, repetindo"; sleep 5; done ) &
done
wait
for n in $BL; do cp "$P/audio/$n.mp3" "$P/audio/$n.srt" "$P/video/public/audio/"; done
(cd "$P/video" && node gerar-dados.mjs)
total=0; for n in $BL; do d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$P/audio/$n.mp3"); echo "$n  ${d%.*} s"; done
