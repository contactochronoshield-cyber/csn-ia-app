const path = require("path");
const dir = "android/app/src/main/assets";
global.window = {};
const errs = [];
try {
  require(path.resolve(dir, "biblioteca-data.js"));
  require(path.resolve(dir, "biblioteca.js"));
} catch (e) { console.error("No carga la biblioteca:", e.message); process.exit(1); }
const D = window.CSN_BIBLIOTECA || [];
if (!D.length) errs.push("La biblioteca esta vacia");
const ids = new Set();
D.forEach((e, i) => {
  const n = "entrada " + i + " (" + (e && e.id) + ")";
  if (!e.id || !e.titulo || !e.respuesta) errs.push(n + ": falta id, titulo o respuesta");
  if (ids.has(e.id)) errs.push(n + ": id repetido");
  ids.add(e.id);
  if (!Array.isArray(e.claves) || !e.claves.length) errs.push(n + ": sin claves");
  if (e.respuesta && e.respuesta.length > 900) errs.push(n + ": respuesta muy larga");
});
D.forEach((e) => (e.relacionados || []).forEach((r) => { if (!ids.has(r)) errs.push(e.id + ": relacionado inexistente '" + r + "'"); }));
const pruebas = [
  ["que es una red privada", "red_privada"],
  ["dame ejemplos de uso", "usos_red_privada"],
  ["dime mas sobre esta empresa", "empresa"],
  ["cuanto cuesta", "precios"],
  ["que es una red mesh", "mesh"],
  ["me robaron el celular", "robo_celular"],
  ["hola", "saludo"]
];
pruebas.forEach(([q, id]) => {
  const r = window.CSNBiblioteca.responder(q);
  if (!r.encontrado || r.id !== id) errs.push("Prueba fallida: '" + q + "' esperaba " + id + ", dio " + (r.encontrado ? r.id : "RESPALDO"));
});
if (window.CSNBiblioteca.responder("zzzz qwerty xx").encontrado) errs.push("Una frase sin sentido no deberia tener respuesta");
if (errs.length) { console.error("Biblioteca con problemas:\n- " + errs.join("\n- ")); process.exit(1); }
console.log("Biblioteca OK: " + D.length + " temas, " + pruebas.length + " pruebas");
