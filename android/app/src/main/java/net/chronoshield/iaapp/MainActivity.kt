package net.chronoshield.iaapp

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebSettings
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
                File(getExternalFilesDir(null), "crash_log.txt").writeText(sw.toString())
            } catch (e: Exception) {
            }
            defaultHandler?.uncaughtException(thread, throwable)
        }

        try {
            val webView = WebView(this)
            // Ajustes para telefonos de poca RAM (Android Go / 2GB):
            webView.settings.javaScriptEnabled = true
            webView.settings.domStorageEnabled = true
            webView.settings.cacheMode = WebSettings.LOAD_NO_CACHE
            webView.settings.setRenderPriority(WebSettings.RenderPriority.LOW)
            webView.setLayerType(android.view.View.LAYER_TYPE_SOFTWARE, null)
            webView.webViewClient = WebViewClient()
            webView.loadUrl("file:///android_asset/chat.html")
            setContentView(webView)
        } catch (e: Throwable) {
            val sw = StringWriter()
            e.printStackTrace(PrintWriter(sw))
            try { File(getExternalFilesDir(null), "crash_log.txt").writeText(sw.toString()) } catch (ex: Exception) {}
            val tv = TextView(this)
            tv.text = "Error al iniciar:\n\n" + e.toString()
            tv.setPadding(40, 100, 40, 40)
            tv.textSize = 12f
            setContentView(tv)
        }
    }
}
