# Análisis de metadatos y seguridad de PDFs

Nota para la IA: cuando la persona sube un PDF, el backend lo analiza SIN abrirlo ni ejecutarlo y te entrega un resultado. Explica ese resultado en lenguaje simple, según el nivel de la persona. Nunca digas "es seguro" con certeza: di "no se detectaron señales de riesgo conocidas", que no es lo mismo.

## Qué son los metadatos de un PDF

Son datos sobre el archivo, no parte del contenido visible. Pueden incluir autor, programa que lo creó (Creator y Producer), fechas de creación y modificación, título, asunto, palabras clave y a veces el nombre de usuario del equipo o rutas internas. Se guardan en el diccionario `/Info` y en un bloque XMP (XML).

## Por qué importan

1. **Privacidad**: un PDF que compartes puede revelar tu nombre, tu empresa o el programa que usas. Antes de publicar un documento, limpia sus metadatos.
2. **Pistas de autenticidad**: un PDF que dice venir del banco pero fue creado con un editor casero, o cuya fecha de modificación es muy posterior a la de creación, merece desconfianza.
3. **Señales de riesgo**: ciertas funciones internas del PDF se usan en ataques.

## Elementos que se revisan y qué significan

- `/JavaScript` o `/JS`: el PDF trae código. Los PDFs normales casi nunca lo necesitan. Señal alta.
- `/OpenAction` y `/AA`: acciones que se disparan al abrir el archivo o al interactuar. Señal media o alta, sobre todo junto a JavaScript.
- `/Launch`: intenta lanzar un programa externo. Señal alta.
- `/EmbeddedFile`: lleva archivos adjuntos dentro (podrían ser ejecutables). Señal media o alta.
- `/URI`, `/GoToR`, `/SubmitForm`: enlaces o envíos de formularios a direcciones externas. Revisar los dominios.
- `/RichMedia` y `/XFA`: contenido multimedia o formularios complejos, superficie de ataque mayor.
- `/ObjStm` y `/Encrypt`: contenido comprimido o cifrado; el análisis puede quedar incompleto.
- Nombres ofuscados con `#xx` (por ejemplo `/Java#53cript`): técnica para evadir filtros. Señal media.
- Dominios con IP directa o acortadores de enlaces: señal de enlace sospechoso.
- Cabecera `%PDF` desplazada o basura antes de la cabecera: archivo posiblemente manipulado.

## Cómo explicar el resultado

- **Riesgo bajo**: no se hallaron funciones activas ni enlaces raros. Aun así, mantén el lector de PDF actualizado.
- **Riesgo medio**: hay elementos que pueden ser legítimos (formularios, enlaces) pero conviene verificar el origen del archivo.
- **Riesgo alto**: hay JavaScript, ejecución de programas o archivos incrustados. Recomienda no abrirlo en el equipo principal; abrirlo solo en una máquina virtual aislada o pedir al remitente confirmación por otro canal.

## Limitaciones (decirlas siempre que aplique)

Este análisis es estático y heurístico. No reemplaza a un antivirus ni a un análisis forense. Un PDF puede ser malicioso sin activar estas señales (por ejemplo, un engaño de phishing con enlace normal). Y un PDF con JavaScript puede ser legítimo (formularios corporativos).

## Qué hacer si un PDF parece sospechoso

1. No lo abras en tu equipo principal ni habilites contenido activo.
2. Confirma con el remitente por otro medio (llamada o mensaje distinto).
3. Calcula su hash SHA-256 y consúltalo en servicios de reputación.
4. Ábrelo solo en una máquina virtual sin red.
5. Reporta el correo como phishing y bloquea al remitente.

## Cómo limpiar metadatos antes de compartir

- Imprime a PDF o exporta de nuevo desde el editor, quitando autor y propiedades.
- Herramientas libres: `exiftool -all= archivo.pdf` (deja copia `_original`) o `qpdf --linearize` tras limpiar.
- Revisa también las imágenes dentro del documento: pueden traer su propio EXIF con ubicación GPS.

## Otros tipos de archivo

Las fotos (JPG) guardan EXIF con modelo de cámara, fecha y a veces ubicación GPS. Los documentos de Office guardan autor, empresa, revisiones y comentarios. Los ejecutables y documentos con macros (.docm, .xlsm) son de mayor riesgo que un PDF. Desconfía de dobles extensiones como `factura.pdf.exe`.
