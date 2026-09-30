#!/data/data/com.termux/files/usr/bin/bash
# ver_error.sh
# Muestra el error real del ultimo build fallido, directo en Termux.
set -e

REPO="contactochronoshield-cyber/csn-ia-app"

pkg install -y gh > /dev/null 2>&1

# Intenta reusar el token que ya guardaste al hacer git push
TOKEN=$(grep -oP '(?<=://)[^:]*:\K[^@]+' ~/.git-credentials 2>/dev/null | tail -n1)

if [ -z "$TOKEN" ]; then
  echo "No encontre un token guardado."
  read -s -p "Pega tu Personal Access Token de GitHub: " TOKEN
  echo ""
fi

export GH_TOKEN="$TOKEN"

echo "Buscando el ultimo build..."
RUN_ID=$(gh run list --repo "$REPO" --limit 1 --json databaseId -q '.[0].databaseId')

echo "Descargando el log completo..."
gh run view "$RUN_ID" --repo "$REPO" --log > /tmp/build_log.txt 2>&1 || true

echo ""
echo "=== ESTO ES LO QUE FALLO (lineas con error) ==="
grep -i -E "error|failed|exception" /tmp/build_log.txt | tail -n 30
echo "================================================"
echo ""
echo "Log completo guardado en /tmp/build_log.txt por si necesitas mas contexto."
