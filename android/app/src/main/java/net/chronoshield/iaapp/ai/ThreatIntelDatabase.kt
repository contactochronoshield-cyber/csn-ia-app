package net.chronoshield.iaapp.ai

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

/**
 * Base SQLite local de inteligencia de amenazas.
 *
 * Los datos permanecen en el dispositivo y pueden consultarse
 * sin conexión posteriormente.
 */
class ThreatIntelDatabase(
    context: Context
) : SQLiteOpenHelper(
    context,
    DATABASE_NAME,
    null,
    DATABASE_VERSION
) {

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(
            """
            CREATE TABLE threat_intel (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                actor TEXT NOT NULL DEFAULT '',
                aliases TEXT NOT NULL DEFAULT '',
                threat_type TEXT NOT NULL DEFAULT '',
                campaign TEXT NOT NULL DEFAULT '',
                malware TEXT NOT NULL DEFAULT '',
                cves TEXT NOT NULL DEFAULT '',
                techniques TEXT NOT NULL DEFAULT '',
                targets TEXT NOT NULL DEFAULT '',
                sectors TEXT NOT NULL DEFAULT '',
                regions TEXT NOT NULL DEFAULT '',
                discovered_at TEXT NOT NULL DEFAULT '',
                updated_at TEXT NOT NULL DEFAULT '',
                source_name TEXT NOT NULL DEFAULT '',
                source_url TEXT NOT NULL DEFAULT '',
                confidence TEXT NOT NULL DEFAULT 'UNKNOWN',
                status TEXT NOT NULL DEFAULT 'UNVERIFIED'
            )
            """.trimIndent()
        )

        db.execSQL(
            """
            CREATE UNIQUE INDEX idx_threat_intel_source_url
            ON threat_intel(source_url)
            WHERE source_url <> ''
            """.trimIndent()
        )
    }

    override fun onUpgrade(
        db: SQLiteDatabase,
        oldVersion: Int,
        newVersion: Int
    ) {
        if (oldVersion < 2) {
            db.execSQL(
                """
                CREATE INDEX IF NOT EXISTS idx_threat_intel_actor
                ON threat_intel(actor)
                """.trimIndent()
            )

            db.execSQL(
                """
                CREATE INDEX IF NOT EXISTS idx_threat_intel_type
                ON threat_intel(threat_type)
                """.trimIndent()
            )
        }
    }

    companion object {
        private const val DATABASE_NAME = "csn_threat_intel.db"
        private const val DATABASE_VERSION = 2
    }
}
