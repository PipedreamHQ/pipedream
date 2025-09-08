import webhook from "../common/webhook.mjs";
import { deployHooks } from "../common/constants.mjs";

export default {
  ...webhook,
  key: "netlify-new-deploy-start",
  name: "New Deploy Start (Instant)",
  description: "Emit new event when a new deployment is started",
  type: "source",
  version: "0.1.1",
  dedupe: "unique",
  methods: {
    ...webhook.methods,
    getHookEvent() {
      return deployHooks.DEPLOY_BUILDING;
    },
    getMetaSummary() {
      return "New Deployment Started";
    },
  },
};
