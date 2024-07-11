import common from "../common/base.mjs";
import newTransactionCreated from "../../../ramp/sources/new-transaction-created/new-transaction-created.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ramp_sandbox-new-transaction-created",
  name: "New Transaction Created",
  description: "Emit new event for each new transaction created in Ramp.",
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
    ...newTransactionCreated.methods,
  },
  sampleEmit,
};
