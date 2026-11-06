(function(){
var st=document.createElement('style');
st.textContent='nav{overflow-x:auto}nav button{white-space:nowrap;font-size:12px;padding-left:8px;padding-right:8px}.nw{padding:0 16px 24px}.nw h2{font-size:17px;margin:18px 0 4px}.nc{display:block;padding:12px 14px;background:#fff;border:1px solid var(--line);border-radius:14px;margin:10px 0}.nc b{display:block;font-size:15px;line-height:1.35;margin-bottom:4px}.nc i{font-style:normal;font-size:12px;color:#5B6B85}.nr{background:none;border:0;color:#2B5BE6;font-weight:700;font-size:13px;padding:0}';
document.head.appendChild(st);

// Cuenta: de header a la barra, junto a Pro
var nav=document.querySelector('nav');
var all=document.querySelectorAll('button,a,div,span');
var orig=null;
for(var i=0;i<all.length;i++){var e=all[i];if(e.children.length===0&&e.textContent.trim()==='Cuenta'&&!(nav&&nav.contains(e))){orig=e;break}}
if(nav&&orig){
  var nb=document.createElement('button');nb.id='n-cuenta';nb.textContent='Cuenta';
  nb.onclick=function(){orig.click()};
  nav.appendChild(nb);
  orig.style.display='none';
}

// Noticias en Buscar
var host=document.getElementById('t-web');
if(!host)return;
var box=document.createElement('div');box.className='nw';
box.innerHTML='<h2>Noticias de ciberseguridad</h2><button class="nr" id="nrf">Actualizar</button><div id="nl"></div>';
host.appendChild(box);
function ago(d){if(!d)return '';var m=Math.floor((Date.now()-d)/60000);if(m<60)return 'hace '+Math.max(m,1)+' min';var h=Math.floor(m/60);if(h<24)return 'hace '+h+' h';return 'hace '+Math.floor(h/24)+' d'}
function render(){
  var nl=document.getElementById('nl');nl.innerHTML='';
  var items=[];try{items=JSON.parse(window.CSNNews?CSNNews.get():'[]')}catch(e){}
  if(!items.length){nl.textContent=window.CSNNews?'Cargando noticias...':'Las noticias están disponibles en la app.';return}
  items.forEach(function(n){
    var c=document.createElement('div');c.className='nc';
    var b=document.createElement('b');b.textContent=n.t;
    var m=document.createElement('i');m.textContent=n.s+(n.d?' · '+ago(n.d):'');
    c.appendChild(b);c.appendChild(m);
    c.onclick=function(){location.href=n.l};
    nl.appendChild(c);
  });
}
window.newsReady=render;
document.getElementById('nrf').onclick=function(){if(window.CSNNews){CSNNews.refresh()}};
render();
if(window.CSNNews&&Date.now()-CSNNews.lastUpdate()>86400000)CSNNews.refresh();
})();
