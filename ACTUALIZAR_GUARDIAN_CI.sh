#!/data/data/com.termux/files/usr/bin/bash

# CHRONO SHIELD NETWORKS
# GUARDIAN CI - ACTUALIZACION SEGURA
# No modifica codigo Kotlin, chat.html, pro.js ni Gradle Android.
# No hace git add, commit, pull ni push.

ROOT="$HOME/csn-ia-app"
cd "$ROOT" 2>/dev/null

if [ ! -d .git ]; then
    echo "ERROR: no se encontro el repositorio."
else
    TS="$(date +%Y%m%d-%H%M%S)"
    BACKUP="$ROOT/.guardian-backups/$TS"
    mkdir -p "$BACKUP"

    FAIL=0

    echo "=========================================="
    echo " CHRONO SHIELD NETWORKS - GUARDIAN CI"
    echo "=========================================="

    # 1. Respaldar exclusivamente los archivos que se actualizaran.
    FILES="
.github/workflows/guardian.yml
.github/workflows/build-apk.yml
.github/workflows/codeql.yml
.github/workflows/integridad.yml
scripts/precheck.sh
scripts/push_seguro.sh
scripts/reporte_errores.sh
scripts/ver_error.sh
"

    echo
    echo "[1/8] Respaldando archivos existentes..."

    for f in $FILES; do
        if [ -f "$f" ]; then
            mkdir -p "$BACKUP/$(dirname "$f")"
            cp -p "$f" "$BACKUP/$f"
            echo "RESPALDADO: $f"
        fi
    done

    if [ -f .gitignore ]; then
        cp -p .gitignore "$BACKUP/.gitignore"
    fi

    # 2. Precheck seguro.
    echo
    echo "[2/8] Actualizando precheck..."

    cat > scripts/precheck.sh <<'PRECHECK'
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
        if python3 - "$MANIFEST" <<'PY'
import sys
import xml.etree.ElementTree as ET

path = sys.argv[1]
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

for warning in warnings:
    print("AVISO:", warning)

for error in errors:
    print("ERROR:", error)

if errors:
    raise SystemExit(1)

print("XML y atributos principales correctos.")
PY
        then
            good "Manifest XML valido."
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
PRECHECK

    chmod +x scripts/precheck.sh

    # 3. Informe de errores sin modificar Android.
    echo
    echo "[3/8] Actualizando reporte de errores..."

    cat > scripts/reporte_errores.sh <<'REPORT'
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
REPORT

    chmod +x scripts/reporte_errores.sh

    # 4. Push seguro: nunca publica automaticamente.
    echo
    echo "[4/8] Actualizando push seguro..."

    cat > scripts/push_seguro.sh <<'PUSH'
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
PUSH

    chmod +x scripts/push_seguro.sh

    # 5. Diagnostico de GitHub Actions sin solicitar ni mostrar tokens.
    echo
    echo "[5/8] Actualizando ver_error..."

    cat > scripts/ver_error.sh <<'ERROR'
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
ERROR

    chmod +x scripts/ver_error.sh

    # 6. Guardian CI: validaciones estaticas.
    echo
    echo "[6/8] Actualizando workflow Guardian..."

    mkdir -p .github/workflows

    cat > .github/workflows/guardian.yml <<'WORKFLOW'
name: Guardian CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: guardian-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  guardian:
    name: Guardian Precheck
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Validar entorno
        run: |
          python3 --version
          node --version
          git --version

      - name: Ejecutar precheck
        run: bash scripts/precheck.sh

      - name: Validar biblioteca
        if: hashFiles('scripts/validar_biblioteca.js') != ''
        run: node scripts/validar_biblioteca.js
WORKFLOW

    # 7. Build APK seguro, sin publicar releases automaticamente.
    echo
    echo "[7/8] Actualizando Build APK..."

    cat > .github/workflows/build-apk.yml <<'BUILD'
name: Build APK

on:
  push:
    branches:
      - main
      - feature/csn-ia-02-local-engine
  pull_request:
    branches:
      - main
      - feature/csn-ia-02-local-engine
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: build-apk-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    name: Build Android Debug APK
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configurar Java 17
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '17'

      - name: Configurar Gradle 8.5
        uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: '8.5'

      - name: Precheck
        run: bash scripts/precheck.sh

      - name: Compilar APK
        working-directory: android
        run: gradle --no-daemon clean assembleDebug --stacktrace

      - name: Verificar APK y generar SHA-256
        run: |
          APK="android/app/build/outputs/apk/debug/app-debug.apk"
          test -s "$APK"
          mkdir -p guardian-artifact
          cp "$APK" guardian-artifact/CSN-IA-debug.apk
          cd guardian-artifact
          sha256sum CSN-IA-debug.apk > SHA256SUMS.txt
          cat SHA256SUMS.txt

      - name: Subir APK y checksum
        uses: actions/upload-artifact@v4
        with:
          name: csn-ia-debug-apk
          path: guardian-artifact/
          if-no-files-found: error
          retention-days: 30

  attest:
    name: Guardian Proof of Build
    needs: build
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
      attestations: write
    steps:
      - name: Descargar APK exacto de esta ejecucion
        uses: actions/download-artifact@v4
        with:
          name: csn-ia-debug-apk
          path: guardian-artifact

      - name: Crear atestacion de procedencia
        uses: actions/attest@v4
        with:
          subject-path: guardian-artifact/CSN-IA-debug.apk
BUILD

    # 8. CodeQL e integridad.
    echo
    echo "[8/8] Actualizando CodeQL e integridad..."

    cat > .github/workflows/codeql.yml <<'CODEQL'
