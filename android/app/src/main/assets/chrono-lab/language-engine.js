(function () {

  const LANGUAGES = {

    es: {
      name: "Español",
      code: "es",
      title: "Chrono Lab",
      terminal: "Terminal",
      systems: "Sistemas",
      networks: "Redes",
      security: "Ciberseguridad",
      telecom: "Telecomunicaciones"
    },

    en: {
      name: "English",
      code: "en",
      title: "Chrono Lab",
      terminal: "Terminal",
      systems: "Systems",
      networks: "Networking",
      security: "Cybersecurity",
      telecom: "Telecommunications"
    },

    pt: {
      name: "Português",
      code: "pt",
      title: "Chrono Lab",
      terminal: "Terminal",
      systems: "Sistemas",
      networks: "Redes",
      security: "Cibersegurança",
      telecom: "Telecomunicações"
    }

  };

  window.ChronoLanguage = {

    list: function () {
      return Object.values(LANGUAGES);
    },

    current: function () {
      return localStorage.getItem("chrono-language") || "es";
    },

    set: function (code) {

      if (!LANGUAGES[code]) {
        return;
      }

      localStorage.setItem("chrono-language", code);

      document.documentElement.lang = code;

      document.dispatchEvent(
        new CustomEvent("chrono-language-changed", {
          detail: LANGUAGES[code]
        })
      );

      this.update();
    },

    update: function () {

      const lang = LANGUAGES[this.current()];

      if (!lang) return;

      document.querySelectorAll("[data-i18n]").forEach(function (el) {

        const key = el.dataset.i18n;

        if (lang[key]) {
          el.textContent = lang[key];
        }

      });

    }

  };

})();
