package net.chronoshield.iaapp.ai

import java.net.HttpURLConnection
import java.net.URL

class WebResearchEngine {

    fun fetch(urlString: String): String {
        val connection =
            URL(urlString).openConnection() as HttpURLConnection

        connection.requestMethod = "GET"
        connection.connectTimeout = 10000
        connection.readTimeout = 15000
        connection.setRequestProperty(
            "User-Agent",
            "CSN-IA-Threat-Research/0.1"
        )

        return try {
            connection.inputStream.bufferedReader().use {
                it.readText()
            }
        } finally {
            connection.disconnect()
        }
    }
}
