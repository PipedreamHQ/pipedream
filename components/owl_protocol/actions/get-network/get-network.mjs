import app from "../../owl_protocol.app.mjs";

export default {
  key: "owl_protocol-get-network",
  name: "Get Network",
  description: "Get network details by the ID. [See the documentation](https://docs-api.owlprotocol.xyz/reference/network-get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    chainId: {
      propDefinition: [
        app,
        "chainId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getNetwork({
      $,
      chainId: this.chainId,
    });

    $.export("$summary", `Successfully retrieved data of Network: '${response.name}'`);

    return response;
  },
};
