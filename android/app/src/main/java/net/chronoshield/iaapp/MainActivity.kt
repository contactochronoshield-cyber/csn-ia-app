package net.chronoshield.iaapp

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.app.Activity
import net.chronoshield.iaapp.ai.KnowledgeAIEngine
import net.chronoshield.iaapp.ai.ThreatIntelCollector
import net.chronoshield.iaapp.ai.ThreatIntelStore
import net.chronoshield.iaapp.ai.WebResearchEngine
import net.chronoshield.iaapp.bridge.AIWebBridge

/**
 * CSN IA
 *
 * Interfaz Android para el asistente local.
 */
class MainActivity : Activity() {

    private lateinit var threatIntelStore: ThreatIntelStore
    private lateinit var threatIntelCollector: ThreatIntelCollector

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        threatIntelStore = ThreatIntelStore(applicationContext)

        threatIntelCollector = ThreatIntelCollector(
            researchEngine = WebResearchEngine(),
            store = threatIntelStore
        )

        val webView = WebView(this)

        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webViewClient = WebViewClient()

        webView.addJavascriptInterface(
            AIWebBridge(
                engine = KnowledgeAIEngine(),
                threatIntelCollector = threatIntelCollector
            ),
            "CSNIA"
        )

        webView.loadUrl("file:///android_asset/chat.html")

        setContentView(webView)
    }
}
