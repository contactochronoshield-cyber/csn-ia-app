#!/data/data/com.termux/files/usr/bin/bash
set -e

# ============================================================
# PARTE 1: Backend Pro con anti-abuso / bloqueo de usuarios
# ============================================================
mkdir -p backend-pro

cat > backend-pro/app.py << 'PY_EOF'
"""
CSN PRO - Backend de DNS filtrado, Firewall con autorizacion, Panel de
dispositivos, y sistema ANTI-ABUSO (bloqueo de usuarios maliciosos).
"""

import re
import time
import uuid
import datetime
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="CSN PRO")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# ANTI-ABUSO: lista de baneados, rate limiting, deteccion de intentos maliciosos
# ============================================================

BANNED_CLIENTS: set[str] = set()
REQUEST_LOG: dict[str, list[float]] = {}  # client_id -> timestamps
RATE_LIMIT_MAX = 20       # maximo de pedidos
RATE_LIMIT_WINDOW = 60    # por minuto

ABUSE_PATTERNS = [
    "abre todos los puertos", "abrir todo", "desactiva el firewall",
    "desactivar firewall", "apaga el firewall", "bypass", "saltar seguridad",
    "sin restricciones", "borra el log", "borrar el log", "elimina el log",
    "accede a otro cliente", "ver datos de otro usuario", "dame el firewall de otro",
    "ddos", "ataque a", "tumbar el servidor", "flood",
]

VIOLATIONS: dict[str, int] = {}  # client_id -> conteo de intentos sospechosos
MAX_VIOLATIONS_BEFORE_BAN = 3


class AdminBan(BaseModel):
    client_id: str
    reason: str


def check_banned(client_id: str):
    if client_id in BANNED_CLIENTS:
        raise HTTPException(403, "Este cliente fue bloqueado por actividad sospechosa. Contacta soporte de CSN.")


def check_rate_limit(client_id: str):
    now = time.time()
    log = REQUEST_LOG.setdefault(client_id, [])
    log[:] = [t for t in log if now - t < RATE_LIMIT_WINDOW]
    if len(log) >= RATE_LIMIT_MAX:
        raise HTTPException(429, "Demasiados pedidos en poco tiempo. Espera un minuto.")
    log.append(now)


def check_malicious_intent(client_id: str, text: str) -> bool:
    """Devuelve True si el texto coincide con un patron de abuso. Registra la violacion."""
    text_l = text.lower()
    for pattern in ABUSE_PATTERNS:
        if pattern in text_l:
            VIOLATIONS[client_id] = VIOLATIONS.get(client_id, 0) + 1
            if VIOLATIONS[client_id] >= MAX_VIOLATIONS_BEFORE_BAN:
                BANNED_CLIENTS.add(client_id)
            return True
    return False


@app.post("/admin/ban")
def admin_ban(ban: AdminBan):
    BANNED_CLIENTS.add(ban.client_id)
    return {"status": "baneado", "client_id": ban.client_id, "reason": ban.reason}


@app.post("/admin/unban")
def admin_unban(client_id: str):
    BANNED_CLIENTS.discard(client_id)
    VIOLATIONS.pop(client_id, None)
    return {"status": "desbaneado", "client_id": client_id}


@app.get("/admin/banned")
def admin_list_banned():
    return {"banned": list(BANNED_CLIENTS), "violations": VIOLATIONS}


# ============================================================
# 1. DNS FILTRADO
# ============================================================

DNS_CATEGORIES = {
    "apuestas": {"keywords": ["apuestas", "casino", "betting", "gambling"],
                 "domains": ["bet365.com", "betplay.com.co", "codere.com", "wplay.co"]},
    "adultos": {"keywords": ["adulto", "adultos", "pornografia", "adult"],
                "domains": ["categoria-adultos.example"]},
    "publicidad": {"keywords": ["ads", "publicidad", "anuncios", "ad"],
                   "domains": ["doubleclick.net", "googlesyndication.com", "adservice.google.com"]},
    "malware": {"keywords": ["malware", "virus", "phishing"],
                "domains": ["lista-malware-actualizada.example"]},
    "redes_sociales": {"keywords": ["redes sociales", "social", "facebook", "instagram", "tiktok"],
                        "domains": ["facebook.com", "instagram.com", "tiktok.com", "twitter.com", "x.com"]},
}

