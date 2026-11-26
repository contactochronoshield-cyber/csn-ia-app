(function () {
  'use strict';

  var B = window.CSNBiblioteca;
  if (!B || !B.responder) return;

  var responderOriginal = B.responder;
  var ultimoTema = '';

  var EMPRESAS = [
    'microsoft','google','amazon','aws','ibm','cisco','cloudflare',
    'crowdstrike','palo alto networks','fortinet','zscaler',
    'check point','sentinelone','okta','tenable','rapid7','akamai',
    'f5','trend micro','eset','bitdefender','nvidia','amd','apple',
    'samsung','openai','anthropic','tailscale','netbird','netmaker',
    'zerotier','headscale','twingate','zabbix','librenms',
    'uptime kuma','meshtastic','ubiquiti','oracle','meta',
    'huawei','ericsson','nokia','qualcomm','intel','dell','hp',
    'lenovo','juniper','arista','proofpoint','darktrace',
    'sophos','rapid7','palo alto','atlassian','salesforce'
  ];

  var RE_COMPARAR =
    /\b(compara|comparar|comparacion|comparativa|comparame|comparalo|diferencia|diferencias|versus|contra|frente a|mejor que|peor que|cual es mejor|quien es mejor|competencia|competidores|alternativas|parecida|parecidas|similar|similares|vs)\b/i;

  var RE_SEGUIMIENTO =
    /^(y cual|cual es mejor|y quien gana|y entonces|y la diferencia|cual recomiendas|cual conviene|que opinas|y por que|explica mas|dime mas)/i;

  function normalizar(s) {
    return String(s || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  function temaPara(q) {
    if (/\b(zabbix|librenms|nagios|prtg|netdata|uptime kuma|uisp|sentinel)\b/.test(q))
      return 'vs_monitoreo';

    if (/\b(meshtastic|guifi|freifunk|lora mesh|red comunitaria)\b/.test(q))
      return 'vs_mesh_comunitario';

    if (/\b(tailscale|netbird|netmaker|zerotier|headscale|twingate|wireguard|vpn mesh)\b/.test(q))
      return 'vs_vpn_mesh';

    return 'competidores_general';
  }

  function respuestaTema(id) {
    var r = B.porTema(id);
    if (r && r.encontrado) {
      ultimoTema = id;
      return r;
    }
    return null;
  }

  function responder(texto) {
    var q = normalizar(texto);
    var original = responderOriginal(texto);

    // Preguntas de seguimiento dentro de una comparación
    if (ultimoTema && RE_SEGUIMIENTO.test(q)) {
      var anterior = respuestaTema(ultimoTema);
      if (anterior) return anterior;
    }

    if (RE_COMPARAR.test(q)) {
      var tieneCSN = /\b(csn|chrono shield|nuestra empresa|nosotros)\b/.test(q);
      var mencionaEmpresa = EMPRESAS.some(function (e) {
        return q.indexOf(e) !== -1;
      });

      if (tieneCSN || mencionaEmpresa ||
          /\b(otras empresas|otras companias|la competencia|empresas tecnologicas|empresas de tecnologia)\b/.test(q)) {

        var id = temaPara(q);

        // Comparación general o entre CSN y otra empresa
        if (tieneCSN || !mencionaEmpresa) {
          if (id === 'competidores_general') id = 'competidores_general';
        }

        var resultado = respuestaTema(id);
        if (resultado) return resultado;
      }
    }

    if (original && original.encontrado) {
      ultimoTema = original.id;
      return original;
    }

    return original;
  }

  B.responder = responder;
  window.CSNInteligencia = {
    version: '1.0',
    empresasReconocidas: EMPRESAS.length,
    ultimoTema: function () { return ultimoTema; }
  };
})();
