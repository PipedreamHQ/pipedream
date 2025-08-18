import base from "../common/polling.mjs";

export default {
  ...base,
  name: "Order Item Created",
  description: "Emit new order items as they are created (polling)",
  key: "mews-order-item-created",
  version: "0.0.1",
  type: "source",
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
      return "CreatedUtc";
    },
    getDateFilterField() {
      return "CreatedUtc";
    },
  },
};

