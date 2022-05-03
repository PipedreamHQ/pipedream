import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-get-network",
  type: "action",
  version: "0.0.2",
  name: "Get Network",
  description: "Get a specific network. Returns a single network.",
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

    $.export("summary", "Sucessfully retrieved network");

    return response;
  },
};
