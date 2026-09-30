package net.chronoshield.iaapp.ai

/**
 * Adaptador inicial para fuentes de ciberseguridad.
 *
 * Se mantiene vacío hasta conectar una fuente concreta
 * y documentar su formato/API.
 */
class CyberSourceAdapter : SourceAdapter {

    override fun supports(type: ResearchType): Boolean {
        return when (type) {
            ResearchType.THREAT_ACTOR,
            ResearchType.MALWARE,
            ResearchType.RANSOMWARE,
            ResearchType.CVE,
            ResearchType.VULNERABILITY,
            ResearchType.CAMPAIGN,
            ResearchType.INCIDENT,
            ResearchType.TTP,
            ResearchType.GENERAL_CYBER -> true

            ResearchType.UNKNOWN -> false
        }
    }

    override fun search(
        query: String,
        type: ResearchType
    ): List<WebResearchResult> {
        return emptyList()
    }
}
