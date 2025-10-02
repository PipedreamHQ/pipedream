import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-get-network-nodes",
  type: "action",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get Network Nodes",
  description: "Get the nodes of a specific network. Returns a list of members (nodes) on the network. [See docs here](https://docs.zerotier.com/central/v1/#operation/getNetworkMemberList)",
  props: {
    zerotier,
    networkId: {
      propDefinition: [
        zerotier,
        "networkId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zerotier.getNetworkNodes({
      networkId: this.networkId,
      $,
    });

    $.export("$summary", "Sucessfully retrieved nodes");

    return response;
  },
};
