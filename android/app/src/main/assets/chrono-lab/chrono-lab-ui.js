(function () {

  function getSystems() {
    return Object.values(window.CHRONO_LAB.systems);
  }

  window.ChronoLabUI = {

    systemSelector: function () {

      return getSystems().map(function (s) {

        return {
          id: s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: s.name,
          category: s.category,
          prompt: s.prompt
        };

      });

    },

    help: function () {
      return window.CHRONO_LAB_HELP();
    },

    findSystem: function (name) {

      var key = String(name || "").toLowerCase();

      return getSystems().find(function (s) {

        return (
          s.name.toLowerCase() === key ||
          s.name.toLowerCase().includes(key)
        );

      }) || null;
    },

    commands: function (name) {

      var system = this.findSystem(name);

      return system ? system.commands : [];

    },

    labs: function () {

      return window.CHRONO_LAB.labs;

    }

  };

})();
