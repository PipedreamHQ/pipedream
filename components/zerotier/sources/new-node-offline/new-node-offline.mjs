import common from "../common/common.mjs";

export default {
  ...common,
  key: "zerotier-new-node-offline",
  name: "New Node Offline",
  description: "Emit new event for each offline node. [See docs here](https://docs.zerotier.com/central/v1/#operation/getNetworkMemberList)",
  type: "source",
  dedupe: "unique",
  version: "0.0.2",
  async run({ $ }) {
    const nodes = await this.zerotier.getNetworkNodes({
      networkId: this.networkId,
      $,
    });

    for (const node of nodes) {
      if (!node.online) {
        this.$emit(node, {
          id: `${node.networkId} - ${node.nodeId} - ${node.lastOnline} - offline`,
          summary: `Node ${node.nodeId} is offline`,
          ts: Date.now(),
        });
      }
    }
  },
};
