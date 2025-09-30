import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-authorize-network-member",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Authorize Network Member",
  description:
    "Authorize a specific member (node) in a network. [See docs here](https://docs.zerotier.com/central/v1/#operation/updateNetworkMember)",
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
    const response = await this.zerotier.updateNetworkMember({
      networkId: this.networkId,
      nodeId: this.nodeId,
      data: {
        config: {
          authorized: true,
        },
      },
      $,
    });

    $.export("$summary", `Successfully authorized member "${this.nodeId}" in network "${this.networkId}"`);

    return response;
  },
};
