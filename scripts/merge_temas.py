import json, sys, os
A = "android/app/src/main/assets/biblioteca-data.js"
P = "scripts/pruebas_biblioteca.json"
nuevos = json.load(sys.stdin)
t = open(A, encoding="utf-8").read()
d = json.loads(t[t.index("["):t.rindex("]") + 1])
idx = {e["id"]: i for i, e in enumerate(d)}
pruebas = json.load(open(P, encoding="utf-8")) if os.path.exists(P) else []
for n in nuevos:
    q = n.pop("prueba", None)
    if q and [q, n["id"]] not in pruebas:
        pruebas.append([q, n["id"]])
    if n["id"] in idx:
        d[idx[n["id"]]] = n
    else:
        idx[n["id"]] = len(d)
        d.append(n)
with open(A, "w", encoding="utf-8") as f:
    f.write("window.CSN_BIBLIOTECA = [\n" + ",\n".join(json.dumps(e, ensure_ascii=False) for e in d) + "\n];\n")
with open(P, "w", encoding="utf-8") as f:
    json.dump(pruebas, f, ensure_ascii=False, indent=0)
if os.path.isdir("backend"):
    os.makedirs("backend/docs", exist_ok=True)
    out = ["# Biblioteca CSN (generada desde la app)\n"]
    for e in d:
        out.append("## " + e["titulo"] + "\n\nPalabras clave: " + ", ".join(e["claves"]) + "\n\n" + e["respuesta"] + "\n")
    open("backend/docs/biblioteca-csn.md", "w", encoding="utf-8").write("\n".join(out))
print(">> %d temas agregados o actualizados (total %d)" % (len(nuevos), len(d)))
