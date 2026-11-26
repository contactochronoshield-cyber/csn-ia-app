(function () {
'use strict';

var E = [
{
id:"historia_internet",
titulo:"Historia de Internet",
claves:["historia de internet","origen de internet","arpanet","quien invento internet","como nacio internet"],
respuesta:"Internet nació de investigaciones sobre redes de computadoras. ARPANET comenzó en 1969; la conmutación de paquetes permitió transmitir información dividida en bloques. TCP/IP se convirtió en la base de la interconexión de redes en 1983. Tim Berners-Lee propuso la World Wide Web en 1989 y desarrolló sus primeras tecnologías en 1990. Internet y la Web no son lo mismo: Internet es la infraestructura; la Web es uno de sus servicios.",
relacionados:["computacion","redes","tcp_ip"]
},
{
id:"inteligencia_artificial",
titulo:"Inteligencia artificial",
claves:["inteligencia artificial","que es la ia","como funciona la ia","historia de la ia","machine learning","aprendizaje automatico"],
respuesta:"La inteligencia artificial es un campo de la computación que desarrolla sistemas capaces de realizar tareas asociadas con capacidades humanas, como reconocer patrones, comprender lenguaje y generar contenido. Incluye aprendizaje automático, redes neuronales y modelos de lenguaje. No toda IA aprende en tiempo real: muchos modelos se entrenan previamente y después generan respuestas con sus parámetros.",
relacionados:["programacion","computacion"]
},
{
id:"computacion",
titulo:"Historia de la computación",
claves:["historia de la computacion","que es una computadora","origen de las computadoras","computacion"],
respuesta:"La computación evolucionó desde instrumentos de cálculo y máquinas mecánicas hasta computadores electrónicos. ENIAC fue una de las primeras computadoras electrónicas de propósito general. La arquitectura de programa almacenado, los transistores, los circuitos integrados y los microprocesadores hicieron posibles los computadores modernos.",
relacionados:["programacion","hardware"]
},
{
id:"programacion",
titulo:"Programación",
claves:["que es programacion","como funciona programar","lenguajes de programacion","python","javascript","programacion"],
respuesta:"Programar consiste en escribir instrucciones que una computadora puede ejecutar. Python se utiliza mucho en automatización, ciencia de datos e IA; JavaScript en aplicaciones web; Java y Kotlin en desarrollo Android; C y C++ en sistemas y software de alto rendimiento. La elección depende del problema y del entorno.",
relacionados:["computacion","inteligencia_artificial"]
},
{
id:"redes",
titulo:"Redes informáticas",
claves:["que es una red","redes informaticas","como funciona internet","router","switch","direccion ip","dns"],
respuesta:"Una red conecta dispositivos para intercambiar datos. Los routers conectan redes diferentes; los switches conectan equipos dentro de una red local; DNS traduce nombres de dominio a direcciones IP; TCP administra conexiones fiables y UDP permite comunicaciones sin conexión. Ethernet y Wi-Fi son tecnologías comunes de acceso.",
relacionados:["historia_internet","tcp_ip"]
},
{
id:"tcp_ip",
titulo:"TCP/IP",
claves:["tcp ip","que es tcp","que es ip","protocolo de internet"],
respuesta:"TCP/IP es el conjunto de protocolos que permite comunicar dispositivos a través de redes. IP direcciona y transporta paquetes entre redes; TCP proporciona entrega ordenada y control de errores; UDP ofrece transporte más sencillo y de menor latencia. DNS, HTTP y otros protocolos funcionan sobre esta infraestructura.",
relacionados:["redes","historia_internet"]
},
{
id:"hardware",
titulo:"Hardware y microprocesadores",
claves:["hardware","procesador","cpu","gpu","ram","microcontrolador","arduino","esp32"],
respuesta:"El hardware es la parte física de un sistema. La CPU ejecuta instrucciones generales; la GPU procesa grandes cantidades de operaciones paralelas; la RAM almacena temporalmente datos de trabajo. Microcontroladores como Arduino y ESP32 integran procesamiento, memoria y periféricos para controlar sensores y dispositivos.",
relacionados:["computacion","programacion"]
},
{
id:"ciencia_espacio",
titulo:"Ciencia y exploración espacial",
claves:["exploracion espacial","espacio","sistema solar","marte","nasa","cohetes"],
respuesta:"La exploración espacial combina física, ingeniería, astronomía, robótica y telecomunicaciones. Los satélites permiten observación terrestre, navegación y comunicaciones. Las misiones robóticas estudian planetas y otros cuerpos; los sistemas tripulados requieren protección frente a radiación, soporte vital y comunicaciones de larga distancia.",
relacionados:["hardware","computacion"]
},
{
id:"economia",
titulo:"Economía y tecnología",
claves:["economia tecnologica","economia digital","que es una startup","empresas tecnologicas","innovacion"],
respuesta:"La economía digital utiliza software, redes, datos y plataformas para crear productos y servicios. Una startup suele buscar un modelo de negocio repetible y escalable. La innovación tecnológica no garantiza éxito comercial: también importan demanda, costos, competencia, regulación, financiación y capacidad de ejecución.",
relacionados:["inteligencia_artificial","programacion"]
},
{
id:"comparador_empresas",
titulo:"Comparador de empresas tecnológicas",
claves:["comparar empresas","comparador de empresas","empresas tecnologicas","empresas de tecnologia","competencia tecnologica","comparar companias","lista de empresas tecnologicas"],
respuesta:"CSN IA dispone de un catálogo inicial de empresas para orientar comparaciones. Se pueden comparar por sector, especialidad, productos, origen y trayectoria. Una comparación rigurosa debe distinguir datos públicos, características verificadas y capacidades que todavía no han sido demostradas por CSN.",
relacionados:["comparador_catalogo","historia_internet"]
}
];

var empresas = [
["Microsoft",1975,"Estados Unidos","Software, nube e IA"],
["Apple",1976,"Estados Unidos","Hardware, software y servicios"],
["Google",1998,"Estados Unidos","Búsqueda, publicidad, nube e IA"],
["Amazon",1994,"Estados Unidos","Comercio electrónico y nube"],
["IBM",1911,"Estados Unidos","Computación empresarial y consultoría"],
["Cisco",1984,"Estados Unidos","Redes y ciberseguridad"],
["Oracle",1977,"Estados Unidos","Bases de datos y nube"],
["Intel",1968,"Estados Unidos","Procesadores y semiconductores"],
["NVIDIA",1993,"Estados Unidos","GPU e infraestructura de IA"],
["AMD",1969,"Estados Unidos","Procesadores y GPU"],
["Meta",2004,"Estados Unidos","Plataformas digitales e IA"],
["OpenAI",2015,"Estados Unidos","Investigación y productos de IA"],
["Anthropic",2021,"Estados Unidos","Investigación y modelos de IA"],
["Cloudflare",2009,"Estados Unidos","Redes, CDN y seguridad"],
["CrowdStrike",2011,"Estados Unidos","Ciberseguridad y protección de endpoints"],
["Palo Alto Networks",2005,"Estados Unidos","Ciberseguridad empresarial"],
["Fortinet",2000,"Estados Unidos","Seguridad de redes"],
["Zscaler",2007,"Estados Unidos","Seguridad cloud y Zero Trust"],
["Check Point",1993,"Israel","Ciberseguridad"],
["SentinelOne",2013,"Estados Unidos","Seguridad de endpoints con IA"],
["Okta",2009,"Estados Unidos","Identidad y acceso"],
["Tenable",2002,"Estados Unidos","Gestión de exposición y vulnerabilidades"],
["Rapid7",2000,"Estados Unidos","Ciberseguridad y gestión de riesgos"],
["Akamai",1998,"Estados Unidos","CDN y seguridad web"],
["F5",1996,"Estados Unidos","Entrega de aplicaciones y seguridad"],
["Trend Micro",1988,"Japón","Ciberseguridad"],
["ESET",1992,"Eslovaquia","Antivirus y ciberseguridad"],
["Bitdefender",2001,"Rumanía","Ciberseguridad"],
["Samsung",1938,"Corea del Sur","Electrónica y semiconductores"],
["Huawei",1987,"China","Telecomunicaciones y hardware"],
["Ericsson",1876,"Suecia","Infraestructura de telecomunicaciones"],
["Nokia",1865,"Finlandia","Redes y telecomunicaciones"],
["Qualcomm",1985,"Estados Unidos","Semiconductores y comunicaciones móviles"],
["Broadcom",1961,"Estados Unidos","Semiconductores e infraestructura"],
["Dell",1984,"Estados Unidos","Computadores e infraestructura"],
["HP",1939,"Estados Unidos","Computación e impresión"],
["Lenovo",1984,"China","Computadores y dispositivos"],
["Adobe",1982,"Estados Unidos","Software creativo y empresarial"],
["Salesforce",1999,"Estados Unidos","CRM y software empresarial"],
["SAP",1972,"Alemania","Software empresarial"],
["ServiceNow",2004,"Estados Unidos","Automatización empresarial"],
["Atlassian",2002,"Australia","Software de colaboración"],
["GitHub",2008,"Estados Unidos","Desarrollo y alojamiento de código"],
["GitLab",2011,"Estados Unidos","DevSecOps y desarrollo"],
["Palantir",2003,"Estados Unidos","Análisis e integración de datos"],
["Datadog",2010,"Estados Unidos","Observabilidad e infraestructura"],
["Snowflake",2012,"Estados Unidos","Plataforma de datos cloud"],
["MongoDB",2007,"Estados Unidos","Bases de datos"],
["DigitalOcean",2011,"Estados Unidos","Infraestructura cloud"],
["OVHcloud",1999,"Francia","Alojamiento e infraestructura cloud"],
["Chrono Shield Networks",2023,"Colombia","Proyecto de redes, seguridad y herramientas de software"]
];

var claves = empresas.map(function(e){return e[0].toLowerCase();});

E.push({
id:"comparador_catalogo",
titulo:"Catálogo de empresas tecnológicas",
claves:claves.concat(["mas de 50 empresas","50 empresas","catalogo de empresas","lista de companias","empresas de ciberseguridad","empresas de ia","empresas cloud","empresas de telecomunicaciones"]),
respuesta:"CATÁLOGO INICIAL DE EMPRESAS:\n"+empresas.map(function(e){return "• "+e[0]+" — "+e[1]+" — "+e[2]+" — "+e[3];}).join("\n")+"\n\nLos años y países son datos orientativos de fundación y origen. Para decisiones comerciales o comparaciones actuales deben verificarse con fuentes oficiales. CSN es un proyecto en desarrollo y no debe considerarse equivalente en escala o madurez a estas compañías.",
relacionados:["comparador_empresas"]
});

window.CSN_BIBLIOTECA = window.CSN_BIBLIOTECA || [];
Array.prototype.push.apply(window.CSN_BIBLIOTECA,E);
window.CSN_EMPRESAS = empresas;
})();
