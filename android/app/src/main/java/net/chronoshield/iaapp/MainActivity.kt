package net.chronoshield.iaapp

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import net.chronoshield.iaapp.ai.ChronoNetworkBrainConfig
import net.chronoshield.iaapp.bridge.ChronoNetworkBrainBridge
import java.io.File
import java.io.PrintWriter
import java.io.StringWriter

class MainActivity : AppCompatActivity() {

    private var networkBrainBridge: ChronoNetworkBrainBridge? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val defaultHandler = Thread.getDefaultUncaughtExceptionHandler()

        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            try {
                val sw = StringWriter()
                throwable.printStackTrace(PrintWriter(sw))

                getExternalFilesDir(null)?.let { directory ->
                    File(directory, "crash_log.txt").writeText(sw.toString())
                }
            } catch (_: Exception) {
            }

            defaultHandler?.uncaughtException(thread, throwable)
        }

        try {
            val webView = WebView(this)

            webView.settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                cacheMode = WebSettings.LOAD_NO_CACHE
                setRenderPriority(WebSettings.RenderPriority.LOW)
                allowFileAccessFromFileURLs = false
                allowUniversalAccessFromFileURLs = false
                javaScriptCanOpenWindowsAutomatically = false
            }

            webView.setLayerType(
                android.view.View.LAYER_TYPE_SOFTWARE,
                null
            )

            webView.webViewClient = object : WebViewClient() {

                override fun shouldOverrideUrlLoading(
                    view: WebView?,
                    request: WebResourceRequest?
                ): Boolean {
                    if (request == null || !request.isForMainFrame) {
                        return false
                    }

                    val uri = request.url
                    val scheme = uri.scheme

                    if (scheme == "https" || scheme == "http") {
                        return openExternalUrl(uri.toString())
                    }

                    return false
                }
            }

            val endpoint = ChronoNetworkBrainConfig.BASE_URL.trim()
            val endpointUri = Uri.parse(endpoint)

            if (
                endpoint.startsWith("https://") &&
                !endpointUri.host.isNullOrBlank()
            ) {
                networkBrainBridge =
                    ChronoNetworkBrainBridge(webView, endpoint)

                webView.addJavascriptInterface(
                    networkBrainBridge!!,
                    "ChronoNetworkBrain"
                )
            }

            webView.addJavascriptInterface(
                NewsBridge(this) {
                    runOnUiThread {
                        webView.evaluateJavascript("window.newsReady&&newsReady()", null)
                    }
                },
                "CSNNews"
            )

            webView.addJavascriptInterface(
                SearchBridge { res ->
                    runOnUiThread {
                        webView.evaluateJavascript("window.searchReady&&searchReady(" + org.json.JSONObject.quote(res) + ")", null)
                    }
                },
                "CSNSearch"
            )

            setContentView(webView)
            webView.loadUrl("file:///android_asset/chat.html")

        } catch (e: Throwable) {
            val sw = StringWriter()
            e.printStackTrace(PrintWriter(sw))

            try {
                getExternalFilesDir(null)?.let { directory ->
                    File(directory, "crash_log.txt").writeText(sw.toString())
                }
            } catch (_: Exception) {
            }

            val tv = TextView(this)
            tv.text = "Error al iniciar:\n\n$e"
            tv.setPadding(40, 100, 40, 40)
            tv.textSize = 12f
            setContentView(tv)
        }
    }

    private fun openExternalUrl(url: String): Boolean {
        return try {
            val uri = Uri.parse(url)

            if (uri.scheme == "https" || uri.scheme == "http") {
                startActivity(Intent(Intent.ACTION_VIEW, uri))
                true
            } else {
                false
            }
        } catch (_: Exception) {
            true
        }
    }

    override fun onDestroy() {
        networkBrainBridge?.shutdown()
        networkBrainBridge = null
        super.onDestroy()
    }
}
