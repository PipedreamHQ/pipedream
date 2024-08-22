import app from "../../owl_protocol.app.mjs";

export default {
  key: "owl_protocol-deploy-collection",
  name: "Deploy Collection",
  description: "Deploy digital asset collection. [See the documentation](https://docs-api.owlprotocol.xyz/reference/collection-deploy)",
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
    collectionName: {
      propDefinition: [
        app,
        "collectionName",
      ],
    },
    symbol: {
      propDefinition: [
        app,
        "symbol",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },

  },
  async run({ $ }) {
    const response = await this.app.deployCollection({
      $,
      data: {
        chainId: this.chainId,
        name: this.collectionName,
        symbol: this.symbol,
        description: this.description,
      },
    });

    $.export("$summary", `Successfully deployed the collection '${this.collectionName}' with the contract Address: '${response.contractAddress}'`);

    return response;
  },
};
