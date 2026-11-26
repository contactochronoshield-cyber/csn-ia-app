(function () {
  if (!window.CSNBiblioteca) return;
  var prev = window.reply;
  var RE_FALLBACK = /no la tengo|todav[ií]a no lo tengo|eso todav[ií]a no/i;
  var RE_PREV = /repo|github|computador|\bpc\b|control remoto|acceso remoto/i;
  function resolver(raw) {
    var memo = null;
    function viejo() {
      if (memo === null) {
        try { memo = typeof prev === "function" ? String(prev(raw) || "") : ""; } catch (e) { memo = ""; }
      }
      return memo;
    }
    var lib = window.CSNBiblioteca.responder(raw);
    if (RE_PREV.test(raw)) {
      var v = viejo();
      if (v && !RE_FALLBACK.test(v)) return { texto: v, relacionados: [] };
    }
    if (lib.encontrado) return lib;
    var v2 = viejo();
    if (v2 && !RE_FALLBACK.test(v2)) return { texto: v2, relacionados: [] };
    return lib;
  }
  function chips(lista) {
    var M = document.getElementById("msgs");
    if (!M || !lista || !lista.length) return;
    var box = document.createElement("div");
    box.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 10px";
    lista.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = c.titulo;
      b.style.cssText = "border:1px solid #cbd5e1;background:#fff;color:#1e293b;border-radius:999px;padding:8px 14px;font-size:14px;cursor:pointer";
      b.onclick = function () { box.remove(); tema(c); };
      box.appendChild(b);
    });
    M.appendChild(box);
    M.scrollTop = M.scrollHeight;
  }
  function tema(c) {
    add(c.titulo, "usr");
    setTimeout(function () {
      var r = window.CSNBiblioteca.porTema(c.id);
      if (r) { add(r.texto, "bot"); chips(r.relacionados); }
    }, 150);
  }
  window.CSNPuente = { resolver: resolver };
  window.reply = function (raw) { return resolver(raw).texto; };
  window.localAsk = function (t) {
    setTimeout(function () {
      var r = resolver(t);
      add(r.texto, "bot");
      chips(r.relacionados);
    }, 180);
  };
})();
