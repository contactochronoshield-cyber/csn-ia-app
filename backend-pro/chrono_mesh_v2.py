import base64
import binascii
import sqlite3
import uuid
import json
import time

from pathlib import Path
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, Field
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

from identity import authenticate_session, IdentityError


router = APIRouter(prefix="/mesh/v2", tags=["Chrono Mesh v2"])

DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DATA_DIR / "chrono_mesh.db"

MAX_CLOCK_SKEW_SECONDS = 120


def connect_db():
    db = sqlite3.connect(DB_PATH, timeout=15)
    db.row_factory = sqlite3.Row
    return db


def initialize_db():
    with connect_db() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS mesh_v2_nodes (
                node_id TEXT PRIMARY KEY,
                organization_id TEXT NOT NULL,
                node_name TEXT NOT NULL,
                public_key BLOB NOT NULL,
                status TEXT NOT NULL DEFAULT 'active',
                last_counter INTEGER NOT NULL DEFAULT 0,
                last_seen TEXT,
                created_at TEXT NOT NULL,
                revoked_at TEXT
            )
        """)

        db.execute("""
            CREATE INDEX IF NOT EXISTS idx_mesh_v2_org
            ON mesh_v2_nodes(organization_id, status)
        """)

        db.execute("""
            CREATE TABLE IF NOT EXISTS mesh_v2_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                organization_id TEXT NOT NULL,
                node_id TEXT NOT NULL,
                event_type TEXT NOT NULL,
                details TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)

        db.execute("""
            CREATE INDEX IF NOT EXISTS idx_mesh_v2_events_org
            ON mesh_v2_events(organization_id, id)
        """)


initialize_db()


def require_user(
    authorization: str | None = Header(default=None)
):
    if not authorization:
        raise HTTPException(401, "Se requiere una sesión.")

    scheme, separator, token = authorization.partition(" ")

    if scheme.lower() != "bearer" or not separator or not token.strip():
        raise HTTPException(401, "Formato de autorización no válido.")

    try:
        return authenticate_session(token.strip())
    except IdentityError as exc:
        raise HTTPException(exc.status_code, str(exc))


def require_owner(principal):
    if principal.get("role") != "owner":
        raise HTTPException(
            403,
            "Solo el propietario de la organización puede realizar esta operación."
        )


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def audit(db, organization_id, node_id, event_type, details):
    db.execute("""
        INSERT INTO mesh_v2_events (
            organization_id, node_id, event_type, details, created_at
        ) VALUES (?, ?, ?, ?, ?)
    """, (
        organization_id,
        node_id,
        event_type,
        json.dumps(details, ensure_ascii=False),
        now_iso()
    ))


class EnrollRequest(BaseModel):
    node_name: str = Field(min_length=1, max_length=150)
    public_key_b64: str = Field(min_length=40, max_length=100)


class HeartbeatRequest(BaseModel):
    node_id: str = Field(min_length=36, max_length=36)
    counter: int = Field(ge=1, le=9223372036854775807)
    timestamp: int = Field(ge=1)
    signature_b64: str = Field(min_length=80, max_length=200)


@router.post("/nodes/enroll", status_code=201)
def enroll_node(
    payload: EnrollRequest,
    principal=Depends(require_user)
):
    require_owner(principal)

    try:
        public_key = base64.b64decode(
            payload.public_key_b64,
            validate=True
        )
        Ed25519PublicKey.from_public_bytes(public_key)
    except (ValueError, binascii.Error):
        raise HTTPException(400, "La clave pública Ed25519 no es válida.")

    if len(public_key) != 32:
        raise HTTPException(400, "La clave pública debe tener 32 bytes.")

    node_id = str(uuid.uuid4())
    organization_id = principal["organization_id"]
    now = now_iso()

    with connect_db() as db:
        db.execute("""
            INSERT INTO mesh_v2_nodes (
                node_id, organization_id, node_name,
                public_key, status, created_at
            ) VALUES (?, ?, ?, ?, 'active', ?)
        """, (
            node_id,
            organization_id,
            payload.node_name.strip(),
            public_key,
            now
        ))

        audit(db, organization_id, node_id, "NODE_ENROLLED", {
            "node_name": payload.node_name.strip(),
            "identity": "Ed25519"
        })

    return {
        "status": "enrolled",
        "node_id": node_id,
        "organization_id": organization_id,
        "created_at": now
    }


