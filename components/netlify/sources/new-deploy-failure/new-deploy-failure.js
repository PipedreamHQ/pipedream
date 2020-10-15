const common = require("../../common");

module.exports = {
  ...common,
  key: "netlify-new-deploy-failure",
  name: "New Deploy Failure (Instant)",
  description: "Emits an event when a new deployment fails",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookEvent() {
      return "deploy_failed";
    },
    getMetaSummary(data) {
      const { commit_ref } = data;
      return `Deploy failed for commit ${commit_ref}`;
    },
  },
};
