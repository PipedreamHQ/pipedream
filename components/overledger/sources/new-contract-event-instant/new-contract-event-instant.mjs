import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "overledger-new-contract-event-instant",
  name: "New Smart Contract Event (Instant)",
  description: "Emit new event when a smart contract releases a new event.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    smartContractId: {
      propDefinition: [
        common.props.overledger,
        "smartContractId",
      ],
    },
  },
  methods: {
    getPath() {
      return "smart-contract-events";
    },
    additionalData() {
      return {
        smartContractId: this.smartContractId,
      };
    },
    getSummary(body) {
      return `New contract event with transaction Hash: ${body?.smartContractEventUpdateDetails?.nativeData?.transactionHash}`;
    },
  },
  sampleEmit,
};
