import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-create-network",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create A Network",
  description:
    "Create a new network on your ZeroTier account. [See docs here](https://docs.zerotier.com/central/v1/#operation/newNetwork)",
  props: {
    zerotier,
    networkName: {
      propDefinition: [
        zerotier,
        "networkName",
      ],
    },
    privateNetwork: {
      propDefinition: [
        zerotier,
        "privateNetwork",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zerotier.createNetwork({
      data: {
        config: {
          name: this.networkName,
          private: this.privateNetwork,
        },
      },
      $,
    });

    $.export("$summary", `Sucessfully created new network: ${this.networkName}`);

    return response;
  },
};
