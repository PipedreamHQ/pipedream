import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "l3mbda-new-native-transfer-instant",
  name: "New Native Transfer (Instant)",
  description: "Emit new event when a new native (ETH, POL) transfer is detected by [l3mbda.](https://l3mbda.com/)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    amount: {
      propDefinition: [
        common.props.app,
        "amount",
      ],
    },
  },
  methods: {
    ...common.methods,
    getEvent() {
      return events.NATIVE_TRANSFER;
    },
    getFilters() {
      const { amount } = this;
      const filters = common.methods.getFilters.call(this);

      if (amount) {
        filters.push({
          type: "amount",
          value: amount,
        });
      }

      return filters;
    },
    getSummary({ logIndex }) {
      return `New Native Transfer: ${logIndex}`;
    },
  },
  sampleEmit,
};
