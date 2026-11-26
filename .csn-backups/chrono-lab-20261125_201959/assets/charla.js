/* CSN IA - charla.js
   Reconoce el nombre de cada persona y mantiene una conversacion guiada sobre
   ciberseguridad, redes, internet y estudios. Los datos se guardan solo en el telefono. */
(function () {
  "use strict";
  var K_NOMBRE = "csn_nombre", K_PERFIL = "csn_profile_name", K_PIDIO = "csn_pidio_nombre";
  var LET = "a-zA-ZáéíóúüñÁÉÍÓÚÜÑàâêôãõçÀÂÊÔÃÕÇ";
  var ST = { aw: "", pend: "", tema: "", paso: 0, rech: [] };

  function lsg(k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function lss(k, v) { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch (e) {} }
  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }
  function lang() { var l = lsg("csn_lang"); return (l === "en" || l === "pt") ? l : "es"; }
  function nombre() { return lsg(K_NOMBRE).replace(new RegExp("[^" + LET + "' -]", "g"), "").slice(0, 40); }

  var NO_NOMBRE = ("nuevo nueva un una el la los las de del cliente usuario usuaria estudiante alumno alumna profesor profesora " +
    "ingeniero ingeniera tecnico tecnica dueno duena emprendedor emprendedora padre madre mama papa colombiano colombiana " +
    "mexicano mexicana peruano peruana venezolano venezolana argentino argentina chileno chilena ecuatoriano ecuatoriana " +
    "brasileno brasilena dominicano dominicana espanol persona hombre mujer joven adulto adulta experto experta principiante " +
    "novato novata curioso curiosa new a an the student user customer beginner client novo nova um uma aluno aluna iniciante " +
    "bien mal feliz triste cansado cansada aqui here ok okay").split(" ");
  var CONECT = ["de", "del", "la", "los", "las"];
  var STOP_BARE = ("hola holi buenas hey ok okey okay vale listo gracias chao adios bye hi hello yes no si sii sip nop claro dale " +
    "bien mal nada todo menu ayuda help precio precios router wifi vpn internet red redes hack hacker virus malware phishing " +
    "firewall linux android iphone windows mac celular telefono computador computadora pc app apps nube cloud mesh nodo node " +
    "onion csn chrono asml chip chips ia ai bot robot que quien como cuando donde porque cual cuanto jajaja jaja jeje lol xd " +
    "hmm mmm aja ya mikrotik tigo movistar starlink whatsapp facebook instagram tiktok youtube google gmail hablemos hablar " +
    "conversemos platiquemos charlemos ciberseguridad seguridad estudios estafa estafas contrasena contrasenas").split(" ");

  var RX_EXPL = new RegExp("^\\s*(?:hola[, ]+)?(?:me llamo|mi nombre es|puedes llamarme|me puedes llamar|ll[aá]mame|me dicen|my name is|call me|meu nome [eé]|me chamo|pode me chamar de|pode me chamar)\\s+([" + LET + "' -]{2,40}?)\\s*[.!]*\\s*$", "i");
  var RX_SOY = new RegExp("^\\s*(?:hola[, ]+)?(?:soy|yo soy|i am|i'm|im|eu sou)\\s+([" + LET + "'-]{2,20}(?: [" + LET + "'-]{2,20})?)\\s*[.!]*\\s*$", "i");
  var RX_BARE = new RegExp("^[" + LET + "'-]{2,20}(?: [" + LET + "'-]{2,20}){0,3}$");
  var SI = /^(si|sii+|sip|claro|asi es|correcto|exacto|dale|ok|okey|okay|vale|listo|yes|yep|yeah|sure|sim|isso|por favor)( |$)/;
  var NO = /^(no|nop|nope|nao|nunca|jamas|nada|negativo)( |$)/;
  var CONV = /(hablemos|hablar de|conversemos|conversar|platiquemos|platicar|charlemos|charlar|let s talk|lets talk|vamos conversar|vamos falar)/;
  var ESTUDIO = /^(yo )?(estoy )?(estudio|estudiando|cursando)( |$)|^soy (estudiante|alumno|alumna)( |$)|^mi carrera es |^i (study|am studying|m studying) |^estudo |^sou estudante/;

  function esTema(t) {
    try { var r = window.CSNBiblioteca && window.CSNBiblioteca.responder(t); return !!(r && r.encontrado); } catch (e) { return false; }
  }
  function okNombre(s, max) {
    var w = s.trim().split(/\s+/);
    if (w.length < 1 || w.length > max) return false;
    for (var i = 0; i < w.length; i++) {
      var x = norm(w[i]);
      if (i > 0 && CONECT.indexOf(x) >= 0) continue;
      if (x.length < 2 || NO_NOMBRE.indexOf(x) >= 0) return false;
    }
    return true;
  }
  function nombreValido(s) {
    var t = s.trim(), w = t.split(/\s+/);
    return okNombre(t, 4) && (w.length <= 3 || /^\S+ de (la|los|las) \S+$/i.test(t));
  }
  function pareceNombre(s) {
    var n = norm(s);
    if (!RX_BARE.test(s) || !nombreValido(s) || CONV.test(n)) return false;
    var bad = n.split(" ").some(function (w) { return STOP_BARE.indexOf(w) >= 0; });
    return !bad && !esTema(s);
  }
  function titulo(s) {
    return s.trim().split(/\s+/).slice(0, 4).map(function (w, i) {
      if (i > 0 && CONECT.indexOf(norm(w)) >= 0) return w.toLowerCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(" ");
  }

  var TXT = {
    es: {
      confirmar: function (n) { return "¿Te llamo " + n + "? 😊"; },
      guardado: function (n) { return "¡Mucho gusto, " + n + "! 😊 Desde ahora te llamo así (solo lo guardo en tu teléfono). ¿De qué quieres hablar: ciberseguridad, redes, internet o tus estudios?"; },
      otra: "Dime entonces, ¿cómo te llamo?",
      anonimo: "Sin problema, no hace falta. Si algún día quieres, dime \"me llamo...\". ¿De qué quieres hablar?",
      olvido: "Listo, ya borré lo que sabía de ti.",
      pedir: "¡Hola! Soy el asistente de Chrono Shield. Antes de empezar, ¿cómo te llamo? (Solo se guarda en tu teléfono; si prefieres no decirlo, no pasa nada.)",
      tunombre: function (n) { return "Te llamas " + n + ". 😊"; },
      sin: "Todavía no sé tu nombre. ¿Cómo te llamo?"
    },
    en: {
      confirmar: function (n) { return "Should I call you " + n + "? 😊"; },
      guardado: function (n) { return "Nice to meet you, " + n + "! 😊 I will call you that from now on (it is only stored on your phone). What would you like to talk about?"; },
      otra: "Then tell me, what should I call you?",
      anonimo: "No problem! Whenever you like, tell me \"my name is...\". What would you like to talk about?",
      olvido: "Done, I deleted what I knew about you.",
      pedir: "Hi! I am the Chrono Shield assistant. Before we start, what should I call you? (It is only stored on your phone; you can skip it.)",
      tunombre: function (n) { return "Your name is " + n + ". 😊"; },
      sin: "I do not know your name yet. What should I call you?"
    },
    pt: {
      confirmar: function (n) { return "Posso te chamar de " + n + "? 😊"; },
      guardado: function (n) { return "Prazer, " + n + "! 😊 A partir de agora vou te chamar assim (só fica salvo no seu celular). Sobre o que quer conversar?"; },
      otra: "Então me diga, como devo te chamar?",
      anonimo: "Sem problema! Quando quiser, diga \"me chamo...\". Sobre o que quer conversar?",
      olvido: "Pronto, apaguei o que eu sabia sobre você.",
      pedir: "Olá! Sou o assistente da Chrono Shield. Antes de começar, como devo te chamar? (Só fica salvo no seu celular; se preferir, pode pular.)",
      tunombre: function (n) { return "Seu nome é " + n + ". 😊"; },
      sin: "Ainda não sei seu nome. Como devo te chamar?"
    }
  };
  var SINO = { es: [{ t: "Sí" }, { t: "No" }], en: [{ t: "Yes" }, { t: "No" }], pt: [{ t: "Sim" }, { t: "Não" }] };
  var CH_MENU = [{ t: "Hablemos de ciberseguridad" }, { t: "Hablemos de redes" }, { t: "Hablemos de internet" }, { t: "Hablemos de mis estudios" }];
  var CH_CIBER = [{ t: "Reconocer estafas", s: "como evitar estafas" }, { t: "Proteger mis cuentas", s: "verificacion en dos pasos" }, { t: "Hablemos de redes" }];
  var CH_REDES2 = [{ t: "Proteger mi wifi", s: "como proteger mi wifi" }, { t: "Para qué sirve una red privada", s: "dame ejemplos de uso" }, { t: "Hablemos de ciberseguridad" }];
  var CH_FIN = [{ t: "Proteger mis cuentas", s: "verificacion en dos pasos" }, { t: "Hablemos de ciberseguridad" }, { t: "Hablemos de mis estudios" }];
  var CH_MENU2 = [{ t: "Hablemos de ciberseguridad" }, { t: "Hablemos de redes" }, { t: "Proteger mi wifi", s: "como proteger mi wifi" }];

  var R_LLEGA = "Imagina carreteras. Tu router es la puerta de tu casa; tu proveedor de internet es la vía principal, y de ahí los datos viajan por fibra, incluso por cables bajo el mar, hasta los servidores donde vive la página que pides. Todo el viaje dura milisegundos. ¿Te explico qué pasa cuando escribes una dirección como google.com?";
  var R_DNS = "Tu dispositivo no entiende nombres, solo números (direcciones IP). Un servicio llamado DNS funciona como una agenda: traduce \"google.com\" a su número. Si alguien manipula esa agenda, puede mandarte a una página falsa; por eso importa en seguridad.";
  var INT = [
    [/(estudi|clase|universidad|colegio|tarea)/, "Para estudiar en línea: cuidado con páginas de descargas \"gratis\" y con compartir la clave de tu campus. Usa una contraseña distinta para tu cuenta institucional."],
    [/(trabaj|oficina|correo|email|empleo)/, "Para trabajar: el correo es la puerta favorita de los atacantes (facturas falsas, \"tu jefe te pide un favor\"). Si llega un pago o un dato sensible por correo, confírmalo por llamada."],
    [/(social|instagram|tiktok|facebook|whatsapp|twitter|telegram)/, "En redes sociales, lo que más te protege es activar la verificación en dos pasos en WhatsApp e Instagram y no compartir nunca los códigos que te llegan por SMS, aunque los pida un \"amigo\". Es la forma más común de robar cuentas."],
    [/(jueg|game|gamer|fortnite|roblox|minecraft)/, "En los juegos, cuidado con las \"skins gratis\" y los trucos descargables: suelen traer malware. Y no uses la misma clave del juego en otras cuentas."],
    [/(compra|banco|pago|dinero)/, "Para compras y banco: usa solo la app oficial, no entres desde enlaces de mensajes y evita wifi públicas para pagar. Si algo se ve raro, avisa a tu banco."]
  ];
  var INT_GEN = "Suena bien. En general, lo que más protege es tener contraseñas distintas, activar la verificación en dos pasos y desconfiar de todo lo que te mete prisa.";
  var CAMPOS = {
    TECH: { t: "Estás en terreno ideal: la ciberseguridad y las redes tienen mucha demanda y se aprende practicando. Un buen primer proyecto es armar tu propio laboratorio: un router, una VPN y mirar cómo viaja tu tráfico.", c: [{ t: "Qué es una red privada", s: "que es una red privada" }] },
    DER: { t: "Qué buen campo. Los datos personales son un área en crecimiento: leyes como la 1581 en Colombia, el RGPD en Europa y la LGPD en Brasil. Entender también la parte técnica te da ventaja.", c: [{ t: "Ley 1581", s: "ley 1581" }] },
    SALUD: { t: "Importante: los datos de pacientes están entre los más sensibles y los hospitales son blanco frecuente de ransomware. Proteger la información clínica también es cuidar al paciente." },
    NEG: { t: "Para un negocio, un ataque puede parar todo. Lo básico que más rinde: copias de seguridad, verificación en dos pasos y desconfiar de facturas o pagos \"urgentes\" por correo.", c: [{ t: "Seguridad para mi negocio", s: "seguridad para mi negocio" }] },
    CREA: { t: "A quienes crean contenido les roban cuentas y portafolios con frecuencia. La verificación en dos pasos y tener copias de tus trabajos es lo mejor que puedes hacer." },
    DOC: { t: "Enseñar hoy también es enseñar a cuidarse en internet. Si quieres, te muestro guías simples que puedes compartir con tus estudiantes." },
    COLE: { t: "Genial que estés aprendiendo. Un hábito que te sirve toda la vida: no compartir contraseñas ni con amigos, y pensar dos veces antes de dar tus datos en una página." },
    GEN: { t: "Suena interesante. Sea cual sea tu campo, hoy casi todo pasa por internet, así que entender de seguridad te da ventaja." }
  };

  function out(t, chips) { return { bots: [{ t: t, chips: chips || [] }] }; }
  function Hn(s) {
    var nm = nombre();
    return nm ? nm + ", " + s.replace(/^([¿¡]*)(\S)/, function (m, a, b) { return a + b.toLowerCase(); }) : s;
  }
  function guardar(nm, L) {
    lss(K_NOMBRE, nm); lss(K_PERFIL, nm);
    ST.aw = ""; ST.pend = "";
    var T = TXT[L] || TXT.es;
    return out(T.guardado(nm), L === "es" ? CH_MENU : []);
  }
  function campo(n) {
    if (/(derecho|abogad|leyes|juridic)/.test(n)) return "DER";
    if (/(medicina|enfermer|salud|odontolog|psicolog|fisioterap)/.test(n)) return "SALUD";
    if (/(administr|contab|negocio|econom|mercadeo|marketing|finanz|empresa|emprend|ventas)/.test(n)) return "NEG";
    if (/(diseno|arte|comunicacion|periodis|audiovisual|arquitect|musica|fotograf)/.test(n)) return "CREA";
    if (/(docente|profesor|maestr|licenciatura|pedagog|educacion)/.test(n)) return "DOC";
    if (/(colegio|bachiller|secundaria|escuela|grado|instituto|noveno|decimo)/.test(n)) return "COLE";
    if (/(sistemas|software|programa|informatica|computacion|telecom|tecnologia|electronica|redes|ingenieria|desarrollo)/.test(n)) return "TECH";
    return "GEN";
  }
  function respEstudio(n) {
    var x = CAMPOS[campo(n)];
    ST.tema = "estudios"; ST.paso = 2;
    return out(Hn(x.t) + "\n\n¿Y qué es lo que más te gusta de eso, o qué se te hace más difícil?", x.c || []);
  }
  function detectarTema(n) {
    if (/(ciber|seguridad|hack|estafa|privacidad|virus)/.test(n)) return "ciber";
    if (/(estudi|carrera|universidad|colegio|trabajo)/.test(n)) return "estudios";
    if (/\b(red|redes|wifi|router|mesh)\b/.test(n)) return "redes";
    if (/(internet|navegar|web|online|linea)/.test(n)) return "internet";
    return "";
  }
  function iniciar(tm) {
    ST.tema = tm || ""; ST.paso = 1;
    if (tm === "ciber") return out(Hn("¿Alguna vez te intentaron estafar o hackear una cuenta, o conoces a alguien a quien le pasó?"), SINO.es);
    if (tm === "redes") return out(Hn("¿Qué te da más curiosidad: cómo llega internet a tu casa, cómo proteger tu wifi o para qué sirve una red privada?"), [{ t: "Cómo llega internet" }, { t: "Proteger mi wifi", s: "como proteger mi wifi" }, { t: "Para qué sirve una red privada", s: "dame ejemplos de uso" }]);
    if (tm === "internet") return out(Hn("¿Para qué usas más internet: estudiar, trabajar, redes sociales, juegos o compras y banco?"), []);
    if (tm === "estudios") return out(Hn("¿Qué estudias o a qué te dedicas?"), []);
    ST.tema = ""; ST.paso = 0;
    return out("¡Claro" + (nombre() ? ", " + nombre() : "") + "! ¿De qué quieres que hablemos?", CH_MENU);
  }
  function continuar(texto, n) {
    var t = ST.tema, p = ST.paso;
    if (esTema(texto)) { ST.tema = ""; ST.paso = 0; return null; }
    if (t === "ciber" && p === 1) {
      ST.tema = ""; ST.paso = 0;
      if (NO.test(n) && !SI.test(n)) return out(Hn("Qué bueno. Prevenir cuesta mucho menos que arreglar. Lo que más protege es tener contraseñas distintas y activar la verificación en dos pasos. ¿Te cuento cómo, o prefieres ver cómo se ve un mensaje falso?"), CH_CIBER);
      return out(Hn("Gracias por contarlo. Le pasa a muchísima gente y no es culpa de quien lo sufre. Casi siempre empieza con un mensaje que mete prisa, tipo \"tu cuenta se bloquea hoy\". La regla de oro: si te presionan, frena y verifica por otro canal. ¿Quieres ver cómo reconocer esos mensajes o cómo blindar tus cuentas?"), CH_CIBER);
    }
    if (t === "redes" && p === 1) {
      if (/(llega|cable|proveedor|fibra|como funciona internet)/.test(n)) { ST.paso = 2; return out(Hn(R_LLEGA), SINO.es); }
      ST.tema = ""; ST.paso = 0;
      return out(Hn("Te dejo opciones para seguir:"), CH_REDES2);
    }
    if (t === "redes" && p === 2) {
      ST.tema = ""; ST.paso = 0;
      if (SI.test(n)) return out(Hn(R_DNS), CH_REDES2);
      return out(Hn("Sin problema. ¿Seguimos con otro tema?"), CH_MENU);
    }
    if (t === "internet" && p === 1) {
      ST.tema = ""; ST.paso = 0;
      for (var i = 0; i < INT.length; i++) { if (INT[i][0].test(n)) return out(Hn(INT[i][1]), CH_FIN); }
      return out(Hn(INT_GEN), CH_FIN);
    }
    if (t === "estudios" && p === 1) return respEstudio(n);
    if (t === "estudios" && p === 2) {
      ST.tema = ""; ST.paso = 0;
      if (/(dificil|cuesta|complicad|no entiendo|me da miedo|estres|matematica|programar)/.test(n)) return out(Hn("Es normal, a casi todos nos pasa. Aprender se hace en pasos pequeños y practicando con cosas reales. Si quieres, empezamos por algo útil hoy mismo, como proteger tu wifi o entender qué es una red privada."), CH_REDES2);
      return out(Hn("Me gusta esa actitud. Cuando algo te gusta, aprendes el doble de rápido. Si quieres, te muestro cómo se conecta con la ciberseguridad y las redes."), CH_MENU2);
    }
    ST.tema = ""; ST.paso = 0;
    return null;
  }

  function procesar(texto) {
    var raw = (texto || "").replace(/\s+/g, " ").trim();
    if (!raw) return null;
    var n = norm(raw), L = lang(), T = TXT[L], nm = nombre(), m;

    if (/^(olvida|borra|elimina) (mi nombre|mis datos|todo)|forget my name|esquece meu nome/.test(n)) {
      lss(K_NOMBRE, ""); lss(K_PERFIL, ""); ST.aw = ""; ST.pend = ""; ST.tema = ""; ST.paso = 0;
      return out(T.olvido);
    }
    if (/^(como me llamo|sabes (como me llamo|mi nombre)|cual es mi nombre|what is my name|qual e meu nome)/.test(n)) {
      if (nm) return out(T.tunombre(nm));
      ST.aw = "nombre"; return out(T.sin);
    }
    if (ST.aw === "confirmar") {
      var pend = ST.pend;
      if (SI.test(n)) return guardar(pend, L);
      if (NO.test(n)) { ST.rech.push(norm(pend)); ST.aw = "nombre"; ST.pend = ""; return out(T.otra); }
      ST.aw = ""; ST.pend = "";
    }
    m = RX_EXPL.exec(raw);
    if (m && nombreValido(m[1])) {
      var Ld = /my name|call me/i.test(raw) ? "en" : /meu nome|me chamo|pode me/i.test(raw) ? "pt" : L;
      return guardar(titulo(m[1]), Ld);
    }
    m = RX_SOY.exec(raw);
    if (m && okNombre(m[1], 2)) { ST.aw = "confirmar"; ST.pend = titulo(m[1]); return out(T.confirmar(ST.pend), SINO[L]); }
    if (ST.aw === "nombre") {
      ST.aw = "";
      if (/^(i )?(prefiero no|no quiero|no gracias|paso|skip|prefer not|prefiro nao)/.test(n)) return out(T.anonimo, L === "es" ? CH_MENU : []);
      var limpio = raw.replace(/[.!]+$/, "");
      if (pareceNombre(limpio)) return guardar(titulo(limpio), L);
    }
    if (ST.tema && !CONV.test(n)) return continuar(raw, n);
    ST.tema = ""; ST.paso = 0;
    if (ESTUDIO.test(n)) return respEstudio(n);
    var tm = detectarTema(n);
    if (CONV.test(n) || /^(ciberseguridad|redes|internet|mis estudios|estudios)$/.test(n)) {
      if (!tm && esTema(raw)) return null;
      return iniciar(tm);
    }
    if (!nm && !ST.aw && ST.rech.indexOf(n) < 0 && okNombre(raw, 2) && pareceNombre(raw)) {
      ST.aw = "confirmar"; ST.pend = titulo(raw);
      return out(T.confirmar(ST.pend), SINO[L]);
    }
    return null;
  }

  /* ---------- interfaz ---------- */
  function findInput() {
    var i = document.querySelector('input[placeholder="Escribe tu pregunta"]') || document.querySelector('textarea[placeholder="Escribe tu pregunta"]');
    if (i) return i;
    var list = document.querySelectorAll("input[type=text],input:not([type]),textarea");
    for (var k = list.length - 1; k >= 0; k--) {
      if (!list[k].closest("#sr") && list[k].parentNode && list[k].parentNode.querySelector("button")) return list[k];
    }
    return null;
  }
  function sendBtn(inp) {
    var bs = inp.parentNode.querySelectorAll("button");
    return bs.length ? bs[bs.length - 1] : null;
  }
  function ultimoBurbuja(txt) {
    var key = txt.replace(/\s+/g, " ").slice(0, 24);
    var els = document.querySelectorAll("div,p,span");
    for (var i = els.length - 1; i >= 0; i--) {
      var c = (els[i].textContent || "").replace(/\s+/g, " ").trim();
      if (c.indexOf(key) === 0 && c.length < txt.length + 40) return els[i];
    }
    return null;
  }
  function chipsUI(txt, chips) {
    var inp = findInput(); if (!inp) return;
    var row = document.createElement("div");
    row.className = "csn-charla-chips";
    row.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin:8px 12px 12px;";
    chips.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = c.t;
      b.style.cssText = "border:1px solid #b9d4f5;border-radius:999px;padding:10px 16px;background:#fff;color:#0b2342;font-size:15px;";
      b.onclick = function () {
        if (row.parentNode) row.parentNode.removeChild(row);
        var i2 = findInput(), s = i2 && sendBtn(i2);
        if (!i2 || !s) return;
        i2.value = c.s || c.t; s.click();
      };
      row.appendChild(b);
    });
    var ref = ultimoBurbuja(txt);
    if (ref && ref.parentNode) ref.parentNode.insertBefore(row, ref.nextSibling);
    else { var bar = inp.parentNode; bar.parentNode.insertBefore(row, bar); }
    try { row.scrollIntoView({ block: "end" }); } catch (e) {}
  }
  function mostrar(texto, r) {
    try { window.add(texto, "usr"); } catch (e) {}
    var i = 0;
    (function sig() {
      if (i >= r.bots.length) return;
      var b = r.bots[i++];
      setTimeout(function () {
        window.add(b.t, "bot");
        if (b.chips && b.chips.length) setTimeout(function () { chipsUI(b.t, b.chips); }, 40);
        sig();
      }, 500);
    })();
  }
  function enviar(e) {
    if (typeof window.add !== "function") return;
    var inp = findInput(); if (!inp) return;
    var texto = (inp.value || "").trim(); if (!texto) return;
    var r = procesar(texto); if (!r) return;
    e.preventDefault(); e.stopImmediatePropagation();
    inp.value = "";
    mostrar(texto, r);
  }
  function pedirNombre() {
    if (typeof window.add !== "function" || nombre() || lsg(K_PIDIO)) return;
    lss(K_PIDIO, "1");
    var L = lang(), T = TXT[L];
    ST.aw = "nombre";
    window.add(T.pedir, "bot");
    setTimeout(function () { chipsUI(T.pedir, [{ t: L === "es" ? "Prefiero no decirlo" : L === "en" ? "I prefer not to say" : "Prefiro não dizer" }]); }, 40);
  }
  if (typeof document !== "undefined") {
    document.addEventListener("click", function (e) {
      var b = e.target && e.target.closest ? e.target.closest("button") : null;
      var inp = findInput();
      if (b && inp && b === sendBtn(inp)) enviar(e);
    }, true);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" || e.shiftKey) return;
      var inp = findInput();
      if (inp && e.target === inp) enviar(e);
    }, true);
    window.addEventListener("load", function () { setTimeout(pedirNombre, 3000); });
  }
  window.CSNCharla = { procesar: procesar, _reset: function () { ST = { aw: "", pend: "", tema: "", paso: 0, rech: [] }; } };
})();
