const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-label",
  name: "New Label (Instant)",
  description: "Emit new events when new labels are created in a repo",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return [
        "label",
      ];
    },
    getEventTypes() {
      return [
        "created",
      ];
    },
    generateMeta(data) {
      const ts = Date.now();
      return {
        id: data.label.id,
        summary: `${data.label.name} created by ${data.sender.login}`,
        ts,
      };
    },
  },
};
