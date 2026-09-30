#!/data/data/com.termux/files/usr/bin/bash
# fix_workflow.sh
# Corrige el workflow de GitHub Actions para que no dependa de gradlew
# y sube el cambio al repo.
set -e

cat > .github/workflows/build-apk.yml << 'EOF'
name: Build APK

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Descargar código
        uses: actions/checkout@v4

      - name: Configurar Java
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Configurar Gradle
        uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: '8.5'

      - name: Compilar APK (debug)
        run: |
          cd android
          gradle assembleDebug

      - name: Subir APK como artefacto descargable
        uses: actions/upload-artifact@v4
        with:
          name: csn-ia-app-debug
          path: android/app/build/outputs/apk/debug/app-debug.apk

      - name: Publicar como Release
        if: github.ref == 'refs/heads/main'
        uses: softprops/action-gh-release@v2
        with:
          tag_name: build-${{ github.run_number }}
          name: CSN IA - build ${{ github.run_number }}
          files: android/app/build/outputs/apk/debug/app-debug.apk
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
EOF

echo "Archivo corregido."
git add .
git commit -m "Corregir workflow para no depender de gradlew"
git push

echo ""
echo "Listo. Ve a GitHub -> pestaña Actions para ver el build corriendo."
