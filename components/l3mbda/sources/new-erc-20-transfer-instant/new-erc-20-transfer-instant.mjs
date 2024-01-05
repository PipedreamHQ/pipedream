import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "l3mbda-new-erc-20-transfer-instant",
  name: "New ERC20 Transfer (Instant)",
  description: "Emit new event when a new ERC20 transfer is detected by [l3mbda.](https://l3mbda.com/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    token: {
      propDefinition: [
        common.props.app,
        "token",
      ],
    },
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
      return events.ERC20_TRANSFER;
    },
    getFilters() {
      const {
        token,
        amount,
      } = this;
      const filters = common.methods.getFilters.call(this);

      if (token) {
        filters.push({
          type: "token",
          value: token,
        });
      }

      if (amount) {
        filters.push({
          type: "amount",
          value: amount,
        });
      }

      return filters;
    },
    getSummary({ logIndex }) {
      return `New ERC20 Transfer: ${logIndex}`;
    },
  },
  sampleEmit,
};
