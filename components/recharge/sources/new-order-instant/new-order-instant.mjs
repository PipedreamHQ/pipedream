import recharge from "../../recharge.app.mjs";

export default {
  key: "recharge-new-order-instant",
  name: "New Order Instant",
  description: "Emits an event for each new order placed. [See the documentation]()",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    recharge,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    orderId: {
      propDefinition: [
        recharge,
        "orderId",
      ],
    },
    customerId: {
      propDefinition: [
        recharge,
        "customerId",
      ],
    },
    productId: {
      propDefinition: [
        recharge,
        "productId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Set initial sinceId to 0 on deploy
      this.db.set("sinceId", 0);
    },
  },
  methods: {
    ...recharge.methods,
  },
  async run() {
    const sinceId = this.db.get("sinceId") || 0;
    // Fetch orders based on the provided criteria
    // Assuming there's a method in the recharge app file to fetch orders
    const response = await this.recharge._makeRequest({
      path: "/orders",
      params: {
        since_id: sinceId,
        customer_id: this.customerId,
        product_id: this.productId,
      },
    });

    if (response.orders && response.orders.length) {
      // Sort orders by ID to ensure we process them in the order they were created
      const sortedOrders = response.orders.sort((a, b) => a.id - b.id);

      for (const order of sortedOrders) {
        this.$emit(order, {
          id: order.id,
          summary: `Order ${order.order_number} placed`,
          ts: Date.parse(order.created_at),
        });
      }

      // Update sinceId to the ID of the last order processed
      this.db.set("sinceId", sortedOrders[sortedOrders.length - 1].id);
    }
  },
};
