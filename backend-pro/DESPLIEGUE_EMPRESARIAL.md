# Desplegar CSN PRO en tu propio servidor / data center

Si tu empresa ya tiene servidor o data center propio, puedes correr el backend
de CSN PRO (DNS filtrado, firewall con autorizacion, panel de dispositivos)
completamente dentro de tu infraestructura. Nada sale a servidores externos
de CSN: ustedes mantienen el control total de los datos.

## Requisitos
- Un servidor Linux (puede ser una VM interna o hardware fisico)
- Python 3.10 o superior
- Red interna donde el servidor pueda comunicarse con los nodos/dispositivos a proteger

## Pasos

```bash
git clone https://github.com/contactochronoshield-cyber/csn-ia-app.git
cd csn-ia-app/backend-pro
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8090
```

Eso deja el backend corriendo en el puerto 8090 de su propio servidor.

## Para produccion real (no solo pruebas)
- Correrlo detras de un proxy inverso con HTTPS (nginx, Caddy o Traefik)
- Usar un proceso supervisor (systemd, supervisord, o Docker) para que se
  reinicie solo si falla
- Cambiar `allow_origins=["*"]` en `app.py` por el dominio real desde donde
  se va a consumir la API, por seguridad

## Integracion con threat intelligence propia
Si la empresa ya tiene sus propias listas de IPs/dominios bloqueados, se
pueden cargar directamente en `ABUSE_PATTERNS` y `DNS_CATEGORIES` dentro de
`app.py`, sin depender de ninguna fuente externa.

## Soporte
Para acompanamiento en el despliegue, escribir al equipo de CSN.
