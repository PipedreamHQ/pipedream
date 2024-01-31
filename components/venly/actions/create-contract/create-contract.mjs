import venly from "../../venly.app.mjs";

export default {
  key: "venly-create-contract",
  name: "Create Contract",
  description: "Deploys a new NFT contract, or collection, on a specific blockchain. [See the documentation](https://docs.venly.io/reference/deploycontract)",
  version: "0.0.1",
  type: "action",
  props: {
    venly,
    blockchainType: {
      propDefinition: [
        venly,
        "blockchainType",
      ],
    },
    contractMetadata: {
      propDefinition: [
        venly,
        "contractMetadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.venly.deployContract({
      $,
      data: {
        blockchainType: this.blockchainType,
        contractMetadata: this.contractMetadata,
      },
    });

    $.export("$summary", `Successfully deployed contract with ID ${response.id} on ${this.blockchainType}`);
    return response;
  },
};
