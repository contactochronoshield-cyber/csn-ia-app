"""CSN - Directorio de nodos (fase 1). Solo guarda: id aleatorio, hash del token, ultima vez visto, version. Sin IPs, sin datos personales."""
import sqlite3, time, secrets, hashlib
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DB = "nodos.db"; WINDOW = 600  # activo = visto en los ultimos 10 min
app = FastAPI(title="CSN Directorio de nodos")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
HITS = {}

def limit(key, n, secs):
    now = time.time(); h = [t for t in HITS.get(key, []) if now - t < secs]
    if len(h) >= n: raise HTTPException(429, "Demasiados pedidos")
    h.append(now); HITS[key] = h

def db():
    c = sqlite3.connect(DB)
    c.execute("create table if not exists nodes(id text primary key, th text, seen real, ver text)")
    return c

def th(t): return hashlib.sha256(t.encode()).hexdigest()

class Reg(BaseModel):
    ver: str = ""
class Auth(BaseModel):
    node_id: str
    token: str
    ver: str = ""

def check(c, a):
    r = c.execute("select th from nodes where id=?", (a.node_id,)).fetchone()
    if not r or not secrets.compare_digest(r[0], th(a.token)):
        c.close(); raise HTTPException(403, "Nodo no valido")

@app.post("/nodes/register")
def register(b: Reg, req: Request):
    limit("reg" + req.client.host, 60, 3600)
    nid, tok = secrets.token_hex(8), secrets.token_urlsafe(24)
    c = db(); c.execute("insert into nodes values(?,?,?,?)", (nid, th(tok), time.time(), b.ver[:20])); c.commit(); c.close()
    return {"node_id": nid, "token": tok}

@app.post("/nodes/heartbeat")
def heartbeat(a: Auth):
    limit("hb" + a.node_id, 90, 3600); c = db(); check(c, a)
    c.execute("update nodes set seen=?, ver=? where id=?", (time.time(), a.ver[:20], a.node_id)); c.commit(); c.close()
    return {"ok": True}

@app.post("/nodes/unregister")
def unregister(a: Auth):
    c = db(); check(c, a); c.execute("delete from nodes where id=?", (a.node_id,)); c.commit(); c.close()
    return {"ok": True}

@app.get("/nodes/count")
def count():
    c = db(); n = c.execute("select count(*) from nodes where seen>?", (time.time() - WINDOW,)).fetchone()[0]
    t = c.execute("select count(*) from nodes").fetchone()[0]; c.close()
    return {"active": n, "total": t}

@app.get("/health")
def health(): return {"ok": True}
