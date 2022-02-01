import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-new-shipment",
  name: "New Shipment",
  type: "source",
  description: "Emit new an event for each new fulfillment event for a store.",
  version: "0.0.4",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    shopify,
  },
  methods: {
    emitShipments(shipments, results) {
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
      return shipments;
    },
  },
  async run() {
    let shipments = [];
    let results = await this.shopify.getOrders("shipped");
    shipments = this.emitShipments(shipments, results);
    results = await this.shopify.getOrders("partial");
    shipments = this.emitShipments(shipments, results);
  },
};
