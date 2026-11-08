#!/data/data/com.termux/files/usr/bin/bash

# Guardian CI - Diagnostico de solo lectura.
# No sobrescribe Kotlin, Manifest, Gradle ni modifica Git.

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
if [ -z "$ROOT" ]; then
    echo "No se encontro el repositorio."
else
    cd "$ROOT"
    TS="$(date +%Y%m%d-%H%M%S)"
    REPORT_FILE="${TMPDIR:-/tmp}/guardian-report-$TS.txt"

    {
        echo "CHRONO SHIELD NETWORKS"
        echo "GUARDIAN CI - INFORME DE DIAGNOSTICO"
        echo "Fecha: $(date)"
        echo

        echo "===== ESTADO GIT ====="
        git status --short
        echo

        echo "===== DIFERENCIAS ====="
        git diff --stat
        echo

        echo "===== ULTIMO COMMIT ====="
        git log -1 --format='%h %s (%ci)' 2>/dev/null
        echo

        echo "===== JAVA ====="
        java -version 2>&1
        echo

        echo "===== GRADLE ====="
        gradle --version 2>&1 | head -15
        echo

        echo "===== APK DEBUG ====="
        APK="android/app/build/outputs/apk/debug/app-debug.apk"
        if [ -f "$APK" ]; then
            ls -lh "$APK"
            sha256sum "$APK"
        else
            echo "No se encontro APK debug."
        fi
        echo

        echo "===== ULTIMOS ARCHIVOS DE BUILD ====="
        find android/app/build/outputs -type f -maxdepth 5 -print 2>/dev/null | head -30
        echo

        echo "===== PRECHECK ====="
        bash scripts/precheck.sh
        echo

        echo "===== FIN DEL INFORME ====="
    } > "$REPORT_FILE" 2>&1

    echo "Informe generado:"
    echo "$REPORT_FILE"
    echo "No se modifico ningun archivo fuente."
fi
