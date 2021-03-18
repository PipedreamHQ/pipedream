const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-fork",
  name: "New Fork (Instant)",
  description: "Emit an event when a new fork is created",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    getEventNames() {
      return ["fork"];
    },
    generateMeta(data) {
      const ts = new Date(data.forkee.created_at).getTime();
      return {
        id: data.forkee.id,
        summary: `New Fork: ${data.repository.name} by ${data.sender.login}`,
        ts,
      };
    },
    emitEvent(body) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    },
  },
};