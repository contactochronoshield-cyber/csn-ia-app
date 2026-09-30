package net.chronoshield.iaapp.ai

/**
 * Motor de conocimiento local de CSN IA.
 *
 * Funciona completamente sin Internet.
 *
 * Flujo:
 *
 * pregunta
 *    ↓
 * QueryRouter
 *    ↓
 * KnowledgeBase
 *    ↓
 * respuesta local
 */
class KnowledgeAIEngine : LocalAIEngine {

    private val router = QueryRouter()

    override fun generate(
        prompt: String,
        context: String
    ): String {

        val text = prompt
            .trim()
            .lowercase()

        if (text.isBlank()) {
            return "Escribe una pregunta para que pueda ayudarte."
        }

        val type = router.classify(text)

        /*
         * Primero buscamos coincidencias específicas
         * dentro de la base de conocimiento.
         */
        val matches = KnowledgeBase.entries.filter { entry ->
            entry.category == type &&
            entry.keywords.any { keyword ->
                text.contains(keyword)
            }
        }

        if (matches.isNotEmpty()) {
            return matches.first().answer
        }

        /*
         * Si no encontramos una entrada específica,
         * ofrecemos una respuesta controlada.
         */
        return when (type) {

            QueryType.CSN ->
                "No tengo todavía información específica sobre ese aspecto de Chrono Shield Networks en mi base local."

            QueryType.PROJECT ->
                "Conozco algunos proyectos de CSN, pero todavía no tengo información suficiente sobre ese proyecto específico."

            QueryType.CYBERSECURITY ->
                "Puedo explicar conceptos de ciberseguridad, pero todavía no tengo una entrada específica para esa pregunta."

            QueryType.GENERAL ->
                "Puedo ayudarte con información sobre Chrono Shield, sus proyectos y conceptos generales de ciberseguridad."

            QueryType.UNKNOWN ->
                "No pude determinar el tema de la pregunta."
        }
    }
}
