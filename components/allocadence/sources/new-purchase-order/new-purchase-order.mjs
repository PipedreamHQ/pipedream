import { axios } from "@pipedream/platform";
import allocadence from "../../allocadence.app.mjs";

export default {
  key: "allocadence-new-purchase-order",
  name: "New Purchase Order Created",
  description: "Emit new event when a new purchase order is created. [See the documentation](https://docs.allocadence.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    allocadence,
    db: "$.service.db",
    supplierId: {
      propDefinition: [
        allocadence,
        "supplierId",
      ],
    },
    productId: {
      propDefinition: [
        allocadence,
        "productId",
      ],
    },
    quantity: {
      propDefinition: [
        allocadence,
        "quantity",
      ],
      optional: true,
    },
    deliveryDate: {
      propDefinition: [
        allocadence,
        "deliveryDate",
      ],
      optional: true,
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
    async fetchNewPurchaseOrders(since) {
      return this.allocadence._makeRequest({
        path: "/purchase-orders",
        params: {
          since: since,
        },
      });
    },
    async createPurchaseOrder() {
      return this.allocadence.createPurchaseOrder({
        supplierId: this.supplierId,
        productId: this.productId,
        quantity: this.quantity,
        deliveryDate: this.deliveryDate,
      });
    },
  },
  hooks: {
    async deploy() {
      const lastTimestamp = this._getLastTimestamp();
      const newOrders = await this.fetchNewPurchaseOrders(lastTimestamp);

      newOrders.slice(0, 50).forEach((order) => {
        this.$emit(order, {
          id: order.id,
          summary: `New Purchase Order: ${order.orderNumber}`,
          ts: new Date(order.createdDate).getTime(),
        });
      });

      if (newOrders.length > 0) {
        this._setLastTimestamp(new Date(newOrders[0].createdDate).getTime());
      }
    },
    async activate() {
      // Code to create webhook or other setup tasks
    },
    async deactivate() {
      // Code to remove webhook or other cleanup tasks
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const newOrders = await this.fetchNewPurchaseOrders(lastTimestamp);

    newOrders.forEach((order) => {
      this.$emit(order, {
        id: order.id,
        summary: `New Purchase Order: ${order.orderNumber}`,
        ts: new Date(order.createdDate).getTime(),
      });
    });

    if (newOrders.length > 0) {
      this._setLastTimestamp(new Date(newOrders[0].createdDate).getTime());
    }
  },
};
