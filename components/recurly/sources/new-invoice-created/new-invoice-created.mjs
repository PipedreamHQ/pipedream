import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "recurly-new-invoice-created",
  name: "New Invoice Created",
  description: "Emit new event when a new invoice is created. [See the docs](https://recurly.com/developers/api/v2021-02-25/index.html#operation/list_invoices).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    listInvoices(args = {}) {
      return this.app.makeRequest({
        method: "listInvoices",
        ...args,
      });
    },
    getResourcesFn() {
      return this.listInvoices;
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
        summary: `New Invoice ID ${resource.id}`,
      };
    },
  },
};
