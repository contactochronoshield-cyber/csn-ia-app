(function () {
  var P = window.CSNPuente;
  if (!window.CSNBiblioteca || !P) return;
  var E = { ultimo: null, n: 0, oferta: -9 };

  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {}
    return null;
  }
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim(); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function nombre() { return ls("csn_nombre") || ""; }
  function hora() { var h = new Date().getHours(); return h < 12 ? "¡Buenos días" : h < 19 ? "¡Buenas tardes" : "¡Buenas noches"; }
  function titulo(id) {
    var t = window.CSNBiblioteca.temas().filter(function (x) { return x.id === id; })[0];
    return t ? t.titulo : id;
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
      b.onclick = function () { box.remove(); add(c.titulo, "usr"); setTimeout(c.fn, 150); };
      box.appendChild(b);
    });
    M.appendChild(box);
    M.scrollTop = M.scrollHeight;
  }
  function decir(texto, lista) { add(texto, "bot"); chips(lista); }
  function chipsTema(rel) {
    return (rel || []).map(function (c) { return { titulo: c.titulo, fn: function () { tema(c.id); } }; });
  }

  /* ---------- Sugerencias suaves (venta consultiva, sin presión) ---------- */
  var ACC = {
    diag: function () { return { titulo: "Mini diagnóstico (1 min)", fn: diag }; },
    juego: function () { return { titulo: "Jugar: ¿estafa o real?", fn: juego }; },
    venta: function () { return { titulo: "Quiero que me orienten", fn: venta }; }
  };
  var SUG = {
    red_privada: ["Si quieres, te ayudo a crear la tuya paso a paso.", "venta"],
    usos_red_privada: ["¿Te imaginas alguno de estos usos en tu casa o negocio? Te ayudamos a montarlo.", "venta"],
    mesh_node: ["¿Quieres que te ayude a calcular cuántos nodos necesitas para tu espacio?", "venta"],
    cloud: ["Si te interesa, te contamos los tres planes y cuál se ajusta a lo que necesitas.", "venta"],
    vpn: ["Si quieres probarla, te ayudamos a configurarla.", "venta"],
    proteger_casa: ["Armamos un plan a tu medida, sin compromiso.", "venta"],
    proteger_empresa: ["Armamos un plan a tu medida, sin compromiso.", "venta"],
    proteger_infra: ["Armamos un plan a tu medida, sin compromiso.", "venta"],
    proteger_telefono: ["Armamos un plan a tu medida, sin compromiso.", "venta"],
    privada_empresas: ["Podemos evaluar tu red actual y proponerte mejoras por etapas.", "venta"],
    failover: ["Si tu negocio no puede quedarse sin internet, lo revisamos contigo.", "venta"],
    por_que_chrono: ["Si quieres comprobarlo con tu caso, te orientamos sin compromiso.", "venta"],
    es_caro: ["Cuéntame tu caso y te propongo por dónde empezar con lo mínimo.", "venta"],
    tipos_virus: ["¿Quieres saber qué tan protegido estás hoy? Toma 1 minuto.", "diag"],
    senales_infeccion: ["¿Medimos qué tan protegido estás? Toma 1 minuto.", "diag"],
    contrasenas: ["¿Quieres saber en qué más puedes mejorar? Toma 1 minuto.", "diag"],
    wifi_casa: ["¿Quieres saber en qué más puedes mejorar? Toma 1 minuto.", "diag"],
    backups: ["¿Quieres saber en qué más puedes mejorar? Toma 1 minuto.", "diag"],
    ciberseguridad: ["¿Quieres saber qué tan protegido estás? Toma 1 minuto.", "diag"],
    actualizaciones: ["¿Quieres saber en qué más puedes mejorar? Toma 1 minuto.", "diag"],
    phishing: ["¿Practicamos? Es un juego rápido de 5 mensajes.", "juego"],
    qr_falsos: ["¿Practicamos? Es un juego rápido de 5 mensajes.", "juego"],
    deepfake_ia: ["¿Practicamos a detectar engaños? Son 5 mensajes.", "juego"]
  };
  function sugerencia(id) {
    var s = SUG[id];
    if (!s || E.n - E.oferta < 3) return null;
    E.oferta = E.n;
    return { texto: s[0], chip: ACC[s[1]]() };
  }

  /* ---------- Ejemplos de la vida diaria ---------- */
  var EJ = {
    red_privada: "Tu familia tiene un grupo de WhatsApp cerrado: solo entran los invitados y nadie de afuera lee los mensajes. Una red privada es lo mismo, pero para tus aparatos y archivos.",
    vpn: "Estás en un café y quieres entrar al banco. Sin VPN, tu conexión viaja como una postal que cualquiera podría leer; con VPN va dentro de un sobre cerrado hasta tu red.",
    mesh: "En una finca con tres casas, un solo router no llega a todas. Con tres nodos mesh, cada casa tiene señal y, si uno falla, los otros siguen conectados.",
    mesh_node: "Pones un nodo en la sala y otro en el patio: tu wifi se extiende sin cables y sin zonas muertas.",
    firewall: "Es el portero de un edificio: solo deja subir a quien un residente autorizó.",
    cifrado: "Es escribir tu mensaje en un idioma secreto que solo tú y quien lo recibe conocen.",
    cloud: "En vez de guardar tus archivos en una bodega alquilada a una empresa de otro país, los guardas en una bodega propia, con tu llave.",
    soberania: "Depender de un proveedor extranjero es vivir en casa alquilada: pueden subirte el arriendo o pedirte que te vayas. La soberanía es tener casa propia.",
    phishing: "Te llega un SMS de tu \"banco\" con un enlace para \"evitar un bloqueo\". El banco real nunca te pide eso por mensaje: entra tú mismo a su app oficial.",
    backups: "Si mañana tu celular se cae al agua, pierdes todo lo que no esté copiado en otro lugar. La copia es tu seguro.",
    contrasenas: "\"cafe-azul-bicicleta-nube\" es más fácil de recordar y mucho más difícil de adivinar que \"Cafe123!\".",
    tipos_virus: "Un troyano es como un regalo bonito con algo malo adentro: una app de \"linterna gratis\" que además lee tus mensajes.",
    chronoos: "Imagina un colegio que quiere su propio servidor de archivos y correo sin pagarle a un proveedor extranjero. ChronoOS está pensado para armar infraestructura propia de ese tipo."
  };

  /* ---------- Conversación ---------- */
  var CHISTES = [
    "¿Por qué los hackers odian la naturaleza? Porque está llena de bugs.",
    "Mi contraseña es \"incorrecta\". Así, cuando me equivoco, el sistema me recuerda: \"Tu contraseña es incorrecta\".",
    "—Doctor, creo que tengo un virus. —Tranquilo, tome agua... y reinicie el computador.",
    "¿Cuál es el colmo de un experto en seguridad? Que se le olvide la clave de su propia caja fuerte.",
    "Hay 10 tipos de personas: las que entienden binario y las que no."
  ];
  var EMPATIA = [
    "Lamento que estés pasando por esto, y qué bueno que lo consultes. Vamos paso a paso, con calma.",
    "Respira: en la mayoría de los casos tiene solución. Te acompaño.",
    "Gracias por contármelo. Le pasa a mucha gente y no es tu culpa. Veamos qué hacer."
  ];
  function chipsInicio() {
    return [
      { titulo: "Consejo del día", fn: function () { consejo(true); } },
      { titulo: "Mini diagnóstico", fn: diag },
      { titulo: "¿Cómo me protege Chrono?", fn: function () { tema("proteccion_chrono"); } }
    ];
  }
  var CHARLA = [
    { re: /^(hola|holi|holaa+|buenas|buenos dias|buenas tardes|buenas noches|hey|que tal)( [a-z]+)?$/, max: 3, fn: function () {
        var n = nombre();
        decir(hora() + (n ? ", " + n : "") + "! Qué gusto verte por aquí." + (n ? "" : " ¿Cómo te llamas? Así te hablo por tu nombre.") + " ¿Qué te gustaría hacer hoy?", chipsInicio());
      } },
    { re: /^(ok|okey|okay|oki|vale|listo|perfecto|dale|entendido|claro|super|genial|bien|buenisimo|alright|got it|cool|great|sure|beleza|certo|entendi|otimo|ta bom|tudo bem)( [a-z]+)?$/, max: 3, fn: function () { /* CSN-OKEY */
        var L = "es"; try { L = localStorage.getItem("csn_lang") || "es"; } catch (e) {}
        if (L === "en") { decir(pick(["Great! 😊 What else would you like to know? I can explain private networks, scam protection, or how to secure your phone and wifi.", "Perfect! I am here for whatever you need. Want me to guide you on one of these topics?"]), chipsInicio()); return; }
        if (L === "pt") { decir(pick(["Perfeito! 😊 O que mais você gostaria de saber? Posso explicar redes privadas, como evitar golpes ou como proteger seu celular e seu wifi.", "Ótimo! Estou aqui para o que precisar. Quer que eu te oriente em algum destes temas?"]), chipsInicio()); return; }
        decir(pick(["¡Perfecto! 😊 Cuéntame, ¿qué más te gustaría saber? Puedo explicarte qué es una red privada, cómo protegerte de estafas o cómo cuidar tu celular y tu wifi.", "¡Genial! Estoy aquí para lo que necesites. ¿Quieres que te oriente con alguno de estos temas?", "¡Muy bien! Si quieres, seguimos: dime qué te interesa y lo vemos juntos."]), chipsInicio());
    } },
    { re: /(gracias|te agradezco|muy amable)/, max: 6, fn: function () {
        decir(pick(["¡Con mucho gusto! Si te surge otra duda, aquí estoy.", "¡A ti! Para eso estoy. ¿Te ayudo con algo más?", "¡Un placer! Cuando quieras seguimos."]), [{ titulo: "Consejo del día", fn: function () { consejo(true); } }]);
      } },
    { re: /(como estas|como vas|que tal estas)/, max: 5, fn: function () {
        decir("¡Muy bien, gracias por preguntar! Con ganas de ayudarte a estar más seguro en internet. ¿Qué te cuento hoy?", chipsInicio());
      } },
    { re: /(quien eres|como te llamas|que eres|quien te creo)/, max: 6, fn: function () {
        decir("Soy el asistente de Chrono Shield Networks. Te explico redes privadas, ciberseguridad y nuestros productos en palabras simples, sin tecnicismos. Y si quieres, te hago un mini diagnóstico de seguridad.", chipsInicio());
      } },
    { re: /(chiste|hazme reir|algo gracioso)/, max: 6, fn: function () {
        decir("😄 " + pick(CHISTES), [{ titulo: "Otro chiste", fn: function () { decir("😄 " + pick(CHISTES), []); } }, { titulo: "Consejo del día", fn: function () { consejo(true); } }]);
      } },
    { re: /^(chao|adios|hasta luego|nos vemos|bye|me voy|hasta pronto)/, max: 5, fn: function () {
        var n = nombre();
        decir("¡Hasta pronto" + (n ? ", " + n : "") + "! Recuerda: ante un mensaje urgente, respira y verifica. Aquí estaré cuando me necesites.", []);
      } },
    { re: /(eres genial|muy bueno|excelente app|buen trabajo|me gusta (la app|esto)|me encanto)/, max: 6, fn: function () {
        decir("¡Gracias, eso me motiva! Si te sirvió, cuéntale a alguien de tu familia: la mejor protección es que todos sepan lo básico.", [{ titulo: "Consejo del día", fn: function () { consejo(true); } }]);
      } },
    { re: /(no me interesa|no gracias|no quiero comprar|solo estoy mirando)/, max: 6, fn: function () {
        decir("Todo bien, sin ninguna presión. Si más adelante te sirve, aquí estaremos. Mientras tanto, llévate algo gratis y útil:", [{ titulo: "Consejo del día", fn: function () { consejo(true); } }, { titulo: "Mini diagnóstico", fn: diag }]);
      } }
  ];
  var RE_EMP = /(me estafaron|me robaron|me hackearon|me clonaron|tengo miedo|me da miedo|estoy preocupad|estoy asustad|me extorsionan|me amenazan|ayuda urgente|socorro|que hago ahora)/;
  var RE_DIAG = /(diagnostico|que tan seguro estoy|que tan protegido|test de seguridad|evaluar mi seguridad|revisar mi seguridad)/;
  var RE_JUEGO = /(juego|jugar|estafa o legitimo|estafa o real|quiz|trivia|ponme a prueba)/;
  var RE_CONSEJO = /(consejo|tip de seguridad|dame un tip|tip del dia)/;
  var RE_VENTA = /(me interesa (comprar|contratar|el servicio|el producto|el nodo|la nube|una cotizacion|esto)|quiero (comprar|contratar|adquirir|cotizar|una cotizacion|que me ayuden|que me orienten|asesoria)|cotizar|cotizacion|como (compro|contrato|adquiero)|hablar con (alguien|un asesor|una persona|el equipo)|asesor|quiero un nodo|agendar|prueba gratis|demo)/;
  var RE_MAS = /^(cuentame mas|dime mas|mas detalles?|mas informacion|profundiza|dame un ejemplo|un ejemplo|ejemplo|no entiendo|no entendi|no comprendo|explicame mejor|explicame mas facil|explicame facil|mas facil|y eso|como asi)$/;

  function manejar(t) {
    var n = norm(t), palabras = n ? n.split(" ").length : 0;
    var m = t.toLowerCase().match(/(?:me llamo|mi nombre es|puedes llamarme|llamame|llámame) ([a-záéíóúñü]{2,20})/);
    if (m) {
      var nom = m[1].charAt(0).toUpperCase() + m[1].slice(1);
      ls("csn_nombre", nom);
      decir("Mucho gusto, " + nom + ". ¿En qué te puedo ayudar hoy?", chipsInicio());
      return;
    }
    for (var i = 0; i < CHARLA.length; i++) {
      if (palabras <= CHARLA[i].max && CHARLA[i].re.test(n)) { CHARLA[i].fn(); return; }
    }
    if (RE_DIAG.test(n)) return diag();
    if (RE_JUEGO.test(n)) return juego();
    if (RE_CONSEJO.test(n)) return consejo(true);
    if (RE_VENTA.test(n)) return venta();
    if (RE_MAS.test(n)) return mas();
    var res = P.resolver(t);
    var previo = RE_EMP.test(n) ? pick(EMPATIA) + "\n\n" : "";
    mostrar(res, previo);
  }
  function mostrar(res, previo) {
    if (res.encontrado) { E.ultimo = res.id; E.n++; }
    var extra = res.encontrado ? sugerencia(res.id) : null;
    decir((previo || "") + res.texto + (extra ? "\n\n" + extra.texto : ""), (extra ? [extra.chip] : []).concat(chipsTema(res.relacionados)));
  }
  function tema(id) {
    var r = window.CSNBiblioteca.porTema(id);
    if (r) mostrar(r, "");
  }
  function mas() {
    if (E.ultimo && EJ[E.ultimo]) {
      var r = window.CSNBiblioteca.porTema(E.ultimo);
      decir("Te lo explico con un ejemplo de la vida diaria:\n" + EJ[E.ultimo], chipsTema(r ? r.relacionados : []));
    } else {
      decir("Con gusto. Cuéntame un poco más de tu caso y lo explico con tu situación: ¿es para tu casa, tu empresa o tu celular?", [
        { titulo: "Mi casa", fn: function () { tema("proteger_casa"); } },
        { titulo: "Mi empresa", fn: function () { tema("proteger_empresa"); } },
        { titulo: "Mi celular", fn: function () { tema("proteger_telefono"); } }
      ]);
    }
  }

  /* ---------- Ventas consultivas ---------- */
  var PERFILES = {
    casa: ["Para tu casa te recomiendo empezar por: 1) Chrono Mesh Node (169.000 COP en Mercado Libre) para cobertura y red privada, 2) ChronoShieldVPN para entrar a tus cosas desde fuera, 3) Chrono Sentinel para monitoreo. Podemos armarlo por etapas, empezando por lo que más te urge.", "mi casa"],
    empresa: ["Para tu empresa: 1) una evaluación de tu red actual, 2) red privada segmentada, 3) Chrono Cloud Sovereign (tiene tres planes) para tus datos. Lo ajustamos al tamaño de tu equipo.", "mi empresa"],
    infra: ["Para tu infraestructura: ChronoOS como base, Chrono Backbone para el enrutamiento y Chrono Cloud Sovereign. Lo primero es revisar tu caso con el equipo técnico.", "mi infraestructura"],
    telefono: ["Para tu teléfono: ChronoShieldVPN, el buscador con escudos de esta app y Chrono Sentinel. Es lo más rápido de poner en marcha.", "mi teléfono"]
  };
  function venta() {
    decir("¡Qué bueno! Para orientarte bien, cuéntame: ¿para qué lo quieres?", [
      { titulo: "Mi casa", fn: function () { perfil("casa"); } },
      { titulo: "Mi empresa", fn: function () { perfil("empresa"); } },
      { titulo: "Mi infraestructura", fn: function () { perfil("infra"); } },
      { titulo: "Mi teléfono", fn: function () { perfil("telefono"); } }
    ]);
  }
  function perfil(k) {
    var p = PERFILES[k], n = nombre() || "[tu nombre]";
    decir(p[0] + "\n\nPara darte un valor exacto y los pasos, escríbenos a contactochronoshield@gmail.com o entra a chronoshieldnetworks.com. Si quieres, envía este mensaje tal cual:\n\n«Hola, soy " + n + ". Me interesa proteger " + p[1] + " con Chrono. ¿Me pueden orientar?»", [
      { titulo: "Mini diagnóstico", fn: diag },
      { titulo: "Ver productos", fn: function () { tema("productos"); } }
    ]);
  }

  /* ---------- Mini diagnóstico ---------- */
  var DQ = [
    ["¿Usas la misma contraseña en varios sitios?", "No", "contrasenas"],
    ["¿Tienes verificación en dos pasos en tu correo?", "Sí", "contrasenas"],
    ["¿Actualizas tu celular y computador cuando te lo piden?", "Sí", "actualizaciones"],
    ["¿Cambiaste la clave de fábrica de tu router?", "Sí", "wifi_casa"],
    ["¿Tienes copia de seguridad de tus fotos y archivos importantes?", "Sí", "backups"],
    ["¿Das clic en enlaces de mensajes sin verificar quién los envió?", "No", "phishing"]
  ];
  function diag() {
    var prev = null;
    try { prev = JSON.parse(ls("csn_diag") || "null"); } catch (e) {}
    add("Vamos con un mini diagnóstico de 6 preguntas. Sin juicios: es para ayudarte." + (prev ? " La última vez sacaste " + prev.p + "/6." : ""), "bot");
    pregunta(0, 0, []);
  }
  function pregunta(i, pts, malas) {
    if (i >= DQ.length) return resultado(pts, malas);
    var q = DQ[i];
    function resp(si) {
      var ok = (si ? "Sí" : "No") === q[1];
      return function () { pregunta(i + 1, pts + (ok ? 1 : 0), ok ? malas : malas.concat(q[2])); };
    }
    decir("Pregunta " + (i + 1) + " de " + DQ.length + "\n" + q[0], [{ titulo: "Sí", fn: resp(true) }, { titulo: "No", fn: resp(false) }]);
  }
  function resultado(pts, malas) {
    ls("csn_diag", JSON.stringify({ p: pts, f: new Date().toISOString().slice(0, 10) }));
    var barra = "";
    for (var i = 0; i < DQ.length; i++) barra += i < pts ? "■" : "□";
    var msg = pts >= 5 ? "¡Muy bien! Tus hábitos están sólidos. Un par de ajustes y quedas blindado."
      : pts >= 3 ? "Vas por buen camino, con algunos huecos fáciles de tapar."
      : "Hay varios huecos, pero la buena noticia es que se arreglan rápido y casi sin gastar.";
    var unicos = malas.filter(function (x, k) { return malas.indexOf(x) === k; }).slice(0, 3);
    var lista = unicos.map(function (id) { return { titulo: titulo(id), fn: function () { tema(id); } }; });
    if (pts <= 4) lista.push({ titulo: "Quiero que me orienten", fn: venta });
    lista.push({ titulo: "Jugar: ¿estafa o real?", fn: juego });
    decir("Tu resultado: " + pts + "/" + DQ.length + "  " + barra + "\n" + msg + (unicos.length ? "\n\nLo primero que haría, en este orden:" : ""), lista);
  }

  /* ---------- Juego: ¿estafa o real? ---------- */
  var JQ = [
    ["SMS: «Tu banco: detectamos un acceso raro. Verifica tu cuenta aquí o será bloqueada en 1 hora: bit.ly/seg-banco»", true, "Mezcla urgencia con un enlace acortado. Tu banco no te pide verificar por SMS: entra tú mismo a su app."],
    ["WhatsApp de un número nuevo: «Hola mamá, cambié de celular. ¿Me haces un favor urgente? Necesito que me prestes plata»", true, "Es la estafa del «soy tu hijo». Antes de enviar dinero, llama a la persona a su número de siempre."],
    ["SMS: «Tu código de verificación es 482913. No lo compartas con nadie.» (justo cuando tú intentabas iniciar sesión)", false, "Es legítimo porque tú lo pediste. Lo clave: nunca se lo des a nadie que te lo pida."],
    ["Llamada: «Le habla su banco. Le llegó un código al celular, ¿me lo dicta para cancelar un cargo sospechoso?»", true, "Nadie legítimo te pide códigos. Ese código es la llave de tu cuenta: cuelga y llama tú al banco."],
    ["Correo: «Tu pedido #48213 fue enviado. Puedes seguirlo en la app de la tienda donde compraste.» (sin enlaces ni datos pedidos)", false, "No pide datos ni trae enlaces y apunta a la app oficial. Si no compraste nada, ignóralo; si sí, abre la app tú mismo."]
  ];
  function juego() {
    add("Te muestro 5 mensajes. Dime si es estafa o es legítimo.", "bot");
    ronda(0, 0);
  }
  function ronda(i, pts) {
    if (i >= JQ.length) {
      var f = pts === 5 ? "¡Ojo de águila! Detectas todo." : pts >= 3 ? "Muy bien, ya detectas la mayoría." : "Buen comienzo: lo importante es que ya sabes qué buscar.";
      return decir("Resultado: " + pts + "/5. " + f + " Compártelo con tu familia: este juego protege más que un antivirus.", [
        { titulo: "Jugar de nuevo", fn: juego }, { titulo: "Mini diagnóstico", fn: diag }
      ]);
    }
    function resp(dijoEstafa) {
      return function () {
        var ok = dijoEstafa === JQ[i][1];
        add((ok ? "✅ ¡Correcto! " : "❌ Casi. ") + (JQ[i][1] ? "Era una estafa. " : "Era legítimo. ") + JQ[i][2], "bot");
        setTimeout(function () { ronda(i + 1, pts + (ok ? 1 : 0)); }, 250);
      };
    }
    decir("Mensaje " + (i + 1) + " de 5:\n" + JQ[i][0], [{ titulo: "Es estafa", fn: resp(true) }, { titulo: "Es legítimo", fn: resp(false) }]);
  }

  /* ---------- Consejo del día ---------- */
  var TIPS = [
    "Activa la verificación en dos pasos en tu correo: es el candado más importante.",
    "Usa una contraseña distinta en cada sitio. Si una se filtra, no se abre todo.",
    "Antes de tocar un enlace, mantenlo presionado y mira a dónde va realmente.",
    "Los bancos nunca te piden códigos por llamada ni por mensaje.",
    "Actualiza tu celular: la mayoría de las actualizaciones tapan huecos de seguridad.",
    "Cambia la clave de fábrica de tu router: esa la conocen los delincuentes.",
    "En wifi públicos evita entrar al banco; usa tus datos móviles o una VPN.",
    "Haz copia de tus fotos importantes: el día que pierdas el celular lo agradecerás.",
    "Revisa los permisos de tus apps en Ajustes: pocas necesitan tu cámara, micrófono y ubicación.",
    "Si algo suena demasiado bueno para ser verdad (premios, ofertas), casi seguro es estafa.",
    "Un mensaje urgente es una alarma, no una orden: respira y verifica por otro canal.",
    "Desinstala las apps que no usas: cada app es una puerta más.",
    "Un gestor de contraseñas hace que solo tengas que recordar una.",
    "Cierra sesión en computadores ajenos y no guardes claves en navegadores públicos.",
    "Ojo con los QR pegados en lugares públicos: pueden estar puestos encima del original.",
    "Revisa de vez en cuando qué dispositivos tienen sesión abierta en tu correo.",
    "Si te llega un código que no pediste, alguien intenta entrar a tu cuenta: cambia la clave.",
    "Habla con tu familia, sobre todo con los mayores, de la estafa del «soy tu hijo».",
    "Crea una red de invitados en el router para visitas y aparatos inteligentes.",
    "Apaga el bluetooth y el wifi cuando no los uses fuera de casa.",
    "Una frase larga como «mi-perro-come-pan-azul» vale más que «P@ssw0rd1».",
    "No publiques tu ubicación en tiempo real ni fotos de tiquetes o documentos.",
    "Evita cargadores públicos desconocidos: lleva el tuyo o un cable solo de carga.",
    "Compra solo en sitios conocidos y desconfía de precios regalados.",
    "Antes de vender o regalar un celular, restablécelo de fábrica y cierra tus cuentas.",
    "Desconfía de adjuntos inesperados, incluso de contactos conocidos: su cuenta puede estar hackeada.",
    "Prueba tu copia de seguridad: restaurar una vez te ahorra sustos.",
    "El antivirus ayuda, pero la mejor defensa eres tú: pausa antes de hacer clic.",
    "Pregúntate siempre: «¿yo pedí esto?». Si no lo pediste, no lo abras.",
    "Tu red privada es tuya: cuida quién tiene la clave y cámbiala si compartiste de más."
  ];
  function consejo(manual) {
    var tip = pick(TIPS);
    decir("💡 Consejo de seguridad:\n" + tip, [
      { titulo: "Otro consejo", fn: function () { consejo(true); } },
      { titulo: "Mini diagnóstico", fn: diag }
    ]);
  }
  function diario() {
    var d = new Date();
    var clave = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    if (ls("csn_dia") === clave) return;
    ls("csn_dia", clave);
    var dia = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    var n = nombre();
    decir(hora() + (n ? ", " + n : "") + "! 💡 Consejo de hoy:\n" + TIPS[dia % TIPS.length], [
      { titulo: "Otro consejo", fn: function () { consejo(true); } },
      { titulo: "Mini diagnóstico", fn: diag }
    ]);
  }

  window.localAsk = function (t) { setTimeout(function () { manejar(t); }, 180); };
  window.CSNConversacion = { manejar: manejar, diario: diario };
  setTimeout(function () { try { diario(); } catch (e) {} }, 900);
})();
