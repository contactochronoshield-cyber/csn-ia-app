(function () {
  "use strict";

  window.ChronoLabSystemSelector = {
    systems: function () {
      if (!window.CHRONO_LAB || !window.CHRONO_LAB.systems) return [];
      return Object.values(window.CHRONO_LAB.systems);
    },

    selected: function () {
      return localStorage.getItem("csn-lab-system") || "";
    },

    select: function (name) {
      localStorage.setItem("csn-lab-system", name);
      document.dispatchEvent(
        new CustomEvent("chrono-system-changed", {
          detail: name
        })
      );
    }
  };
})();
