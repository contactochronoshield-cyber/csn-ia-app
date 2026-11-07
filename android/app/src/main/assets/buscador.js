(function(){
var host_=document.getElementById('t-web'),bf=document.getElementById('bf'),wq=document.getElementById('wq');
if(!host_||!bf)return;
var st=document.createElement('style');
st.textContent='#esc,#sr{padding:0 16px}#esc details{margin:12px 0;border:1px solid var(--line);border-radius:14px;background:#fff;padding:10px 14px}#esc summary{font-weight:700;font-size:15px}#esc p{font-size:13px;color:#5B6B85;margin:8px 0 0}#esc textarea{width:100%;box-sizing:border-box;margin-top:10px;min-height:84px;border:1px solid var(--line);border-radius:10px;padding:10px;font:inherit}.bt{margin-top:8px;padding:10px 14px;border-radius:10px;border:0;background:#2B5BE6;color:#fff;font-weight:700;font-size:14px}.bt.g{background:#E8EDF5;color:#1B2A44}.rc{display:block;padding:12px 14px;background:#fff;border:1px solid var(--line);border-radius:14px;margin:10px 0}.rc b{display:block;font-size:15px;line-height:1.35}.rc .h{display:block;font-size:12px;color:#5B6B85;margin:2px 0}.rc p{margin:4px 0 6px;font-size:13px;line-height:1.4}.sh{display:inline-block;padding:3px 9px;border-radius:99px;font-size:12px;font-weight:700}.sh.ok{background:#E3F6EC;color:#0E8A4F}.sh.warn{background:#FFF4D6;color:#9A6700}.sh.bad{background:#FDE7E4;color:#B42318}.pv{position:fixed;left:0;right:0;top:0;bottom:0;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;z-index:99}.pb{background:#fff;width:100%;box-sizing:border-box;padding:18px 18px 28px;border-radius:18px 18px 0 0}.pb li{margin:6px 0;font-size:14px;line-height:1.4}.vd{margin-top:12px;padding:12px 14px;border-radius:12px;font-size:14px;line-height:1.45}.vd.ok{background:#E3F6EC}.vd.warn{background:#FFF4D6}.vd.bad{background:#FDE7E4}';
document.head.appendChild(st);

function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function hostOf(u){try{return new URL(u).hostname}catch(e){return ''}}
function lev(a,b){var d=[],i,j;for(i=0;i<=a.length;i++)d[i]=[i];for(j=1;j<=b.length;j++)d[0][j]=j;for(i=1;i<=a.length;i++)for(j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
function regOf(h){var p=h.split('.');if(p.length<=2)return p;var l2=p[p.length-2];if(['com','net','org','gov','edu','co','gob'].indexOf(l2)>-1&&p[p.length-1].length===2)return p.slice(-3);return p.slice(-2)}
var BR=['bancolombia','nequi','daviplata','davivienda','bbva','paypal','mercadolibre','mercadopago','google','facebook','instagram','whatsapp','microsoft','apple','amazon','netflix','nubank','binance'];
var SH=['bit.ly','tinyurl.com','t.co','goo.gl','ow.ly','cutt.ly','is.gd','rb.gy','shorturl.at'];
var TL=['zip','mov','tk','ml','ga','cf','gq','top','xyz','click','work','icu'];

// Escudo de enlaces: revisa la direccion. No garantiza seguridad, solo busca senales.
function escudo(u){
  var R=[],bad=false,warn=false,x;
  try{x=new URL(u)}catch(e){return {n:'bad',r:['La dirección no es válida.']}}
  var h=x.hostname.toLowerCase();
  if(x.protocol!=='https:'){warn=true;R.push('No usa cifrado (http): lo que escribas ahí puede verse en el camino.')}
  if(x.username||x.password){bad=true;R.push('Trae un usuario en la dirección: truco clásico para disfrazar el sitio real.')}
  if(/^\d{1,3}(\.\d{1,3}){3}$/.test(h)){warn=true;R.push('Usa una IP en lugar de un nombre de sitio.')}
  if(h.indexOf('xn--')>-1||/[^\x00-\x7F]/.test(h)){bad=true;R.push('Tiene caracteres que imitan letras de otro idioma.')}
  if(SH.indexOf(h)>-1){warn=true;R.push('Es un acortador: no se ve el destino real.')}
  var tld=h.split('.').pop();
  if(TL.indexOf(tld)>-1){warn=true;R.push('Termina en .'+tld+', muy usado en estafas.')}
  if((h.match(/-/g)||[]).length>=3){warn=true;R.push('Nombre con muchos guiones, común en sitios falsos.')}
  var lab=regOf(h)[0];
  for(var i=0;i<BR.length;i++){var b=BR[i];
    if(lab===b)continue;
    if(b.length>=6&&lev(lab,b)===1){bad=true;R.push('Se parece mucho a '+b+' pero no es el sitio oficial.');break}
    if(lab.indexOf(b)>-1){warn=true;R.push('Incluye el nombre de '+b+' pero el sitio no es el oficial.');break}}
  var n=bad?'bad':warn?'warn':'ok';
  if(n==='ok')R.push('No encontré señales de riesgo. Eso no garantiza que el sitio sea seguro.');
  return {n:n,r:R}}

var LAB={ok:'Sin señales de riesgo',warn:'Precaución',bad:'Posible peligro'};
function go(u){location.href=u}
function panel(u,s){
  var o=el('div','pv'),b=el('div','pb');
  b.appendChild(el('b','',s.n==='bad'?'Este enlace parece peligroso':'Revisa antes de abrir'));
  b.appendChild(el('div','h',hostOf(u)));
  var ul=el('ul');s.r.forEach(function(t){ul.appendChild(el('li','',t))});b.appendChild(ul);
  var a=el('button','bt g','Cancelar');a.onclick=function(){document.body.removeChild(o)};
  var c=el('button','bt',s.n==='bad'?'Abrir de todos modos':'Abrir');c.onclick=function(){document.body.removeChild(o);go(u)};
  b.appendChild(a);b.appendChild(document.createTextNode(' '));b.appendChild(c);
  o.appendChild(b);document.body.appendChild(o)}

// Contenedores
bf.style.display='none';
var esc=el('div');esc.id='esc';
esc.innerHTML='<details><summary>Escudo CSN: ¿te quieren estafar?</summary><p>Pega un mensaje, enlace o número que te llegó. Se analiza en tu teléfono; nada sale de la app.</p><textarea id="et" placeholder="Pega aquí el mensaje sospechoso"></textarea><button class="bt" id="eb">Analizar</button><div id="er"></div></details>';
var sr=el('div');sr.id='sr';
host_.insertBefore(esc,bf);host_.insertBefore(sr,bf);

function news(v){var n=document.querySelector('.nw');if(n)n.style.display=v?'':'none'}
function clear(){sr.innerHTML='';news(true)}

// Buscador propio
var lastQ='';
window.web=function(){
  var q=wq.value.trim();if(!q)return;lastQ=q;sr.innerHTML='';news(false);
  if(!window.CSNSearch){sr.appendChild(el('p','','La búsqueda segura funciona dentro de la app.'));return}
  sr.appendChild(el('p','','Buscando…'));CSNSearch.search(q)};
window.searchReady=function(json){
  var d;try{d=JSON.parse(json)}catch(e){return}
  sr.innerHTML='';
  var back=el('button','bt g','Volver a noticias');back.onclick=clear;sr.appendChild(back);
  if(!d.ok||!d.r||!d.r.length){
    sr.appendChild(el('p','',d.ok?'No encontré resultados para esa búsqueda.':'No pude completar la búsqueda ('+(d.err||'error')+'). Revisa tu conexión.'));
    var ext=el('button','bt','Buscar en el navegador');ext.onclick=function(){go('https://duckduckgo.com/?q='+encodeURIComponent(lastQ))};
    sr.appendChild(ext);return}
  d.r.forEach(function(r){
    var s=escudo(r.u),c=el('div','rc');
    c.appendChild(el('b','',r.t));c.appendChild(el('span','h',hostOf(r.u)));
    if(r.d)c.appendChild(el('p','',r.d));
    c.appendChild(el('span','sh '+s.n,LAB[s.n]));
    c.onclick=function(){if(s.n==='ok')go(r.u);else panel(r.u,s)};
    sr.appendChild(c)})};
wq.addEventListener('keydown',function(e){if(e.key==='Enter')window.web()});

// Escudo anti-estafa (texto pegado)
var RULES=[
 [/c[oó]digo (de )?(verificaci[oó]n|seguridad|sms|otp)|clave (din[aá]mica|del? cajero)|\bcvv\b|\bpin\b|contrase[nñ]a/i,'bad','Pide códigos, claves o contraseñas. Ninguna entidad seria las pide por mensaje.'],
 [/(mam[aá]|pap[aá]|hijo|hija|abuel[oa]).{0,60}(nuevo n[uú]mero|cambi[eé] de n[uú]mero|este es mi n[uú]mero)/i,'bad','Parece la estafa del familiar con número nuevo. Llama al número que ya tenías.'],
 [/su cuenta (ser[aá]|va a ser|ha sido|fue) (bloquead|suspendid|cancelad)|cuenta (bloquead|suspendid)a?/i,'warn','Amenaza con bloquear tu cuenta para meterte presión.'],
 [/urgente|inmediatamente|[uú]ltimo aviso|en las pr[oó]ximas \d+ horas|hoy mismo/i,'warn','Mete urgencia para que no pienses ni verifiques.'],
 [/ganaste|has ganado|premio|sorteo|felicitaciones|reclama tu/i,'warn','Habla de premios o sorteos que no pediste.'],
 [/(env[ií]a|transfiere|consigna|deposita|gira)[^.]{0,40}(dinero|plata|\$)|western union|bitcoin|usdt|cripto/i,'warn','Pide mover dinero o criptomonedas.'],
 [/trabajo desde casa|ganancias garantizadas|inversi[oó]n segura|pr[eé]stamo (aprobado|inmediato)|sin (papeleo|requisitos)/i,'warn','Ofrece dinero fácil o préstamos sin requisitos.'],
 [/(bancolombia|nequi|daviplata|davivienda|dian|polic[ií]a|fiscal[ií]a|registradur[ií]a)/i,'info','Menciona una entidad conocida. Verifica llamando al número oficial, no al del mensaje.']
];
var URLRE=/(https?:\/\/[^\s)]+|www\.[^\s)]+|\b(?:bit\.ly|tinyurl\.com|cutt\.ly|is\.gd|rb\.gy|t\.co|shorturl\.at)\/[^\s)]+)/gi;
function analizar(t){
  var R=[],bad=false,w=0;
  RULES.forEach(function(r){if(r[0].test(t)){R.push(r[2]);if(r[1]==='bad')bad=true;if(r[1]==='warn')w++}});
  var us=t.match(URLRE)||[];
  us.slice(0,5).forEach(function(u){
    if(!/^https?:/i.test(u))u='https://'+u;
    var s=escudo(u);
    if(s.n==='bad'){bad=true;R.push('Enlace de riesgo ('+hostOf(u)+'): '+s.r[0])}
    else if(s.n==='warn'){w++;R.push('Enlace con precaución ('+hostOf(u)+'): '+s.r[0])}});
  var n=bad?'bad':w>=1?'warn':'ok';
  var tt=bad?'Alto riesgo: muy probablemente es una estafa.':w>=2?'Sospechoso: tiene varias señales de estafa.':w===1?'Ten cuidado: hay una señal de alerta.':'No encontré señales claras. Eso no garantiza que sea legítimo.';
  return {n:n,t:tt,r:R}}
document.getElementById('eb').onclick=function(){
  var t=document.getElementById('et').value.trim(),o=document.getElementById('er');o.innerHTML='';if(!t)return;
  var a=analizar(t),v=el('div','vd '+a.n);v.appendChild(el('b','',a.t));
  if(a.r.length){var ul=el('ul');a.r.forEach(function(x){ul.appendChild(el('li','',x))});v.appendChild(ul)}
  v.appendChild(el('p','','Ante la duda: no respondas, no abras el enlace y no compartas códigos. Llama al número oficial de la entidad.'));
  o.appendChild(v)};
})();
