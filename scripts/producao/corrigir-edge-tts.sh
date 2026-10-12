#!/bin/bash
# Corrige o edge-tts quando a Microsoft recusa a síntese com 403 (desde 10/2026; issue rany2/edge-tts#490).
# Aplica a mesma troca do PR #491 (lido e conferido): síntese pelo host api.msedgeservices.com com o token legado.
# Uso: bash corrigir-edge-tts.sh [caminho-do-python-do-venv]   (padrão: ~/canaldark/.venv/bin/python)
PY="${1:-$HOME/canaldark/.venv/bin/python}"
F="$("$PY" -c 'import edge_tts,os;print(os.path.dirname(edge_tts.__file__))')/constants.py"
grep -q "api.msedgeservices.com" "$F" && { echo "já corrigido: $F"; exit 0; }
cp "$F" "$F.orig"
"$PY" - "$F" <<'PYEOF'
import sys
p=sys.argv[1]; s=open(p).read()
a='WSS_URL = f"wss://{BASE_URL}/edge/v1?TrustedClientToken={TRUSTED_CLIENT_TOKEN}"'
assert a in s, "formato do constants.py mudou: confira o PR #491 antes de corrigir"
s=s.replace(a,'WSS_URL = (\n    "wss://api.msedgeservices.com/tts/cognitiveservices/websocket/v1"\n    f"?Ocp-Apim-Subscription-Key={TRUSTED_CLIENT_TOKEN}"\n)')
open(p,"w").write(s)
PYEOF
echo "corrigido: $F (original em .orig). Quando sair versão oficial com a correção, rode pip install -U edge-tts."
