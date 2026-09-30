package net.chronoshield.iaapp.ai

/**
 * Adaptador para una fuente externa de inteligencia.
 *
 * Cada fuente debe transformar su información al formato
 * común WebResearchResult.
 */
interface SourceAdapter {

    fun supports(type: ResearchType): Boolean

    fun search(
        query: String,
        type: ResearchType
    ): List<WebResearchResult>
}
