package net.chronoshield.iaapp.bridge
import kotlin.concurrent.thread
import java.net.URL
import java.net.HttpURLConnection
import org.json.JSONArray

import android.webkit.JavascriptInterface
import android.webkit.WebView
import net.chronoshield.iaapp.ai.ChronoNetworkBrainClient
import net.chronoshield.iaapp.ai.ChronoSessionStore
impor
    private val csnChatBaseUrl = baseUrl.trim().trimEnd('/')
t org.json.JSONObject

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

    /**
     * Conversación natural con el backend CSN IA.
     * El historial se limita y se envía únicamente al servidor configurado.
     */
    @JavascriptInterface
    fun chat(message: String, historyJson: String, callbackId: String) {
        thread {
            var connection: HttpURLConnection? = null
            try {
                if (csnChatBaseUrl.isBlank()) {
                    throw IllegalStateException("Backend CSN IA no configurado")
                }

                val url = URL("$"+"csnChatBaseUrl/chat")
                connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "POST"
                connection.connectTimeout = 15000
                connection.readTimeout = 60000
                connection.doOutput = true
                connection.setRequestProperty("Content-Type", "application/json; charset=utf-8")
                connection.setRequestProperty("Accept", "application/json")

                val history = try {
                    JSONArray(historyJson)
                } catch (_: Exception) {
                    JSONArray()
                }

                val payload = JSONObject()
                    .put("message", message.take(4000))
                    .put("history", history)

                connection.outputStream.use {
                    it.write(payload.toString().toByteArray(Charsets.UTF_8))
                }

                val code = connection.responseCode
                val stream = if (code in 200..299) {
                    connection.inputStream
                } else {
                    connection.errorStream
                }

                val raw = stream?.bufferedReader(Charsets.UTF_8)?.use { it.readText() } ?: ""
                if (code !in 200..299) {
                    throw IllegalStateException("Backend HTTP $"+ "code")
                }

                val parsed = JSONObject(raw)
                val answer = parsed.optString("response", "").trim()
                if (answer.isBlank()) {
                    throw IllegalStateException("El backend devolvió una respuesta vacía")
                }

                val envelope = JSONObject()
                    .put("response", answer)
                    .put("sources_used", parsed.optJSONArray("sources_used") ?: JSONArray())

                val quotedId = JSONObject.quote(callbackId)
                val quotedValue = JSONObject.quote(envelope.toString())
                val script = "window.onChronoChatResult && window.onChronoChatResult($"+ "quotedId,true,$"+ "quotedValue);"

                webView.post {
                    webView.evaluateJavascript(script, null)
                }
            } catch (e: Exception) {
                val error = JSONObject()
                    .put("error", e.message ?: "Error de conexión")
                    .toString()

                val quotedId = JSONObject.quote(callbackId)
                val quotedValue = JSONObject.quote(error)
                val script = "window.onChronoChatResult && window.onChronoChatResult($"+ "quotedId,false,$"+ "quotedValue);"

                webView.post {
                    webView.evaluateJavascript(script, null)
                }
            } finally {
                connection?.disconnect()
            }
        }
    }

}
