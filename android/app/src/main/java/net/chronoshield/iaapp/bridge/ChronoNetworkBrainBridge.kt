package net.chronoshield.iaapp.bridge

import android.webkit.JavascriptInterface
import android.webkit.WebView
import net.chronoshield.iaapp.ai.ChronoNetworkBrainClient
import net.chronoshield.iaapp.ai.ChronoSessionStore
import org.json.JSONObject

class ChronoNetworkBrainBridge(
    private val webView: WebView,
    baseUrl: String
) {
    private val sessionStore =
        ChronoSessionStore(webView.context.applicationContext)

    private val client =
        ChronoNetworkBrainClient(baseUrl, sessionStore)

    @JavascriptInterface
    fun analyze(message: String, callbackId: String) {
        if (!validId(callbackId)) return

        client.analyze(message, object : ChronoNetworkBrainClient.Callback {
            override fun onSuccess(result: JSONObject) {
                sendNetworkResult(callbackId, true, result.toString())
            }

            override fun onError(message: String) {
                sendNetworkResult(callbackId, false, message)
            }
        })
    }

    @JavascriptInterface
    fun activate(
        licenseKey: String,
        email: String,
        password: String,
        callbackId: String
    ) {
        if (!validId(callbackId)) return

        client.activateOrganization(
            licenseKey,
            email,
            password,
            authCallback("activate", callbackId)
        )
    }

    @JavascriptInterface
    fun login(
        email: String,
        password: String,
        organizationId: String,
        callbackId: String
    ) {
        if (!validId(callbackId)) return

        client.login(
            email,
            password,
            organizationId,
            authCallback("login", callbackId)
        )
    }

    @JavascriptInterface
    fun me(callbackId: String) {
        if (!validId(callbackId)) return

        client.me(authCallback("me", callbackId))
    }

    @JavascriptInterface
    fun logout(callbackId: String) {
        if (!validId(callbackId)) return

        client.logout(authCallback("logout", callbackId))
    }

    private fun authCallback(
        action: String,
        callbackId: String
    ) = object : ChronoNetworkBrainClient.Callback {
        override fun onSuccess(result: JSONObject) {
            sendAuthResult(
                callbackId,
                action,
                true,
                result.toString()
            )
        }

        override fun onError(message: String) {
            sendAuthResult(
                callbackId,
                action,
                false,
                message
            )
        }
    }

    private fun validId(value: String): Boolean {
        return value.matches(Regex("[A-Za-z0-9_-]{1,64}"))
    }

    private fun sendNetworkResult(
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

    private fun sendAuthResult(
        callbackId: String,
        action: String,
        success: Boolean,
        value: String
    ) {
        val safeId = JSONObject.quote(callbackId)
        val safeAction = JSONObject.quote(action)
        val safeValue = JSONObject.quote(value)

        webView.post {
            webView.evaluateJavascript(
                """
                if (window.onChronoAuthResult) {
                    window.onChronoAuthResult(
                        $safeId,
                        $safeAction,
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
