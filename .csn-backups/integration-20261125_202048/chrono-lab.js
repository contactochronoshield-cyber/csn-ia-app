/* Chrono Lab - laboratorio de programación y terminal educativa.
   Todo corre dentro del teléfono: sin servidor, sin internet. */
(function (root) {
  'use strict';

  /* ===================== LECCIONES DE JAVASCRIPT ===================== */
  var LECCIONES = [
    { id: 'hola', titulo: 'Tu primer programa',
      texto: 'console.log muestra un mensaje en pantalla. Lo que va entre comillas es texto.\n\nObjetivo: mostrar exactamente Hola, mundo',
      pista: "Escribe: console.log('Hola, mundo');",
      starter: "// Muestra Hola, mundo en pantalla\n",
      esperado: 'Hola, mundo',
      solucion: "console.log('Hola, mundo');" },
    { id: 'variables', titulo: 'Variables',
      texto: 'Una variable guarda un dato. Se crea con let.\n\nObjetivo: guarda el nombre Ana en la variable y muestra: Hola, Ana',
      pista: "Cambia CAMBIA_ESTO por Ana.",
      starter: "let nombre = 'CAMBIA_ESTO';\nconsole.log('Hola, ' + nombre);\n",
      esperado: 'Hola, Ana',
      solucion: "let nombre = 'Ana';\nconsole.log('Hola, ' + nombre);" },
    { id: 'condicional', titulo: 'Decisiones (if / else)',
      texto: "Un if hace que el programa decida.\n\nObjetivo: si edad es 18 o más, muestra mayor de edad; si no, menor de edad.",
      pista: "if (edad >= 18) { ... } else { ... }",
      starter: "const edad = 15;\n\n// tu código aquí\n",
      esperado: 'menor de edad',
      solucion: "const edad = 15;\nif (edad >= 18) {\n  console.log('mayor de edad');\n} else {\n  console.log('menor de edad');\n}" },
    { id: 'bucles', titulo: 'Bucles (for)',
      texto: 'Un bucle repite instrucciones.\n\nObjetivo: muestra los números del 1 al 5, uno por línea.',
      pista: 'Dentro del for, muestra i con console.log(i);',
      starter: "for (let i = 1; i <= 5; i++) {\n  // muestra i\n}\n",
      esperado: '1\n2\n3\n4\n5',
      solucion: "for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}" },
    { id: 'funciones', titulo: 'Funciones',
      texto: 'Una función agrupa instrucciones con un nombre para reutilizarlas.\n\nObjetivo: crea suma(a, b) que devuelva a + b.',
      pista: 'Usa return a + b;',
      starter: "function suma(a, b) {\n  // tu código aquí\n}\n",
      tests: "console.log(suma(2, 3));\nconsole.log(suma(10, -4));",
      exTests: '5\n6',
      solucion: "function suma(a, b) {\n  return a + b;\n}" },
    { id: 'listas', titulo: 'Listas',
      texto: 'Una lista guarda varios datos: [1, 2, 3].\n\nObjetivo: crea contarPares(lista) que devuelva cuántos números pares hay.',
      pista: 'Un número es par si x % 2 === 0. Recorre la lista con for (const x of lista).',
      starter: "function contarPares(lista) {\n  // tu código aquí\n}\n",
      tests: "console.log(contarPares([1, 2, 3, 4, 5, 6]));\nconsole.log(contarPares([]));",
      exTests: '3\n0',
      solucion: "function contarPares(lista) {\n  let n = 0;\n  for (const x of lista) {\n    if (x % 2 === 0) n++;\n  }\n  return n;\n}" },
    { id: 'texto', titulo: 'Trabajar con texto',
      texto: 'El texto se puede cortar, unir y dar vuelta.\n\nObjetivo: crea invertir(texto) que lo devuelva al revés. invertir(\'ab\') da ba.',
      pista: "Prueba: texto.split('').reverse().join('')",
      starter: "function invertir(texto) {\n  // tu código aquí\n}\n",
      tests: "console.log(invertir('seguridad'));\nconsole.log(invertir('ab'));",
      exTests: 'dadiruges\nba',
      solucion: "function invertir(texto) {\n  return texto.split('').reverse().join('');\n}" },
    { id: 'contrasena', titulo: 'Seguridad: contraseña fuerte',
      texto: 'Primer proyecto de seguridad.\n\nObjetivo: crea esFuerte(clave) que devuelva true solo si tiene al menos 12 caracteres, una mayúscula, una minúscula y un número.',
      pista: 'Las expresiones /[A-Z]/.test(clave) y /[0-9]/.test(clave) comprueban si hay mayúsculas o números.',
      starter: "function esFuerte(clave) {\n  // tu código aquí\n}\n",
      tests: "console.log(esFuerte('abc'));\nconsole.log(esFuerte('Segura1234abc'));\nconsole.log(esFuerte('segura1234abcd'));\nconsole.log(esFuerte('SEGURA1234ABCD'));",
      exTests: 'false\ntrue\nfalse\nfalse',
      solucion: "function esFuerte(clave) {\n  return clave.length >= 12 && /[A-Z]/.test(clave) && /[a-z]/.test(clave) && /[0-9]/.test(clave);\n}" },
    { id: 'cesar', titulo: 'Criptografía: cifrado César',
      texto: 'El cifrado César mueve cada letra n lugares del abecedario. Se rompe en segundos: sirve para aprender, nunca para proteger datos reales.\n\nObjetivo: crea cesar(texto, n) que mueva las letras de la a a la z (minúsculas) y deje lo demás igual. cesar(\'xyz\', 3) da abc.',
      pista: "Código de una letra: c.charCodeAt(0). La a es 97. Usa % 26 para dar la vuelta.",
      starter: "function cesar(texto, n) {\n  // tu código aquí\n}\n",
      tests: "console.log(cesar('abc', 1));\nconsole.log(cesar('xyz', 3));\nconsole.log(cesar('hola mundo', 3));",
      exTests: 'bcd\nabc\nkrod pxqgr',
      solucion: "function cesar(texto, n) {\n  let r = '';\n  for (const c of texto) {\n    if (c >= 'a' && c <= 'z') {\n      r += String.fromCharCode((c.charCodeAt(0) - 97 + n) % 26 + 97);\n    } else {\n      r += c;\n    }\n  }\n  return r;\n}" },
    { id: 'url', titulo: 'Seguridad: enlace sospechoso',
      texto: 'Como en el análisis de PDF: un enlace con IP directa o con acortador esconde su destino.\n\nObjetivo: crea esSospechosa(url) que devuelva true si el host es una IP (como 192.168.1.5) o es bit.ly o tinyurl.com.',
      pista: "El host es url.split('/')[2]. Para saber si es una IP: /^\\d+\\.\\d+\\.\\d+\\.\\d+$/.test(host)",
      starter: "function esSospechosa(url) {\n  // tu código aquí\n}\n",
      tests: "console.log(esSospechosa('http://192.168.1.5/login'));\nconsole.log(esSospechosa('https://bit.ly/abc'));\nconsole.log(esSospechosa('https://ejemplo.com/inicio'));",
      exTests: 'true\ntrue\nfalse',
      solucion: "function esSospechosa(url) {\n  const host = url.split('/')[2];\n  return /^\\d+\\.\\d+\\.\\d+\\.\\d+$/.test(host) || host === 'bit.ly' || host === 'tinyurl.com';\n}" }
  ];

  function normalizar(s) {
    return String(s).replace(/\r/g, '').split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).join('\n').replace(/^\n+|\n+$/g, '');
  }

  // ejecutor(codigo) -> Promise({salida:[...], error?})
  function comprobar(lec, codigo, ejecutor) {
    var tests = lec.tests !== undefined;
    var fuente = tests ? codigo + '\n;console.log("@@T");\n' + lec.tests : codigo;
    return ejecutor(fuente).then(function (r) {
      if (r.error) return { ok: false, error: r.error, obtenido: r.salida.join('\n') };
      var obtenido;
      if (tests) {
        var i = r.salida.indexOf('@@T');
        if (i < 0) return { ok: false, error: 'No se pudo comprobar tu código.', obtenido: '' };
        obtenido = r.salida.slice(i + 1).join('\n');
      } else {
        obtenido = r.salida.join('\n');
      }
      var esperado = tests ? lec.exTests : lec.esperado;
      return { ok: normalizar(obtenido) === normalizar(esperado), obtenido: obtenido, esperado: esperado };
    });
  }

  /* ===================== EJECUTOR EN UN WORKER ===================== */
  function trabajador() {
    var texto = function (a) {
      return (a !== null && typeof a === 'object') ? (function () { try { return JSON.stringify(a); } catch (e) { return String(a); } })() : String(a);
    };
    var log = function () { postMessage({ t: 'log', v: Array.prototype.map.call(arguments, texto).join(' ') }); };
    self.console = { log: log, error: log, warn: log, info: log };
    self.fetch = undefined; self.XMLHttpRequest = undefined; self.WebSocket = undefined; self.importScripts = undefined;
    self.onmessage = function (e) {
      try { new Function(e.data)(); postMessage({ t: 'fin' }); }
      catch (err) { postMessage({ t: 'err', v: String((err && err.message) || err) }); }
    };
  }

  function ejecutorNavegador(codigo) {
    return new Promise(function (resolve) {
      var salida = [], listo = false, w, url, timer;
      function fin(error) {
        if (listo) return;
        listo = true;
        clearTimeout(timer);
        try { if (w) w.terminate(); } catch (e) { /* nada */ }
        try { if (url) URL.revokeObjectURL(url); } catch (e) { /* nada */ }
        resolve({ salida: salida, error: error });
      }
      try {
        url = URL.createObjectURL(new Blob(['(' + trabajador.toString() + ')();'], { type: 'application/javascript' }));
        w = new Worker(url);
      } catch (e) {
        resolve({ salida: [], error: 'Este dispositivo no permite ejecutar código aquí.' });
        return;
      }
      w.onmessage = function (m) {
        var d = m.data || {};
        if (d.t === 'log') { if (salida.length < 300) salida.push(d.v); }
        else if (d.t === 'fin') fin();
        else if (d.t === 'err') fin(d.v);
      };
      w.onerror = function (e) { fin((e && e.message) || 'Error al ejecutar.'); };
      timer = setTimeout(function () { fin('Tardó demasiado (¿un bucle infinito?). Se detuvo.'); }, 3000);
      w.postMessage(codigo);
    });
  }

  /* ===================== TERMINAL EDUCATIVA ===================== */
  var CLEAR = '\u0000CLEAR';
  var BLOQUEADOS = ['__proto__', 'constructor', 'prototype'];
  var AYUDA = {
    help: 'help — lista los comandos.',
    man: 'man comando — explica un comando.',
    pwd: 'pwd — muestra en qué carpeta estás.',
    ls: 'ls [-l] [carpeta] — lista archivos. -l muestra permisos.',
    cd: 'cd carpeta — entra a una carpeta. cd .. sube, cd ~ vuelve al inicio.',
    cat: 'cat archivo — muestra el contenido de un archivo.',
    head: 'head [-n N] archivo — muestra las primeras N líneas (10 por defecto).',
    grep: 'grep [-i] texto archivo — muestra las líneas que contienen el texto.',
    wc: 'wc archivo — cuenta líneas, palabras y caracteres.',
    mkdir: 'mkdir [-p] carpeta — crea una carpeta.',
    touch: 'touch archivo — crea un archivo vacío.',
    rm: 'rm [-r] nombre — borra un archivo (con -r, una carpeta). Aquí es virtual y seguro; en un Linux real no hay papelera.',
    echo: "echo texto — muestra texto. Con > guarda en un archivo: echo hola > a.txt (>> agrega al final).",
    chmod: 'chmod 644 archivo — cambia permisos (tres dígitos: dueño, grupo, otros; 4=leer, 2=escribir, 1=ejecutar).',
    clear: 'clear — limpia la pantalla.',
    whoami: 'whoami — tu usuario.',
    date: 'date — fecha y hora.',
    uname: 'uname — sistema (simulado).',
    history: 'history — comandos que has usado.',
    ping: 'ping sitio — prueba de conexión SIMULADA: no sale a internet.',
    nslookup: 'nslookup sitio — consulta DNS SIMULADA con IPs de documentación.',
    ipcalc: 'ipcalc 192.168.1.10/24 — calcula red, máscara, broadcast y equipos (real).',
    sha256: 'sha256 texto|archivo — calcula el hash SHA-256 (real).',
    base64: 'base64 [-d] texto|archivo — codifica o decodifica en Base64 (real). Base64 NO es cifrado.'
  };

  function ipAStr(n) { return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }

  function ipcalc(arg) {
    var m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/.exec(arg || '');
    if (!m) return 'Uso: ipcalc 192.168.1.10/24';
    var o = [+m[1], +m[2], +m[3], +m[4]], p = +m[5];
    if (o.some(function (x) { return x > 255; }) || p > 32) return 'Dirección o prefijo no válido.';
    var ip = ((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]) >>> 0;
    var mask = p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0;
    var red = (ip & mask) >>> 0, bc = (red | (~mask >>> 0)) >>> 0;
    var hosts = p === 32 ? 1 : (p === 31 ? 2 : Math.pow(2, 32 - p) - 2);
    var primero = p >= 31 ? red : red + 1, ultimo = p >= 31 ? bc : bc - 1;
    var priv = o[0] === 10 || (o[0] === 172 && o[1] >= 16 && o[1] <= 31) || (o[0] === 192 && o[1] === 168);
    return ['Dirección:   ' + ipAStr(ip) + '/' + p, 'Máscara:     ' + ipAStr(mask), 'Red:         ' + ipAStr(red),
      'Broadcast:   ' + ipAStr(bc), 'Primer host: ' + ipAStr(primero), 'Último host: ' + ipAStr(ultimo),
      'Equipos útiles: ' + hosts, 'Tipo: ' + (priv ? 'red privada' : 'dirección pública')].join('\n');
  }

  function permisos(n) {
    var t = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
    var m = n.t === 'd' ? '755' : (n.m || '644');
    return (n.t === 'd' ? 'd' : '-') + t[+m.charAt(0)] + t[+m.charAt(1)] + t[+m.charAt(2)];
  }

  function nuevoFS() {
    function f(d, m) { return { t: 'f', d: d, m: m || '644' }; }
    function d(c) { return { t: 'd', c: c || {} }; }
    return d({
      home: d({ csn: d({
        'LEEME.txt': f('Bienvenido a Chrono Lab.\nEsta terminal es educativa: el sistema de archivos es virtual y no toca tu teléfono.\nPrueba: ls, cat LEEME.txt, help\n\nReto: ¿desde qué IP intentaron entrar sin éxito?\nPista: grep fallido logs/acceso.log'),
        notas: d({ 'ideas.txt': f('Aprender redes\nAprender Linux\nPracticar cada día') }),
        logs: d({ 'acceso.log': f('2026-11-23 08:01 login ok usuario=ana ip=203.0.113.10\n2026-11-23 08:05 login fallido usuario=admin ip=198.51.100.7\n2026-11-23 08:05 login fallido usuario=admin ip=198.51.100.7\n2026-11-23 08:06 login fallido usuario=root ip=198.51.100.7\n2026-11-23 09:12 login ok usuario=luis ip=203.0.113.22') })
      }) }),
      etc: d({ hosts: f('127.0.0.1 localhost') }),
      tmp: d({})
    });
  }

  function tienePropio(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function buscar(fs, ps) {
    var n = fs;
    for (var i = 0; i < ps.length; i++) {
      if (!n || n.t !== 'd' || !tienePropio(n.c, ps[i])) return null;
      n = n.c[ps[i]];
    }
    return n;
  }
  function nombreValido(n) { return /^[\w.\-áéíóúñÁÉÍÓÚÑ]+$/.test(n) && BLOQUEADOS.indexOf(n) < 0 && n !== '.' && n !== '..'; }

  function tokenizar(linea) {
    var t = [], cur = '', q = null, hay = false;
    for (var i = 0; i < linea.length; i++) {
      var ch = linea.charAt(i);
      if (q) { if (ch === q) q = null; else cur += ch; continue; }
      if (ch === '"' || ch === "'") { q = ch; hay = true; continue; }
      if (ch === ' ' || ch === '\t') { if (cur || hay) { t.push({ v: cur }); cur = ''; hay = false; } continue; }
      if (ch === '>') {
        if (cur || hay) { t.push({ v: cur }); cur = ''; hay = false; }
        if (linea.charAt(i + 1) === '>') { t.push({ op: '>>' }); i++; } else t.push({ op: '>' });
        continue;
      }
      cur += ch;
    }
    if (q) return null;
    if (cur || hay) t.push({ v: cur });
    return t;
  }

  function b64codificar(texto) {
    var bytes = new TextEncoder().encode(texto), s = '';
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }
  function b64decodificar(texto) {
    var s = atob(texto.replace(/\s+/g, '')), bytes = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }

  function crearTerminal(opc) {
    var sha = (opc && opc.sha256) || null;
    var fs = nuevoFS();
    var cwd = ['home', 'csn'];
    var hist = [];

    function partes(ruta) {
      var base = ruta.charAt(0) === '/' ? [] : (ruta.charAt(0) === '~' ? ['home', 'csn'] : cwd.slice());
      if (ruta.charAt(0) === '~') ruta = ruta.slice(1);
      ruta.split('/').forEach(function (p) {
        if (!p || p === '.') return;
        if (p === '..') base.pop(); else base.push(p);
      });
      return base;
    }
    function nodo(ruta) { return buscar(fs, partes(ruta)); }
    function padre(ruta) {
      var ps = partes(ruta), nom = ps.pop();
      return { dir: buscar(fs, ps), nombre: nom };
    }
    function fichero(ruta) {
      var n = nodo(ruta);
      if (!n) return { err: 'no existe: ' + ruta };
      if (n.t !== 'f') return { err: ruta + ' es una carpeta' };
      return { n: n };
    }
    function fmtLargo(nombre, n) {
      return permisos(n) + ' csn ' + (n.t === 'f' ? String(n.d.length).padStart(5, ' ') : '    -') + ' ' + nombre + (n.t === 'd' ? '/' : '');
    }
    function escribir(ruta, texto, agregar) {
      var p = padre(ruta);
      if (!p.nombre || !p.dir || p.dir.t !== 'd') return 'No existe la carpeta de destino.';
      if (!nombreValido(p.nombre)) return 'Nombre de archivo no válido: ' + p.nombre;
      var ex = tienePropio(p.dir.c, p.nombre) ? p.dir.c[p.nombre] : null;
      if (ex && ex.t === 'd') return p.nombre + ' es una carpeta.';
      if (ex && agregar) ex.d += texto; else p.dir.c[p.nombre] = { t: 'f', d: texto, m: ex ? ex.m : '644' };
      return '';
    }
    function ipFalsa(h) {
      if (h === 'localhost') return '127.0.0.1';
      var s = 0;
      for (var i = 0; i < h.length; i++) s += h.charCodeAt(i);
      return '203.0.113.' + (1 + (s % 253));
    }

    var cmds = {
      help: function () {
        return 'Comandos: ' + Object.keys(AYUDA).join(', ') + '\n(ping y nslookup son simulados.) Usa man comando para ver cómo se usa. Guarda salidas con > archivo.';
      },
      man: function (a) { return a[0] ? (AYUDA[a[0]] && tienePropio(AYUDA, a[0]) ? AYUDA[a[0]] : 'No hay manual para: ' + a[0]) : 'Uso: man comando'; },
      pwd: function () { return '/' + cwd.join('/'); },
      ls: function (a) {
        var largo = false, ruta = '.';
        a.forEach(function (x) { if (x.charAt(0) === '-') { if (x.indexOf('l') > 0) largo = true; } else ruta = x; });
        var n = nodo(ruta);
        if (!n) return 'ls: no existe: ' + ruta;
        if (n.t === 'f') return largo ? fmtLargo(ruta, n) : ruta;
        var nombres = Object.keys(n.c).sort();
        return nombres.map(function (k) { var c = n.c[k]; return largo ? fmtLargo(k, c) : k + (c.t === 'd' ? '/' : ''); }).join(largo ? '\n' : '  ');
      },
      cd: function (a) {
        var ruta = a[0] || '~', ps = partes(ruta), n = buscar(fs, ps);
        if (!n) return 'cd: no existe: ' + ruta;
        if (n.t !== 'd') return 'cd: no es una carpeta: ' + ruta;
        cwd = ps;
        return '';
      },
      cat: function (a) {
        if (!a.length) return 'cat: falta el nombre del archivo';
        return a.map(function (r) { var x = fichero(r); return x.err ? 'cat: ' + x.err : x.n.d; }).join('\n');
      },
      head: function (a) {
        var n = 10, ruta = null;
        for (var i = 0; i < a.length; i++) { if (a[i] === '-n' && a[i + 1]) { n = Math.max(0, parseInt(a[i + 1], 10) || 10); i++; } else ruta = a[i]; }
        if (!ruta) return 'head: falta el nombre del archivo';
        var x = fichero(ruta);
        return x.err ? 'head: ' + x.err : x.n.d.split('\n').slice(0, n).join('\n');
      },
      grep: function (a) {
        var ins = false, resto = [];
        a.forEach(function (x) { if (x === '-i') ins = true; else resto.push(x); });
        if (resto.length < 2) return 'Uso: grep [-i] texto archivo';
        var pat = ins ? resto[0].toLowerCase() : resto[0], res = [];
        resto.slice(1).forEach(function (r) {
          var x = fichero(r);
          if (x.err) { res.push('grep: ' + x.err); return; }
          x.n.d.split('\n').forEach(function (l) {
            if ((ins ? l.toLowerCase() : l).indexOf(pat) >= 0) res.push(resto.length > 2 ? r + ': ' + l : l);
          });
        });
        return res.join('\n');
      },
      wc: function (a) {
        if (!a[0]) return 'wc: falta el nombre del archivo';
        var x = fichero(a[0]);
        if (x.err) return 'wc: ' + x.err;
        var t = x.n.d;
        return (t ? t.split('\n').length : 0) + ' líneas  ' + (t.trim() ? t.trim().split(/\s+/).length : 0) + ' palabras  ' + t.length + ' caracteres';
      },
      mkdir: function (a) {
        var p = false, out = [];
        a.forEach(function (x) { if (x === '-p') p = true; });
        a.filter(function (x) { return x !== '-p'; }).forEach(function (r) {
          if (p) {
            var ps = partes(r), n = fs, ok = true;
            ps.forEach(function (s) {
              if (!ok) return;
              if (!nombreValido(s)) { ok = false; out.push('mkdir: nombre no válido: ' + s); return; }
              if (!tienePropio(n.c, s)) n.c[s] = { t: 'd', c: {} };
              if (n.c[s].t !== 'd') { ok = false; out.push('mkdir: ' + s + ' es un archivo'); return; }
              n = n.c[s];
            });
            return;
          }
          var q = padre(r);
          if (!q.nombre || !q.dir || q.dir.t !== 'd') { out.push('mkdir: no existe la carpeta de destino'); return; }
          if (!nombreValido(q.nombre)) { out.push('mkdir: nombre no válido: ' + q.nombre); return; }
          if (tienePropio(q.dir.c, q.nombre)) { out.push('mkdir: ya existe: ' + r); return; }
          q.dir.c[q.nombre] = { t: 'd', c: {} };
        });
        return a.length ? out.join('\n') : 'mkdir: falta el nombre de la carpeta';
      },
      touch: function (a) {
        if (!a.length) return 'touch: falta el nombre del archivo';
        var out = [];
        a.forEach(function (r) {
          var q = padre(r);
          if (!q.nombre || !q.dir || q.dir.t !== 'd') { out.push('touch: no existe la carpeta de destino'); return; }
          if (!nombreValido(q.nombre)) { out.push('touch: nombre no válido: ' + q.nombre); return; }
          if (!tienePropio(q.dir.c, q.nombre)) q.dir.c[q.nombre] = { t: 'f', d: '', m: '644' };
        });
        return out.join('\n');
      },
      rm: function (a) {
        var rec = a.indexOf('-r') >= 0 || a.indexOf('-rf') >= 0, out = [];
        var nombres = a.filter(function (x) { return x.charAt(0) !== '-'; });
        if (!nombres.length) return 'rm: falta el nombre';
        nombres.forEach(function (r) {
          var q = padre(r);
          if (!q.nombre || !q.dir || !tienePropio(q.dir.c, q.nombre)) { out.push('rm: no existe: ' + r); return; }
          if (q.dir.c[q.nombre].t === 'd' && !rec) { out.push('rm: ' + r + ' es una carpeta (usa -r)'); return; }
          delete q.dir.c[q.nombre];
        });
        return out.join('\n');
      },
      echo: function (a) { return a.join(' '); },
      chmod: function (a) {
        if (a.length < 2 || !/^[0-7]{3}$/.test(a[0])) return 'Uso: chmod 644 archivo';
        var n = nodo(a[1]);
        if (!n) return 'chmod: no existe: ' + a[1];
        if (n.t === 'f') n.m = a[0];
        return '';
      },
      clear: function () { return CLEAR; },
      whoami: function () { return 'csn'; },
      date: function () { try { return new Date().toLocaleString('es-CO'); } catch (e) { return new Date().toString(); } },
      uname: function () { return 'ChronoLab 1.0 (simulado)'; },
      history: function () { return hist.map(function (h, i) { return (i + 1) + '  ' + h; }).join('\n'); },
      ping: function (a) {
        if (!a[0]) return 'Uso: ping sitio';
        var ip = ipFalsa(a[0]), l = ['PING ' + a[0] + ' (' + ip + ') — SIMULADO, no sale a internet'], tot = 0;
        for (var i = 1; i <= 4; i++) { var t = 18 + Math.floor(Math.random() * 50); tot += t; l.push('64 bytes de ' + ip + ': icmp_seq=' + i + ' ttl=57 tiempo=' + t + ' ms'); }
        l.push('4 enviados, 4 recibidos, promedio ' + Math.round(tot / 4) + ' ms');
        return l.join('\n');
      },
      nslookup: function (a) {
        if (!a[0]) return 'Uso: nslookup sitio';
        return 'Servidor: 192.0.2.1 (simulado)\nNombre:   ' + a[0] + '\nDirección: ' + ipFalsa(a[0]) + '\n(Las IPs 203.0.113.x son de documentación: no son reales.)';
      },
      ipcalc: function (a) { return ipcalc(a[0]); },
      sha256: function (a) {
        if (!a.length) return 'Uso: sha256 texto|archivo';
        var arg = a.join(' '), n = a.length === 1 ? nodo(a[0]) : null;
        var dato = n && n.t === 'f' ? n.d : arg;
        if (!sha) return 'SHA-256 no está disponible en este dispositivo.';
        return sha(dato).then(function (h) { return h ? h + '  ' + (n && n.t === 'f' ? a[0] : '"' + arg + '"') : 'SHA-256 no está disponible en este dispositivo.'; });
      },
      base64: function (a) {
        var dec = a[0] === '-d', resto = dec ? a.slice(1) : a;
        if (!resto.length) return 'Uso: base64 [-d] texto|archivo';
        var n = resto.length === 1 ? nodo(resto[0]) : null;
        var dato = n && n.t === 'f' ? n.d : resto.join(' ');
        try { return dec ? b64decodificar(dato) : b64codificar(dato); } catch (e) { return 'base64: dato no válido'; }
      }
    };

    function exec(linea) {
      linea = (linea || '').trim();
      if (!linea) return Promise.resolve('');
      hist.push(linea);
      if (hist.length > 100) hist.shift();
      var tk = tokenizar(linea);
      if (!tk) return Promise.resolve('Falta cerrar una comilla.');
      var args = [], redir = null, destino = null;
      for (var i = 0; i < tk.length; i++) {
        if (tk[i].op) { redir = tk[i].op; destino = tk[i + 1] && tk[i + 1].v; break; }
        args.push(tk[i].v);
      }
      if (redir && !destino) return Promise.resolve('Falta el nombre del archivo después de ' + redir);
      var nombre = args.shift();
      if (!nombre) return Promise.resolve('');
      if (!tienePropio(cmds, nombre)) return Promise.resolve('Comando no encontrado: ' + nombre + '. Escribe help para ver los disponibles.');
      var res;
      try { res = cmds[nombre](args); } catch (e) { res = 'Error: ' + e.message; }
      return Promise.resolve(res).then(function (out) {
        out = out == null ? '' : String(out);
        if (redir && out !== CLEAR) return escribir(destino, out + '\n', redir === '>>');
        return out;
      });
    }
    function prompt() {
      var s = cwd.join('/'), h = 'home/csn';
      var ruta = s === h ? '~' : (s.indexOf(h + '/') === 0 ? '~' + s.slice(h.length) : '/' + s);
      return 'csn@lab:' + ruta + '$ ';
    }
    return { exec: exec, prompt: prompt, historial: function () { return hist.slice(); }, CLEAR: CLEAR };
  }

  root.CSNLab = { LECCIONES: LECCIONES, crearTerminal: crearTerminal, comprobar: comprobar, ipcalc: ipcalc, ejecutorNavegador: ejecutorNavegador };
  if (typeof document === 'undefined') return;

  /* ===================== INTERFAZ ===================== */
  function el(tag, texto, css) {
    var e = document.createElement(tag);
    if (texto) e.textContent = texto;
    if (css) e.style.cssText = css;
    return e;
  }
  function leerProg() { try { return JSON.parse(localStorage.getItem('csn_lab_prog') || '{}') || {}; } catch (e) { return {}; } }
  function guardarProg(p) { try { localStorage.setItem('csn_lab_prog', JSON.stringify(p)); } catch (e) { /* sin almacenamiento */ } }
  function sha256Navegador(texto) {
    var c = root.crypto;
    if (!c || !c.subtle || typeof TextEncoder === 'undefined') return Promise.resolve(null);
    return c.subtle.digest('SHA-256', new TextEncoder().encode(texto)).then(function (h) {
      return Array.prototype.map.call(new Uint8Array(h), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    }).catch(function () { return null; });
  }
  function boton(texto, css) {
    var b = el('button', texto, 'padding:8px 12px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#0f172a;font-size:14px;' + (css || ''));
    b.type = 'button';
    return b;
  }

  var ui = null;

  function construir() {
    var raiz = el('div', '', 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:99998;background:#fff;color:#0f172a;display:none;flex-direction:column;font-size:15px;line-height:1.4');
    var cab = el('div', '', 'display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid #e2e8f0;background:#f8fafc');
    cab.appendChild(el('div', '🧪 Chrono Lab', 'font-weight:700;flex:1'));
    var cerrar = boton('✕', 'padding:6px 12px');
    cerrar.setAttribute('aria-label', 'Cerrar');
    cerrar.onclick = function () { raiz.style.display = 'none'; };
    cab.appendChild(cerrar);
    var tabs = el('div', '', 'display:flex;gap:6px;padding:8px 12px;border-bottom:1px solid #e2e8f0');
    var tLec = boton('Lecciones'), tTer = boton('Terminal');
    tabs.appendChild(tLec); tabs.appendChild(tTer);
    var cuerpo = el('div', '', 'flex:1;min-height:0;display:flex;flex-direction:column');
    var pLec = el('div', '', 'flex:1;min-height:0;overflow:auto;padding:12px');
    var pTer = el('div', '', 'flex:1;min-height:0;display:none;flex-direction:column;background:#0b1220');
    cuerpo.appendChild(pLec); cuerpo.appendChild(pTer);
    raiz.appendChild(cab); raiz.appendChild(tabs); raiz.appendChild(cuerpo);
    document.body.appendChild(raiz);

    function marcar(activo) {
      [[tLec, 'lec'], [tTer, 'ter']].forEach(function (p) {
        p[0].style.background = p[1] === activo ? '#2563eb' : '#fff';
        p[0].style.color = p[1] === activo ? '#fff' : '#0f172a';
      });
    }
    function mostrarTab(t) {
      marcar(t);
      pLec.style.display = t === 'lec' ? 'block' : 'none';
      pTer.style.display = t === 'ter' ? 'flex' : 'none';
      if (t === 'ter') { iniciarTerminal(); }
    }
    tLec.onclick = function () { mostrarTab('lec'); };
    tTer.onclick = function () { mostrarTab('ter'); };

    /* ---------- Lecciones ---------- */
    function listaLecciones() {
      pLec.textContent = '';
      var prog = leerProg(), hechas = LECCIONES.filter(function (l) { return prog[l.id]; }).length;
      pLec.appendChild(el('div', 'Aprende JavaScript con ejercicios que se comprueban solos.', 'font-weight:600'));
      pLec.appendChild(el('div', 'Completadas: ' + hechas + ' de ' + LECCIONES.length + '. Funciona sin internet.', 'margin:4px 0 12px;color:#475569;font-size:14px'));
      LECCIONES.forEach(function (l, i) {
        var b = boton((prog[l.id] ? '✅ ' : (i + 1) + '. ') + l.titulo, 'display:block;width:100%;text-align:left;margin-bottom:8px;padding:12px');
        b.onclick = function () { leccion(i); };
        pLec.appendChild(b);
      });
    }

    function leccion(i) {
      var l = LECCIONES[i];
      pLec.textContent = '';
      var atras = boton('← Lecciones', 'margin-bottom:10px');
      atras.onclick = listaLecciones;
      pLec.appendChild(atras);
      pLec.appendChild(el('div', (i + 1) + '. ' + l.titulo, 'font-weight:700;font-size:17px;margin-bottom:6px'));
      pLec.appendChild(el('div', l.texto, 'white-space:pre-wrap;margin-bottom:10px'));
      var pista = el('div', 'Pista: ' + l.pista, 'display:none;margin-bottom:10px;padding:8px;background:#fef9c3;border-radius:8px;font-size:14px;white-space:pre-wrap');
      pLec.appendChild(pista);
      var ed = el('textarea', '', 'width:100%;box-sizing:border-box;min-height:190px;font-family:monospace;font-size:14px;background:#0f172a;color:#e2e8f0;padding:10px;border-radius:10px;border:0;white-space:pre;overflow:auto;tab-size:2');
      ed.value = l.starter;
      ed.setAttribute('autocapitalize', 'off'); ed.setAttribute('autocomplete', 'off'); ed.setAttribute('autocorrect', 'off');
      ed.spellcheck = false;
      pLec.appendChild(ed);
      var simb = el('div', '', 'display:flex;flex-wrap:wrap;gap:4px;margin:8px 0');
      ['  ', '{', '}', '(', ')', '[', ']', ';', "'", '"', '=', '>', '<', '+', '-', '*', '/', '.', ',', '!', '&', '|', '%', '`', '_'].forEach(function (s) {
        var b = boton(s === '  ' ? 'Tab' : s, 'padding:6px 10px;font-family:monospace;min-width:36px');
        b.onclick = function () {
          var a = ed.selectionStart || 0, z = ed.selectionEnd || 0;
          ed.value = ed.value.slice(0, a) + s + ed.value.slice(z);
          ed.selectionStart = ed.selectionEnd = a + s.length;
          ed.focus();
        };
        simb.appendChild(b);
      });
      pLec.appendChild(simb);
      var acc = el('div', '', 'display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px');
      var bRun = boton('▶ Ejecutar', 'background:#2563eb;color:#fff;border-color:#2563eb');
      var bChk = boton('✔ Comprobar', 'background:#16a34a;color:#fff;border-color:#16a34a');
      var bPis = boton('💡 Pista'), bSol = boton('Ver solución'), bRes = boton('Restablecer');
      [bRun, bChk, bPis, bSol, bRes].forEach(function (b) { acc.appendChild(b); });
      pLec.appendChild(acc);
      var sal = el('pre', 'La salida aparece aquí.', 'margin:0;padding:10px;background:#f1f5f9;border-radius:10px;font-family:monospace;font-size:13px;white-space:pre-wrap;word-break:break-word;min-height:56px');
      pLec.appendChild(sal);
      var sig = el('div', '', 'margin-top:10px');
      pLec.appendChild(sig);

      bPis.onclick = function () { pista.style.display = pista.style.display === 'none' ? 'block' : 'none'; };
      bRes.onclick = function () { ed.value = l.starter; sal.textContent = 'La salida aparece aquí.'; };
      bSol.onclick = function () { ed.value = l.solucion; sal.textContent = 'Esta es una solución posible. Léela, entiéndela y pruébala con Ejecutar.'; };
      bRun.onclick = function () {
        sal.textContent = 'Ejecutando…';
        ejecutorNavegador(ed.value).then(function (r) {
          sal.textContent = (r.salida.join('\n') || '(sin salida)') + (r.error ? '\n⚠ ' + r.error : '');
        });
      };
      bChk.onclick = function () {
        sal.textContent = 'Comprobando…';
        sig.textContent = '';
        comprobar(l, ed.value, ejecutorNavegador).then(function (r) {
          if (r.ok) {
            var p = leerProg(); p[l.id] = true; guardarProg(p);
            sal.textContent = '✅ ¡Correcto! Lección completada.';
            if (i + 1 < LECCIONES.length) {
              var n = boton('Siguiente lección →', 'background:#2563eb;color:#fff;border-color:#2563eb');
              n.onclick = function () { leccion(i + 1); };
              sig.appendChild(n);
            }
          } else if (r.error) {
            sal.textContent = '⚠ ' + r.error;
          } else {
            sal.textContent = '❌ Todavía no.\n\nEsperado:\n' + r.esperado + '\n\nObtenido:\n' + (r.obtenido || '(nada)');
          }
        });
      };
    }

    /* ---------- Terminal ---------- */
    var term = null, salidaTer = null, entrada = null, hIdx = 0;
    function imprimir(texto, color) {
      var d = el('div', texto, 'white-space:pre-wrap;word-break:break-word;font-family:monospace;font-size:13px;color:' + (color || '#e2e8f0'));
      salidaTer.appendChild(d);
      salidaTer.scrollTop = salidaTer.scrollHeight;
    }
    function iniciarTerminal() {
      if (term) { entrada.focus(); return; }
      term = crearTerminal({ sha256: sha256Navegador });
      salidaTer = el('div', '', 'flex:1;min-height:0;overflow:auto;padding:10px');
      var fila = el('div', '', 'display:flex;align-items:center;gap:6px;padding:8px;border-top:1px solid #1e293b;background:#0b1220');
      var pr = el('span', term.prompt(), 'font-family:monospace;font-size:13px;color:#4ade80;white-space:nowrap');
      entrada = el('input', '', 'flex:1;min-width:0;background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:8px;padding:8px;font-family:monospace;font-size:14px');
      entrada.type = 'text';
      entrada.setAttribute('autocapitalize', 'off'); entrada.setAttribute('autocomplete', 'off'); entrada.setAttribute('autocorrect', 'off');
      entrada.setAttribute('enterkeyhint', 'send');
      entrada.spellcheck = false;
      var env = boton('⏎', 'background:#16a34a;color:#fff;border-color:#16a34a;padding:8px 14px');
      fila.appendChild(pr); fila.appendChild(entrada); fila.appendChild(env);
      var rapidos = el('div', '', 'display:flex;flex-wrap:wrap;gap:6px;padding:6px 8px;background:#0b1220');
      ['help', 'ls', 'pwd', 'cat LEEME.txt', 'clear'].forEach(function (c) {
        var b = boton(c, 'padding:4px 10px;background:#1e293b;color:#e2e8f0;border-color:#334155;font-family:monospace;font-size:13px');
        b.onclick = function () { entrada.value = c; ejecutar(); };
        rapidos.appendChild(b);
      });
      var arr = boton('↑', 'padding:4px 10px;background:#1e293b;color:#e2e8f0;border-color:#334155');
      arr.onclick = function () {
        var h = term.historial();
        if (!h.length) return;
        hIdx = Math.max(0, hIdx - 1);
        entrada.value = h[hIdx] || '';
      };
      rapidos.appendChild(arr);
      pTer.appendChild(salidaTer); pTer.appendChild(rapidos); pTer.appendChild(fila);
      imprimir('Chrono Lab — terminal educativa. Escribe help.\nEl sistema de archivos es virtual: no toca tu teléfono.', '#94a3b8');
      function ejecutar() {
        var linea = entrada.value;
        entrada.value = '';
        imprimir(pr.textContent + linea, '#4ade80');
        term.exec(linea).then(function (out) {
          if (out === term.CLEAR) { salidaTer.textContent = ''; }
          else if (out) { imprimir(out); }
          pr.textContent = term.prompt();
          hIdx = term.historial().length;
        });
      }
      env.onclick = ejecutar;
      entrada.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); ejecutar(); } };
      entrada.focus();
    }

    listaLecciones();
    return { raiz: raiz, mostrarTab: mostrarTab, listaLecciones: listaLecciones };
  }

  function abrir() {
    if (!ui) ui = construir();
    ui.raiz.style.display = 'flex';
    ui.mostrarTab('lec');
  }

  function iniciar() {
    var bar = document.querySelector('#t-chat #bar'), q = document.getElementById('q');
    if (!bar || !q || document.getElementById('csn-lab-btn')) return;
    var btn = el('button', '</>', 'min-width:40px;width:40px;font-size:14px;font-weight:700;font-family:monospace;border-radius:12px;border:1px solid var(--line,#2a3444);background:transparent;color:inherit;margin-right:6px');
    btn.id = 'csn-lab-btn'; btn.type = 'button';
    btn.setAttribute('aria-label', 'Laboratorio de programación');
    btn.onclick = abrir;
    var mas = document.getElementById('csn-pdf-btn');
    if (mas && mas.parentNode === bar) bar.insertBefore(btn, mas.nextSibling); else bar.insertBefore(btn, q);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})(typeof window !== 'undefined' ? window : globalThis);
