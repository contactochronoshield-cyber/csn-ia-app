package net.chronoshield.iaapp.ai

/**
 * Coordina investigaciones de inteligencia de amenazas.
 *
 * Recopila, normaliza y almacena resultados.
 *
 * La información encontrada en Internet no se considera
 * automáticamente verdadera.
 */
class ThreatIntelCollector(
    private val researchEngine: WebResearchEngine,
    private val store: ThreatIntelStore
) {

    fun research(
        query: String,
        type: ResearchType
    ): List<ThreatIntelRecord> {

        val rawResults = researchEngine.search(
            query = query,
            type = type
        )

        val normalized = rawResults.map { result ->
            normalize(result)
        }

        store.saveAll(normalized)

        return normalized
    }

    fun searchLocal(
        query: String,
        type: ResearchType
    ): List<ThreatIntelRecord> {

        return when (type) {

            ResearchType.THREAT_ACTOR ->
                store.findByActor(query)

            ResearchType.MALWARE ->
                store.findByMalware(query)

            ResearchType.CVE,
            ResearchType.VULNERABILITY ->
                store.findByCve(query)

            else ->
                store.findByType(query)
        }
    }

    fun allLocal(): List<ThreatIntelRecord> {
        return store.all()
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
