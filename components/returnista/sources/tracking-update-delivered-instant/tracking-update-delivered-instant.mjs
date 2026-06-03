import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "returnista-tracking-update-delivered-instant",
  name: "Tracking Update Delivered (Instant)",
  description: "Emit new event when a tracking update is received and the shipment status changes to delivered. [See the documentation](https://platform.returnista.com/reference/webhooks/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "shipment.received_tracking_updates.delivered";
    },
    generateMeta({ data }) {
      const ts = Date.parse(data.updatedAt);
      return {
        id: `${data.id}-${ts}`,
        summary: `Tracking Update Delivered: ${data.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
