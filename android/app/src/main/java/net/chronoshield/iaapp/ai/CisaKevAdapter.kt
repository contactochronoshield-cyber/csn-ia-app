package net.chronoshield.iaapp.ai

/**
 * Adaptador para el catálogo CISA Known Exploited Vulnerabilities.
 *
 * En esta primera versión la consulta se limita a la fuente
 * estructurada y conserva la procedencia del dato.
 */
class CisaKevAdapter(
    private val researchEngine: WebResearchEngine
) : SourceAdapter {

    override fun supports(type: ResearchType): Boolean {
        return type == ResearchType.CVE ||
               type == ResearchType.VULNERABILITY
    }

    override fun search(
        query: String,
        type: ResearchType
    ): List<WebResearchResult> {

        if (!supports(type) || query.isBlank()) {
            return emptyList()
        }

        /*
         * La implementación del parser se añadirá después de
         * verificar el formato actual de la fuente.
         *
         * No inventamos resultados si la fuente no puede
         * interpretarse correctamente.
         */
        return emptyList()
    }
}
