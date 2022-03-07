import common from "../../common.mjs";

export default {
  ...common,
  key: "netlify-new-deploy-start",
  name: "New Deploy Start (Instant)",
  description: "Emit new event when a new deployment is started",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookEvent() {
      return "deploy_building";
    },
    getMetaSummary(data) {
      const { commit_ref: commitRef } = data;
      return `Deploy started for commit ${commitRef}`;
    },
  },
};
