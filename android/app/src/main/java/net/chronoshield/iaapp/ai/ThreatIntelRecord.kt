package net.chronoshield.iaapp.ai

data class ThreatIntelRecord(
    val title: String,
    val description: String,
    val source: String,
    val url: String,
    val publishedAt: String = "",
    val observedAt: String = "",
    val confidence: String = "unknown"
)
