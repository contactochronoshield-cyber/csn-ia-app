package net.chronoshield.iaapp

import android.content.Context
import android.util.Log
import com.google.mediapipe.tasks.genai.llminference.LlmInference
import com.google.mediapipe.tasks.genai.llminference.LlmInference.LlmInferenceOptions
import java.io.File
import java.net.URL

/**
 * Motor de IA local para CSN. El modelo se descarga UNA sola vez (primer uso,
 * con internet) y queda guardado en el almacenamiento privado de la app.
 * Despues de eso, responde sin conexion: nada sale del telefono del cliente.
 *
 * Modelo: Gemma 2 2B quantizado (formato .task de MediaPipe), ~1.2GB.
 * Cambia MODEL_URL si prefieren un modelo mas liviano.
 */
class ChronoLLM(private val context: Context) {

    companion object {
        private const val MODEL_FILENAME = "chrono-model.task"
        // Modelo de referencia (Gemma-2 2B instruction-tuned, cuantizado).
        // Reemplazar por el enlace real que decida el equipo antes de publicar.
        private const val MODEL_URL =
            "https://storage.googleapis.com/mediapipe-models/llm_inference/gemma2-2b-it-cpu-int8/gemma2-2b-it-cpu-int8.task"
    }

    private var llmInference: LlmInference? = null

    private val modelFile: File
        get() = File(context.filesDir, MODEL_FILENAME)

    fun isModelDownloaded(): Boolean = modelFile.exists() && modelFile.length() > 0

    /** Descarga el modelo. Llamar SOLO con conexion a internet, una vez. */
    fun downloadModel(onProgress: (Int) -> Unit, onDone: (Boolean) -> Unit) {
        Thread {
            try {
                val connection = URL(MODEL_URL).openConnection()
                val totalSize = connection.contentLength
                connection.getInputStream().use { input ->
                    modelFile.outputStream().use { output ->
                        val buffer = ByteArray(8192)
                        var downloaded = 0
                        var bytes = input.read(buffer)
                        while (bytes >= 0) {
                            output.write(buffer, 0, bytes)
                            downloaded += bytes
                            if (totalSize > 0) {
                                onProgress((downloaded * 100L / totalSize).toInt())
                            }
                            bytes = input.read(buffer)
                        }
                    }
                }
                onDone(true)
            } catch (e: Exception) {
                Log.e("ChronoLLM", "Error descargando modelo", e)
                modelFile.delete()
                onDone(false)
            }
        }.start()
    }

    /** Carga el modelo ya descargado en memoria. Llamar antes de generate(). */
    fun load() {
        if (llmInference != null) return
        val options = LlmInferenceOptions.builder()
            .setModelPath(modelFile.absolutePath)
            .setMaxTokens(512)
            .build()
        llmInference = LlmInference.createFromOptions(context, options)
    }

    /** Genera una respuesta. Corre 100% local, sin red. */
    fun generate(prompt: String): String {
        val engine = llmInference ?: throw IllegalStateException("Modelo no cargado, llama a load() primero")
        val fullPrompt = """
            Eres el asistente de Chrono Shield Networks (CSN). Explicas en lenguaje simple,
            sin jerga tecnica, que son los servicios de CSN: redes privadas/mesh, el Chrono Mesh Node,
            Chrono Sentinel, y el cloud soberano. La persona que pregunta nunca ha usado una red
            privada. Se claro, breve y cercano.

            Pregunta: $prompt
            Respuesta:
        """.trimIndent()
        return engine.generateResponse(fullPrompt)
    }
}
