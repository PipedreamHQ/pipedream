import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "donately-new-donation-created",
  name: "New Donation Created (Instant)",
  description: "Emit new event when a new donation is created. [See the documentation](https://developer.donate.ly/api/#webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "account.donation.create.success";
    },
  },
  sampleEmit,
};
