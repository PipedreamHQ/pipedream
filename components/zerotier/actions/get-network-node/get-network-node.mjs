import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-get-network-node",
  type: "action",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get Network Node",
  description: "Get a specific node of a specific network. Returns an individual member (node) on a network. [See docs here](https://docs.zerotier.com/central/v1/#operation/getNetworkMember)",
  props: {
    zerotier,
    networkId: {
      propDefinition: [
        zerotier,
        "networkId",
      ],
    },
    nodeId: {
      propDefinition: [
        zerotier,
        "nodeId",
        (c) => ({
          networkId: c.networkId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zerotier.getNetworkNode({
      networkId: this.networkId,
      nodeId: this.nodeId,
      $,
    });

    $.export("$summary", "Sucessfully retrieved node");

    return response;
  },
};
