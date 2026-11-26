#!/usr/bin/env bash
# csn_lanzamiento.sh — F-Droid + Play Store en un solo paso (idempotente)
set -u
NV="${1:-1.1.0}"
cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" || exit 1
R=REPORTE_LANZAMIENTO.md; BAD=0; WARN=0; TODO=()
ok(){ echo "✅ $1" | tee -a "$R"; }
warn(){ echo "⚠️  $1" | tee -a "$R"; WARN=$((WARN+1)); }
bad(){ echo "❌ $1" | tee -a "$R"; BAD=$((BAD+1)); }
todo(){ TODO+=("$1"); }
echo "# Reporte de lanzamiento $(date +%F)" > "$R"

G=$(ls android/app/build.gradle.kts android/app/build.gradle 2>/dev/null | head -1)
M=android/app/src/main/AndroidManifest.xml
if [ -z "$G" ] || [ ! -f "$M" ]; then bad "No encuentro build.gradle o AndroidManifest en android/app"; exit 1; fi
REMOTE=$(git remote get-url origin 2>/dev/null || echo "https://github.com/contactochronoshield-cyber/csn-ia-app.git")
REPO_URL=${REMOTE%.git}
RAW_APPID=$(grep -oE 'applicationId[ =]+"[^"]+"' "$G" | head -1 | grep -oE '"[^"]+"' | tr -d '"')
APPID=${RAW_APPID:-net.chronoshield.iaapp}

VN=$(grep -oE 'versionName[ =]+"[^"]+"' "$G" | head -1 | grep -oE '"[^"]+"' | tr -d '"')
VC=$(grep -oE 'versionCode[ =]+[0-9]+' "$G" | head -1 | grep -oE '[0-9]+$')
if [ -n "$VN" ] && [ -n "$VC" ]; then
  if [ "$VN" != "$NV" ] && [ "$(printf '%s\n%s\n' "$VN" "$NV" | sort -V | tail -1)" = "$NV" ]; then
    VC=$((VC+1))
    sed -i -E "s|(versionName[ =]+\")[^\"]+\"|\1${NV}\"|; s|(versionCode[ =]+)[0-9]+|\1${VC}|" "$G"
    ok "Versión: $VN → $NV (versionCode $VC)"; VN=$NV
  else ok "Versión actual $VN (versionCode $VC), sin cambios"; fi
else warn "No pude leer versionName/versionCode (¿definidos con variables?). Súbelos a mano"; fi
TS=$(grep -oE 'targetSdk(Version)?[ =]+[0-9]+' "$G" | head -1 | grep -oE '[0-9]+$')
[ -n "${TS:-}" ] && [ "$TS" -lt 35 ] && { bad "targetSdk=$TS: Play exige uno reciente. Súbelo a 35 o más y prueba"; todo "Subir targetSdk (mínimo vigente en Play Console)"; }

mkdir -p android/app/src/main/res/xml
NSC=android/app/src/main/res/xml/network_security_config.xml
[ -f "$NSC" ] || cat > "$NSC" <<'EOF'
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors><certificates src="system" /></trust-anchors>
    </base-config>
</network-security-config>
EOF
sed -i 's/android:usesCleartextTraffic="true"/android:usesCleartextTraffic="false"/' "$M"
grep -q 'networkSecurityConfig' "$M" || sed -i '0,/<application/s//<application android:networkSecurityConfig="@xml\/network_security_config"/' "$M"
ok "Solo HTTPS (network_security_config): Buscar abrirá únicamente sitios HTTPS"

for p in '*.jks' '*.keystore' 'keystore.properties' 'local.properties' '*.aab' 'build_release.log' 'REPORTE_LANZAMIENTO.md'; do
  grep -qxF "$p" .gitignore 2>/dev/null || echo "$p" >> .gitignore; done
KS=$(git ls-files | grep -E '\.(jks|keystore)$|keystore\.properties|local\.properties')
[ -n "$KS" ] && { bad "Llaves/credenciales dentro de git: $KS (quítalas con git rm --cached y rótalas)"; todo "Rotar llaves expuestas"; } || ok "Ninguna keystore versionada"
SEC=$(grep -rIlE 'ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC )?PRIVATE KEY' . --exclude-dir=.git 2>/dev/null | head -5)
[ -n "$SEC" ] && { bad "Posibles secretos en: $SEC"; todo "Revocar y quitar secretos de: $SEC"; } || ok "Sin secretos evidentes en el código"

