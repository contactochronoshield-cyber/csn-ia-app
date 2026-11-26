(function () {

  function createPanel() {

    if (document.getElementById("chrono-system-panel")) {
      return;
    }

    const panel = document.createElement("section");

    panel.id = "chrono-system-panel";

    panel.innerHTML = `
      <div class="chrono-panel">
        <div class="chrono-panel-title">
          <span>Chrono Lab</span>
          <small>Sistemas disponibles</small>
        </div>

        <div class="chrono-system-grid">

          <button data-system="Linux">
            <strong>Linux</strong>
            <small>Shell / Unix</small>
          </button>

          <button data-system="Windows">
            <strong>Windows</strong>
            <small>PowerShell</small>
          </button>

          <button data-system="FreeBSD">
            <strong>FreeBSD</strong>
            <small>Unix / BSD</small>
          </button>

          <button data-system="Termux">
            <strong>Android</strong>
            <small>Termux</small>
          </button>

          <button data-system="Cisco">
            <strong>Cisco IOS</strong>
            <small>Networking</small>
          </button>

          <button data-system="ChronoOS">
            <strong>ChronoOS</strong>
            <small>Chrono Systems</small>
          </button>

        </div>

        <div id="chrono-system-info"></div>
      </div>
    `;

    const target =
      document.querySelector(".chrono-lab-container") ||
      document.querySelector("#chrono-lab") ||
      document.body;

    target.prepend(panel);

    panel.querySelectorAll("[data-system]").forEach(function (button) {

      button.addEventListener("click", function () {

        const name = this.dataset.system;
        const system = window.ChronoLabUI.findSystem(name);

        const info = document.getElementById("chrono-system-info");

        if (!system) {
          info.textContent = "Sistema no disponible.";
          return;
        }

        info.innerHTML = `
          <div class="chrono-system-selected">
            <strong>${system.name}</strong>
            <span>${system.category}</span>
            <code>${system.prompt}</code>

            <div class="chrono-command-list">
              ${system.commands
                .slice(0, 12)
                .map(c => `<span>${c}</span>`)
                .join("")}
            </div>
          </div>
        `;

        localStorage.setItem("chrono-selected-system", name);
      });

    });

    const saved = localStorage.getItem("chrono-selected-system");

    if (saved) {

      const button =
        panel.querySelector(`[data-system="${saved}"]`);

      if (button) {
        button.click();
      }

    }

  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createPanel);
  } else {
    createPanel();
  }

})();
