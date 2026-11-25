(function () {
  var P = [
  {"id":"por_que_csn","titulo":"Qué hace mejor a CSN","claves":["por que csn","por que elegir csn","que nos hace diferentes","ventajas de csn","por que son mejores","que los diferencia","diferencias de csn","por que ustedes","en que se diferencia csn","por que contratar csn","valor de csn","son mejores que tailscale","son mejores que la competencia"],"respuesta":"Esto es lo que hace mejor a CSN, con razones:\n• Soberanía real: tus datos y tu infraestructura quedan en tus manos, no en una nube ajena. Sentinel Central puede correr en servidores del cliente.\n• Funciona donde otros no llegan: Sentinel corre en un celular viejo con Termux, sin nube y sin Docker.\n• Hecho para Latinoamérica: en español, con soporte cercano y pensado para enlaces inestables y equipo económico.\n• Todo en uno: red privada, monitoreo anti-sabotaje, IA, hardware mesh y aprendizaje en un solo ecosistema.\n• Se explica para todos: la gente no técnica aprende a usarlo.\n• Experiencia: su fundador lleva 14 años en este campo, desde antes de que existieran herramientas como Tailscale o NetBird, y eso está en cada decisión de diseño.\n• Código abierto: puedes auditar lo que corre.\nPara ser transparentes: hay proyectos más grandes y con más años de producto; la ventaja de CSN está en lo anterior.","relacionados":["csn_fundador","csn_limites","competidores_general"]},
  {"id":"csn_fundador","titulo":"Quién está detrás de CSN","claves":["quien fundo csn","fundador de csn","quien es el fundador","quien esta detras de csn","experiencia del fundador","quien creo csn","quien lidera csn"],"respuesta":"CSN fue fundada en Bogotá, Colombia, y opera desde 2023. Su fundador tiene 14 años de experiencia en redes, infraestructura y seguridad, y construyó CSN desde la necesidad real de Latinoamérica: infraestructura soberana que funcione con equipo modesto y conexiones inestables. La empresa está legalmente constituida y registrada en la Cámara de Comercio de Bogotá.","relacionados":["empresa","por_que_csn"]}
  ];
  var L = window.CSN_BIBLIOTECA = window.CSN_BIBLIOTECA || [];
  P.forEach(function (p) {
    var i = -1;
    for (var k = 0; k < L.length; k++) { if (L[k].id === p.id) { i = k; break; } }
    if (i >= 0) L[i] = p; else L.push(p);
  });
})();
