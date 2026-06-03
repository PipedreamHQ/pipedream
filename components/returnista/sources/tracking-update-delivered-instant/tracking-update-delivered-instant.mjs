import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";
import { createHash } from "crypto";

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
      const deliveredUpdate = data.trackingUpdates?.find((update) => update.status === "Delivered");
      const ts = Date.parse(deliveredUpdate?.happenedAt || deliveredUpdate?.createdAt || data.happenedAt || data.createdAt || data.updatedAt);
      const rawId = `${data.id}-${ts}`;
      const id = rawId.length <= 64
        ? rawId
        : createHash("sha256").update(rawId).digest("hex").slice(0, 64);
      return {
        id,
        summary: `Tracking Update Delivered: ${data.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
