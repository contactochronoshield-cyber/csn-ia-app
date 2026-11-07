#!/data/data/com.termux/files/usr/bin/bash
# fix_real_ai.sh
set -e

mkdir -p android/app/src/main/java/net/chronoshield/iaapp

cat > android/app/src/main/java/net/chronoshield/iaapp/ChronoLLM.kt << 'KOTLIN_EOF'
package net.chronoshield.iaapp

import android.content.Context
import android.util.Log
import com.google.mediapipe.tasks.genai.llminference.LlmInference
import com.google.mediapipe.tasks.genai.llminference.LlmInference.LlmInferenceOptions
import java.io.File
import java.net.URL

class ChronoLLM(private val context: Context) {

    companion object {
        private const val MODEL_FILENAME = "chrono-model.task"
        private const val MODEL_URL =
            "https://storage.googleapis.com/mediapipe-models/llm_inference/gemma2-2b-it-cpu-int8/gemma2-2b-it-cpu-int8.task"
    }

    private var llmInference: LlmInference? = null

    private val modelFile: File
        get() = File(context.filesDir, MODEL_FILENAME)

    fun isModelDownloaded(): Boolean = modelFile.exists() && modelFile.length() > 0
    fun isLoaded(): Boolean = llmInference != null

    fun downloadModel(onProgress: (Int) -> Unit, onDone: (Boolean) -> Unit) {
        Thread {
            try {
                val connection = URL(MODEL_URL).openConnection()
                val totalSize = connection.contentLength
                connection.getInputStream().use { input ->
                    modelFile.outputStream().use { output ->
                        val buffer = ByteArray(8192)
                        var downloaded = 0
                        var bytes = input.read(buffer)
                        while (bytes >= 0) {
                            output.write(buffer, 0, bytes)
                            downloaded += bytes
                            if (totalSize > 0) onProgress((downloaded * 100L / totalSize).toInt())
                            bytes = input.read(buffer)
                        }
                    }
                }
                onDone(true)
            } catch (e: Exception) {
                Log.e("ChronoLLM", "Error descargando modelo", e)
                modelFile.delete()
                onDone(false)
            }
        }.start()
    }

    fun load() {
        if (llmInference != null) return
        val options = LlmInferenceOptions.builder()
            .setModelPath(modelFile.absolutePath)
            .setMaxTokens(512)
            .build()
        llmInference = LlmInference.createFromOptions(context, options)
    }

    fun generate(prompt: String): String {
        val engine = llmInference ?: throw IllegalStateException("Modelo no cargado")
        val fullPrompt = """
            Eres el asistente de Chrono Shield Networks (CSN). Explicas en lenguaje simple,
            sin jerga tecnica, que son los servicios de CSN: redes privadas/mesh, el Chrono Mesh Node,
            Chrono Sentinel, y el cloud soberano. Se claro, breve y cercano.

            Pregunta: $prompt
            Respuesta:
        """.trimIndent()
        return engine.generateResponse(fullPrompt)
    }
}
KOTLIN_EOF

cat > android/app/src/main/java/net/chronoshield/iaapp/MainActivity.kt << 'KOTLIN_EOF'
package net.chronoshield.iaapp

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var llm: ChronoLLM

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        llm = ChronoLLM(applicationContext)

        webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webViewClient = WebViewClient()
        webView.addJavascriptInterface(Bridge(), "AndroidBridge")
        webView.loadUrl("file:///android_asset/chat.html")

        setContentView(webView)
    }

    inner class Bridge {

        @JavascriptInterface
        fun isModelReady(): Boolean = llm.isModelDownloaded()

        @JavascriptInterface
        fun downloadModel() {
            llm.downloadModel(
                onProgress = { pct ->
                    runOnUiThread { webView.evaluateJavascript("onDownloadProgress($pct)", null) }
                },
                onDone = { success ->
                    runOnUiThread {
                        var ok = success
                        if (success) {
                            try { llm.load() } catch (e: Exception) { ok = false }
                        }
                        webView.evaluateJavascript("onDownloadDone($ok)", null)
                    }
                }
            )
        }

        @JavascriptInterface
        fun askQuestion(question: String, requestId: String) {
            Thread {
                val answer = try {
                    if (!llm.isLoaded()) llm.load()
                    llm.generate(question)
                } catch (e: Exception) {
                    "Hubo un error generando la respuesta local: " + (e.message ?: "desconocido")
                }
                val safe = answer.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
                runOnUiThread { webView.evaluateJavascript("onAnswer('$requestId', '$safe')", null) }
            }.start()
        }
    }
}
KOTLIN_EOF

