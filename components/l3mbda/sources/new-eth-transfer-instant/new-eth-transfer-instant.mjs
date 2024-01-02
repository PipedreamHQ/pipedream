import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "l3mbda-new-eth-transfer-instant",
  name: "New ETH Transfer (Instant)",
  description: "Emit new event when a new ETH transfer is detected by [l3mbda.](https://l3mbda.com/)",
  version: "0.0.1",
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
      return events.ERC1155_TRANSFER;
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
      return `New ETH Transfer: ${logIndex}`;
    },
  },
  sampleEmit,
};
