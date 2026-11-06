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
