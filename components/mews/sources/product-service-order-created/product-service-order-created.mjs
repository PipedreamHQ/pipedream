import base from "../common/polling.mjs";

export default {
  ...base,
  name: "Product Service Order Created",
  description: "Emit new product service orders as they are created (polling)",
  key: "mews-product-service-order-created",
  version: "0.0.1",
  type: "source",
  methods: {
    ...base.methods,
    getRequester() {
      return this.app.productServiceOrdersGetAll;
    },
    getResultKey() {
      return "ProductServiceOrders";
    },
    getResourceName() {
      return "Product Service Order";
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

