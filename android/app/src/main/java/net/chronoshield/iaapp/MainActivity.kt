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
