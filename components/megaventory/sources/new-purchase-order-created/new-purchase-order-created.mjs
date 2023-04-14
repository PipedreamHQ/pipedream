import common from "../common/polling.mjs";

export default {
  ...common,
  key: "megaventory-new-purchase-order-created",
  name: "New Purchase Order Created",
  description: "Emit new event when a new purchase order is created. [See the docs](https://api.megaventory.com/v2017a/documentation/index.html#!/PurchaseOrder/postPurchaseOrderPurchaseOrderGet_post_2).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "mvPurchaseOrders";
    },
    getResourceFn() {
      return this.app.listPurchaseOrders;
    },
    getCreatedAtFieldName() {
      return "PurchaseOrderCreationDate";
    },
    generateMeta(resource) {
      const {
        PurchaseOrderId: id,
        [this.getCreatedAtFieldName()]: createdAt,
      } = resource;
      return {
        id,
        summary: `New Purchase Order: ${id}`,
        ts: this.extractTimestamp(createdAt),
      };
    },
  },
};
