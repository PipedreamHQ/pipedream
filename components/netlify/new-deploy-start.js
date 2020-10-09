const common = require("./common");

module.exports = {
  ...common,
  name: "New Deploy Start (Instant)",
  description: "Emits an event when a new deployment is started",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookEvent() {
      return "deploy_building";
    },
    getMetaSummary(data) {
      const { commit_ref } = data;
      return `Deploy started for commit ${commit_ref}`;
    },
  },
};
