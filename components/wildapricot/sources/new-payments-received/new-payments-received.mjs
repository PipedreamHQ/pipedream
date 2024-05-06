import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "wildapricot-new-payments-received",
  name: "New Payments Received",
  description: "Emit new event each time a new payment is received in WildApricot",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(payment) {
      return {
        id: payment.Id,
        summary: `New Payment Recieved ${payment.Id}`,
        ts: Date.parse(payment.CreatedDate),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    const limit = constants.DEFAULT_LIMIT;
    const params = {
      "$top": limit,
      "$skip": 0,
    };
    let total;
    do {
      const { Payments: payments } = await this.wildapricot.listPayments({
        accountId: this.accountId,
        params,
      });
      for (const payment of payments) {
        const ts = Date.parse(payment.CreatedDate);
        if (ts >= lastTs) {
          maxTs = Math.max(ts, maxTs);
          const meta = this.generateMeta(payment);
          this.$emit(payment, meta);
        }
      }
      params["$skip"] += limit;
      total = payments?.length;
    } while (total === limit);
    this._setLastTs(maxTs);
  },
  sampleEmit,
};
