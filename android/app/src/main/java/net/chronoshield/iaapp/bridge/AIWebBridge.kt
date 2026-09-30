package net.chronoshield.iaapp.bridge

import android.webkit.JavascriptInterface
import net.chronoshield.iaapp.ai.KnowledgeAIEngine
import net.chronoshield.iaapp.ai.ResearchType
import net.chronoshield.iaapp.ai.ThreatIntelCollector
import net.chronoshield.iaapp.ai.ThreatIntelRecord

/**
 * Puente entre la interfaz WebView y CSN IA.
 *
 * Flujo:
 *
 * 1. Recibe la pregunta desde chat.html.
 * 2. Detecta si corresponde a inteligencia de amenazas.
 * 3. Consulta primero la inteligencia local persistente.
 * 4. Si encuentra resultados, los devuelve.
 * 5. Si no encuentra resultados, utiliza el motor local general.
 */
class AIWebBridge(
    private val engine: KnowledgeAIEngine,
    private val threatIntelCollector: ThreatIntelCollector
) {

    @JavascriptInterface
    fun ask(prompt: String): String {

        val query = prompt.trim()

        if (query.isBlank()) {
            return "Escribe una pregunta."
        }

        /*
         * Detectamos si la pregunta corresponde
         * a un tipo de investigación de amenazas.
         */
        val researchType = detectResearchType(query)

        /*
         * IMPORTANTE:
         *
         * Primero buscamos en la inteligencia local
         * persistente de CSN IA.
         *
         * Si existe información, la utilizamos.
         */
        if (researchType != null) {

            val localResults = threatIntelCollector.searchLocal(
                query = query,
                type = researchType
            )

            if (localResults.isNotEmpty()) {
                return formatResults(localResults)
            }

            /*
             * No existe información local.
             *
             * CSN IA intenta realizar una investigación
             * mediante las fuentes configuradas.
             *
             * Los resultados normalizados se almacenan
             * posteriormente en SQLite mediante el Collector.
             */
            return try {

                val researched = threatIntelCollector.research(
                    query = query,
                    type = researchType
                )

                if (researched.isNotEmpty()) {
                    formatResults(researched)
                } else {
                    engine.generate(query)
                }

            } catch (_: Exception) {

                /*
                 * Si una fuente externa falla, CSN IA
                 * continúa funcionando con el motor local.
                 */
                engine.generate(query)
            }
        }

        /*
         * No es una consulta específica de inteligencia
         * de amenazas: utilizar el motor local general.
         */
        return engine.generate(query)
    }

    /**
     * Detecta el tipo de investigación solicitado.
     */
    private fun detectResearchType(query: String): ResearchType? {

        val text = query.lowercase()

        return when {

            text.contains("cve") ||
            text.contains("vulnerabilidad") ||
            text.contains("vulnerable") ->
                ResearchType.VULNERABILITY

            text.contains("malware") ||
            text.contains("ransomware") ||
            text.contains("virus") ->
                ResearchType.MALWARE

            text.contains("grupo") ||
            text.contains("actor") ||
            text.contains("atacante") ||
            text.contains("amenaza") ->
                ResearchType.THREAT_ACTOR

            text.contains("campaña") ||
            text.contains("campaign") ->
                ResearchType.CAMPAIGN

            text.contains("incidente") ||
            text.contains("ataque") ->
                ResearchType.INCIDENT

            text.contains("ttp") ||
            text.contains("táctica") ||
            text.contains("tecnica") ||
            text.contains("técnica") ->
                ResearchType.TTP

            else ->
                null
        }
    }

    /**
     * Convierte los registros locales en texto
     * para mostrarlos en el chat.
     */
    private fun formatResults(
        records: List<ThreatIntelRecord>
    ): String {

        return buildString {

            append(
                "Encontré información en la inteligencia local de CSN IA:\n\n"
            )

            records
                .take(5)
                .forEachIndexed { index, record ->

                    append("${index + 1}. ")

                    if (record.actor.isNotBlank()) {
                        append("Actor: ${record.actor}. ")
                    }

                    if (record.threatType.isNotBlank()) {
                        append("Tipo: ${record.threatType}. ")
                    }

                    if (record.malware.isNotEmpty()) {
                        append(
                            "Malware: ${
                                record.malware.joinToString(", ")
                            }. "
                        )
                    }

                    if (record.cves.isNotEmpty()) {
                        append(
                            "CVE: ${
                                record.cves.joinToString(", ")
                            }. "
                        )
                    }

                    if (record.sourceName.isNotBlank()) {
                        append(
                            "Fuente: ${record.sourceName}. "
                        )
                    }

                    if (record.sourceUrl.isNotBlank()) {
                        append(
                            "URL: ${record.sourceUrl}. "
                        )
                    }

                    append("\n\n")
                }
        }
    }
}
