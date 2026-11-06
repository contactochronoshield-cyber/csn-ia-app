import os
import json
import sqlite3
import secrets
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, Field

router = APIRouter(tags=["Chrono Mesh Intelligence"])

DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DATA_DIR / "chrono_mesh.db"


def connect_db():
    db = sqlite3.connect(DB_PATH, timeout=15)
    db.row_factory = sqlite3.Row
    return db


def initialize_db():
    with connect_db() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS mesh_nodes (
                client_id TEXT NOT NULL,
                node_id TEXT NOT NULL,
                node_name TEXT NOT NULL,
                status TEXT NOT NULL,
                latency_ms REAL,
                packet_loss REAL,
                connected INTEGER NOT NULL DEFAULT 1,
                last_seen TEXT NOT NULL,
                PRIMARY KEY (client_id, node_id)
            )
        """)
        db.execute("""
            CREATE TABLE IF NOT EXISTS mesh_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id TEXT NOT NULL,
                node_id TEXT NOT NULL,
                event_type TEXT NOT NULL,
                details TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
        db.execute("""
            CREATE INDEX IF NOT EXISTS idx_mesh_events_client
            ON mesh_events(client_id, id)
        """)


initialize_db()


def authenticate_client(
    client_id: str = Header(alias="X-CSN-Client-ID"),
    authorization: Optional[str] = Header(default=None)
):
    """
    CSN_CLIENT_TOKENS debe contener un JSON:
    {"cliente-a":"TOKEN_LARGO_A","cliente-b":"TOKEN_LARGO_B"}
    """
    raw = os.getenv("CSN_CLIENT_TOKENS", "{}")

    try:
        tokens = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(503, "Configuración de autenticación inválida.")

    expected = tokens.get(client_id)

    if not expected:
        raise HTTPException(503, "El cliente no tiene credenciales configuradas.")

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Se requiere autenticación Bearer.")

    supplied = authorization[7:].strip()

    if not secrets.compare_digest(str(expected), supplied):
        raise HTTPException(401, "Credenciales inválidas.")

    return client_id


class NodeReport(BaseModel):
    client_id: str = Field(min_length=1, max_length=100)
    node_id: str = Field(min_length=1, max_length=100)
    node_name: str = Field(min_length=1, max_length=150)
    status: str = Field(default="online", max_length=30)
    latency_ms: Optional[float] = Field(default=None, ge=0, le=600000)
    packet_loss: Optional[float] = Field(default=None, ge=0, le=100)
    connected: bool = True


@router.post("/mesh/nodes/report")
def report_node(
    report: NodeReport,
    client_id: str = Depends(authenticate_client)
):
    if report.client_id != client_id:
        raise HTTPException(403, "El reporte no pertenece al cliente autenticado.")

    now = datetime.now(timezone.utc).isoformat()

    with connect_db() as db:
        previous = db.execute(
            """SELECT status, connected FROM mesh_nodes
               WHERE client_id=? AND node_id=?""",
            (client_id, report.node_id)
        ).fetchone()

        db.execute("""
            INSERT INTO mesh_nodes (
                client_id, node_id, node_name, status,
                latency_ms, packet_loss, connected, last_seen
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(client_id, node_id) DO UPDATE SET
                node_name=excluded.node_name,
                status=excluded.status,
                latency_ms=excluded.latency_ms,
                packet_loss=excluded.packet_loss,
                connected=excluded.connected,
                last_seen=excluded.last_seen
        """, (
            client_id,
            report.node_id,
            report.node_name,
            report.status,
            report.latency_ms,
            report.packet_loss,
            int(report.connected),
            now
        ))

        if previous is None:
            event_type = "NODE_REGISTERED"
        elif (
            previous["status"] != report.status
            or previous["connected"] != int(report.connected)
        ):
            event_type = "NODE_STATE_CHANGED"
        else:
            event_type = "NODE_TELEMETRY"

        db.execute("""
            INSERT INTO mesh_events (
                client_id, node_id, event_type, details, created_at
            ) VALUES (?, ?, ?, ?, ?)
        """, (
            client_id,
            report.node_id,
            event_type,
            json.dumps(report.model_dump(), ensure_ascii=False),
            now
        ))

    return {
        "status": "RECORDED",
        "node_id": report.node_id,
        "recorded_at": now
    }


@router.get("/mesh/nodes/{client_id}")
def list_nodes(
    client_id: str,
    authenticated: str = Depends(authenticate_client)
):
    if client_id != authenticated:
        raise HTTPException(403, "No puedes consultar otro cliente.")

    with connect_db() as db:
        rows = db.execute("""
            SELECT node_id, node_name, status, latency_ms,
                   packet_loss, connected, last_seen
            FROM mesh_nodes
            WHERE client_id=?
            ORDER BY node_name
        """, (authenticated,)).fetchall()

    return {
        "client_id": authenticated,
        "total": len(rows),
        "nodes": [dict(row) for row in rows]
    }


@router.get("/mesh/events/{client_id}")
def list_events(
    client_id: str,
    limit: int = 50,
    authenticated: str = Depends(authenticate_client)
):
    if client_id != authenticated:
        raise HTTPException(403, "No puedes consultar otro cliente.")

    if limit < 1 or limit > 200:
        raise HTTPException(400, "El límite debe estar entre 1 y 200.")

    with connect_db() as db:
        rows = db.execute("""
            SELECT id, node_id, event_type, details, created_at
            FROM mesh_events
            WHERE client_id=?
            ORDER BY id DESC
            LIMIT ?
        """, (authenticated, limit)).fetchall()

    return {
        "client_id": authenticated,
        "total": len(rows),
        "events": [dict(row) for row in rows]
    }
