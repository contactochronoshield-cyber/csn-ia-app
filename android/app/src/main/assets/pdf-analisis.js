/* CSN IA - analisis estatico de PDF en el dispositivo (sin servidor).
   Nunca ejecuta el PDF: lee bytes, busca senales de riesgo y metadatos. */
(function (root) {
  'use strict';
  var MAX_BYTES = 20 * 1024 * 1024;
  var MAX_INFLADO = 10 * 1024 * 1024;
  var MAX_TOTAL_INFLADO = 40 * 1024 * 1024;
  var MAX_STREAMS = 300;
  var SENALES = {
    JavaScript: [4, 'Contiene código JavaScript'],
    JS: [3, 'Referencia a código JS'],
    Launch: [5, 'Intenta lanzar un programa externo'],
    OpenAction: [2, 'Acción automática al abrir'],
    AA: [1, 'Acciones adicionales automáticas'],
    EmbeddedFile: [3, 'Lleva archivos incrustados'],
    RichMedia: [2, 'Contenido multimedia incrustado'],
    XFA: [2, 'Formulario XFA (superficie de ataque mayor)'],
    GoToR: [1, 'Salto a otro archivo remoto'],
    SubmitForm: [1, 'Envía datos de formulario a un destino externo']
  };
  var INFORMATIVAS = ['ObjStm', 'Encrypt', 'AcroForm', 'URI'];
  var ACORTADORES = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'cutt.ly', 'ow.ly', 'rebrand.ly', 'shorturl.at'];
  var CAMPOS = ['Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer', 'CreationDate', 'ModDate'];
  var RE_NOMBRE_OFUSCADO = /\/[A-Za-z0-9_.#+-]*#[0-9A-Fa-f]{2}[A-Za-z0-9_.#+-]*/g;

  function aLatin1(u8) {
    var out = [], n = 8192;
    for (var i = 0; i < u8.length; i += n) out.push(String.fromCharCode.apply(null, u8.subarray(i, i + n)));
    return out.join('');
  }
  function aBytes(s) {
    var u = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i) & 255;
    return u;
  }
  function decodificarNombre(m) {
    return m.replace(/#([0-9A-Fa-f]{2})/g, function (_, h) { return String.fromCharCode(parseInt(h, 16)); });
  }
  function desofuscar(t) {
    return t.replace(RE_NOMBRE_OFUSCADO, decodificarNombre);
  }
  function contarOfuscados(t) {
    var m = t.match(RE_NOMBRE_OFUSCADO) || [], n = 0;
    m.forEach(function (x) {
      var nombre = decodificarNombre(x).slice(1);
      if (SENALES[nombre] || INFORMATIVAS.indexOf(nombre) >= 0) n++;
    });
    return n;
  }
  function pdfStr(s) {
    if (s.charCodeAt(0) === 0xFE && s.charCodeAt(1) === 0xFF) {
      var o = '';
      for (var i = 2; i + 1 < s.length; i += 2) o += String.fromCharCode((s.charCodeAt(i) << 8) | s.charCodeAt(i + 1));
      return o;
    }
    return s.replace(/\\([()\\])/g, '$1');
  }
  function fechaPdf(v) {
    var m = /^D:(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?(\d{2})?/.exec(v || '');
    if (!m) return v;
    return m[1] + '-' + (m[2] || '01') + '-' + (m[3] || '01') + ' ' + (m[4] || '00') + ':' + (m[5] || '00') + ':' + (m[6] || '00');
  }
  function extraerInfo(t, info) {
    CAMPOS.forEach(function (k) {
      if (info[k]) return;
      var re = new RegExp('/' + k + '\\s*\\(((?:\\\\[\\s\\S]|[^\\\\)])*)\\)');
      var m = re.exec(t);
      if (m) {
        var v = pdfStr(m[1]).trim();
        info[k] = k.indexOf('Date') >= 0 ? fechaPdf(v) : v.slice(0, 200);
      }
    });
  }
  function extraerXmp(raw) {
    var m = /<x:xmpmeta[\s\S]*?<\/x:xmpmeta>/.exec(raw);
    if (!m) return {};
    var xml = m[0];
    try { xml = decodeURIComponent(escape(xml)); } catch (e) { /* queda en latin1 */ }
    var out = {};
    ['CreatorTool', 'Producer', 'CreateDate', 'ModifyDate', 'creator'].forEach(function (tag) {
      var mm = new RegExp('<[\\w:]*' + tag + '[^>]*>([\\s\\S]*?)</[\\w:]*' + tag + '>').exec(xml);
      if (mm) out[tag] = mm[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
    });
    return out;
  }
  function escanear(texto, acc) {
    var t = desofuscar(texto);
    Object.keys(acc.conteo).forEach(function (k) {
      var m = t.match(new RegExp('/' + k + '(?![A-Za-z])', 'g'));
      if (m) acc.conteo[k] += m.length;
    });
    var u = t.match(/https?:\/\/[^\s)>"'\\<]{4,200}/g);
    if (u) u.forEach(function (x) { acc.urls[x] = 1; });
    extraerInfo(t, acc.info);
  }
  async function inflar(bytes) {
    var ds = new DecompressionStream('deflate');
    var w = ds.writable.getWriter();
    w.write(bytes).catch(function () {});
    w.close().catch(function () {});
    var r = ds.readable.getReader(), total = 0, partes = [];
    try {
      for (;;) {
        var x = await r.read();
        if (x.done) break;
        total += x.value.length;
        partes.push(aLatin1(x.value));
        if (total > MAX_INFLADO) { r.cancel(); break; }
      }
    } catch (e) { return null; }
    return partes.join('');
  }
  async function sha256(buf) {
    try {
      if (root.crypto && root.crypto.subtle) {
        var h = await root.crypto.subtle.digest('SHA-256', buf);
        return Array.prototype.map.call(new Uint8Array(h), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
      }
    } catch (e) { /* sin hash */ }
    return null;
  }

  async function analizar(buf) {
    if (buf.byteLength > MAX_BYTES) return { error: 'Archivo demasiado grande (máx 20 MB)' };
    var u8 = new Uint8Array(buf);
    var raw = aLatin1(u8);
    var hash = await sha256(buf);
    var pos = raw.indexOf('%PDF-');
    if (pos === -1) {
      return { esPdf: false, sha256: hash, riesgo: 'alto', puntaje: 10,
        hallazgos: ['No tiene cabecera PDF: el archivo no es un PDF real (posible extensión falsa)'], metadatos: {}, notas: [] };
    }
    var hallazgos = [], puntos = 0, parcial = false;
    if (pos > 0) { puntos += 2; hallazgos.push('Hay ' + pos + ' bytes antes de la cabecera PDF (posible manipulación)'); }

    var ofus = contarOfuscados(raw);
    if (ofus) { puntos += 2; hallazgos.push(ofus + ' nombre(s) ofuscado(s) con #xx (técnica de evasión)'); }

    var acc = { conteo: {}, urls: {}, info: {} };
    Object.keys(SENALES).concat(INFORMATIVAS).forEach(function (k) { acc.conteo[k] = 0; });

    // 1) Estructura del PDF sin los cuerpos binarios de los streams (evita falsos positivos)
    escanear(raw.replace(/stream\r?\n[\s\S]*?\r?\nendstream/g, 'stream\nendstream'), acc);

    // 2) Contenido de streams comprimidos (objetos ocultos)
    var hayDS = typeof DecompressionStream !== 'undefined';
    var re = /stream\r?\n([\s\S]*?)\r?\nendstream/g, m, n = 0, total = 0, hayCompr = false;
    while ((m = re.exec(raw)) !== null) {
      if (m[1].charCodeAt(0) !== 0x78) continue;
      hayCompr = true;
      if (!hayDS) { parcial = true; break; }
      if (n++ >= MAX_STREAMS || total > MAX_TOTAL_INFLADO) { parcial = true; break; }
      var t = await inflar(aBytes(m[1]));
      if (t) { total += t.length; escanear(t, acc); }
    }

    Object.keys(SENALES).forEach(function (k) {
      if (acc.conteo[k]) { puntos += SENALES[k][0]; hallazgos.push(SENALES[k][1] + ' (/' + k + ' ×' + acc.conteo[k] + ')'); }
    });
    if (acc.conteo.ObjStm) hallazgos.push('Usa objetos comprimidos (/ObjStm): el análisis puede ser parcial');
    if (acc.conteo.Encrypt) { puntos += 1; hallazgos.push('Está cifrado (/Encrypt): no se pudo revisar todo el contenido'); }
    if (parcial) hallazgos.push('Análisis parcial: el archivo tiene demasiado contenido comprimido o este sistema no puede descomprimirlo');

    var dominios = {}, sospechosos = [];
    Object.keys(acc.urls).slice(0, 200).forEach(function (u) {
      var mm = /^https?:\/\/([^\/:?#]+)/i.exec(u);
      if (mm) { var h = mm[1].toLowerCase(); dominios[h] = (dominios[h] || 0) + 1; }
    });
    Object.keys(dominios).forEach(function (h) {
      if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) sospechosos.push(h + ' (IP directa)');
      else if (ACORTADORES.indexOf(h) >= 0) sospechosos.push(h + ' (acortador de enlaces)');
    });
    if (sospechosos.length) { puntos += 2; hallazgos.push('Enlaces sospechosos: ' + sospechosos.join(', ')); }

    var info = acc.info, xmp = extraerXmp(raw), notas = [];
    if (info.CreationDate && info.ModDate && info.ModDate.slice(0, 10) !== info.CreationDate.slice(0, 10))
      notas.push('Fecha de modificación distinta a la de creación (el archivo fue editado)');
    if (!Object.keys(info).length && !Object.keys(xmp).length)
      notas.push('No se encontraron metadatos (limpiados a propósito, generados por una herramienta mínima o dentro de contenido comprimido)');
    if (info.Author) notas.push('Revela el nombre del autor: tenlo en cuenta antes de compartirlo');

    return {
      esPdf: true, version: raw.substr(pos + 5, 3), tamano: buf.byteLength, sha256: hash,
      riesgo: puntos >= 6 ? 'alto' : (puntos >= 2 ? 'medio' : 'bajo'), puntaje: puntos,
      hallazgos: hallazgos, metadatos: info, xmp: xmp, dominios: dominios, notas: notas,
      aviso: 'Análisis estático y heurístico. Que no aparezcan señales no garantiza que el archivo sea seguro.'
    };
  }

  function resumenSeguro(r) {
    var s = 'Riesgo ' + r.riesgo + '. ';
    s += r.hallazgos.length ? 'Hallazgos: ' + r.hallazgos.join('; ') + '.' : 'Sin señales de riesgo conocidas.';
    return s.slice(0, 600);
  }

  root.CSNPdf = { analizar: analizar, resumenSeguro: resumenSeguro };

  /* ---------- Interfaz: botón + en el chat ---------- */
  if (typeof document === 'undefined') return;

  function el(tag, texto, css) {
    var e = document.createElement(tag);
    if (texto) e.textContent = texto;
    if (css) e.style.cssText = css;
    return e;
  }
  function tarjeta(msgs) {
    var c = el('div', '', 'border:1px solid var(--line,#2a3444);border-radius:12px;padding:12px;margin:8px;font-size:14px;line-height:1.45;word-break:break-word');
    msgs.appendChild(c);
    msgs.scrollTop = msgs.scrollHeight;
    return c;
  }
  function mostrar(c, nombre, r, q) {
    c.textContent = '';
    if (r.error) { c.appendChild(el('div', r.error)); return; }
    var icono = r.riesgo === 'alto' ? '🔴' : (r.riesgo === 'medio' ? '🟡' : '🟢');
    c.appendChild(el('div', 'Análisis de PDF: ' + nombre, 'font-weight:600;margin-bottom:6px'));
    c.appendChild(el('div', icono + ' Riesgo estimado: ' + r.riesgo, 'margin-bottom:6px'));
    if (r.hallazgos.length) r.hallazgos.forEach(function (h) { c.appendChild(el('div', '• ' + h)); });
    else c.appendChild(el('div', '• No se detectaron señales de riesgo conocidas'));
    var claves = Object.keys(r.metadatos);
    if (claves.length) {
      c.appendChild(el('div', 'Metadatos', 'font-weight:600;margin-top:8px'));
      claves.forEach(function (k) { c.appendChild(el('div', k + ': ' + r.metadatos[k])); });
    }
    Object.keys(r.xmp || {}).forEach(function (k) { c.appendChild(el('div', 'XMP ' + k + ': ' + r.xmp[k])); });
    r.notas.forEach(function (n) { c.appendChild(el('div', 'ℹ️ ' + n, 'margin-top:4px')); });
    if (r.sha256) c.appendChild(el('div', 'SHA-256: ' + r.sha256, 'margin-top:8px;font-size:12px;opacity:.8'));
    c.appendChild(el('div', r.aviso, 'margin-top:8px;font-size:12px;opacity:.8'));
    var b = el('button', 'Explícamelo', 'margin-top:10px;padding:8px 14px;border-radius:10px;border:1px solid var(--line,#2a3444);background:transparent;color:inherit');
    b.onclick = function () {
      if (typeof window.send === 'function') {
        q.value = 'Explícame en lenguaje simple este análisis de un PDF. ' + resumenSeguro(r);
        window.send();
      }
    };
    c.appendChild(b);
  }
  function iniciar() {
    var bar = document.querySelector('#t-chat #bar'), q = document.getElementById('q'), msgs = document.getElementById('msgs');
    if (!bar || !q || !msgs || document.getElementById('csn-pdf-btn')) return;
    var inp = el('input'); inp.type = 'file'; inp.accept = 'application/pdf,.pdf'; inp.style.display = 'none';
    var btn = el('button', '+', 'min-width:40px;width:40px;font-size:22px;border-radius:12px;border:1px solid var(--line,#2a3444);background:transparent;color:inherit;margin-right:6px');
    btn.id = 'csn-pdf-btn'; btn.type = 'button';
    btn.setAttribute('aria-label', 'Adjuntar PDF para analizar');
    btn.onclick = function () { inp.click(); };
    inp.onchange = function () {
      var f = inp.files && inp.files[0];
      if (!f) return;
      var c = tarjeta(msgs);
      c.textContent = 'Analizando ' + f.name + '…';
      if (f.size > MAX_BYTES) { mostrar(c, f.name, { error: 'Archivo demasiado grande (máx 20 MB)' }, q); inp.value = ''; return; }
      f.arrayBuffer().then(analizar).then(function (r) { mostrar(c, f.name, r, q); })
        .catch(function () { mostrar(c, f.name, { error: 'No se pudo leer el archivo.' }, q); })
        .then(function () { inp.value = ''; msgs.scrollTop = msgs.scrollHeight; });
    };
    bar.insertBefore(btn, q);
    bar.appendChild(inp);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})(typeof window !== 'undefined' ? window : globalThis);
