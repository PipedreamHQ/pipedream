const todoist = require("../todoist.app.js");

module.exports = {
  props: {
    todoist,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
    db: "$.service.db",
  },
  methods: {
    generateMeta(element) {
      const {
        id: elementId,
        summary,
        date_completed: dateCompleted,
      } = element;
      const ts = new Date(dateCompleted).getTime();
      const id = `${elementId}-${ts}`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
};