P=$(grep -rEil 'com\.google\.android\.gms|play-services|firebase|crashlytics|admob|com\.facebook|appcenter|mixpanel|segment\.analytics' android --include=*.gradle --include=*.kts --include=*.xml --include=*.kt --include=*.java 2>/dev/null | head -5)
[ -n "$P" ] && { bad "SDKs propietarios/trackers en: $P (F-Droid los rechaza)"; todo "Quitar SDKs propietarios: $P"; } || ok "Sin SDKs propietarios ni trackers"
if grep -qiE 'mediapipe|tasks-genai' "$G"; then
  warn "MediaPipe: el modelo (Gemma, licencia no libre) no debe ir dentro del repo ni del APK de F-Droid; descárgalo en el primer uso"
  todo "Confirmar que el modelo se descarga en el primer uso y no viaja en el APK/repo"
fi
BIG=$(git ls-files -z | xargs -0 ls -l 2>/dev/null | awk '$5>20000000{print $9" ("int($5/1048576)" MB)"}')
[ -n "$BIG" ] && warn "Archivos >20 MB en el repo: $BIG" || ok "Sin binarios grandes en el repo"
ls android/app/src/main/res/mipmap*/ic_launcher* >/dev/null 2>&1 && ok "Ícono presente" || { bad "Falta ic_launcher en res/mipmap"; todo "Agregar ícono ic_launcher"; }
[ -f LICENSE ] && ok "LICENSE presente" || bad "Falta LICENSE"
[ -f android/gradlew ] && { chmod +x android/gradlew; ok "gradlew ejecutable"; } || bad "Falta android/gradlew"

SD_ES="IA que corre en tu celular: redes privadas, ciberseguridad y soberanía digital"
SD_EN="On-device AI for private networks, cybersecurity and digital sovereignty"
FD_ES="CSN IA, de Chrono Shield Networks, explica en lenguaje simple qué son las redes privadas, los nodos mesh y la soberanía digital.

• Asistente de IA que corre en tu dispositivo
• Biblioteca de ciberseguridad y redes en español, inglés y portugués, con rutas para principiantes, intermedios y avanzados
• Buscador seguro con escudo de enlaces y escudo anti-estafa
• Análisis de metadatos y riesgos de archivos PDF
• Laboratorio para aprender a programar
• Sin anuncios ni rastreadores. Software libre (GPL-3.0 o posterior)

Más información: chronoshieldnetworks.com"
FD_EN="CSN IA, by Chrono Shield Networks, explains private networks, mesh nodes and digital sovereignty in plain language.

• AI assistant that runs on your device
• Cybersecurity and networking library in Spanish, English and Portuguese, with beginner, intermediate and advanced paths
• Secure search with a link shield and an anti-scam shield
• PDF metadata and risk analysis
• A lab to learn programming
• No ads, no trackers. Free software (GPL-3.0-or-later)

