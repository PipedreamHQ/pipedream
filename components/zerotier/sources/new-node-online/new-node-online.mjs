import common from "../common/common.mjs";

export default {
  ...common,
  key: "zerotier-new-node-online",
  name: "New Node Online",
  description: "Emit new event for each online node. [See docs here](https://docs.zerotier.com/central/v1/#operation/getNetworkMemberList)",
  type: "source",
  dedupe: "unique",
  version: "0.0.1",
  async run({ $ }) {
    const nodes = await this.zerotier.getNetworkNodes({
      networkId: this.networkId,
      $,
    });

    for (const node of nodes) {
      console.log(nodes);
      if (node.online) {
        this.$emit(node, {
          id: `${node.networkId} - ${node.nodeId} - ${node.lastOnline} - online`,
          summary: `Node ${node.nodeId} is online`,
          ts: Date.now(),
        });
      }
    }
  },
};
