const common = require("./common");

module.exports = {
  ...common,
  name: "New Deploy Success (Instant)",
  description: "Emits an event when a new deployment is completed",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookEvent() {
      return "deploy_created";
    },
    getMetaSummary(data) {
      const { commit_ref } = data;
      return `Deploy succeeded for commit ${commit_ref}`;
    },
  },
};
