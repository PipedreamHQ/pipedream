import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "simla_com-updated-customer",
  name: "Updated Customer",
  description: "Emit new event when a customer is updated. [See the documentation](https://docs.simla.com/Developers/API/APIVersions/APIv5#get--api-v5-customers).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isDescendingOrder() {
      return false;
    },
    getDateField() {
      return "createdAt";
    },
    getResourceName() {
      return "history";
    },
    getResourcesFn() {
      return this.app.listCustomerChangeHistory;
    },
    getResourcesFnArgs() {
      return {
        params: {
          limit: constants.DEFAULT_LIMIT,
          filter: {
            startDate: this.getLastDateAt(),
          },
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `Updated Customer: ${resource.customer?.id}`,
        ts: Date.parse(resource.createdAt),
      };
    },
  },
};
