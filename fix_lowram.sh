#!/data/data/com.termux/files/usr/bin/bash
set -e

cat > android/app/src/main/java/net/chronoshield/iaapp/MainActivity.kt << 'KOTLIN_EOF'
package net.chronoshield.iaapp

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.io.File
import java.io.PrintWriter
import java.io.StringWriter

class MainActivity : AppCompatActivity() {

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val defaultHandler = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            try {
                val sw = StringWriter()
                throwable.printStackTrace(PrintWriter(sw))
                File(getExternalFilesDir(null), "crash_log.txt").writeText(sw.toString())
            } catch (e: Exception) {
            }
            defaultHandler?.uncaughtException(thread, throwable)
        }

        try {
            val webView = WebView(this)
            // Ajustes para telefonos de poca RAM (Android Go / 2GB):
            webView.settings.javaScriptEnabled = true
            webView.settings.domStorageEnabled = true
            webView.settings.cacheMode = WebSettings.LOAD_NO_CACHE
            webView.settings.setRenderPriority(WebSettings.RenderPriority.LOW)
            webView.setLayerType(android.view.View.LAYER_TYPE_SOFTWARE, null)
            webView.webViewClient = WebViewClient()
            webView.loadUrl("file:///android_asset/chat.html")
            setContentView(webView)
        } catch (e: Throwable) {
            val sw = StringWriter()
            e.printStackTrace(PrintWriter(sw))
            try { File(getExternalFilesDir(null), "crash_log.txt").writeText(sw.toString()) } catch (ex: Exception) {}
            val tv = TextView(this)
            tv.text = "Error al iniciar:\n\n" + e.toString()
            tv.setPadding(40, 100, 40, 40)
            tv.textSize = 12f
            setContentView(tv)
        }
    }
}
KOTLIN_EOF

# largeHeap: le pide a Android mas memoria permitida para esta app especifica
cat > android/app/src/main/AndroidManifest.xml << 'MANIFEST_EOF'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="false"
        android:label="@string/app_name"
        android:icon="@drawable/ic_launcher"
        android:theme="@style/Theme.CSNIA"
        android:largeHeap="true"
        android:hardwareAccelerated="false"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
MANIFEST_EOF

echo "App optimizada para RAM baja (largeHeap, sin aceleracion por hardware, cache minimo)."
git add .
git commit -m "Optimizar para dispositivos de RAM baja / Android Go (largeHeap, sin hw accel)" --allow-empty
git push

echo ""
echo "Listo. Carga el telefono arriba de 50%, desactiva ahorro de bateria,"
echo "espera el build verde, desinstala TODO, instala este."
