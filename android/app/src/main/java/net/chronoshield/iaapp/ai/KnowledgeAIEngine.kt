package net.chronoshield.iaapp.ai

class KnowledgeAIEngine : LocalAIEngine {

    private val router = QueryRouter()
    private var lastTopic = QueryType.UNKNOWN
    private var lastAnswer = ""

    override fun generate(prompt: String, context: String): String {
        val original = prompt.trim()
        if (original.isBlank()) return "Cuéntame qué tienes en mente y lo vemos juntos."

        val text = original.lowercase()

        if (isGreeting(text)) {
            lastTopic = QueryType.GENERAL
            return choose(
                "¡Hola! 👋 Soy CSN IA. ¿Qué quieres conocer?",
                "¡Buenas! 😄 Dime qué necesitas.",
                "Hola 👋. ¿Qué quieres explorar hoy?",
                "¡Hola! Cuéntame qué tienes en mente."
            )
        }

        if (isThanks(text)) {
            return choose(
                "¡De nada! 😄",
                "Claro, para eso estoy.",
                "Con gusto. Si quieres, seguimos.",
                "Perfecto 😄. Cuando quieras continuamos."
            )
        }

        if (isGoodbye(text)) {
            return choose(
                "¡Nos vemos! 👋",
                "Hasta luego. Cuando quieras seguimos.",
                "Chao 😄.",
                "Perfecto, nos vemos."
            )
        }

        val type = router.classify(text)

        if (isContinuation(text) && lastTopic != QueryType.UNKNOWN) {
            return continuation(lastTopic)
        }

        val matches = KnowledgeBase.entries.filter { entry ->
            entry.category == type &&
            entry.keywords.any { text.contains(it.lowercase()) }
        }

        if (matches.isNotEmpty()) {
            val answer = matches.first().answer.trim()
            lastTopic = type
            lastAnswer = answer
            return natural(answer, type)
        }

        lastTopic = type

        val answer = when (type) {
            QueryType.CSN ->
                choose(
                    "Puedo hablarte de Chrono Shield y su infraestructura. ¿Quieres empezar por ChronoOS, Sentinel-Civil, Mesh o redes privadas?",
                    "Ese tema está relacionado con CSN. Dime qué parte quieres conocer y vamos paso a paso.",
                    "Claro. Puedo explicarte los componentes de CSN sin complicarlo."
                )

            QueryType.PROJECT ->
                choose(
                    "Ese proyecto todavía no tiene una entrada específica en mi conocimiento local. Puedo explicarte lo que sí tengo registrado.",
                    "No tengo una ficha completa de ese proyecto todavía. Si me das el nombre o el aspecto que buscas, seguimos desde ahí.",
                    "Puedo hablar de ese proyecto, pero prefiero no inventar información que todavía no tengo."
                )

            QueryType.CYBERSECURITY ->
                choose(
                    "Puedo explicarte ese concepto con un ejemplo sencillo.",
                    "Sí. Vamos paso a paso y después entramos en la parte técnica.",
                    "Claro. Dime qué parte de ciberseguridad quieres entender."
                )

            QueryType.GENERAL ->
                choose(
                    "Entiendo. Cuéntame un poco más y te respondo.",
                    "Vale 😄. Dame un poco más de contexto.",
                    "Claro. ¿Qué quieres saber exactamente?"
                )

            QueryType.UNKNOWN ->
                choose(
                    "No estoy seguro de haber entendido. ¿Puedes decirlo de otra manera?",
                    "Creo que me falta un poco de contexto. ¿Qué quieres conseguir?",
                    "No quiero inventarte una respuesta. Explícame un poco más."
                )
        }

        lastAnswer = answer
        return answer
    }

    private fun isGreeting(t: String) =
        listOf("hola", "buenas", "hey", "hello", "buenos dias", "buen día",
            "buenas tardes", "buenas noches", "que tal", "qué tal")
            .any { t == it || t.startsWith("$it ") }

    private fun isThanks(t: String) =
        listOf("gracias", "muchas gracias", "te agradezco")
            .any { t.contains(it) }

    private fun isGoodbye(t: String) =
        listOf("adios", "adiós", "hasta luego", "nos vemos", "chao", "bye")
            .any { t.contains(it) }

    private fun isContinuation(t: String) =
        listOf("dime mas", "dime más", "cuéntame más", "cuentame mas",
            "no entendí", "no entendi", "explícame", "explicame",
            "y eso", "como funciona", "cómo funciona", "otra vez",
            "amplía", "amplia")
            .any { t.contains(it) }

    private fun continuation(type: QueryType): String =
        when (type) {
            QueryType.CSN ->
                choose(
                    "Claro. Podemos profundizar en cómo funciona CSN por dentro.",
                    "Sí, seguimos desde ahí. ¿Quieres la parte técnica?",
                    "Claro 😄. Podemos ir un nivel más profundo."
                )
            QueryType.PROJECT ->
                choose(
                    "Claro. Podemos entrar en ese proyecto y ver sus componentes.",
                    "Sí. Te explico cómo encajan sus partes.",
                    "Podemos profundizar. ¿Quieres verlo desde el uso práctico o técnico?"
                )
            QueryType.CYBERSECURITY ->
                choose(
                    "Claro. Te lo explico con un ejemplo real.",
                    "Sí. Vamos paso a paso.",
                    "Por supuesto. Te lo puedo explicar de forma sencilla."
                )
            else ->
                choose(
                    "Claro. ¿Qué parte quieres desarrollar?",
                    "Sí, seguimos desde ahí.",
                    "Perfecto. Dime qué quieres entender mejor."
                )
        }

    private fun natural(answer: String, type: QueryType): String =
        when ((System.nanoTime().ushr(4) % 4).toInt()) {
            0 -> answer
            1 -> "Claro. $answer"
            2 -> "Mira: $answer"
            else -> "Te lo explico de forma sencilla: $answer"
        }

    private fun <T> choose(vararg options: T): T =
        options[(System.nanoTime().ushr(4) % options.size).toInt()]
}
