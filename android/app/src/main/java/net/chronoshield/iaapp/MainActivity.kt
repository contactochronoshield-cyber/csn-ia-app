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
