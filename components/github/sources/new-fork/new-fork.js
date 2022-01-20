const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-fork",
  name: "New Fork (Instant)",
  description: "Emit new events on new forks",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    getEventNames() {
      return [
        "fork",
      ];
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
