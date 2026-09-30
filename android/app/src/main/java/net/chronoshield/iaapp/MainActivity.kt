package net.chronoshield.iaapp

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

/**
 * CSN IA — App educativa sobre servicios de Chrono Shield Networks.
 *
 * Diseño deliberadamente mínimo: un WebView cargando un asset local (chat.html)
 * que habla con el backend RAG+Ollama self-hosted de CSN. Sin SDKs propietarios
 * de Google, sin analytics, sin trackers -> compatible con los requisitos de F-Droid.
 *
 * La URL del backend es configurable por el usuario dentro de la propia UI
 * (ver chat.html), para que cada instancia de CSN pueda apuntar a su propio
 * servidor self-hosted.
 */
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webViewClient = WebViewClient()
        webView.loadUrl("file:///android_asset/chat.html")

        setContentView(webView)
    }
}
