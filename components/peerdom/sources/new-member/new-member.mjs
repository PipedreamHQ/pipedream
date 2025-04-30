import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "peerdom-new-member",
  name: "New Member Added",
  description: "Emit new event when a new member is added to a group. [See the documentation](https://api.peerdom.org/v1/docs#tag/Peers/operation/getPeers)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.peerdom.listPeers;
    },
    getSummary(item) {
      return `New Member: ${item.firstName} ${item.lastName || ""}`;
    },
  },
  sampleEmit,
};
