package net.chronoshield.iaapp.ai

class ThreatIntelRouter {

    fun classify(prompt: String): ResearchType {
        val text = prompt.lowercase()

        return when {
            listOf(
                "cve",
                "vulnerabilidad",
                "vulnerabilidades",
                "exploit",
                "explotada",
                "kev"
            ).any { text.contains(it) } ->
                ResearchType.VULNERABILITY

            listOf(
                "malware",
                "troyano",
                "trojan",
                "stealer",
                "backdoor"
            ).any { text.contains(it) } ->
                ResearchType.MALWARE

            listOf(
                "ransomware",
                "secuestro de datos",
                "extorsión"
            ).any { text.contains(it) } ->
                ResearchType.RANSOMWARE

            listOf(
                "grupo hacker",
                "grupo de hackers",
                "actor de amenaza",
                "threat actor",
                "apt",
                "grupo criminal",
                "ciberdelincuente"
            ).any { text.contains(it) } ->
                ResearchType.THREAT_ACTOR

            listOf(
                "campaña",
                "campaign",
                "operación"
            ).any { text.contains(it) } ->
                ResearchType.CAMPAIGN

            listOf(
                "ataque",
                "incidente",
                "brecha",
                "intrusión"
            ).any { text.contains(it) } ->
                ResearchType.INCIDENT

            text.isNotBlank() ->
                ResearchType.GENERAL_CYBER

            else ->
                ResearchType.UNKNOWN
        }
    }
}
