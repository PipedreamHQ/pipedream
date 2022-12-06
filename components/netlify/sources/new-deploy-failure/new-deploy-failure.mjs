import webhook from "../common/webhook.mjs";
import { deployHooks } from "../common/constants.mjs";

export default {
  ...webhook,
  key: "netlify-new-deploy-failure",
  name: "New Deploy Failure (Instant)",
  description: "Emit new event when a new deployment fails",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...webhook.methods,
    getHookEvent() {
      return deployHooks.DEPLOY_FAILED;
    },
    getMetaSummary(data) {
      const { commit_ref: commitRef } = data;
      return `Deploy failed for commit ${commitRef}`;
    },
  },
};
