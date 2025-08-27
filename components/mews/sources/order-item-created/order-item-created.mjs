import base from "../common/polling.mjs";

export default {
  ...base,
  name: "New Order Item Created",
  description: "Emit new order items as they are created (polling). [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/orderitems#get-all-order-items)",
  key: "mews-order-item-created",
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
      return "CreatedUtc";
    },
    getDateFilterField() {
      return "CreatedUtc";
    },
  },
};

