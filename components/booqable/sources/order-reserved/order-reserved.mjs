import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "booqable-order-reserved",
  name: "Order Reserved",
  description: "Emits an event when an order changes status to reserved in Booqable. [See the documentation](https://developers.booqable.com/#list-all-orders)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isResourceRelevant(resource) {
      return resource?.status === "reserved";
    },
    getResourceName() {
      return "orders";
    },
    getResourceFn() {
      return this.app.listOrders;
    },
    getResourceFnArgs() {
      return {
        params: {
          per: constants.DEFAULT_LIMIT,
        },
      };
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Order ${resource.number} was reserved`,
        ts,
      };
    },
  },
};
