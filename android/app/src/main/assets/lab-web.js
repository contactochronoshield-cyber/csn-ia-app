(function (root) {
  'use strict';
  var ENT = '\\$_(?:GET|POST|REQUEST|COOKIE|FILES|SERVER)';
  var CMD = '(?:system|exec|shell_exec|passthru|popen|proc_open)';
  var REGLAS = [
    { sev: 'crítica', re: /\beval\s*\(/gi, msg: 'eval() ejecuta texto como código.', fix: 'Quita eval(); usa lógica explícita o una lista de funciones permitidas.' },
    { sev: 'crítica', re: new RegExp('\\b(?:include|require)(?:_once)?\\s*\\(?[^;\\n]*' + ENT, 'gi'), msg: 'include/require con datos del usuario (inclusión de archivos local o remota).', fix: 'Usa una lista blanca de archivos permitidos; nunca rutas del usuario.' },
    { sev: 'crítica', re: new RegExp('unserialize\\s*\\([^;\\n]*' + ENT, 'gi'), msg: 'unserialize() sobre datos del usuario (inyección de objetos).', fix: 'Usa json_decode() en lugar de unserialize().' },
    { sev: 'alta', re: new RegExp('(?:\\b(?:SELECT|INSERT|UPDATE|DELETE)\\b[^;\\n]*' + ENT + ')|(?:(?:mysqli?_query|->query|->exec|pg_query)\\s*\\([^;\\n]*' + ENT + ')', 'gi'), msg: 'Consulta SQL armada con datos del usuario (inyección SQL).', fix: 'Usa consultas preparadas (PDO::prepare con parámetros).' },
    { sev: 'alta', re: new RegExp('\\b' + CMD + '\\s*\\([^;\\n]*' + ENT, 'gi'), msg: 'Comando del sistema con datos del usuario (inyección de comandos).', fix: 'Evita ejecutar comandos; si es imprescindible, usa escapeshellarg() y una lista blanca.' },
    { sev: 'alta', re: new RegExp('\\b(?:echo|print)\\b(?![^;\\n]*(?:htmlspecialchars|htmlentities|intval|\\(int\\)))[^;\\n]*' + ENT, 'gi'), msg: 'Se imprime entrada del usuario sin escapar (XSS).', fix: 'Escapa con htmlspecialchars($x, ENT_QUOTES, "UTF-8").' },
    { sev: 'alta', re: new RegExp('extract\\s*\\([^;\\n]*' + ENT, 'gi'), msg: 'extract() sobre datos del usuario sobrescribe variables.', fix: 'Lee solo las claves que esperas, una por una.' },
    { sev: 'alta', re: new RegExp('(?:file_get_contents|fopen|readfile|curl_setopt)\\s*\\([^;\\n]*' + ENT, 'gi'), msg: 'Lectura de archivos o URLs controlada por el usuario (lectura de archivos / SSRF).', fix: 'Valida contra una lista blanca de rutas o dominios.' },
    { sev: 'alta', re: /(?:password|passwd|pwd|secret|api_?key|token)\s*=\s*['"][^'"\s]{4,}['"]/gi, msg: 'Posible credencial escrita en el código.', fix: 'Muévela a variables de entorno o a un archivo fuera de la web, y rota la clave.' },
    { sev: 'media', re: new RegExp('\\b' + CMD + '\\s*\\((?![^;\\n]*' + ENT + ')', 'gi'), msg: 'Uso de funciones que ejecutan comandos del sistema.', fix: 'Confirma que ninguna parte del comando viene del usuario; desactívalas en php.ini si no las necesitas.' },
    { sev: 'media', re: /move_uploaded_file\s*\(/gi, msg: 'Subida de archivos: revisa validación.', fix: 'Valida tipo real (finfo), tamaño y extensión; renombra el archivo y guárdalo fuera de la carpeta pública.' },
    { sev: 'media', re: /\b(?:md5|sha1)\s*\([^;\n]*pass/gi, msg: 'Contraseñas con md5/sha1.', fix: 'Usa password_hash() y password_verify().' },
    { sev: 'media', re: /ini_set\s*\(\s*['"]display_errors['"]\s*,\s*['"]?(?:1|on|true)/gi, msg: 'display_errors activo: filtra rutas y detalles internos.', fix: 'Desactívalo en producción y registra errores en un archivo.' },
    { sev: 'media', re: /\bphpinfo\s*\(/gi, msg: 'phpinfo() expone la configuración del servidor.', fix: 'Elimina el archivo o protégelo.' },
    { sev: 'media', re: new RegExp("header\\s*\\(\\s*['\"]Location:[^;\\n]*" + ENT, 'gi'), msg: 'Redirección con destino del usuario (open redirect).', fix: 'Valida el destino contra una lista de rutas propias.' },
    { sev: 'media', re: /(?:token|csrf|reset)[^;\n]*\b(?:rand|mt_rand|uniqid)\s*\(/gi, msg: 'Token generado con una función no criptográfica.', fix: 'Usa random_bytes() o bin2hex(random_bytes(32)).' },
    { sev: 'baja', re: /\bmysql_(?:connect|query|fetch\w*)\s*\(/gi, msg: 'Funciones mysql_* obsoletas y eliminadas.', fix: 'Migra a PDO o mysqli con consultas preparadas.' }
  ];
  function lineaDe(t, i) { return t.slice(0, i).split('\n').length; }
  function analizarPHP(codigo) {
    var out = [], t = String(codigo || '');
    REGLAS.forEach(function (r) {
      var re = new RegExp(r.re.source, r.re.flags), m, n = 0;
      while ((m = re.exec(t)) !== null && n++ < 50) {
        out.push({ sev: r.sev, linea: lineaDe(t, m.index), msg: r.msg, fix: r.fix });
        if (m[0].length === 0) re.lastIndex++;
      }
    });
    var peso = { 'crítica': 0, 'alta': 1, 'media': 2, 'baja': 3 };
    out.sort(function (a, b) { return peso[a.sev] - peso[b.sev] || a.linea - b.linea; });
    return out;
  }
  function analizarCabeceras(texto) {
    var out = [], h = {}, cookies = [];
    String(texto || '').split(/\r?\n/).forEach(function (l) {
      var i = l.indexOf(':'); if (i < 1) return;
      var k = l.slice(0, i).trim().toLowerCase(), v = l.slice(i + 1).trim();
      if (k === 'set-cookie') cookies.push(v); else h[k] = v;
    });
    function falta(k, sev, msg, fix) { if (!h[k]) out.push({ sev: sev, linea: 0, msg: msg, fix: fix }); }
    falta('strict-transport-security', 'media', 'Falta HSTS.', 'Agrega Strict-Transport-Security: max-age=31536000; includeSubDomains');
    falta('content-security-policy', 'media', 'Falta Content-Security-Policy.', 'Define una CSP restrictiva para frenar XSS.');
    if (!h['x-frame-options'] && !/frame-ancestors/i.test(h['content-security-policy'] || '')) out.push({ sev: 'media', linea: 0, msg: 'Sin protección contra clickjacking.', fix: 'Agrega X-Frame-Options: DENY o frame-ancestors en la CSP.' });
    falta('x-content-type-options', 'baja', 'Falta X-Content-Type-Options.', 'Agrega X-Content-Type-Options: nosniff');
    falta('referrer-policy', 'baja', 'Falta Referrer-Policy.', 'Agrega Referrer-Policy: strict-origin-when-cross-origin');
    if (h['server'] && /\d/.test(h['server'])) out.push({ sev: 'baja', linea: 0, msg: 'El encabezado Server revela versión: ' + h['server'], fix: 'Oculta la versión (ServerTokens Prod en Apache, server_tokens off en Nginx).' });
    if (h['x-powered-by']) out.push({ sev: 'baja', linea: 0, msg: 'X-Powered-By revela tecnología: ' + h['x-powered-by'], fix: 'Desactiva expose_php en php.ini.' });
    cookies.forEach(function (c) {
      var nombre = c.split('=')[0];
      if (!/;\s*secure/i.test(c)) out.push({ sev: 'media', linea: 0, msg: 'Cookie ' + nombre + ' sin Secure.', fix: 'Agrega el atributo Secure.' });
      if (!/;\s*httponly/i.test(c)) out.push({ sev: 'media', linea: 0, msg: 'Cookie ' + nombre + ' sin HttpOnly.', fix: 'Agrega el atributo HttpOnly.' });
      if (!/;\s*samesite/i.test(c)) out.push({ sev: 'baja', linea: 0, msg: 'Cookie ' + nombre + ' sin SameSite.', fix: 'Agrega SameSite=Lax o Strict.' });
    });
    return out;
  }
  function formatear(res) {
    if (!res.length) return 'No encontré problemas con estas reglas. Esto es análisis estático y no sustituye una auditoría completa.';
    var c = { 'crítica': 0, 'alta': 0, 'media': 0, 'baja': 0 };
    res.forEach(function (r) { c[r.sev]++; });
    var s = 'Hallazgos: ' + c['crítica'] + ' críticos, ' + c['alta'] + ' altos, ' + c['media'] + ' medios, ' + c['baja'] + ' bajos.\n';
    res.forEach(function (r) { s += '\n[' + r.sev.toUpperCase() + ']' + (r.linea ? ' línea ' + r.linea : '') + ': ' + r.msg + '\n  → ' + r.fix; });
    return s + '\n\nAnálisis estático: puede haber falsos positivos y no sustituye una auditoría completa.';
  }
  root.CSN_LAB_WEB = { analizarPHP: analizarPHP, analizarCabeceras: analizarCabeceras, formatear: formatear };
})(typeof globalThis !== 'undefined' ? globalThis : this);
