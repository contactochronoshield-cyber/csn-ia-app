(function () {
  var DATA = window.CSN_BIBLIOTECA || [];
  var STOP = "el la los las un una unos unas de del al y o a en por para con sin que es son me mi mis tu tus se lo le les su sus como cual cuales qué ese esa eso esto este esta explicame explicame dime dame quiero puedes puedo hay muy mas ya si no".split(" ");

  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }
  function toks(s) {
    return norm(s).split(" ").filter(function (w) { return w && STOP.indexOf(w) < 0; });
  }
  function lev(a, b) {
    var m = [], i, j;
    for (i = 0; i <= a.length; i++) { m[i] = [i]; }
    for (j = 1; j <= b.length; j++) { m[0][j] = j; }
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i-1][j] + 1, m[i][j-1] + 1, m[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    return m[a.length][b.length];
  }
  function close(a, b) {
    if (a === b) return true;
    if (a.length >= 4 && b.length >= 4 && (a.indexOf(b) === 0 || b.indexOf(a) === 0)) return true;
    return a.length >= 5 && b.length >= 5 && lev(a, b) <= 1;
  }

  function puntuar(entry, qNorm, qToks) {
    var score = 0, mejor = 0;
    (entry.claves || []).forEach(function (k) {
      var kn = norm(k);
      if (!kn) return;
      if ((" " + qNorm + " ").indexOf(" " + kn + " ") >= 0) { var sk = 10 + kn.length / 10; score += sk; if (sk > mejor) mejor = sk; return; }
      var kt = toks(kn);
      if (!kt.length) return;
      var hit = 0;
      kt.forEach(function (w) { if (qToks.some(function (q) { return close(q, w); })) hit++; });
      var ratio = hit / kt.length;
      if (hit && ratio >= 0.6) { var sf = ratio * 6; score += sf; if (sf > mejor) mejor = sf; }
    });
    toks(entry.titulo).forEach(function (w) { if (qToks.some(function (q) { return close(q, w); })) score += 1; });
    return mejor + 0.1 * (score - mejor);
  }

  function buscar(texto) {
    var qn = norm(texto), qt = toks(texto);
    return DATA.map(function (e) { return { e: e, s: puntuar(e, qn, qt) }; })
      .sort(function (a, b) { return b.s - a.s; });
  }
  function porId(id) { return DATA.filter(function (e) { return e.id === id; })[0]; }
  function chips(ids) {
    return (ids || []).map(porId).filter(Boolean).map(function (e) { return { id: e.id, titulo: e.titulo }; });
  }
  function registrar(texto) {
    try {
      var k = "csn_sin_respuesta", l = JSON.parse(localStorage.getItem(k) || "[]");
      l.push({ t: texto, f: new Date().toISOString() });
      localStorage.setItem(k, JSON.stringify(l.slice(-200)));
    } catch (e) {}
  }

  function responder(texto) {
    var r = buscar(texto);
    if (r.length && r[0].s >= 4) {
      return { encontrado: true, id: r[0].e.id, texto: r[0].e.respuesta, relacionados: chips(r[0].e.relacionados) };
    }
    // el registro lo hace conv.js (unk)
    var sug = r.filter(function (x) { return x.s > 0; }).slice(0, 3).map(function (x) { return x.e.id; });
    if (!sug.length) sug = ["red_privada", "usos_red_privada", "empresa"];
    return {
      encontrado: false,
      texto: "Todavía no tengo el detalle exacto de eso, pero no te quedes con la duda. Mira estos temas, que pueden ayudarte, o escríbele al equipo a contactochronoshield@gmail.com y te responden personalmente.",
      relacionados: chips(sug)
    };
  }
  function porTema(id) {
    var e = porId(id);
    return e ? { encontrado: true, id: e.id, texto: e.respuesta, relacionados: chips(e.relacionados) } : null;
  }

  window.CSNBiblioteca = { responder: responder, porTema: porTema, temas: function () { return chips(DATA.map(function (e) { return e.id; })); } };
})();
