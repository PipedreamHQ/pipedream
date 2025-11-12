import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "booqable-new-customer",
  name: "New Customer",
  description: "Emits a new event anytime there is a new customer. [See the documentation](https://developers.booqable.com/#list-all-customers)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "customers";
    },
    getResourceFn() {
      return this.app.listCustomers;
    },
    getResourceFnArgs() {
      return {
        params: {
          per: constants.DEFAULT_LIMIT,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Customer: ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
