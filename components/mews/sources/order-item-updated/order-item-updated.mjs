import base from "../common/polling.mjs";

export default {
  ...base,
  name: "Order Item Updated",
  description: "Emit new order items as they are updated (polling). [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/orderitems#get-all-order-items)",
  key: "mews-order-item-updated",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getRequester() {
      return this.app.orderItemsGetAll;
    },
    getResultKey() {
      return "OrderItems";
    },
    getResourceName() {
      return "Order Item";
    },
    getId(resource) {
      return resource?.Id || resource?.id;
    },
    getDateField() {
      return "UpdatedUtc";
    },
    getDateFilterField() {
      return "UpdatedUtc";
    },
  },
};

