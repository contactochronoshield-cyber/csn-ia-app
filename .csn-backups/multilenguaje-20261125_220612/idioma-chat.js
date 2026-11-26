(function () {
  'use strict';

  function detectar(texto) {
    var t = String(texto || '').toLowerCase();

    if (/[¿¡]/.test(t) ||
        /\b(que|como|cuando|donde|porque|quiero|puedes|necesito|gracias|hola|empresa|comparar)\b/.test(t))
      return 'es';

    if (/[ãõç]/.test(t) ||
        /\b(voce|vocês|obrigado|obrigada|quero|preciso|como|empresa|comparar|seguranca|rede|redes|ola|ola|nao|estou)\b/.test(t))
      return 'pt';

    if (/\b(the|what|how|when|where|why|please|thanks|hello|want|need|company|companies|compare|security|network|networks|which|better)\b/.test(t))
      return 'en';

    return '';
  }

  function idioma(texto) {
    var detectado = detectar(texto);
    if (detectado) {
      try { localStorage.setItem('csn_chat_lang', detectado); } catch (e) {}
      return detectado;
    }
    try {
      return localStorage.getItem('csn_chat_lang') ||
             localStorage.getItem('csn_lang') || 'es';
    } catch (e) {
      return 'es';
    }
  }

  window.CSNIdioma = {
    detectar: detectar,
    idioma: idioma
  };
})();
