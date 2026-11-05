#!/data/data/com.termux/files/usr/bin/bash
set -e
D=android/app/src/main/java/net/chronoshield/iaapp
mkdir -p $D archivo-kt

cat > $D/CsnApp.kt << 'KT_EOF'
package net.chronoshield.iaapp

import android.app.Application
import android.content.Intent
import java.io.PrintWriter
import java.io.StringWriter

class CsnApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Thread.setDefaultUncaughtExceptionHandler { _, e ->
            try {
                val sw = StringWriter()
                e.printStackTrace(PrintWriter(sw))
                val i = Intent(this, CrashActivity::class.java)
                i.putExtra("trace", sw.toString().take(6000))
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                startActivity(i)
                Thread.sleep(600)
            } catch (x: Throwable) {
            }
            android.os.Process.killProcess(android.os.Process.myPid())
            System.exit(10)
        }
    }
}
KT_EOF

cat > $D/CrashActivity.kt << 'KT_EOF'
package net.chronoshield.iaapp

import android.app.Activity
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.graphics.Color
import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast

class CrashActivity : Activity() {
    override fun onCreate(b: Bundle?) {
        super.onCreate(b)
        val trace = intent.getStringExtra("trace") ?: "Sin detalles"
        val col = LinearLayout(this)
        col.orientation = LinearLayout.VERTICAL
        col.setPadding(32, 64, 32, 32)
        col.setBackgroundColor(Color.WHITE)
        val h = TextView(this)
        h.text = "CSN IA se cerró por un error.\nToma captura de esta pantalla o toca Copiar y envíala al equipo de CSN."
        h.textSize = 16f
        h.setTextColor(Color.BLACK)
        val sv = ScrollView(this)
        val tv = TextView(this)
        tv.text = trace
        tv.textSize = 11f
        tv.setTextColor(Color.DKGRAY)
        tv.setTextIsSelectable(true)
        sv.addView(tv)
        val cp = Button(this)
        cp.text = "Copiar error"
        cp.setOnClickListener {
            (getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager).setPrimaryClip(ClipData.newPlainText("error", trace))
            Toast.makeText(this, "Copiado", Toast.LENGTH_SHORT).show()
        }
        val cl = Button(this)
        cl.text = "Cerrar"
        cl.setOnClickListener { finishAffinity() }
        col.addView(h)
        col.addView(sv, LinearLayout.LayoutParams(-1, 0, 1f))
        col.addView(cp)
        col.addView(cl)
        setContentView(col)
    }
}
KT_EOF

cat > $D/MainActivity.kt << 'KT_EOF'
package net.chronoshield.iaapp

import android.annotation.SuppressLint
import android.os.Bundle
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
        w.webViewClient = WebViewClient()
        w.loadUrl("file:///android_asset/chat.html")
        setContentView(w)
    }
}
KT_EOF

# Archivos .kt viejos (intentos anteriores) se apartan, no se borran
for f in $D/*.kt; do
  case "$(basename $f)" in
    MainActivity.kt|CsnApp.kt|CrashActivity.kt) ;;
    *) mv "$f" archivo-kt/ ;;
  esac
done

cat > android/app/src/main/AndroidManifest.xml << 'XML_EOF'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        android:name=".CsnApp"
        android:allowBackup="false"
        android:label="@string/app_name"
        android:icon="@drawable/ic_launcher"
        android:theme="@style/Theme.CSNIA"
        android:usesCleartextTraffic="true">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <activity
            android:name=".CrashActivity"
            android:exported="false"
            android:process=":crash"
            android:theme="@android:style/Theme.Material.Light.NoActionBar" />
    </application>
</manifest>
XML_EOF

cat > android/app/build.gradle << 'GRADLE_EOF'
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace 'net.chronoshield.iaapp'
    compileSdk 34

    defaultConfig {
        applicationId "net.chronoshield.iaapp"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "0.9.1"
    }

    buildTypes {
        release {
            minifyEnabled false
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = '17'
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.core:core-ktx:1.12.0'
}
GRADLE_EOF

git add .
git commit -m "Pantalla de reporte de errores, MainActivity simple y limpieza de codigo viejo"
git push
