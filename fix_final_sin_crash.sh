#!/data/data/com.termux/files/usr/bin/bash
set -e

# Quitar DEL TODO el motor que causa el crash nativo
rm -f android/app/src/main/java/net/chronoshield/iaapp/ChronoLLM.kt

cat > android/app/src/main/java/net/chronoshield/iaapp/MainActivity.kt << 'KOTLIN_EOF'
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
        val webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webViewClient = WebViewClient()
        webView.loadUrl("file:///android_asset/chat.html")
        setContentView(webView)
    }
}
KOTLIN_EOF

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
        versionName "0.7.0"
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

echo "Motor de IA nativo eliminado por completo. build.gradle limpio."
git add .
git commit -m "Eliminar motor MediaPipe por completo (causaba crash nativo) - version estable final" --allow-empty
git push

echo ""
echo "Listo. Esta version NO tiene ninguna libreria nativa riesgosa."
echo "Espera el build verde, desinstala TODO lo anterior, instala esta."
