(function () {
  'use strict';

  var D = {
    es: {
      no: "Todavía no tengo una respuesta completa para ese tema en mi biblioteca. Puedo ayudarte con redes, ciberseguridad, inteligencia artificial y tecnología.",
      saludo: "¡Hola! Soy CSN IA. ¿En qué puedo ayudarte?",
      gracias: "¡Con gusto! Estoy aquí para ayudarte.",
      ejemplo: "Te lo explico con un ejemplo de la vida diaria:"
    },
    en: {
      no: "I don't have a complete answer for that topic in my offline library yet. I can help with networking, cybersecurity, artificial intelligence, and technology.",
      saludo: "Hello! I'm CSN AI. How can I help you?",
      gracias: "You're welcome! I'm here to help.",
      ejemplo: "Let me explain with an everyday example:"
    },
    pt: {
      no: "Ainda não tenho uma resposta completa sobre esse assunto na minha biblioteca offline. Posso ajudar com redes, cibersegurança, inteligência artificial e tecnologia.",
      saludo: "Olá! Sou a CSN IA. Como posso ajudar?",
      gracias: "Por nada! Estou aqui para ajudar.",
      ejemplo: "Vou explicar com um exemplo do dia a dia:"
    }
  };

  function detectar(s) {
    var t = String(s || '').toLowerCase();

    if (/[¿¡]/.test(t)) return 'es';

    if (/[ãõç]/.test(t) ||
        /\b(obrigado|obrigada|voce|vocês|quero|preciso|seguranca|segurança|nao|não|estou|ola|olá)\b/.test(t))
      return 'pt';

    if (/\b(quiero|puedes|necesito|gracias|hola|empresa|comparar|seguridad|cuando|donde|porque)\b/.test(t))
      return 'es';

    if (/\b(the|what|how|when|where|why|please|thanks|hello|want|need|company|companies|compare|security|network|networks|which|better|is|are|can|does)\b/.test(t))
      return 'en';

    return '';
  }

  function idioma(s) {
    var d = detectar(s);
    if (d) {
      try {
        localStorage.setItem('csn_chat_lang', d);
        localStorage.setItem('csn_lang', d);
      } catch (e) {}
      return d;
    }
    try {
      return localStorage.getItem('csn_lang') ||
             localStorage.getItem('csn_chat_lang') || 'es';
    } catch (e) { return 'es'; }
  }

  function traducir(texto, lang) {
    var t = String(texto || '');
    var mapa = D[lang] || D.es;
    if (lang === 'es') return t;

    if (/todav[ií]a no tengo|no tengo una respuesta completa|no encontr[eé] informaci[oó]n/i.test(t)) return mapa.no;
    if (/¡?hola!?|buenos d[ií]as|buenas tardes|buenas noches/i.test(t)) return mapa.saludo;
    if (/con gusto|de nada|estoy aqu[ií] para ayudarte/i.test(t)) return mapa.gracias;
    if (/te lo explico con un ejemplo de la vida diaria/i.test(t)) return mapa.ejemplo;

    return t;
  }

  window.CSNIdioma = {
    detectar: detectar,
    idioma: idioma,
    traducir: traducir
  };
})();
