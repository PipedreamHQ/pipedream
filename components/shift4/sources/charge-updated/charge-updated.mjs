import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "shift4-charge-updated",
  name: "New Charge Updated",
  description: "Emit new event when a charge object is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFilterTypes() {
      return [
        "CHARGE_SUCCEEDED",
        "CHARGE_FAILED",
        "CHARGE_UPDATED",
        "CHARGE_CAPTURED",
        "CHARGE_REFUNDED",
        "CHARGE_DISPUTE_CREATED",
        "CHARGE_DISPUTE_UPDATED",
        "CHARGE_DISPUTE_WON",
        "CHARGE_DISPUTE_LOST",
        "CHARGE_DISPUTE_FUNDS_WITHDRAWN",
        "CHARGE_DISPUTE_FUNDS_RESTORED",
      ];
    },
    getSummary(item) {
      return `New charge updated event with Id: ${item.id}`;
    },
  },
  sampleEmit,
};
