package net.chronoshield.iaapp.ai

import java.net.HttpURLConnection
import java.net.URL

/**
 * Motor de investigación web.
 *
 * Coordina las fuentes externas, pero no decide si una
 * afirmación es verdadera.
 */
class WebResearchEngine(
    private val adapters: List<SourceAdapter> = emptyList()
) {

    fun fetch(urlString: String): String {
        val connection =
            URL(urlString).openConnection() as HttpURLConnection

        connection.requestMethod = "GET"
        connection.connectTimeout = 10000
        connection.readTimeout = 15000
        connection.setRequestProperty(
            "User-Agent",
            "CSN-IA-Threat-Research/0.3"
        )

        return try {
            connection.inputStream.bufferedReader().use {
                it.readText()
            }
        } finally {
            connection.disconnect()
        }
    }

    fun search(
        query: String,
        type: ResearchType
    ): List<WebResearchResult> {

        if (query.isBlank()) {
            return emptyList()
        }

        return adapters
            .filter { it.supports(type) }
            .flatMap { adapter ->
                try {
                    adapter.search(query, type)
                } catch (_: Exception) {
                    emptyList()
                }
            }
            .distinctBy {
                "${it.sourceUrl}|${it.title}"
            }
    }
}
