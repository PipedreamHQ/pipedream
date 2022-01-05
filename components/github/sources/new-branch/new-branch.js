const common = require("../common-webhook.js");
const eventTypes = [
  "branch",
];

module.exports = {
  ...common,
  key: "github-new-branch",
  name: "New Branch (Instant)",
  description: "Emit new events when a new branch is created",
  version: "0.0.6",
  dedupe: "unique",
  type: "source",
  methods: {
    getEventNames() {
      return [
        "create",
      ];
    },
    generateMeta(data) {
      const ts = Date.now();
      return {
        id: `${data.repository.id}${ts}`,
        summary: `New Branch: ${data.ref} by ${data.sender.login}`,
        ts,
      };
    },
    emitEvent(body) {
      if (eventTypes.indexOf(body.ref_type) > -1) {
        const meta = this.generateMeta(body);
        this.$emit(body, meta);
      }
    },
  },
};
