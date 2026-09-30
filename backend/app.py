"""
CSN IA - Backend soberano de la app educativa
------------------------------------------------
Corre 100% en infraestructura propia de CSN.
- Modelo: local vía Ollama (por defecto llama3:8b o mistral:7b)
- RAG: recuperación simple por similitud TF-IDF sobre docs/*.md
  (sin dependencias externas de embeddings en la nube -> soberanía real)
- Sin telemetría, sin llamadas a terceros.

Requisitos: pip install -r requirements.txt
Requiere Ollama corriendo localmente: https://ollama.com (self-hosted)
    ollama pull llama3:8b   (o mistral:7b si el servidor tiene menos RAM)

Ejecutar:
    uvicorn app:app --host 0.0.0.0 --port 8085
"""

import os
import glob
import json
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3:8b")
DOCS_DIR = os.path.join(os.path.dirname(__file__), "docs")

app = FastAPI(title="CSN IA - Asistente de servicios")

# CORS abierto para que la app Android (WebView) pueda llamar al backend.
# En producción, restringir allow_origins al dominio/IP real del backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


class RAGIndex:
    """Índice TF-IDF simple sobre la documentación propia de CSN.
    Deliberadamente ligero: no requiere GPU ni servicios de embeddings externos."""

    def __init__(self, docs_dir: str):
        self.docs_dir = docs_dir
        self.chunks: list[str] = []
        self.sources: list[str] = []
        self.vectorizer = None
        self.matrix = None
        self.reload()

    def reload(self):
        self.chunks = []
        self.sources = []
        for path in glob.glob(os.path.join(self.docs_dir, "*.md")):
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()
            # chunking simple por párrafo
            for para in [p.strip() for p in text.split("\n\n") if p.strip()]:
                self.chunks.append(para)
                self.sources.append(os.path.basename(path))

        if self.chunks:
            self.vectorizer = TfidfVectorizer(stop_words=None)
            self.matrix = self.vectorizer.fit_transform(self.chunks)
        else:
            self.vectorizer = None
            self.matrix = None

    def retrieve(self, query: str, k: int = 4) -> list[str]:
        if not self.chunks or self.vectorizer is None:
            return []
        q_vec = self.vectorizer.transform([query])
        sims = cosine_similarity(q_vec, self.matrix)[0]
        top_idx = sims.argsort()[::-1][:k]
        return [self.chunks[i] for i in top_idx if sims[i] > 0.05]


index = RAGIndex(DOCS_DIR)

SYSTEM_PROMPT = """Eres el asistente de Chrono Shield Networks (CSN), una empresa de infraestructura \
digital soberana en LATAM. Tu trabajo es explicar de forma clara y sin jerga técnica innecesaria \
qué son los servicios de CSN (redes privadas/mesh, nodos físicos, cloud soberano) a personas que \
NUNCA han usado una red privada y no saben si la necesitan. Sé cercano, directo, y evita asumir \
conocimiento técnico previo. Usa el contexto de documentación entregado cuando exista; si no hay \
contexto relevante, responde con lo que sabes de forma general pero acláralo."""


@app.post("/chat")
async def chat(req: ChatRequest):
    context_chunks = index.retrieve(req.message)
    context_block = "\n\n".join(context_chunks) if context_chunks else "(sin contexto específico encontrado)"

    prompt = f"""{SYSTEM_PROMPT}

Contexto de documentación de CSN:
{context_block}

Pregunta del usuario: {req.message}

Respuesta:"""

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            OLLAMA_URL,
            json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
        )
        data = resp.json()

    return {
        "response": data.get("response", "").strip(),
        "sources_used": list(set(index.sources[index.chunks.index(c)] for c in context_chunks)) if context_chunks else [],
    }


@app.post("/reload-docs")
async def reload_docs():
    """Recarga el índice RAG sin reiniciar el servidor, útil tras editar docs/*.md"""
    index.reload()
    return {"status": "ok", "chunks_indexed": len(index.chunks)}


@app.get("/health")
async def health():
    return {"status": "ok", "model": OLLAMA_MODEL, "chunks_indexed": len(index.chunks)}
