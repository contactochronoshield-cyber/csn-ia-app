const path = require("path");
const fs = require("fs");
const dir = "android/app/src/main/assets";
global.window = {};
const errs = [];
try {
  require(path.resolve(dir, "biblioteca-data.js"));
  require(path.resolve(dir, "biblioteca.js"));
} catch (e) { console.error("No carga la biblioteca:", e.message); process.exit(1); }
const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const D = window.CSN_BIBLIOTECA || [];
if (!D.length) errs.push("La biblioteca esta vacia");
const ids = new Set();
const claveDe = {};
D.forEach((e, i) => {
  const n = "entrada " + i + " (" + (e && e.id) + ")";
  if (!e.id || !e.titulo || !e.respuesta) errs.push(n + ": falta id, titulo o respuesta");
  if (ids.has(e.id)) errs.push(n + ": id repetido");
  ids.add(e.id);
  if (!Array.isArray(e.claves) || !e.claves.length) errs.push(n + ": sin claves");
  if (e.respuesta && e.respuesta.length > 900) errs.push(n + ": respuesta muy larga (" + e.respuesta.length + ")");
  (e.claves || []).forEach((k) => {
    const kn = norm(k);
    if (claveDe[kn] && claveDe[kn] !== e.id) errs.push("Clave repetida '" + kn + "' en " + claveDe[kn] + " y " + e.id);
    claveDe[kn] = e.id;
  });
});
D.forEach((e) => (e.relacionados || []).forEach((r) => { if (!ids.has(r)) errs.push(e.id + ": relacionado inexistente '" + r + "'"); }));
let pruebas = [];
try { pruebas = JSON.parse(fs.readFileSync("scripts/pruebas_biblioteca.json", "utf8")); } catch (e) { errs.push("No se pudo leer scripts/pruebas_biblioteca.json"); }
pruebas.forEach(([q, id]) => {
  const r = window.CSNBiblioteca.responder(q);
  if (!r.encontrado || r.id !== id) errs.push("Prueba fallida: '" + q + "' esperaba " + id + ", dio " + (r.encontrado ? r.id : "RESPALDO"));
});
if (window.CSNBiblioteca.responder("zzzz qwerty xx").encontrado) errs.push("Una frase sin sentido no deberia tener respuesta");
if (errs.length) { console.error("Biblioteca con problemas:\n- " + errs.join("\n- ")); process.exit(1); }
console.log("Biblioteca OK: " + D.length + " temas, " + pruebas.length + " pruebas");