DNS_RULES: dict[str, dict] = {}


class DnsRequest(BaseModel):
    client_id: str
    message: str


class DnsToggle(BaseModel):
    client_id: str
    category: str
    active: bool
    schedule: str | None = None


def detect_categories(text: str) -> list[str]:
    text_l = text.lower()
    found = []
    for cat, data in DNS_CATEGORIES.items():
        for kw in data["keywords"]:
            if kw in text_l:
                found.append(cat)
                break
    return found


@app.post("/dns/interpret")
def dns_interpret(req: DnsRequest):
    check_banned(req.client_id)
    check_rate_limit(req.client_id)
    if check_malicious_intent(req.client_id, req.message):
        return {"understood": False, "message": "Ese pedido no se puede procesar."}

    categories = detect_categories(req.message)
    if not categories:
        return {"understood": False, "message": "No reconoci ninguna categoria. Prueba con: apuestas, adultos, publicidad, malware, redes sociales."}

    schedule = None
    time_match = re.search(r"(\d{1,2})\s*(am|pm)?\s*a\s*(\d{1,2})\s*(am|pm)?", req.message.lower())
    if time_match:
        schedule = time_match.group(0)

    return {
        "understood": True,
        "categories": categories,
        "schedule": schedule,
        "preview": f"Voy a bloquear: {', '.join(categories)}" + (f", en el horario {schedule}" if schedule else " (todo el dia)"),
    }


@app.post("/dns/apply")
def dns_apply(toggle: DnsToggle):
    check_banned(toggle.client_id)
    check_rate_limit(toggle.client_id)
    if toggle.category not in DNS_CATEGORIES:
        raise HTTPException(400, f"Categoria desconocida: {toggle.category}")
    client_rules = DNS_RULES.setdefault(toggle.client_id, {})
    client_rules[toggle.category] = {"active": toggle.active, "schedule": toggle.schedule}
    return {"status": "ok", "client_id": toggle.client_id, "rules": client_rules}


@app.get("/dns/status/{client_id}")
def dns_status(client_id: str):
    check_banned(client_id)
    return {"client_id": client_id, "rules": DNS_RULES.get(client_id, {})}


# ============================================================
# 2. FIREWALL CON AUTORIZACION
# ============================================================

FIREWALL_INTENTS = {
    "bloquear_entrante": {
        "keywords": ["bloquea todo", "bloquear entrante", "cerrar puertos", "block all incoming"],
        "rule_template": "nft add rule inet filter input drop",
        "explanation": "Bloquea TODO el trafico entrante excepto el ya permitido explicitamente (tu Mesh Node).",
    },
    "permitir_mesh": {
        "keywords": ["permite mesh node", "permitir wireguard", "abrir vpn"],
        "rule_template": "nft add rule inet filter input udp dport 51820 accept",
        "explanation": "Permite el trafico de tu red privada (WireGuard) a traves del puerto 51820.",
    },
    "kill_switch": {
        "keywords": ["kill switch", "si se cae la vpn", "cortar trafico sin vpn"],
        "rule_template": "nft add rule inet filter output oifname != wg0 drop",
        "explanation": "Si la VPN se cae, corta TODO el trafico de salida en vez de dejarlo pasar sin cifrar.",
    },
}

PENDING_RULES: dict[str, dict] = {}
APPLIED_LOG: list[dict] = []


class FirewallRequest(BaseModel):
    client_id: str
    message: str


class FirewallConfirm(BaseModel):
    request_id: str
    approve: bool


@app.post("/firewall/propose")
def firewall_propose(req: FirewallRequest):
    check_banned(req.client_id)
    check_rate_limit(req.client_id)

    if check_malicious_intent(req.client_id, req.message):
        return {"status": "DENEGADO", "message": "Ese pedido fue marcado como sospechoso y no se procesa. Si crees que es un error, contacta soporte."}

    text_l = req.message.lower()
    matched = None
    for intent, data in FIREWALL_INTENTS.items():
        if any(kw in text_l for kw in data["keywords"]):
            matched = (intent, data)
            break

    if not matched:
        return {"status": "DENEGADO", "message": "No reconoci una accion de firewall valida en ese pedido."}

    intent, data = matched
    request_id = str(uuid.uuid4())[:8]
    PENDING_RULES[request_id] = {
        "client_id": req.client_id, "intent": intent, "rule": data["rule_template"],
        "explanation": data["explanation"], "created_at": datetime.datetime.utcnow().isoformat(),
    }

    return {
        "status": "REQUIERE_APROBACION", "request_id": request_id,
        "explanation_es": data["explanation"], "technical_rule": data["rule_template"],
        "note": "Esta regla NO se ha aplicado. Debes confirmarla explicitamente en /firewall/confirm.",
    }


