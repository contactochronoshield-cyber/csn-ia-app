"""
Chrono Network Brain
Motor inicial de interpretación para CSN IA.
No ejecuta cambios de red: identifica la intención y propone
un diagnóstico o una acción que deberá ser autorizada.
"""

from dataclasses import dataclass, asdict
from typing import Optional
import re


@dataclass
class NetworkIntent:
    domain: str
    action: str
    confidence: float
    requires_authorization: bool
    explanation: str
    suggested_checks: list


DOMAINS = {
    "private_network": [
        "wireguard", "vpn", "red privada", "tunel", "túnel",
        "acceso remoto", "peer", "cliente vpn"
    ],
    "mesh_federation": [
        "mesh", "nodo", "nodos", "federacion", "federación",
        "conectar nodos", "red distribuida"
    ],
    "data_center": [
        "centro de datos", "datacenter", "data center",
        "servidor", "servidores", "infraestructura"
    ],
    "secure_gateway": [
        "gateway", "dns", "navegacion", "navegación",
        "salida a internet", "internet seguro", "firewall"
    ],
    "sovereignty": [
        "soberania", "soberanía", "soberano",
        "jurisdiccion", "jurisdicción", "control de datos"
    ],
    "continuity": [
        "resiliencia", "sin internet", "sin conexion",
        "sin conexión", "caida", "caída", "continuidad"
    ],
}

ACTIONS = {
    "diagnose": [
        "error", "falla", "fallo", "problema", "no funciona",
        "diagnostica", "diagnosticar", "revisar", "revisa",
        "analiza", "analizar", "por que", "por qué"
    ],
    "status": [
        "estado", "estatus", "situacion", "situación",
        "conectado", "desconectado", "disponible"
    ],
    "design": [
        "diseña", "disenar", "diseñar", "arquitectura",
        "crear", "construir", "implementar", "planificar"
    ],
    "secure": [
        "proteger", "seguridad", "asegurar", "blindar",
        "vulnerabilidad", "expuesto"
    ],
    "connect": [
        "conectar", "unir", "enlazar", "registrar",
        "incorporar", "agregar nodo"
    ],
}


def normalize(value: str) -> str:
    value = value.lower().strip()
    replacements = {
        "á": "a", "é": "e", "í": "i",
        "ó": "o", "ú": "u", "ü": "u"
    }
    for old, new in replacements.items():
        value = value.replace(old, new)
    return re.sub(r"\s+", " ", value)


def detect_domain(message: str) -> tuple[str, float]:
    text = normalize(message)
    scores = {}

    for domain, keywords in DOMAINS.items():
        scores[domain] = sum(
            1 for keyword in keywords
            if normalize(keyword) in text
        )

    best = max(scores, key=scores.get)
    score = scores[best]

    if score == 0:
        return "general_network", 0.0

    confidence = min(0.95, 0.55 + (score * 0.12))
    return best, round(confidence, 2)


def detect_action(message: str) -> str:
    text = normalize(message)

    # Detectar primero las intenciones específicas.
    if any(normalize(word) in text for word in [
        "conectar", "conecta", "unir nodos", "registrar nodo",
        "incorporar nodo", "agregar nodo", "enlazar"
    ]):
        return "connect"

    if any(normalize(word) in text for word in [
        "proteger", "blindar", "asegurar", "endurecer",
        "dns seguro", "navegacion segura", "navegar seguro",
        "proteger mi red"
    ]):
        return "secure"

    # Aplicar una configuración de seguridad es una acción,
    # no una simple solicitud de información.
    if (
        any(word in text for word in ["aplica", "aplicar", "configura", "configurar"])
        and any(word in text for word in [
            "dns", "firewall", "seguridad", "filtro",
            "politica", "politicas", "proteccion"
        ])
    ):
        return "secure"

    if any(normalize(word) in text for word in [
        "diseña", "disenar", "diseñar", "arquitectura",
        "crear", "construir", "implementar", "planificar"
    ]):
        return "design"

    if any(normalize(word) in text for word in [
        "estado", "estatus", "situacion", "situación",
        "conectado", "desconectado", "disponible"
    ]):
        return "status"

    if any(normalize(word) in text for word in [
        "error", "falla", "fallo", "problema", "no funciona",
        "diagnostica", "diagnosticar", "revisar", "revisa",
        "analiza", "analizar", "por que", "por qué"
    ]):
        return "diagnose"

    return "explain"


