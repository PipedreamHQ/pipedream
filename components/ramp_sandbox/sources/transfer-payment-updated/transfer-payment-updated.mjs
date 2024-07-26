import common from "../common/base.mjs";
import transferPaymentUpdated from "../../../ramp/sources/transfer-payment-updated/transfer-payment-updated.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ramp_sandbox-transfer-payment-updated",
  name: "Transfer Payment Updated",
  description: "Emit new event when the status of a transfer payment changes",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    transferStatus: {
      propDefinition: [
        common.props.ramp,
        "transferStatus",
      ],
    },
  },
  methods: {
    ...common.methods,
    ...transferPaymentUpdated.methods,
  },
  sampleEmit,
};
