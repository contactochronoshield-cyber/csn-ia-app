#!/data/data/com.termux/files/usr/bin/bash

# Guardian CI Precheck
# Validaciones estaticas. La compilacion real se ejecuta en Gradle.

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
if [ -z "$ROOT" ]; then
    echo "ERROR: no se encontro la raiz Git."
    false
else
    cd "$ROOT"
    ERRORS=0
    WARNINGS=0
    ASSETS="android/app/src/main/assets"
    MANIFEST="android/app/src/main/AndroidManifest.xml"
    TMP="${TMPDIR:-/tmp}/guardian-precheck-$$"

    echo "=========================================="
    echo " GUARDIAN CI - PRECHECK"
    echo "=========================================="

    good() {
        echo "[OK] $1"
    }

    bad() {
        echo "[ERROR] $1"
        ERRORS=$((ERRORS + 1))
    }

    warn() {
        echo "[AVISO] $1"
        WARNINGS=$((WARNINGS + 1))
    }

    echo
    echo "[1] Integridad de cambios Git"

    if git diff --check > "$TMP" 2>&1; then
        good "Cambios sin errores de espacios."
    else
        bad "git diff --check detecto problemas."
        cat "$TMP"
    fi

    if git diff --cached --check > "$TMP" 2>&1; then
        good "Indice Git sin errores de espacios."
    else
        bad "Hay problemas en cambios preparados."
        cat "$TMP"
    fi

    echo
    echo "[2] Marcadores de conflictos"

    if grep -rInE '^(<<<<<<<|=======|>>>>>>>)($|[[:space:]])' \
        android/app/src .github scripts \
        --exclude='*.backup*' \
        --exclude='*.bak' 2>/dev/null | head -10 > "$TMP"; then
        if [ -s "$TMP" ]; then
            cat "$TMP"
            bad "Hay posibles marcadores de conflicto."
        else
            good "Sin marcadores de conflicto."
        fi
    else
        good "Sin marcadores de conflicto."
    fi

    echo
    echo "[3] Sintaxis JavaScript"

    if command -v node >/dev/null 2>&1; then
        JS_ERRORS=0

        while IFS= read -r -d '' f; do
            if ! node --check "$f" > "$TMP" 2>&1; then
                bad "JavaScript invalido: $f"
                head -8 "$TMP"
                JS_ERRORS=$((JS_ERRORS + 1))
            fi
        done < <(find "$ASSETS" -maxdepth 1 -type f -name '*.js' -print0 2>/dev/null)

        if [ "$JS_ERRORS" -eq 0 ]; then
            good "Archivos JavaScript validos."
        fi
    else
        warn "Node.js no instalado; sintaxis JS omitida."
    fi

    echo
    echo "[4] Referencias de scripts HTML"

    if [ -f "$ASSETS/chat.html" ]; then
        if python3 - "$ASSETS/chat.html" "$ASSETS" <<'PY'
import os
import re
import sys

html_path, assets = sys.argv[1], sys.argv[2]

with open(html_path, encoding="utf-8") as f:
    content = f.read()

missing = []
for src in re.findall(r'<script[^>]+src=["\']([^"\']+)', content, re.I):
    if src.startswith(("http://", "https://", "data:")):
        continue
    path = os.path.normpath(os.path.join(assets, src))
    if not os.path.isfile(path):
        missing.append(src)

if missing:
    print("Referencias no encontradas:")
    for item in missing:
        print(" -", item)
    raise SystemExit(1)

print("Todas las referencias locales existen.")
PY
        then
            good "Referencias HTML verificadas."
        else
            bad "Hay referencias locales faltantes."
        fi
    else
        warn "No existe chat.html en la ruta esperada."
    fi

    echo
    echo "[5] AndroidManifest.xml"

    if [ -f "$MANIFEST" ]; then
        MANIFEST_WARNINGS="${TMP}.manifest-warnings"
        rm -f "$MANIFEST_WARNINGS"
        if python3 - "$MANIFEST" "$MANIFEST_WARNINGS" <<'PY'
import sys
import xml.etree.ElementTree as ET

path = sys.argv[1]
warning_file = sys.argv[2]
android = "{http://schemas.android.com/apk/res/android}"

try:
    root = ET.parse(path).getroot()
except Exception as exc:
    print("XML invalido:", exc)
    raise SystemExit(1)

app = root.find("application")
if app is None:
    print("No se encontro application.")
    raise SystemExit(1)

errors = []
warnings = []

for tag in ("activity", "service", "receiver", "provider"):
    for item in app.iter(tag):
        if item.find("intent-filter") is not None:
            if item.get(android + "exported") is None:
                errors.append(
                    tag + " sin android:exported: " +
                    str(item.get(android + "name"))
                )

if app.get(android + "debuggable") == "true":
    errors.append("debuggable=true")

if app.get(android + "usesCleartextTraffic") == "true":
    warnings.append("usesCleartextTraffic=true permite HTTP sin cifrar")

if app.get(android + "allowBackup") == "true":
    warnings.append("allowBackup=true requiere revisar datos respaldables")

with open(warning_file, "w", encoding="utf-8") as output:
    for warning in warnings:
            output.write(warning + chr(10))

