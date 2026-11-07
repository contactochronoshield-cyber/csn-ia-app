package net.chronoshield.iaapp

import android.text.Html
import android.webkit.JavascriptInterface
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLDecoder
import java.net.URLEncoder
import java.util.regex.Pattern

@Suppress("DEPRECATION")
class SearchBridge(private val onResult: (String) -> Unit) {

    companion object {
        // Proveedor intercambiable: cambiar aqui (por ejemplo a un SearXNG propio)
        const val PROVIDER = "https://html.duckduckgo.com/html/"
    }

    @JavascriptInterface
    fun search(query: String) {
        Thread {
            val out = JSONObject()
            try {
                out.put("q", query)
                out.put("r", fetch(query))
                out.put("ok", true)
            } catch (e: Exception) {
                out.put("ok", false)
                out.put("err", e.javaClass.simpleName)
            }
            onResult(out.toString())
        }.start()
    }

    private fun fetch(query: String): JSONArray {
        val conn = URL(PROVIDER).openConnection() as HttpURLConnection
        conn.requestMethod = "POST"
        conn.doOutput = true
        conn.connectTimeout = 10000
        conn.readTimeout = 12000
        conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Android; Mobile) CSN-IA/1.0")
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
        conn.setRequestProperty("Accept-Language", "es")
        val body = "q=" + URLEncoder.encode(query, "UTF-8")
        conn.outputStream.use { it.write(body.toByteArray()) }
        val html = conn.inputStream.bufferedReader().use { it.readText() }
        conn.disconnect()
        return parse(html)
    }

    private fun parse(html: String): JSONArray {
        val links = Pattern.compile("<a([^>]*class=\"result__a\"[^>]*)>(.*?)</a>", Pattern.DOTALL).matcher(html)
        val snips = Pattern.compile("<a[^>]*class=\"result__snippet\"[^>]*>(.*?)</a>", Pattern.DOTALL).matcher(html)
        val hrefPat = Pattern.compile("href=\"([^\"]+)\"")
        val snipList = ArrayList<String>()
        while (snips.find()) {
            snipList.add(clean(snips.group(1) ?: ""))
        }
        val arr = JSONArray()
        var i = 0
        while (links.find() && arr.length() < 10) {
            val idx = i
            i++
            val hm = hrefPat.matcher(links.group(1) ?: "")
            if (!hm.find()) {
                continue
            }
            val url = realUrl(hm.group(1) ?: "")
            if (!url.startsWith("http") || url.contains("duckduckgo.com")) {
                continue
            }
            val o = JSONObject()
            o.put("t", clean(links.group(2) ?: ""))
            o.put("u", url)
            o.put("d", if (idx < snipList.size) snipList[idx] else "")
            arr.put(o)
        }
        return arr
    }

    private fun realUrl(raw: String): String {
        var u = Html.fromHtml(raw).toString()
        val k = u.indexOf("uddg=")
        if (k >= 0) {
            var v = u.substring(k + 5)
            val amp = v.indexOf("&")
            if (amp >= 0) {
                v = v.substring(0, amp)
            }
            u = URLDecoder.decode(v, "UTF-8")
        } else if (u.startsWith("//")) {
            u = "https:" + u
        }
        return u
    }

    private fun clean(s: String): String {
        return Html.fromHtml(s).toString().trim()
    }
}
