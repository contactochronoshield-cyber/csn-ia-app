package net.chronoshield.iaapp.ai

import android.content.ContentValues
import android.content.Context
import android.database.Cursor

/**
 * Almacenamiento persistente de inteligencia de amenazas.
 *
 * Los registros se conservan en SQLite para poder consultarlos
 * posteriormente incluso sin conexión.
 */
class ThreatIntelStore(context: Context) {

    private val database =
        ThreatIntelDatabase(context.applicationContext)

    @Synchronized
    fun save(record: ThreatIntelRecord) {
        if (record.sourceUrl.isBlank() && record.actor.isBlank()) {
            return
        }

        val values = ContentValues().apply {
            put("actor", record.actor)
            put("aliases", record.aliases.joinToString("|"))
            put("threat_type", record.threatType)
            put("campaign", record.campaign)
            put("malware", record.malware.joinToString("|"))
            put("cves", record.cves.joinToString("|"))
            put("techniques", record.techniques.joinToString("|"))
            put("targets", record.targets.joinToString("|"))
            put("sectors", record.sectors.joinToString("|"))
            put("regions", record.regions.joinToString("|"))
            put("discovered_at", record.discoveredAt)
            put("updated_at", record.updatedAt)
            put("source_name", record.sourceName)
            put("source_url", record.sourceUrl)
            put("confidence", record.confidence.name)
            put("status", record.status.name)
        }

        val db = database.writableDatabase

        if (record.sourceUrl.isNotBlank()) {
            val existing = db.query(
                "threat_intel",
                arrayOf("id"),
                "source_url = ?",
                arrayOf(record.sourceUrl),
                null,
                null,
                null,
                "1"
            )

            existing.use {
                if (it.moveToFirst()) {
                    db.update(
                        "threat_intel",
                        values,
                        "source_url = ?",
                        arrayOf(record.sourceUrl)
                    )
                    return
                }
            }
        }

        db.insert("threat_intel", null, values)
    }

    @Synchronized
    fun saveAll(records: List<ThreatIntelRecord>) {
        records.forEach { save(it) }
    }

    @Synchronized
    fun all(): List<ThreatIntelRecord> {
        return query()
    }

    @Synchronized
    fun findByActor(actor: String): List<ThreatIntelRecord> {
        val query = actor.trim()

        if (query.isBlank()) {
            return emptyList()
        }

        return query(
            selection = """
                actor LIKE ? OR aliases LIKE ?
            """.trimIndent(),
            selectionArgs = arrayOf(
                "%$query%",
                "%$query%"
            )
        )
    }

    @Synchronized
    fun findByMalware(malware: String): List<ThreatIntelRecord> {
        val query = malware.trim()

        if (query.isBlank()) {
            return emptyList()
        }

        return query(
            selection = "malware LIKE ?",
            selectionArgs = arrayOf("%$query%")
        )
    }

    @Synchronized
    fun findByCve(cve: String): List<ThreatIntelRecord> {
        val query = cve.trim()

        if (query.isBlank()) {
            return emptyList()
        }

        return query(
            selection = "cves LIKE ?",
            selectionArgs = arrayOf("%$query%")
        )
    }

    @Synchronized
    fun findByType(type: String): List<ThreatIntelRecord> {
        val query = type.trim()

        if (query.isBlank()) {
            return emptyList()
        }

        return query(
            selection = "threat_type LIKE ?",
            selectionArgs = arrayOf("%$query%")
        )
    }

    @Synchronized
    fun clear() {
        database.writableDatabase.delete(
            "threat_intel",
            null,
            null
        )
    }

    @Synchronized
    fun size(): Int {
        database.readableDatabase.rawQuery(
            "SELECT COUNT(*) FROM threat_intel",
            null
        ).use { cursor ->
            return if (cursor.moveToFirst()) {
                cursor.getInt(0)
            } else {
                0
            }
        }
    }

    private fun query(
        selection: String? = null,
        selectionArgs: Array<String>? = null
    ): List<ThreatIntelRecord> {

        val records = mutableListOf<ThreatIntelRecord>()

        database.readableDatabase.query(
            "threat_intel",
            null,
            selection,
            selectionArgs,
            null,
            null,
            "updated_at DESC"
        ).use { cursor ->

            while (cursor.moveToNext()) {
                records.add(cursor.toThreatIntelRecord())
            }
        }

        return records
    }

    private fun Cursor.getValue(column: String): String {
        val index = getColumnIndexOrThrow(column)
        return getString(index) ?: ""
    }

    private fun Cursor.toThreatIntelRecord(): ThreatIntelRecord {
        return ThreatIntelRecord(
            actor = getValue("actor"),
            aliases = getValue("aliases").splitValues(),
            threatType = getValue("threat_type"),
            campaign = getValue("campaign"),
            malware = getValue("malware").splitValues(),
            cves = getValue("cves").splitValues(),
            techniques = getValue("techniques").splitValues(),
            targets = getValue("targets").splitValues(),
            sectors = getValue("sectors").splitValues(),
            regions = getValue("regions").splitValues(),
            discoveredAt = getValue("discovered_at"),
            updatedAt = getValue("updated_at"),
            sourceName = getValue("source_name"),
            sourceUrl = getValue("source_url"),
            confidence = enumValue(
                getValue("confidence"),
                ConfidenceLevel.UNKNOWN
            ),
            status = enumValue(
                getValue("status"),
                IntelStatus.UNVERIFIED
            )
        )
    }

    private fun String.splitValues(): List<String> {
        if (isBlank()) {
            return emptyList()
        }

        return split("|")
            .map { it.trim() }
            .filter { it.isNotBlank() }
    }

    private inline fun <reified T : Enum<T>> enumValue(
        value: String,
        fallback: T
    ): T {
        return try {
            enumValueOf<T>(value)
        } catch (_: IllegalArgumentException) {
            fallback
        }
    }
}
