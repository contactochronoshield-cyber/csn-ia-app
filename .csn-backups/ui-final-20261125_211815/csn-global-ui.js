(function () {
  "use strict";

  const LANG_KEY = "csn_global_language";
  const THEME_KEY = "csn_global_theme";

  const LANG = {
    es: {
      chat: "Chat",
      red: "Mi red",
      search: "Buscar",
      guide: "Guía",
      node: "Nodo",
      pro: "Pro",
      lab: "LAB",
      protected: "Red protegida",
      settings: "Configuración",
      close: "Cerrar",
      language: "Idioma",
      profile: "Mi perfil",
      appearance: "Apariencia",
      ai: "Inteligencia artificial",
      privacy: "Privacidad y seguridad",
      location: "Ubicación y conectividad",
      business: "Clientes y empresas",
      support: "Ayuda y soporte",
      conversation: "Conversación",
      profileName: "Nombre o identificación visible",
      profileHint: "Se guarda localmente en este dispositivo.",
      saveProfile: "Guardar perfil",
      theme: "Tema visual",
      clear: "Borrar conversación",
      contact: "Contactar",
      about: "Ver",
      diagnose: "Diagnosticar",
      gps: "Probar GPS",
      ask: "Escribe tu pregunta",
      searchInternet: "Buscar en internet",
      hello: "¡Hola! Soy el asistente de Chrono Shield Networks.",
      themeLight: "Usar tema claro",
      themeDark: "Usar tema oscuro"
    },

    en: {
      chat: "Chat",
      red: "My network",
      search: "Search",
      guide: "Guide",
      node: "Node",
      pro: "Pro",
      lab: "LAB",
      protected: "Protected network",
      settings: "Settings",
      close: "Close",
      language: "Language",
      profile: "My profile",
      appearance: "Appearance",
      ai: "Artificial intelligence",
      privacy: "Privacy and security",
      location: "Location and connectivity",
      business: "Clients and companies",
      support: "Help and support",
      conversation: "Conversation",
      profileName: "Visible name or identification",
      profileHint: "Stored locally on this device.",
      saveProfile: "Save profile",
      theme: "Visual theme",
      clear: "Clear conversation",
      contact: "Contact",
      about: "View",
      diagnose: "Diagnostics",
      gps: "Test GPS",
      ask: "Type your question",
      searchInternet: "Search the internet",
      hello: "Hello! I am the Chrono Shield Networks assistant.",
      themeLight: "Use light theme",
      themeDark: "Use dark theme"
    },

    pt: {
      chat: "Chat",
      red: "Minha rede",
      search: "Pesquisar",
      guide: "Guia",
      node: "Nó",
      pro: "Pro",
      lab: "LAB",
      protected: "Rede protegida",
      settings: "Configurações",
      close: "Fechar",
      language: "Idioma",
      profile: "Meu perfil",
      appearance: "Aparência",
      ai: "Inteligência artificial",
      privacy: "Privacidade e segurança",
      location: "Localização e conectividade",
      business: "Clientes e empresas",
      support: "Ajuda e suporte",
      conversation: "Conversação",
      profileName: "Nome ou identificação visível",
      profileHint: "Salvo localmente neste dispositivo.",
      saveProfile: "Salvar perfil",
      theme: "Tema visual",
      clear: "Apagar conversa",
      contact: "Contato",
      about: "Ver",
      diagnose: "Diagnosticar",
      gps: "Testar GPS",
      ask: "Digite sua pergunta",
      searchInternet: "Pesquisar na internet",
      hello: "Olá! Sou o assistente da Chrono Shield Networks.",
      themeLight: "Usar tema claro",
      themeDark: "Usar tema escuro"
    },

    et: {
      chat: "Vestlus",
      red: "Minu võrk",
      search: "Otsi",
      guide: "Juhend",
      node: "Sõlm",
      pro: "Pro",
      lab: "LAB",
      protected: "Kaitstud võrk",
      settings: "Seaded",
      close: "Sulge",
      language: "Keel",
      profile: "Minu profiil",
      appearance: "Välimus",
      ai: "Tehisintellekt",
      privacy: "Privaatsus ja turvalisus",
      location: "Asukoht ja ühenduvus",
      business: "Kliendid ja ettevõtted",
      support: "Abi ja tugi",
      conversation: "Vestlus",
      profileName: "Nähtav nimi või identifikaator",
      profileHint: "Salvestatakse sellesse seadmesse.",
      saveProfile: "Salvesta profiil",
      theme: "Visuaalne teema",
      clear: "Kustuta vestlus",
      contact: "Kontakt",
      about: "Vaata",
      diagnose: "Diagnostika",
      gps: "Testi GPS-i",
      ask: "Kirjuta oma küsimus",
      searchInternet: "Otsi internetist",
      hello: "Tere! Olen Chrono Shield Networksi assistent.",
      themeLight: "Kasuta heledat teemat",
      themeDark: "Kasuta tumedat teemat"
    }
  };

  const THEMES = {
    csnBlue: {
      primary: "#2563EB",
      secondary: "#0EA5E9",
      paper: "#F5F8FC",
      ink: "#0F172A",
      line: "#DCE5F2"
    },

    ocean: {
      primary: "#0891B2",
      secondary: "#06B6D4",
      paper: "#F2FBFD",
      ink: "#082F3A",
      line: "#CBEAF0"
    },

    emerald: {
      primary: "#059669",
      secondary: "#10B981",
      paper: "#F2FBF7",
      ink: "#06281E",
      line: "#CBEADE"
    },

    violet: {
      primary: "#7C3AED",
      secondary: "#A855F7",
      paper: "#FAF7FF",
      ink: "#24113F",
      line: "#E5D9F7"
    },

    rose: {
      primary: "#DB2777",
      secondary: "#F43F5E",
      paper: "#FFF7FA",
      ink: "#3B0A20",
      line: "#F4D3E0"
    },

    amber: {
      primary: "#D97706",
      secondary: "#F59E0B",
      paper: "#FFFBF2",
      ink: "#321B05",
      line: "#F1E0BB"
    },

    graphite: {
      primary: "#475569",
      secondary: "#64748B",
      paper: "#F5F6F8",
      ink: "#111827",
      line: "#D8DDE5"
    },

    midnight: {
      primary: "#6366F1",
      secondary: "#38BDF8",
      paper: "#080D18",
      ink: "#F8FAFC",
      line: "#263246"
    }
  };

  function getLang() {
    return localStorage.getItem(LANG_KEY) || "es";
  }

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || "csnBlue";
  }

  function applyTheme(name) {
    const t = THEMES[name] || THEMES.csnBlue;
    const r = document.documentElement;

    r.style.setProperty("--blue", t.primary);
    r.style.setProperty("--green", t.secondary);
    r.style.setProperty("--paper", t.paper);
    r.style.setProperty("--ink", t.ink);
    r.style.setProperty("--line", t.line);
    r.style.setProperty("--csn-primary", t.primary);
    r.style.setProperty("--csn-secondary", t.secondary);
    r.style.setProperty("--csn-background", t.paper);
    r.style.setProperty("--csn-panel", t.paper);
    r.style.setProperty("--csn-text", t.ink);

    localStorage.setItem(THEME_KEY, name);

    document.body.classList.toggle("csn-dark", name === "midnight");
  }

  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function translate() {
    const l = LANG[getLang()] || LANG.es;

    document.documentElement.lang = getLang();

    setText("#n-chat", l.chat);
    setText("#n-red", l.red);
    setText("#n-web", l.search);
    setText("#n-guide", l.guide);
    setText("#n-nodo", l.node);
    setText("#n-pro", l.pro);
    setText("#n-lab", l.lab);

    const chip = document.querySelector(".chip");
    if (chip) {
      const i = chip.querySelector("i");
      chip.textContent = "";
      if (i) chip.appendChild(i);
      chip.appendChild(document.createTextNode(l.protected));
    }

    const q = document.getElementById("q");
    if (q) q.placeholder = l.ask;

    const wq = document.getElementById("wq");
    if (wq) wq.placeholder = l.searchInternet;

    const settings = document.querySelector("#sp");
    if (settings) {
      const h = settings.querySelector(".csn-settings-head h1");
      if (h) h.textContent = l.settings;

      const close = settings.querySelector(".csn-settings-head .csn-action");
      if (close) close.textContent = l.close;

      const sections = settings.querySelectorAll(".csn-settings-section h3");

      if (sections[0]) sections[0].textContent = l.language;
      if (sections[1]) sections[1].textContent = l.profile;
      if (sections[2]) sections[2].textContent = l.appearance;
      if (sections[3]) sections[3].textContent = l.ai;
      if (sections[4]) sections[4].textContent = l.privacy;
      if (sections[5]) sections[5].textContent = l.location;
      if (sections[6]) sections[6].textContent = l.business;
      if (sections[7]) sections[7].textContent = l.support;
      if (sections[8]) sections[8].textContent = l.conversation;

      const name = document.getElementById("csn-profile-name");
      if (name) name.placeholder = l.profileName;

      const save = settings.querySelector("#csn-profile-name + .csn-actions .csn-primary");
      if (save) save.textContent = l.saveProfile;

      const theme = document.getElementById("csn-theme-button");
      if (theme) {
        theme.textContent =
          getTheme() === "midnight" ? l.themeLight : l.themeDark;
      }
    }

    const hello = document.querySelector("#msgs .bot");
    if (hello && hello.textContent.indexOf("Chrono Shield Networks") >= 0) {
      hello.textContent = l.hello;
    }

    localStorage.setItem(LANG_KEY, getLang());

    if (window.CSNLabFinal && typeof window.CSNLabFinal.translate === "function") {
      window.CSNLabFinal.translate();
    }
  }

  window.CSNGlobalUI = {
    languages: LANG,
    themes: THEMES,
    getLang,
    getTheme,
    setLanguage: function (lang) {
      if (!LANG[lang]) return;
      localStorage.setItem(LANG_KEY, lang);
      translate();
    },
    setTheme: applyTheme,
    translate,
    applyTheme
  };

  window.csnSetLang = function (lang) {
    window.CSNGlobalUI.setLanguage(lang);
    const status = document.getElementById("csn-lang-status");
    if (status) {
      const names = {
        es: "Idioma: Español",
        en: "Language: English",
        pt: "Idioma: Português",
        et: "Keel: Eesti"
      };
      status.textContent = names[lang] || names.es;
    }
  };

  window.csnToggleTheme = function () {
    const current = getTheme();
    applyTheme(current === "midnight" ? "csnBlue" : "midnight");
    translate();
  };

  function init() {
    applyTheme(getTheme());
    translate();

    const saved = getLang();
    const status = document.getElementById("csn-lang-status");
    if (status) {
      status.textContent = {
        es: "Idioma: Español",
        en: "Language: English",
        pt: "Idioma: Português",
        et: "Keel: Eesti"
      }[saved];
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    setTimeout(init, 0);
  }
})();
