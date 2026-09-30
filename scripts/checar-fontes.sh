#!/bin/bash
# Confere se todo [Fnn] usado na locução tem definição na lista de fontes do roteiro.
# Uso: checar-fontes.sh projetos/<tema>/roteiro.md
f="$1"
usados=$(grep -o '\[F[0-9]\{2,3\}\]' "$f" | sort -u)
for u in $usados; do
  n=$(grep -c "^- \*\*$u\*\*" "$f")
  [ "$n" -eq 0 ] && echo "SEM DEFINIÇÃO: $u"
done
echo "palavras de locução:"; awk '/\*\*LOCUÇÃO\*\*/{on=1;next}/\*\*FIM DA LOCUÇÃO\*\*/{on=0}on' "$f" | wc -w
