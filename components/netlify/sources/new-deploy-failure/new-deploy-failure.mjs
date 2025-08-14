import webhook from "../common/webhook.mjs";
import { deployHooks } from "../common/constants.mjs";

export default {
  ...webhook,
  key: "netlify-new-deploy-failure",
  name: "New Deploy Failure (Instant)",
  description: "Emit new event when a new deployment fails",
  type: "source",
  version: "0.1.1",
  dedupe: "unique",
  methods: {
    ...webhook.methods,
    getHookEvent() {
      return deployHooks.DEPLOY_FAILED;
    },
    getMetaSummary() {
      return "New Deployment Failure";
    },
  },
};