@router.post("/nodes/heartbeat")
def node_heartbeat(payload: HeartbeatRequest):
    current_time = int(time.time())

    if abs(current_time - payload.timestamp) > MAX_CLOCK_SKEW_SECONDS:
        raise HTTPException(400, "El heartbeat está fuera de la ventana temporal.")

    try:
        signature = base64.b64decode(
            payload.signature_b64,
            validate=True
        )
    except (ValueError, binascii.Error):
        raise HTTPException(400, "La firma no tiene formato válido.")

    message = (
        f"{payload.node_id}:{payload.counter}:{payload.timestamp}"
    ).encode("utf-8")

    with connect_db() as db:
        db.execute("BEGIN IMMEDIATE")

        node = db.execute("""
            SELECT organization_id, public_key, status, last_counter
            FROM mesh_v2_nodes
            WHERE node_id=?
        """, (payload.node_id,)).fetchone()

        if not node:
            raise HTTPException(404, "Nodo desconocido.")

        if node["status"] != "active":
            raise HTTPException(403, "El nodo está revocado o desactivado.")

        if payload.counter <= node["last_counter"]:
            raise HTTPException(409, "Contador repetido o mensaje reproducido.")

        try:
            public_key = Ed25519PublicKey.from_public_bytes(
                node["public_key"]
            )
            public_key.verify(signature, message)
        except Exception:
            raise HTTPException(401, "Firma del nodo no válida.")

        now = now_iso()

        db.execute("""
            UPDATE mesh_v2_nodes
            SET last_counter=?, last_seen=?
            WHERE node_id=? AND status='active'
        """, (
            payload.counter,
            now,
            payload.node_id
        ))

        audit(
            db,
            node["organization_id"],
            payload.node_id,
            "NODE_HEARTBEAT",
            {"counter": payload.counter}
        )

    return {
        "status": "verified",
        "node_id": payload.node_id,
        "counter": payload.counter,
        "last_seen": now
    }


@router.get("/nodes")
def list_nodes(principal=Depends(require_user)):
    organization_id = principal["organization_id"]

    with connect_db() as db:
        rows = db.execute("""
            SELECT node_id, node_name, status,
                   last_counter, last_seen, created_at, revoked_at
            FROM mesh_v2_nodes
            WHERE organization_id=?
            ORDER BY created_at DESC
        """, (organization_id,)).fetchall()

    return {
        "organization_id": organization_id,
        "total": len(rows),
        "nodes": [dict(row) for row in rows]
    }


@router.post("/nodes/{node_id}/revoke")
def revoke_node(
    node_id: str,
    principal=Depends(require_user)
):
    require_owner(principal)
    organization_id = principal["organization_id"]
    now = now_iso()

    with connect_db() as db:
        node = db.execute("""
            SELECT status FROM mesh_v2_nodes
            WHERE node_id=? AND organization_id=?
        """, (node_id, organization_id)).fetchone()

        if not node:
            raise HTTPException(404, "Nodo no encontrado en esta organización.")

        if node["status"] == "revoked":
            return {"status": "already_revoked", "node_id": node_id}

        db.execute("""
            UPDATE mesh_v2_nodes
            SET status='revoked', revoked_at=?
            WHERE node_id=? AND organization_id=?
        """, (now, node_id, organization_id))

        audit(db, organization_id, node_id, "NODE_REVOKED", {
            "revoked_at": now,
            "revoked_by": principal["user_id"]
        })

    return {
        "status": "revoked",
        "node_id": node_id,
        "revoked_at": now
    }


@router.get("/events")
def list_events(
    limit: int = 50,
    principal=Depends(require_user)
):
    if limit < 1 or limit > 200:
        raise HTTPException(400, "El límite debe estar entre 1 y 200.")

    organization_id = principal["organization_id"]

    with connect_db() as db:
        rows = db.execute("""
            SELECT id, node_id, event_type, details, created_at
            FROM mesh_v2_events
            WHERE organization_id=?
            ORDER BY id DESC
            LIMIT ?
        """, (organization_id, limit)).fetchall()

    return {
        "organization_id": organization_id,
        "total": len(rows),
        "events": [dict(row) for row in rows]
    }