def requires_execution_authorization(message: str) -> bool:
    text = normalize(message)

    execution_verbs = [
        "ejecuta", "ejecutar", "aplica", "aplicar",
        "configura", "configurar", "despliega", "desplegar",
        "reinicia", "reiniciar", "bloquea", "bloquear",
        "elimina", "eliminar", "cambia la ruta",
        "modifica la configuracion", "modifica la configuración"
    ]

    # Las órdenes imperativas explícitas requieren autorización.
    imperative_commands = [
        "conecta", "une", "registra", "incorpora",
        "enlaza", "despliega", "reinicia", "bloquea",
        "elimina", "modifica"
    ]

    if any(
        text == word or text.startswith(word + " ")
        or text.startswith("por favor " + word + " ")
        for word in imperative_commands
    ):
        return True

    # Las órdenes imperativas explícitas requieren autorización.
    imperative_commands = [
        "conecta", "une", "registra", "incorpora",
        "enlaza", "despliega", "reinicia", "bloquea",
        "elimina", "modifica"
    ]

    if any(
        text == word or text.startswith(word + " ")
        or text.startswith("por favor " + word + " ")
        for word in imperative_commands
    ):
        return True

    return any(normalize(word) in text for word in execution_verbs)

def analyze(message: str) -> dict:
    if not isinstance(message, str) or not message.strip():
        raise ValueError("El mensaje no puede estar vacío.")

    if len(message) > 4000:
        raise ValueError("El mensaje supera el límite de 4000 caracteres.")

    domain, confidence = detect_domain(message)
    action = detect_action(message)

    checks = {
        "private_network": [
            "Verificar estado del túnel y sus pares.",
            "Comprobar rutas y direccionamiento.",
            "Revisar DNS y conectividad autorizada."
        ],
        "mesh_federation": [
            "Verificar identidad del nodo.",
            "Comprobar autenticación y pertenencia al cliente.",
            "Revisar conectividad y eventos de federación."
        ],
        "data_center": [
            "Comprobar disponibilidad de servicios.",
            "Revisar conectividad y dependencias.",
            "Verificar capacidad y estado de infraestructura."
        ],
        "secure_gateway": [
            "Comprobar resolución DNS.",
            "Verificar rutas y políticas del gateway.",
            "Revisar exposición y cifrado del tráfico."
        ],
        "sovereignty": [
            "Identificar ubicación y jurisdicción de los datos.",
            "Revisar control de DNS, tráfico y registros.",
            "Verificar dependencias de proveedores externos."
        ],
        "continuity": [
            "Identificar dependencias críticas.",
            "Comprobar rutas y nodos alternativos.",
            "Evaluar operación durante una pérdida de conectividad."
        ],
        "general_network": [
            "Identificar el servicio y la infraestructura involucrada.",
            "Solicitar los datos técnicos necesarios.",
            "Evitar cambios hasta confirmar el diagnóstico."
        ]
    }

    explanation = {
        "diagnose": "Se solicita analizar un problema de infraestructura.",
        "status": "Se solicita consultar el estado de la infraestructura.",
        "design": "Se solicita diseñar o planificar una solución.",
        "secure": "Se solicita evaluar o mejorar la seguridad.",
        "connect": "Se solicita conectar o incorporar infraestructura.",
        "explain": "Se solicita información técnica."
    }[action]

    # Ninguna operación real se ejecuta desde este clasificador.
    return asdict(NetworkIntent(
        domain=domain,
        action=action,
        confidence=confidence,
        requires_authorization=requires_execution_authorization(message),
        explanation=explanation,
        suggested_checks=checks[domain]
    ))
