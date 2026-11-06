"""Identidad empresarial de CSN IA: organizaciones, licencias y sesiones."""

import hashlib
import hmac
import os
import re
import secrets
import sqlite3
from contextlib import contextmanager
import uuid

from datetime import datetime, timedelta, timezone
from pathlib import Path


DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = Path(
    os.getenv("CSN_IDENTITY_DB", str(DATA_DIR / "identity.db"))
)

PASSWORD_ITERATIONS = 310_000
SESSION_HOURS = 12


class IdentityError(Exception):
    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.status_code = status_code


def utc_now():
    return datetime.now(timezone.utc)


def iso_now():
    return utc_now().isoformat()


def connect():
    db = sqlite3.connect(DB_PATH, timeout=15)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    return db


@contextmanager
def db_session():
    db = connect()
    try:
        with db:
            yield db
    finally:
        db.close()


def initialize_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    with db_session() as db:
        db.executescript("""
            CREATE TABLE IF NOT EXISTS organizations (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'active',
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS licenses (
                id TEXT PRIMARY KEY,
                key_hash TEXT NOT NULL UNIQUE,
                organization_name TEXT NOT NULL,
                plan TEXT NOT NULL,
                max_seats INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'issued',
                expires_at TEXT,
                organization_id TEXT UNIQUE,
                created_at TEXT NOT NULL,
                activated_at TEXT,
                FOREIGN KEY (organization_id)
                    REFERENCES organizations(id)
            );

            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                organization_id TEXT NOT NULL,
                email TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL,
                active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                UNIQUE (organization_id, email),
                FOREIGN KEY (organization_id)
                    REFERENCES organizations(id)
            );

            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                token_hash TEXT NOT NULL UNIQUE,
                user_id TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                created_at TEXT NOT NULL,
                revoked_at TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            CREATE INDEX IF NOT EXISTS idx_users_email
                ON users(email);

            CREATE INDEX IF NOT EXISTS idx_sessions_user
                ON sessions(user_id);

            CREATE INDEX IF NOT EXISTS idx_sessions_expiry
                ON sessions(expires_at);
        """)


def _normalize_email(email):
    if not isinstance(email, str):
        raise IdentityError("Correo electrónico inválido.")

    value = email.strip().lower()

    if len(value) > 254 or not re.fullmatch(
        r"[^@\s]+@[^@\s]+\.[^@\s]+", value
    ):
        raise IdentityError("Correo electrónico inválido.")

    return value


def _validate_password(password):
    if not isinstance(password, str) or len(password) < 12:
        raise IdentityError(
            "La contraseña debe tener al menos 12 caracteres."
        )

    if len(password) > 256:
        raise IdentityError("La contraseña supera el tamaño permitido.")

    return password


def _password_hash(password, salt=None):
    salt = salt or secrets.token_bytes(16)

    derived = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        PASSWORD_ITERATIONS
    )

    return "pbkdf2_sha256${}${}${}".format(
        PASSWORD_ITERATIONS,
        salt.hex(),
        derived.hex()
    )


def _verify_password(password, stored):
    try:
        algorithm, iterations, salt_hex, expected_hex = stored.split("$")

        if algorithm != "pbkdf2_sha256":
            return False

        actual = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            bytes.fromhex(salt_hex),
            int(iterations)
        )

        return hmac.compare_digest(actual.hex(), expected_hex)
    except (ValueError, TypeError, AttributeError):
        return False


def _license_key_hash(key):
    return hashlib.sha256(key.encode("utf-8")).hexdigest()


def _parse_expiration(value):
    if value is None:
        return None

    if not isinstance(value, str):
        raise IdentityError("La fecha de expiración debe ser ISO 8601.")

    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        raise IdentityError("La fecha de expiración no es válida.")

    if parsed.tzinfo is None:
        raise IdentityError(
            "La fecha de expiración debe incluir zona horaria."
        )

    if parsed <= utc_now():
        raise IdentityError("La fecha de expiración debe ser futura.")

    return parsed.astimezone(timezone.utc).isoformat()


