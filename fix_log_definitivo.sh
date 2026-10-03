#!/data/data/com.termux/files/usr/bin/bash
set -e

cat > android/app/src/main/java/net/chronoshield/iaapp/MainActivity.kt << 'KOTLIN_EOF'
package net.chronoshield.iaapp

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.io.File
import java.io.PrintWriter
import java.io.StringWriter

class MainActivity : AppCompatActivity() {

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val defaultHandler = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            try {
                val sw = StringWriter()
                throwable.printStackTrace(PrintWriter(sw))
                val logFile = File(getExternalFilesDir(null), "crash_log.txt")
                logFile.writeText(sw.toString())
            } catch (e: Exception) {
            }
            defaultHandler?.uncaughtException(thread, throwable)
        }

        try {
            val webView = WebView(this)
            webView.settings.javaScriptEnabled = true
            webView.settings.domStorageEnabled = true
            webView.webViewClient = WebViewClient()
            webView.loadUrl("file:///android_asset/chat.html")
            setContentView(webView)
        } catch (e: Throwable) {
            // Si el WebView del sistema falla, mostramos el error en pantalla
            // en vez de dejar que la app se cierre sin dar pistas.
            val sw = StringWriter()
            e.printStackTrace(PrintWriter(sw))
            try {
                File(getExternalFilesDir(null), "crash_log.txt").writeText(sw.toString())
            } catch (ex: Exception) {
            }
            val tv = TextView(this)
            tv.text = "Error al iniciar:\n\n" + e.toString()
            tv.setPadding(40, 100, 40, 40)
            tv.textSize = 12f
            setContentView(tv)
        }
    }
}
KOTLIN_EOF

echo "Registro de errores restaurado en la version limpia."
git add .
git commit -m "Restaurar registro de errores y mostrar error en pantalla si el WebView falla" --allow-empty
git push

echo ""
echo "Listo. Espera el build verde, desinstala TODO, instala el nuevo."
echo "Si se cierra igual, ahora deberia aparecer el error EN LA PANTALLA directamente."
echo "Si no aparece nada en pantalla, busca de todos modos:"
echo "Android/data/net.chronoshield.iaapp/files/crash_log.txt"
