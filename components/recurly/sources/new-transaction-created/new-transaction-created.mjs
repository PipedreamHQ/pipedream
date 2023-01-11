import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "recurly-new-transaction-created",
  name: "New Transaction Created",
  description: "Emit new event when a new transaction is created. [See the docs](https://recurly.com/developers/api/v2021-02-25/index.html#operation/list_transactions).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    listTransactions(args = {}) {
      return this.app.makeRequest({
        method: "listTransactions",
        ...args,
      });
    },
    getResourcesFn() {
      return this.listTransactions;
    },
    getResourcesFnArgs() {
      const lastCreatedAt = this.getLastCreatedAt();
      if (lastCreatedAt) {
        return {
          params: {
            limit: constants.DEFAULT_LIMIT,
            beginTime: lastCreatedAt,
          },
        };
      }
      return {
        params: {
          limit: constants.DEFAULT_LIMIT,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.createdAt),
        summary: `New Transaction ID ${resource.id}`,
      };
    },
  },
};
