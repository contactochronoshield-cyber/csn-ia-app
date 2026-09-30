package net.chronoshield.iaapp.ai

/**
 * Base de conocimiento local de CSN IA.
 *
 * Contiene información que la aplicación puede utilizar
 * sin conexión a Internet.
 */
object KnowledgeBase {

    data class Entry(
        val id: String,
        val category: QueryType,
        val keywords: List<String>,
        val answer: String
    )

    val entries = listOf(

        Entry(
            id = "csn-overview",
            category = QueryType.CSN,
            keywords = listOf(
                "chrono shield",
                "chronoshield",
                "csn"
            ),
            answer = """
Chrono Shield Networks (CSN) desarrolla soluciones orientadas
a infraestructura, redes, conectividad, monitoreo y ciberseguridad.

CSN IA es el asistente local de la aplicación CSN IA.
""".trimIndent()
        ),

        Entry(
            id = "sentinel",
            category = QueryType.PROJECT,
            keywords = listOf(
                "sentinel",
                "sentinel-civil"
            ),
            answer = """
Sentinel-Civil es una plataforma orientada al monitoreo,
prevención y análisis de seguridad de redes, dispositivos
e infraestructura.
""".trimIndent()
        ),

        Entry(
            id = "chrono-mesh",
            category = QueryType.PROJECT,
            keywords = listOf(
                "chrono mesh",
                "mesh node",
                "mesh"
            ),
            answer = """
Chrono Mesh está orientado a conectividad privada y segura
entre dispositivos y redes.
""".trimIndent()
        ),

        Entry(
            id = "private-network",
            category = QueryType.CYBERSECURITY,
            keywords = listOf(
                "red privada",
                "private network",
                "vpn"
            ),
            answer = """
Una red privada permite conectar dispositivos y servicios
de forma controlada, reduciendo la exposición directa
a redes públicas.
""".trimIndent()
        ),

        Entry(
            id = "cybersecurity",
            category = QueryType.CYBERSECURITY,
            keywords = listOf(
                "ciberseguridad",
                "cybersecurity",
                "seguridad informática"
            ),
            answer = """
La ciberseguridad comprende las técnicas y controles utilizados
para proteger sistemas, redes, dispositivos y datos frente
a accesos no autorizados, vulnerabilidades y otras amenazas.
""".trimIndent()
        ),

        Entry(
            id = "digital-sovereignty",
            category = QueryType.CSN,
            keywords = listOf(
                "soberanía digital",
                "soberania digital"
            ),
            answer = """
La soberanía digital busca mantener mayor control sobre los
datos, infraestructura y servicios tecnológicos utilizados
por una organización o comunidad.
""".trimIndent()
        )
    )
}
