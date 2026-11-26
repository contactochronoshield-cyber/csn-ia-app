(function () {

  function createPreferences() {

    if (document.getElementById("chrono-preferences")) {
      return;
    }

    const box = document.createElement("div");

    box.id = "chrono-preferences";

    box.innerHTML = `
      <button id="chrono-preferences-button"
              type="button"
              aria-label="Preferencias">
        ⚙
      </button>

      <div id="chrono-preferences-panel">

        <h3>Chrono Lab</h3>

        <label>
          Idioma
          <select id="chrono-language">
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </label>

        <label>
          Tema
          <select id="chrono-theme">
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

    document.body.appendChild(box);

    const button =
      document.getElementById("chrono-preferences-button");

    const panel =
      document.getElementById("chrono-preferences-panel");

    button.addEventListener("click", function () {
      panel.classList.toggle("open");
    });

    const language =
      document.getElementById("chrono-language");

    language.value = ChronoLanguage.current();

    language.addEventListener("change", function () {
      ChronoLanguage.set(this.value);
    });

    const theme =
      document.getElementById("chrono-theme");

    theme.value = CSNThemes.current();

    theme.addEventListener("change", function () {
      CSNThemes.apply(this.value);
    });

  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createPreferences);
  } else {
    createPreferences();
  }

})();
