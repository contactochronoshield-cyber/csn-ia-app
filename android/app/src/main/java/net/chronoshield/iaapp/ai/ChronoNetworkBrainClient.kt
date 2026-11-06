package net.chronoshield.iaapp.ai

import android.os.Handler
import android.os.Looper
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

class ChronoNetworkBrainClient(
    private val baseUrl: String
) {
    interface Callback {
        fun onSuccess(result: JSONObject)
        fun onError(message: String)
    }

    private val executor = Executors.newSingleThreadExecutor()
    private val mainHandler = Handler(Looper.getMainLooper())

    fun analyze(message: String, callback: Callback) {
        if (message.isBlank()) {
            mainHandler.post {
                callback.onError("El mensaje no puede estar vacío.")
            }
            return
        }

        executor.execute {
            var connection: HttpURLConnection? = null

            try {
                val endpoint = URL(
                    "${baseUrl.trim().trimEnd('/')}/network/analyze"
                )

                require(endpoint.protocol == "https") {
                    "Chrono Network Brain requiere una conexión HTTPS."
                }

                connection = endpoint.openConnection() as HttpURLConnection
                connection.requestMethod = "POST"
                connection.connectTimeout = 10000
                connection.readTimeout = 15000
                connection.doOutput = true
                connection.setRequestProperty(
                    "Content-Type", "application/json; charset=utf-8"
                )
                connection.setRequestProperty(
                    "Accept", "application/json"
                )

                val payload = JSONObject()
                    .put("message", message)
                    .toString()

                connection.outputStream.use { output ->
                    output.write(payload.toByteArray(Charsets.UTF_8))
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
                    throw IOException("Error HTTP $status: ${body.take(300)}")
                }

                val response = JSONObject(body)

                mainHandler.post {
                    callback.onSuccess(response)
                }

            } catch (error: Exception) {
                val messageError = error.message
                    ?: "No fue posible conectar con Chrono Network Brain."

                mainHandler.post {
                    callback.onError(messageError)
                }
            } finally {
                connection?.disconnect()
            }
        }
    }

    fun shutdown() {
        executor.shutdown()
    }
}
