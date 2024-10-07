import allocadence from "../../allocadence.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "allocadence-new-customer-order",
  name: "New Customer Order Created",
  description: "Emit new event when a new customer order is created. [See the documentation](https://docs.allocadence.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    allocadence,
    db: "$.service.db",
    customerId: {
      propDefinition: [
        allocadence,
        "customerId",
      ],
    },
    productId: {
      propDefinition: [
        allocadence,
        "productId",
      ],
    },
    orderDetails: {
      propDefinition: [
        allocadence,
        "orderDetails",
      ],
      optional: true,
    },
    deliveryMode: {
      propDefinition: [
        allocadence,
        "deliveryMode",
      ],
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastOrderCreatedTime() {
      return this.db.get("lastOrderCreatedTime") || 0;
    },
    _setLastOrderCreatedTime(time) {
      this.db.set("lastOrderCreatedTime", time);
    },
    async _getNewCustomerOrders() {
      const lastOrderCreatedTime = this._getLastOrderCreatedTime();
      const orders = await this.allocadence.createCustomerOrder({
        customerInformation: this.customerId,
        productDetails: this.productId,
        specialInstructions: this.orderDetails,
        deliveryMode: this.deliveryMode,
      });

      const newOrders = orders.filter((order) => new Date(order.createdDate).getTime() > lastOrderCreatedTime);
      return newOrders;
    },
  },
  hooks: {
    async deploy() {
      const newOrders = await this._getNewCustomerOrders();

      for (const order of newOrders.slice(-50)) {
        this.$emit(order, {
          id: order.id,
          summary: `New Customer Order: ${order.orderNumber}`,
          ts: new Date(order.createdDate).getTime(),
        });
      }

      if (newOrders.length) {
        const latestOrderDate = newOrders[newOrders.length - 1].createdDate;
        this._setLastOrderCreatedTime(new Date(latestOrderDate).getTime());
      }
    },
    async activate() {
      const orders = await this._getNewCustomerOrders();
      if (orders.length) {
        const latestOrderDate = orders[orders.length - 1].createdDate;
        this._setLastOrderCreatedTime(new Date(latestOrderDate).getTime());
      }
    },
    async deactivate() {
      this.db.set("lastOrderCreatedTime", null);
    },
  },
  async run() {
    const newOrders = await this._getNewCustomerOrders();

    for (const order of newOrders) {
      this.$emit(order, {
        id: order.id,
        summary: `New Customer Order: ${order.orderNumber}`,
        ts: new Date(order.createdDate).getTime(),
      });
    }

    if (newOrders.length) {
      const latestOrderDate = newOrders[newOrders.length - 1].createdDate;
      this._setLastOrderCreatedTime(new Date(latestOrderDate).getTime());
    }
  },
};
