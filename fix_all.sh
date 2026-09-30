#!/data/data/com.termux/files/usr/bin/bash
# fix_all.sh
# Agrega el icono faltante y permite trafico local sin HTTPS hacia el backend.
set -e

mkdir -p android/app/src/main/res/drawable

cat > android/app/src/main/res/drawable/ic_launcher.xml << 'EOF'
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#0a0c0e"
        android:pathData="M0,0h108v108h-108z" />
    <path
        android:fillColor="#7de08d"
        android:pathData="M30,34 L30,74 L40,74 L40,44 L68,74 L78,74 L78,34 L68,34 L68,64 L40,34 Z" />
</vector>
EOF

# Icono: usa el drawable nuevo en vez del mipmap que nunca existió
sed -i 's/@mipmap\/ic_launcher/@drawable\/ic_launcher/g' android/app/src/main/AndroidManifest.xml

# Trafico local: permite que el WebView llame al backend por http:// en tu red
sed -i 's/android:usesCleartextTraffic="false"/android:usesCleartextTraffic="true"/g' android/app/src/main/AndroidManifest.xml

echo "Cambios aplicados. Subiendo a GitHub..."
git add .
git commit -m "Agregar icono y permitir trafico local hacia el backend"
git push

echo ""
echo "Listo. Revisa la pestana Actions de GitHub en unos minutos."
