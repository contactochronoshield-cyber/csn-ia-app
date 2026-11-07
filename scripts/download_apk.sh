#!/data/data/com.termux/files/usr/bin/bash
# download_apk.sh
# Descarga el artifact (APK) mas reciente del repo usando la API de GitHub.
set -e

REPO="contactochronoshield-cyber/csn-ia-app"
DEST=~/storage/downloads

read -s -p "Pega tu Personal Access Token de GitHub (no se muestra en pantalla): " TOKEN
echo ""

echo "Buscando el ultimo artifact..."
RESPONSE=$(curl -s -H "Authorization: token $TOKEN" \
  "https://api.github.com/repos/$REPO/actions/artifacts")

DOWNLOAD_URL=$(echo "$RESPONSE" | grep -o '"archive_download_url":"[^"]*"' | head -n1 | cut -d'"' -f4)

if [ -z "$DOWNLOAD_URL" ]; then
  echo "No encontre ningun artifact. Revisa que el token tenga permiso 'repo' y que el build haya terminado."
  exit 1
fi

echo "Descargando..."
curl -L -H "Authorization: token $TOKEN" -o "$DEST/csn-ia-app-debug.zip" "$DOWNLOAD_URL"

echo "Descomprimiendo..."
pkg install -y unzip > /dev/null 2>&1 || true
unzip -o "$DEST/csn-ia-app-debug.zip" -d "$DEST/csn-ia-app-apk"

echo ""
echo "Listo. El APK quedo en:"
echo "$DEST/csn-ia-app-apk/app-debug.apk"
echo ""
echo "Abrelo desde el gestor de archivos de tu celular (carpeta Download/csn-ia-app-apk) para instalarlo."
