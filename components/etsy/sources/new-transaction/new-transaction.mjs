import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "etsy-new-transaction",
  name: "New Transaction",
  description: "Emit new event when a new transaction is created. [See the Documentation](https://developers.etsy.com/documentation/reference#operation/getShopReceiptTransactionsByShop)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getShopReceiptTransactionsByShop;
    },
    getResourceFnArgs(shopId) {
      return {
        shopId,
        params: {
          limit: constants.DEFAULT_LIMIT,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.transaction_id,
        summary: `New Transaction: ${resource.title}`,
        ts: resource.created_timestamp,
      };
    },
  },
};
