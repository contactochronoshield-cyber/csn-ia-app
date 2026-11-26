(function () {
  "use strict";

  const LANGS = {
    es: {
      name: "Español",
      lab: "CHRONO LAB",
      subtitle: "Laboratorio tecnológico de Chrono Shield Networks",
      center: "Centro de aprendizaje",
      description: "Practica programación, sistemas, redes, telecomunicaciones y ciberseguridad en ejercicios controlados.",
      simulated: "Entorno educativo simulado. No ejecuta comandos del sistema.",
      preferences: "Preferencias",
      language: "Idioma",
      theme: "Tema visual",
      systems: "Sistemas",
      topics: "Áreas de aprendizaje",
      terminal: "Terminal",
      python: "Python",
      javascript: "JavaScript",
      networking: "Redes",
      cybersecurity: "Ciberseguridad",
      telecom: "Telecomunicaciones",
      execute: "Ejecutar",
      help: "Escribe help para ver los comandos disponibles.",
      chooseSystem: "Selecciona un sistema para explorar sus comandos.",
      selected: "Sistema seleccionado",
      persistence: "Las preferencias se guardan en este dispositivo."
    },

    en: {
      name: "English",
      lab: "CHRONO LAB",
      subtitle: "Chrono Shield Networks technology laboratory",
      center: "Learning Center",
      description: "Practice programming, systems, networking, telecommunications and cybersecurity in controlled exercises.",
      simulated: "Educational simulated environment. It does not execute system commands.",
      preferences: "Preferences",
      language: "Language",
      theme: "Visual theme",
      systems: "Systems",
      topics: "Learning areas",
      terminal: "Terminal",
      python: "Python",
      javascript: "JavaScript",
      networking: "Networking",
      cybersecurity: "Cybersecurity",
      telecom: "Telecommunications",
      execute: "Run",
      help: "Type help to see available commands.",
      chooseSystem: "Select a system to explore its commands.",
      selected: "Selected system",
      persistence: "Preferences are saved on this device."
    },

    pt: {
      name: "Português",
      lab: "CHRONO LAB",
      subtitle: "Laboratório tecnológico da Chrono Shield Networks",
      center: "Centro de aprendizagem",
      description: "Pratique programação, sistemas, redes, telecomunicações e cibersegurança em exercícios controlados.",
      simulated: "Ambiente educacional simulado. Não executa comandos do sistema.",
      preferences: "Preferências",
      language: "Idioma",
      theme: "Tema visual",
      systems: "Sistemas",
      topics: "Áreas de aprendizagem",
      terminal: "Terminal",
      python: "Python",
      javascript: "JavaScript",
      networking: "Redes",
      cybersecurity: "Cibersegurança",
      telecom: "Telecomunicações",
      execute: "Executar",
      help: "Digite help para ver os comandos disponíveis.",
      chooseSystem: "Selecione um sistema para explorar seus comandos.",
      selected: "Sistema selecionado",
      persistence: "As preferências são salvas neste dispositivo."
    },

    et: {
      name: "Eesti",
      lab: "CHRONO LAB",
      subtitle: "Chrono Shield Networksi tehnoloogialabor",
      center: "Õppekeskus",
      description: "Harjuta programmeerimist, süsteeme, võrke, telekommunikatsiooni ja küberturvalisust kontrollitud ülesannetes.",
      simulated: "Õppekeskkond on simuleeritud. See ei käivita telefoni süsteemikäske.",
      preferences: "Seaded",
      language: "Keel",
      theme: "Visuaalne teema",
      systems: "Süsteemid",
      topics: "Õppevaldkonnad",
      terminal: "Terminal",
      python: "Python",
      javascript: "JavaScript",
      networking: "Võrgud",
      cybersecurity: "Küberturvalisus",
      telecom: "Telekommunikatsioon",
      execute: "Käivita",
      help: "Kirjuta help saadaolevate käskude vaatamiseks.",
      chooseSystem: "Vali süsteem selle käskude uurimiseks.",
      selected: "Valitud süsteem",
      persistence: "Seaded salvestatakse sellesse seadmesse."
    }
  };

  const THEMES = {
    csnBlue: {
      name: "CSN Blue",
      primary: "#2563EB",
      secondary: "#0EA5E9",
      background: "#F5F8FC",
      panel: "#FFFFFF",
      text: "#0F172A"
    },
    midnight: {
      name: "Midnight",
      primary: "#6366F1",
      secondary: "#8B5CF6",
      background: "#0B1020",
      panel: "#121A2B",
      text: "#F8FAFC"
    },
    cyberGreen: {
      name: "Cyber Green",
      primary: "#16A34A",
      secondary: "#22C55E",
      background: "#07120B",
      panel: "#0D1B12",
      text: "#ECFDF5"
    },
    purple: {
      name: "Purple",
      primary: "#7C3AED",
      secondary: "#A855F7",
      background: "#FAF7FF",
      panel: "#FFFFFF",
      text: "#1F1235"
    },
    red: {
      name: "Red",
      primary: "#DC2626",
      secondary: "#F97316",
      background: "#FFF8F8",
      panel: "#FFFFFF",
      text: "#2B0B0B"
    },
    amber: {
      name: "Amber",
      primary: "#D97706",
      secondary: "#F59E0B",
      background: "#FFFCF5",
      panel: "#FFFFFF",
      text: "#291A05"
    },
    ocean: {
      name: "Ocean",
      primary: "#0891B2",
      secondary: "#06B6D4",
      background: "#F3FCFF",
      panel: "#FFFFFF",
      text: "#062A35"
    },
    monochrome: {
      name: "Monochrome",
      primary: "#111827",
      secondary: "#6B7280",
      background: "#F9FAFB",
      panel: "#FFFFFF",
      text: "#111827"
    }
  };

  function currentLang() {
    return localStorage.getItem("csn-lab-language") || "es";
  }

  function currentTheme() {
    return localStorage.getItem("csn-lab-theme") || "csnBlue";
  }

  function applyTheme(name) {
    const t = THEMES[name] || THEMES.csnBlue;
    const r = document.documentElement;

    r.style.setProperty("--csn-primary", t.primary);
    r.style.setProperty("--csn-secondary", t.secondary);
    r.style.setProperty("--csn-background", t.background);
    r.style.setProperty("--csn-panel", t.panel);
    r.style.setProperty("--csn-text", t.text);

    localStorage.setItem("csn-lab-theme", name);

    const lab = document.getElementById("t-lab");
    if (lab) {
      lab.style.setProperty("--lab-primary", t.primary);
      lab.style.setProperty("--lab-secondary", t.secondary);
      lab.style.setProperty("--lab-bg", t.background);
      lab.style.setProperty("--lab-panel", t.panel);
      lab.style.setProperty("--lab-text", t.text);
    }
  }

  function translate() {
    const l = LANGS[currentLang()];
    document.documentElement.lang = currentLang();

    document.querySelectorAll("[data-csn-lab-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-csn-lab-i18n");
      if (l[key]) el.textContent = l[key];
    });

    const command = document.getElementById("lab-command");
    if (command) command.placeholder = l.help;

    const output = document.getElementById("lab-output");
    if (output && !output.dataset.userTouched) {
      output.textContent =
        "CHRONO LAB [" + l.lab + "]\n" +
        l.help + "\n$ ";
    }
  }

  function createToolbar() {
    const wrap = document.querySelector("#t-lab .lab-wrap");
    if (!wrap || document.getElementById("csn-lab-toolbar")) return;

    const toolbar = document.createElement("div");
    toolbar.id = "csn-lab-toolbar";

    toolbar.innerHTML = `
      <div class="csn-lab-brand">
        <div>
          <div class="csn-lab-brand-title">⚡ CHRONO LAB</div>
          <div class="csn-lab-brand-sub">Chrono Shield Networks</div>
        </div>
        <span class="csn-lab-version">Educational Lab</span>
      </div>

      <div class="csn-lab-controls">
        <label>
          <span data-csn-lab-i18n="language">Idioma</span>
          <select id="csn-lab-language">
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
            <option value="et">Eesti</option>
          </select>
        </label>

        <label>
          <span data-csn-lab-i18n="theme">Tema visual</span>
          <select id="csn-lab-theme">
            <option value="csnBlue">CSN Blue</option>
            <option value="midnight">Midnight</option>
            <option value="cyberGreen">Cyber Green</option>
            <option value="purple">Purple</option>
            <option value="red">Red</option>
            <option value="amber">Amber</option>
            <option value="ocean">Ocean</option>
            <option value="monochrome">Monochrome</option>
          </select>
        </label>
      </div>
    `;

    wrap.prepend(toolbar);

    const lang = document.getElementById("csn-lab-language");
    const theme = document.getElementById("csn-lab-theme");

    lang.value = currentLang();
    theme.value = currentTheme();

    lang.addEventListener("change", function () {
      localStorage.setItem("csn-lab-language", this.value);
      translate();
    });

    theme.addEventListener("change", function () {
      applyTheme(this.value);
    });
  }

  function markExistingUI() {
    const map = [
      [".lab-title", "lab"],
      [".lab-sub", "subtitle"],
      ".lab-card strong",
      ".lab-warning",
      "#lab-terminal h3",
      "#lab-python h3",
      "#lab-javascript h3",
      "#lab-network h3",
      "#lab-security h3"
    ];

    document.querySelector(".lab-title")?.setAttribute("data-csn-lab-i18n", "lab");
    document.querySelector(".lab-sub")?.setAttribute("data-csn-lab-i18n", "subtitle");

    const cards = document.querySelectorAll("#t-lab .lab-card");
    if (cards[0]) {
      const strong = cards[0].querySelector("strong");
      const p = cards[0].querySelector(".lab-sub");
      const warning = cards[0].querySelector(".lab-warning");

      if (strong) {
        strong.setAttribute("data-csn-lab-i18n", "center");
      }

      if (p) {
        p.setAttribute("data-csn-lab-i18n", "description");
      }

      if (warning) {
        warning.setAttribute("data-csn-lab-i18n", "simulated");
      }
    }

    const headings = [
      ["#lab-terminal h3", "terminal"],
      ["#lab-python h3", "python"],
      ["#lab-javascript h3", "javascript"],
      ["#lab-network h3", "networking"],
      ["#lab-security h3", "cybersecurity"]
    ];

    headings.forEach(function (pair) {
      const el = document.querySelector(pair[0]);
      if (el) el.setAttribute("data-csn-lab-i18n", pair[1]);
    });
  }

  function createSystems() {
    const wrap = document.querySelector("#t-lab .lab-wrap");
    if (!wrap || document.getElementById("csn-lab-systems")) return;

    const box = document.createElement("section");
    box.id = "csn-lab-systems";

    box.innerHTML = `
      <div class="csn-lab-section-head">
        <div>
          <h3 data-csn-lab-i18n="systems">Sistemas</h3>
          <p data-csn-lab-i18n="chooseSystem">Selecciona un sistema para explorar sus comandos.</p>
        </div>
      </div>
      <div id="csn-lab-system-grid"></div>
      <div id="csn-lab-system-info"></div>
    `;

    const toolbar = document.getElementById("csn-lab-toolbar");
    if (toolbar) {
      toolbar.after(box);
    } else {
      wrap.prepend(box);
    }

    const grid = document.getElementById("csn-lab-system-grid");
    const systems = window.CHRONO_LAB && window.CHRONO_LAB.systems
      ? Object.values(window.CHRONO_LAB.systems)
      : [];

    systems.forEach(function (system) {
      const button = document.createElement("button");
      button.className = "csn-lab-system-card";
      button.innerHTML = `
        <strong>${system.name}</strong>
        <small>${system.category}</small>
        <span>${system.commands.length} comandos educativos</span>
      `;

      button.addEventListener("click", function () {
        localStorage.setItem("csn-lab-system", system.name);

        document.querySelectorAll(".csn-lab-system-card").forEach(function (b) {
          b.classList.remove("selected");
        });

        button.classList.add("selected");

        const info = document.getElementById("csn-lab-system-info");

        info.innerHTML = `
          <div class="csn-lab-selected">
            <div class="csn-lab-selected-title">
              <strong>${system.name}</strong>
              <span>${system.category}</span>
            </div>
            <code>${system.prompt}</code>
            <div class="csn-lab-command-cloud">
              ${system.commands.map(function (cmd) {
                return `<span>${cmd}</span>`;
              }).join("")}
            </div>
          </div>
        `;
      });

      grid.appendChild(button);
    });

    const saved = localStorage.getItem("csn-lab-system");

    if (saved) {
      const buttons = Array.from(grid.children);
      const found = buttons.find(function (b) {
        return b.querySelector("strong")?.textContent === saved;
      });
      if (found) found.click();
    }
  }

  function createTopics() {
    const wrap = document.querySelector("#t-lab .lab-wrap");
    if (!wrap || document.getElementById("csn-lab-topics")) return;

    const box = document.createElement("section");
    box.id = "csn-lab-topics";

    box.innerHTML = `
      <div class="csn-lab-section-head">
        <div>
          <h3 data-csn-lab-i18n="topics">Áreas de aprendizaje</h3>
        </div>
      </div>

      <div class="csn-lab-topic-grid">
        <button onclick="labShow('network', document.querySelector('#t-lab .lab-menu button:nth-child(4)'))">
          <b>🌐 Redes</b>
          <span>IPv4 · IPv6 · DNS · DHCP · VLAN · VPN · Routing</span>
        </button>

        <button onclick="labShow('security', document.querySelector('#t-lab .lab-menu button:nth-child(5)'))">
          <b>🛡️ Ciberseguridad</b>
          <span>SOC · IOC · SIEM · hardening · phishing · respuesta a incidentes</span>
        </button>

        <button onclick="csnLabShowTelecom()">
          <b>📡 Telecomunicaciones</b>
          <span>4G · LTE · 5G · RAN · LoRa · LoRaWAN · Edge</span>
        </button>

        <button onclick="csnLabShowChrono()">
          <b>⚡ Chrono Systems</b>
          <span>ChronoOS · ChronoNet · Chrono Edge · Sentinel IA · GIS</span>
        </button>
      </div>

      <div id="csn-lab-topic-result"></div>
    `;

    wrap.appendChild(box);
  }

  window.csnLabShowTelecom = function () {
    const result = document.getElementById("csn-lab-topic-result");
    if (!result) return;

    result.innerHTML = `
      <div class="csn-lab-topic-result">
        <strong>Telecommunications Lab</strong>
        <p>4G · LTE · 5G · 5G RedCap · RAN · EPC · 5GC · IMS · VoLTE · LoRa · LoRaWAN · Edge Computing</p>
      </div>
    `;
  };

  window.csnLabShowChrono = function () {
    const result = document.getElementById("csn-lab-topic-result");
    if (!result) return;

    result.innerHTML = `
      <div class="csn-lab-topic-result">
        <strong>Chrono Systems Lab</strong>
        <p>ChronoOS · ChronoNet · chronoctl · libchrono · Chrono Edge · Sentinel IA · GIS · Telemetry · Digital Twin · Offline / Air-gapped</p>
      </div>
    `;
  };

  function init() {
    createToolbar();
    markExistingUI();
    createSystems();
    createTopics();

    applyTheme(currentTheme());
    translate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    setTimeout(init, 0);
  }

  window.CSNLabFinal = {
    languages: LANGS,
    themes: THEMES,
    applyTheme: applyTheme,
    translate: translate
  };
})();
