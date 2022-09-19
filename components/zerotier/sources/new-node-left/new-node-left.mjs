import common from "../common/common.mjs";

export default {
  ...common,
  key: "zerotier-new-node-left",
  name: "New Node Left",
  description:
    "Emit new event when a node left a network. [See docs here](https://docs.zerotier.com/central/v1/#operation/getNetworkMemberList)",
  type: "source",
  dedupe: "unique",
  version: "0.0.4",
  methods: {
    _setNodes(nodes) {
      return this.db.set("nodes", nodes);
    },
    _getNodes() {
      return this.db.get("nodes") ?? [];
    },
  },
  async run() {
    const nodes = await this.zerotier.getNetworkNodes({
      networkId: this.networkId,
    });

    const storedNodes = this._getNodes();

    const nodesIds = nodes.map((node) => node.nodeId);

    for (const storedNode of storedNodes) {
      if (!nodesIds.includes(storedNode.nodeId)) {
        this.$emit(storedNode, {
          id: `${storedNode.networkId} - ${storedNode.nodeId}`,
          summary: `Node ${storedNode.nodeId} left the network ${storedNode.networkId}`,
          ts: Date.now(),
        });
      }
    }

    this._setNodes(nodes);
  },
};
