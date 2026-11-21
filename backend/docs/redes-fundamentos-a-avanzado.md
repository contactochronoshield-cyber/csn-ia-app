# Redes: de lo básico a lo avanzado

Nota para la IA: explica con analogías simples al principiante y con comandos y detalles técnicos al intermedio o avanzado. Los comandos de diagnóstico se usan en la red propia.

## Qué es una red (principiante)

Una red es un conjunto de dispositivos que se comunican. Casa: tu router conecta celulares, TV y computador entre sí y con internet. Una **red privada** limita quién puede entrar y cómo viaja la información; una **VPN** crea un túnel cifrado entre dos puntos aunque estén lejos.

## Conceptos base

- **Dirección IP**: la "dirección" de un dispositivo. IPv4 (192.168.1.10) e IPv6 (más larga, más espacio).
- **Router**: reparte tráfico entre redes. **Switch**: conecta equipos dentro de una red.
- **DNS**: traduce nombres (ejemplo.com) a IPs. Si falla, "no hay internet" aunque sí hay conexión.
- **DHCP**: asigna IPs automáticamente.
- **NAT**: permite que muchos dispositivos compartan una IP pública.
- **Puerto**: "puerta" de un servicio en un equipo. Web: 80 (HTTP) y 443 (HTTPS). SSH: 22. DNS: 53. WireGuard: normalmente 51820/UDP.
- **Firewall**: reglas que permiten o bloquean tráfico.

## Modelo OSI y TCP/IP (intermedio)

OSI tiene 7 capas: física, enlace, red, transporte, sesión, presentación, aplicación. TCP/IP las resume en 4: acceso a red, internet (IP), transporte (TCP/UDP), aplicación (HTTP, DNS, SSH). **TCP** es confiable y ordenado; **UDP** es rápido y sin confirmación (voz, video, WireGuard).

## Subredes (intermedio)

Notación CIDR: 192.168.1.0/24 significa 24 bits de red y 8 de equipos, es decir 254 equipos útiles. Un /30 da 2 equipos útiles (enlaces punto a punto). Redes privadas reservadas: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.

## Comandos de diagnóstico (en tu propia red)

- `ping 1.1.1.1` comprueba conectividad; `ping ejemplo.com` comprueba también DNS.
- `traceroute` o `tracepath` muestra por dónde pasa el tráfico.
- `ip a` y `ip r` muestran interfaces y rutas en Linux.
- `ss -tulpn` lista puertos en escucha.
- `dig ejemplo.com` consulta DNS.
- `nmap` sobre tu propia red para ver qué servicios expones.

## Wi-Fi seguro

Usa WPA3, o WPA2-AES si el equipo no soporta WPA3. Desactiva WPS. Cambia la contraseña de administración del router. Separa invitados e IoT en otra red (VLAN o red de invitados).

## VLAN, segmentación y firewall (intermedio)

Una **VLAN** separa redes lógicas sobre el mismo hardware. Segmentar evita que un dispositivo comprometido (por ejemplo una cámara) llegue a tus servidores. En firewalls, la política recomendada es "denegar por defecto y permitir lo necesario".

## VPN y WireGuard

WireGuard es una VPN moderna, pequeña y rápida: cada par tiene una llave pública y una privada, y solo acepta tráfico de las llaves que autorizaste. Piezas clave: `[Interface]` (tu llave y dirección) y `[Peer]` (llave pública del otro extremo, `AllowedIPs`, `Endpoint`). Nunca compartas la llave privada.

## Redes mesh

En una red mesh, cada nodo se conecta con varios vecinos y el tráfico busca la mejor ruta; si un nodo cae, la red se reorganiza. Sirve para cobertura sin depender de un solo punto y para comunidades descentralizadas. Un nodo mesh debe tener firmware actualizado y autenticación entre nodos (mTLS o llaves).

## Enrutamiento (avanzado)

- **Estático** vs **dinámico**: OSPF para redes internas, **BGP** entre redes autónomas (internet).
- **BGP**: cada red tiene un ASN y anuncia prefijos. Riesgo: secuestro de prefijos. Defensas: RPKI/ROA, filtros de prefijos, límites de máximos, MD5/TCP-AO.
- **FRRouting (FRR)** implementa BGP, OSPF e IS-IS en Linux.

## Seguridad en redes (avanzado)

- **IDS/IPS**: Suricata y Zeek para detectar tráfico anómalo.
- **mTLS y zero trust**: cada servicio demuestra su identidad con certificado.
- **DNS seguro**: DoT/DoH, DNSSEC.
- **Ataques frecuentes**: ARP spoofing, DNS spoofing, DDoS, man-in-the-middle, escaneo de puertos, fuerza bruta a SSH. Defensas: segmentación, límites de tasa, llaves en vez de contraseñas, monitoreo de logs.
- **Soberanía de red**: operar tu propia infraestructura (DNS, VPN, backbone) reduce la dependencia de terceros y el riesgo de que un proveedor te corte o te vigile.

## Preguntas frecuentes

**¿Una VPN me hace anónimo?** No. Oculta tu tráfico del Wi-Fi y de tu operador, pero el proveedor de la VPN puede ver tu actividad. Elige uno de confianza o monta el tuyo.

**¿Tor o VPN?** Tor da más anonimato pero es lento; la VPN es más rápida y práctica para privacidad cotidiana. Se pueden combinar con cuidado.

**¿Qué puertos no debo exponer a internet?** RDP (3389), SMB (445), bases de datos (3306, 5432, 27017) y paneles de administración, salvo detrás de VPN.
