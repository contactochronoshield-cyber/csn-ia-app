package net.chronoshield.iaapp

import android.content.Context
import android.util.Xml
import android.webkit.JavascriptInterface
import org.json.JSONArray
import org.json.JSONObject
import org.xmlpull.v1.XmlPullParser
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Locale

class NewsBridge(ctx: Context, private val onDone: () -> Unit) {

    private val prefs = ctx.getSharedPreferences("news", Context.MODE_PRIVATE)

    private val feeds = listOf(
        Pair("The Hacker News", "https://feeds.feedburner.com/TheHackersNews"),
        Pair("BleepingComputer", "https://www.bleepingcomputer.com/feed/"),
        Pair("WeLiveSecurity ES", "https://www.welivesecurity.com/es/feed/"),
        Pair("Krebs on Security", "https://krebsonsecurity.com/feed/")
    )

    @JavascriptInterface
    fun get(): String {
        return prefs.getString("items", "[]") ?: "[]"
    }

    @JavascriptInterface
    fun lastUpdate(): Long {
        return prefs.getLong("ts", 0L)
    }

    @JavascriptInterface
    fun refresh() {
        Thread {
            val all = ArrayList<JSONObject>()
            for (feed in feeds) {
                try {
                    val conn = URL(feed.second).openConnection() as HttpURLConnection
                    conn.connectTimeout = 10000
                    conn.readTimeout = 10000
                    conn.setRequestProperty("User-Agent", "CSN-IA/1.0")
                    val items = parse(feed.first, conn.inputStream)
                    all.addAll(items)
                    conn.disconnect()
                } catch (e: Exception) {
                    // una fuente caida no debe tumbar las demas
                }
            }
            if (all.isNotEmpty()) {
                val sorted = all.sortedByDescending { it.optLong("d") }
                val arr = JSONArray()
                for (o in sorted.take(30)) {
                    arr.put(o)
                }
                prefs.edit()
                    .putString("items", arr.toString())
                    .putLong("ts", System.currentTimeMillis())
                    .apply()
            }
            onDone()
        }.start()
    }

    private fun toMillis(s: String): Long {
        val formats = arrayOf(
            "EEE, dd MMM yyyy HH:mm:ss Z",
            "EEE, dd MMM yyyy HH:mm:ss zzz",
            "yyyy-MM-dd'T'HH:mm:ssXXX"
        )
        for (f in formats) {
            try {
                val d = SimpleDateFormat(f, Locale.US).parse(s)
                if (d != null) {
                    return d.time
                }
            } catch (e: Exception) {
                // probar el siguiente formato
            }
        }
        return 0L
    }

    private fun parse(src: String, stream: InputStream): List<JSONObject> {
        val out = ArrayList<JSONObject>()
        val p = Xml.newPullParser()
        p.setInput(stream, null)
        var inItem = false
        var title = ""
        var link = ""
        var date = ""
        var ev = p.eventType
        while (ev != XmlPullParser.END_DOCUMENT && out.size < 8) {
            if (ev == XmlPullParser.START_TAG) {
                val name = p.name
                if (name == "item" || name == "entry") {
                    inItem = true
                    title = ""
                    link = ""
                    date = ""
                } else if (inItem && name == "title") {
                    title = p.nextText().trim()
                } else if (inItem && name == "link") {
                    val href = p.getAttributeValue(null, "href")
                    if (href != null && href.isNotEmpty()) {
                        if (link.isEmpty()) {
                            link = href
                        }
                    } else {
                        link = p.nextText().trim()
                    }
                } else if (inItem && (name == "pubDate" || name == "published" || name == "updated")) {
                    date = p.nextText().trim()
                }
            } else if (ev == XmlPullParser.END_TAG) {
                val name = p.name
                if (name == "item" || name == "entry") {
                    inItem = false
                    if (title.isNotEmpty() && link.startsWith("http")) {
                        val o = JSONObject()
                        o.put("s", src)
                        o.put("t", title)
                        o.put("l", link)
                        o.put("d", toMillis(date))
                        out.add(o)
                    }
                }
            }
            ev = p.next()
        }
        return out
    }
}
