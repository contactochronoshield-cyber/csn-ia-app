"""Análisis estático de PDFs para CSN IA.

Solo biblioteca estándar. NUNCA abre ni ejecuta el PDF: lee bytes,
busca señales de riesgo y extrae metadatos. No guarda el archivo.
"""
import hashlib
import re
import zlib
from urllib.parse import urlparse

MAX_BYTES = 20 * 1024 * 1024
MAX_DESCOMPRIMIDO = 10 * 1024 * 1024
MAX_STREAMS = 500

SENALES = {
    "JavaScript": (4, "Contiene código JavaScript"),
    "JS": (3, "Referencia a código JS"),
    "Launch": (5, "Intenta lanzar un programa externo"),
    "OpenAction": (2, "Acción automática al abrir"),
    "AA": (1, "Acciones adicionales automáticas"),
    "EmbeddedFile": (3, "Lleva archivos incrustados"),
    "RichMedia": (2, "Contenido multimedia incrustado"),
    "XFA": (2, "Formulario XFA (superficie de ataque mayor)"),
    "GoToR": (1, "Salto a otro archivo remoto"),
    "SubmitForm": (1, "Envía datos de formulario a un destino externo"),
}
INFORMATIVAS = ["ObjStm", "Encrypt", "AcroForm", "URI"]
ACORTADORES = {"bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly",
               "ow.ly", "rebrand.ly", "shorturl.at"}


def _desofuscar_nombres(data: bytes) -> bytes:
    return re.sub(rb"#([0-9A-Fa-f]{2})",
                  lambda m: bytes([int(m.group(1), 16)]), data)


def _streams_descomprimidos(data: bytes):
    n = 0
    for m in re.finditer(rb"stream\r?\n(.*?)\r?\nendstream", data, re.S):
        if n >= MAX_STREAMS:
            break
        n += 1
        try:
            d = zlib.decompressobj()
            yield d.decompress(m.group(1), MAX_DESCOMPRIMIDO)
        except Exception:
            continue


def _fecha_pdf(valor: str):
    m = re.match(r"D:(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?(\d{2})?", valor or "")
    if not m:
        return valor
    p = [g or ("01" if i in (1, 2) else "00") for i, g in enumerate(m.groups())]
    return f"{p[0]}-{p[1]}-{p[2]} {p[3]}:{p[4]}:{p[5]}"


def _texto_pdf(b: bytes) -> str:
    if b[:2] in (b"\xfe\xff", b"\xff\xfe"):
        return b.decode("utf-16", errors="replace")
    return b.decode("latin-1", errors="replace")


def _info(data: bytes) -> dict:
    campos = {}
    for clave in ("Title", "Author", "Subject", "Keywords", "Creator",
                  "Producer", "CreationDate", "ModDate"):
        m = re.search(rb"/" + clave.encode() + rb"\s*\(((?:\\.|[^\\)])*)\)", data)
        if m:
            valor = _texto_pdf(m.group(1)).replace("\\(", "(").replace("\\)", ")")
            campos[clave] = _fecha_pdf(valor) if "Date" in clave else valor.strip()
    return campos


def _xmp(data: bytes) -> dict:
    m = re.search(rb"<x:xmpmeta.*?</x:xmpmeta>", data, re.S)
    if not m:
        return {}
    xml = m.group(0).decode("utf-8", errors="replace")
    out = {}
    for etiqueta in ("CreatorTool", "Producer", "CreateDate", "ModifyDate",
                     "creator", "DocumentID", "InstanceID"):
        mm = re.search(rf"<[\w:]*{etiqueta}[^>]*>(.*?)</[\w:]*{etiqueta}>", xml, re.S)
        if mm:
            out[etiqueta] = re.sub(r"<[^>]+>", " ", mm.group(1)).strip()[:200]
    return out


