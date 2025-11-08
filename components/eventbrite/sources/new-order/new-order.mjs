import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "eventbrite-new-order",
  name: "New Order (Instant)",
  description: "Emit new event when an order has been placed",
  version: "0.0.6",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getActions() {
      return "order.placed";
    },
    async getData(order) {
      const { event_id: eventId } = order;
      const event = await this.eventbrite.getEvent(null, eventId);
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
