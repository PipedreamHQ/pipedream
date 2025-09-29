import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trunkrs-new-shipment-created",
  name: "New Shipment Created (Instant)",
  description: "Emit new event when a new shipment is created. [See the documentation](https://docs.trunkrs.nl/docs/v2-api-documentation/05ac4fa1b9ade-create-webhook-subscription)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEvent() {
      return "onCreation";
    },
  },
  sampleEmit,
};
