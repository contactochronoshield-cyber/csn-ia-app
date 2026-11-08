#!/data/data/com.termux/files/usr/bin/bash

# Guardian CI - Preparacion segura.
# No hace add, commit, pull ni push.

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
if [ -z "$ROOT" ]; then
    echo "No se encontro el repositorio."
else
    cd "$ROOT"

    echo "=========================================="
    echo " GUARDIAN CI - REVISION ANTES DE PUBLICAR"
    echo "=========================================="

    bash scripts/precheck.sh
    RESULT="$?"

    echo
    echo "===== CAMBIOS ACTUALES ====="
    git status --short
    echo
    git diff --stat

    if [ "$RESULT" -eq 0 ]; then
        echo
        echo "PREPARACION COMPLETADA."
        echo "No se preparo ni publico ningun archivo."
        echo "Revisa los cambios antes de usar Git."
        echo
        echo "Para preparar archivos especificos manualmente:"
        echo "git add ruta/al/archivo"
        echo "git diff --cached"
        echo "git commit"
        echo "git push"
    else
        echo
        echo "PREPARACION DETENIDA: corrige los errores primero."
    fi
fi
