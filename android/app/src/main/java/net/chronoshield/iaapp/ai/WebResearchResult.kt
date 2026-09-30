package net.chronoshield.iaapp.ai

/**
 * Resultado bruto de una investigación web.
 *
 * Todavía no representa una afirmación verificada.
 * El ThreatIntelCollector será responsable de normalizarlo.
 */
data class WebResearchResult(
    val title: String = "",
    val summary: String = "",
    val threatType: String = "",
    val cves: List<String> = emptyList(),
    val sourceName: String = "",
    val sourceUrl: String = "",
    val updatedAt: String = ""
)
