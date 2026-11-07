# CSN IA

**Inteligencia artificial, privacidad y conectividad desde tu dispositivo.**

![Android](https://img.shields.io/badge/Android-App-3DDC84?logo=android&logoColor=white)
![Local First](https://img.shields.io/badge/AI-Local--First-2563EB)
![Development](https://img.shields.io/badge/Status-Active%20Development-orange)
[![Build APK](https://github.com/contactochronoshield-cyber/csn-ia-app/actions/workflows/build-apk.yml/badge.svg)](https://github.com/contactochronoshield-cyber/csn-ia-app/actions/workflows/build-apk.yml)

[Web oficial](https://chronoshieldnetworks.com) · [GitHub](https://github.com/contactochronoshield-cyber/csn-ia-app) · [Versiones](https://github.com/contactochronoshield-cyber/csn-ia-app/releases) · [Problemas](https://github.com/contactochronoshield-cyber/csn-ia-app/issues)

---

## 1. ¿Qué es CSN IA?

CSN IA es una aplicación de inteligencia artificial para Android desarrollada por **Chrono Shield Networks**, división de telecomunicaciones de **Chrono Shield Systems**.

El proyecto busca integrar inteligencia artificial, privacidad, conectividad, orientación contextual y herramientas de seguridad en una única experiencia móvil.

Su filosofía tecnológica se basa en el enfoque **Local-First AI**: priorizar el procesamiento en el dispositivo cuando las capacidades disponibles lo permiten y utilizar servicios externos únicamente cuando una función lo necesita.

CSN IA está concebida como una plataforma modular y extensible, con capacidades que evolucionan progresivamente mediante desarrollo, pruebas e integración de nuevos componentes.

## 2. Filosofía del proyecto

Los principios de desarrollo de CSN IA son:

- Prioridad al procesamiento local.
- Privacidad y control del usuario.
- Arquitectura modular.
- Integración progresiva de inteligencia artificial.
- Conectividad segura.
- Independencia de proveedores cuando sea técnicamente viable.
- Transparencia sobre las funciones disponibles.
- Evolución continua mediante pruebas y validación.

El objetivo es construir una experiencia tecnológica útil, accesible y preparada para evolucionar.

## 3. Módulos de la aplicación

| Módulo | Función |
|---|---|
| Chat | Interacción conversacional con CSN IA. |
| Mi red | Herramientas e información sobre redes y conectividad. |
| Buscar | Búsquedas web cuando existe conexión. |
| Noticias | Consulta de información procedente de fuentes externas. |
| Nodo | Experiencia relacionada con nodos e infraestructura Chrono. |
| Pro | Espacio para capacidades avanzadas. |
| CHRONO COMPANION | Asistencia contextual y orientación mediante ubicación. |

La disponibilidad de cada función depende de la versión instalada, las capacidades del dispositivo y los servicios configurados.

## 4. CHRONO COMPANION

**Asistencia contextual cuando necesitas orientación.**

CHRONO COMPANION es una experiencia de asistencia integrada en CSN IA, orientada a ayudar al usuario cuando necesita comprender su entorno o iniciar una conversación de orientación.

La experiencia contempla:

- Solicitud de ubicación GPS mediante autorización del usuario.
- Opción **ME PERDÍ** para iniciar una experiencia de asistencia.
- Inicio de orientación conversacional.
- Comunicación del contexto de ubicación al asistente.
- Integración progresiva con información geográfica.

La experiencia depende de los permisos concedidos, el hardware del dispositivo y las funciones implementadas en cada versión.

**Importante:** disponer de GPS no significa disponer automáticamente de mapas completos, navegación offline o rutas verificadas. Estas capacidades pertenecen al desarrollo de CHRONO OFFLINE GUIDE.

## 5. CHRONO OFFLINE GUIDE

### Powered by CHRONO GEO INTELLIGENCE

CHRONO OFFLINE GUIDE es una iniciativa tecnológica destinada a proporcionar orientación geográfica y contextual incluso cuando el usuario no dispone de conexión a Internet.

La idea central es que una persona pueda llegar a una ciudad desconocida, quedarse sin conexión y seguir consultando información útil desde su dispositivo.

### Objetivos tecnológicos

- Información geográfica almacenada localmente.
- Consulta de ciudades, barrios, calles y lugares.
- Orientación mediante lenguaje natural.
- Contexto geográfico adaptado a la ubicación del usuario.
- Referencias urbanas y puntos de interés.
- Registro de nombres antiguos y cambios de nomenclatura.
- Información sobre lugares y servicios.
- Evolución hacia rutas peatonales.
- Evolución hacia información de transporte público.
- Instrucciones conversacionales y asistencia contextual.
- Sincronización de actualizaciones cuando vuelva la conexión.

### CHRONO GEO INTELLIGENCE

CHRONO GEO INTELLIGENCE es el componente conceptual encargado de organizar y enriquecer la información geográfica que utiliza CHRONO OFFLINE GUIDE.

Su evolución contempla:

- Datos geográficos estructurados.
- Información histórica de calles y lugares.
- Procedencia de los datos.
- Fecha de actualización.
- Verificación de cambios.
- Incorporación progresiva de nuevas referencias.
- Sincronización de información revisada.

### Primera ciudad objetivo

**Bogotá, Colombia.**

Bogotá es el primer objetivo de implementación. La arquitectura está pensada para ampliarse progresivamente a otras ciudades y países donde Chrono Shield Networks desarrolla o proyecta actividades.

**Estado:** en desarrollo. Los mapas completos, la navegación sin conexión y las rutas verificadas no deben considerarse funciones disponibles hasta que se implementen y validen.

## 6. Privacidad y tratamiento de información

CSN IA prioriza una arquitectura local-first.

Principios:

- Las funciones locales pueden procesar información en el dispositivo.
- Las funciones conectadas necesitan acceso a Internet.
- Las búsquedas web pueden comunicarse con proveedores externos y revelar la dirección IP asociada a la conexión.
- Las noticias dependen de fuentes externas.
- La ubicación requiere autorización del usuario.
- El funcionamiento offline depende de los datos y componentes instalados.

No todas las funciones son completamente offline y el enfoque local-first no constituye una garantía de privacidad absoluta.

El usuario debe revisar los permisos de Android y las condiciones de los servicios externos utilizados.

## 7. Seguridad y conectividad

El proyecto contempla herramientas relacionadas con:

- Identificación de enlaces potencialmente sospechosos.
- Análisis de mensajes y contenido de riesgo.
- Consulta de información externa.
- Redes privadas y conectividad segura.
- Integración con infraestructura de Chrono Shield Networks.
- Evolución de herramientas de análisis y protección.

Las herramientas de asistencia no sustituyen una auditoría profesional ni garantizan detectar todas las amenazas.

## 8. Arquitectura tecnológica

CSN IA integra componentes Android, tecnologías web y servicios backend.

| Tecnología | Utilización |
|---|---|
| Android | Plataforma móvil. |
| Kotlin | Integración nativa con Android. |
| WebView | Interfaz de la aplicación. |
| JavaScript | Lógica de interacción. |
| Python | Componentes de backend. |
| FastAPI | Servicios backend. |
| Ollama | Integración con modelos locales cuando está configurada. |
| RAG | Recuperación de información desde documentación disponible. |
| SQLite | Persistencia local en los componentes que la utilizan. |
| Git | Control de versiones. |
| GitHub Actions | Automatización de compilaciones. |

La arquitectura puede cambiar a medida que evolucionan los módulos.

## 9. Estructura del repositorio

```text
csn-ia-app/
├── android/
│   └── app/
│       └── src/
│           └── main/
│               ├── assets/
│               ├── java/
│               └── AndroidManifest.xml
├── backend/
├── backend-pro/
├── directorio-nodos/
├── fastlane/
├── scripts/
├── .github/
│   └── workflows/
│       └── build-apk.yml
├── LICENSE
├── SECURITY.md
└── README.md
```

La estructura representa los componentes principales del proyecto; los archivos y directorios disponibles pueden variar entre versiones.

## 10. Instalación

Las versiones publicadas se consultan desde:

https://github.com/contactochronoshield-cyber/csn-ia-app/releases

Pasos generales:

1. Acceder a las versiones oficiales.
2. Descargar el APK publicado.
3. Abrir el archivo en Android.
4. Autorizar la instalación desde esa fuente si Android lo solicita.
5. Abrir CSN IA y conceder únicamente los permisos necesarios para las funciones que se quieran utilizar.

Se recomienda instalar versiones procedentes de los canales oficiales del proyecto.

## 11. Compilación desde el código fuente

### Requisitos

- Android SDK.
- JDK compatible con la configuración Gradle.
- Gradle compatible.
- Git.

### Clonar el repositorio

```bash
git clone https://github.com/contactochronoshield-cyber/csn-ia-app.git
cd csn-ia-app
```

### Compilar Android

```bash
cd android
gradle assembleDebug --no-daemon --max-workers=2
```

### Ubicación habitual del APK

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

La compilación de depuración no equivale a una versión de producción firmada para distribución.

## 12. Automatización y GitHub Actions

El repositorio dispone de un flujo de trabajo de GitHub Actions para automatizar la compilación Android.

Consultar ejecuciones:

https://github.com/contactochronoshield-cyber/csn-ia-app/actions

Consultar versiones:

https://github.com/contactochronoshield-cyber/csn-ia-app/releases

La publicación de un APK depende de que el flujo correspondiente termine correctamente y de las condiciones de publicación configuradas.

## 13. Hoja de ruta

Las líneas de evolución contempladas incluyen:

1. Mejoras de estabilidad y experiencia de usuario.
2. Evolución de CHRONO COMPANION.
3. Desarrollo de CHRONO OFFLINE GUIDE.
4. Expansión de CHRONO GEO INTELLIGENCE.
5. Incorporación progresiva de información geográfica de Bogotá.
6. Expansión a otras ciudades y mercados.
7. Evolución hacia orientación peatonal offline.
8. Integración progresiva de información de transporte público.
9. Mejoras de inteligencia artificial local.
10. Ampliación de herramientas de conectividad y seguridad.

La hoja de ruta expresa objetivos de desarrollo y no garantiza fechas ni disponibilidad de funcionalidades todavía no implementadas.

## 14. Seguridad del proyecto

La seguridad es una parte importante del desarrollo.

Si identificas una vulnerabilidad:

- Evita publicar credenciales o datos sensibles.
- No incluyas claves privadas ni tokens en los reportes.
- Describe el problema de forma técnica y reproducible.
- Utiliza los canales de reporte disponibles.

Consulta:

https://github.com/contactochronoshield-cyber/csn-ia-app

## 15. Contribuciones

Las propuestas, mejoras y reportes de errores son bienvenidos.

Repositorio:

https://github.com/contactochronoshield-cyber/csn-ia-app

Issues:

https://github.com/contactochronoshield-cyber/csn-ia-app/issues

Antes de enviar una contribución:

- Comprueba los cambios.
- Ejecuta las validaciones pertinentes.
- Evita incluir archivos generados innecesarios.
- No publiques credenciales.
- Documenta las modificaciones relevantes.

## 16. Organización

**Chrono Shield Networks**

Una división de telecomunicaciones de **Chrono Shield Systems**.

Áreas de trabajo:

- Telecomunicaciones.
- Ciberseguridad.
- Redes privadas.
- Inteligencia artificial.
- Infraestructura digital.
- Conectividad.
- Tecnologías emergentes.

Sitio oficial:

https://chronoshieldnetworks.com

Contacto:

contactochronoshield@gmail.com

**Construimos. Probamos. Medimos. Mejoramos.**

**El tiempo, nuestro aliado.**

---

## 17. English overview

### About CSN IA

CSN IA is an Android artificial intelligence application developed by Chrono Shield Networks, a telecommunications division of Chrono Shield Systems.

The project focuses on local-first AI, privacy-conscious mobile experiences, connectivity, network tools and contextual assistance.

### CHRONO COMPANION

CHRONO COMPANION introduces GPS-assisted contextual orientation and conversational assistance.

### CHRONO OFFLINE GUIDE

Powered by CHRONO GEO INTELLIGENCE, this initiative aims to provide geographic information and contextual guidance without requiring continuous Internet connectivity.

Bogotá, Colombia, is the first target city.

Offline maps, complete navigation and verified public transportation routes remain under development.

### Technology principles

- Local-first architecture.
- User privacy and control.
- Modular software.
- Provider independence where technically feasible.
- Continuous testing and improvement.
- Progressive geographic intelligence.

### Official resources

- Website: https://chronoshieldnetworks.com
- Repository: https://github.com/contactochronoshield-cyber/csn-ia-app
- Releases: https://github.com/contactochronoshield-cyber/csn-ia-app/releases
- Issues: https://github.com/contactochronoshield-cyber/csn-ia-app/issues
- Contact: contactochronoshield@gmail.com

**Build. Test. Measure. Improve.**

---

© Chrono Shield Networks — A Chrono Shield Systems company.
