package net.chronoshield.iaapp.ai

/**
 * Registro normalizado de inteligencia de amenazas.
 *
 * El registro distingue información confirmada de
 * información reportada o no verificada.
 */
data class ThreatIntelRecord(
    val actor: String = "",
    val aliases: List<String> = emptyList(),
    val threatType: String = "",
    val campaign: String = "",
    val malware: List<String> = emptyList(),
    val cves: List<String> = emptyList(),
    val techniques: List<String> = emptyList(),
    val targets: List<String> = emptyList(),
    val sectors: List<String> = emptyList(),
    val regions: List<String> = emptyList(),
    val discoveredAt: String = "",
    val updatedAt: String = "",
    val sourceName: String = "",
    val sourceUrl: String = "",
    val confidence: ConfidenceLevel = ConfidenceLevel.UNKNOWN,
    val status: IntelStatus = IntelStatus.UNVERIFIED
)

enum class IntelStatus {
    CONFIRMED,
    REPORTED,
    PROBABLE,
    UNVERIFIED
}

enum class ConfidenceLevel {
    HIGH,
    MEDIUM,
    LOW,
    UNKNOWN
)
