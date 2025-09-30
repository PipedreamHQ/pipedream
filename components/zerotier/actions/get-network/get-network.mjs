import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-get-network",
  type: "action",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get Network",
  description: "Get a specific network. Returns a single network. [See docs here](https://docs.zerotier.com/central/v1/#operation/getNetworkByID)",
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
    const response = await this.zerotier.getNetwork({
      networkId: this.networkId,
      $,
    });

    $.export("$summary", "Sucessfully retrieved network");

    return response;
  },
};
