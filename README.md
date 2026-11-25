# CSN IA
### Chrono Shield Networks
**Inteligencia artificial · Telecomunicaciones · Ciberseguridad · Redes privadas · Infraestructura soberana**

CSN IA es la plataforma de inteligencia tecnológica de Chrono Shield Networks. Integra asistencia mediante IA, conocimiento técnico, seguridad digital, administración de redes, herramientas de análisis y aprendizaje tecnológico.

Forma parte de Chrono Shield Systems.

Sitio web: https://chronoshieldnetworks.com
GitHub: https://github.com/contactochronoshield-cyber
Contacto: contactochronoshield@gmail.com

---

## 1. Capacidades principales

- Asistente conversacional de inteligencia artificial.
- Biblioteca técnica y análisis de documentos PDF.
- Conocimiento especializado en redes y ciberseguridad.
- Análisis de intenciones de operaciones de red mediante Network Brain.
- Gestión de identidad, autenticación y sesiones.
- Infraestructura de licencias empresariales verificables.
- Integración con tecnologías de redes privadas y mesh.
- Guías geográficas y conocimiento local.
- Buscador con protección de enlaces y orientación antiestafas.
- Arquitectura Android con funcionalidades locales.

## 2. Arquitectura tecnológica

### Aplicación Android

Aplicación desarrollada con Kotlin y Android WebView.

Incluye:
- Interfaz conversacional.
- Biblioteca de conocimiento.
- Buscador.
- Sección Mi red.
- Gestión de nodos.
- Funciones de cuenta y configuración.
- Guía geográfica offline en desarrollo.

### Backend de inteligencia

Ubicación: `backend/`

Tecnologías:
- Python.
- FastAPI.
- Integración con modelos de lenguaje locales.
- Biblioteca documental.
- Recuperación de conocimiento.
- Análisis de documentos PDF.

Endpoints principales:
- `POST /chat`
- `POST /reload-docs`
- `GET /health`
- `POST /analizar-pdf`

### Backend empresarial

Ubicación: `backend-pro/`

Componentes:
- `app.py`
- `identity.py`
- `license_engine.py`
- `deployment.py`
- `network_brain.py`
- `chrono_mesh.py`
- `chrono_mesh_v2.py` (en desarrollo)

Incluye capacidades de autenticación, sesiones, licencias, análisis de red y herramientas de administración.

## 3. Identidad y licencias

CSN IA incorpora infraestructura de identidad empresarial con:

- Activación de cuentas.
- Autenticación.
- Sesiones.
- Identificación de usuarios.
- Preparación para organizaciones y entornos empresariales.
- Infraestructura de licencias firmadas digitalmente mediante Ed25519.

La verificación de licencias está diseñada para permitir validaciones independientes y funcionamiento offline.

## 4. Network Brain

Network Brain es el componente de análisis de intenciones de red.

Su objetivo es interpretar solicitudes relacionadas con infraestructura, redes privadas y operaciones de conectividad.

El análisis de intenciones no implica autorización automática ni ejecución de operaciones sobre redes.

Las acciones sensibles requieren controles de identidad, autorización y confirmación.

## 5. Chrono Mesh

### Chrono Mesh

Arquitectura de red mesh para conectar nodos y desarrollar infraestructura privada y descentralizada.

### Chrono Mesh Node

Dispositivo físico compuesto por una placa electrónica y antena que forma parte de una red mesh privada.

Precio de referencia: 169.000 COP en Mercado Libre.

Para orientación sobre compatibilidad y adquisición:
contactochronoshield@gmail.com

### Chrono Mesh v2

Nueva evolución del componente mesh, actualmente en desarrollo e integración.

## 6. Productos y proyectos tecnológicos

### Chrono Cloud Sovereign

Plataforma de nube soberana para almacenamiento y ejecución de aplicaciones sobre infraestructura controlada.

Dispone de tres planes comerciales.

### ChronoOS

Sistema operativo orientado a infraestructura soberana, servidores y centros de datos.

### Chrono Sentinel

Aplicación Android para monitoreo de equipos, nodos y condiciones de conectividad.

### ChronoShieldVPN

Solución VPN basada en WireGuard para establecer túneles cifrados entre dispositivos y redes privadas.

### Chrono-Shield-Onion

Proyecto de red mesh cifrada que contempla autenticación mutua mediante mTLS, detección de anomalías y warrant canary.

Proyecto de código abierto con documentación técnica.

### Chrono Guardians

Herramientas orientadas a detectar comportamientos anómalos y eventos relacionados con la seguridad de infraestructura.

