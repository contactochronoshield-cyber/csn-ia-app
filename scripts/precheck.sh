#!/data/data/com.termux/files/usr/bin/bash
# Precheck v2: revisa lo posible ANTES de subir. Sale con 1 si encuentra algo.
cd "$(git rev-parse --show-toplevel)" || exit 1
A=android/app/src/main/assets
M=android/app/src/main/AndroidManifest.xml
T="${TMPDIR:-.}/pc_err"
E=0
bad(){ echo "  x $1"; E=1; }
ok(){ echo "  ok $1"; }
FILES=$(git ls-files --cached --others --exclude-standard)

echo "[1] Marcadores de conflicto"
if grep -rIn -E '^(<<<<<<<|>>>>>>>)( |$)' android/app/src .github scripts 2>/dev/null | head -5 | grep -q .; then
  grep -rIn -E '^(<<<<<<<|>>>>>>>)( |$)' android/app/src .github scripts | head -5
  bad "conflicto sin resolver"
else ok "sin marcadores"; fi

echo "[2] Sintaxis JS"
if command -v node >/dev/null; then
  E2=0
  for f in $A/*.js; do
    [ -f "$f" ] || continue
    node --check "$f" 2>"$T" || { bad "$f"; head -3 "$T"; E2=1; }
  done
  [ $E2 -eq 0 ] && ok "JS valido"
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
python3 -c "import xml.dom.minidom as m; m.parse('$M')" 2>"$T" \
  && ok "XML valido" || { bad "manifest roto"; head -2 "$T"; }

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

echo "[7] Secretos y claves (repo publico)"
PAT='-----BEGIN ([A-Z]+ )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{50,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|xox[baprs]-[A-Za-z0-9-]{10,}'
LEAK=$(echo "$FILES" | grep -v '^scripts/precheck.sh$' | tr '\n' '\0' | xargs -0 -r grep -IlE -e "$PAT" 2>/dev/null)
KEYF=$(echo "$FILES" | grep -E '\.(jks|keystore|p12|pfx)$|(^|/)\.env$')
if [ -n "$LEAK" ] || [ -n "$KEYF" ]; then
  [ -n "$LEAK" ] && echo "$LEAK" | sed 's/^/    posible secreto en: /'
  [ -n "$KEYF" ] && echo "$KEYF" | sed 's/^/    archivo de claves: /'
  bad "secretos o llaves en el repo: quitalos del repo y cambia esa clave"
else ok "sin secretos a la vista"; fi

echo "[8] Manifest: exported y ajustes de seguridad"
python3 - << 'PY' || E=1
import xml.etree.ElementTree as ET, sys
A = "{http://schemas.android.com/apk/res/android}"
app = ET.parse("android/app/src/main/AndroidManifest.xml").getroot().find("application")
err = 0
if app is None:
    print("  ok sin <application>"); sys.exit(0)
for tag in ("activity", "service", "receiver", "provider"):
    for e in app.iter(tag):
        if e.find("intent-filter") is not None and e.get(A + "exported") is None:
            print("  x <%s %s> tiene intent-filter sin android:exported" % (tag, e.get(A + "name")))
            err = 1
if app.get(A + "debuggable") == "true":
    print("  x debuggable=true en el manifest"); err = 1
for k, m in (("usesCleartextTraffic", "permite trafico http sin cifrar"),
             ("allowBackup", "las copias de seguridad pueden filtrar datos")):
    if app.get(A + k) == "true":
        print("  ! aviso: %s=true (%s)" % (k, m))
if err == 0:
    print("  ok manifest correcto")
sys.exit(err)
PY

echo "[9] Archivos pesados o de compilacion"
BIG=""
while IFS= read -r f; do
  [ -f "$f" ] && [ "$(wc -c < "$f")" -gt 5000000 ] && BIG="$BIG $f"
done <<< "$FILES"
BLD=$(echo "$FILES" | grep -E '(^|/)(build|\.gradle)/|\.apk$' | head -3)
if [ -n "$BIG" ] || [ -n "$BLD" ]; then
  [ -n "$BIG" ] && echo "    pesados (>5 MB):$BIG"
  [ -n "$BLD" ] && echo "$BLD" | sed 's/^/    de compilacion: /'
  bad "archivos que no deben ir al repo"
else ok "limpio"; fi

echo
[ $E -eq 0 ] && echo "TODO EN ORDEN" || echo "HAY PROBLEMAS: no subas todavia"
exit $E
