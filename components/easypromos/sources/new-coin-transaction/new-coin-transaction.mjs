import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "easypromos-new-coin-transaction",
  name: "New Coin Transaction",
  description: "Emit new event when a user earns or spends coins.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    info2: {
      type: "alert",
      alertType: "warning",
      content: "You can only use this trigger with promotions that have the 'Virtual Coins' feature enabled.",
    },
  },
  methods: {
    ...common.methods,
    getFunction() {
      return this.easypromos.getCoinTransactions;
    },
    getOpts() {
      return {
        promotionId: this.promotionId,
      };
    },
    getSummary({
      transaction, user,
    }) {
      return `Coin transaction: ${transaction.amount} for user ${user.email}`;
    },
  },
  sampleEmit,
};
