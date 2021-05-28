const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-label",
  name: "New Label (Instant)",
  description: "Emit an event when a new label is created in a repo",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return ["label"];
    },
    getEventTypes() {
      return ["created"];
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