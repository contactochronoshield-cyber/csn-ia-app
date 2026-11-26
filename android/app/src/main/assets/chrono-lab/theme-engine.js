(function () {

  const THEMES = {
    csnBlue: {
      name: "CSN Blue",
      primary: "#2563EB",
      secondary: "#0EA5E9",
      background: "#F5F8FC"
    },

    midnight: {
      name: "Midnight",
      primary: "#6366F1",
      secondary: "#8B5CF6",
      background: "#0B1020"
    },

    cyberGreen: {
      name: "Cyber Green",
      primary: "#16A34A",
      secondary: "#22C55E",
      background: "#07120B"
    },

    purple: {
      name: "Purple",
      primary: "#7C3AED",
      secondary: "#A855F7",
      background: "#FAF7FF"
    },

    red: {
      name: "Red",
      primary: "#DC2626",
      secondary: "#F97316",
      background: "#FFF8F8"
    },

    amber: {
      name: "Amber",
      primary: "#D97706",
      secondary: "#F59E0B",
      background: "#FFFCF5"
    },

    ocean: {
      name: "Ocean",
      primary: "#0891B2",
      secondary: "#06B6D4",
      background: "#F3FCFF"
    },

    monochrome: {
      name: "Monochrome",
      primary: "#111827",
      secondary: "#6B7280",
      background: "#F9FAFB"
    }
  };

  function applyTheme(name) {

    const theme = THEMES[name] || THEMES.csnBlue;

    const root = document.documentElement;

    root.style.setProperty("--csn-primary", theme.primary);
    root.style.setProperty("--csn-secondary", theme.secondary);
    root.style.setProperty("--csn-background", theme.background);

    localStorage.setItem("csn-theme", name);

    document.dispatchEvent(
      new CustomEvent("csn-theme-changed", {
        detail: theme
      })
    );
  }

  window.CSNThemes = {

    list: function () {
      return Object.keys(THEMES).map(function (key) {
        return {
          id: key,
          name: THEMES[key].name
        };
      });
    },

    apply: applyTheme,

    current: function () {
      return localStorage.getItem("csn-theme") || "csnBlue";
    },

    restore: function () {
      applyTheme(this.current());
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      CSNThemes.restore();
    });
  } else {
    CSNThemes.restore();
  }

})();
