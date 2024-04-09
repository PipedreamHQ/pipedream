import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "etsy-new-shop-receipt",
  name: "New Shop Receipt",
  description: "Emit new event when a new shop receipt is created. [See the Documentation](https://developers.etsy.com/documentation/reference#operation/getShopReceipts)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getShopReceipts;
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
        id: resource.receipt_id,
        summary: `New Shop Receipt: ${resource.receipt_id}`,
        ts: resource.created_timestamp,
      };
    },
  },
};
