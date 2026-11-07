#!/data/data/com.termux/files/usr/bin/bash
# Revisa lo posible ANTES de subir. Sale con 1 si encuentra algo.
cd "$(git rev-parse --show-toplevel)" || exit 1
A=android/app/src/main/assets
M=android/app/src/main/AndroidManifest.xml
E=0
bad(){ echo "  x $1"; E=1; }
ok(){ echo "  ok $1"; }

echo "[1] Marcadores de conflicto"
if grep -rIn -E '^(<<<<<<<|>>>>>>>)( |$)' android/app/src .github scripts 2>/dev/null | head -5 | grep -q .; then
  grep -rIn -E '^(<<<<<<<|>>>>>>>)( |$)' android/app/src .github scripts | head -5
  bad "conflicto sin resolver"
else ok "sin marcadores"; fi

echo "[2] Sintaxis JS"
if command -v node >/dev/null; then
  for f in $A/*.js; do
    [ -f "$f" ] || continue
    node --check "$f" 2>${TMPDIR:-.}/pc_err || { bad "$f"; head -3 ${TMPDIR:-.}/pc_err; }
  done
  [ $E -eq 0 ] && ok "JS valido"
else echo "  (node no instalado, se omite)"; fi

echo "[3] Scripts que carga chat.html"
python3 - << 'PY' || E=1
import re, os, sys
a = "android/app/src/main/assets"
h = open(a + "/chat.html", encoding="utf-8").read()
miss = [s for s in re.findall(r'<script[^>]+src="([^"]+)"', h)
        if not s.startswith("http") and not os.path.exists(os.path.join(a, s))]
if miss:
    print("  x faltan archivos:", ", ".join(miss)); sys.exit(1)
print("  ok todos existen")
PY

echo "[4] AndroidManifest.xml"
python3 -c "import xml.dom.minidom as m; m.parse('$M')" 2>${TMPDIR:-.}/pc_err \
  && ok "XML valido" || { bad "manifest roto"; head -2 ${TMPDIR:-.}/pc_err; }

echo "[5] Kotlin: llaves y parentesis balanceados"
python3 - << 'PY' || E=1
import re, glob, sys
bad = False
for f in glob.glob("android/app/src/main/java/**/*.kt", recursive=True):
    s = open(f, encoding="utf-8").read()
    s = re.sub(r'"(\\.|[^"\\\n])*"|/\*.*?\*/|//[^\n]*', lambda m: '""' if m.group(0)[0] == '"' else '', s, flags=re.S)
    for a, b in (("{", "}"), ("(", ")")):
        if s.count(a) != s.count(b):
            print("  x %s: %s=%d %s=%d" % (f, a, s.count(a), b, s.count(b)))
            bad = True
if bad: sys.exit(1)
print("  ok balanceado")
PY

echo "[6] Rutas de Termux en archivos de build"
if grep -n "/data/data/com.termux" android/gradle.properties android/build.gradle* android/app/build.gradle* android/settings.gradle* 2>/dev/null | grep -q .; then
  grep -n "/data/data/com.termux" android/gradle.properties android/build.gradle* android/app/build.gradle* android/settings.gradle* 2>/dev/null
  bad "ruta de Termux en el repo: rompe CI (ponla en ~/.gradle/gradle.properties)"
else ok "sin rutas locales"; fi

echo
[ $E -eq 0 ] && echo "TODO EN ORDEN" || echo "HAY PROBLEMAS: no subas todavia"
exit $E