name: CodeQL

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '17 5 * * 1'
  workflow_dispatch:

permissions:
  contents: read

jobs:
  analyze:
    name: Analyze ${{ matrix.language }}
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    strategy:
      fail-fast: false
      matrix:
        language:
          - javascript-typescript
          - java-kotlin

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v4
        with:
          languages: ${{ matrix.language }}
          build-mode: none

      - name: Analyze
        uses: github/codeql-action/analyze@v4
        with:
          category: /language:${{ matrix.language }}
CODEQL

    cat > .github/workflows/integridad.yml <<'INTEGRITY'
name: Guardian Integrity Verification

on:
  workflow_dispatch:
    inputs:
      run_id:
        description: ID de la ejecucion Build APK que se desea verificar
        required: true
        type: string

permissions:
  actions: read
  contents: read

jobs:
  verify:
    name: Verify APK SHA-256
    runs-on: ubuntu-latest
    steps:
      - name: Descargar artefacto de la ejecucion indicada
        uses: actions/download-artifact@v4
        with:
          name: csn-ia-debug-apk
          path: verified
          run-id: ${{ inputs.run_id }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          repository: ${{ github.repository }}

      - name: Verificar SHA-256
        working-directory: verified
        run: |
          test -s CSN-IA-debug.apk
          test -s SHA256SUMS.txt
          sha256sum --check SHA256SUMS.txt

      - name: Resultado
        run: echo "Guardian Integrity: SHA-256 verificado correctamente."
INTEGRITY

    # 9. Documentacion.
    mkdir -p docs

    cat > docs/GUARDIAN_CI.md <<'DOC'
# Guardian CI - Chrono Shield Networks

Guardian CI is the validation and build-integrity layer for CSN IA.

## Components

- Guardian Precheck: static repository checks.
- Build APK: Android debug build and SHA-256 generation.
- CodeQL: Java/Kotlin and JavaScript/TypeScript security analysis.
- Guardian Proof of Build: GitHub artifact provenance attestation for
  successful builds pushed to main.
- Guardian Integrity Verification: manual SHA-256 verification for a
  selected Build APK workflow run.
- Local diagnostics: scripts/precheck.sh and scripts/reporte_errores.sh.

## Safety boundaries

- The diagnostic report does not rewrite Android source files.
- The safe Git helper does not stage, commit, pull, or push.
- Pull request builds do not receive attestation permissions.
- Feature branches do not create public releases.
- No automatic AI code repair is claimed by this workflow.
- Static checks do not replace Android compilation or manual testing.

## Build environment

The workflow uses Java 17 and Gradle 8.5, matching the existing Android
Gradle Plugin 8.3 configuration. The Android build files are not modified
by the Guardian installer.

## Artifact verification

The Build APK workflow uploads the APK and SHA256SUMS.txt together.
The Integrity Verification workflow can download the artifact from a
specific run ID and validate its checksum.

For builds on main, GitHub artifact attestations record provenance.
Consumers should verify the attestation using GitHub CLI and the
repository identity before trusting a distributed APK.

## Limitations

The precheck secret scanner is pattern-based and is not a substitute
for a dedicated secret-scanning product.
CodeQL build-mode none is static analysis; it is not a complete runtime
or device-security test.
A successful CI build does not establish that all app features work
on every Android device.
DOC

    # 10. Ignorar respaldos locales.
    if [ -f .gitignore ]; then
        if ! grep -qxF '.guardian-backups/' .gitignore; then
            printf '\n# Guardian CI local backups\n.guardian-backups/\n' >> .gitignore
        fi
    else
        printf '# Guardian CI local backups\n.guardian-backups/\n' > .gitignore
    fi

    # 11. Permisos y validacion de archivos.
    echo
    echo "===== VALIDACION DE ARCHIVOS ====="

    for f in \
        scripts/precheck.sh \
        scripts/push_seguro.sh \
        scripts/reporte_errores.sh \
        scripts/ver_error.sh
    do
        chmod +x "$f"
        if bash -n "$f"; then
            echo "[OK] $f"
        else
            echo "[ERROR] Sintaxis Bash: $f"
            FAIL=1
        fi
    done

    for f in \
        .github/workflows/guardian.yml \
        .github/workflows/build-apk.yml \
        .github/workflows/codeql.yml \
        .github/workflows/integridad.yml
    do
        if [ -s "$f" ]; then
            echo "[OK] $f"
        else
            echo "[ERROR] Archivo ausente o vacio: $f"
            FAIL=1
        fi
    done

    echo
    echo "===== PRECHECK LOCAL ====="
    bash scripts/precheck.sh
    PRECHECK_RESULT="$?"

    echo
    echo "===== RESUMEN GIT ====="
    git status --short
    echo
    git diff --stat

    echo
    echo "=========================================="
    echo " GUARDIAN CI - ACTUALIZACION TERMINADA"
    echo "=========================================="
    echo "Respaldos: $BACKUP"
    echo "No se hizo commit."
    echo "No se hizo push."
    echo "No se modificaron archivos Kotlin ni assets."
    echo "No se modifico android/app/build.gradle."
    echo

    if [ "$FAIL" -eq 0 ] && [ "$PRECHECK_RESULT" -eq 0 ]; then
        echo "ESTADO: archivos instalados y precheck aprobado."
    else
        echo "ESTADO: instalacion realizada, pero hay validaciones pendientes."
        echo "Revisa los errores anteriores antes de publicar."
    fi
fi
