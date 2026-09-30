package net.chronoshield.iaapp.ai

/**
 * Clasifica las consultas antes de enviarlas al motor de conocimiento.
 */
enum class QueryType {
    CSN,
    PROJECT,
    CYBERSECURITY,
    GENERAL,
    UNKNOWN
}

class QueryRouter {

    fun classify(prompt: String): QueryType {
        val text = prompt.lowercase()

        val csnKeywords = listOf(
            "chrono shield",
            "chronoshield",
            "csn",
            "empresa",
            "servicios",
            "soberanía digital"
        )

        val projectKeywords = listOf(
            "sentinel",
            "sentinel-civil",
            "chronoos",
            "chrono os",
            "chrono mesh",
            "mesh node",
            "cpe",
            "chrono cloud",
            "chrono sovereign"
        )

        val securityKeywords = listOf(
            "ciberseguridad",
            "cybersecurity",
            "vulnerabilidad",
            "cve",
            "malware",
            "virus",
            "ransomware",
            "firewall",
            "ids",
            "ips",
            "dns",
            "vpn",
            "wireguard",
            "linux",
            "tcp",
            "udp",
            "red",
            "router",
            "iot",
            "botnet",
            "phishing",
            "seguridad"
        )

        return when {
            projectKeywords.any { text.contains(it) } ->
                QueryType.PROJECT

            csnKeywords.any { text.contains(it) } ->
                QueryType.CSN

            securityKeywords.any { text.contains(it) } ->
                QueryType.CYBERSECURITY

            text.isNotBlank() ->
                QueryType.GENERAL

            else ->
                QueryType.UNKNOWN
        }
    }
}
