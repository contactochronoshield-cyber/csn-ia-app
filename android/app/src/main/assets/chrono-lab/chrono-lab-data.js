/*
 * CSN IA — Chrono Lab
 * Educational simulation layer.
 *
 * IMPORTANT:
 * This module does not execute commands on the Android device.
 * Commands are simulated inside the educational environment.
 */

window.CHRONO_LAB = {

  version: "2.0.0",

  systems: {

    linux: {
      name: "Linux",
      prompt: "csn@linux:~$",
      category: "Operating Systems",
      commands: [
        "pwd","ls","cd","tree","cat","head","tail","less",
        "grep","find","wc","sort","uniq","touch","mkdir",
        "rm","cp","mv","echo","chmod","whoami","id","uname",
        "date","history","env","clear"
      ]
    },

    windows: {
      name: "Windows / PowerShell",
      prompt: "PS C:\\Lab>",
      category: "Operating Systems",
      commands: [
        "Get-Location",
        "Get-ChildItem",
        "Set-Location",
        "Get-Content",
        "Get-Process",
        "Get-Service",
        "Get-NetIPConfiguration",
        "Get-NetRoute",
        "Get-NetAdapter",
        "Test-NetConnection",
        "Clear-Host"
      ]
    },

    freebsd: {
      name: "FreeBSD",
      prompt: "lab@freebsd:~ %",
      category: "Unix / BSD",
      commands: [
        "pwd","ls","cd","cat","grep","find",
        "ps","top","ifconfig","netstat","sockstat",
        "route","uname","clear"
      ]
    },

    termux: {
      name: "Android / Termux",
      prompt: "csn@termux:~ $",
      category: "Mobile Linux",
      commands: [
        "pwd","ls","cd","cat","grep","find",
        "ip","ping","ss","curl","uname","pkg"
      ]
    },

    cisco: {
      name: "Cisco IOS Lab",
      prompt: "Router#",
      category: "Networking",
      commands: [
        "show interfaces",
        "show ip interface brief",
        "show ip route",
        "show running-config",
        "show vlan",
        "show arp",
        "show cdp neighbors"
      ]
    },

    chronoos: {
      name: "ChronoOS",
      prompt: "chrono@node:~$",
      category: "Chrono Systems",
      commands: [
        "chrono status",
        "chrono network",
        "chrono node",
        "chrono identity",
        "chrono telemetry",
        "chrono security",
        "chrono edge",
        "chrono sentinel",
        "chrono gis",
        "chrono mesh",
        "chrono ledger",
        "chrono offline",
        "chrono help"
      ]
    }
  },

  network: {

    commands: [
      "ip",
      "ifconfig",
      "ping",
      "traceroute",
      "nslookup",
      "dig",
      "host",
      "route",
      "arp",
      "ss",
      "netstat",
      "curl",
      "wget",
      "ipcalc"
    ],

    topics: [
      "IPv4",
      "IPv6",
      "CIDR",
      "subnetting",
      "VLAN",
      "DHCP",
      "DNS",
      "NAT",
      "CGNAT",
      "routing",
      "BGP",
      "OSPF",
      "MPLS",
      "VPN",
      "QoS",
      "MTU",
      "PMTUD",
      "TCP",
      "UDP",
      "QUIC",
      "Wi-Fi",
      "SD-WAN"
    ]
  },

  cybersecurity: {

    commands: [
      "sha256",
      "sha512",
      "base64",
      "strings",
      "hexdump",
      "whois",
      "headers",
      "dnscheck",
      "ports",
      "firewall",
      "acl",
      "logs",
      "ioc",
      "incident"
    ],

    topics: [
      "SOC",
      "SIEM",
      "IOC",
      "MITRE ATT&CK",
      "incident response",
      "network security",
      "hardening",
      "authentication",
      "MFA",
      "TLS",
      "certificates",
      "phishing",
      "malware analysis",
      "threat hunting",
      "DNS security",
      "endpoint security"
    ]
  },

  telecom: {

    technologies: [
      "2G",
      "3G",
      "4G",
      "LTE",
      "5G",
      "5G RedCap",
      "RAN",
      "EPC",
      "5GC",
      "IMS",
      "VoLTE",
      "VoWiFi",
      "backhaul",
      "fronthaul",
      "private 5G",
      "LoRa",
      "LoRaWAN",
      "edge computing"
    ]
  },

  chrono: {

    components: [
      "ChronoOS",
      "ChronoNet",
      "chronoctl",
      "libchrono",
      "Chrono Edge",
      "Sentinel IA",
      "Chrono Ledger",
      "GIS",
      "Identity",
      "Telemetry",
      "Digital Twin",
      "LoRa / LoRaWAN",
      "5G",
      "Offline / Air-gapped"
    ]
  },

  labs: [

    {
      id: "network-001",
      title: "Diagnóstico de red lenta",
      level: "Fundamental",
      category: "Networking"
    },

    {
      id: "network-002",
      title: "DNS intermitente",
      level: "Fundamental",
      category: "Networking"
    },

    {
      id: "network-003",
      title: "Subredes y CIDR",
      level: "Fundamental",
      category: "Networking"
    },

    {
      id: "network-004",
      title: "VLAN y segmentación",
      level: "Intermedio",
      category: "Networking"
    },

    {
      id: "network-005",
      title: "IPv4 / IPv6",
      level: "Intermedio",
      category: "Networking"
    },

    {
      id: "cyber-001",
      title: "Analizar un IOC",
      level: "Fundamental",
      category: "Cybersecurity"
    },

    {
      id: "cyber-002",
      title: "Investigar tráfico DNS",
      level: "Intermedio",
      category: "Cybersecurity"
    },

    {
      id: "cyber-003",
      title: "Respuesta inicial a incidente",
      level: "Intermedio",
      category: "Cybersecurity"
    },

    {
      id: "telecom-001",
      title: "Diagnóstico LTE",
      level: "Intermedio",
      category: "Telecommunications"
    },

    {
      id: "telecom-002",
      title: "Introducción a 5G",
      level: "Intermedio",
      category: "Telecommunications"
    },

    {
      id: "telecom-003",
      title: "LoRa y LoRaWAN",
      level: "Intermedio",
      category: "Telecommunications"
    },

    {
      id: "chrono-001",
      title: "Explorar ChronoOS",
      level: "Fundamental",
      category: "Chrono Systems"
    },

    {
      id: "chrono-002",
      title: "ChronoNet",
      level: "Intermedio",
      category: "Chrono Systems"
    },

    {
      id: "chrono-003",
      title: "Chrono Edge",
      level: "Intermedio",
      category: "Chrono Systems"
    },

    {
      id: "chrono-004",
      title: "Sentinel IA",
      level: "Intermedio",
      category: "Chrono Systems"
    }
  ]
};