More: chronoshieldnetworks.com"
for L in es-419 en-US; do
  D=fastlane/metadata/android/$L; mkdir -p "$D/changelogs" "$D/images/phoneScreenshots"
  if [ "$L" = es-419 ]; then SD=$SD_ES; FD=$FD_ES; CL="Versión $VN: biblioteca ampliada, análisis de PDF, laboratorio para aprender y mejoras de estabilidad."
  else SD=$SD_EN; FD=$FD_EN; CL="Version $VN: expanded library, PDF analysis, programming lab and stability improvements."; fi
  [ -s "$D/title.txt" ] || echo "CSN IA" > "$D/title.txt"
  [ -s "$D/short_description.txt" ] || echo "$SD" > "$D/short_description.txt"
  { [ ! -s "$D/full_description.txt" ] || grep -qiE 'ollama|servidor propio|backend' "$D/full_description.txt"; } && echo "$FD" > "$D/full_description.txt"
  [ "$(wc -m < "$D/short_description.txt")" -gt 81 ] && echo "$SD" > "$D/short_description.txt"
  [ -n "${VC:-}" ] && [ ! -f "$D/changelogs/$VC.txt" ] && echo "$CL" > "$D/changelogs/$VC.txt"
  [ -f "$D/images/icon.png" ] || warn "$L: falta images/icon.png (512x512)"
  ls "$D"/images/phoneScreenshots/* >/dev/null 2>&1 || warn "$L: sin capturas (Play exige mínimo 2)"
done
ok "fastlane listo en es-419 y en-US (título, descripciones, changelog)"
[ -f fastlane/metadata/android/es-419/images/featureGraphic.png ] || todo "Crear featureGraphic.png 1024x500 (Play)"
todo "Subir 2+ capturas de pantalla a fastlane/.../images/phoneScreenshots (F-Droid y Play) y icon.png 512x512"

cat > PRIVACY.md <<'EOF'
# Política de privacidad — CSN IA

CSN IA, de Chrono Shield Networks, no incluye anuncios, rastreadores ni analíticas de terceros.

- El asistente de IA se ejecuta en tu dispositivo. Tus conversaciones no se envían a servidores de CSN.
- La app usa internet solo para las funciones de Buscar y noticias y para avisarte de actualizaciones.
- Los archivos que analizas (por ejemplo PDF) se procesan en tu dispositivo.
- No vendemos ni compartimos datos personales.

Contacto: chronoshieldnetworks.com
EOF
ok "PRIVACY.md generado (URL pública: $REPO_URL/blob/main/PRIVACY.md)"
todo "Verificar que PRIVACY.md describa exactamente lo que hace la app"

if grep -qiE 'ollama|uvicorn' README.md 2>/dev/null && ! grep -q 'csn-readme-v2' README.md; then
  mkdir -p docs && cp README.md docs/README_anterior_backend.md
  cat > README.md <<'EOF'
<!-- csn-readme-v2 -->
# CSN IA — Asistente educativo de Chrono Shield Networks

App Android con IA que corre en tu dispositivo y explica, en lenguaje simple, qué son las redes privadas, los nodos mesh y la soberanía digital. Software libre, sin anuncios ni rastreadores.

## Qué incluye
- Asistente de IA en el dispositivo (sin servidor propio ni APIs de IA extranjeras)
- Biblioteca de ciberseguridad y redes en español, inglés y portugués, con rutas por nivel
- Buscador seguro con escudo de enlaces y escudo anti-estafa
- Análisis de metadatos y riesgos de PDF (botón +)
- Laboratorio para aprender a programar (JavaScript)

## Instalación
- F-Droid: en proceso de publicación
- APK firmado: pestaña Releases de este repositorio

## Compilar
    cd android
    ./gradlew assembleRelease

## Estructura
- `android/` — app Android (WebView + Kotlin)
- `fastlane/metadata/` — fichas de F-Droid y Google Play
- `backend/`, `backend-pro/` — prototipos anteriores con servidor; **no forman parte de la app actual**

## Privacidad y licencia
- [Política de privacidad](PRIVACY.md)
- GPL-3.0 o posterior — Chrono Shield Networks — https://chronoshieldnetworks.com
EOF
  ok "README reescrito (el anterior quedó en docs/README_anterior_backend.md)"
else ok "README ya está al día"; fi

mkdir -p docs/play-store
cat > docs/play-store/FICHA_PLAY.md <<EOF
# Ficha de Google Play — CSN IA ($APPID)
- Título: CSN IA
- Descripción breve (es): $SD_ES
- Descripción breve (en): $SD_EN
- Categoría sugerida: Herramientas o Educación
- Política de privacidad (URL): $REPO_URL/blob/main/PRIVACY.md
- Formato de subida: .aab firmado (se genera con el workflow release-play)

## Seguridad de los datos (propuesta; verifica contra la app)
- Recopilación de datos: ninguna. Sin anuncios. Sin SDKs de terceros.
- Datos compartidos con terceros: ninguno
- Cifrado en tránsito: sí (solo HTTPS)

## Clasificación de contenido
Responde con honestidad sobre el laboratorio de ciberseguridad: explica y simula con fines educativos y defensivos.

## Lista final
- [ ] 2+ capturas de teléfono, ícono 512x512, imagen destacada 1024x500
- [ ] Formularios de la Play Console: seguridad de datos, clasificación, público objetivo, anuncios (no)
- [ ] Prueba cerrada si tu cuenta de desarrollador lo exige
EOF
ok "Ficha de Play en docs/play-store/FICHA_PLAY.md"

mkdir -p fdroid
cat > "fdroid/$APPID.yml" <<EOF
Categories:
  - Security
  - Internet
License: GPL-3.0-or-later
AuthorName: Chrono Shield Networks
AuthorWebSite: https://chronoshieldnetworks.com
WebSite: https://chronoshieldnetworks.com
SourceCode: $REPO_URL
IssueTracker: $REPO_URL/issues

AutoName: CSN IA

RepoType: git
Repo: $REMOTE

Builds:
  - versionName: ${VN:-$NV}
    versionCode: ${VC:-1}
    commit: v${VN:-$NV}
    subdir: android/app
    gradle:
      - yes

AutoUpdateMode: Version
UpdateCheckMode: Tags
CurrentVersion: ${VN:-$NV}
CurrentVersionCode: ${VC:-1}
EOF
ok "Receta F-Droid en fdroid/$APPID.yml (pégala en tu fork de fdroiddata en GitLab)"
todo "Crear etiqueta v${VN:-$NV} cuando main esté en verde y abrir el merge request en fdroiddata"

mkdir -p .github/workflows
cat > .github/workflows/release-play.yml <<'EOF'
name: Release APK + AAB
on:
  push:
    tags: ['v*']
  workflow_dispatch:
permissions:
  contents: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '17'
      - uses: gradle/actions/setup-gradle@v4
      - name: Compilar
        working-directory: android
        run: chmod +x gradlew && ./gradlew --no-daemon assembleRelease bundleRelease
      - name: Firmar (si existen los secretos)
        env:
          KEYSTORE_B64: ${{ secrets.KEYSTORE_B64 }}
          KEYSTORE_PASS: ${{ secrets.KEYSTORE_PASS }}
          KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
        run: |
          mkdir -p out
          cp android/app/build/outputs/bundle/release/*.aab out/ || true
          cp android/app/build/outputs/apk/release/*.apk out/ || true
          if [ -n "$KEYSTORE_B64" ]; then
            echo "$KEYSTORE_B64" | base64 -d > up.jks
            for f in out/*.aab; do jarsigner -keystore up.jks -storepass "$KEYSTORE_PASS" "$f" "$KEY_ALIAS"; done
            BT=$(ls -d "$ANDROID_HOME"/build-tools/* | sort -V | tail -1)
            for f in out/*.apk; do "$BT/apksigner" sign --ks up.jks --ks-pass pass:"$KEYSTORE_PASS" --ks-key-alias "$KEY_ALIAS" "$f"; done
            rm -f up.jks
          else
            echo "::warning::Sin secretos de firma: artefactos sin firmar"
          fi
      - uses: actions/upload-artifact@v4
        with:
          name: csn-ia-release
          path: out/*
      - uses: softprops/action-gh-release@v2
        if: startsWith(github.ref, 'refs/tags/v')
        with:
          files: out/*
EOF
ok "Workflow .github/workflows/release-play.yml (APK + AAB al crear una etiqueta v*)"

KD="$HOME/.csn-keys"; KSF="$KD/upload.p12"; KP="$KD/upload.pass"
if [ ! -f "$KSF" ] && command -v keytool >/dev/null; then
  mkdir -p "$KD"; chmod 700 "$KD"
  PW=$(head -c 24 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' | head -c 20); echo "$PW" > "$KP"; chmod 600 "$KP"
  keytool -genkeypair -storetype PKCS12 -keystore "$KSF" -alias upload -keyalg RSA -keysize 4096 -validity 10000 \
    -storepass "$PW" -keypass "$PW" -dname "CN=Chrono Shield Networks, O=Chrono Shield Networks, L=Bogota, C=CO" >/dev/null 2>&1 \
    && ok "Llave de subida creada en $KSF (¡respáldala fuera del teléfono!)" || bad "No pude crear la llave de subida"
fi
if [ -f "$KSF" ]; then
  if command -v gh >/dev/null && gh auth status >/dev/null 2>&1; then
    base64 -w0 "$KSF" | gh secret set KEYSTORE_B64 >/dev/null 2>&1 \
      && gh secret set KEYSTORE_PASS < "$KP" >/dev/null 2>&1 \
      && echo upload | gh secret set KEY_ALIAS >/dev/null 2>&1 \
      && ok "Secretos de firma cargados en GitHub" || { warn "No pude cargar los secretos con gh"; todo "Cargar KEYSTORE_B64, KEYSTORE_PASS (archivo $KP) y KEY_ALIAS=upload en GitHub → Settings → Secrets"; }
  else todo "Cargar KEYSTORE_B64 (base64 de $KSF), KEYSTORE_PASS (archivo $KP) y KEY_ALIAS=upload en GitHub → Settings → Secrets"; fi
else todo "Crear la llave de subida (pkg install openjdk-17 para tener keytool) y cargar los 3 secretos"; fi

if command -v java >/dev/null && [ -n "${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}" ]; then
  (cd android && ./gradlew --no-daemon lintRelease assembleRelease bundleRelease) > build_release.log 2>&1 \
    && ok "Build release local OK" || { bad "Build local falló: mira build_release.log"; todo "Corregir errores de build_release.log"; }
else warn "Sin JDK/Android SDK aquí: el build lo valida GitHub Actions"; fi

git add -A
if git diff --cached --quiet; then ok "Nada nuevo que guardar en git"
else
  git commit -qm "Lanzamiento ${VN:-$NV}: F-Droid + Play (versión, HTTPS, fastlane, privacidad, README, CI, receta)" && ok "Commit creado"
  BR=$(git rev-parse --abbrev-ref HEAD)
  if git remote | grep -q .; then git push -q origin "$BR" && ok "Push a $BR" || warn "Push falló"; fi
fi

echo; echo "RESULTADO: $BAD errores, $WARN avisos (detalle en $R)"
if [ "${#TODO[@]}" -gt 0 ]; then echo "PENDIENTE (manual):"; for t in "${TODO[@]}"; do echo " - $t"; done; fi
echo; echo "Cuando Acciones esté en verde en main:"
echo "  git tag v${VN:-$NV} && git push origin v${VN:-$NV}"
[ "$BAD" -eq 0 ]
