import base from "../common/base.mjs";
import constants from "../../common/constants.mjs";

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
      let lastId;
      const allDeposits = [];

      while (true) {
        const response = await this.regfox.listTransactions({
          params: {
            startingAfter: lastId,
            limit: constants.MAX_LIMIT,
          },
        });

        allDeposits.push(...response.data);
        lastId = allDeposits[allDeposits.length - 1]?.id;

        if (!response.hasMore) {
          break;
        }
      }

      allDeposits
        .slice(constants.DEPLOY_LIMIT)
        .forEach((deposit) => this.emitEvent({
          event: deposit,
          id: deposit.id,
          name: deposit.orderNumber,
          ts: deposit.dateCreated,
        }));
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
