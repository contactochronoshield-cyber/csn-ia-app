#!/data/data/com.termux/files/usr/bin/bash
set -e

python3 << 'PYEDIT_EOF'
path = "android/app/src/main/assets/chat.html"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

nuevos = '''
    { keys: ["historia de csn", "historia de la empresa", "quienes son", "fundacion", "desde cuando existen", "our history", "company history"],
      es: "CSN (Chrono Shield Networks) nacio a mediados de 2023, en Bogota, Colombia, con la idea de construir infraestructura digital soberana para LATAM. Hoy somos un equipo de alrededor de 12 personas. Nuestra meta no es solo crecer: queremos que CSN siga existiendo 200 anos despues de nosotros, porque las ideas duran mas que las personas.",
      en: "CSN (Chrono Shield Networks) was founded in mid-2023, in Bogota, Colombia, with the idea of building sovereign digital infrastructure for LATAM. Today we're a team of around 12 people. Our goal isn't just to grow: we want CSN to still exist 200 years from now, because ideas outlast people." },
    { keys: ["empresa pequena", "pyme", "pequeño negocio", "small business"],
      es: "Para un negocio pequeno recomendamos empezar con un Chrono Mesh Node (acceso remoto seguro a camaras/equipos) mas DNS filtrado basico. Es la forma mas barata de tener seguridad real sin contratar un equipo de TI.",
      en: "For a small business we recommend starting with one Chrono Mesh Node (secure remote access to cameras/equipment) plus basic DNS filtering. It's the cheapest way to get real security without hiring an IT team." },
    { keys: ["empresa mediana", "medium business", "varias sucursales"],
      es: "Para una empresa mediana con varias sucursales, el combo es: un Mesh Node por sede conectados en la misma red privada, Chrono Sentinel para monitorear todas las sedes desde un solo panel, y firewall gestionado con autorizacion para que no dependan de un tecnico presencial en cada sitio.",
      en: "For a medium business with multiple branches: one Mesh Node per site connected on the same private network, Chrono Sentinel to monitor all sites from a single panel, and managed firewall with authorization so you don't need an on-site technician everywhere." },
    { keys: ["empresa grande", "corporativo", "enterprise", "gran empresa", "data center propio", "centro de datos"],
      es: "Para una empresa grande con su propio servidor o data center, nuestro backend (DNS, firewall, panel de dispositivos) se puede desplegar completo dentro de su propia infraestructura (self-hosted), sin que nada salga a servidores externos. Nosotros damos el software y la guia de despliegue; ustedes mantienen el control total de sus datos.",
      en: "For a large company with its own server or data center, our backend (DNS, firewall, device panel) can be fully deployed inside your own infrastructure (self-hosted), with nothing leaving to external servers. We provide the software and deployment guide; you keep full control of your data." },
    { keys: ["prevenir ciberataque", "prevenir un ataque", "como me protejo", "cyberattack prevention", "proteger mi empresa"],
      es: "Con nuestros servicios, la prevencion tiene capas: 1) red privada (nadie entra si no esta autorizado), 2) firewall con reglas claras y kill switch (si la VPN cae, no sale trafico sin cifrar), 3) DNS filtrado (bloquea dominios maliciosos conocidos antes de que carguen), 4) Chrono Sentinel vigilando anomalias en tiempo real. Ninguna capa sola es suficiente; juntas si.",
      en: "With our services, prevention works in layers: 1) private network (no one gets in without authorization), 2) firewall with clear rules and a kill switch (if the VPN drops, no unencrypted traffic leaks), 3) DNS filtering (blocks known malicious domains before they load), 4) Chrono Sentinel watching for anomalies in real time. No single layer is enough alone; together they are." },
    { keys: ["organizaciones criminales", "cibercriminales", "amenazas conocidas", "threat intelligence", "grupos de hackers"],
      es: "Usamos inteligencia de amenazas de fuentes publicas y reconocidas (listas de dominios maliciosos, infraestructura de phishing conocida, patrones de ataque documentados) para que Sentinel y el firewall reconozcan trafico asociado a actividad criminal conocida y lo bloqueen automaticamente. Esto es deteccion defensiva, basada en lo que ya esta documentado por la comunidad de seguridad, no investigacion propia de grupos criminales.",
      en: "We use threat intelligence from public, recognized sources (malicious domain lists, known phishing infrastructure, documented attack patterns) so Sentinel and the firewall recognize traffic associated with known criminal activity and block it automatically. This is defensive detection based on what the security community already documents, not original investigation of criminal groups." },
    { keys: ["insultos", "acoso", "lenguaje ofensivo", "contenido toxico", "harassment"],
      es: "El filtro DNS/firewall tambien puede activarse en modo familiar, bloqueando sitios con contenido de acoso o lenguaje toxico conocido, pensado para proteger a menores u oficinas compartidas.",
      en: "The DNS/firewall filter can also run in family mode, blocking sites with known harassment or toxic content, designed to protect minors or shared offices." }
'''

marcador = "  ];\n\n  const FALLBACK_ES"
if marcador in content:
    content = content.replace(marcador, nuevos + "  ];\n\n  const FALLBACK_ES")
else:
    print("ADVERTENCIA: no encontre el punto de insercion, revisar manualmente.")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Historia, guia por tamano de empresa, y prevencion agregadas.")
PYEDIT_EOF

mkdir -p backend-pro
cat > backend-pro/DESPLIEGUE_EMPRESARIAL.md << 'MD_EOF'
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
MD_EOF

echo "Guia de despliegue empresarial creada."
git add .
git commit -m "Agregar historia, guia por tamano de empresa, prevencion de ciberataques, y despliegue empresarial self-hosted" --allow-empty
git push

echo ""
echo "Listo. Espera el build verde en Actions para la app."
