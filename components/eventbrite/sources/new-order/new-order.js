const common = require("../common/webhook.js");

module.exports = {
  ...common,
  key: "eventbrite-new-order",
  name: "New Order (Instant)",
  description: "Emits an event when an order has been placed",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getActions() {
      return "order.placed";
    },
    async getData(order) {
      const { event_id: eventId } = order;
      const event = await this.eventbrite.getEvent(eventId);
      return {
        order,
        event,
      };
    },
    generateMeta({ order }) {
      const {
        id, created,
      } = order;
      return {
        id,
        summary: `New Order ID: ${id}`,
        ts: Date.parse(created),
      };
    },
  },
};
