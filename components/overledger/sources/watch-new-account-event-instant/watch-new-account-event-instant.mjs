import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "overledger-watch-new-account-event-instant",
  name: "New Account Event (Instant)",
  description: "Emit new event for transactions to/from a specific account.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    accountId: {
      type: "string",
      label: "Account Id",
      description: "The blockchain account that will be monitored for transaction updates.",
    },
  },
  methods: {
    getPath() {
      return "accounts";
    },
    additionalData() {
      return {
        accountId: this.accountId,
      };
    },
    getSummary(body) {
      return `New account event with transaction Id: ${body.transactionId}`;
    },
  },
  sampleEmit,
};
