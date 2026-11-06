#!/data/data/com.termux/files/usr/bin/bash
# Uso: bash conversacion_y_pro.sh [enlace de pago de PayPal]
set -e
PP="${1:-}"
A=android/app/src/main/assets
mkdir -p $A

cat > $A/conv.js << 'JS_EOF'
(function(){
var SYN={compania:'empresa',firma:'empresa',organizacion:'empresa',costo:'precio',costos:'precio',cuesta:'precio',valor:'precio',tarifa:'precio',telefono:'celular',movil:'celular',computadora:'computador',ordenador:'computador',pc:'computador',portatil:'computador'};
function T(r){return N(r).split(' ').map(function(w){return SYN[w]||w}).join(' ')}
function ed(a,b){var d=[],i,j;for(i=0;i<=a.length;i++)d[i]=[i];for(j=1;j<=b.length;j++)d[0][j]=j;for(i=1;i<=a.length;i++)for(j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
function fz(t,k){if(k.indexOf(' ')>-1||k.length<6)return false;var w=t.split(' ');for(var i=0;i<w.length;i++){if(Math.abs(w[i].length-k.length)<=1&&ed(w[i],k)<=1)return true}return false}
function score(e,t){var s=0;e.k.forEach(function(k){if(has(t,k))s+=k.length;else if(fz(t,k))s+=k.length-1});return s}
function pick(a){return typeof a==='function'?a():Array.isArray(a)?a[Math.floor(Math.random()*a.length)]:a}
function unk(){try{return JSON.parse(localStorage.getItem('unk')||'[]')}catch(e){return []}}
var cur='';function hi(){if(/noches/.test(cur))return 'Buenas noches';if(/tardes/.test(cur))return 'Buenas tardes';if(/\bdias\b/.test(cur))return 'Buenos días';var h=new Date().getHours();return h<12?'Buenos días':h<19?'Buenas tardes':'Buenas noches'}
var SM=[];function S(k,a){SM.push({k:k.split('|'),a:a})}
S('hola|buenas|buenos dias|buenas tardes|buenas noches|hey|saludos|que tal|holi',function(){return hi()+'. Soy el asistente de Chrono Shield Networks. ¿Qué te gustaría saber o hacer hoy?'});
S('como estas|como te va|como amaneciste|que mas',['¡Muy bien, gracias por preguntar! Listo para ayudarte. ¿Qué necesitas?','Todo bien por aquí. ¿En qué te ayudo?']);
S('como te llamas|tu nombre|como te digo','Soy CSN IA, el asistente de Chrono Shield Networks.');
S('quien te creo|quien te hizo|quien te programo|quien te desarrollo','Me creó el equipo de Chrono Shield Networks, en Bogotá, Colombia.');
S('eres humano|eres un robot|eres real|eres una persona','Soy un asistente digital, no una persona. Si algo no lo sé, te paso el contacto del equipo: contactochronoshield@gmail.com.');
S('gracias|muchas gracias|te agradezco',['¡Con gusto!','Para eso estoy. Cualquier otra duda, aquí estoy.','¡A ti por preguntar!']);
S('adios|chao|hasta luego|nos vemos|bye|hasta pronto',['¡Hasta pronto! Que te vaya muy bien.','Aquí estaré cuando me necesites. ¡Cuídate!']);
S('chiste|algo gracioso|hazme reir',['¿Por qué el router fue al psicólogo? Porque tenía demasiados problemas de conexión.','¿Cuál es la contraseña favorita de un hacker? La que tú pusiste: 123456.']);
S('frustrado|no entiendo|esto no sirve|estoy cansado|estresado|estoy harto|que mal|no me funciona',['Entiendo, y perdona el lío. Vamos paso a paso: cuéntame qué intentabas hacer y lo resolvemos juntos.','Tranquilo, lo resolvemos. Dime qué estabas haciendo y qué pasó, y te guío.']);
S('buen trabajo|me gusta|excelente app|felicitaciones|que bueno|muy bien hecho','¡Gracias! Me alegra que te guste. Si algo se puede mejorar, cuéntame.');
S('ok|vale|listo|claro|entiendo|perfecto|dale','Perfecto. ¿Qué más quieres saber?');
S('preguntas pendientes|preguntas sin respuesta',function(){var u=unk();return u.length?'Esto es lo último que me preguntaron y no supe responder (solo se guarda en este teléfono):\n• '+u.slice(-8).join('\n• '):'No tengo preguntas pendientes.'});
function M(key,txt){KB.forEach(function(e){if(e.k.indexOf(key)>-1)e.m=txt})}
KB.forEach(function(e){if(e.k.indexOf('quienes son')>-1)e.k.push('esta empresa','a que se dedican','que hacen','que hace csn','de que trata','cuentame de ustedes','sobre la empresa')});
M('quienes son','Nuestra base está en Bogotá y tenemos presencia o procesos de expansión en Colombia, Perú, Honduras, El Salvador, Brasil, Estonia y Barcelona. Trabajamos con seguridad por diseño, transparencia, soberanía tecnológica, open source y privacidad. Puedes pedir una evaluación técnica, una implementación o una propuesta empresarial en contactochronoshield@gmail.com.');
M('mesh node','El Mesh Node viene con software listo para usar, antena externa y un video guía en YouTube. Lo conectas al router, lo enciendes y escaneas el QR desde WireGuard. Se compra en Mercado Libre por 169.000 COP.');
M('sentinel','Sentinel vigila varios nodos a la vez, avisa con alertas (por ejemplo por Telegram) y detecta cambios de SIM, redes Wi-Fi falsas y caídas de calidad del enlace. Hay versión PRO por licencia. Su código está en GitHub: chrono-sentinel-app y Sentinel-Civil.');
M('cloud','Es nuestra nube propia, operada localmente y bajo jurisdicción propia, pensada como alternativa a AWS, Azure y Google Cloud. Tiene tres planes; escribe a contactochronoshield@gmail.com para ver cuál te conviene.');
M('red privada','Piensa en un túnel privado: tu computador, tus cámaras y tu celular se ven entre ellos como si estuvieran en la misma casa, aunque estén lejos, y nadie de afuera puede mirar ese tráfico. Para crearla toca "Mi red".');
K('paypal|como pago|pagar|metodo de pago|metodos de pago','Aceptamos PayPal. Para el plan Enterprise toca la pestaña "Pro" y sigue el botón de pago. Para otros servicios escribe a contactochronoshield@gmail.com.');
var FB2=['Buena pregunta. Todavía no tengo una respuesta exacta, pero puedo contarte sobre redes privadas, Mesh Node, Sentinel, Cloud, el plan Enterprise o nuestros repositorios.','Esa no la tengo clara todavía. Pregúntame por nuestros servicios, precios o cómo crear tu red, o escribe al equipo: contactochronoshield@gmail.com.'];
var last=null,MORE=/\b(mas|detalles|detalle|profundo|explica|amplia|ampliar)\b/;
window.reply=function(raw){
var t=T(raw);cur=t;if(!t)return pick(FB2);
var ri=repoInfo(t);if(ri)return ri;
var best=null,bs=0;
SM.concat(KB).forEach(function(e){var s=score(e,t);if(s>bs){bs=s;best=e}});
if(best){last=best;return pick(MORE.test(t)&&best.m?best.m:best.a)}
if(last&&/^(y |mas|dime mas|cuentame mas|explica|detalles|no entendi|repite|otra vez)/.test(t))return pick(last.m||last.a);
try{var u=unk();u.push(raw.slice(0,120));localStorage.setItem('unk',JSON.stringify(u.slice(-50)))}catch(e){}
return pick(FB2)};
})();
JS_EOF

cat > $A/pro.js << 'JS_EOF'
(function(){
var PAYPAL_URL='';
var st=document.createElement('style');
st.textContent='nav button{font-size:13px}.fc{padding:14px 16px;background:#fff;border:1px solid var(--line);border-radius:14px;margin:10px 0;font-size:15px;line-height:1.45}.fc b{display:block;font-size:16px;margin-bottom:2px}.bd{display:inline-block;padding:4px 10px;border-radius:99px;background:#EEF3FF;color:#2B5BE6;font-size:13px;font-weight:700}';
document.head.appendChild(st);
var t=document.createElement('div');t.className='tab';t.id='t-pro';
t.innerHTML='<div class="pad"><span class="bd">Acceso anticipado</span><h1>Plan Enterprise</h1><p class="s">Si tienes un equipo potente o un data center, incluso en casa, una IA puede administrar tu red (wifi, privada o data center) de forma soberana.</p><div class="fc"><b>La IA corre en tu equipo</b>Nada sale a servidores externos. Tus datos y tu red siguen siendo tuyos.</div><div class="fc"><b>Tú apruebas cada cambio</b>La IA propone el ajuste, te lo explica en simple y solo se aplica si tú lo autorizas.</div><div class="fc"><b>Registro completo</b>Cada acción queda anotada para que puedas revisarla.</div><div class="note"><b>Recomendado:</b> un equipo con 16 GB de RAM o más para la IA local.<br><b>Acceso anticipado:</b> el agente se está construyendo junto con los primeros clientes.<br><b>Cómo se activa:</b> pagas con PayPal, nos escribes el recibo a contactochronoshield@gmail.com y te enviamos la licencia y la guía de instalación.</div><button class="btn" id="pp">Pagar con PayPal</button><p class="s" id="pps" style="margin-top:8px"></p></div>';
document.body.insertBefore(t,document.getElementById('t-web'));
document.getElementById('pp').onclick=function(){if(PAYPAL_URL)window.location.href=PAYPAL_URL;else document.getElementById('pps').textContent='El enlace de pago de PayPal se activa pronto. Mientras tanto, escribe a contactochronoshield@gmail.com.'};
K('enterprise|plan enterprise|administrar mi red|administre mi red|data center en casa|equipo potente|ia administre|administrar mi data center|plan pro','El plan Enterprise es para quien tiene un equipo potente o un data center, incluso en casa: una IA que corre en tu equipo administra tu red (wifi, privada o data center) de forma soberana. Te propone cada cambio y solo se aplica si tú lo autorizas. Está en acceso anticipado; mira la pestaña "Pro".');
KB[KB.length-1].m='Cómo funciona: instalas el agente de CSN en tu equipo, que corre una IA local. Desde la app le pides cosas como "bloquea todo lo entrante menos mi VPN" o "revisa por qué cayó el wifi". La IA te muestra qué haría y tú apruebas. Cada acción queda en un registro. Se paga con PayPal y se activa con una licencia que te enviamos.';
})();
JS_EOF

if [ -n "$PP" ]; then
  case "$PP" in
    https://*) PPE=$(printf '%s' "$PP" | sed 's/[&|\\]/\\&/g'); sed -i "s|PAYPAL_URL=''|PAYPAL_URL='$PPE'|" $A/pro.js; echo "Enlace de PayPal configurado." ;;
    *) echo "El enlace debe empezar con https://"; exit 1 ;;
  esac
fi

F=$A/chat.html
if ! grep -q 'conv.js' $F; then
  sed -i "s|</nav>|<button id=\"n-pro\" onclick=\"tab('pro')\">Pro</button></nav>|" $F
  sed -i "s|\['chat','red','nodo','web'\]|['chat','red','nodo','pro','web']|" $F
  sed -i 's|<script src="nodo.js"></script>|<script src="nodo.js"></script><script src="pro.js"></script><script src="conv.js"></script>|' $F
fi

cat > android/app/src/main/java/net/chronoshield/iaapp/MainActivity.kt << 'KT_EOF'
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
KT_EOF

git add .
git commit -m "Conversacion mas natural, plan Enterprise (pestana Pro) y enlaces externos"
git push
