import common from "../common/common.mjs";

export default {
  ...common,
  key: "zerotier-new-node-online",
  name: "New Node Online",
  description:
    "Emit new event for each online node. [See docs here](https://docs.zerotier.com/central/v1/#operation/getNetworkMemberList)",
  type: "source",
  dedupe: "unique",
  version: "0.0.5",
  methods: {
    ...common.methods,
    getRightStatus() {
      return true;
    },
  },
};
