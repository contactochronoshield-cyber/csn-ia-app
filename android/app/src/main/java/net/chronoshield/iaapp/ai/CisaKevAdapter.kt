package net.chronoshield.iaapp.ai

import org.json.JSONObject

/**
 * Adaptador para el catálogo CISA Known Exploited Vulnerabilities.
 *
 * Consulta el catálogo JSON oficial y convierte las entradas
 * relevantes al modelo común de CSN IA.
 */
class CisaKevAdapter(
    private val fetch: (String) -> String
) : SourceAdapter {

    companion object {
        private const val KEV_URL =
            "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"

        private const val CISA_SOURCE =
            "CISA Known Exploited Vulnerabilities"
    }

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

        val normalizedQuery = query.trim().lowercase()

        val document = try {
            JSONObject(fetch(KEV_URL))
        } catch (_: Exception) {
            return emptyList()
        }

        val vulnerabilities =
            document.optJSONArray("vulnerabilities")
                ?: return emptyList()

        val results = mutableListOf<WebResearchResult>()

        for (index in 0 until vulnerabilities.length()) {

            val vulnerability =
                vulnerabilities.optJSONObject(index)
                    ?: continue

            val cveId =
                vulnerability.optString("cveID")

            val vendorProject =
                vulnerability.optString("vendorProject")

            val product =
                vulnerability.optString("product")

            val vulnerabilityName =
                vulnerability.optString("vulnerabilityName")

            val description =
                vulnerability.optString("shortDescription")

            val dateAdded =
                vulnerability.optString("dateAdded")

            val searchable = listOf(
                cveId,
                vendorProject,
                product,
                vulnerabilityName,
                description
            ).joinToString(" ").lowercase()

            if (!searchable.contains(normalizedQuery)) {
                continue
            }

            results += WebResearchResult(
                title = vulnerabilityName.ifBlank {
                    cveId
                },
                summary = buildString {
                    if (vendorProject.isNotBlank()) {
                        append("Proveedor/proyecto: ")
                        append(vendorProject)
                        append(". ")
                    }

                    if (product.isNotBlank()) {
                        append("Producto: ")
                        append(product)
                        append(". ")
                    }

                    if (description.isNotBlank()) {
                        append(description)
                    }
                }.trim(),
                threatType = "CVE",
                cves = if (cveId.isNotBlank()) {
                    listOf(cveId)
                } else {
                    emptyList()
                },
                sourceName = CISA_SOURCE,
                sourceUrl = if (cveId.isNotBlank()) {
                    "$KEV_URL#$cveId"
                } else {
                    KEV_URL
                },
                updatedAt = dateAdded
            )
        }

        return results
    }
}
