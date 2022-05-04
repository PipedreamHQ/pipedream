import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-get-networks",
  type: "action",
  version: "0.0.1",
  name: "Get Networks",
  description: "Get all networks. [See docs here](https://docs.zerotier.com/central/v1/#operation/getNetworkList)",
  props: {
    zerotier,
  },
  async run({ $ }) {
    const response = await this.zerotier.getNetworks({
      $,
    });

    $.export("summary", "Sucessfully retrieved networks");

    return response;
  },
};
