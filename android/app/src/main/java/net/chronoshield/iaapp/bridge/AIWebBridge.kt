package net.chronoshield.iaapp.bridge

import android.webkit.JavascriptInterface
import net.chronoshield.iaapp.ai.KnowledgeAIEngine

/**
 * Puente entre la interfaz WebView y el motor de IA local.
 */
class AIWebBridge {

    private val engine = KnowledgeAIEngine()

    @JavascriptInterface
    fun ask(prompt: String): String {
        return engine.generate(prompt)
    }
}
