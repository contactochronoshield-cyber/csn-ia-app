package net.chronoshield.iaapp

import android.content.Context
import android.util.Log
import com.google.mediapipe.tasks.genai.llminference.LlmInference
import com.google.mediapipe.tasks.genai.llminference.LlmInference.LlmInferenceOptions
import java.io.File
import java.net.URL

class ChronoLLM(private val context: Context) {

    companion object {
        private const val MODEL_FILENAME = "chrono-model.task"
        private const val MODEL_URL =
            "https://storage.googleapis.com/mediapipe-models/llm_inference/gemma2-2b-it-cpu-int8/gemma2-2b-it-cpu-int8.task"
    }

    private var llmInference: LlmInference? = null

    private val modelFile: File
        get() = File(context.filesDir, MODEL_FILENAME)

    fun isModelDownloaded(): Boolean = modelFile.exists() && modelFile.length() > 0
    fun isLoaded(): Boolean = llmInference != null

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
                            if (totalSize > 0) onProgress((downloaded * 100L / totalSize).toInt())
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

    fun load() {
        if (llmInference != null) return
        val options = LlmInferenceOptions.builder()
            .setModelPath(modelFile.absolutePath)
            .setMaxTokens(512)
            .build()
        llmInference = LlmInference.createFromOptions(context, options)
    }

    fun generate(prompt: String): String {
        val engine = llmInference ?: throw IllegalStateException("Modelo no cargado")
        val fullPrompt = """
            Eres el asistente de Chrono Shield Networks (CSN). Explicas en lenguaje simple,
            sin jerga tecnica, que son los servicios de CSN: redes privadas/mesh, el Chrono Mesh Node,
            Chrono Sentinel, y el cloud soberano. Se claro, breve y cercano.

            Pregunta: $prompt
            Respuesta:
        """.trimIndent()
        return engine.generateResponse(fullPrompt)
    }
}
