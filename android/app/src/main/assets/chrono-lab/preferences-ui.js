(function () {
  "use strict";

  window.ChronoLabPreferences = {
    language: function () {
      return localStorage.getItem("csn-lab-language") || "es";
    },

    theme: function () {
      return localStorage.getItem("csn-lab-theme") || "csnBlue";
    },

    saveLanguage: function (code) {
      localStorage.setItem("csn-lab-language", code);
      if (window.CSNLabFinal) window.CSNLabFinal.translate();
    },

    saveTheme: function (theme) {
      localStorage.setItem("csn-lab-theme", theme);
      if (window.CSNLabFinal) window.CSNLabFinal.applyTheme(theme);
    }
  };
})();
