import common from "../../common.mjs";

export default {
  ...common,
  key: "netlify-new-deploy-failure",
  name: "New Deploy Failure (Instant)",
  description: "Emit new event when a new deployment fails",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookEvent() {
      return "deploy_failed";
    },
    getMetaSummary(data) {
      const { commit_ref: commitRef } = data;
      return `Deploy failed for commit ${commitRef}`;
    },
  },
  run: common.methods.run,
};
