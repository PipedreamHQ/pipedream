import common from "../common/common.mjs";
import { deployHooks } from "../common/constants.mjs";

export default {
  ...common,
  key: "netlify-new-deploy-failure",
  name: "New Deploy Failure (Instant)",
  description: "Emit new event when a new deployment fails",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookEvent() {
      return deployHooks.DEPLOY_FAILED;
    },
    getMetaSummary(data) {
      const { commit_ref: commitRef } = data;
      return `Deploy failed for commit ${commitRef}`;
    },
  },
  run: common.methods.run,
};
