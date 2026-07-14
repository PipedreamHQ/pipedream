import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "donately-new-subscription-failure",
  name: "New Subscription Failure (Instant)",
  description: "Emit new event when a subscription fails. [See the documentation](https://developer.donate.ly/api/#webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "account.subscription.recur.failure";
    },
  },
  sampleEmit,
};
