import app from "../../owl_protocol.app.mjs";

export default {
  key: "owl_protocol-mint-asset",
  name: "Mint Asset",
  description: "Mint digital assets for collection. [See the documentation](https://docs-api.owlprotocol.xyz/reference/collection-erc721autoid-mint)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    chainId: {
      propDefinition: [
        app,
        "chainId",
      ],
    },
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
    mintTo: {
      propDefinition: [
        app,
        "mintTo",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.mintAsset({
      $,
      chainId: this.chainId,
      address: this.address,
      data: {
        to: this.mintTo,
      },
    });

    $.export("$summary", `Successfully minted asset to '${this.mintTo}'`);

    return response;
  },
};