def issue_license(
    organization_name,
    plan="enterprise",
    max_seats=10,
    expires_at=None
):
    if not isinstance(organization_name, str):
        raise IdentityError("El nombre de la organización es obligatorio.")

    organization_name = organization_name.strip()

    if not organization_name or len(organization_name) > 160:
        raise IdentityError("Nombre de organización no válido.")

    if not isinstance(plan, str) or not plan.strip() or len(plan) > 60:
        raise IdentityError("Plan no válido.")

    if (
        isinstance(max_seats, bool)
        or not isinstance(max_seats, int)
        or not 1 <= max_seats <= 10000
    ):
        raise IdentityError("El límite de usuarios debe estar entre 1 y 10000.")

    expiration = _parse_expiration(expires_at)
    license_key = "CSN-" + secrets.token_urlsafe(32)
    license_id = str(uuid.uuid4())

    with db_session() as db:
        db.execute(
            """
            INSERT INTO licenses (
                id, key_hash, organization_name, plan,
                max_seats, status, expires_at, created_at
            )
            VALUES (?, ?, ?, ?, ?, 'issued', ?, ?)
            """,
            (
                license_id,
                _license_key_hash(license_key),
                organization_name,
                plan.strip(),
                max_seats,
                expiration,
                iso_now()
            )
        )

    # La clave original solo se entrega en esta respuesta.
    return {
        "license_id": license_id,
        "license_key": license_key,
        "organization_name": organization_name,
        "plan": plan.strip(),
        "max_seats": max_seats,
        "expires_at": expiration
    }


def activate_organization(license_key, email, password):
    if not isinstance(license_key, str) or not license_key.strip():
        raise IdentityError("Se requiere una licencia válida.")

    email = _normalize_email(email)
    password = _validate_password(password)

    key_hash = _license_key_hash(license_key.strip())
    organization_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())
    now = iso_now()

    with db_session() as db:
        db.execute("BEGIN IMMEDIATE")

        license_row = db.execute(
            "SELECT * FROM licenses WHERE key_hash = ?",
            (key_hash,)
        ).fetchone()

        if not license_row:
            raise IdentityError("Licencia no válida.", 403)

        if license_row["status"] != "issued":
            raise IdentityError(
                "Esta licencia ya fue utilizada o no está disponible.",
                409
            )

        expiration = license_row["expires_at"]

        if expiration and datetime.fromisoformat(expiration) <= utc_now():
            raise IdentityError("La licencia ha expirado.", 403)

        db.execute(
            """
            INSERT INTO organizations (id, name, status, created_at)
            VALUES (?, ?, 'active', ?)
            """,
            (organization_id, license_row["organization_name"], now)
        )

        db.execute(
            """
            INSERT INTO users (
                id, organization_id, email,
                password_hash, role, active, created_at
            )
            VALUES (?, ?, ?, ?, 'owner', 1, ?)
            """,
            (
                user_id,
                organization_id,
                email,
                _password_hash(password),
                now
            )
        )

        db.execute(
            """
            UPDATE licenses
            SET status = 'active',
                organization_id = ?,
                activated_at = ?
            WHERE id = ? AND status = 'issued'
            """,
            (organization_id, now, license_row["id"])
        )

    return {
        "organization_id": organization_id,
        "organization_name": license_row["organization_name"],
        "user_id": user_id,
        "email": email,
        "role": "owner",
        "license_plan": license_row["plan"],
        "max_seats": license_row["max_seats"]
    }


