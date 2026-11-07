# CSN IA

Plataforma soberana de **Chrono Shield Networks** para conversar con una IA, crear tu red privada y **buscar en la red de forma segura**, desde el celular.

Web oficial: https://chronoshieldnetworks.com

## Qué es

CSN IA no es solo un asistente: es una plataforma con varias áreas dentro de la app.

| Pestaña | Para qué sirve |
|---|---|
| **Chat** | Asistente que explica los servicios, el sitio y los repositorios de CSN en lenguaje simple |
| **Mi red** | Crea y configura tu propia red privada |
| **Buscar** | Búsqueda en internet y, debajo, noticias de ciberseguridad y redes |
| **Nodo** | Ser nodo de la red de CSN y consultar el directorio |
| **Pro** | Plan Enterprise: IA que administra tu red de forma soberana |
| **Cuenta** | Tu cuenta, junto a Pro en la barra de navegación |

## Principios

- **Soberanía:** sin dependencia de proveedores corporativos extranjeros.
- **Privacidad:** el asistente corre en el dispositivo; sin trackers ni SDKs propietarios.
- **Transparencia:** código abierto (ver LICENSE).

## Noticias de ciberseguridad

Se leen de feeds RSS públicos (The Hacker News, BleepingComputer, WeLiveSecurity, Krebs on Security), se guardan en el teléfono y se refrescan cada 24 horas al abrir la app o con el botón *Actualizar*. La lectura la hace `NewsBridge.kt`; no hay servidor intermedio.

## Estructura del repositorio

    android/            App Android (WebView + Kotlin); interfaz en app/src/main/assets
    backend/            Servicios de apoyo y base de conocimiento
    backend-pro/        Servicios del plan Pro: DNS filtrado, firewall con autorización, panel
    directorio-nodos/   Directorio de nodos de la red
    fastlane/           Metadata de publicación (F-Droid)
    scripts/            Scripts de mantenimiento y despliegue
    .github/workflows/  Compilación automática del APK

## Compilar

    cd android
    gradle :app:assembleDebug

Cada push a `main` compila el APK con GitHub Actions.

## Contacto

contactochronoshield@gmail.com

## Búsqueda segura y Escudo CSN

- **Buscar** consulta DuckDuckGo desde el propio teléfono y muestra los resultados dentro de la app. DuckDuckGo es un tercero: recibe la consulta y la IP del usuario. El proveedor es intercambiable (`SearchBridge.PROVIDER`) para pasar a una instancia propia de SearXNG.
- **Escudo de enlaces:** cada resultado lleva una etiqueta (sin señales de riesgo, precaución, posible peligro) basada en señales de la dirección: sin https, acortadores, dominios que imitan marcas, caracteres engañosos y terminaciones de riesgo. No garantiza que un sitio sea seguro.
- **Escudo anti-estafa:** analiza en el teléfono un mensaje pegado por el usuario y marca banderas rojas (pide códigos, urgencia falsa, premios, estafa del familiar con número nuevo).

## Seguridad y mantenimiento

- **Guardian:** si el build falla, abre un Issue con el error, una pista y los archivos del commit; lo cierra solo cuando el build vuelve a pasar.
- **Precheck local** (`scripts/push_seguro.sh`): frena conflictos, JS roto, manifest inválido, secretos, archivos pesados y rutas locales antes de subir.
- **CodeQL:** análisis estático semanal y en cada push a `main`.
- **Integridad:** cada release incluye `SHA256SUMS.txt` con el hash del APK.
- Para reportar una vulnerabilidad, ver `SECURITY.md`.
