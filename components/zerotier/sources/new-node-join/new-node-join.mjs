import common from "../common/common.mjs";

export default {
  ...common,
  key: "zerotier-new-node-join",
  name: "New Node Join",
  description:
    "Emit new event when a node joins a network. [See docs here](https://docs.zerotier.com/central/v1/#operation/getNetworkMemberList)",
  type: "source",
  dedupe: "unique",
  version: "0.0.4",
  async run() {
    const nodes = await this.zerotier.getNetworkNodes({
      networkId: this.networkId,
    });

    for (const node of nodes) {
      this.$emit(node, {
        id: `${node.networkId} - ${node.nodeId}`,
        summary: `New node ${node.nodeId} joined in the network ${node.networkId}`,
        ts: Date.now(),
      });
    }
  },
};
