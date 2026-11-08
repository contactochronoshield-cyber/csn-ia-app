# Guardian CI - Seguridad y verificacion

## Controles configurados

- Permisos globales de solo lectura donde no se requiere escritura.
- Checkout sin persistencia de credenciales.
- Compilacion Android en GitHub Actions.
- Analisis CodeQL para JavaScript/TypeScript y Java/Kotlin.
- Validacion de scripts y biblioteca.
- SHA-256 del APK generado.
- Attestation SLSA de procedencia en push a main.
- Verificacion del SHA-256 del artefacto descargado.
- Verificacion de procedencia mediante GitHub CLI.
- La verificacion exige el workflow build-apk.yml y refs/heads/main.
- GitHub CLI debe ser version 2.102.0 o posterior.

## Limites

- El APK generado por este workflow es DEBUG, no un APK release firmado.
- La validacion local de YAML no demuestra que GitHub Actions haya terminado correctamente.
- La atestacion solo existe despues de una ejecucion exitosa del trabajo attest.
- La verificacion de integridad necesita el run_id de una ejecucion que haya producido esa atestacion.
- Las etiquetas @v4 de las acciones todavia deben migrarse a SHA completos verificados.
- El precheck local no sustituye CodeQL ni un analisis completo de dependencias.
- La deteccion local de secretos es basica y no sustituye un escaner dedicado.

## Publicacion

No se realiza commit, push, creacion de release ni publicacion automatica desde este proceso.
