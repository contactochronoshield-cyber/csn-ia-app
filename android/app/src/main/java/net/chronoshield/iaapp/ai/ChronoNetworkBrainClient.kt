package net.chronoshield.iaapp.ai

import android.os.Handler
import android.os.Looper
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

class ChronoNetworkBrainClient(
    private val baseUrl: String,
    private val sessionStore: ChronoSessionStore
) {
    interface Callback {
        fun onSuccess(result: JSONObject)
        fun onError(message: String)
    }

    private val executor = Executors.newSingleThreadExecutor()
    private val mainHandler = Handler(Looper.getMainLooper())

    fun analyze(message: String, callback: Callback) {
        if (message.isBlank()) {
            callbackError(callback, "El mensaje no puede estar vacío.")
            return
        }

        request(
            "/network/analyze",
            "POST",
            JSONObject().put("message", message),
            true,
            false,
            callback
        )
    }

    fun activateOrganization(
        licenseKey: String,
        email: String,
        password: String,
        callback: Callback
    ) {
        if (
            licenseKey.isBlank() ||
            email.isBlank() ||
            password.isBlank()
        ) {
            callbackError(callback, "Completa todos los campos.")
            return
        }

        val payload = JSONObject()
            .put("license_key", licenseKey.trim())
            .put("email", email.trim())
            .put("password", password)

        request(
            "/auth/activate",
            "POST",
            payload,
            false,
            false,
            callback
        )
    }

    fun login(
        email: String,
        password: String,
        organizationId: String,
        callback: Callback
    ) {
        if (
            email.isBlank() ||
            password.isBlank() ||
            organizationId.isBlank()
        ) {
            callbackError(
                callback,
                "Correo, contraseña e identificador de organización son obligatorios."
            )
            return
        }

        val payload = JSONObject()
            .put("email", email.trim())
            .put("password", password)
            .put("organization_id", organizationId.trim())

        request(
            "/auth/login",
            "POST",
            payload,
            false,
            true,
            callback
        )
    }

    fun me(callback: Callback) {
        request(
            "/auth/me",
            "GET",
            null,
            true,
            false,
            callback
        )
    }

    fun logout(callback: Callback) {
        request(
            "/auth/logout",
            "POST",
            JSONObject(),
            true,
            false,
            callback,
            clearSession = true
        )
    }

    private fun request(
        path: String,
        method: String,
        payload: JSONObject?,
        requiresSession: Boolean,
        saveLoginToken: Boolean,
        callback: Callback,
        clearSession: Boolean = false
    ) {
        executor.execute {
            var connection: HttpURLConnection? = null

            try {
                val token = if (requiresSession) {
                    sessionStore.getToken()
                        ?: throw IOException(
                            "Inicia sesión para utilizar este servicio."
                        )
                } else {
                    null
                }

                val endpoint = URL(
                    baseUrl.trim().trimEnd('/') + path
                )

                require(endpoint.protocol == "https") {
                    "Chrono Network Brain requiere HTTPS."
                }

                connection = endpoint.openConnection() as HttpURLConnection
                connection.requestMethod = method
                connection.connectTimeout = 10000
                connection.readTimeout = 20000
                connection.setRequestProperty(
                    "Accept",
                    "application/json"
                )

                if (payload != null) {
                    connection.doOutput = true
                    connection.setRequestProperty(
                        "Content-Type",
                        "application/json; charset=utf-8"
                    )

                    connection.outputStream.use { output ->
                        output.write(
                            payload.toString().toByteArray(Charsets.UTF_8)
                        )
                    }
                }

                if (!token.isNullOrBlank()) {
                    connection.setRequestProperty(
                        "Authorization",
                        "Bearer $token"
                    )
                }

                val status = connection.responseCode
                val stream = if (status in 200..299) {
                    connection.inputStream
                } else {
                    connection.errorStream
                }

                val body = stream?.bufferedReader(Charsets.UTF_8)
                    ?.use { it.readText() } ?: ""

                if (status !in 200..299) {
                    if (status == 401 && requiresSession) {
                        sessionStore.clear()
                    }

                    val detail = try {
                        JSONObject(body).optString(
                            "detail",
                            "Error HTTP $status"
                        )
                    } catch (_: Exception) {
                        "Error HTTP $status"
                    }

                    throw IOException(detail)
                }

                val response = if (body.isBlank()) {
                    JSONObject()
                } else {
                    JSONObject(body)
                }

                if (saveLoginToken) {
                    val accessToken = response.optString("access_token")

                    if (accessToken.isBlank()) {
                        throw IOException(
                            "El servidor no devolvió un token de sesión."
                        )
                    }

                    sessionStore.saveToken(accessToken)

                    // El token nunca se devuelve al JavaScript.
                    response.remove("access_token")
                }

                if (clearSession) {
                    sessionStore.clear()
                }

                mainHandler.post {
                    callback.onSuccess(response)
                }

            } catch (error: Exception) {
                if (clearSession) {
                    sessionStore.clear()
                }

                val errorMessage = error.message
                    ?: "No fue posible conectar con Chrono Shield Networks."

                mainHandler.post {
                    callback.onError(errorMessage)
                }
            } finally {
                connection?.disconnect()
            }
        }
    }

    private fun callbackError(
        callback: Callback,
        message: String
    ) {
        mainHandler.post {
            callback.onError(message)
        }
    }

    fun shutdown() {
        executor.shutdownNow()
    }
}
