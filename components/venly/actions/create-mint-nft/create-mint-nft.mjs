import venly from "../../venly.app.mjs";

export default {
  key: "venly-create-mint-nft",
  name: "Create and Mint NFT",
  description: "Creates a template or token type that allows for minting of new NFTs. [See the documentation](https://docs.venly.io/reference/definetokentype_1_1)",
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
      optional: true,
    },
    nftMetadata: {
      propDefinition: [
        venly,
        "nftMetadata",
      ],
    },
    mintingRestrictions: {
      propDefinition: [
        venly,
        "mintingRestrictions",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    let contractId;
    // Deploy contract if contractMetadata is provided
    if (this.contractMetadata) {
      const deployResponse = await this.venly.deployContract({
        blockchainType: this.blockchainType,
        contractMetadata: this.contractMetadata,
      });

      if (!deployResponse || !deployResponse.contractId) {
        throw new Error("Failed to deploy contract");
      }

      contractId = deployResponse.contractId;
    }

    // Create token type
    const createTokenResponse = await this.venly.createTokenType({
      contractId,
      nftMetadata: this.nftMetadata,
      mintingRestrictions: this.mintingRestrictions,
    });

    if (!createTokenResponse || !createTokenResponse.id) {
      throw new Error("Failed to create token type");
    }

    $.export("$summary", `Successfully created and prepared for minting NFT with Token Type ID: ${createTokenResponse.id}`);

    return createTokenResponse;
  },
};
