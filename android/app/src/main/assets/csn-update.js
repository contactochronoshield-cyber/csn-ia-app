/* CSN IA - aviso de nueva versión dentro de la app.
   Consulta la última release pública de GitHub. Sin SDK de Google ni servidor propio. */
(function (root) {
  'use strict';
  var API = 'https://api.github.com/repos/contactochronoshield-cyber/csn-ia-app/releases/latest';
  var CADA_MS = 6 * 60 * 60 * 1000;
  var TXT = {
    es: { nueva: 'Nueva versión disponible', tienes: 'tienes la', bajar: 'Descargar', luego: 'Después' },
    en: { nueva: 'New version available', tienes: 'you have', bajar: 'Download', luego: 'Later' },
    pt: { nueva: 'Nova versão disponível', tienes: 'você tem a', bajar: 'Baixar', luego: 'Depois' }
  };

  function nums(v) {
    var m = /(\d+(?:\.\d+)*)/.exec(String(v || ''));
    return m ? m[1].split('.').map(Number) : [];
  }
  function esMayor(a, b) {
    var x = nums(a), y = nums(b), n = Math.max(x.length, y.length);
    for (var i = 0; i < n; i++) {
      var p = x[i] || 0, q = y[i] || 0;
      if (p > q) return true;
      if (p < q) return false;
    }
    return false;
  }
  root.CSNUpdate = { esMayor: esMayor };
  if (typeof document === 'undefined') return;

  function ls(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v);
    } catch (e) { /* sin almacenamiento */ }
    return null;
  }
  function versionActual() {
    try { if (root.CSNVersion && root.CSNVersion.version) return String(root.CSNVersion.version()); } catch (e) { /* sin puente */ }
    return null;
  }
  function idioma() {
    var l = ls('csn_lang') || document.documentElement.lang || 'es';
    return TXT[l] ? l : 'es';
  }
  function el(tag, texto, css) {
    var e = document.createElement(tag);
    if (texto) e.textContent = texto;
    if (css) e.style.cssText = css;
    return e;
  }
  function banner(tag, actual, url) {
    if (document.getElementById('csn-upd')) return;
    var t = TXT[idioma()];
    var b = el('div', '', 'position:fixed;top:0;left:0;right:0;z-index:99999;display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:10px 12px;background:#1d4ed8;color:#fff;font-size:14px;line-height:1.3');
    b.id = 'csn-upd';
    b.appendChild(el('div', '🔔 ' + t.nueva + ': ' + tag + ' (' + t.tienes + ' ' + actual + ')', 'flex:1;min-width:180px'));
    var bajar = el('button', t.bajar, 'padding:7px 14px;border-radius:10px;border:0;background:#fff;color:#1d4ed8;font-weight:600');
    bajar.onclick = function () {
      try { if (root.CSNVersion && root.CSNVersion.abrir) root.CSNVersion.abrir(url); } catch (e) { /* sin puente */ }
    };
    var luego = el('button', t.luego, 'padding:7px 14px;border-radius:10px;border:1px solid #fff;background:transparent;color:#fff');
    luego.onclick = function () { ls('csn_upd_omitida', tag); b.remove(); };
    b.appendChild(bajar);
    b.appendChild(luego);
    document.body.appendChild(b);
  }
  function mostrarPendiente() {
    var actual = versionActual(), p = ls('csn_upd_pend');
    if (!actual || !p) return;
    try {
      p = JSON.parse(p);
      if (esMayor(p.tag, actual) && ls('csn_upd_omitida') !== p.tag) banner(p.tag, actual, p.url);
      else if (!esMayor(p.tag, actual)) ls('csn_upd_pend', null);
    } catch (e) { ls('csn_upd_pend', null); }
  }
  function revisar() {
    var actual = versionActual();
    if (!actual || typeof fetch !== 'function') return;
    var ult = +ls('csn_upd_ult') || 0;
    if (Date.now() - ult < CADA_MS) return;
    fetch(API, { headers: { 'Accept': 'application/vnd.github+json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.tag_name || j.draft || j.prerelease) return;
        ls('csn_upd_ult', String(Date.now()));
        if (!esMayor(j.tag_name, actual)) { ls('csn_upd_pend', null); return; }
        var url = j.html_url;
        (j.assets || []).forEach(function (a) { if (/\.apk$/i.test(a.name || '')) url = a.browser_download_url; });
        ls('csn_upd_pend', JSON.stringify({ tag: j.tag_name, url: url }));
        mostrarPendiente();
      })
      .catch(function () { /* sin red: se reintenta la próxima vez */ });
  }
  function iniciar() { mostrarPendiente(); revisar(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
  document.addEventListener('visibilitychange', function () { if (!document.hidden) iniciar(); });
})(typeof window !== 'undefined' ? window : globalThis);
