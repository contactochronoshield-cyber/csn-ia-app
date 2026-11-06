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
    private val sp = ctx.getSharedPreferences("news", Context.MODE_PRIVATE)
    private val feeds = listOf(
        "The Hacker News" to "https://feeds.feedburner.com/TheHackersNews",
        "BleepingComputer" to "https://www.bleepingcomputer.com/feed/",
        "WeLiveSecurity ES" to "https://www.welivesecurity.com/es/feed/",
        "Krebs on Security" to "https://krebsonsecurity.com/feed/"
    )

    @JavascriptInterface
    fun get(): String = sp.getString("items", "[]") ?: "[]"

    @JavascriptInterface
    fun lastUpdate(): Long = sp.getLong("ts", 0L)

    @JavascriptInterface
    fun refresh() {
        Thread {
            val all = ArrayList<JSONObject>()
            for ((name, url) in feeds) {
                try {
                    val c = URL(url).openConnection() as HttpURLConnection
                    c.connectTimeout = 10000
                    c.readTimeout = 10000
                    c.setRequestProperty("User-Agent", "CSN-IA/1.0")
                    all.addAll(parse(name, c.inputStream))
                    c.disconnect()
                } catch (e: Exception) {
                }
            }
            if (all.isNotEmpty()) {
                all.sortByDescending { it.optLong("d") }
                val arr = JSONArray()
                all.take(30).forEach { arr.put(it) }
                sp.edit().putString("items", arr.toString())
                    .putLong("ts", System.currentTimeMillis()).apply()
            }
            onDone()
        }.start()
    }

    private fun ts(s: String): Long {
        val f = arrayOf(
            "EEE, dd MMM yyyy HH:mm:ss Z",
            "EEE, dd MMM yyyy HH:mm:ss zzz",
            "yyyy-MM-dd'T'HH:mm:ssXXX"
        )
        for (x in f) {
            try {
                return SimpleDateFormat(x, Locale.US).parse(s)!!.time
            } catch (e: Exception) {
            }
        }
        return 0L
    }

    private fun parse(src: String, xml: InputStream): List<JSONObject> {
        val out = ArrayList<JSONObject>()
        val p = Xml.newPullParser()
        p.setInput(xml, null)
        var ev = p.eventType
        var inItem = false
        var t = ""
        var l = ""
        var d = ""
        while (ev != XmlPullParser.END_DOCUMENT && out.size < 8) {
            if (ev == XmlPullParser.START_TAG) {
                when (p.name) {
                    "item", "entry" -> { inItem = true; t = ""; l = ""; d = "" }
                    "title" -> if (inItem) t = p.nextText().trim()
                    "link" -> if (inItem) {
                        val h = p.getAttributeValue(null, "href")
                        l = if (h != null) h else p.nextText().trim()
                    }
                    "pubDate", "published", "updated" -> if (inItem) d = p.nextText().trim()
                }
            } else if (ev == XmlPullParser.END_TAG && (p.name == "item" || p.name == "entry")) {
                inItem = false
                if (t.isNotEmpty() && l.startsWith("http")) {
                    out.add(JSONObject().put("s", src).put("t", t).put("l", l).put("d", ts(d)))
                }
            }
            ev = p.next()
        }
        return out
    }
}
