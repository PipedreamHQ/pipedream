import common from "../common/common.mjs";
import { deployHooks } from "../common/constants.mjs";

export default {
  ...common,
  key: "netlify-new-deploy-start",
  name: "New Deploy Start (Instant)",
  description: "Emit new event when a new deployment is started",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookEvent() {
      return deployHooks.DEPLOY_BUILDING;
    },
    getMetaSummary(data) {
      const { commit_ref: commitRef } = data;
      return `Deploy started for commit ${commitRef}`;
    },
  },
  run: common.methods.run,
};
