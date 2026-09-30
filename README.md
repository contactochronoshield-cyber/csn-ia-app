# CSN IA — Asistente educativo de Chrono Shield Networks

App con IA que explica en lenguaje simple qué son los servicios de CSN (redes privadas,
nodos mesh, cloud soberano) a personas sin conocimiento técnico previo. Pensada como
puerta de entrada para gente que ni sabe que necesita esto, para apoyar la venta de
hardware (Chrono Mesh Node) y el crecimiento de CSN.

## Por qué está construida así

| Decisión | Por qué |
|---|---|
| Modelo IA self-hosted (Ollama) | Coherente con la filosofía de soberanía digital de CSN: cero dependencia de APIs de IA extranjeras |
| RAG con TF-IDF local, sin embeddings en la nube | Ligero, sin costos recurrentes de terceros, corre en tu propio servidor |
| App Android = WebView sobre HTML/JS | Sin SDKs propietarios de Google, sin trackers → cumple los requisitos de F-Droid |
| Backend separado (FastAPI) | El mismo backend puede alimentar web, WhatsApp o el post de Mercado Libre a futuro |

## Estructura

```
csn-ia-app/
├── backend/           # FastAPI + RAG + Ollama (self-hosted)
│   ├── app.py
│   ├── requirements.txt
│   └── docs/           # documentación fuente del RAG (editar/ampliar aquí)
├── android/            # App Android (WebView + Kotlin)
└── fastlane/metadata/  # Descripciones para publicación en F-Droid
```

## Cómo levantar el backend

```bash
cd backend
pip install -r requirements.txt
ollama pull llama3:8b      # o mistral:7b si el servidor tiene menos RAM
ollama serve &
uvicorn app:app --host 0.0.0.0 --port 8085
```

Prueba rápida:
```bash
curl -X POST http://localhost:8085/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿qué es un nodo mesh?"}'
```

Para ampliar lo que la IA sabe, agrega archivos `.md` en `backend/docs/` y llama a
`POST /reload-docs` (no hace falta reiniciar el servidor).

## Cómo compilar la app Android

1. Abrir la carpeta `android/` en Android Studio (o `./gradlew assembleRelease` por línea de comandos).
2. En la app, tocar el campo "Servidor" y apuntar a la IP real del backend de CSN.
3. Generar el APK firmado.

## Roadmap hacia F-Droid

- [x] Esqueleto de app sin dependencias propietarias
- [x] Metadata fastlane (descripciones)
- [ ] Ícono definitivo (`res/mipmap/ic_launcher`) — falta diseñarlo
- [ ] Build reproducible verificado (`fdroiddata` build recipe)
- [ ] Repo público en GitHub con releases etiquetados (F-Droid indexa desde ahí)
- [ ] Enviar merge request a `fdroiddata` con la receta de build

## Siguiente capa (fuera de este entregable inicial)

Para captar al usuario que "ni sabe que lo necesita" — el que nunca va a buscar en
F-Droid — conviene además un chat web embebido en la landing de CSN y en el post de
Mercado Libre, usando el mismo backend (`/chat`). Es la capa de visibilidad de la que
hablábamos; esta app es la capa soberana para el usuario ya convencido.