for error in errors:
    print("ERROR:", error)

if errors:
    raise SystemExit(1)

print("XML y atributos principales correctos.")
PY
        then
            good "Manifest XML valido."

            # Contabilizar individualmente los avisos emitidos por Python.
            if [ -s "$MANIFEST_WARNINGS" ]; then
                while IFS= read -r warning; do
                    if [ -n "$warning" ]; then
                        warn "$warning"
                    fi
                done < "$MANIFEST_WARNINGS"
            rm -f "$MANIFEST_WARNINGS"
            fi
        else
            bad "Problemas en AndroidManifest.xml."
        fi
    else
        bad "No se encontro AndroidManifest.xml."
    fi

    echo
    echo "[6] Rutas locales de Termux"

    if grep -nE '/data/data/com\.termux|/data/user/0/com\.termux' \
        android/gradle.properties \
        android/build.gradle \
        android/app/build.gradle \
        android/settings.gradle \
        2>/dev/null > "$TMP"; then
        cat "$TMP"
        bad "Hay rutas locales en configuracion Gradle."
    else
        good "Sin rutas locales detectadas en Gradle."
    fi

    echo
    echo "[7] Deteccion basica de secretos"

    python3 - <<'PY'
import os
import re
import subprocess

patterns = [
    re.compile(r'-----BEGIN ([A-Z]+ )?PRIVATE KEY-----'),
    re.compile(r'\bgh[pousr]_[A-Za-z0-9]{30,}\b'),
    re.compile(r'\bgithub_pat_[A-Za-z0-9_]{30,}\b'),
    re.compile(r'\bAKIA[0-9A-Z]{16}\b'),
    re.compile(r'\bAIza[0-9A-Za-z_-]{30,}\b'),
    re.compile(r'\bxox[baprs]-[A-Za-z0-9-]{10,}\b'),
]

result = subprocess.run(
    ["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard"],
    stdout=subprocess.PIPE,
    stderr=subprocess.DEVNULL
)

files = result.stdout.decode(errors="replace").split("\0")
found = []
keyfiles = []

for name in filter(None, files):
    base = os.path.basename(name).lower()

    if any(x in name for x in (
        "/.git/", "/build/", "/.gradle/", ".guardian-backups/"
    )):
        continue

    if base.endswith((".jks", ".keystore", ".p12", ".pfx")):
        keyfiles.append(name)
        continue

    if base in (".env", ".env.local", ".env.production"):
        keyfiles.append(name)
        continue

    try:
        if os.path.getsize(name) > 2_000_000:
            continue
        with open(name, "rb") as f:
            data = f.read()
        if b"\0" in data:
            continue
        content = data.decode("utf-8", errors="ignore")
        if any(pattern.search(content) for pattern in patterns):
            found.append(name)
    except (OSError, UnicodeError):
        pass

if found or keyfiles:
    print("Posibles secretos detectados (sin mostrar su contenido):")
    for item in sorted(set(found + keyfiles)):
        print(" -", item)
    raise SystemExit(1)

print("No se detectaron patrones conocidos de secretos.")
PY

    if [ "$?" -eq 0 ]; then
        good "Revision basica de secretos completada."
    else
        bad "Revisar posibles secretos o archivos de claves."
    fi

    echo
    echo "[8] Archivos de compilacion y tamano"

    python3 - <<'PY'
import os
import subprocess

raw = subprocess.run(
    ["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard"],
    stdout=subprocess.PIPE
).stdout

problems = []

for name in filter(None, raw.decode(errors="replace").split("\0")):
    normalized = name.replace("\\", "/")
    parts = normalized.split("/")

    if any(part in ("build", ".gradle") for part in parts):
        problems.append((name, "directorio de compilacion"))
        continue

    if normalized.lower().endswith(".apk"):
        problems.append((name, "APK dentro del repositorio"))
        continue

    try:
        if os.path.isfile(name) and os.path.getsize(name) > 5_000_000:
            problems.append((name, "archivo mayor de 5 MB"))
    except OSError:
        pass

if problems:
    for name, reason in problems[:30]:
        print(reason + ":", name)
    raise SystemExit(1)

print("No se detectaron artefactos grandes o de compilacion.")
PY

    if [ "$?" -eq 0 ]; then
        good "Revision de artefactos completada."
    else
        bad "Hay archivos que no deberian publicarse."
    fi

    echo
    echo "[9] Comprobacion de herramientas"

    command -v python3 >/dev/null 2>&1 && good "Python disponible." || bad "Python no disponible."
    command -v git >/dev/null 2>&1 && good "Git disponible." || bad "Git no disponible."
    command -v gradle >/dev/null 2>&1 && good "Gradle disponible localmente." || warn "Gradle no disponible; compilacion omitida."

    rm -f "$TMP"

    echo
    echo "=========================================="
    echo " ERRORES: $ERRORS | AVISOS: $WARNINGS"
    echo "=========================================="

    if [ "$ERRORS" -eq 0 ]; then
        echo "PRECHECK APROBADO."
        true
    else
        echo "PRECHECK REPROBADO. No publiques estos cambios."
        false
    fi
fi
