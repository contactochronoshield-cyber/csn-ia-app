package net.chronoshield.iaapp.bridge

import android.webkit.JavascriptInterface
import android.webkit.WebView
import net.chronoshield.iaapp.ai.ChronoNetworkBrainClient
import org.json.JSONObject

class ChronoNetworkBrainBridge(
    private val webView: WebView,
    baseUrl: String
) {
    private val client = ChronoNetworkBrainClient(baseUrl)

    @JavascriptInterface
    fun analyze(message: String, callbackId: String) {
        if (!callbackId.matches(Regex("[A-Za-z0-9_-]{1,64}"))) {
            return
        }

        client.analyze(message, object : ChronoNetworkBrainClient.Callback {
            override fun onSuccess(result: JSONObject) {
                sendResult(callbackId, true, result.toString())
            }

            override fun onError(message: String) {
                sendResult(callbackId, false, message)
            }
        })
    }

    private fun sendResult(
        callbackId: String,
        success: Boolean,
        value: String
    ) {
        val safeId = JSONObject.quote(callbackId)
        val safeValue = JSONObject.quote(value)

        webView.post {
            webView.evaluateJavascript(
                """
                if (window.onChronoNetworkBrainResult) {
                    window.onChronoNetworkBrainResult(
                        $safeId,
                        $success,
                        $safeValue
                    );
                }
                """.trimIndent(),
                null
            )
        }
    }

    fun shutdown() {
        client.shutdown()
    }
}