@app.post("/firewall/confirm")
def firewall_confirm(conf: FirewallConfirm):
    pending = PENDING_RULES.get(conf.request_id)
    if not pending:
        raise HTTPException(404, "No existe esa solicitud o ya expiro.")
    check_banned(pending["client_id"])

    if not conf.approve:
        del PENDING_RULES[conf.request_id]
        return {"status": "DENEGADO_POR_CLIENTE", "request_id": conf.request_id}

    APPLIED_LOG.append({**pending, "request_id": conf.request_id,
                         "applied_at": datetime.datetime.utcnow().isoformat(), "status": "APLICADA"})
    del PENDING_RULES[conf.request_id]
    return {"status": "AUTORIZADO", "request_id": conf.request_id, "message": "Regla aplicada y registrada en el log."}


@app.get("/firewall/log/{client_id}")
def firewall_log(client_id: str):
    return {"client_id": client_id, "log": [e for e in APPLIED_LOG if e["client_id"] == client_id]}


# ============================================================
# 3. PANEL MULTI-DISPOSITIVO
# ============================================================

MOCK_DEVICES: dict[str, list[dict]] = {}


class DeviceReport(BaseModel):
    client_id: str
    device_id: str
    device_name: str
    status: str
    last_seen: str
    link_type: str | None = None


@app.post("/devices/report")
def devices_report(rep: DeviceReport):
    check_banned(rep.client_id)
    devices = MOCK_DEVICES.setdefault(rep.client_id, [])
    devices = [d for d in devices if d["device_id"] != rep.device_id]
    devices.append(rep.dict())
    MOCK_DEVICES[rep.client_id] = devices
    return {"status": "ok"}


@app.get("/devices/{client_id}")
def devices_list(client_id: str):
    check_banned(client_id)
    return {"client_id": client_id, "devices": MOCK_DEVICES.get(client_id, [])}


@app.get("/health")
def health():
    return {"status": "ok", "service": "csn-pro-backend", "banned_count": len(BANNED_CLIENTS)}
PY_EOF

cat > backend-pro/requirements.txt << 'REQ_EOF'
fastapi>=0.110.0
uvicorn>=0.29.0
pydantic>=2.6.0
REQ_EOF

echo "Backend Pro actualizado con anti-abuso."

# ============================================================
# PARTE 2: Base de conocimiento COMPLETA en la app (todos los servicios reales)
# ============================================================

cat >> android/app/src/main/assets/chat.html << 'MARKER_EOF'
<!-- marcador: servicios completos agregados -->
MARKER_EOF

python3 << 'PYEDIT_EOF'
import re

path = "android/app/src/main/assets/chat.html"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Quitar el marcador que acabamos de poner (solo era para asegurar que el archivo existe)
content = content.replace("<!-- marcador: servicios completos agregados -->\n", "")