def analizar_pdf(data: bytes) -> dict:
    if len(data) > MAX_BYTES:
        return {"error": f"Archivo demasiado grande (máx {MAX_BYTES // 1048576} MB)"}

    hallazgos, puntos = [], 0
    sha256 = hashlib.sha256(data).hexdigest()

    pos = data.find(b"%PDF-")
    if pos == -1:
        return {"sha256": sha256, "es_pdf": False, "riesgo": "alto",
                "hallazgos": ["No tiene cabecera PDF: el archivo no es un PDF real "
                              "(posible extensión falsa)"]}
    if pos > 0:
        puntos += 2
        hallazgos.append(f"Hay {pos} bytes antes de la cabecera PDF (posible manipulación)")
    version = data[pos + 5:pos + 8].decode("latin-1", errors="replace")

    texto = _desofuscar_nombres(data)
    ofuscados = len(re.findall(rb"/[A-Za-z]*#[0-9A-Fa-f]{2}", data))
    if ofuscados:
        puntos += 2
        hallazgos.append(f"{ofuscados} nombres ofuscados con #xx (técnica de evasión)")

    cuerpos = [texto] + list(_streams_descomprimidos(data))
    conteo = {}
    for clave in list(SENALES) + INFORMATIVAS:
        patron = re.compile(rb"/" + clave.encode() + rb"(?![A-Za-z])")
        conteo[clave] = sum(len(patron.findall(c)) for c in cuerpos)

    for clave, (peso, msg) in SENALES.items():
        if conteo[clave]:
            puntos += peso
            hallazgos.append(f"{msg} (/{clave} ×{conteo[clave]})")
    if conteo["ObjStm"]:
        hallazgos.append("Usa objetos comprimidos (/ObjStm): el análisis puede ser parcial")
    if conteo["Encrypt"]:
        puntos += 1
        hallazgos.append("Está cifrado (/Encrypt): no se pudo revisar todo el contenido")

    urls = set()
    for c in cuerpos:
        for u in re.findall(rb"https?://[^\s)>\"'\\<]{4,200}", c):
            urls.add(u.decode("latin-1"))
    dominios = {}
    for u in sorted(urls)[:200]:
        host = (urlparse(u).hostname or "").lower()
        if host:
            dominios[host] = dominios.get(host, 0) + 1
    sospechosos = []
    for host in dominios:
        if re.fullmatch(r"\d{1,3}(\.\d{1,3}){3}", host):
            sospechosos.append(f"{host} (IP directa)")
        elif host in ACORTADORES:
            sospechosos.append(f"{host} (acortador de enlaces)")
    if sospechosos:
        puntos += 2
        hallazgos.append("Enlaces sospechosos: " + ", ".join(sospechosos))

    info, xmp = _info(data), _xmp(data)
    notas_meta = []
    if info.get("CreationDate") and info.get("ModDate") \
            and info["ModDate"][:10] != info["CreationDate"][:10]:
        notas_meta.append("Fecha de modificación distinta a la de creación (fue editado)")
    if not info and not xmp:
        notas_meta.append("Sin metadatos (limpiado a propósito o generado por una herramienta mínima)")
    if info.get("Author"):
        notas_meta.append("Revela el nombre del autor: tenlo en cuenta antes de compartirlo")

    if puntos >= 6:
        riesgo = "alto"
    elif puntos >= 2:
        riesgo = "medio"
    else:
        riesgo = "bajo"

    return {
        "es_pdf": True,
        "version_pdf": version,
        "tamano_bytes": len(data),
        "sha256": sha256,
        "riesgo": riesgo,
        "puntaje": puntos,
        "hallazgos": hallazgos,
        "senales": {k: v for k, v in conteo.items() if v},
        "enlaces_dominios": dominios,
        "metadatos": info,
        "metadatos_xmp": xmp,
        "notas_metadatos": notas_meta,
        "aviso": ("Análisis estático y heurístico. Que no aparezcan señales no "
                  "garantiza que el archivo sea seguro."),
    }


def resumen_para_ia(r: dict) -> str:
    if "error" in r:
        return r["error"]
    lineas = [f"Riesgo estimado: {r['riesgo']} (puntaje {r.get('puntaje', '?')})"]
    lineas += [f"- {h}" for h in r["hallazgos"]] or ["- Sin señales de riesgo conocidas"]
    if r.get("metadatos"):
        lineas.append("Metadatos: " + "; ".join(f"{k}={v}" for k, v in r["metadatos"].items()))
    lineas += [f"Nota: {n}" for n in r.get("notas_metadatos", [])]
    lineas.append(r.get("aviso", "Análisis estático: no sustituye a un antivirus."))
    return "\n".join(lineas)
