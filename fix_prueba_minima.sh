#!/data/data/com.termux/files/usr/bin/bash
set -e

cat > android/app/src/main/java/net/chronoshield/iaapp/MainActivity.kt << 'KOTLIN_EOF'
package net.chronoshield.iaapp

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val tv = TextView(this)
        tv.text = "CSN IA - prueba minima.\n\nSi ves este texto, la app SI puede abrir."
        tv.textSize = 16f
        tv.setPadding(60, 200, 60, 60)
        setContentView(tv)
    }
}
KOTLIN_EOF

echo "Version MINIMA creada: sin WebView, sin nada mas."
git add .
git commit -m "Prueba minima absoluta: solo texto en pantalla, sin WebView" --allow-empty
git push

echo ""
echo "Listo. Espera el build, desinstala TODO, instala este."
echo "Esto nos dice si CUALQUIER app puede abrir en ese telefono."