nuevos_servicios = '''
    { keys: ["chrono shield onion", "onion", "mtls", "warrant canary"],
      es: "Chrono Shield Onion es nuestra arquitectura de doble canal: panel de administracion por HTTP+JWT, y un canal mesh ultra seguro con mTLS estricto, mas un warrant canary para transparencia. Codigo abierto en GitHub.",
      en: "Chrono Shield Onion is our dual-channel architecture: an HTTP+JWT admin panel, and a strict mTLS mesh channel, plus a warrant canary for transparency. Open source on GitHub." },
    { keys: ["robo de celular", "celular robado", "localizar celular", "blindaje de telefono", "stolen phone"],
      es: "Ofrecemos un servicio de localizacion y respuesta de seguridad para clientes a quienes les robaron el celular. Es un servicio de pago, pensado para actuar rapido en una emergencia.",
      en: "We offer a location and security response service for clients whose phone was stolen. It's a paid service, designed for fast action in an emergency." },
    { keys: ["esim", "e-sim", "chip virtual"],
      es: "Estamos desarrollando eSIM con seguridad integrada: anti-spam, anti-bot, anti-estafas, mas VPN. Tambien firmware VPN para routers (compatibilidad inicial con TP-Link Archer C7 y GL.iNet Flint), para que tu red este protegida desde el router, no solo desde el celular.",
      en: "We're developing eSIM with built-in security: anti-spam, anti-bot, anti-scam, plus VPN. Also VPN firmware for routers (initial compatibility with TP-Link Archer C7 and GL.iNet Flint), so your network is protected from the router itself, not just the phone." },
    { keys: ["chrono backbone", "backbone", "bgp", "routing propio"],
      es: "Chrono Backbone es nuestra red troncal propia (routing BGP/OSPF con FRR), la base tecnica que sostiene toda la infraestructura de CSN por debajo de los demas servicios.",
      en: "Chrono Backbone is our own network backbone (BGP/OSPF routing with FRR), the technical foundation that supports all of CSN's infrastructure underneath the other services." },
    { keys: ["liberacion web total", "lwt", "despliegue soberano"],
      es: "Liberacion Web Total (LWT) es el motor tecnico interno que usamos para desplegar aplicaciones web sin depender de servicios externos. Es lo que hace posible Chrono Cloud Sovereign de cara al cliente.",
      en: "Liberacion Web Total (LWT) is the internal technical engine we use to deploy web applications without depending on external services. It's what makes Chrono Cloud Sovereign possible for the client." },
    { keys: ["sovereign.md", "sovereign md", "estandar soberano"],
      es: "SOVEREIGN.md es un estandar abierto que estamos desarrollando para describir como desplegar servicios sin depender de nube extranjera, con niveles de soberania verificables (Full Sovereign, Partial Sovereign, Legacy).",
      en: "SOVEREIGN.md is an open standard we're developing to describe how to deploy services without depending on foreign cloud, with verifiable sovereignty levels (Full Sovereign, Partial Sovereign, Legacy)." },
    { keys: ["chronoos", "chrono os", "sistema operativo propio"],
      es: "ChronoOS es nuestro sistema operativo propio, base de varios de nuestros proyectos tecnicos internos.",
      en: "ChronoOS is our own operating system, the foundation of several of our internal technical projects." },
    { keys: ["todos los servicios", "lista de servicios", "que mas ofrecen", "all services"],
      es: "Resumen completo de CSN: Chrono Mesh Node (hardware), WireGuard (VPN), Chrono Sentinel (monitoreo), Chrono Cloud Sovereign (cloud propio), Chrono Guardian y AAP (seguridad), Chrono Orbital (conectividad satelital), Vortex (pagos P2P), Chrono Shield Onion (arquitectura mTLS), eSIM con seguridad integrada, Chrono Backbone (red troncal), y el servicio de localizacion de celulares robados. Pregunta por cualquiera en detalle.",
      en: "Full CSN summary: Chrono Mesh Node (hardware), WireGuard (VPN), Chrono Sentinel (monitoring), Chrono Cloud Sovereign (our own cloud), Chrono Guardian and AAP (security), Chrono Orbital (satellite connectivity), Vortex (P2P payments), Chrono Shield Onion (mTLS architecture), eSIM with built-in security, Chrono Backbone (network backbone), and the stolen-phone location service. Ask about any of them in detail." },
'''

# Insertar los nuevos servicios justo antes del cierre del array KB
marcador_cierre = "  ];\n\n  const FALLBACK_ES"
if marcador_cierre in content:
    content = content.replace(marcador_cierre, nuevos_servicios + "  ];\n\n  const FALLBACK_ES")
else:
    print("ADVERTENCIA: no encontre el punto de insercion exacto, revisar manualmente.")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("chat.html actualizado con todos los servicios.")
PYEDIT_EOF

git add .
git commit -m "Agregar anti-abuso al backend Pro y conocimiento completo de todos los servicios CSN a la IA" --allow-empty
git push

echo ""
echo "Listo. Backend Pro con bloqueo de usuarios maliciosos + rate limiting."
echo "App con TODOS los servicios de CSN en el conocimiento de la IA."
echo "Espera el build verde en Actions para la app."