def login(email, password, organization_id):
    email = _normalize_email(email)

    if not isinstance(password, str):
        raise IdentityError("Credenciales no válidas.", 401)

    if not isinstance(organization_id, str) or not organization_id:
        raise IdentityError("Se requiere el identificador de organización.")

    with db_session() as db:
        row = db.execute(
            """
            SELECT
                u.*,
                o.name AS organization_name,
                o.status AS organization_status,
                l.status AS license_status,
                l.expires_at AS license_expires_at,
                l.plan AS license_plan
            FROM users u
            JOIN organizations o ON o.id = u.organization_id
            JOIN licenses l ON l.organization_id = o.id
            WHERE u.email = ? AND u.organization_id = ?
            """,
            (email, organization_id)
        ).fetchone()

        if not row or not _verify_password(password, row["password_hash"]):
            raise IdentityError("Correo o contraseña incorrectos.", 401)

        if not row["active"] or row["organization_status"] != "active":
            raise IdentityError("La cuenta u organización está desactivada.", 403)

        if row["license_status"] != "active":
            raise IdentityError("La licencia no está activa.", 403)

        expiration = row["license_expires_at"]

        if expiration and datetime.fromisoformat(expiration) <= utc_now():
            raise IdentityError("La licencia ha expirado.", 403)

        raw_token = secrets.token_urlsafe(48)
        token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
        expires_at = (utc_now() + timedelta(hours=SESSION_HOURS)).isoformat()

        db.execute(
            """
            INSERT INTO sessions (
                id, token_hash, user_id, expires_at, created_at
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                str(uuid.uuid4()),
                token_hash,
                row["id"],
                expires_at,
                iso_now()
            )
        )

    return {
        "access_token": raw_token,
        "token_type": "bearer",
        "expires_at": expires_at,
        "user": {
            "id": row["id"],
            "email": row["email"],
            "role": row["role"]
        },
        "organization": {
            "id": row["organization_id"],
            "name": row["organization_name"],
            "plan": row["license_plan"]
        }
    }


def authenticate_session(token):
    if not isinstance(token, str) or not token.strip():
        raise IdentityError("Sesión no válida.", 401)

    token_hash = hashlib.sha256(token.strip().encode("utf-8")).hexdigest()

    with db_session() as db:
        row = db.execute(
            """
            SELECT
                s.id AS session_id,
                s.expires_at AS session_expires_at,
                s.revoked_at,
                u.id AS user_id,
                u.email,
                u.role,
                u.active AS user_active,
                o.id AS organization_id,
                o.name AS organization_name,
                o.status AS organization_status,
                l.status AS license_status,
                l.expires_at AS license_expires_at,
                l.plan AS license_plan
            FROM sessions s
            JOIN users u ON u.id = s.user_id
            JOIN organizations o ON o.id = u.organization_id
            JOIN licenses l ON l.organization_id = o.id
            WHERE s.token_hash = ?
            """,
            (token_hash,)
        ).fetchone()

    if not row or row["revoked_at"]:
        raise IdentityError("Sesión no válida o revocada.", 401)

    if datetime.fromisoformat(row["session_expires_at"]) <= utc_now():
        raise IdentityError("La sesión ha expirado.", 401)

    if not row["user_active"] or row["organization_status"] != "active":
        raise IdentityError("Cuenta u organización desactivada.", 403)

    if row["license_status"] != "active":
        raise IdentityError("La licencia no está activa.", 403)

    expiration = row["license_expires_at"]

    if expiration and datetime.fromisoformat(expiration) <= utc_now():
        raise IdentityError("La licencia ha expirado.", 403)

    return {
        "session_id": row["session_id"],
        "user_id": row["user_id"],
        "email": row["email"],
        "role": row["role"],
        "organization_id": row["organization_id"],
        "organization_name": row["organization_name"],
        "license_plan": row["license_plan"]
    }


def logout(token):
    if not isinstance(token, str) or not token.strip():
        raise IdentityError("Sesión no válida.", 401)

    token_hash = hashlib.sha256(token.strip().encode("utf-8")).hexdigest()

    with db_session() as db:
        result = db.execute(
            """
            UPDATE sessions
            SET revoked_at = ?
            WHERE token_hash = ? AND revoked_at IS NULL
            """,
            (iso_now(), token_hash)
        )

    if result.rowcount == 0:
        raise IdentityError("La sesión no existe o ya fue cerrada.", 401)

    return {"status": "logged_out"}
