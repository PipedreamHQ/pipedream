import base from "../common/base.mjs";

export default {
  ...base,
  key: "regfox-deposit-completed-instant",
  name: "New Deposit Completed (Instant)",
  description: "Emit new event when a subscription or deposit has been completed. [See docs here.](https://docs.webconnex.io/api/v2/#subscription-reoccurring-notification)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    listingFunction() {
      return this.regfox.listTransactions;
    },
    eventTypes() {
      return [
        "subscription",
      ];
    },
    emitEvent({
      event, id, name, ts,
    }) {
      console.log("Emitting deposit completed event...");
      this.$emit(event, {
        id,
        summary: `New form published: ${name}`,
        ts: new Date(ts),
      });
    },
    processEvent(event) {
      this.emitEvent({
        event,
        id: event.eventId,
        name: event.data.orderNumber,
        ts: event.data.subscription.dateUpdated,
      });
    },
  },
};
