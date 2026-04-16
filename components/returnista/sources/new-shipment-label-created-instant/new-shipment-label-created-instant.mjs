import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "returnista-new-shipment-label-created-instant",
  name: "New Shipment Label Created (Instant)",
  description: "Emit new event when a new shipment label is created. [See the documentation](https://platform.returnista.com/reference/rest-api/#post-/account/-accountId/webhook-subscription)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "shipment.label_created";
    },
    generateMeta({ data }) {
      return {
        id: data.id,
        summary: `New Shipment Label Created: ${data.id}`,
        ts: Date.parse(data.createdAt),
      };
    },
  },
  sampleEmit,
};
