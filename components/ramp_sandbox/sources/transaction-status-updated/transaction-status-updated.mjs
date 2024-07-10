import common from "../common/base.mjs";
import transactionStatusUpdated from "../../../ramp/sources/transaction-status-updated/transaction-status-updated.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ramp_sandbox-transaction-status-updated",
  name: "Transaction Status Updated",
  description: "Emit new event when there is a change in transaction status.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    departmentId: {
      propDefinition: [
        common.props.ramp,
        "departmentId",
      ],
    },
    locationId: {
      propDefinition: [
        common.props.ramp,
        "locationId",
      ],
    },
  },
  methods: {
    ...common.methods,
    ...transactionStatusUpdated.methods,
  },
  sampleEmit,
};
