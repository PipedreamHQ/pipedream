import base from "../common/base.mjs";
// import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "regfox-deposit-completed",
  name: "New Deposit Completed",
  description: "Emit new event when a subscription or deposit has been completed. [See docs here.](https://docs.webconnex.io/api/v2/#subscription-reoccurring-notification)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {},
  },
  methods: {
    ...base.methods,
    eventTypes() {
      return [
        "subscription",
      ];
    },
    processEvent(event) {
      console.log("Emitting deposit completed event...");
      this.$emit(event, {
        id: event.eventId,
        summary: `New form published: ${event.data.orderNumber}`,
        ts: new Date(event.data.subscription.dateUpdated),
      });
    },
  },
};
