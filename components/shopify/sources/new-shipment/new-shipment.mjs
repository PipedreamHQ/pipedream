import shopify from "../../shopify.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "shopify-new-shipment",
  name: "New Shipment",
  type: "source",
  description: "Emit new event for each new fulfillment event for a store.",
  version: "0.0.9",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    shopify,
  },
  methods: {
    emitShipments(results) {
      for (const order of results) {
        if (order.fulfillments && order.fulfillments.length > 0) {
          for (const shipment of order.fulfillments) {
            this.$emit(shipment, {
              id: shipment.id,
              summary: `Fulfillment ${shipment.name}`,
              ts: Date.now(),
            });
          }
        }
      }
    },
  },
  async run() {
    this.emitShipments(
      await this.shopify.getOrders("shipped"),
    );
    this.emitShipments(
      await this.shopify.getOrders("partial"),
    );
  },
};
