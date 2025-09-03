import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trunkrs-shipment-reviewed",
  name: "Shipment Reviewed (Instant)",
  description: "Emit new event when a shipment is reviewed. [See the documentation](https://docs.trunkrs.nl/docs/v2-api-documentation/05ac4fa1b9ade-create-webhook-subscription)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEvent() {
      return "onReview";
    },
  },
  sampleEmit,
};
