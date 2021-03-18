const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-release",
  name: "New Release (Instant)",
  description: "Emit an event when a new release is published.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return ["release"];
    },
    getEventTypes() {
      return ["published"];
    },
    generateMeta(data) {
      const ts = new Date(data.release.published_at).getTime();
      return {
        id: data.release.id,
        summary: `${data.release.name} published by ${data.sender.login}`,
        ts,
      };
    },
  },
};