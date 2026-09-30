package net.chronoshield.iaapp.ai

/**
 * Motor local de respaldo.
 *
 * No necesita Internet ni un modelo LLM.
 * Utiliza conocimiento integrado en la aplicación.
 */
class KnowledgeAIEngine : LocalAIEngine {

    override fun generate(
        prompt: String,
        context: String
    ): String {

        val text = prompt.lowercase()

        return when {
            text.contains("sentinel") ->
                "Sentinel es la plataforma de monitoreo y prevención de CSN orientada a redes, dispositivos e infraestructura."

            text.contains("mesh") ->
                "Chrono Mesh permite crear conectividad privada y segura entre dispositivos y redes."

            text.contains("red privada") ->
                "Una red privada permite conectar dispositivos y servicios de forma controlada y protegida."

            text.contains("soberanía") ->
                "La soberanía digital busca mantener el control sobre datos, infraestructura y servicios tecnológicos."

            text.contains("hola") ||
            text.contains("buenas") ->
                "Hola. Soy CSN IA, el asistente local de Chrono Shield Networks."

            else ->
                "Todavía estoy aprendiendo sobre ese tema. Puedo ayudarte con Sentinel, Mesh, redes privadas y soberanía digital."
        }
    }
}
