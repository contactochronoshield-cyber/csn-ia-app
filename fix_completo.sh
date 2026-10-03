#!/data/data/com.termux/files/usr/bin/bash
set -e

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
  header { padding: 12px 16px; border-bottom: 1px solid #2a2f2c; background: #0f1214; display: flex; justify-content: space-between; align-items: center; }
  header h1 { font-size: 14px; letter-spacing: 2px; margin: 0; color: #7de08d; }
  #gearBtn { background: none; border: none; color: #9aa39c; font-size: 20px; padding: 4px 8px; }
  #tabs { display: flex; border-bottom: 1px solid #2a2f2c; background: #0d1012; }
  .tabBtn { flex: 1; background: none; border: none; color: #6b756f; padding: 10px; font-size: 11px; letter-spacing: 1px; font-family: monospace; }
  .tabBtn.active { color: #7de08d; border-bottom: 2px solid #7de08d; }
  #chatTab { flex: 1; display: flex; flex-direction: column; min-height: 0; }
  #browseTab { flex: 1; display: none; flex-direction: column; min-height: 0; }
  #messages { flex: 1; overflow-y: auto; padding: 14px 16px; }
  .msg { margin-bottom: 14px; max-width: 85%; padding: 10px 12px; border-radius: 2px; font-size: 13px; line-height: 1.5; }
  .user { margin-left: auto; background: #16221a; border: 1px solid #2f4a38; color: #cfe8d6; }
  .bot { background: #14171a; border: 1px solid #22262a; color: #c7cdc9; }
  #inputRow { display: flex; padding: 10px; border-top: 1px solid #2a2f2c; background: #0f1214; }
  #inputRow input { flex: 1; background: #14171a; border: 1px solid #2a2f2c; color: #d8ddd9; padding: 10px; font-family: monospace; font-size: 13px; }
  #inputRow button { margin-left: 8px; background: #7de08d; color: #0a0c0e; border: none; padding: 0 16px; font-size: 12px; }
  #browseBar { display: flex; padding: 8px; gap: 6px; background: #0f1214; border-bottom: 1px solid #2a2f2c; }
  #browseBar input { flex: 1; background: #14171a; border: 1px solid #2a2f2c; color: #d8ddd9; padding: 8px; font-family: monospace; font-size: 12px; }
  #browseBar button { background: #7de08d; color: #0a0c0e; border: none; padding: 0 14px; font-size: 11px; }
  #browseFrame { flex: 1; border: none; background: #fff; }
  #settingsOverlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 10; }
  #settingsPanel { position: absolute; right: 0; top: 0; bottom: 0; width: 82%; max-width: 320px; background: #0f1214; border-left: 1px solid #2a2f2c; padding: 18px; overflow-y: auto; }
  #settingsPanel h2 { font-size: 14px; letter-spacing: 1px; color: #7de08d; margin: 0 0 16px; }
  .settingItem { padding: 12px 0; border-bottom: 1px solid #1c201d; font-size: 12.5px; color: #c7cdc9; }
  .settingItem .label { color: #6b756f; font-size: 10.5px; text-transform: uppercase; margin-bottom: 3px; }
  .langBtn { background: #14171a; border: 1px solid #2a2f2c; color: #c7cdc9; padding: 6px 12px; font-size: 11px; margin-right: 6px; }
  .langBtn.active { background: #7de08d; color: #0a0c0e; border-color: #7de08d; }
  #closeSettings { background: none; border: 1px solid #2a2f2c; color: #9aa39c; padding: 6px 14px; font-size: 11px; margin-top: 16px; width: 100%; }
</style>
</head>
<body>
  <header>
    <h1>CSN // ASISTENTE</h1>
    <button id="gearBtn" onclick="document.getElementById('settingsOverlay').style.display='block'">&#9881;</button>
  </header>

  <div id="tabs">
    <button class="tabBtn active" id="tabChatBtn" onclick="showTab('chat')">CHAT</button>
    <button class="tabBtn" id="tabBrowseBtn" onclick="showTab('browse')">BUSCAR EN LA WEB</button>
  </div>

  <div id="settingsOverlay" onclick="if(event.target===this) this.style.display='none'">
    <div id="settingsPanel">
      <h2 id="stConfig">CONFIGURACION</h2>
      <div class="settingItem">
        <div class="label" id="stLang">Idioma</div>
        <button class="langBtn active" id="langEsBtn" onclick="setLang('es')">Espanol</button>
        <button class="langBtn" id="langEnBtn" onclick="setLang('en')">English</button>
      </div>
      <div class="settingItem"><div class="label" id="stApp">App</div>CSN IA</div>
      <div class="settingItem"><div class="label" id="stVer">Version</div>0.6.0</div>
      <div class="settingItem"><div class="label" id="stMode">Modo</div><span id="stModeVal">100% local, sin servidores</span></div>
      <div class="settingItem"><div class="label" id="stCo">Empresa</div>Chrono Shield Networks (CSN)</div>
      <button id="closeSettings" onclick="document.getElementById('settingsOverlay').style.display='none'">CERRAR</button>
    </div>
  </div>

  <div id="chatTab">
    <div id="messages"></div>
    <div id="inputRow">
      <input id="userInput" placeholder="Escribe tu pregunta..." />
      <button id="sendBtn" onclick="sendMessage()">ENVIAR</button>
    </div>
  </div>

  <div id="browseTab">
    <div id="browseBar">
      <input id="browseInput" placeholder="Buscar en internet..." />
      <button onclick="doSearch()">IR</button>
    </div>
    <iframe id="browseFrame" src="about:blank"></iframe>
  </div>

<script>
  let lang = 'es';

  function t(es, en) { return lang === 'es' ? es : en; }

  function setLang(l) {
    lang = l;
    document.getElementById('langEsBtn').classList.toggle('active', l === 'es');
    document.getElementById('langEnBtn').classList.toggle('active', l === 'en');
    document.getElementById('stConfig').textContent = t('CONFIGURACION', 'SETTINGS');
    document.getElementById('stLang').textContent = t('Idioma', 'Language');
    document.getElementById('stApp').textContent = t('App', 'App');
    document.getElementById('stVer').textContent = t('Version', 'Version');
    document.getElementById('stMode').textContent = t('Modo', 'Mode');
    document.getElementById('stModeVal').textContent = t('100% local, sin servidores', '100% local, no servers');
    document.getElementById('stCo').textContent = t('Empresa', 'Company');
    document.getElementById('userInput').placeholder = t('Escribe tu pregunta...', 'Type your question...');
    document.getElementById('sendBtn').textContent = t('ENVIAR', 'SEND');
    document.getElementById('tabChatBtn').textContent = t('CHAT', 'CHAT');
    document.getElementById('tabBrowseBtn').textContent = t('BUSCAR EN LA WEB', 'SEARCH THE WEB');
  }

  function showTab(tab) {
    document.getElementById('chatTab').style.display = tab === 'chat' ? 'flex' : 'none';
    document.getElementById('browseTab').style.display = tab === 'browse' ? 'flex' : 'none';
    document.getElementById('tabChatBtn').classList.toggle('active', tab === 'chat');
    document.getElementById('tabBrowseBtn').classList.toggle('active', tab === 'browse');
  }

  function doSearch() {
    const q = document.getElementById('browseInput').value.trim();
    if (!q) return;
    document.getElementById('browseFrame').src = 'https://lite.duckduckgo.com/lite/?q=' + encodeURIComponent(q);
  }
  document.getElementById('browseInput').addEventListener('keypress', function(e) { if (e.key === 'Enter') doSearch(); });

  // Base de conocimiento completa de CSN, bilingue (es/en)
  const KB = [
    { keys: ["hola","buenas","buenos dias","buenas tardes","buenas noches","que tal","hey","saludos","hello","hi","good morning","good afternoon"],
      es: "Hola! Soy el asistente de CSN. Preguntame sobre la red privada, el Mesh Node, Sentinel, el Cloud Sovereign, o cualquiera de nuestros servicios.",
      en: "Hi! I'm the CSN assistant. Ask me about our private network, the Mesh Node, Sentinel, Cloud Sovereign, or any of our services." },
    { keys: ["adios","chao","hasta luego","nos vemos","bye","goodbye","see you"],
      es: "Hasta pronto! Si vuelves a tener dudas, aqui estare.",
      en: "See you soon! If you have more questions, I'm here." },
    { keys: ["gracias","thanks","thank you","listo","perfecto"],
      es: "Con gusto. Si te surge otra duda, aqui estoy.",
      en: "You're welcome. Let me know if you have more questions." },
    { keys: ["red privada","que es una red","vpn","private network","what is a private network"],
      es: "Una red privada es un pasillo cifrado entre tus dispositivos que nadie mas puede ver ni usar. Con el Chrono Mesh Node te conectas a tus camaras, computadores o servidores desde cualquier lugar, de forma segura.",
      en: "A private network is an encrypted tunnel between your devices that no one else can see or use. With the Chrono Mesh Node you connect to your cameras, computers or servers from anywhere, securely." },
    { keys: ["mesh node","nodo mesh","hardware","placa","mesh node price","precio mesh node"],
      es: "El Chrono Mesh Node es nuestro dispositivo fisico (placa con antena externa). Cuesta 169.000 COP, incluye el software listo para usar y un video guia en YouTube. Se vende en Mercado Libre. Es la puerta de entrada a tu red privada.",
      en: "The Chrono Mesh Node is our physical device (board with external antenna). It costs 169,000 COP, includes ready-to-use software and a YouTube guide video. Sold on Mercado Libre. It's the gateway into your private network." },
    { keys: ["como activo el mesh node","como configuro el mesh node","como uso el mesh node","how to activate mesh node","how to set up mesh node"],
      es: "Para activar el Mesh Node: conectalo a tu red local con el cable incluido, abre la app o sigue el video guia de YouTube que viene con la compra, y escanea el codigo QR para generar tu primera conexion WireGuard. En minutos tu red privada queda activa.",
      en: "To activate the Mesh Node: connect it to your local network with the included cable, open the app or follow the YouTube guide video included with your purchase, and scan the QR code to generate your first WireGuard connection. Your private network is active in minutes." },
    { keys: ["sentinel","monitoreo","vigilar","alertas","civic assistant","wisp","evil twin"],
      es: "Chrono Sentinel es nuestra app de monitoreo multi-nodo: detecta cambios de SIM, redes Wi-Fi falsas (Evil Twin), degradacion de enlace, y manda alertas por Telegram o notificaciones push. Tiene version PRO via Gumroad. Esta en GitHub y pronto en Google Play.",
      en: "Chrono Sentinel is our multi-node monitoring app: detects SIM swaps, fake Wi-Fi networks (Evil Twin), link degradation, and sends alerts via Telegram or push notifications. Has a PRO tier via Gumroad. Available on GitHub, coming soon to Google Play." },
    { keys: ["cloud sovereign","cloud soberano","chrono cloud","sovereign cloud","nuestro cloud"],
      es: "Chrono Cloud Sovereign es nuestro cloud propio, alternativa a AWS/Azure/Google Cloud pero operado localmente, bajo jurisdiccion propia. Tiene tres planes de precio. Es nuestro primer producto de ingresos.",
      en: "Chrono Cloud Sovereign is our own cloud, an alternative to AWS/Azure/Google Cloud but operated locally under our own jurisdiction. It has three pricing tiers. It's our first revenue product." },
    { keys: ["guardian","aap","deteccion de anomalias","ataques fisicos","acoustic"],
      es: "Chrono Guardian detecta comportamientos anomalos en un dispositivo. AAP (Acoustic Anomaly Protocol) detecta ataques fisicos a infraestructura analizando sonido, sin necesidad de inteligencia artificial. Ambos son open source.",
      en: "Chrono Guardian detects anomalous behavior on a device. AAP (Acoustic Anomaly Protocol) detects physical attacks on infrastructure by analyzing sound, no AI required. Both are open source." },
    { keys: ["orbital","satelital","failover","multi operador","sim manager"],
      es: "Chrono Orbital es nuestra iniciativa de conectividad satelital y multi-operador: mantiene un dispositivo conectado aunque falle su conexion principal (4G, fibra), cambiando automaticamente a otra via.",
      en: "Chrono Orbital is our satellite and multi-operator connectivity initiative: keeps a device connected even if its main connection fails (4G, fiber), automatically switching to another path." },
    { keys: ["vortex","banco digital","pagos","liquidacion p2p"],
      es: "Vortex Banco Digital es nuestro gateway de liquidacion de pagos P2P, conectado a nuestro propio ledger en Bogota.",
      en: "Vortex Digital Bank is our P2P payment settlement gateway, connected to our own ledger in Bogota." },
    { keys: ["wireguard","activar vpn","conectar vpn","configurar vpn"],
      es: "WireGuard es la tecnologia detras del tunel cifrado de nuestra red privada. Con el Mesh Node configurado, escaneas un codigo QR desde la app y quedas conectado en segundos.",
      en: "WireGuard is the technology behind the encrypted tunnel of our private network. With the Mesh Node set up, you scan a QR code from the app and you're connected in seconds." },
    { keys: ["soberania","soberano","por que csn","independencia","sovereignty","why csn"],
      es: "Soberania digital significa que tus datos no dependen de servidores de otros paises ni de empresas extranjeras que pueden subir precios o cortar el servicio. Con CSN, todo corre en infraestructura propia.",
      en: "Digital sovereignty means your data doesn't depend on foreign servers or companies that can raise prices or cut service. With CSN, everything runs on our own infrastructure." },
    { keys: ["precio","costo","cuanto vale","comprar","price","cost","how much"],
      es: "El Chrono Mesh Node cuesta 169.000 COP y se compra en Mercado Libre. Chrono Cloud Sovereign tiene tres planes distintos; escribenos para precios exactos segun lo que necesites.",
      en: "The Chrono Mesh Node costs 169,000 COP, available on Mercado Libre. Chrono Cloud Sovereign has three pricing tiers; contact us for exact pricing based on your needs." },
    { keys: ["productos","servicios","que ofrecen","que hace csn","products","services","what does csn do"],
      es: "CSN ofrece: red privada/mesh con el Chrono Mesh Node, Chrono Sentinel (monitoreo), Chrono Cloud Sovereign (cloud propio), Chrono Guardian y AAP (seguridad), Chrono Orbital (conectividad satelital), y Vortex (pagos P2P). Todo bajo el principio de soberania digital.",
      en: "CSN offers: private/mesh networking with the Chrono Mesh Node, Chrono Sentinel (monitoring), Chrono Cloud Sovereign (our own cloud), Chrono Guardian and AAP (security), Chrono Orbital (satellite connectivity), and Vortex (P2P payments). All under the principle of digital sovereignty." },
    { keys: ["problema","no funciona","ayuda","error","help","not working","issue"],
      es: "Cuentame que producto estas usando (Mesh Node, Sentinel, Cloud) y que te esta fallando exactamente, para ayudarte mejor.",
      en: "Tell me which product you're using (Mesh Node, Sentinel, Cloud) and exactly what's failing, so I can help you better." }
  ];

  const FALLBACK_ES = "No tengo informacion especifica sobre eso todavia. Puedo contarte sobre el Mesh Node, Sentinel, Cloud Sovereign, Guardian, Orbital o Vortex. Tambien puedes usar la pestana BUSCAR EN LA WEB arriba.";
  const FALLBACK_EN = "I don't have specific info on that yet. I can tell you about the Mesh Node, Sentinel, Cloud Sovereign, Guardian, Orbital or Vortex. You can also use the SEARCH THE WEB tab above.";

  function normalize(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, "").trim();
  }

  function detectLang(text) {
    const en = ["the","what","how","is","are","price","help","hello","hi "];
    const t = " " + text.toLowerCase() + " ";
    let hits = 0;
    en.forEach(w => { if (t.includes(" " + w)) hits++; });
    return hits >= 1 ? 'en' : 'es';
  }

  function findAnswer(rawText) {
    const text = normalize(rawText);
    if (!text) return lang === 'es' ? FALLBACK_ES : FALLBACK_EN;
    let best = null, bestScore = 0;
    for (const item of KB) {
      let score = 0;
      for (const key of item.keys) {
        if (text.includes(normalize(key))) score += key.split(" ").length;
      }
      if (score > bestScore) { bestScore = score; best = item; }
    }
    if (!best) return lang === 'es' ? FALLBACK_ES : FALLBACK_EN;
    return lang === 'es' ? best.es : best.en;
  }

  const messagesEl = document.getElementById('messages');
  const inputEl = document.getElementById('userInput');

  function addMessage(text, who) {
    const div = document.createElement('div');
    div.className = 'msg ' + who;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    const detected = detectLang(text);
    if (detected !== lang) setLang(detected);
    addMessage(text, 'user');
    inputEl.value = '';
    setTimeout(() => addMessage(findAnswer(text), 'bot'), 200);
  }

  inputEl.addEventListener('keypress', function(e) { if (e.key === 'Enter') sendMessage(); });
  addMessage('Hola, soy el asistente de CSN. Preguntame sobre cualquiera de nuestros servicios, o usa la pestana de busqueda arriba.', 'bot');
</script>
</body>
</html>
HTML_EOF

echo "App completa: conocimiento de todos los productos, bilingue, navegador de busqueda, menu profesional."
git add .
git commit -m "Base de conocimiento completa bilingue + navegador de busqueda + menu profesional"
git push

echo ""
echo "Listo. Build en Actions, desinstala la vieja, instala la nueva."
