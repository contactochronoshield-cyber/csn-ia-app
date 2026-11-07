#!/data/data/com.termux/files/usr/bin/bash
# fix_crash_guard.sh
set -e

mkdir -p android/app/src/main/java/net/chronoshield/iaapp

cat > android/app/src/main/java/net/chronoshield/iaapp/MainActivity.kt << 'KOTLIN_EOF'
package net.chronoshield.iaapp

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import java.io.File
import java.io.PrintWriter
import java.io.StringWriter

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val llm: ChronoLLM by lazy { ChronoLLM(applicationContext) }

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

        webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webViewClient = WebViewClient()
        webView.addJavascriptInterface(Bridge(), "AndroidBridge")
        webView.loadUrl("file:///android_asset/chat.html")

        setContentView(webView)
    }

    inner class Bridge {

        @JavascriptInterface
        fun isModelReady(): Boolean {
            return try { llm.isModelDownloaded() } catch (e: Exception) { false }
        }

        @JavascriptInterface
        fun downloadModel() {
            try {
                llm.downloadModel(
                    onProgress = { pct ->
                        runOnUiThread { webView.evaluateJavascript("onDownloadProgress($pct)", null) }
                    },
                    onDone = { success ->
                        runOnUiThread {
                            var ok = success
                            if (success) {
                                try { llm.load() } catch (e: Exception) { ok = false }
                            }
                            webView.evaluateJavascript("onDownloadDone($ok)", null)
                        }
                    }
                )
            } catch (e: Exception) {
                runOnUiThread { webView.evaluateJavascript("onDownloadDone(false)", null) }
            }
        }

        @JavascriptInterface
        fun askQuestion(question: String, requestId: String) {
            Thread {
                val answer = try {
                    if (!llm.isLoaded()) llm.load()
                    llm.generate(question)
                } catch (e: Exception) {
                    "Hubo un error con el motor de IA local: " + (e.message ?: "desconocido")
                }
                val safe = answer.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
                runOnUiThread { webView.evaluateJavascript("onAnswer('$requestId', '$safe')", null) }
            }.start()
        }
    }
}
KOTLIN_EOF

echo "MainActivity blindado contra crashes."
git add .
git commit -m "Blindar contra crashes al iniciar y registrar errores en archivo"
git push

echo ""
echo "Listo. Espera el build, baja el APK nuevo, DESINSTALA la version vieja primero,"
echo "e instala esta. Si se vuelve a cerrar, busca en el celular, con un gestor de"
echo "archivos, la carpeta: Android/data/net.chronoshield.iaapp/files/crash_log.txt"
echo "y mandame lo que diga ese archivo -- ahi va a estar el error real, texto plano."
