package net.chronoshield.iaapp

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var llm: ChronoLLM

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        llm = ChronoLLM(applicationContext)

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
        fun isModelReady(): Boolean = llm.isModelDownloaded()

        @JavascriptInterface
        fun downloadModel() {
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
        }

        @JavascriptInterface
        fun askQuestion(question: String, requestId: String) {
            Thread {
                val answer = try {
                    if (!llm.isLoaded()) llm.load()
                    llm.generate(question)
                } catch (e: Exception) {
                    "Hubo un error generando la respuesta local: " + (e.message ?: "desconocido")
                }
                val safe = answer.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
                runOnUiThread { webView.evaluateJavascript("onAnswer('$requestId', '$safe')", null) }
            }.start()
        }
    }
}
