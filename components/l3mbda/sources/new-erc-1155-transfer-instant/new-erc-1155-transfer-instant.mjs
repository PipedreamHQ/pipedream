import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "l3mbda-new-erc-1155-transfer-instant",
  name: "New ERC1155 NFT Transfer (Instant)",
  description: "Emit new event when a new ERC1155 NFT transfer is detected by [l3mbda.](https://l3mbda.com/)",
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
  },
  methods: {
    ...common.methods,
    getEvent() {
      return events.ERC1155_TRANSFER;
    },
    getFilters() {
      const { token } = this;
      const filters = common.methods.getFilters.call(this);

      if (token) {
        filters.push({
          type: "token",
          value: token,
        });
      }

      return filters;
    },
    getSummary({ logIndex }) {
      return `New ERC1155 Transfer: ${logIndex}`;
    },
  },
  sampleEmit,
};
