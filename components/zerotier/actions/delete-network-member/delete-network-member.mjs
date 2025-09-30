import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-delete-network-member",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Delete Network Member",
  description: "Delete a specific member (node) in a network. [See docs here](https://docs.zerotier.com/central/v1/#operation/deleteNetworkMember)",
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
    const response = await this.zerotier.deleteNetworkMember({
      networkId: this.networkId,
      nodeId: this.nodeId,
      $,
    });

    $.export("$summary", `Successfully deleted member "${this.nodeId}" from network "${this.networkId}"`);

    return response;
  },
};