cat > android/app/src/main/assets/chat.html << 'HTML_EOF'
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>CSN IA</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; background: #0a0c0e; color: #d8ddd9; font-family: monospace; display: flex; flex-direction: column; height: 100vh; }
  header { padding: 14px 16px; border-bottom: 1px solid #2a2f2c; background: #0f1214; display: flex; justify-content: space-between; align-items: center; }
  header h1 { font-size: 15px; letter-spacing: 2px; margin: 0; color: #7de08d; }
  header p { margin: 4px 0 0; font-size: 11px; color: #6b756f; }
  #gearBtn { background: none; border: none; color: #9aa39c; font-size: 20px; padding: 4px 8px; }
  #messages { flex: 1; overflow-y: auto; padding: 14px 16px; }
  .msg { margin-bottom: 14px; max-width: 85%; padding: 10px 12px; border-radius: 2px; font-size: 13px; line-height: 1.5; }
  .user { margin-left: auto; background: #16221a; border: 1px solid #2f4a38; color: #cfe8d6; }
  .bot { background: #14171a; border: 1px solid #22262a; color: #c7cdc9; }
  #inputRow { display: flex; padding: 10px; border-top: 1px solid #2a2f2c; background: #0f1214; }
  #inputRow input { flex: 1; background: #14171a; border: 1px solid #2a2f2c; color: #d8ddd9; padding: 10px; font-family: monospace; font-size: 13px; }
  #inputRow button { margin-left: 8px; background: #7de08d; color: #0a0c0e; border: none; padding: 0 16px; font-size: 12px; letter-spacing: 1px; }
  #inputRow button:disabled { opacity: 0.4; }

  #settingsOverlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 10; }
  #settingsPanel { position: absolute; right: 0; top: 0; bottom: 0; width: 82%; max-width: 320px; background: #0f1214; border-left: 1px solid #2a2f2c; padding: 18px; overflow-y: auto; }
  #settingsPanel h2 { font-size: 14px; letter-spacing: 1px; color: #7de08d; margin: 0 0 16px; }
  .settingItem { padding: 12px 0; border-bottom: 1px solid #1c201d; font-size: 12.5px; color: #c7cdc9; }
  .settingItem .label { color: #6b756f; font-size: 10.5px; text-transform: uppercase; margin-bottom: 3px; }
  #closeSettings { background: none; border: 1px solid #2a2f2c; color: #9aa39c; padding: 6px 14px; font-size: 11px; margin-top: 16px; width: 100%; }

  #downloadScreen { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; text-align: center; }
  #downloadScreen p { font-size: 12.5px; color: #9aa39c; margin: 8px 0; }
  #progressBarBg { width: 100%; max-width: 260px; height: 8px; background: #1c201d; margin: 16px 0; }
  #progressBarFill { height: 100%; width: 0%; background: #7de08d; }
  #downloadBtn { background: #7de08d; color: #0a0c0e; border: none; padding: 10px 20px; font-size: 12px; letter-spacing: 1px; margin-top: 12px; }
</style>
</head>
<body>
  <header>
    <div>
      <h1>CSN // ASISTENTE</h1>
      <p>IA local, sin servidor</p>
    </div>
    <button id="gearBtn" onclick="document.getElementById('settingsOverlay').style.display='block'">&#9881;</button>
  </header>

  <div id="settingsOverlay" onclick="if(event.target===this) this.style.display='none'">
    <div id="settingsPanel">
      <h2>CONFIGURACION</h2>
      <div class="settingItem"><div class="label">App</div>CSN IA</div>
      <div class="settingItem"><div class="label">Version</div>0.4.0</div>
      <div class="settingItem"><div class="label">Modelo</div>Gemma 2 (2B), corriendo local en el dispositivo</div>
      <div class="settingItem"><div class="label">Empresa</div>Chrono Shield Networks (CSN)</div>
      <div class="settingItem"><div class="label">Privacidad</div>Ninguna conversacion sale de este telefono</div>
      <button id="closeSettings" onclick="document.getElementById('settingsOverlay').style.display='none'">CERRAR</button>
    </div>
  </div>

  <div id="downloadScreen">
    <p><b>Preparando el asistente de IA</b></p>
    <p>Se descarga una sola vez (~1.2GB). Necesitas wifi.</p>
    <div id="progressBarBg"><div id="progressBarFill"></div></div>
    <p id="progressText">0%</p>
    <button id="downloadBtn" onclick="startDownload()">DESCARGAR AHORA</button>
  </div>

  <div id="chatScreen" style="display:none; flex-direction:column; flex:1; min-height:0;">
    <div id="messages"></div>
    <div id="inputRow">
      <input id="userInput" placeholder="Escribe tu pregunta..." />
      <button id="sendBtn" onclick="sendMessage()">ENVIAR</button>
    </div>
  </div>

<script>
  const messagesEl = document.getElementById('messages');
  const inputEl = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  let reqCounter = 0;
  const pending = {};

  function showChat() {
    document.getElementById('downloadScreen').style.display = 'none';
    document.getElementById('chatScreen').style.display = 'flex';
    addMessage('Hola, soy el asistente de CSN. Preguntame lo que quieras sobre nuestros servicios.', 'bot');
  }

  function addMessage(text, who) {
    const div = document.createElement('div');
    div.className = 'msg ' + who;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    inputEl.value = '';
    const thinking = addMessage('Pensando...', 'bot');
    const id = 'r' + (reqCounter++);
    pending[id] = thinking;
    sendBtn.disabled = true;
    try {
      AndroidBridge.askQuestion(text, id);
    } catch (e) {
      thinking.textContent = 'Error: no se pudo conectar con el motor de IA local.';
      sendBtn.disabled = false;
    }
  }

  function onAnswer(id, text) {
    const el = pending[id];
    if (el) el.textContent = text;
    delete pending[id];
    sendBtn.disabled = false;
  }

  function startDownload() {
    document.getElementById('downloadBtn').style.display = 'none';
    try {
      AndroidBridge.downloadModel();
    } catch (e) {
      document.getElementById('progressText').textContent = 'Error: motor de IA no disponible en este dispositivo.';
    }
  }

  function onDownloadProgress(pct) {
    document.getElementById('progressBarFill').style.width = pct + '%';
    document.getElementById('progressText').textContent = pct + '%';
  }

  function onDownloadDone(success) {
    if (success) {
      showChat();
    } else {
      document.getElementById('progressText').textContent = 'Fallo la descarga. Verifica tu wifi e intenta de nuevo.';
      document.getElementById('downloadBtn').style.display = 'inline-block';
    }
  }

  inputEl.addEventListener('keypress', function(e) { if (e.key === 'Enter') sendMessage(); });

  window.onload = function() {
    try {
      if (AndroidBridge.isModelReady()) {
        showChat();
      }
    } catch (e) {
      document.getElementById('progressText').textContent = 'Este dispositivo no soporta el motor de IA local.';
    }
  };
</script>
</body>
</html>
HTML_EOF

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
        versionName "0.4.0"
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
    implementation 'com.google.mediapipe:tasks-genai:0.10.14'
}
GRADLE_EOF

echo "Motor de IA real instalado y conectado."
git add .
git commit -m "IA real on-device (MediaPipe) conectada a la interfaz, con descarga y menu"
git push

echo ""
echo "Listo. Revisa Actions. Si falla, necesito la captura del paso rojo -- esta vez es codigo real, no un placeholder."
