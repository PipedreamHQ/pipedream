import common from "../../common.mjs";

export default {
  ...common,
  key: "netlify-new-deploy-success",
  name: "New Deploy Success (Instant)",
  description: "Emit new event when a new deployment is completed",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookEvent() {
      return "deploy_created";
    },
    getMetaSummary(data) {
      const { commit_ref: commitRef } = data;
      return `Deploy succeeded for commit ${commitRef}`;
    },
  },
};
