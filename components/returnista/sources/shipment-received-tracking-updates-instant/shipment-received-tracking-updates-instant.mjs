import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "returnista-shipment-received-tracking-updates-instant",
  name: "Shipment Received Tracking Updates (Instant)",
  description: "Emit new event when a shipment receives tracking updates. [See the documentation](https://platform.returnista.com/reference/rest-api/#post-/account/-accountId/webhook-subscription)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "shipment.received_tracking_updates";
    },
    generateMeta({ data }) {
      const ts = Date.parse(data.updatedAt);
      return {
        id: `${data.id}-${ts}`,
        summary: `Shipment Received Tracking Updates: ${data.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
