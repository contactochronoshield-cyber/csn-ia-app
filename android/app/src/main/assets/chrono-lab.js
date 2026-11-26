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
      solucion: "function esSospechosa(url) {\n  const host = url.split('/')[2];\n  return /^\\d+\\.\\d+\\.\\d+\\.\\d+$/.test(host) || host === 'bit.ly' || host === 'tinyurl.com';\n}" },
    {"id": "tpl", "titulo": "Básico · Texto con plantillas", "texto": "Las plantillas usan comillas invertidas (`) y ${variable} para insertar valores dentro del texto.\n\nObjetivo: escribe saludo(nombre, edad) que devuelva, por ejemplo: Hola Ana, tienes 30 años", "pista": "Return `Hola ${nombre}, tienes ${edad} años`;", "starter": "function saludo(nombre, edad) {\n  // devuelve el texto con la plantilla\n}\n", "tests": "console.log(saludo('Ana', 30));\nconsole.log(saludo('Luis', 5));", "exTests": "Hola Ana, tienes 30 años\nHola Luis, tienes 5 años", "solucion": "function saludo(nombre, edad) {\n  return `Hola ${nombre}, tienes ${edad} años`;\n}"},
    {"id": "while", "titulo": "Básico · Bucle while", "texto": "while repite mientras la condición sea verdadera. Cuida que la condición termine algún día.\n\nObjetivo: sumaHasta(n) devuelve 1 + 2 + ... + n usando while.", "pista": "Usa dos variables: i empieza en 1 y total en 0. Suma i y avanza i++ dentro del while.", "starter": "function sumaHasta(n) {\n  // usa while\n}\n", "tests": "console.log(sumaHasta(5));\nconsole.log(sumaHasta(100));", "exTests": "15\n5050", "solucion": "function sumaHasta(n) {\n  let i = 1, total = 0;\n  while (i <= n) {\n    total += i;\n    i++;\n  }\n  return total;\n}"},
    {"id": "fizz", "titulo": "Básico · FizzBuzz", "texto": "Clásico de entrevistas. Devuelve una lista del 1 al n donde:\n- múltiplos de 3 -> 'Fizz'\n- múltiplos de 5 -> 'Buzz'\n- múltiplos de 15 -> 'FizzBuzz'\n- el resto -> el número como texto", "pista": "Revisa primero el caso de 15, porque también es múltiplo de 3 y de 5.", "starter": "function fizzbuzz(n) {\n  const r = [];\n  // llena r\n  return r;\n}\n", "tests": "console.log(fizzbuzz(15).join(','));", "exTests": "1,2,Fizz,4,Buzz,Fizz,7,8,Fizz,Buzz,11,Fizz,13,14,FizzBuzz", "solucion": "function fizzbuzz(n) {\n  const r = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) r.push('FizzBuzz');\n    else if (i % 3 === 0) r.push('Fizz');\n    else if (i % 5 === 0) r.push('Buzz');\n    else r.push(String(i));\n  }\n  return r;\n}"},
    {"id": "objetos", "titulo": "Básico · Objetos", "texto": "Un objeto agrupa datos con nombre: { nombre: 'Ana', edad: 30 }.\n\nObjetivo: crearUsuario(nombre, rol) devuelve un objeto con nombre, rol y activo: true (en ese orden).", "pista": "return { nombre, rol, activo: true };", "starter": "function crearUsuario(nombre, rol) {\n}\n", "tests": "console.log(crearUsuario('Ana', 'admin'));", "exTests": "{\"nombre\":\"Ana\",\"rol\":\"admin\",\"activo\":true}", "solucion": "function crearUsuario(nombre, rol) {\n  return { nombre, rol, activo: true };\n}"},
    {"id": "hof", "titulo": "Básico · map, filter y reduce", "texto": "filter se queda con lo que cumple una condición, map transforma cada elemento y reduce junta todo en un solo valor.\n\nObjetivo: sumaCuadradosPares(lista) suma los cuadrados de los números pares.", "pista": "lista.filter(x => x % 2 === 0).map(x => x * x).reduce((a, b) => a + b, 0)", "starter": "function sumaCuadradosPares(lista) {\n}\n", "tests": "console.log(sumaCuadradosPares([1, 2, 3, 4]));\nconsole.log(sumaCuadradosPares([5, 7]));", "exTests": "20\n0", "solucion": "function sumaCuadradosPares(lista) {\n  return lista.filter(x => x % 2 === 0).map(x => x * x).reduce((a, b) => a + b, 0);\n}"},
    {"id": "spread", "titulo": "Básico · Desestructuración y spread", "texto": "Spread (...) copia o mezcla objetos y listas. La desestructuración saca valores: const [a, ...resto] = lista.\n\nObjetivo:\n- mezclar(a, b): objeto nuevo con las claves de a y b (b gana si se repiten)\n- primeroYResto(lista): devuelve { p, r } con el primer elemento y el resto", "pista": "return { ...a, ...b }; y const [p, ...r] = lista;", "starter": "function mezclar(a, b) {\n}\nfunction primeroYResto(lista) {\n}\n", "tests": "console.log(mezclar({ x: 1, y: 2 }, { y: 9, z: 3 }));\nconsole.log(primeroYResto([1, 2, 3]));", "exTests": "{\"x\":1,\"y\":9,\"z\":3}\n{\"p\":1,\"r\":[2,3]}", "solucion": "function mezclar(a, b) {\n  return { ...a, ...b };\n}\nfunction primeroYResto(lista) {\n  const [p, ...r] = lista;\n  return { p, r };\n}"},
    {"id": "sort", "titulo": "Básico · Ordenar datos", "texto": "sort ordena una lista con una función que compara dos elementos: (a, b) => a.edad - b.edad. Copia la lista antes para no modificar la original.\n\nObjetivo: ordenarPorEdad(personas) devuelve los nombres ordenados de menor a mayor edad.", "pista": "[...personas].sort((a, b) => a.edad - b.edad).map(p => p.nombre)", "starter": "function ordenarPorEdad(personas) {\n}\n", "tests": "console.log(ordenarPorEdad([{nombre:'Ana',edad:30},{nombre:'Luis',edad:20},{nombre:'Eva',edad:25}]).join(','));", "exTests": "Luis,Eva,Ana", "solucion": "function ordenarPorEdad(personas) {\n  return [...personas].sort((a, b) => a.edad - b.edad).map(p => p.nombre);\n}"},
    {"id": "json", "titulo": "Básico · JSON", "texto": "JSON es el formato de texto con el que las apps intercambian datos. JSON.parse(texto) lo convierte en objeto y JSON.stringify(obj) hace lo contrario.\n\nObjetivo: resumen(txt) recibe un JSON con nombre y puertos (lista) y devuelve 'nombre:cantidadDePuertos'.", "pista": "const o = JSON.parse(txt); return o.nombre + ':' + o.puertos.length;", "starter": "function resumen(txt) {\n}\n", "tests": "console.log(resumen('{\"nombre\":\"nodo1\",\"puertos\":[22,80,443]}'));\nconsole.log(resumen('{\"nombre\":\"x\",\"puertos\":[]}'));", "exTests": "nodo1:3\nx:0", "solucion": "function resumen(txt) {\n  const o = JSON.parse(txt);\n  return o.nombre + ':' + o.puertos.length;\n}"},
    {"id": "trycatch", "titulo": "Básico · Errores con try/catch", "texto": "Los datos externos pueden venir dañados. try/catch evita que el programa se caiga.\n\nObjetivo: parsearSeguro(txt) devuelve el objeto del JSON, o null si el texto es inválido.", "pista": "try { return JSON.parse(txt); } catch (e) { return null; }", "starter": "function parsearSeguro(txt) {\n}\n", "tests": "console.log(parsearSeguro('{\"a\":1}'));\nconsole.log(parsearSeguro('{mal'));", "exTests": "{\"a\":1}\nnull", "solucion": "function parsearSeguro(txt) {\n  try {\n    return JSON.parse(txt);\n  } catch (e) {\n    return null;\n  }\n}"},
    {"id": "closure", "titulo": "Intermedio · Closures", "texto": "Una función puede recordar las variables del lugar donde nació. Eso se llama closure y permite tener estado privado.\n\nObjetivo: contador() devuelve una función; cada vez que la llamas devuelve 1, 2, 3... Cada contador es independiente.", "pista": "let n = 0; return () => ++n;", "starter": "function contador() {\n}\n", "tests": "const c = contador();\nc(); c();\nconsole.log(c());\nconst d = contador();\nconsole.log(d());", "exTests": "3\n1", "solucion": "function contador() {\n  let n = 0;\n  return () => ++n;\n}"},
    {"id": "recursion", "titulo": "Intermedio · Recursión", "texto": "Una función recursiva se llama a sí misma con un problema más pequeño. Siempre necesita un caso base que detenga la cadena.\n\nObjetivo: factorial(n) y fib(n) (Fibonacci: 0, 1, 1, 2, 3, 5...).", "pista": "factorial: n <= 1 ? 1 : n * factorial(n - 1). fib: n < 2 ? n : fib(n - 1) + fib(n - 2).", "starter": "function factorial(n) {\n}\nfunction fib(n) {\n}\n", "tests": "console.log(factorial(5));\nconsole.log(fib(10));\nconsole.log(fib(0));", "exTests": "120\n55\n0", "solucion": "function factorial(n) {\n  return n <= 1 ? 1 : n * factorial(n - 1);\n}\nfunction fib(n) {\n  return n < 2 ? n : fib(n - 1) + fib(n - 2);\n}"},
    {"id": "mapset", "titulo": "Intermedio · Set y conteo de frecuencias", "texto": "Un Set guarda valores sin repetir. Un objeto sirve para contar cuántas veces aparece cada cosa.\n\nObjetivo:\n- contarPalabras(texto): objeto con las veces que aparece cada palabra (separadas por espacio)\n- unicos(lista): la lista sin repetidos, en el mismo orden", "pista": "c[p] = (c[p] || 0) + 1 y [...new Set(lista)]", "starter": "function contarPalabras(texto) {\n}\nfunction unicos(lista) {\n}\n", "tests": "console.log(contarPalabras('a b a c b a'));\nconsole.log(unicos([1, 2, 2, 3, 1]));", "exTests": "{\"a\":3,\"b\":2,\"c\":1}\n[1,2,3]", "solucion": "function contarPalabras(texto) {\n  const c = {};\n  for (const p of texto.split(' ')) c[p] = (c[p] || 0) + 1;\n  return c;\n}\nfunction unicos(lista) {\n  return [...new Set(lista)];\n}"},
    {"id": "regex", "titulo": "Intermedio · Expresiones regulares", "texto": "Una regex describe un patrón de texto. \\d es un dígito, {1,3} es de 1 a 3 veces, \\. es un punto, g busca todas las coincidencias.\n\nObjetivo: extraerIPs(texto) devuelve la lista de direcciones tipo 10.0.0.5 que aparezcan en el texto (lista vacía si no hay).", "pista": "texto.match(/\\b\\d{1,3}(?:\\.\\d{1,3}){3}\\b/g) || []", "starter": "function extraerIPs(texto) {\n}\n", "tests": "console.log(extraerIPs('src 10.0.0.5 dst 192.168.1.20 x 300'));\nconsole.log(extraerIPs('nada'));", "exTests": "[\"10.0.0.5\",\"192.168.1.20\"]\n[]", "solucion": "function extraerIPs(texto) {\n  return texto.match(/\\b\\d{1,3}(?:\\.\\d{1,3}){3}\\b/g) || [];\n}"},
    {"id": "clase", "titulo": "Intermedio · Clases", "texto": "Una clase es un molde para crear objetos con datos y comportamiento.\n\nObjetivo: completa Cuenta. depositar suma al saldo. retirar resta, pero si el monto es mayor al saldo lanza new Error('Fondos insuficientes').", "pista": "En retirar: if (m > this.saldo) throw new Error('Fondos insuficientes'); this.saldo -= m;", "starter": "class Cuenta {\n  constructor(saldo) {\n  }\n  depositar(m) {\n  }\n  retirar(m) {\n  }\n}\n", "tests": "const c = new Cuenta(100);\nc.depositar(50);\ntry { c.retirar(500); } catch (e) { console.log(e.message); }\nc.retirar(20);\nconsole.log(c.saldo);", "exTests": "Fondos insuficientes\n130", "solucion": "class Cuenta {\n  constructor(saldo) {\n    this.saldo = saldo;\n  }\n  depositar(m) {\n    this.saldo += m;\n  }\n  retirar(m) {\n    if (m > this.saldo) throw new Error('Fondos insuficientes');\n    this.saldo -= m;\n  }\n}"},
    {"id": "herencia", "titulo": "Intermedio · Herencia", "texto": "Con extends una clase hereda de otra y puede reemplazar sus métodos.\n\nObjetivo: crea Perro que extienda Animal y cuyo método hablar devuelva: <nombre> dice guau", "pista": "class Perro extends Animal { hablar() { return this.nombre + ' dice guau'; } }", "starter": "class Animal {\n  constructor(nombre) { this.nombre = nombre; }\n  hablar() { return this.nombre + ' hace un sonido'; }\n}\n// escribe aquí la clase Perro\n", "tests": "console.log(new Animal('X').hablar());\nconsole.log(new Perro('Rex').hablar());", "exTests": "X hace un sonido\nRex dice guau", "solucion": "class Animal {\n  constructor(nombre) { this.nombre = nombre; }\n  hablar() { return this.nombre + ' hace un sonido'; }\n}\nclass Perro extends Animal {\n  hablar() { return this.nombre + ' dice guau'; }\n}"},
    {"id": "componer", "titulo": "Intermedio · Funciones de orden superior", "texto": "Las funciones también son valores: se pueden pasar y devolver.\n\nObjetivo: componer(f, g) devuelve una función que aplica primero g y luego f.", "pista": "return x => f(g(x));", "starter": "function componer(f, g) {\n}\n", "tests": "const sumar1 = x => x + 1;\nconst doble = x => x * 2;\nconsole.log(componer(sumar1, doble)(5));\nconsole.log(componer(doble, sumar1)(5));", "exTests": "11\n12", "solucion": "function componer(f, g) {\n  return x => f(g(x));\n}"},
    {"id": "generador", "titulo": "Intermedio · Generadores", "texto": "Una función con * es un generador: entrega valores uno a uno con yield, sin crear toda la lista de golpe.\n\nObjetivo: rango(a, b) entrega los enteros de a hasta b.", "pista": "for (let i = a; i <= b; i++) yield i;", "starter": "function* rango(a, b) {\n}\n", "tests": "console.log([...rango(1, 5)]);", "exTests": "[1,2,3,4,5]", "solucion": "function* rango(a, b) {\n  for (let i = a; i <= b; i++) yield i;\n}"},
    {"id": "memo", "titulo": "Intermedio · Memoización", "texto": "Memoizar es guardar resultados ya calculados para no repetir trabajo.\n\nObjetivo: memoizar(fn) devuelve una versión de fn (con un solo argumento) que usa un Map como caché.", "pista": "const c = new Map(); if (!c.has(n)) c.set(n, fn(n)); return c.get(n);", "starter": "function memoizar(fn) {\n}\n", "tests": "let llamadas = 0;\nconst lento = n => { llamadas++; return n * 2; };\nconst m = memoizar(lento);\nm(4); m(4); m(4);\nconsole.log(llamadas, m(4));", "exTests": "1 8", "solucion": "function memoizar(fn) {\n  const c = new Map();\n  return n => {\n    if (!c.has(n)) c.set(n, fn(n));\n    return c.get(n);\n  };\n}"},
    {"id": "djb2", "titulo": "Avanzado · Hash: función djb2", "texto": "Un hash convierte cualquier texto en un número de tamaño fijo. Cambiar una sola letra cambia todo el resultado. djb2 es un hash simple (no seguro para contraseñas, pero perfecto para aprender).\n\nAlgoritmo: h = 5381; por cada letra: h = h * 33 + código de la letra. Al final fuerza 32 bits sin signo con >>> 0.", "pista": "h = ((h << 5) + h + s.charCodeAt(i)) >>> 0", "starter": "function djb2(s) {\n}\n", "tests": "console.log(djb2('a'));\nconsole.log(djb2('ab'));\nconsole.log(djb2('hello'));", "exTests": "177670\n5863208\n261238937", "solucion": "function djb2(s) {\n  let h = 5381;\n  for (let i = 0; i < s.length; i++) {\n    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;\n  }\n  return h;\n}"},
    {"id": "xor", "titulo": "Avanzado · Cifrado XOR", "texto": "XOR (^) combina bits: aplicarlo dos veces con la misma clave devuelve el original. Es la base de muchos cifrados de flujo.\n\nObjetivo: xorBytes(texto, clave) devuelve la lista de códigos de cada letra del texto XOR la letra de la clave (la clave se repite cíclicamente).", "pista": "texto.charCodeAt(i) ^ clave.charCodeAt(i % clave.length)", "starter": "function xorBytes(texto, clave) {\n}\n", "tests": "const c = xorBytes('AB', 'K');\nconsole.log(c);\nconsole.log(xorBytes(String.fromCharCode(...c), 'K').join(','));", "exTests": "[10,9]\n65,66", "solucion": "function xorBytes(texto, clave) {\n  const r = [];\n  for (let i = 0; i < texto.length; i++) {\n    r.push(texto.charCodeAt(i) ^ clave.charCodeAt(i % clave.length));\n  }\n  return r;\n}"},
    {"id": "vigenere", "titulo": "Avanzado · Cifrado Vigenère", "texto": "Vigenère es como César, pero el desplazamiento cambia según una palabra clave. Se usó siglos hasta que se rompió con análisis de frecuencias.\n\nObjetivo: vigenere(texto, clave) con letras MAYÚSCULAS A-Z. Cada letra se desplaza según la letra de la clave (A=0, B=1...), repitiendo la clave.", "pista": "(texto.charCodeAt(i) - 65 + clave.charCodeAt(i % clave.length) - 65) % 26 + 65", "starter": "function vigenere(texto, clave) {\n}\n", "tests": "console.log(vigenere('ATAQUE', 'LIMON'));\nconsole.log(vigenere('HOLA', 'A'));", "exTests": "LBMEHP\nHOLA", "solucion": "function vigenere(texto, clave) {\n  let r = '';\n  for (let i = 0; i < texto.length; i++) {\n    const c = (texto.charCodeAt(i) - 65 + clave.charCodeAt(i % clave.length) - 65) % 26 + 65;\n    r += String.fromCharCode(c);\n  }\n  return r;\n}"},
    {"id": "entropia", "titulo": "Avanzado · Entropía de una contraseña", "texto": "La fortaleza se mide en bits: longitud * log2(tamaño del alfabeto). Cada bit extra duplica el trabajo del atacante.\n\nObjetivo: bitsEntropia(longitud, alfabeto) devuelve los bits redondeados. Ej: 8 letras minúsculas (alfabeto 26) = 38 bits.", "pista": "Math.round(longitud * Math.log2(alfabeto))", "starter": "function bitsEntropia(longitud, alfabeto) {\n}\n", "tests": "console.log(bitsEntropia(8, 26));\nconsole.log(bitsEntropia(12, 94));\nconsole.log(bitsEntropia(4, 10));", "exTests": "38\n79\n13", "solucion": "function bitsEntropia(longitud, alfabeto) {\n  return Math.round(longitud * Math.log2(alfabeto));\n}"},
    {"id": "xss", "titulo": "Avanzado · Seguridad web: evitar XSS", "texto": "XSS ocurre cuando una página muestra texto del usuario como si fuera código HTML. La defensa básica es escapar los caracteres especiales antes de mostrarlos.\n\nObjetivo: escaparHTML(s) reemplaza & < > \" ' por &amp; &lt; &gt; &quot; &#39; (empieza por &).", "pista": "s.replace(/&/g,'&amp;').replace(/</g,'&lt;') ... en ese orden.", "starter": "function escaparHTML(s) {\n}\n", "tests": "console.log(escaparHTML('<script>alert(\"x\")</script>'));\nconsole.log(escaparHTML('a&b'));", "exTests": "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;\na&amp;b", "solucion": "function escaparHTML(s) {\n  return s.replace(/&/g, '&amp;')\n          .replace(/</g, '&lt;')\n          .replace(/>/g, '&gt;')\n          .replace(/\"/g, '&quot;')\n          .replace(/'/g, '&#39;');\n}"},
    {"id": "sqli", "titulo": "Avanzado · Seguridad web: detectar inyección SQL", "texto": "La inyección SQL mete código en un campo de texto para alterar una consulta. La defensa real son las consultas parametrizadas; detectar patrones sirve como alerta extra en registros.\n\nObjetivo: esSospechosaSQL(entrada) devuelve true si contiene una comilla simple, --, ;, un patrón OR 1=1 o UNION SELECT (sin importar mayúsculas).", "pista": "/('|--|;|\\bor\\b\\s+\\d+\\s*=\\s*\\d+|\\bunion\\b\\s+select\\b)/i.test(entrada)", "starter": "function esSospechosaSQL(entrada) {\n}\n", "tests": "console.log(esSospechosaSQL('ana'));\nconsole.log(esSospechosaSQL(\"' OR 1=1 --\"));\nconsole.log(esSospechosaSQL('1 UNION SELECT clave FROM usuarios'));\nconsole.log(esSospechosaSQL('pedro'));", "exTests": "false\ntrue\ntrue\nfalse", "solucion": "function esSospechosaSQL(entrada) {\n  return /('|--|;|\\bor\\b\\s+\\d+\\s*=\\s*\\d+|\\bunion\\b\\s+select\\b)/i.test(entrada);\n}"},
    {"id": "cabeceras", "titulo": "Avanzado · Seguridad web: cabeceras HTTP", "texto": "Las cabeceras de seguridad le dicen al navegador cómo protegerse. Tres básicas: content-security-policy, strict-transport-security y x-content-type-options.\n\nObjetivo: faltantes(cabeceras) recibe un objeto con nombres de cabecera en minúscula y devuelve las que NO están, en el orden de REQUERIDAS.", "pista": "REQUERIDAS.filter(h => !(h in cabeceras))", "starter": "const REQUERIDAS = ['content-security-policy', 'strict-transport-security', 'x-content-type-options'];\nfunction faltantes(cabeceras) {\n}\n", "tests": "console.log(faltantes({ 'strict-transport-security': 'max-age=31536000' }));\nconsole.log(faltantes({}));", "exTests": "[\"content-security-policy\",\"x-content-type-options\"]\n[\"content-security-policy\",\"strict-transport-security\",\"x-content-type-options\"]", "solucion": "const REQUERIDAS = ['content-security-policy', 'strict-transport-security', 'x-content-type-options'];\nfunction faltantes(cabeceras) {\n  return REQUERIDAS.filter(h => !(h in cabeceras));\n}"},
    {"id": "ipnum", "titulo": "Avanzado · Redes: IP como número", "texto": "Una IPv4 son 4 bytes. 192.168.1.1 equivale a un solo número de 32 bits. Los routers comparan redes con ese número.\n\nObjetivo: ipANumero(ip) = ((a*256 + b)*256 + c)*256 + d.", "pista": "ip.split('.').reduce((acc, x) => acc * 256 + Number(x), 0)", "starter": "function ipANumero(ip) {\n}\n", "tests": "console.log(ipANumero('192.168.1.1'));\nconsole.log(ipANumero('10.0.0.1'));\nconsole.log(ipANumero('0.0.0.0'));", "exTests": "3232235777\n167772161\n0", "solucion": "function ipANumero(ip) {\n  return ip.split('.').reduce((acc, x) => acc * 256 + Number(x), 0);\n}"},
    {"id": "cidr", "titulo": "Avanzado · Redes: subredes CIDR", "texto": "/24 significa que los primeros 24 bits identifican la red y quedan 32-24 = 8 bits para equipos. Se reservan 2 direcciones (red y broadcast).\n\nObjetivo: hostsUtiles(prefijo) = 2^(32-prefijo) - 2.", "pista": "Math.pow(2, 32 - prefijo) - 2", "starter": "function hostsUtiles(prefijo) {\n}\n", "tests": "console.log(hostsUtiles(24));\nconsole.log(hostsUtiles(30));\nconsole.log(hostsUtiles(16));\nconsole.log(hostsUtiles(8));", "exTests": "254\n2\n65534\n16777214", "solucion": "function hostsUtiles(prefijo) {\n  return Math.pow(2, 32 - prefijo) - 2;\n}"},
    {"id": "mismared", "titulo": "Avanzado · Redes: ¿están en la misma red?", "texto": "Dos IP están en la misma red si, al aplicar la máscara (AND de bits), dan el mismo resultado. La máscara de un prefijo p son p unos seguidos de ceros.\n\nObjetivo: mismaRed(a, b, prefijo). Usa >>> 0 para mantener números sin signo.", "pista": "const m = (0xFFFFFFFF << (32 - prefijo)) >>> 0; compara (n1 & m) >>> 0 con (n2 & m) >>> 0.", "starter": "function ipANumero(ip) {\n  return ip.split('.').reduce((acc, x) => acc * 256 + Number(x), 0);\n}\nfunction mismaRed(a, b, prefijo) {\n}\n", "tests": "console.log(mismaRed('192.168.1.10', '192.168.1.200', 24));\nconsole.log(mismaRed('192.168.1.10', '192.168.2.10', 24));\nconsole.log(mismaRed('10.1.2.3', '10.200.9.9', 8));\nconsole.log(mismaRed('10.1.2.3', '11.1.2.3', 8));", "exTests": "true\nfalse\ntrue\nfalse", "solucion": "function ipANumero(ip) {\n  return ip.split('.').reduce((acc, x) => acc * 256 + Number(x), 0);\n}\nfunction mismaRed(a, b, prefijo) {\n  const m = prefijo === 0 ? 0 : (0xFFFFFFFF << (32 - prefijo)) >>> 0;\n  return ((ipANumero(a) & m) >>> 0) === ((ipANumero(b) & m) >>> 0);\n}"},
    {"id": "puertos", "titulo": "Avanzado · Redes: puertos y servicios", "texto": "Cada servicio escucha en un puerto: SSH 22, HTTP 80, HTTPS 443, DNS 53, RDP 3389. Saber esto ayuda a leer un escaneo y a cerrar lo que no se usa.\n\nObjetivo: servicio(puerto) devuelve el nombre, o 'desconocido'.", "pista": "const t = {22:'SSH', ...}; return t[puerto] || 'desconocido';", "starter": "function servicio(puerto) {\n}\n", "tests": "console.log(servicio(22));\nconsole.log(servicio(443));\nconsole.log(servicio(9999));", "exTests": "SSH\nHTTPS\ndesconocido", "solucion": "function servicio(puerto) {\n  const t = { 22: 'SSH', 80: 'HTTP', 443: 'HTTPS', 53: 'DNS', 3389: 'RDP' };\n  return t[puerto] || 'desconocido';\n}"},
    {"id": "logs", "titulo": "Avanzado · Defensa: analizar logs", "texto": "Muchos intentos fallidos desde una misma IP suelen ser fuerza bruta. Detectarlo en los logs es trabajo diario de un analista.\n\nObjetivo: ipsSospechosas(lineas, umbral). Cada línea es como 'FAILED login from 1.2.3.4'. Devuelve las IP con al menos umbral fallos, en orden de aparición. Las líneas que no empiezan con FAILED se ignoran.", "pista": "Cuenta con un objeto: la IP es lo último de la línea (split(' ').pop()).", "starter": "function ipsSospechosas(lineas, umbral) {\n}\n", "tests": "const l = ['FAILED login from 1.1.1.1', 'OK login from 2.2.2.2', 'FAILED login from 1.1.1.1', 'FAILED login from 3.3.3.3', 'FAILED login from 1.1.1.1'];\nconsole.log(ipsSospechosas(l, 3));\nconsole.log(ipsSospechosas(l, 1));", "exTests": "[\"1.1.1.1\"]\n[\"1.1.1.1\",\"3.3.3.3\"]", "solucion": "function ipsSospechosas(lineas, umbral) {\n  const c = {};\n  for (const l of lineas) {\n    if (l.startsWith('FAILED')) {\n      const ip = l.split(' ').pop();\n      c[ip] = (c[ip] || 0) + 1;\n    }\n  }\n  return Object.keys(c).filter(ip => c[ip] >= umbral);\n}"},
    {"id": "limitador", "titulo": "Avanzado · Defensa: limitador de peticiones", "texto": "Un limitador de tasa frena abusos: permite hasta max peticiones y rechaza las siguientes. Es la base de la protección anti fuerza bruta.\n\nObjetivo: limitador(max) devuelve una función que responde true las primeras max veces y false después.", "pista": "let n = 0; return () => { n++; return n <= max; };", "starter": "function limitador(max) {\n}\n", "tests": "const p = limitador(2);\nconsole.log(p(), p(), p());", "exTests": "true true false", "solucion": "function limitador(max) {\n  let n = 0;\n  return () => {\n    n++;\n    return n <= max;\n  };\n}"},
    {"id": "hex", "titulo": "Avanzado · Datos: bytes a hexadecimal", "texto": "Los hashes y las claves se muestran en hexadecimal: cada byte son 2 caracteres (00 a ff).\n\nObjetivo: aHex(bytes) convierte una lista de números 0-255 en un texto hexadecimal con 2 dígitos por byte.", "pista": "b.toString(16).padStart(2, '0')", "starter": "function aHex(bytes) {\n}\n", "tests": "console.log(aHex([0, 15, 255, 16]));\nconsole.log(aHex([1, 2]));", "exTests": "000fff10\n0102", "solucion": "function aHex(bytes) {\n  return bytes.map(b => b.toString(16).padStart(2, '0')).join('');\n}"},
    {"id": "bits", "titulo": "Avanzado · Datos: contar bits", "texto": "Los operadores de bits (&, >>>) trabajan con la representación binaria. Se usan en máscaras de red, permisos y criptografía.\n\nObjetivo: cuentaBits(n) devuelve cuántos bits valen 1 en n. Ej: 7 es 111, tiene 3.", "pista": "while (n) { c += n & 1; n >>>= 1; }", "starter": "function cuentaBits(n) {\n}\n", "tests": "console.log(cuentaBits(7));\nconsole.log(cuentaBits(255));\nconsole.log(cuentaBits(256));\nconsole.log(cuentaBits(0));", "exTests": "3\n8\n1\n0", "solucion": "function cuentaBits(n) {\n  let c = 0;\n  while (n) {\n    c += n & 1;\n    n >>>= 1;\n  }\n  return c;\n}"},
    {"id": "cadena", "titulo": "Avanzado · Cadena de hashes (idea de blockchain)", "texto": "Si cada bloque incluye el hash del anterior, cambiar un dato antiguo cambia todos los hashes siguientes. Así se detecta la manipulación.\n\nObjetivo: hashCadena(lista) empieza con h = '0' y por cada elemento hace h = String(djb2(h + elemento)). Devuelve el h final.", "pista": "let h = '0'; for (const x of lista) h = String(djb2(h + x)); return h;", "starter": "function djb2(s) {\n  let h = 5381;\n  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;\n  return h;\n}\nfunction hashCadena(lista) {\n}\n", "tests": "console.log(hashCadena(['a', 'b']) === hashCadena(['a', 'b']));\nconsole.log(hashCadena(['a', 'b']) === hashCadena(['b', 'a']));\nconsole.log(hashCadena(['a', 'b', 'c']) === hashCadena(['a', 'b', 'x']));", "exTests": "true\nfalse\nfalse", "solucion": "function djb2(s) {\n  let h = 5381;\n  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;\n  return h;\n}\nfunction hashCadena(lista) {\n  let h = '0';\n  for (const x of lista) h = String(djb2(h + x));\n  return h;\n}"}
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
      pLec.appendChild(el('div', 'Curso completo de programación, redes y ciberseguridad: de lo básico a lo avanzado. Todo se comprueba solo.', 'font-weight:600'));
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
