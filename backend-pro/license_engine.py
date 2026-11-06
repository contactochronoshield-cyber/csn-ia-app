"""Emisión y verificación offline de licencias CSN mediante Ed25519."""

import base64
import json
import os
from pathlib import Path
import uuid

from datetime import datetime, timezone

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)
from cryptography.hazmat.primitives import serialization


PREFIX = "CSN-LIC1."
SCHEMA_VERSION = 1
ISSUER = "Chrono Shield Networks"


class LicenseSignatureError(Exception):
    pass


def _b64encode(value):
    return base64.urlsafe_b64encode(value).decode("ascii").rstrip("=")


def _b64decode(value):
    return base64.urlsafe_b64decode(
        value + "=" * (-len(value) % 4)
    )


def generate_keypair():
    """Genera un par Ed25519. Ejecutar explícitamente, nunca al iniciar la API."""
    private_key = Ed25519PrivateKey.generate()

    private_raw = private_key.private_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PrivateFormat.Raw,
        encryption_algorithm=serialization.NoEncryption(),
    )

    public_raw = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw,
    )

    return {
        "private_key_b64": _b64encode(private_raw),
        "public_key_b64": _b64encode(public_raw),
    }


def _read_key_material(env_name, file_env_name, default_path):
    encoded = os.getenv(env_name, "").strip()

    if not encoded:
        key_path = Path(
            os.getenv(file_env_name, str(default_path))
        ).expanduser()

        try:
            encoded = key_path.read_text(encoding="utf-8").strip()
        except OSError as exc:
            raise LicenseSignatureError(
                "No se pudo leer el archivo de clave configurado."
            ) from exc

    return encoded


def _load_private_key():
    path = Path.home() / ".config/csn-ia/license-private.key"
    encoded = _read_key_material(
        "CSN_LICENSE_PRIVATE_KEY_B64",
        "CSN_LICENSE_PRIVATE_KEY_FILE",
        path,
    )

    try:
        return Ed25519PrivateKey.from_private_bytes(
            _b64decode(encoded)
        )
    except Exception as exc:
        raise LicenseSignatureError(
            "La clave privada Ed25519 no es válida."
        ) from exc


def _load_public_key():
    path = Path.home() / ".config/csn-ia/license-public.key"
    encoded = _read_key_material(
        "CSN_LICENSE_PUBLIC_KEY_B64",
        "CSN_LICENSE_PUBLIC_KEY_FILE",
        path,
    )

    try:
        return Ed25519PublicKey.from_public_bytes(
            _b64decode(encoded)
        )
    except Exception as exc:
        raise LicenseSignatureError(
            "La clave pública Ed25519 no es válida."
        ) from exc


def _canonical_json(payload):
    return json.dumps(
        payload,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")


def create_signed_license(
    organization_name,
    plan,
    max_seats,
    expires_at=None,
    features=None,
    deployment_policy="sovereign",
):
    private_key = _load_private_key()
    now = datetime.now(timezone.utc).isoformat()

    payload = {
        "schema_version": SCHEMA_VERSION,
        "license_id": str(uuid.uuid4()),
        "issuer": ISSUER,
        "organization_name": organization_name,
        "plan": plan,
        "max_seats": max_seats,
        "issued_at": now,
        "expires_at": expires_at,
        "features": sorted(set(features or [])),
        "deployment_policy": deployment_policy,
    }

    encoded_payload = _b64encode(_canonical_json(payload))
    signature = private_key.sign(encoded_payload.encode("ascii"))

    return PREFIX + encoded_payload + "." + _b64encode(signature)


def verify_signed_license(token):
    if not isinstance(token, str) or not token.startswith(PREFIX):
        raise LicenseSignatureError("Formato de licencia no reconocido.")

    parts = token[len(PREFIX):].split(".")

    if len(parts) != 2:
        raise LicenseSignatureError("Estructura de licencia inválida.")

    encoded_payload, encoded_signature = parts

    try:
        public_key = _load_public_key()
        signature = _b64decode(encoded_signature)

        public_key.verify(
            signature,
            encoded_payload.encode("ascii"),
        )

        payload = json.loads(_b64decode(encoded_payload).decode("utf-8"))

    except InvalidSignature as exc:
        raise LicenseSignatureError(
            "La firma de la licencia no es válida."
        ) from exc
    except LicenseSignatureError:
        raise
    except Exception as exc:
        raise LicenseSignatureError(
            "No se pudo verificar la licencia."
        ) from exc

    required = {
        "schema_version",
        "license_id",
        "issuer",
        "organization_name",
        "plan",
        "max_seats",
        "issued_at",
        "expires_at",
        "features",
        "deployment_policy",
    }

    if not isinstance(payload, dict) or not required.issubset(payload):
        raise LicenseSignatureError("Faltan campos obligatorios.")

    if payload["schema_version"] != SCHEMA_VERSION:
        raise LicenseSignatureError("Versión de licencia no compatible.")

    if payload["issuer"] != ISSUER:
        raise LicenseSignatureError("Emisor de licencia no reconocido.")

    if not isinstance(payload["license_id"], str):
        raise LicenseSignatureError("Identificador de licencia inválido.")

    if not isinstance(payload["organization_name"], str):
        raise LicenseSignatureError("Organización inválida.")

    if not isinstance(payload["plan"], str):
        raise LicenseSignatureError("Plan inválido.")

    if (
        isinstance(payload["max_seats"], bool)
        or not isinstance(payload["max_seats"], int)
        or payload["max_seats"] < 1
    ):
        raise LicenseSignatureError("Límite de usuarios inválido.")

    if not isinstance(payload["features"], list):
        raise LicenseSignatureError("Características inválidas.")

    if payload["deployment_policy"] not in (
        "sovereign", "cloud", "hybrid"
    ):
        raise LicenseSignatureError("Política de despliegue inválida.")

    try:
        issued_at = datetime.fromisoformat(
            payload["issued_at"].replace("Z", "+00:00")
        )

        if issued_at.tzinfo is None:
            raise ValueError("Fecha sin zona horaria.")

        expiration = payload["expires_at"]

        if expiration is not None:
            expiration_date = datetime.fromisoformat(
                expiration.replace("Z", "+00:00")
            )

            if expiration_date.tzinfo is None:
                raise ValueError("Fecha sin zona horaria.")

            if expiration_date <= datetime.now(timezone.utc):
                raise LicenseSignatureError("La licencia ha expirado.")

    except LicenseSignatureError:
        raise
    except Exception as exc:
        raise LicenseSignatureError(
            "Fechas de licencia inválidas."
        ) from exc

    return payload
