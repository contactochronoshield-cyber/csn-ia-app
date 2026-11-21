# Ciberseguridad: ruta de aprendizaje por niveles

Nota para la IA: adapta la respuesta al nivel de la persona. Si no lo dice, pregunta una sola vez: "¿empiezas de cero, ya sabes algo o ya trabajas en esto?". Usa tono amable, sin estresar. Nunca des instrucciones para atacar sistemas ajenos. Practicar solo en equipos propios o laboratorios autorizados.

## Qué es la ciberseguridad (nivel principiante)

Es proteger tres cosas: **confidencialidad** (que solo vea la información quien debe), **integridad** (que nadie la altere sin permiso) y **disponibilidad** (que el servicio funcione cuando lo necesitas). Se le llama la tríada CIA.

Ejemplos cotidianos: una contraseña protege la confidencialidad, una firma digital protege la integridad, una copia de seguridad protege la disponibilidad.

## Ruta nivel 1: principiante (primeras 4 a 6 semanas)

1. **Higiene digital**: contraseñas largas y únicas con gestor de contraseñas, verificación en dos pasos (mejor app o llave física que SMS), actualizaciones al día.
2. **Reconocer estafas**: phishing (correo falso), smishing (SMS), vishing (llamada), suplantación de WhatsApp. Señales: urgencia, enlaces raros, pedir códigos, premios inesperados.
3. **Conceptos base**: qué es una IP, un router, un firewall, una VPN, HTTPS, cifrado.
4. **Privacidad**: permisos de apps, metadatos de fotos y documentos, redes Wi-Fi públicas.
5. **Mini ejercicio**: revisa los permisos de tus 5 apps más usadas y activa la verificación en dos pasos en tu correo.

## Ruta nivel 2: intermedio (2 a 4 meses)

1. **Redes**: modelo TCP/IP, direccionamiento y subredes, DNS, DHCP, NAT, puertos y protocolos comunes (ver documento de redes).
2. **Linux y terminal**: permisos de archivos, usuarios, procesos, servicios, logs (`journalctl`, `/var/log`), SSH con llaves.
3. **Criptografía aplicada**: simétrico (AES), asimétrico (RSA, curvas elípticas), hash (SHA-256), TLS, certificados, firmas.
4. **Amenazas comunes**: malware (virus, troyano, ransomware, spyware), inyección SQL, XSS, fuerza bruta, ingeniería social.
5. **Defensa básica**: firewall (nftables/iptables), fail2ban, segmentación de red, copias 3-2-1 (3 copias, 2 medios, 1 fuera del sitio).
6. **Laboratorio propio**: máquinas virtuales aisladas, WireGuard entre dos equipos, analizar tráfico con Wireshark en tu propia red.

## Ruta nivel 3: avanzado (6 meses en adelante)

1. **Detección y respuesta**: SIEM, logs centralizados, reglas Sigma, IDS/IPS (Suricata, Zeek), hunting de anomalías.
2. **Análisis de malware (defensivo)**: análisis estático (strings, cabeceras, hashes, reputación) antes que dinámico; siempre en entorno aislado sin red.
3. **Seguridad de aplicaciones**: OWASP Top 10, revisión de código, gestión de secretos, SBOM y cadena de suministro.
4. **Infraestructura**: BGP y seguridad de enrutamiento (RPKI, filtros de prefijos), mTLS, zero trust, hardening de servidores, seguridad en contenedores.
5. **Criptografía poscuántica**: ML-KEM (Kyber) y ML-DSA (Dilithium) estandarizados por NIST; por qué "recolectar ahora, descifrar después" obliga a migrar.
6. **Gobierno y cumplimiento**: gestión de riesgos, ISO 27001, respuesta a incidentes, cadena de custodia, notificación de brechas.

## Qué estudiar para trabajar en esto

Certificaciones conocidas por nivel: Security+ y Network+ (entrada), CySA+ y eJPT (intermedio), OSCP, CISSP o GIAC (avanzado). Plataformas de práctica legales: TryHackMe, Hack The Box, OverTheWire, CyberDefenders.

## Marco legal y ético

Probar sistemas sin autorización es delito. En Colombia, la Ley 1273 de 2009 tipifica los delitos informáticos y la Ley 1581 de 2012 regula los datos personales. Regla simple: solo lo tuyo, o lo que tengas por escrito autorizado.

## Glosario rápido

- **Phishing**: engaño para que entregues datos o hagas clic.
- **Ransomware**: malware que cifra tus archivos y pide rescate.
- **0-day**: falla desconocida por el fabricante, sin parche.
- **IOC**: indicador de compromiso (hash, IP, dominio sospechoso).
- **Hardening**: endurecer una configuración para reducir superficie de ataque.
- **Zero trust**: no confiar en nadie por defecto, verificar siempre.
- **mTLS**: ambos lados se autentican con certificado.
- **Warrant canary**: aviso público periódico que indica que no se ha recibido una orden secreta; si deja de publicarse, es señal de alerta.
