#!/data/data/com.termux/files/usr/bin/bash
# fix_permissions.sh
set -e

sed -i '/^on:/i permissions:\n  contents: write\n' .github/workflows/build-apk.yml

echo "Permisos agregados. Contenido actual:"
cat .github/workflows/build-apk.yml
echo ""

git add .
git commit -m "Dar permisos de escritura para publicar releases"
git push

echo ""
echo "Listo. Corre de nuevo el workflow (boton VOLVER A EJECUTAR)."
