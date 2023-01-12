import base from "../common/base.mjs";

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
    async deploy() {
      await this.listHistoricalEvents(this.regfox.listTransactions);
    },
  },
  methods: {
    ...base.methods,
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
