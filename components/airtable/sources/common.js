const airtable = require("../airtable.app");

module.exports = {
  props: {
    airtable,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  hooks: {
    activate() {
      const startTimestamp = new Date().toISOString();
      this.db.set("lastTimestamp", startTimestamp);
    },
    deactivate() {
      this.db.set("lastTimestamp", null);
    },
  },
};
