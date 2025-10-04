import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-get-networks",
  type: "action",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get Networks",
  description: "Get all networks. Returns a list of Networks you have access to. [See docs here](https://docs.zerotier.com/central/v1/#operation/getNetworkList)",
  props: {
    zerotier,
  },
  async run({ $ }) {
    const response = await this.zerotier.getNetworks({
      $,
    });

    $.export("$summary", "Sucessfully retrieved networks");

    return response;
  },
};
