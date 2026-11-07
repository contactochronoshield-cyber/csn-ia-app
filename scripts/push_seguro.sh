#!/data/data/com.termux/files/usr/bin/bash
# Uso: bash scripts/push_seguro.sh "mensaje del commit"
cd "$(git rev-parse --show-toplevel)" || exit 1
MSG="${1:-Actualizacion}"
bash scripts/precheck.sh || { echo "Corrige lo de arriba y repite. No se subio nada."; exit 1; }
git add -A
git commit -qm "$MSG" || echo "(nada nuevo que commitear)"
if ! git pull --rebase origin main; then
  echo "Conflicto real. Pasame la salida de: git status"
  echo "Para volver atras: git rebase --abort"
  exit 1
fi
bash scripts/precheck.sh || { echo "Tras integrar el remoto aparecio un problema. No se subio."; exit 1; }
git push origin HEAD:main
