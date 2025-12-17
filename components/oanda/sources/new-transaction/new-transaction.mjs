import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "oanda-new-transaction",
  name: "New Transaction",
  description: "Emit new event whenever a trade is executed in the user's account. [See the documentation](https://developer.oanda.com/rest-live-v20/transaction-ep/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    type: {
      type: "string",
      label: "Type",
      description: "Filter results by transaction type",
      options: constants.TRANSACTION_TYPES,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async processEvent(max) {
      const lastId = this._getLastId();
      const params = {
        type: this.type,
        from: lastId,
        to: lastId + constants.DEFAULT_LIMIT,
      };
      let total, results = [];

      do {
        const { transactions } = await this.oanda.listTransactions({
          isDemo: this.isDemo,
          accountId: this.accountId,
          params,
        });
        results.push(...transactions);
        total = transactions?.length;
        params.from = params.to + 1;
        params.to += constants.DEFAULT_LIMIT;
      } while (total === constants.DEFAULT_LIMIT);

      if (!results.length) {
        return;
      }

      if (max && results.length > max) {
        results = results.slice(-1 * max);
      }

      this._setLastId(+results[results.length - 1].id);

      results.forEach((item) => this.emitItem(item));
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New ${item.type} transaction`,
        ts: Date.parse(item.time),
      };
    },
  },
  sampleEmit,
};
