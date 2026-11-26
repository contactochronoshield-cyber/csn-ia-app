(function(){
var st=document.createElement('style');
st.textContent='.sw{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;background:#fff;border:1px solid var(--line);border-radius:16px;margin:12px 0}.sw b{font-size:17px}.tg{width:56px;height:32px;border-radius:16px;border:0;background:#C9D5EA;position:relative;flex-shrink:0}.tg:after{content:"";position:absolute;top:4px;left:4px;width:24px;height:24px;border-radius:50%;background:#fff}.tg.on{background:var(--green)}.tg.on:after{left:28px}.tg:disabled{opacity:.5}.cnt{font-size:34px;font-weight:700;margin:4px 0}.ck{display:flex;gap:10px;align-items:flex-start;margin:12px 0;font-size:15px;line-height:1.4}.ck input{width:24px;height:24px;flex-shrink:0;margin:0}.di{width:100%;height:44px;margin-top:8px;padding:0 12px;border:1.5px solid #D9E1EE;border-radius:12px;font-size:15px}';
document.head.appendChild(st);
var t=document.createElement('div');t.className='tab';t.id='t-nodo';
t.innerHTML='<div class="pad"><h1>Red de nodos CSN</h1><p class="s">Cada persona que activa su nodo hace la red más fuerte y más difícil de tumbar.</p><div class="note">Nodos activos ahora<div class="cnt" id="nc">—</div><span id="ns" style="color:var(--muted);font-size:14px">Directorio no configurado</span></div><div class="sw"><div><b>Ser nodo</b><div id="nst" style="color:var(--muted);font-size:14px">Apagado</div></div><button class="tg" id="tg" aria-label="Activar nodo" disabled></button></div><label class="ck"><input type="checkbox" id="ac"><span>Entiendo y acepto: mientras la app esté abierta y con wifi, mi teléfono avisa cada minuto que está activo. No se comparte mi nombre, mis datos ni mi tráfico. Puedo apagarlo cuando quiera.</span></label><div class="note"><b>Qué se envía:</b> un código aleatorio y la versión de la app. Nada más. En esta fase tu teléfono no mueve tráfico de nadie.</div><div class="note"><b>Dirección del directorio</b><input class="di" id="du" placeholder="https://tu-servidor:8095"><button class="btn g" id="dsv">Guardar dirección</button></div></div>';
document.body.insertBefore(t,document.getElementById('t-web'));
var LS=localStorage,TM=null,VER='0.9.0',$=function(i){return document.getElementById(i)};
function g(k){try{return LS.getItem(k)||''}catch(e){return ''}}
function s(k,v){try{LS.setItem(k,v)}catch(e){}}
function dir(){return g('dir').replace(/\/+$/,'')}
function post(p,b){return fetch(dir()+p,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(function(r){if(!r.ok)throw 0;return r.json()})}
function wifiOk(){var c=navigator.connection;return navigator.onLine&&!(c&&c.type==='cellular')}
function ui(){var on=g('on')==='1';$('tg').classList.toggle('on',on);$('nst').textContent=on?'Activo mientras la app esté abierta':'Apagado';$('tg').disabled=!dir()||!(on||$('ac').checked)}
function count(){if(!dir()){$('ns').textContent='Directorio no configurado';return}
fetch(dir()+'/nodes/count').then(function(r){return r.json()}).then(function(d){$('nc').textContent=d.active;$('ns').textContent=d.total+' nodos registrados'}).catch(function(){$('ns').textContent='Sin conexión con el directorio'})}
function beat(){if(g('on')!=='1')return;if(!wifiOk()){$('nst').textContent='Pausado: sin wifi';return}
post('/nodes/heartbeat',{node_id:g('nid'),token:g('ntk'),ver:VER}).then(function(){$('nst').textContent='Activo mientras la app esté abierta';count()}).catch(function(){$('nst').textContent='Sin conexión con el directorio'})}
function stop(){if(TM){clearInterval(TM);TM=null}}
function start(){stop();beat();TM=setInterval(beat,60000)}
$('tg').onclick=function(){
if(g('on')==='1'){post('/nodes/unregister',{node_id:g('nid'),token:g('ntk')}).catch(function(){});s('on','0');s('nid','');s('ntk','');stop();ui();count();return}
if(!$('ac').checked)return;
post('/nodes/register',{ver:VER}).then(function(r){s('nid',r.node_id);s('ntk',r.token);s('on','1');start();ui()}).catch(function(){$('nst').textContent='No se pudo conectar con el directorio'})};
$('dsv').onclick=function(){var v=$('du').value.trim();if(v&&!/^https?:\/\//.test(v)){$('ns').textContent='La dirección debe empezar con http:// o https://';return}s('dir',v);ui();count()};
$('ac').onchange=ui;$('du').value=g('dir');ui();count();if(g('on')==='1')start();setInterval(count,60000);
if(typeof K==='function')K('ser nodo|ser un nodo|red de nodos|nodos activos|descentralizada|ser parte de la red','Puedes ser parte de la red de nodos CSN desde la pestaña "Nodo". Es voluntario y viene apagado: en esta fase tu teléfono solo avisa que está activo (con un código aleatorio), sin mover tráfico de nadie. Más nodos hacen la red más fuerte y resistente.');
})();
