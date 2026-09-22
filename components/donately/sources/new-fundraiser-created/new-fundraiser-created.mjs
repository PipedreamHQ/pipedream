import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "donately-new-fundraiser-created",
  name: "New Fundraiser Created (Instant)",
  description: "Emit new event when a new fundraiser is created. [See the documentation](https://developer.donate.ly/api/#webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "account.fundraiser.create.success";
    },
  },
  sampleEmit,
};
