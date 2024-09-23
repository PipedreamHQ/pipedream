import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "simla_com-new-customer",
  name: "New Customer",
  description: "Emit new event when a new customer is created. [See the documentation](https://docs.simla.com/Developers/API/APIVersions/APIv5#get--api-v5-customers).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "createdAt";
    },
    getResourceName() {
      return "customers";
    },
    getResourcesFn() {
      return this.app.listCustomers;
    },
    getResourcesFnArgs() {
      return {
        params: {
          limit: constants.DEFAULT_LIMIT,
          filter: {
            dateFrom: this.getLastDateAt(),
          },
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Customer: ${resource.id}`,
        ts: Date.parse(resource.createdAt),
      };
    },
  },
};
