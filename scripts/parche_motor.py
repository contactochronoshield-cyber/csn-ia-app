p = "android/app/src/main/assets/biblioteca.js"
s = open(p, encoding="utf-8").read()
if "mejor + 0.1" in s:
    print(">> Motor ya parchado")
else:
    s = s.replace("    var score = 0;\n", "    var score = 0, mejor = 0;\n", 1)
    s = s.replace("{ score += 10 + kn.length / 10; return; }",
                  "{ var sk = 10 + kn.length / 10; score += sk; if (sk > mejor) mejor = sk; return; }", 1)
    s = s.replace("if (hit && ratio >= 0.6) score += ratio * 6;",
                  "if (hit && ratio >= 0.6) { var sf = ratio * 6; score += sf; if (sf > mejor) mejor = sf; }", 1)
    s = s.replace("    return score;\n  }\n\n  function buscar",
                  "    return mejor + 0.1 * (score - mejor);\n  }\n\n  function buscar", 1)
    open(p, "w", encoding="utf-8").write(s)
    print(">> Motor parchado: gana la clave mas especifica")
