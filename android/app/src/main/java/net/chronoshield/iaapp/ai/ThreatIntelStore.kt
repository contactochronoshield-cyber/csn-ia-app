package net.chronoshield.iaapp.ai

/**
 * Almacenamiento local de inteligencia de amenazas.
 *
 * Mantiene los registros obtenidos durante investigaciones
 * para que CSN IA pueda utilizarlos posteriormente incluso
 * sin conexión.
 */
class ThreatIntelStore {

    private val records = mutableListOf<ThreatIntelRecord>()

    @Synchronized
    fun save(record: ThreatIntelRecord) {
        if (record.sourceUrl.isBlank() && record.actor.isBlank()) {
            return
        }

        val duplicate = records.any {
            it.sourceUrl == record.sourceUrl &&
            it.sourceUrl.isNotBlank()
        }

        if (!duplicate) {
            records.add(record)
        }
    }

    @Synchronized
    fun saveAll(newRecords: List<ThreatIntelRecord>) {
        newRecords.forEach { save(it) }
    }

    @Synchronized
    fun all(): List<ThreatIntelRecord> {
        return records.toList()
    }

    @Synchronized
    fun findByActor(actor: String): List<ThreatIntelRecord> {
        val query = actor.trim().lowercase()

        return records.filter {
            it.actor.lowercase().contains(query) ||
            it.aliases.any { alias ->
                alias.lowercase().contains(query)
            }
        }
    }

    @Synchronized
    fun findByMalware(malware: String): List<ThreatIntelRecord> {
        val query = malware.trim().lowercase()

        return records.filter {
            it.malware.any { name ->
                name.lowercase().contains(query)
            }
        }
    }

    @Synchronized
    fun findByCve(cve: String): List<ThreatIntelRecord> {
        val query = cve.trim().lowercase()

        return records.filter {
            it.cves.any { value ->
                value.lowercase() == query
            }
        }
    }

    @Synchronized
    fun findByType(type: String): List<ThreatIntelRecord> {
        val query = type.trim().lowercase()

        return records.filter {
            it.threatType.lowercase().contains(query)
        }
    }

    @Synchronized
    fun clear() {
        records.clear()
    }

    @Synchronized
    fun size(): Int {
        return records.size
    }
}
