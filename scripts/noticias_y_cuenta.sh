#!/data/data/com.termux/files/usr/bin/bash
set -e
A=android/app/src/main/assets
K=android/app/src/main/java/net/chronoshield/iaapp
M=android/app/src/main/AndroidManifest.xml

if ! grep -q 'android.permission.INTERNET' $M; then
  sed -i '0,/<application/s|<application|<uses-permission android:name="android.permission.INTERNET"/>\n    <application|' $M
fi

cat > $K/NewsBridge.kt << 'KT_EOF'
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
KT_EOF

cat > $K/MainActivity.kt << 'KT_EOF'
package net.chronoshield.iaapp

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val w = WebView(this)
        w.settings.javaScriptEnabled = true
        w.settings.domStorageEnabled = true
        w.addJavascriptInterface(NewsBridge(this) {
            runOnUiThread { w.evaluateJavascript("window.newsReady&&newsReady()", null) }
        }, "CSNNews")
        w.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(v: WebView, r: WebResourceRequest): Boolean {
                val s = r.url.scheme
                if (r.isForMainFrame && (s == "http" || s == "https")) {
                    try {
                        startActivity(Intent(Intent.ACTION_VIEW, r.url))
                    } catch (e: Exception) {
                    }
                    return true
                }
                return false
            }
        }
        w.loadUrl("file:///android_asset/chat.html")
        setContentView(w)
    }
}
KT_EOF

cat > $A/noticias.js << 'JS_EOF'
(function(){
var st=document.createElement('style');
st.textContent='nav{overflow-x:auto}nav button{white-space:nowrap;font-size:12px;padding-left:8px;padding-right:8px}.nw{padding:0 16px 24px}.nw h2{font-size:17px;margin:18px 0 4px}.nc{display:block;padding:12px 14px;background:#fff;border:1px solid var(--line);border-radius:14px;margin:10px 0}.nc b{display:block;font-size:15px;line-height:1.35;margin-bottom:4px}.nc i{font-style:normal;font-size:12px;color:#5B6B85}.nr{background:none;border:0;color:#2B5BE6;font-weight:700;font-size:13px;padding:0}';
document.head.appendChild(st);

// Cuenta: de header a la barra, junto a Pro
var nav=document.querySelector('nav');
var all=document.querySelectorAll('button,a,div,span');
var orig=null;
for(var i=0;i<all.length;i++){var e=all[i];if(e.children.length===0&&e.textContent.trim()==='Cuenta'&&!(nav&&nav.contains(e))){orig=e;break}}
if(nav&&orig){
  var nb=document.createElement('button');nb.id='n-cuenta';nb.textContent='Cuenta';
  nb.onclick=function(){orig.click()};
  nav.appendChild(nb);
  orig.style.display='none';
}

// Noticias en Buscar
var host=document.getElementById('t-web');
if(!host)return;
var box=document.createElement('div');box.className='nw';
box.innerHTML='<h2>Noticias de ciberseguridad</h2><button class="nr" id="nrf">Actualizar</button><div id="nl"></div>';
host.appendChild(box);
function ago(d){if(!d)return '';var m=Math.floor((Date.now()-d)/60000);if(m<60)return 'hace '+Math.max(m,1)+' min';var h=Math.floor(m/60);if(h<24)return 'hace '+h+' h';return 'hace '+Math.floor(h/24)+' d'}
function render(){
  var nl=document.getElementById('nl');nl.innerHTML='';
  var items=[];try{items=JSON.parse(window.CSNNews?CSNNews.get():'[]')}catch(e){}
  if(!items.length){nl.textContent=window.CSNNews?'Cargando noticias...':'Las noticias están disponibles en la app.';return}
  items.forEach(function(n){
    var c=document.createElement('div');c.className='nc';
    var b=document.createElement('b');b.textContent=n.t;
    var m=document.createElement('i');m.textContent=n.s+(n.d?' · '+ago(n.d):'');
    c.appendChild(b);c.appendChild(m);
    c.onclick=function(){location.href=n.l};
    nl.appendChild(c);
  });
}
window.newsReady=render;
document.getElementById('nrf').onclick=function(){if(window.CSNNews){CSNNews.refresh()}};
render();
if(window.CSNNews&&Date.now()-CSNNews.lastUpdate()>86400000)CSNNews.refresh();
})();
JS_EOF

F=$A/chat.html
if ! grep -q 'noticias.js' $F; then
  sed -i 's|<script src="conv.js"></script>|<script src="conv.js"></script><script src="noticias.js"></script>|' $F
fi

git add .
git commit -m "Noticias de ciberseguridad en Buscar (RSS, cache diario) y Cuenta junto a Pro"
git push
