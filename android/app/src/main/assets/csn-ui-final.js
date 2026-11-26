(function () {
  "use strict";

  const THEMES = {
    csnBlue: {
      name: "CSN Blue",
      primary: "#2563EB",
      secondary: "#0EA5E9",
      paper: "#F5F8FC",
      ink: "#0F172A",
      line: "#DCE5F2"
    },
    ocean: {
      name: "Ocean",
      primary: "#0891B2",
      secondary: "#06B6D4",
      paper: "#F2FBFD",
      ink: "#082F3A",
      line: "#CBEAF0"
    },
    emerald: {
      name: "Emerald",
      primary: "#059669",
      secondary: "#10B981",
      paper: "#F2FBF7",
      ink: "#06281E",
      line: "#CBEADE"
    },
    violet: {
      name: "Violet",
      primary: "#7C3AED",
      secondary: "#A855F7",
      paper: "#FAF7FF",
      ink: "#24113F",
      line: "#E5D9F7"
    },
    rose: {
      name: "Rose",
      primary: "#DB2777",
      secondary: "#F43F5E",
      paper: "#FFF7FA",
      ink: "#3B0A20",
      line: "#F4D3E0"
    },
    amber: {
      name: "Amber",
      primary: "#D97706",
      secondary: "#F59E0B",
      paper: "#FFFBF2",
      ink: "#321B05",
      line: "#F1E0BB"
    },
    graphite: {
      name: "Graphite",
      primary: "#475569",
      secondary: "#64748B",
      paper: "#F5F6F8",
      ink: "#111827",
      line: "#D8DDE5"
    },
    midnight: {
      name: "Midnight",
      primary: "#6366F1",
      secondary: "#38BDF8",
      paper: "#080D18",
      ink: "#F8FAFC",
      line: "#263246"
    }
  };

  const LANG_NAMES = {
    es: "Español",
    en: "English",
    pt: "Português",
    et: "Eesti"
  };

  function applyTheme(name) {
    const t = THEMES[name] || THEMES.csnBlue;
    const root = document.documentElement;

    root.style.setProperty("--blue", t.primary);
    root.style.setProperty("--green", t.secondary);
    root.style.setProperty("--paper", t.paper);
    root.style.setProperty("--ink", t.ink);
    root.style.setProperty("--line", t.line);

    root.style.setProperty("--csn-primary", t.primary);
    root.style.setProperty("--csn-secondary", t.secondary);
    root.style.setProperty("--csn-background", t.paper);
    root.style.setProperty("--csn-panel", t.paper);
    root.style.setProperty("--csn-text", t.ink);

    document.body.classList.toggle("csn-dark", name === "midnight");

    try {
      localStorage.setItem("csn_global_theme", name);
    } catch (_) {}

    renderThemeButtons();
  }

  function currentTheme() {
    try {
      return localStorage.getItem("csn_global_theme") || "csnBlue";
    } catch (_) {
      return "csnBlue";
    }
  }

  function renderThemeButtons() {
    const grid = document.getElementById("csn-theme-grid");
    if (!grid) return;

    grid.innerHTML = "";

    Object.keys(THEMES).forEach(function (key) {
      const t = THEMES[key];
      const button = document.createElement("button");

      button.type = "button";
      button.className = "csn-theme-choice";
      button.dataset.theme = key;
      button.textContent = t.name;
      button.style.setProperty("--theme-preview", t.primary);

      if (key === currentTheme()) {
        button.classList.add("selected");
        button.setAttribute("aria-current", "true");
      }

      button.onclick = function () {
        applyTheme(key);

        const status = document.getElementById("csn-ai-status");
        if (status) {
          status.textContent = "Tema activo: " + t.name;
        }
      };

      grid.appendChild(button);
    });
  }

  function fixGear() {
    const button = document.querySelector(".csn-settings-trigger");

    if (!button) return;

    button.setAttribute("type", "button");
    button.setAttribute("aria-label", "Configuración");
    button.setAttribute("title", "Configuración");

    const svg = button.querySelector("svg");

    if (svg) {
      svg.classList.add("csn-gear-svg");
      svg.setAttribute("focusable", "false");
    }
  }

  function fixSettings() {
    const overlay = document.getElementById("sr");
    const panel = document.getElementById("sp");

    if (!overlay || !panel) return;

    if (overlay.parentNode !== document.body) {
      document.body.appendChild(overlay);
    }

    overlay.style.zIndex = "2147483000";

    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Configuración CSN IA");

    const close = panel.querySelector(".csn-settings-head .csn-action");

    if (close) {
      close.type = "button";
    }

    renderThemeButtons();
  }

  function fixDuplicateIds() {
    const bars = document.querySelectorAll("#bar");

    if (bars.length > 1) {
      for (let i = 1; i < bars.length; i++) {
        bars[i].id = "web-bar";
      }
    }
  }

  function addAccessibility() {
    const nav = document.querySelector("nav");

    if (nav) {
      nav.setAttribute("aria-label", "Navegación principal");
    }

    document.querySelectorAll("nav button").forEach(function (button) {
      button.type = "button";
    });

    document.querySelectorAll(".csn-action").forEach(function (button) {
      button.type = "button";
    });
  }

  function injectStyles() {
    if (document.getElementById("csn-ui-final-style")) return;

    const style = document.createElement("style");
    style.id = "csn-ui-final-style";

    style.textContent = `
      .csn-settings-trigger {
        width:44px!important;
        height:44px!important;
        min-width:44px!important;
        min-height:44px!important;
        display:flex!important;
        align-items:center!important;
        justify-content:center!important;
        padding:0!important;
        border-radius:50%!important;
        cursor:pointer!important;
        -webkit-tap-highlight-color:transparent!important;
      }

      .csn-settings-trigger:active {
        transform:scale(.94);
      }

      .csn-gear-svg {
        width:24px!important;
        height:24px!important;
        display:block!important;
        fill:none!important;
        stroke:currentColor!important;
        stroke-width:1.7!important;
        stroke-linecap:round!important;
        stroke-linejoin:round!important;
      }

      .csn-settings-trigger:focus-visible {
        outline:3px solid rgba(37,99,235,.28)!important;
        outline-offset:2px!important;
      }

      #web-bar {
        display:flex!important;
        gap:10px!important;
        padding:10px 12px 14px!important;
        background:#fff!important;
        border-top:0!important;
        border-bottom:1px solid var(--line)!important;
      }

      #web-bar input {
        flex:1!important;
        min-width:0!important;
        height:48px!important;
        padding:0 18px!important;
        border:1.5px solid #D9E1EE!important;
        border-radius:24px!important;
        background:var(--paper)!important;
        font-size:16px!important;
        color:var(--ink)!important;
      }

      #web-bar button {
        width:48px!important;
        height:48px!important;
        border:0!important;
        border-radius:50%!important;
        background:var(--blue)!important;
        color:#fff!important;
        font-size:20px!important;
      }

      #csn-theme-grid {
        display:grid!important;
        grid-template-columns:repeat(2,minmax(0,1fr))!important;
        gap:8px!important;
        margin-top:10px!important;
      }

      .csn-theme-choice {
        min-height:46px!important;
        border:1.5px solid var(--line)!important;
        border-radius:12px!important;
        background:var(--paper)!important;
        color:var(--ink)!important;
        font-size:14px!important;
        font-weight:700!important;
        position:relative!important;
        padding:10px 10px 10px 30px!important;
        text-align:left!important;
        cursor:pointer!important;
      }

      .csn-theme-choice::before {
        content:""!important;
        position:absolute!important;
        left:10px!important;
        top:50%!important;
        transform:translateY(-50%)!important;
        width:12px!important;
        height:12px!important;
        border-radius:50%!important;
        background:var(--theme-preview)!important;
      }

      .csn-theme-choice.selected {
        border-color:var(--theme-preview)!important;
        box-shadow:0 0 0 2px color-mix(in srgb,var(--theme-preview) 20%,transparent)!important;
      }

      nav {
        overflow-x:auto!important;
        scrollbar-width:none!important;
      }

      nav::-webkit-scrollbar {
        display:none!important;
      }

      nav button {
        flex:0 0 auto!important;
        min-width:64px!important;
        padding:0 10px!important;
      }

      #sr {
        padding:12px!important;
        overflow-y:auto!important;
        -webkit-overflow-scrolling:touch!important;
      }

      #sp {
        width:min(94vw,560px)!important;
        margin:12px auto 24px!important;
        max-height:none!important;
      }

      @media (max-width:420px) {
        #csn-theme-grid {
          grid-template-columns:1fr 1fr!important;
        }

        #sp {
          width:100%!important;
          padding:16px!important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureEstoniaButton() {
    const actions = document.querySelector(".csn-settings-section .csn-actions");

    if (!actions) return;

    if (actions.querySelector('[onclick*="csnSetLang(\'et\')"]')) {
      return;
    }

    const button = document.createElement("button");
    button.className = "csn-action";
    button.type = "button";
    button.textContent = "Eesti";
    button.onclick = function () {
      if (window.CSNGlobalUI && typeof window.CSNGlobalUI.setLanguage === "function") {
        window.CSNGlobalUI.setLanguage("et");
      } else if (typeof window.csnSetLang === "function") {
        window.csnSetLang("et");
      }
    };

    actions.appendChild(button);
  }

  function showStartupStatus() {
    const chip = document.querySelector(".chip");

    if (chip) {
      chip.title = "CSN IA · interfaz protegida";
    }
  }

  function init() {
    injectStyles();
    fixDuplicateIds();
    fixGear();
    fixSettings();
    ensureEstoniaButton();
    addAccessibility();
    showStartupStatus();

    if (window.CSNGlobalUI) {
      if (typeof window.CSNGlobalUI.applyTheme === "function") {
        window.CSNGlobalUI.applyTheme(currentTheme());
      }

      if (typeof window.CSNGlobalUI.translate === "function") {
        window.CSNGlobalUI.translate();
      }
    } else {
      applyTheme(currentTheme());
    }

    renderThemeButtons();
  }

  window.CSNUIFinal = {
    init,
    themes: THEMES,
    applyTheme,
    renderThemeButtons
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
