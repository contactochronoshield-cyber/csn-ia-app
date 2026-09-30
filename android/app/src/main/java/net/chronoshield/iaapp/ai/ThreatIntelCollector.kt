package net.chronoshield.iaapp.ai

/**
 * Coordina investigaciones de inteligencia de amenazas.
 *
 * Importante:
 * Este componente recopila información.
 * No convierte automáticamente cualquier resultado
 * encontrado en Internet en conocimiento confiable.
 */
class ThreatIntelCollector(
    private val researchEngine: WebResearchEngine
) {

    fun research(
        query: String,
        type: ResearchType
    ): List<ThreatIntelRecord> {

        val rawResults = researchEngine.search(
            query = query,
            type = type
        )

        return rawResults.map { result ->
            normalize(result)
        }
    }

    private fun normalize(
        result: WebResearchResult
    ): ThreatIntelRecord {

        return ThreatIntelRecord(
            threatType = result.threatType,
            sourceName = result.sourceName,
            sourceUrl = result.sourceUrl,
            updatedAt = result.updatedAt,
            status = IntelStatus.REPORTED,
            confidence = ConfidenceLevel.MEDIUM
        )
    }
}
