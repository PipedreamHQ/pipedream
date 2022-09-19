import webhook from "../common/webhook.mjs";
import { deployHooks } from "../common/constants.mjs";

export default {
  ...webhook,
  key: "netlify-new-deploy-success",
  name: "New Deploy Success (Instant)",
  description: "Emit new event when a new deployment is completed",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...webhook.methods,
    getHookEvent() {
      return deployHooks.DEPLOY_CREATED;
    },
    getMetaSummary(data) {
      const { commit_ref: commitRef } = data;
      return `Deploy succeeded for commit ${commitRef}`;
    },
  },
};