window.CHRONO_LAB_HELP = function () {

  return [
    "Chrono Lab — comandos disponibles",
    "",
    "SISTEMA",
    "  pwd ls cd tree cat head tail grep find",
    "  mkdir touch rm cp mv echo chmod whoami id uname",
    "",
    "REDES",
    "  ip ifconfig ping traceroute nslookup dig",
    "  host route arp ss netstat curl wget ipcalc",
    "",
    "SEGURIDAD",
    "  sha256 sha512 base64 strings hexdump",
    "  whois headers dnscheck ports firewall acl",
    "  logs ioc incident",
    "",
    "CSN",
    "  csn network",
    "  csn security",
    "  csn telecom",
    "  csn diagnose",
    "  csn incident",
    "  csn report",
    "",
    "CHRONOOS",
    "  chrono status",
    "  chrono network",
    "  chrono node",
    "  chrono identity",
    "  chrono telemetry",
    "  chrono security",
    "  chrono edge",
    "  chrono sentinel",
    "  chrono gis",
    "  chrono mesh",
    "  chrono ledger",
    "  chrono offline",
    "",
    "Otros sistemas:",
    "  Linux",
    "  Windows / PowerShell",
    "  FreeBSD",
    "  Android / Termux",
    "  Cisco IOS Lab",
    "  ChronoOS"
  ].join("\n");
};
