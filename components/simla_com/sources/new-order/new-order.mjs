import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "simla_com-new-order",
  name: "New Order",
  description: "Emit new event when an order is created. [See the documentation](https://docs.simla.com/Developers/API/APIVersions/APIv5#get--api-v5-orders).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "createdAt";
    },
    getResourceName() {
      return "orders";
    },
    getResourcesFn() {
      return this.app.listOrders;
    },
    getResourcesFnArgs() {
      return {
        params: {
          limit: constants.DEFAULT_LIMIT,
          filter: {
            createdAtFrom: this.getLastDateAt(),
          },
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Order: ${resource.id}`,
        ts: Date.parse(resource.createdAt),
      };
    },
  },
};
