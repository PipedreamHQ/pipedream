import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "aftership-shipment-status-updated",
  name: "Shipment Status Updated",
  description: "Emit new event when a shipment tracking status is updated. [See the documentation](https://www.aftership.com/docs/shipping/webhook/webhook-overview)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "tracking_update";
    },
    generateMeta(resource) {
      const {
        event_id: eventId,
        msg: tracking,
      } = resource;

      return {
        id: eventId || tracking.id,
        summary: `Tracking Updated: ${tracking.tracking_number || tracking.title}`,
        ts: Date.parse(tracking.updated_at) || Date.now(),
      };
    },
  },
};