### AAP — Acoustic Anomaly Protocol

Protocolo experimental de análisis acústico para identificar anomalías asociadas a posibles eventos físicos.

## 7. Seguridad digital

CSN IA proporciona orientación y herramientas relacionadas con:

- Detección de enlaces sospechosos.
- Prevención de estafas.
- Seguridad de redes Wi-Fi.
- Redes privadas y VPN.
- Protección de dispositivos.
- Análisis de amenazas.
- Seguridad de infraestructura.
- Privacidad y soberanía digital.

### Buscador seguro

La pestaña Buscar integra búsqueda, revisión de enlaces, orientación antiestafas y noticias relacionadas con ciberseguridad y redes.

## 8. Biblioteca y formación

La biblioteca documental incluye contenidos sobre:

- Redes privadas.
- Soberanía digital.
- Fundamentos de redes.
- Ciberseguridad.
- Análisis de metadatos PDF.
- Rutas de aprendizaje técnico.

La formación contempla tres niveles:

1. Principiante.
2. Intermedio.
3. Avanzado.

Los contenidos abarcan Linux, programación, redes, criptografía, firewall, detección de amenazas, análisis defensivo y seguridad de aplicaciones.

## 9. CHRONO LAB — Próxima evolución

CHRONO LAB es el proyecto de laboratorio educativo integrado en CSN IA.

Su objetivo es proporcionar una experiencia de aprendizaje inspirada en las terminales Linux y herramientas de desarrollo móvil.

Capacidades previstas:

- Terminal educativa.
- Programación Python.
- JavaScript.
- Fundamentos de Linux.
- Laboratorios de redes.
- Simulación de amenazas.
- Ejercicios de ciberseguridad defensiva.
- Entornos de práctica controlados.
- Misiones y seguimiento del aprendizaje.

Se desarrollará progresivamente con prioridad en la seguridad, el aislamiento y la compatibilidad con dispositivos Android.

## 10. Privacidad y seguridad

CSN IA prioriza una arquitectura local-first.

Los datos y operaciones deben manejarse según los permisos y capacidades de cada módulo.

Principios:

- Protección de credenciales.
- Gestión controlada de identidad.
- Autorización para operaciones sensibles.
- Protección de secretos.
- Separación entre análisis y ejecución.
- Prácticas de seguridad defensiva.
- Respeto por la privacidad de los usuarios.

## 11. Instalación y desarrollo

### Backend principal

```bash
cd backend
pip install -r requirements.txt
```

### Backend empresarial

```bash
cd backend-pro
pip install -r requirements.txt
```

### Android

El proyecto Android se encuentra en:

```text
android/
```

Para compilar una versión de depuración desde el directorio Android:

```bash
gradle assembleDebug
```

La configuración de modelos, servicios, identidad y licencias debe realizarse según los archivos de configuración y el entorno correspondiente.

## 12. Pruebas

El proyecto dispone de pruebas para componentes de identidad y análisis de intenciones.

```bash
python -m pytest backend-pro/tests -q
```

Las capacidades nuevas deben acompañarse de pruebas de integración y validación antes de considerarse terminadas.

## 13. Estado del desarrollo

CSN IA continúa en evolución.

Las funcionalidades se encuentran en diferentes etapas:

- Implementadas.
- En integración.
- Experimentales.
- Planificadas.

La documentación distingue entre capacidades existentes y desarrollos futuros para evitar presentar proyectos pendientes como productos terminados.

## 14. Filosofía

Construimos tecnología para proporcionar mayor control sobre las redes, los datos y la infraestructura digital.

**Construimos. Probamos. Medimos. Mejoramos.**

El tiempo, nuestro aliado.

---

Chrono Shield Networks
A Chrono Shield Systems company

https://chronoshieldnetworks.com

## CHRONO LAB

CHRONO LAB es el laboratorio educativo integrado en CSN IA.

Incluye:
- Terminal educativa con comandos simulados.
- Prácticas introductorias de Python.
- Ejercicios de JavaScript.
- Fundamentos de redes: IP, DNS y VPN.
- Formación defensiva en ciberseguridad: phishing, redes Wi-Fi falsas y contraseñas.

Esta primera versión utiliza ejercicios controlados y simulados. No ejecuta comandos arbitrarios del sistema Android ni sustituye un intérprete completo de Python o JavaScript.

El objetivo es ampliar progresivamente el laboratorio con prácticas aisladas, contenidos offline, seguimiento del aprendizaje y simulaciones técnicas autorizadas.
