const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-push",
  name: "New Push",
  description: "Emit new events on each new push to a repo",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return [
        "push",
      ];
    },
    generateMeta(data) {
      const ts = Date.now();
      return {
        id: `${data.repository.id}${ts}`,
        summary: `New Push by ${data.sender.login}`,
        ts,
      };
    },
    emitEvent(body) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    },
  },
};
