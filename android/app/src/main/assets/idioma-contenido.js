(function () {
  'use strict';

  var M = {
    historia_internet: {
      en: "THE INTERNET: The internet is a global network of interconnected networks. It evolved from research networks such as ARPANET into the infrastructure used today for communication, business, education and cloud services.",
      pt: "A INTERNET: A internet é uma rede global de redes interconectadas. Evoluiu de redes de pesquisa como a ARPANET para a infraestrutura atual de comunicação, negócios, educação e serviços em nuvem."
    },
    inteligencia_artificial: {
      en: "ARTIFICIAL INTELLIGENCE: AI systems perform tasks that normally require human intelligence, such as recognizing patterns, processing language and making predictions. They can assist people, but their results must be evaluated.",
      pt: "INTELIGÊNCIA ARTIFICIAL: Sistemas de IA realizam tarefas que normalmente exigem inteligência humana, como reconhecer padrões, processar linguagem e fazer previsões. Eles podem ajudar as pessoas, mas seus resultados precisam ser avaliados."
    },
    computacion: {
      en: "COMPUTING: Computing involves processing, storing and transmitting information using hardware and software. It includes computers, servers, mobile devices, operating systems and cloud infrastructure.",
      pt: "COMPUTAÇÃO: A computação envolve processar, armazenar e transmitir informações usando hardware e software. Inclui computadores, servidores, dispositivos móveis, sistemas operacionais e infraestrutura em nuvem."
    },
    programacion: {
      en: "PROGRAMMING: Programming is the process of writing instructions that a computer can execute. Languages such as Python, JavaScript, Java and C are used to build applications, automate tasks and manage systems.",
      pt: "PROGRAMAÇÃO: Programar é escrever instruções que um computador pode executar. Linguagens como Python, JavaScript, Java e C são usadas para criar aplicativos, automatizar tarefas e administrar sistemas."
    },
    redes: {
      en: "COMPUTER NETWORKS: Networks connect devices so they can exchange data and share services. Common technologies include Ethernet, Wi-Fi, fiber optics, cellular networks and mesh networks. Security, reliability and good configuration are essential.",
      pt: "REDES DE COMPUTADORES: As redes conectam dispositivos para trocar dados e compartilhar serviços. Tecnologias comuns incluem Ethernet, Wi-Fi, fibra óptica, redes celulares e redes mesh. Segurança, confiabilidade e boa configuração são essenciais."
    },
    tcp_ip: {
      en: "TCP/IP: This is the core protocol suite used by the internet. IP addresses and routes help deliver packets between networks, while TCP provides reliable, ordered delivery. UDP is another transport protocol used when lower overhead is useful.",
      pt: "TCP/IP: Este é o conjunto central de protocolos usado pela internet. Endereços IP e rotas ajudam a entregar pacotes entre redes, enquanto o TCP oferece entrega confiável e ordenada. O UDP é outro protocolo de transporte, útil quando se deseja menos sobrecarga."
    },
    hardware: {
      en: "HARDWARE: Hardware is the physical part of a computer system. It includes processors, memory, storage, network cards, routers, antennas and power systems. Its capabilities determine which software and workloads a device can support.",
      pt: "HARDWARE: Hardware é a parte física de um sistema computacional. Inclui processadores, memória, armazenamento, placas de rede, roteadores, antenas e sistemas de energia. Suas capacidades determinam quais programas e tarefas um dispositivo pode executar."
    },
    ciencia_espacio: {
      en: "SPACE SCIENCE: Space science studies planets, stars, galaxies and the physical environment beyond Earth. Satellites also support communications, navigation, weather forecasting and Earth observation.",
      pt: "CIÊNCIA ESPACIAL: A ciência espacial estuda planetas, estrelas, galáxias e o ambiente físico além da Terra. Os satélites também apoiam comunicações, navegação, previsão do tempo e observação da Terra."
    },
    economia: {
      en: "ECONOMICS: Economics studies how people and organizations use limited resources. It examines production, employment, prices, trade, investment and public policy. Technology and infrastructure can influence productivity and development.",
      pt: "ECONOMIA: A economia estuda como pessoas e organizações utilizam recursos limitados. Analisa produção, emprego, preços, comércio, investimentos e políticas públicas. Tecnologia e infraestrutura podem influenciar a produtividade e o desenvolvimento."
    },
    comparador_empresas: {
      en: "COMPANY COMPARISON: A useful comparison should consider each company's products, customers, technology, pricing, market presence and maturity. A company being larger does not automatically mean it is better for every use case.",
      pt: "COMPARAÇÃO DE EMPRESAS: Uma boa comparação deve considerar os produtos, clientes, tecnologia, preços, presença no mercado e maturidade de cada empresa. Uma empresa ser maior não significa automaticamente que seja melhor para todos os casos."
    },
    comparador_catalogo: {
      en: "COMPANY CATALOG: CSN IA's catalog brings together technology, networking and cybersecurity companies. Compare them by specialization: endpoint protection, network security, identity management, cloud security, vulnerability management or infrastructure.",
      pt: "CATÁLOGO DE EMPRESAS: O catálogo da CSN IA reúne empresas de tecnologia, redes e cibersegurança. Compare-as por especialidade: proteção de endpoints, segurança de redes, gestão de identidade, segurança em nuvem, gestão de vulnerabilidades ou infraestrutura."
    },
    competidores_general: {
      en: "CYBERSECURITY AND NETWORKING LANDSCAPE: CrowdStrike and SentinelOne focus on endpoint protection; Palo Alto Networks, Fortinet and Check Point offer broad security platforms; Zscaler specializes in cloud-delivered Zero Trust; Okta focuses on identity; Tenable and Rapid7 address exposure and vulnerabilities. Their products are not direct substitutes in every situation.",
      pt: "CENÁRIO DE CIBERSEGURANÇA E REDES: CrowdStrike e SentinelOne focam na proteção de endpoints; Palo Alto Networks, Fortinet e Check Point oferecem plataformas amplas de segurança; Zscaler é especializada em Zero Trust na nuvem; Okta trabalha com identidade; Tenable e Rapid7 atuam em exposição e vulnerabilidades. Seus produtos não são substitutos diretos em todas as situações."
    },
    vs_vpn_mesh: {
      en: "VPN VS. MESH: A VPN creates an encrypted connection between devices or networks. A mesh network connects multiple nodes and can provide alternative paths for data. They solve different problems and can also be used together.",
      pt: "VPN VS. MESH: Uma VPN cria uma conexão criptografada entre dispositivos ou redes. Uma rede mesh conecta vários nós e pode oferecer caminhos alternativos para os dados. Elas resolvem problemas diferentes e também podem ser usadas em conjunto."
    },
    vs_monitoreo: {
      en: "NETWORK MONITORING: Monitoring tools observe availability, performance, traffic and events. Examples include Zabbix, LibreNMS and Uptime Kuma. The right choice depends on the devices, scale, integrations and alerting requirements.",
      pt: "MONITORAMENTO DE REDES: Ferramentas de monitoramento acompanham disponibilidade, desempenho, tráfego e eventos. Exemplos incluem Zabbix, LibreNMS e Uptime Kuma. A escolha depende dos dispositivos, da escala, das integrações e dos alertas necessários."
    },
    vs_mesh_comunitario: {
      en: "COMMUNITY MESH NETWORKS: Community networks are built to connect people and places that may lack reliable commercial connectivity. Their success depends on local participation, suitable radio links, power, maintenance and sustainable operating costs.",
      pt: "REDES MESH COMUNITÁRIAS: Redes comunitárias são criadas para conectar pessoas e lugares que podem não ter conectividade comercial confiável. Seu sucesso depende da participação local, enlaces de rádio adequados, energia, manutenção e custos sustentáveis."
    },
    por_que_csn: {
      en: "WHY CHRONO SHIELD NETWORKS? CSN focuses on accessible networking and cybersecurity solutions, with an emphasis on local infrastructure, practical learning and Latin American connectivity challenges. It is a developing company, so each product's current capabilities should be checked before deployment.",
      pt: "POR QUE A CHRONO SHIELD NETWORKS? A CSN se concentra em soluções acessíveis de redes e cibersegurança, com ênfase em infraestrutura local, aprendizado prático e desafios de conectividade da América Latina. É uma empresa em desenvolvimento; por isso, as capacidades atuais de cada produto devem ser verificadas antes da implantação."
    },
    csn_limites: {
      en: "CSN'S CURRENT LIMITATIONS: Chrono Shield Networks is still developing its products. Not every component is production-certified or independently audited. Before using a system in a critical environment, validate security, reliability, documentation, support and legal requirements.",
      pt: "LIMITAÇÕES ATUAIS DA CSN: A Chrono Shield Networks ainda está desenvolvendo seus produtos. Nem todos os componentes possuem certificação para produção ou auditoria independente. Antes de usar um sistema em ambiente crítico, valide segurança, confiabilidade, documentação, suporte e requisitos legais."
    }
  };

  window.CSNIdioma.traducirTema = function (id, original, lang) {
    var item = M[id];
    if (!item || !item[lang]) return original;
    return item[lang];
  };

  window.CSNIdioma.temasTraducidos = function () {
    return Object.keys(M);
  };
})();
