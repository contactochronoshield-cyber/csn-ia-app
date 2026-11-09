# CSN IA — Asistente educativo de Chrono Shield Networks

App Android de código abierto que explica, en palabras simples, qué son las redes privadas, cómo evitar estafas y cómo cuidar tu celular, tu wifi y tus datos. Es un asistente de conversación con una biblioteca de guías integrada en la app; no necesita cuenta.

**English:** open-source Android app that explains private networks, scams and online safety in plain words.
**Português:** app Android de código aberto que explica redes privadas, golpes e segurança online em palavras simples.

## Qué incluye

- Asistente con biblioteca de guías: GitHub, routers MikroTik, VPN, contraseñas, verificación en dos pasos, estafas, robo de celular y leyes de datos (RGPD, Ley 1581 de Colombia, LGPD de Brasil).
- Buscador con Escudo de enlaces y Escudo anti-estafa.
- Noticias de ciberseguridad de fuentes públicas.
- Guías para conectar tu red privada con WireGuard.
- Directorio de nodos y sección Pro (opcionales).

## Cómo está hecha

App Android (Kotlin) con WebView sobre HTML y JavaScript en `android/app/src/main/assets/`. La biblioteca vive en `biblioteca-data.js`: se amplía con `scripts/merge_temas.py` y se valida con `node scripts/validar_biblioteca.js`. Sin SDKs de Google ni rastreadores.

## Compilar

Requisitos: JDK y Android SDK 34.

    cd android
    gradle assembleRelease

También se puede abrir la carpeta `android/` en Android Studio.

## Estructura

- `android/`: app Android.
- `scripts/`: herramientas de la biblioteca.
- `fastlane/metadata/`: textos de la ficha de F-Droid (es-419, en-US, pt-BR).
- `directorio-nodos/`, `backend/`, `backend-pro/`: servicios del lado servidor que usan las funciones avanzadas.
- `.github/workflows/`: integración continua (compilación, biblioteca, CodeQL, integridad).

## Privacidad

- Sin anuncios y sin rastreadores.
- Algunas funciones se conectan a internet y esos servicios ven tu dirección IP: DuckDuckGo (buscador), la API pública de GitHub, feeds de noticias de seguridad y el catálogo de vulnerabilidades de CISA.
- La ubicación es opcional y se pide solo cuando una función la necesita.

## Estado y hoja de ruta

- [x] Licencia GPL-3.0 y sin dependencias propietarias.
- [x] Metadatos de F-Droid en es-419, en-US y pt-BR.
- [ ] Etiqueta v1.0.0 y solicitud de inclusión en F-Droid.
- [ ] Interfaz traducida a inglés y portugués (hoy solo parte de la biblioteca).
- [ ] Modelo de lenguaje local opcional, con licencia libre y descargado solo con consentimiento.

## Licencia

GPL-3.0 o posterior. Ver `LICENSE` y `NOTICE`. Más información: chronoshieldnetworks.com
