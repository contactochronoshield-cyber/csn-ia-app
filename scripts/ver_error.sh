#!/data/data/com.termux/files/usr/bin/bash

# Consulta de ejecuciones mediante GitHub CLI.
# No solicita ni imprime tokens.

if ! command -v gh >/dev/null 2>&1; then
    echo "GitHub CLI (gh) no esta instalado."
    echo "Instalacion en Termux: pkg install gh"
else
    gh auth status

    if [ "$?" -eq 0 ]; then
        echo
        echo "===== ULTIMAS EJECUCIONES ====="
        gh run list --limit 10

        echo
        echo "Para ver errores de una ejecucion:"
        echo "bash scripts/ver_error.sh ID"
        if [ -n "$1" ]; then
            echo
            echo "===== LOG DE ERRORES: $1 ====="
            gh run view "$1" --log-failed
        fi
    else
        echo "Autenticacion no disponible."
        echo "Inicia sesion con: gh auth login"
    fi
fi
